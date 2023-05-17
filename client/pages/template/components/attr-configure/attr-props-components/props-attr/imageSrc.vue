<template>
  <el-form-item label="图片：">
    <el-switch v-model="switched" active-text="素材库选择" inactive-text="自行上传"/>
    <fileUploader v-model="tempValue" @postPath='getPostPath' v-if="!switched"/>
    <el-select v-model="tempValue" v-else>
      
      <el-option
        v-for="item in tableData"
        v-if="item.type === 'image'"
        :key="item.url"
        :label="item.url"
        :value="item.url">
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import fileUploader from '@client/components/file-uploader';

export default {
  name: "attr-qk-imageSrc",
  props: {
    imageSrc: String
  },
  components: {
    fileUploader
  },
  data() {
    return {
      tempValue: "",
      postPath: "",
      switched: false,
      tableData: []
    };
  },
  mounted() {
    this.tempValue = this.imageSrc;
  },
  watch: {
    imageSrc(val) {
      this.tempValue = val;
    },
    tempValue() {
      this.$emit("update:imageSrc", this.tempValue);
    }
  },
  created() {
    this.getAllRes()
  },
  methods: {
    getPostPath(localPath) {
      this.postPath = localPath
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
            v = v.replace('http://localhost:4000', '')
            console.log(v)
            const prefix = v.split('.').pop().toUpperCase()
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
  }
};
</script>

<style scoped></style>
