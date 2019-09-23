const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

    User = new Schema({ // 用户主表
        openId: { // 用户的唯一标识 _id = userId
            type: String,
            unique: true,
            required: true
        },
        name: { // 用户真实姓名/api/xcx/weChat/getUnionId
            type: String
        },
        school: { // 用户真实学校
            type: String
        },
        studentNumber: { // 用户真实学生证号码
            type: Number
            // unique: true
        },
        phoneNumber: { // 用户真实电话号码
            type: Number
        },
        nickName: { // 用户昵称
            type: String
        },
        avatarUrl: { // 用户头像
            type: String
        },
        sex: { // 用户性别 1 男 0 女
            type: Number,
            default: 0
        },
        signature: { // 用户个性签名
            type: String
        },
        birthday: {  // 用户生日
            type: String
        },
        attentionNum: {  // 关注数量
            type: Number,
            default: 0
        },
        fansNum: {  // 粉丝数量
            type: Number,
            default: 0
        },
        token: {  // token
            type: String
        },
        isFans: { // 关注的人
            type: String,
            default: ''
        },
        ...defaultSchemaOptions
    });

User.virtual('userId')
    .get(function () {
        return this._id;
    });
module.exports = mongoose.model('User', User, 'users');
