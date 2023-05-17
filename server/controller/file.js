const fs = require("fs");
const path = require("path");
module.exports = app => ({
  async upload() {
    const {ctx, $service, $helper} = app;
    const file = ctx.request.files.file;
    const folder = `files`;
    const id = ctx.request.body.id
    const result = await $service.file.fileUpload({file, folder}, id);
    $helper.returnBody(true, result);
  },
  async uploadRes() {
    const {ctx, $service, $helper} = app;
    const file = ctx.request.files.file;
    const folder = `resource`;
    const id = ctx.request.body.id
    const result = await $service.file.fileUpload({file, folder}, id);
    $helper.returnBody(true, result);
  },
  async getAllRes() {
    const {ctx, $service, $helper} = app;
    const res = []
    const folders = fs.readdirSync(path.join(__dirname, '../public/resource/resource'));
    const id = ctx.request.body.id
    folders.forEach(folder => {
      if (folder === id.toString()) {
        const files = fs.readdirSync(path.join(__dirname, '../public/resource/resource', folder));
        res.push(...files.map(v => 'http://localhost:4000/resource/resource/6455bc5b746f2a4d9cb4e6f0/' + v))
      }
    })
    $helper.returnBody(true, res);
  }


});
