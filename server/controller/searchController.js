const UserSearchs = require('../model/userSearchs');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const utils = require('../function/utils');
module.exports = {
    getEverybodySearching: async (ctx, next) => {
        const nowTimesTamp = new Date().getTime();
        const oldWeeksTamp = new Date().getTime() - (1000 * 60 * 60 * 24 * 7);
        let allSearch = await UserSearchs.find({
            creatTime: {
                "$gte": oldWeeksTamp,
                "$lte": nowTimesTamp
            }
        });
        let userHistorySearch = await UserSearchs.find({userId: ctx.state.userId, status: 1}).limit(20);
        let arr = allSearch.map(res => res.search);
        ctx.body = {
            code: 1,
            data: {
                userHistorySearch: userHistorySearch,
                searchArrayList: utils.searchArrayList(arr)
            },
            msg: 'success'
        }
    },
    deleteUserSearch: async (ctx, next) => {
        try {
            let userHistorySearch = await UserSearchs.updateMany({userId: ctx.state.userId}, {
                status: 0
            })
            ctx.body = {
                code: 1,
                data: userHistorySearch,
                msg: '删除成功'
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
