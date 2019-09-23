import axios from 'axios';

const httpService = (url, data) => {

    return new Promise((resolve, reject) => {
        axios.post(url, data, {
            headers: {
                'X-Request-Version': 'v3'
            }
        }).then(
            (res) => {
                resolve(res.data);
            }
        ).catch(
            (response) => {
                reject(response);
            }
        );
    });
};
axios.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
});

export default httpService;
