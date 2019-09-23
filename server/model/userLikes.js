const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

UserLikes = new Schema({ // 用户喜欢表
        commodityId: { // 商品id
            type: String,
            required: true
        },
        userId: { // 用户id
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 0,
            required: true
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('UserLikes', UserLikes, 'likes');
