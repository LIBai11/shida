module.exports = app => {
    const {mongoose} = app;
    const Schema = mongoose.Schema;
    // Schema
    const usersSchema = new Schema(
        {
            uuid: {type: String, default: ''},
            openid: {type: String, default: ""},
            username: {type: String, default: ''},
            avatar:{type: String, default:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'}
        },
        {timestamps: {createdAt: "created", updatedAt: "updated"}}
    );
    return mongoose.model("wxUser", usersSchema);
};
