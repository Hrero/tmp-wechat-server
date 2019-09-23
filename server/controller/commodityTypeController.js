const CommodityType = require('../model/commodityType');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const utils = require('../function/utils');
module.exports = {
    getCommodityTypeList: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            let data = await CommodityType.find({}).sort({
                sort: 1
            });
            ctx.body = {
                code: 1,
                data: data,
                msg: 'success'
            }
        } catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
    addCommodityType: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            let res = await CommodityType.findOne({
                value: req.value
            })
            if (res) {
                ctx.body = {
                    code: 1,
                    data: {},
                    msg: '已存在'
                }
            } else {
                let commodityType = await new CommodityType({ // 排序初始为当前列表最后
                    value: req.value,
                    text: req.text,
                    sort: req.sort
                }).save()
                if (commodityType) {
                    ctx.body = {
                        code: 1,
                        data: commodityType,
                        msg: 'success'
                    }
                }

            }
        } catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return; 
        }
    }
}
