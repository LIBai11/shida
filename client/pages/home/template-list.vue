<template>
  <div class="clearfix my-page-list">
    <div class="page-search-wrapper bg-white">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handlePageModeClick">
        <el-tab-pane v-for="(item, index) in pageModeList" :key="index" :disabled="item.disabled" :name="item.value">
          <div slot="label">
            <span class="nav-tabs-label">{{ item.label }}</span>
          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label">
            <el-input v-model="searchId" placeholder="请输入模板ID"></el-input>
            <el-button type="info" @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="searchTempByID">搜索</el-button>
          </span>
        </el-tab-pane>
      </el-tabs>

    </div>
    <div class="scroll-wrapper page-list-wrapper">
      <el-scrollbar v-if="pageList.length" style="height: 100%;">
        <div v-loading="loading" class="page-content">
          <!--页面列表-->
          <div class="page-item-wrapper">
            <div v-for="(item, index) in pageList" :key="index" class="page-item">
              <thumbnailPanel
                  :btnList="['useTemplate']"
                  :pageData="item"
                  :showMoreBtn="false"
                  :showPublishState="false"
                  @refresh="getPageList"
                  @showPreview="showPreviewFn"
              />
            </div>
            <i></i><i></i><i></i><i></i><i></i>

          </div>
        </div>
      </el-scrollbar>
      <notFundData v-else/>
    </div>
    <!--预览-->
    <previewPage v-if="showPreview" :pageId="previewId" @closePreview="showPreview = false"></previewPage>
  </div>
</template>

<script>
import notFundData from '@client/components/notFundData';
import thumbnailPanel from '@/components/thumbnail-panel';
import previewPage from './components/preview-template';

export default {
  components: {
    notFundData,
    thumbnailPanel,
    previewPage
  },
  data() {
    return {
      loading: false,
      pageList: [],
      pageModeList: [],
      searchParams: {
        pageMode: "h5"
      },
      searchId: '',
      previewId: "",
      showPreview: false
    };
  },
  created() {
    this.pageModeList = this.$config.pageModeList;
    this.getPageList();
    console.log(this.searchParams.pageMode)
  },
  methods: {
    /**
     * 切换页面类型
     * */
    handlePageModeClick(val) {
      this.searchParams.pageMode = val.name;
      this.getPageList();
    },
    /**
     * 获取所有页面
     */
    getPageList() {
      const params = {
        pageMode: this.searchParams.pageMode,

      };
      if (this.searchId) {
        if (this.searchId.length !== 12) {
          this.$message.error('请输入12位ID')
          return;
        }
        params.id = this.searchId
      }
      this.$API.getPublishTemplates(params).then(res => {
        this.pageList = res.body || [];
      });
    },

    resetSearch() {
      this.searchId = '';
      this.getPageList();
    },
    showPreviewFn(id) {
      this.previewId = id;
      this.showPreview = true;
    },
    searchTempByID() {
      console.log(this.searchId)
    }
  }
};
</script>

<style lang="scss" scoped>
.my-page-list {
  height: 100%;
}

.page-list-wrapper {
  height: 100%;
}

.my-page-nav-list {
  height: 40px;
  line-height: 40px;
  z-index: 2;
  margin-bottom: 20px;

  .my-page-nav-item {
    float: left;
    padding-right: 32px;
    text-align: center;
    cursor: pointer;

    &.active {
      color: $primary;
    }

    &:hover {
      color: $primary;
    }
  }
}

.full-input-w {
  width: 100%;
}

.nav-tabs-label {
  display: inline-block;
  padding: 0 16px;
  height: 60px;
  line-height: 60px;
}

.page-search-wrapper {
  padding: 0;
}

.page-item-wrapper {
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-wrap: wrap;

  .page-item {
    //float: left;
    margin-right: 20px;
    margin-bottom: 40px;
  }
}

.page-item-wrapper > i {
  width: 200px;
  margin-right: 10px;
}
</style>

<style lang="scss">
.my-page-list {
  .page-search-wrapper {
    .el-tabs__header {
      margin: 0;
    }

    .el-tabs__nav-wrap {
      padding: 0 30px;
    }
  }
}
</style>
