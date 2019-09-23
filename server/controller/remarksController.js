const Remarks = require('../model/remarks');
const User = require('../model/user');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Utils = require('../function/utils');
let RabbitMQ = require('../function/mq');
let mq = new RabbitMQ();
module.exports = {
    addRemarks: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let fromUserInfo = await User.findOne({ _id: ctx.state.userId});
            let remark = await new Remarks({
                commodityId: req.commodityId,
                content: req.content,
                depUser: ctx.state.userId,
                depComm: req.commodityId,
                fromUid: req.fromUid || ctx.state.userId,
                toUid: req.toUid,
                targetId: req.targetId, // 回复那条的id 1级别为商品id 2级以后为回复id
                targetFirstId: req.targetFirstId,
                avatarUrl: fromUserInfo.avatarUrl,
                nickName: fromUserInfo.nickName,
                sex: fromUserInfo.sex
            }).save()
            if (remark) {
                ctx.body = {
                    code: 1,
                    data: remark,
                    msg: 'success'
                }
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
    getRemarksList: async (ctx, next) => {
        let req = ctx.request.body;
        let res = [];
        let other = [];
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let lookUp = await Remarks.find({
                commodityId: req.commodityId
            }).populate('depUser').populate('depComm').populate('fromUid').populate('toUid').sort({ _id: -1 });
            for (let i=0; i< lookUp.length; i++) {
                if (lookUp[i].targetId == req.commodityId) {
                    lookUp[i]._doc.child = []
                    res.push(lookUp[i])
                } else {
                    other.push(lookUp[i])
                }
            }
            for (let i=0; i < other.length; i++) {
                for (let k=0; k < res.length; k++) {
                    if (other[i].targetFirstId == res[k]._id) {
                        res[k]._doc.child.push(other[i])
                    }
                }
            }
            if (res) {
                ctx.body = {
                    code: 1,
                    data: {
                        data: res,
                        total: lookUp.length
                    },
                    msg: 'success'
                }
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
    getMessageList: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            let lookUp = await Remarks.find({
                toUid: ctx.state.userId
            }).populate('depUser').populate('depComm').populate('fromUid').populate('toUid').populate('targetId').sort({ _id: -1 });
            if (lookUp) {
                ctx.body = {
                    code: 1,
                    data: lookUp,
                    msg: 'success'
                }
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
    updateMessage: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            let lookUp = await Remarks.updateMany({}, {$set: {status: 0}})
            if (lookUp) {
                ctx.body = {
                    code: 1,
                    data: lookUp,
                    msg: 'success'
                }
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }

    },
    clearMessage: async (ctx, next) => {
        let req = ctx.request.body;
        mq.receiveQueueMsg('testQueue',(msg) => {    
            console.log(msg)
        })
        try {
            let lookUp = await Remarks.updateMany({
                toUid: ctx.state.userId
            }, {$set: {status: 1}})
            if (lookUp) {
                ctx.body = {
                    code: 1,
                    data: lookUp,
                    msg: 'success'
                }
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
    getMessageNum: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            const data = await Remarks.find({status: 0, toUid: ctx.state.userId});
            const length = data.length;
            ctx.body = {
                code: 1,
                data: length,
                msg: 'success'
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
}
