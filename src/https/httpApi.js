import request from "./httpService";

export default {
    getUserList(data) {
        return request('/api/user/getUserList', data);
    },
    getCommodityList(data) {
        return request('/api/getCommodityList', data);
    },
    addUser(data) {
        return request('/api/user/addUser', data);
    },
    handleEditStatus(data) {
        return request('/api/editCommodityStatus', data);
    },
    handleAddcommodity(data) {
        return request('/api/user/saveCommodity', data);
    },
    getCollectionList(data) {
        return request('/api/user/getCollectionList', data);
    },
    getUserCmmList(data) {
        return request('/api/user/getComUserList', data);
    }
};
