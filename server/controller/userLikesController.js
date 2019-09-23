const UserLikes = require('../model/userLikes');
const Commodity = require('../model/commodity');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Utils = require('../function/utils');
module.exports = {
    addLike: async (ctx, next) => {
        // let data = {
        //     commodityId: '5d145ee6c50c3201d17dc28a'
        // }
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let data = await UserLikes.findOne({
                commodityId: req.commodityId,
                userId: ctx.state.userId
            })
            if (data) {
                if (!req.status) {
                    let res = await UserLikes.update({ _id : data._id }, { status: req.status })
                    if (res) {
                        ctx.body = {
                            code: 0,
                            data: {},
                            msg: '取消点赞'
                        }
                        await Utils.getIsString('isLike', ctx.state.userId, Commodity, req.commodityId, false);
                        await Commodity.update({
                            _id: req.commodityId
                        },{
                            $inc: {
                                like: -1
                            }
                        })
                    }
                } else {
                    let res = await UserLikes.update({ _id : data._id }, { status: req.status })
                    if (res) {
                        ctx.body = {
                            code: 1,
                            data: {},
                            msg: '已点赞'
                        }
                        await Utils.getIsString('isLike', ctx.state.userId, Commodity, req.commodityId, true);
                        await Commodity.update({
                            _id: req.commodityId
                        },{
                            $inc: {
                                like: 1
                            }
                        })
                    }
                }
            } else {
                let userLikes = await new UserLikes({
                    commodityId: req.commodityId,
                    userId: ctx.state.userId
                })
                userLikes.save();
                ctx.body = {
                    code: 1,
                    data: req,
                    msg: '已点赞'
                }
                await Utils.getIsString('isLike', ctx.state.userId, Commodity, req.commodityId, true);
                await Commodity.update({
                    _id: req.commodityId
                },{
                    $inc: {
                        like: 1
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
