const UserAttentionTo = require('../model/userAttentionTo');
const User = require('../model/user');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Utils = require('../function/utils');

module.exports = {
    addAttention: async (ctx, next) => {
        // let data = {
        //     attentionId: '5d048a835e4e3ae2b1c558c1',
        //     status: 0
        // }
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let data = await UserAttentionTo.findOne({
                attentionId: req.attentionId,
                fansId: ctx.state.userId
            })
            if (data) {
                if (!req.status) {
                    let res = await UserAttentionTo.update({ _id : data._id }, { status: req.status })
                    if (res) {
                        ctx.body = {
                            code: 0,
                            data: {},
                            msg: '取消关注'
                        }
                        await Utils.getIsString('isFans', ctx.state.userId, User, req.attentionId, false);
                    }
                } else {
                    let res = await UserAttentionTo.update({ _id : data._id }, { status: req.status })
                    if (res) {
                        ctx.body = {
                            code: 1,
                            data: {},
                            msg: '已关注'
                        }
                        await Utils.getIsString('isFans', ctx.state.userId, User, req.attentionId, true);
                    }
                }
            } else {
                let userAttentionTo = await new UserAttentionTo({
                    attentionId: req.attentionId,
                    fansId: ctx.state.userId,
                    status: 1
                }).save()
                await Utils.getIsString('isFans', ctx.state.userId, User, req.attentionId, true);
                if (userAttentionTo) {
                    ctx.body = {
                        code: 1,
                        data: req,
                        msg: '已关注'
                    }
                }
            }
            let attentionLength = await UserAttentionTo.find({ // 当前id的粉丝数量
                attentionId: req.attentionId,
                status: 1
            })
            let fansIdLength = await UserAttentionTo.find({ // 当前id的关注数量
                fansId: ctx.state.userId,
                status: 1
            })
            await User.update({_id: ctx.state.userId}, { attentionNum: fansIdLength.length })
            await User.update({_id: req.attentionId}, { fansNum: attentionLength.length })
            // return;
            // await next()
        } catch(err) {
            ctx.body = {
                code: err.code,
                data: {},
                msg: err.errmsg
            }
        }
    },
    userAttentionList: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            let fans = await UserAttentionTo.find({
                attentionId: ctx.state.userId,
                status: 1
            })
            let fansListId = [] // 粉丝列表
            let attentionListId = [] // 我的关注
            fans.forEach(res => {
                fansListId.push(res.fansId)
                attentionListId.push(res.attentionId)
            })
            let fanslist = []
            for (var i=0;i<fansListId.length;i++) {
                let db = await User.findOne({_id: fansListId[i]})
                db._doc.isFans = Utils.getIsStatus(db, 'isFans', ctx.state.userId);
                fanslist.push(db)
            }
            let attentionList = []
            for (var i=0;i<attentionListId.length;i++) {
                let db = await User.findOne({_id: attentionListId[i]})
                db._doc.isFans = Utils.getIsStatus(db, 'isFans', ctx.state.userId);
                attentionList.push(db)
            }
            ctx.body = {
                code: 1,
                data: {
                    attentionList,
                    fanslist
                },
                msg: 'success'
            }
        } catch(err) {
            ctx.body = {
                code: err.code,
                data: {},
                msg: err.errmsg
            }
        }
    }
}
