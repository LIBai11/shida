<template>
  <div class="Admin">
    <el-tabs v-model="activeName">
      <el-tab-pane label="模板" name="first">
        <div style="overflow: auto;height: 600px">
          <el-table
            :data="templates"
            style="width: 100%">
            <el-table-column
              label="作者"
              align="center"
              prop="author"/>
            <el-table-column
              align="center"
              label="描述" prop="description"/>
            <el-table-column
              align="center"
              label="是否公开模板" prop="isPublish">
              <template #default="scope">
                <el-switch v-model="scope.row.isPublish" @change="change(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="标题" prop="title">
              <template #default="scope">
                {{ scope.row.title }}
                <el-link @click="changeTitle(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="创建时间" prop="created">
              <template #default="scope">
                {{ dayjs(scope.row.created).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="更新时间" prop="updated">
              <template #default="scope">
                {{ dayjs(scope.row.updated).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="是否生成视频" prop="videoUrl">
              <template #default="scope">
                {{ scope.row.videoUrl ? '存在' : '未生成' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作品" name="second">
        <div style="overflow: scroll;height: 600px">
        <el-table
          :data="pages"
          style="width: 100%">
          <el-table-column
            align="center"
            label="作者" prop="author"/>
          <el-table-column
            align="center"
            label="描述" prop="description"/>
          <el-table-column
            align="center"
            label="是否公开" prop="isPublish">
            <template #default="scope">
              <el-switch v-model="scope.row.isPublish" @change="change(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="标题" prop="title">
            <template #default="scope">
              {{ scope.row.title }}
              <el-link @click="changeTitle(scope.row)">
                <i class="el-icon-edit"></i>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="创建时间" prop="created">
            <template #default="scope">
              {{ dayjs(scope.row.created).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="更新时间" prop="updated">
            <template #default="scope">
              {{ dayjs(scope.row.updated).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          
          </el-table-column>
          <el-table-column
            label="是否生成视频"
            prop="videoUrl"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.videoUrl ? '存在' : '未生成' }}
            </template>
          </el-table-column>
        </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="修改标题" :visible.sync="dialogVisible" @close="dialogVisible = false">
      <el-input v-model="title"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getWorks} from "@/api";
import dayjs from "dayjs";

export default {
  computed: {
    dayjs() {
      return dayjs
    }
  },
  data() {
    return {
      activeName: 'first',
      pages: [],
      templates: [],
      dialogVisible: false,
      title: '',
      tableData: null
    }
  },
  created() {
    this.$API.getWorks(this.searchParams).then((res) => {
      this.pages = res.body.pages
      this.templates = res.body.templates
    })
  },
  methods: {
    change(row) {
      this.$API.updatePage({pageData: row})
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    },
    changeTitle(row) {
      this.dialogVisible = true
      this.title = row.title
      this.tableData = row
    },
    submit() {
      const h = this.$createElement;
      this.dialogVisible = false
      this.tableData.title = this.title
      this.$API.updatePage({pageData: this.tableData})
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    }
  }
}
</script>

<style lang="less" scoped>

</style>