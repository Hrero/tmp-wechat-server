const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

CommodityType = new Schema({ // 物品类型表
        value: { // 类型type 其他为10
            type: Number,
            unique: true,
            required: true
        },
        text: { // 类型名字
            type: String,
            required: true
        },
        sort: { // 排序
            type: Number,
            unique: true,
            required: true
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('CommodityType', CommodityType, 'commodity_type');
