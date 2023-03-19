const axios = require("axios");
const querystring = require('node:querystring');
const shortid = require("_js-shortid@0.1.1@js-shortid");
const lodash = require("lodash");
const {omit} = require("lodash");

module.exports = app => ({
        /**
         * 检查是否绑定
         * @returns {Promise<void>}
         */
        async isBinding(openid) {
            const {ctx, $service, $helper, $config} = app;
            const bindingUser = await $service.wxUser.getUsersByOpenId(openid);
        },
        async loginInWx() {
            const {ctx, $service, $helper, $config} = app;
            const {code, session_key} = ctx.request.body
            const wxAPI = 'https://api.weixin.qq.com/sns/jscode2session'
            const params = querystring.stringify({
                appid: $config.wxAppid,
                secret: $config.wxAppSecret,
                js_code: code,
                grant_type: 'authorization_code'
            })
            const {data: res} = await axios.get(wxAPI + '?' + params)
            const {openid} = res
            if (openid) {
                //微信用户信息
                let userInOpenid = await $service.wxUser.checkOpenId(openid);
                //完整的用户信息
                let bindingUser = await $service.wxUser.getUsersByOpenId(openid);
                if (bindingUser) {
                    // const userInfo =
                    $helper.returnBody(true, {uuid: userInOpenid.uuid}, "未绑定账号,部分功能受限!");
                } else {
                    if (!userInOpenid) {
                        const uuid = shortid.gen() + new Date().valueOf();
                        userInOpenid = await $service.wxUser.creatUserByOpenId(openid, uuid, '微信用户' + shortid.gen());
                        return;
                    }
                    const userInfo = {
                        username: userInOpenid.username,
                        uuid: userInOpenid.uuid,
                        avatar: userInOpenid.avatar
                    }
                    $helper.returnBody(true, userInfo, "未绑定账号,部分功能受限!");
                    return;
                }
                let userInfo = await $service.wxUser.getWxUserInfo(userInOpenid.uuid)
                $helper.returnBody(true, userInfo, "登陆成功！");
            }
        },

        /**
         * 微信绑定账号
         * @returns {Promise<void>}
         */
        async binding() {
            const {$service, $helper, ctx, $controller} = app
            const {username, password, uuid} = ctx.request.body
            const {code, msg, user} = await $controller.auth.login(true, username, password)
            if ([101, 102].includes(code)) {
                $helper.returnBody(false, {updateCode: code}, msg)
            } else {
                const {
                    code: updateCode,
                    userData,
                    msg: updateMsg
                } = await $service.wxUser.updateUserOpenId(username, uuid, user._id)
                let newUserData = null
                if (userData) {
                    newUserData = omit(userData, ['openid', 'username', 'password', 'updated', '__v', 'created', '_id', 'comment', 'like'])
                }
                $helper.returnBody(true, {userData: newUserData, updateCode}, updateMsg)
            }
        },

        /**
         * 获取小程序设置的用户资料
         * @returns {Promise<void>}
         */
        async getWxUserInfo() {
            const {$service, $helper, ctx} = app
            const {uuid} = ctx.request.body
            const userInfo = await $service.wxUser.getWxUserInfo(uuid)
            //获取制作端账号的id
            const {_id} = await $service.wxUser.getUserByWxUuid(uuid)

            //通过id查视频
            const videoPages = await $service.wxUser.getWxUserH5Works('h5',_id)

            // const newUserInfo = omit(userInfo, [])
            if (userInfo) {
                $helper.returnBody(true, {userInfo, works: videoPages}, "用户信息获取成功")
            } else {
                $helper.returnBody(false, '', "用户信息获取失败")
            }
        },
        /**
         * 获取喜欢数量
         * @returns {Promise<void>}
         */
        async getWxUserLike() {
            const {$service, $helper, ctx, $controller} = app
            const data = ctx.request.body
            const {like} = await $service.wxUser.getWxUserLikes(data.uuid)
            const returnBody = {total: like.length, like}
            $helper.returnBody(true, returnBody, "success")
        }
    }
)
