import axios from 'axios'
import QS from 'qs';
import {
    MessageBox,
    Message
} from 'element-ui';
const API = process.env.NODE_ENV == 'production' ? `${location.protocol}//api${location.host}` : '/api'
const Axios = axios.create();

Axios.defaults.timeout = 100000;
Axios.interceptors.request.use( 
    //响应前配置
    confirm => {
        // console.log(confirm)
        confirm.headers['Content-Type'] = 'application/json;charset=UTF-8';
        confirm.headers['Cpm-User-Token'] = localStorage.getItem('token') || '';
        switch(confirm.method){
            case "post" :
            if(confirm.data.contentType){ // post 参数需要 转成formData的时候传入
                confirm.headers['Content-Type'] = confirm.data.contentType
                delete confirm.data.contentType
                confirm.data = QS.stringify(confirm.data)
            }
            // console.log(confirm.data)
            break;
        }
        
        return confirm
    },
    error => {
        return Promise.reject(error);
    }
)


 Axios.interceptors.response.use( 
     //响应后配置
     response => {
       if(response.data.code == 401) {
           localStorage.removeItem('token');
           location.href = '/login';
       }

       return response
     },
     err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误';
                    break;
                case 401:
                    err.message = '未授权，请登录';
                    break;
                case 403:
                    err.message = '拒绝访问';
                    break;
                case 404:
                    err.message = `请求地址错误：${err.response.config.url}`;
                    break;
                case 408:
                    err.message = '请求超时';
                    alert('请求超时，请秒后再试');
                    break;
                case 500:
                    err.message = '服务器内部错误';
                    break;
                case 501:
                    err.message = '服务未实现';
                    break;
                case 502:
                    err.message = '网关错误';
                    break;
                case 503:
                    err.message = '服务不可用';
                    break;
                case 504:
                    err.message = '网关超时';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持';
                    break;
                default:
            }
        }
        Message.error(`Error:${err}`);
        Promise.reject(err)
        return err
    }
);
function getUrl(urlarr){
     return  urlarr instanceof Array ? urlarr[1] ? urlarr[1] + urlarr[0] : API + '/' + urlarr[0] : API === '/api' ? urlarr : API + urlarr;
}
const get = (urlarr,data={}) => { 
    let url = getUrl(urlarr)
    return Axios.get(url,{params:data})
} 
const post = (urlarr,data={}) => {
    let url = getUrl(urlarr)
    return Axios.post(url,data)
    }
const dele = (urlarr,data={}) => {
    let url = getUrl(urlarr)
    return Axios.delete(url,{params: data})
    }
const formDataPost =  (urlarr,data={}) => {
    let url = urlarr[1] ? urlarr[1] + urlarr[0] : API + '/' + urlarr[0]
    data.contentType = 'application/x-www-form-urlencoded'
    return Axios.post(url,data)
    }
export default {
    get,
    post,
    dele,
    formDataPost
}
