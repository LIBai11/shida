"use strict";

/**
 * 登录验证
 * @author huangwei9527
 * @return {null} null
 */
module.exports = app => {
    return async function (ctx, next) {
        let {$helper,$service} = app;

        const isBinding = await $service.wxUser.getUsersByOpenId(ctx.request.body.uuid)
        if(!isBinding) {
            $helper.returnBody(false, {}, "该微信未绑定账号!", 401);
            return;
        }
        await next();
    };
};
