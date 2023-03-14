const axios = require("axios");
const querystring = require('node:querystring');
const shortid = require("_js-shortid@0.1.1@js-shortid");
const lodash = require("lodash");
const {omit} = require("lodash");

module.exports = app => ({
        async getDetailVideo() {
            const {ctx, $service, $helper, $controller} = app;
            let {pageId} = ctx.request.query;
            try {
                const pageData = await $service.page.getPageDetail(pageId,true);
                const videoInfo = await $service.wxVideo.getVideoInfo(pageId, pageData.author)
                $helper.returnBody(true, {...pageData, ...videoInfo}, '获取成功')
            } catch (e) {
                $helper.returnBody(false, '', '获取失败')
            }
        }
    }
)
