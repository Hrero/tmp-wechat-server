const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

    commodity = new Schema({ // 商品主表
        productDes: { // 描述
            type: String,
            required: true
        },
        imageUrl: { // 图片
            type: String,
            required: true
        },
        phoneNumber: { // 发布用户的手机号
            type: Number,
            required: true
        },
        school: { // 所在学校
            type: String,
            required: true
        },
        userId: { // 发布用户的id
            type: String,
            required: true
        },
        dep: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        collect: { // 收藏数
            type: Number,
            required: true,
            default: 0
        },
        transmit: { // 转发量
            type: Number,
            required: true,
            default: 0
        },
        like: { // 喜欢量
            type: Number,
            required: true,
            default: 0
        },
        type: { // 分类
            type: Number
        },
        ourRatings: { // 推荐指数
            type: Number,
            required: true,
            default: 0
        },
        isCollect: { // 收藏的人
            type: String,
            default: ''
        },
        isLike: { // 喜欢的人
            type: String,
            default: ''
        },
        firstImgHeight: { // 首个图片的高度
            type: Number,
            required: true,
            default: 0
        },
        firstImgWidth: { // 首个图片的宽度
            type: Number,
            required: true,
            default: 0
        },
        imgMaxHeight: { // 最大图片的高度
            type: String,
            required: true,
            default: 0
        },
        status: { // 该商品是否上架
            type: Number,
            required: true,
            default: 0
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('commodity', commodity, 'commoditys');
