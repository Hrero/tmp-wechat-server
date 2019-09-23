const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

Remarks = new Schema({ // 评论表
        commodityId: { // 商品id
            type: String,
            required: true
        },
        content: { // 评论内容
            type: String,
            required: true
        },
        fromUid: { // 发起评论用户的id
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        depUser: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        depComm: {
            type: Schema.Types.ObjectId,
            ref: 'commodity'
        },
        toUid: { // 接收评论的用户id
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        targetId: { // 评论当前条的id
            type: Schema.Types.ObjectId,
            ref: 'Remarks'
        },
        targetFirstId: { // 评论当前第一级条的id
            type: String,
            required: true
        },
        avatarUrl: { // 发起者用户的头像
            type: String,
            required: true
        },
        nickName: { // 发起者用户名
            type: String,
            required: true
        },
        status: { // 阅读状态
            type: Number,
            default: 0,
            required: true
        },
        sex: { // 发起者用户性别
            type: Number,
            default: 0,
            required: true
        },
        ...defaultSchemaOptions
    })
module.exports = mongoose.model('Remarks', Remarks, 'remarks');
