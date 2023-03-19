const axios = require("axios");
const querystring = require('node:querystring');
const shortid = require("_js-shortid@0.1.1@js-shortid");
const lodash = require("lodash");
const {omit} = require("lodash");

module.exports = app => ({
        async getDetailVideo() {
            const {ctx, $service, $helper, $controller} = app;
            let {pageId, uuid} = ctx.request.query;
            try {
                const pageData = await $service.page.getPageDetail(pageId, true);
                const videoInfo = await $service.wxVideo.getVideoInfo(pageId, pageData.author)
                const userInfo = await $service.wxUser.getWxUserLikes(uuid)
                let isCurUserLiked = 0 //不喜欢
                if (userInfo.like && userInfo.like.length) {
                    const likes = userInfo.like
                    for (let i = 0; i < likes.length; i++) {
                        if (likes[i].videoId.toString() === pageId.toString()) {
                            isCurUserLiked = likes[i].isLiked
                            break
                        }
                    }
                }
                //查询用户头像
                $helper.returnBody(true, {
                    ...pageData, ...videoInfo,
                    commentCounts: videoInfo.coments?.length,
                    isCurUserLiked
                }, '获取成功')
            } catch (e) {
                $helper.returnBody(false, '', '获取失败', 500)
            }
        },
        async handleLikeAction() {
            const {ctx, $service, $helper} = app;
            let {userId, pageId} = ctx.request.body;
            try {
                //videoInfo 里的like加1,
                const pageData = await $service.page.getPageDetail(pageId, true);
                const res = await $service.wxVideo.like(userId, pageData)

                $helper.returnBody(true, res, '成功')
            } catch (e) {
                $helper.returnBody(false, '', '失败')
            }
            //userInfo 里的like加一个
        },
        async comment() {
            const {ctx, $service, $helper} = app;
            let {userId, pageId, content} = ctx.request.body;
            await $service.wxVideo.comment(userId, pageId, content)
            $helper.returnBody(true, '', '成功')

        },
        async getComment() {
            const {ctx, $service, $helper} = app;
            try {
                const {pageId, uuid} = ctx.request.body
                const comments = await $service.wxVideo.getVideoComments(pageId, uuid)
                $helper.returnBody(true, comments, '成功')
            } catch (e) {
                $helper.returnBody(true, '', '失败', 500)
            }
        },
        //获取首页视频
        async getRandomVideo() {
            const {ctx, $service, $helper} = app;
            let {uuid} = ctx.request.query;
            try {
                const pageDatas = await $service.page.getPageDetail();
                const pageData = pageDatas[0];
                const videoInfo = await $service.wxVideo.getVideoInfo(pageData._id, pageData.author)
                const userInfo = await $service.wxUser.getWxUserLikes(uuid)
                let isCurUserLiked = 0 //不喜欢
                if (userInfo.like && userInfo.like.length) {
                    const likes = userInfo.like
                    for (let i = 0; i < likes.length; i++) {
                        if (likes[i].videoId.toString() === pageData._id.toString()) {
                            isCurUserLiked = likes[i].isLiked
                            break
                        }
                    }
                }
                //查询用户头像
                $helper.returnBody(true, {
                    ...pageData, ...videoInfo,
                    commentCounts: videoInfo.coments?.length,
                    isCurUserLiked
                }, '获取成功')
            } catch (e) {
                $helper.returnBody(false, '', '获取失败', 500)
            }
        }
    }
)
