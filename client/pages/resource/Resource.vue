<template>
  <div class="Resource">
    <el-upload
      action='#'
      class='avatar-uploader'
      :show-file-list='false'
      :on-success='handleSuccess'
      :before-upload='beforeUpload'
    >
      <el-button type="primary" icon="el-icon-upload2">上传</el-button>
    
    </el-upload>
   <div style="height:600px">
     <el-table :data="tableData">
       <el-table-column prop="type" label="类型" align="center">
         <template #default="scope">
           {{ typeMap[scope.row.type] }}
         </template>
       </el-table-column>
       <el-table-column prop="url" label="素材链接" align="center">
         <template #default="scope">
           <el-link type="primary">
             <a :href="scope.row.url" target="_blank">
               {{ scope.row.url }}
             </a>
           </el-link>
         </template>
       </el-table-column>
     </el-table>
   </div>
  </div>
</template>

<script>

export default {
  name: 'Resource',
  data() {
    return {
      tableData: [],
      getUrl() {
        if (/^(http||https||www)/gi.test(this.value)) return this.value;
        return document.location.origin + this.value;
      },
      typeMap: {
        image: '图片',
        video: '视频',
        audio: '音频',
        other: '其他',
      }
    };
  },
  computed: {
    imageUrl() {
      if (this.value.includes('static')) return this.value;
      return 'resource' + this.value.split('resource')[1];
    },
  },
  created() {
    this.getAllRes()
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code === 200) {
        this.$message({
          message: '上传成功',
          type: 'success',
        });
      }
    },
    beforeUpload(file) {
      const params = new FormData();
      params.append('file', file);
      const userData = JSON.parse(localStorage.getItem('user')).userInfo
      if (!userData) {
        this.$message({
          message: '请先登录',
          type: 'warning'
        });
        return false
      }
      params.append('id', userData._id)
      this.$API.uploadFileRes(params).then(res => {
        this.handleSuccess(res, file);
      });
      return false;
    },
    getAllRes() {
      const userData = JSON.parse(localStorage.getItem('user')).userInfo
      if (!userData) {
        this.$message({
          message: '请先登录',
          type: 'warning'
        });
        return false
      }
      const params = new FormData();
      params.append('id', userData._id)
      this.$API.getAllRes(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.body.map((v) => {
            const prefix = v.split('.').pop().toUpperCase()
            console.log(prefix)
            if (['JPG', 'PNG', 'GIF'].includes(prefix)) {
              return {type: 'image', url: v}
            } else if (['MP4', 'AVI', 'MOV'].includes(prefix)) {
              return {type: 'video', url: v}
            } else if (['MP3', 'WAV', 'WMA'].includes(prefix)) {
              return {type: 'audio', url: v}
            } else {
              return {type: 'other', url: v}
            }
          })
        }
      });
    }
  },
  
}
</script>

<style lang="less" scoped>

</style>