import axios from "axios";


export const authRequest = config => {
    config.headers = config.headers
        ? { ...config.headers, Authorization: 'Bearer ' + localStorage.getItem('token') }
        : { Authorization: 'Bearer ' + localStorage.getItem('token') };
    return axios.request(config);
};

export const getRequest = (url, config) => {
    return authRequest({ url, method: "get", ...config });
}

export const postRequest = (url, data, config) => {
    return authRequest({ url, method: "post", data, ...config });
}

export const patchRequest = (url, data, config) => {
    return authRequest({ url, method: "patch", data, ...config });
}
