const {ObjectID} = require("mongodb");
module.exports = app => {
    const {mongoose} = app;
    const Schema = mongoose.Schema;
    // Schema
    const commentSchema = new Schema(
        {
            videoId: {type: ObjectID,ref: 'page'},
            wxUuid: {type: String, default: ''},
            comments: {type: Array,default: [
                    {
                        name: '',
                        content: '',
                        timestamps: ''
                    }
                ]},

        },
        {timestamps: {createdAt: "created", updatedAt: "updated"}}
    );
    return mongoose.model("comment", commentSchema);
};
