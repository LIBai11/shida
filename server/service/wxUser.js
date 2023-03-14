const lodash = require("lodash");

let selectUserKey = {password: 0};
module.exports = app => ({

    /**
     * 查找openid是否绑定用户
     * @returns {Promise<void>}
     * @param openid
     */
    async getUsersByOpenId(openid) {
        const {$model, $helper} = app;
        if (openid.length === 0 || !openid) {
            return null;
        }
        const query = {openid: {$in: await $helper.createPassword(openid)}};
        return $model.user.findOne(query).exec();
    },

    /**
     * 验证是否存在该openid
     * @param openid
     * @returns {Promise<*|null>}
     */
    async checkOpenId(openid) {
        const {$model, $helper} = app;
        if (openid.length === 0 || !openid) {
            return null;
        }
        const query = {openid: {$in: await $helper.createPassword(openid)}};

        return $model.wxUser.findOne(query).exec();
    },

    /**
     * 根据openid新建游客
     * @param openid
     * @param uuid
     * @param username
     * @returns {Promise<*|null>}
     */
    async creatUserByOpenId(openid, uuid, username) {
        const {$model, $helper} = app;
        if (openid.length === 0 || !openid) {
            return null;
        }
        await $model.wxUser.create({
            openid: await $helper.createPassword(openid),
            uuid,
            username
        });
        return this.getUsersByOpenId(openid);
    },

    /**
     * 更新用户的openid(微信绑定)
     * @returns {Promise<*>}
     * @param username
     * @param uuid
     * @param _id 账号的id
     */
    async updateUserOpenId(username, uuid, _id) {
        const {ctx, $model} = app;
        //加密的openid
        const {openid} = await $model.wxUser.findOne({uuid}, selectUserKey)

        //检查是否绑定过
        const user = await $model.user.findOne({openid}, selectUserKey)
        if (user) return new Promise(resolve => {
            if (user._id.toString() === _id.toString()) {
                resolve({code: 104, userData: null, msg: '绑定失败,该账号已经和此微信绑定!'})
            } else {
                resolve({code: 106, userData: null, msg: '该账号已绑定其他微信!'})
            }
        })
        else {
            return new Promise(async resolve => {
                const info = {openid, wxUuid: uuid}
                const userData = await $model.user.findByIdAndUpdate(_id, {$set: info}, {lean: true, new: true})
                await $model.userInfo.create({...info, avatar: userData.avatar, name: userData.name})
                resolve({code: 105, userData, msg: '绑定成功!'})
            });
        }
    },

    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    async getWxUserInfo(uuid) {
        const {ctx, $model} = app;
        return await $model.userInfo.findOne({wxUuid: uuid}).select('-_id -created -updated -__v -like -comment -collects')
    },

    /**
     * 通过uuid获取用户
     * @param uuid
     * @returns {Promise<*>}
     */
    async getUserByWxUuid(uuid) {
        const {ctx, $model} = app;
        return await $model.user.findOne({wxUuid: uuid}).exec()
    },
    /**
     * 查询用户喜欢的数量
     * @returns {Promise<void>}
     * @param data
     */
    async getWxUserLikes(data) {
        const {ctx, $model} = app;
        return await $model.userInfo.findOne({wxUuid: data.uuid})
            .select('like')
            .select('-_id')
            // .skip(data.page * (data.limit || 10))
            // .limit(data.limit || 10)
            .exec();
    },
    /**
     * 获取获赞数量
     * @param uuid
     * @returns {Promise<void>}
     */
    async getWxUserPraisedCounts(uuid) {
        const {ctx, $model} = app;

    },
    /**
     * 获取用户的作品
     * @returns {Promise<void>}
     * @param pageMode
     * @param authorId
     */
    async getWxUserH5Works(pageMode,authorId) {
        const { ctx, $model } = app;
        let query = {author:authorId, pageMode: pageMode, isTemplate: { $ne: true } };
        return await $model.page
            .find(query)
            .select('_id title isPublish videoUrl')
            .sort({ created: -1 })
            .exec();
    },

});
