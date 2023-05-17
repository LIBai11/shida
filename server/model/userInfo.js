const {ObjectID} = require("mongodb");
module.exports = app => {
    const {mongoose} = app;
    const Schema = mongoose.Schema;
    const usersSchema = new Schema(
        {
            name: {type: String, default: ''},
            author: {
                type: ObjectID,
            },
            wxUuid: {type: String, default: ''},
            avatar: {type: String, default: ''},
            like: {
                type: Array,
                default: [
                    // {
                    //     videoUrl: '',
                    //     isLiked: 1,//1是喜欢, 0是不喜欢, 只要存在就说明喜欢过
                    //     videoImage:'',
                    //     videoId: '',
                    // }
                ]
            },
            comment: {
                type: Array,
                default: [
                    // {
                    // videoId: '',
                    // comments: [
                    // {
                    //     likeCounts: 0,
                    //     content: ''
                    // }
                    // ]
                    // }
                ]
            },
            collects: {
                type: Array,
                default: [
                    // {videoId: ''}
                ]
            },
            praised: { //获赞
                type: Number,
                default: 0
            },
            following: {
                type: Object,
                default: {
                    // show: false,
                    // details: [
                    //     {wxUuid: ''}
                    // ]
                }
            },
            follows: {
                type: Object,
                default: {
                    // show: false,
                    // details: [
                    //     {wxUuid: ''}
                    // ]
                }
            },
            address: {
                type: String,
                default: ''
            },
            age: {
                type: Number,
                default: 0
            },
            sex: {
                type: Number,
                default: 0 //0女1男2保密
            },
            sign: {
                type: String,
                default: ''
            }
        },
        {timestamps: {createdAt: "created", updatedAt: "updated"}}
    );
    return mongoose.model("userInfo", usersSchema);
};

