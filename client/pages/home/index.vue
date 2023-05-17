<template>
  <div class="page-home">
    <div class="home-side-bar">
      <el-menu default-active="/page-list" router>
        <el-menu-item index="/home/page-list">
          <i class="el-icon-mobile"></i>
          <span slot="title">我的作品</span>
        </el-menu-item>
        
        <el-menu-item index="/home/my-template">
          <i class="el-icon-document"></i>
          <span slot="title">我的模板</span>
        </el-menu-item>
        
        <el-menu-item index="/home/template-list">
          <i class="el-icon-s-shop"></i>
          <span slot="title">模板市场</span>
        </el-menu-item>
        <el-menu-item index="/home/resource">
          <i class="el-icon-s-goods"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/home/admin" v-if="isAdmin()">
          <i class="el-icon-user-solid"></i>
          <span slot="title">管理员设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="clearfix my-page-list">
      <router-view class="sub-page"/>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    isAdmin() {
      return JSON.parse(localStorage.getItem('user')).userInfo.email === '1714653636@qq.com'
    }
  }
};
</script>

<style lang="scss" scoped>
.page-home {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgb(240, 243, 244);
  
  .home-side-bar {
    width: 200px;
    background-color: #fff;
    border-right: 1px solid #e6ebed;
    padding-top: 8px;
    z-index: 2;
  }
  
  .my-page-list {
    flex: 1;
    height: 100%;
    
    .sub-page {
      height: 100%;
    }
  }
}
</style>
