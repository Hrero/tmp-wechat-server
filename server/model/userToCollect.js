const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

UserToCollect = new Schema({ // 用户收藏表
        commodityId: { // 商品id
            type: String,
            required: true
        },
        userId: { // 用户id
            type: String,
            required: true
        },
        status: { // 已收藏/未收藏状态
            type: Number,
            default: 0,
            required: true
        },
        dep: {
            type: Schema.Types.ObjectId,
            ref: 'commodity'
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('UserToCollect', UserToCollect, 'user_to_collect');
