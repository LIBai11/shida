const mongoose = require('mongoose');
const shortid = require("_js-shortid@0.1.1@js-shortid");
module.exports = app => ({
        async getVideoInfo(pageId, author) {
            const {$model} = app;
            const authorInfo = await $model.user.findOne({_id: author})
            // const userInfo = await $model.wxUser.findOne({wxUuid: pageId})
            const videoInfo = await $model.videoInfo.findOneAndUpdate(
                {videoId: pageId}, // 查询条件
                {videoId: pageId}, // 要更新或插入的文档数据
                {upsert: true, new: true, lean: true} // 选项：upsert 表示如果找不到文档，就创建新文档，new 表示返回更新后的文档
            ).select('-created -updated -_id -__v -videoId').lean()
            return {...videoInfo, authorName: authorInfo.name, avatar: authorInfo.avatar}
        },

        async like(userId, pageData) {
            const {$model} = app;

            //先获取userInfo的点赞数据, 看看是否存在. 存在的话看是否isLiked === 1, 直接取反修改
            const userInfo = await $model.userInfo.findOne({wxUuid: userId}).exec()
            const likeArr = userInfo.like
            let isExist = false
            let isLiked = false
            if (userInfo.like && likeArr.length) {
                for (let i = 0; i < likeArr.length; i++) {
                    const like = likeArr[i]

                    if (pageData._id.toString() === like.videoId.toString()) {
                        isExist = true
                        like.isLiked = like.isLiked ? 0 : 1
                        isLiked = Boolean(like.isLiked)
                        await $model.userInfo.updateOne(
                            {wxUuid: userId},
                            {$set: {[`like.${i}.isLiked`]: like.isLiked}});
                    }
                }
                if (!isExist) {
                    await $model.userInfo.updateOne(
                        {wxUuid: userId}, // 查询条件
                        {
                            $push: {
                                like: {
                                    videoUrl: pageData.videoUrl,
                                    isLiked: 1,//1是喜欢, 0是不喜欢, 只要存在就说明喜欢过
                                    videoImage: pageData.videoUrl.replace('mp4', 'jpg'),
                                    videoId: pageData._id
                                }
                            }
                        })
                    isLiked = true
                }
            } else {
                await $model.userInfo.updateOne(
                    {wxUuid: userId}, // 查询条件
                    {
                        $push: {
                            like: {
                                videoUrl: pageData.videoUrl,
                                isLiked: 1,//1是喜欢, 0是不喜欢, 只要存在就说明喜欢过
                                videoImage: pageData.videoUrl.replace('mp4', 'jpg'),
                                videoId: pageData._id
                            }

                        }
                    })
            }
            //isLiked修改后为1.就设置videoInfo的like+1, 否则-1
            if (isExist) {
                let res = 0
                res = await $model.videoInfo.findOneAndUpdate({videoId: pageData._id}, {$inc: {likeCounts: isLiked ? 1 : -1}}, {
                    new: true, lean: true
                }).select('likeCounts').exec()
                return {...res, status: isLiked}
            } else {
                return {likeCounts: 1, status: true}
            }
        },

        async comment(uuid, pageId, content) {
            const {$model} = app;
            const {comment} = await $model.videoInfo.findOne({videoId: pageId}).exec()
            const userInfo = await $model.userInfo.findOne({wxUuid: uuid}).exec()
            const user = await $model.user.findOne({wxUuid: uuid}).exec()
            const userComment = userInfo.comment
            let isExisted = false
            const id = shortid.gen() + new Date().valueOf();
            //videoInfo
            for (let i = 0; i < comment.length; i++) {
                if (comment[i].wxUuid.toString() === uuid.toString()) {
                    isExisted = true
                    await $model.videoInfo.updateOne({videoId: pageId}, {
                        $push: {
                            [`comment.${i}.comments`]: {
                                likeCounts: 0,
                                content,
                                comment_id: id,
                            }
                        }
                    })
                    break
                }
            }
            //userInfo
            if (isExisted) {
                for (let i = 0; i < userComment.length; i++) {
                    if ((userComment[i].videoId).toString() === pageId.toString()) { //以前评论过 , push操作
                        await $model.userInfo.updateOne({wxUuid: uuid}, {
                            $push: {
                                [`comment.${i}.comments`]: {
                                    likeCounts: 0,
                                    content,
                                    comment_id: id,

                                }
                            }
                        })
                        break;
                    }
                }
            }

            if (!isExisted) {
                //videoInfo
                await $model.videoInfo.updateOne({videoId: pageId}, {
                    $push: {
                        comment: {
                            wxUuid: uuid,
                            avatar: userInfo.avatar,
                            name: user.name,
                            comments: [
                                {
                                    likeCounts: 0,
                                    content,
                                    comment_id: id,
                                }
                            ]
                        }
                    }
                })

                //userInfo
                console.log(uuid)
                await $model.userInfo.updateOne({wxUuid: uuid}, {
                    $push: {
                        comment: {
                            videoId: pageId,
                            comments: [{
                                likeCounts: 0,
                                content,
                                comment_id: id,
                            }]
                        }
                    }
                })
            }
        },

        async getVideoComments(pageId, uuid) {
            const {$model} = app;
            let isCurUser = false
            return await $model.videoInfo.findOne({videoId: pageId}, {lean: true}).select('comment').exec()
            // for (let i = 0; i < comment.length; i++) {
            //     if (comment[i].wxUuid.toString() === uuid.toString()) {
            //         isCurUser = true
            //         break
            //     }
            // }
        }
    }
)
