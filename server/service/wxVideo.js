const querystring = require('node:querystring');
const shortid = require("_js-shortid@0.1.1@js-shortid");
const lodash = require("lodash");
const {omit} = require("lodash");

module.exports = app => ({
        async getVideoInfo(pageId, author) {
            const {$model} = app;
            const authorInfo = await $model.user.findOne({_id: author})
            const videoInfo = await $model.videoInfo.findOneAndUpdate(
                {videoId: pageId}, // 查询条件
                {videoId: pageId}, // 要更新或插入的文档数据
                {upsert: true, new: true, lean: true} // 选项：upsert 表示如果找不到文档，就创建新文档，new 表示返回更新后的文档
            ).select('-created -updated -_id -__v -videoId').lean()
            return {...videoInfo, authorName:authorInfo.name}
        }
    }
)
