module.exports = {
    port: 4000,
    mongodb: {
        url: "mongodb://localhost:27017/ffcreator",
        options: {}
    },
    middleware: ["handlerError"],
    jwt: {secret: "ffcreator"},
    crypto: {secret: "#*#*ffcreator*#*#"},
    baseUrl: "",
    wxAppid: 'wx09835df7ba1b143a',
    wxAppSecret: '3382fa11dcf89c1ed2f2f1f8e41bd545'
};
