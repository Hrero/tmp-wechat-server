const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

UserTransmits = new Schema({ // 用户转发表
        commodityId: { // 商品id
            type: String,
            required: true
        },
        userId: { // 用户id
            type: String,
            required: true
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('UserTransmits', UserTransmits, 'transmits');
