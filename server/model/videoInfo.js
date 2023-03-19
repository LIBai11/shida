const {ObjectID} = require("mongodb");
module.exports = app => {
    const {mongoose} = app;
    const Schema = mongoose.Schema;
    // Schema
    const usersSchema = new Schema(
        {
            videoId: {type: ObjectID},
            // authorName: {type: String, default: ""},
            // avatar: {type: String, default: ""},
            wxUuid: {type: String, default: ''},
            likeCounts: {type: Number, default: 0},
            desc: {type: String, default: ""},
            comment: {
                type: Array,
                default: [
                    // {
                    // wxUuid: '',
                    // avatar: '',
                    // name: ''.
                    // comments: [
                    // {
                    //     likeCounts: 0,
                    //     content: ''
                    // }
                    // ]
                    // }
                ]
            }
        },
        {timestamps: {createdAt: "created", updatedAt: "updated"}}
    );
    return mongoose.model("videoInfo", usersSchema);
};
