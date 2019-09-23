const UserToCollect = require('../model/userToCollect');
const Commodity = require('../model/commodity');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Utils = require('../function/utils');
module.exports = {
    getCollectionList: async (ctx) => {
        let req = ctx.request.body
        let userId = req.userId? req.userId: ctx.state.userId;
        
        let result = await UserToCollect.find({
            userId: userId,
            status: 1
        }).populate({
            path: 'dep',
            populate: {
                path: 'dep',
            }
        })
        for (let i=0; i< result.length; i++) {
            result[i].dep._doc.imageUrl = await Utils.getArrForStr(result[i].dep.imageUrl);
        }
        ctx.body = {
            code: 1,
            data: result,
            msg: 'success'
        }
    },
    addCollection: async (ctx, next) => {
        // let data = {
        //     commodityId: '5d145ee6c50c3201d17dc28a'，
        //     status: 0
        // }
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let data = await UserToCollect.findOne({
                commodityId: req.commodityId,
                userId: ctx.state.userId
            })
            if (data) {
                if (!req.status) {
                    let res = await UserToCollect.update({ _id : data._id }, { status: req.status })
                    if (res) {
                        ctx.body = {
                            code: 0,
                            data: {},
                            msg: '取消收藏'
                        }
                        await Utils.getIsString('isCollect', ctx.state.userId, Commodity, req.commodityId, false);
                        await Commodity.update({
                            _id: req.commodityId
                        },{
                            $inc: {
                                collect: -1
                            }
                        })
                    }
                } else {
                    let res = await UserToCollect.update({ _id : data._id }, { status: req.status })
                    if (res) {
                        ctx.body = {
                            code: 1,
                            data: {},
                            msg: '已收藏'
                        }
                        await Utils.getIsString('isCollect', ctx.state.userId, Commodity, req.commodityId, true);
                        await Commodity.update({
                            _id: req.commodityId
                        },{
                            $inc: {
                                collect: 1
                            }
                        })
                    }
                }
            } else {
                let userToCollect = new UserToCollect({
                    commodityId: req.commodityId,
                    userId: ctx.state.userId,
                    dep: req.commodityId,
                    status: 1
                })
                userToCollect.save();
                ctx.body = {
                    code: 1,
                    data: req,
                    msg: '已收藏'
                }
                await Utils.getIsString('isCollect', ctx.state.userId, Commodity, req.commodityId, true);
                await Commodity.update({
                    _id: req.commodityId
                },{
                    $inc: {
                        collect: 1
                    }
                })
            }
            await next()
        } catch(err) {
            ctx.body = {
                code: err.code,
                data: {},
                msg: err.errmsg
            }
        }
    }
}
