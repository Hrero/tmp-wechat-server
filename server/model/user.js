const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

    User = new Schema({ // 用户主表
        openid: { // 用户的唯一标识
            type: String,
            unique: true,
            required: true
        },
        userid: {
            type: String
        },
        platform: {
            type: String
        },
        token: {
            type: String
        },
        unionid: {
            type: String
        },
        username: {
            type: String
        },
        headimgurl: {
            type: String
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('User', User, 'users');
