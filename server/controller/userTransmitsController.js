const UserTransmits = require('../model/userTransmits');
const Commodity = require('../model/commodity');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
module.exports = {
    addTransmit: async (ctx, next) => {
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
            let data = await UserTransmits.findOne({
                commodityId: req.commodityId,
                userId: ctx.state.userId
            })
            if (data) {
                ctx.body = {
                    code: 0,
                    data: {},
                    msg: '已转发'
                }
            } else {
                let userTransmits = new UserTransmits({
                    commodityId: req.commodityId,
                    userId: ctx.state.userId
                })
                userTransmits.save();
                ctx.body = {
                    code: 1,
                    data: req,
                    msg: '转发成功'
                }
                await Commodity.update({
                    _id: req.commodityId
                },{
                    $inc: {
                        transmit: 1
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
