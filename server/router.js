module.exports = app => {
  const {router, $controller, $middleware} = app;

  // 登录注册认证
  router.post("/quark/auth/login", $controller.auth.login);
  router.post("/quark/auth/register", $controller.auth.register);

  // 用户
  router.get("/quark/user/info", $middleware.auth, $controller.user.getUserInfo);
  router.post("/quark/user/update/name", $middleware.auth, $controller.user.updateUserName);
  router.post("/quark/user/update/pass", $middleware.auth, $controller.user.updateUserPass);
  router.post("/quark/user/update/avatar", $middleware.auth, $controller.user.updateUserAvatar);
  router.get("/quark/user/getUserList", $middleware.auth, $controller.user.getUserList);

  // 页面
  router.get("/quark/page/getMyPages", $middleware.auth, $controller.page.myPages);
  router.post("/quark/page/create", $middleware.auth, $controller.page.create);
  router.post("/quark/page/update", $middleware.auth, $controller.page.updatePage);
  router.post("/quark/page/delete", $middleware.auth, $controller.page.deletePage);
  router.post("/quark/page/copy", $middleware.auth, $controller.page.copyPage);
  router.post("/quark/page/setPublish", $middleware.auth, $controller.page.publish);
  router.post("/quark/page/setTemplate", $middleware.auth, $controller.page.setTemplate);
  router.get("/quark/page/detail", $middleware.auth, $controller.page.pageDetail);

  // 页面渲染
  router.get("/quark/view/:_id", $controller.page.view);

  // 页面协作
  router.get(
    "/quark/page/getCooperationList",
    $middleware.auth,
    $controller.cooperation.getCooperationUserListByPageId
  );
  router.post("/quark/page/addCooperation", $middleware.auth, $controller.cooperation.addCooperationUser);
  router.post("/quark/page/delCooperation", $middleware.auth, $controller.cooperation.removeCooperationUser);

  // 我的模板
  router.get("/quark/page/getMyTemplates", $middleware.auth, $controller.page.getMyTemplates);

  // 模板市场
  router.get("/quark/page/getPublishTemplates", $middleware.auth, $controller.page.getPublishTemplates);

  // html2canvas 跨域接口配置
  router.get("/quark/html2canvas/corsproxy", $controller.htmlToCanvas.corsproxy);

  // psd上传相关
  router.post("/quark/psd/upload", $middleware.auth, $controller.psd.psdPpload);

  // 我的图片库
  router.get("/quark/imageLib/myImages", $middleware.auth, $controller.image.getMyImages);
  router.post("/quark/imageLib/upload", $middleware.auth, $controller.image.uploadImage);

  // 上传文件
  router.post("/quark/file/upload", $middleware.auth, $controller.file.upload);
  router.post("/quark/file/uploadRes", $middleware.auth, $controller.file.uploadRes);
  router.post("/quark/file/getAllRes", $middleware.auth, $controller.file.getAllRes);
  router.post("/quark/images/uploadMultipleImages", $middleware.auth, $controller.image.uploadMultipleImages);

  // 视频
  router.post("/quark/video/making", $middleware.auth, $controller.video.making);
  router.get("/quark/video/cacheclean", $middleware.auth, $controller.video.cacheClean);
  router.get("/quark/video/progress", $middleware.auth, $controller.video.getProgress);


  //模板路由
  router.post("/quark/video/templateMaking", $middleware.auth, $controller.video.templateMaking);
  router.get("/quark/video/templateCacheclean", $middleware.auth, $controller.video.templateCacheclean);
  router.get("/quark/video/templateGetProgress", $middleware.auth, $controller.video.templateGetProgress);
  router.post("/quark/page/templateUpdatePage", $middleware.auth, $controller.page.templateUpdatePage);
  router.post("/quark/images/templateUploadMultipleImages", $middleware.auth, $controller.image.templateUploadMultipleImages);


  //todo-微信部分
  router.post("/wx/login/auth", $controller.wxUser.loginInWx)
  router.post("/wx/login/binding", $controller.wxUser.binding)
  router.post("/wx/user/info", $controller.wxUser.getWxUserInfo)
  router.post("/wx/user/like", $controller.wxUser.getWxUserLike)
  router.post("/wx/user/comment", $controller.wxVideo.comment)
  router.get("/wx/video/detail", $controller.wxVideo.getDetailVideo)
  router.post("/wx/video/index", $controller.wxVideo.getRandomVideo)
  router.post("/wx/video/like", $controller.wxVideo.handleLikeAction)
  router.post("/wx/video/comment", $controller.wxVideo.getComment)

  router.get('/quark/page/admin', $middleware.auth, $controller.video.getAllWorks)
  return router;
};
