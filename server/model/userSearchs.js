const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

userSearchs = new Schema({ // 用户搜索表
        userId: { // 用户id
            type: String,
            required: true
        },
        search: { // 搜索关键词
            type: String,
            required: true
        },
        times: { // 关键词搜索次数
            type: Number,
            required: true,
            default: 1
        },
        status: { // 删除状态
            type: Number,
            required: true,
            default: 1
        },
        dep: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('userSearchs', userSearchs, 'searchs');
