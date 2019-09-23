const Commodity = require('../model/commodity');
const Remarks = require('../model/remarks');
const UserSearchs = require('../model/userSearchs');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Utils = require('../function/utils');
const debug = require('debug')('app');
module.exports = {
    saveCommodity: async (ctx) => {
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (key !== 'type') { // 分类允许传 不做拦截
                    if (req[key] === undefined || req[key] === "") {
                        throw new ApiError(ApiErrorNames.UserSomeNull)
                    }
                }
            }
            let commodity = await new Commodity({
                productDes: req.productDes,
                firstImgHeight:req.firstImgHeight,
                firstImgWidth:req.firstImgWidth,
                imgMaxHeight:req.imgMaxHeight,
                imageUrl: req.imageUrl,
                phoneNumber: req.phoneNumber || 0,
                school: req.school,
                type: req.type || '',
                isCollect: '',
                isLike: '',
                userId: ctx.state.userId,
                dep: ctx.state.userId
            }).save()
            if (commodity) {
                ctx.body = {
                    code: 1,
                    data: commodity,
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
    getAllCommdity: async (ctx, next) => {
        /**
         * keyword 关键词检索 传入检索productDes字段
         */
        let req = ctx.request.body;
        let school = ctx.request.header.cookie.indexOf('undefined') === -1?decodeURI(ctx.request.header.cookie).match(/[\u4e00-\u9fa5]/g).join(""): '';
        let pageSize = parseInt(req.pageSize) || 20;
        let pageNum = parseInt(req.pageNum) < 1? 1: req.pageNum;
        let skip = (parseInt(pageNum) - 1) * pageSize;
        let phoneNumber = parseInt(req.phoneNumber);
        let total = await Commodity.find({});
        let query = {};
        let keyword = '';
        let lookUp = [];
        for (let key in req) {
            if (req[key] && ['pageSize', 'pageNum', 'keyword'].indexOf(key) === -1) {
                query[key] = req[key]
            }
        }
        if (req.keyword) {
            keyword = new RegExp(req.keyword, 'i') // 不区分大小写
            try {
                let searchText = await UserSearchs.findOne({
                    userId: ctx.state.userId,
                    search: req.keyword
                })
                if (!searchText) {
                    let userSearch = await new UserSearchs({
                        search: req.keyword,
                        userId: ctx.state.userId,
                        times: 1,
                        dep: ctx.state.userId
                    }).save()
                    ctx.body = {
                        code: 1,
                        data: { data: [], total: total.length },
                        msg: 'success'
                    }
                    return
                }
                if (!searchText.status) {
                    await UserSearchs.update({
                        _id: searchText._id
                    }, {
                        status: 1
                    })
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
        if (req.type === 0) {
            
            lookUp= school?
            await Commodity.find({school: school}).populate('dep').sort({ ourRatings: -1, _id: -1 }).skip(skip).limit(pageSize):
            await Commodity.find({}).populate('dep').sort({ ourRatings: -1, _id: -1 }).skip(skip).limit(pageSize);
        } else {
            lookUp= await Commodity.find({
                $or: [ //多条件，数组
                    {
                        productDes: {
                            $regex: keyword
                        }
                    }
                ],
                school: school,
                ...query
            }).populate('dep').sort({ _id: -1 }).skip(skip).limit(pageSize);
        }
        let res = [...lookUp];
        for (let i=0; i< res.length; i++) {
            res[i]._doc.isCollect = Utils.getIsStatus(res[i], 'isCollect', ctx.state.userId);
            res[i]._doc.isLike = Utils.getIsStatus(res[i], 'isLike', ctx.state.userId);
            res[i]._doc.imageUrl = await Utils.getArrForStr(res[i].imageUrl);
            res[i]._doc.imgMaxHeight = await Utils.getArrForStr(res[i].imgMaxHeight);
        }
        ctx.body = {
            code: 1,
            data: {
                data: res,
                total: total.length
            },
            msg: 'success'
        }
    },
    getCommodityDetail: async (ctx, next) => {
        let req = ctx.request.body;
        let arr = []
        let other = [];
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let res = await Commodity.findOne({
                _id: req.commodityId
            }).populate('dep')
            let total = await Remarks.find({
                commodityId: req.commodityId
            })
            let lookUp = await Remarks.find({
                commodityId: req.commodityId
            }).populate('depUser').populate('depComm').populate('fromUid').populate('toUid').sort({ _id: -1 });
            
            for (let i=0; i< lookUp.length; i++) {
                if (lookUp[i].targetId == req.commodityId) {
                    lookUp[i]._doc.child = []
                    arr.push(lookUp[i])
                } else {
                    other.push(lookUp[i])
                }
            }
            for (let i=0; i < other.length; i++) {
                for (let k=0; k < arr.length; k++) {
                    if (other[i].targetFirstId == arr[k]._id) {
                        arr[k]._doc.child.push(other[i])
                    }
                }
            }
            res._doc.isCollect = Utils.getIsStatus(res, 'isCollect', ctx.state.userId);
            res._doc.isLike = Utils.getIsStatus(res, 'isLike', ctx.state.userId);
            res.dep._doc.isFans = Utils.getIsStatus(res.dep, 'isFans', ctx.state.userId);
            res._doc.imgMaxHeight = await Utils.getArrForStr(res.imgMaxHeight);
            res._doc.imageUrl = await Utils.getArrForStr(res.imageUrl);
            ctx.body = {
                code: 1,
                data: {
                    res,
                    arr,
                    total: total.length
                },
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
    getUserCommodityList: async (ctx, next) => {
        let req = ctx.request.body;
        for (const key in req) {
            if (req[key] === undefined || req[key] === "") {
                throw new ApiError(ApiErrorNames.UserSomeNull)
            }
        }
        let userId = req.userId? req.userId: ctx.state.userId;
        let res = await Commodity.find({
            userId: userId
        }).populate('dep');
        for (let i=0; i< res.length; i++) {
            res[i]._doc.imageUrl = await Utils.getArrForStr(res[i].imageUrl);
        }
        ctx.body = {
            code: 1,
            data: res,
            msg: 'success'
        }
    },
    editStatus: async (ctx, next) => {
        let req = ctx.request.body
        /**
         * status 1 上线 0 审核
         */
        try {
            if (!req.commdityId || [0, 1].indexOf(req.status) === -1) {
                throw new ApiError(ApiErrorNames.UserSomeNull)
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.msg
            }
            return;
        }
        const result = await Commodity.update({ "_id": req.commdityId},{ "status": req.status})
        if (result.err) {
            console.log("Error:" + err)
        } else {
            ctx.body = {
                code: 1,
                data: '',
                msg: 'success'
            }
            await next()
        }
    },
    addTransmit: async (ctx, next) => {
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let commodity = await Commodity.update({
                _id: req.commodityId
            })
            if (commodity) {
                ctx.body = {
                    code: 1,
                    data: commodity,
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
    recommendToCommodity: async (ctx, next) => {
        let req = ctx.request.body;
        try { // 推荐30条
            let res = await Commodity.find({type: req.type}).populate('dep').sort({ ourRatings: -1 }).limit(30);
            for (let i=0; i< res.length; i++) {
                res[i].isCollect = Utils.getIsStatus(res[i], 'isCollect', ctx.state.userId);
                res[i].isLike = Utils.getIsStatus(res[i], 'isLike', ctx.state.userId);
                res[i]._doc.imageUrl = await Utils.getArrForStr(res[i].imageUrl);
                res[i]._doc.imgMaxHeight = await Utils.getArrForStr(res[i].imgMaxHeight);
            }
            ctx.body = {
                code: 1,
                data: res,
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
    }
}
