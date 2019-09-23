const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

userAttentionTo = new Schema({ // 关注表
        attentionId: { // 关注者id
            type: String,
            required: true
        },
        fansId: { // 粉丝者id
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1,
            required: true
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('userAttentionTo', userAttentionTo, 'user_attention_to');
