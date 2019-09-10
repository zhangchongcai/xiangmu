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
           response.data.msg = '用户登录超时或被强制退出！'
           localStorage.removeItem('token');
           MessageBox.confirm(`<strong style="display: inline-block; width: 22px; height: 22px; border-radius: 50%; background: #f00; text-align: center; line-height: 22px; color: #fff; margin: 0 4px;">X</strong>用户登录超时或被强制退出`, '温馨提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            showCancelButton: false,
            showClose: false
          }).then(() => {
            location.href = '/login';
          })
           
       }
       return response
     },
     err => {
        // console.log(err)
        if(!localStorage.getItem('token')) return err
        if(err ==  'Error: Network Error') {
            err = " 服务器错误，请联系影院经理！"
        }
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
        Message.error(`错误信息: ${err}`);
        Promise.reject(err)
        return err
    }
);
function getUrl(urlarr){
     return  urlarr instanceof Array ? urlarr[1] ? urlarr[1] + urlarr[0] : API + '/' + urlarr[0] : API === '/api' ? urlarr : API + urlarr;
}
const get = (urlarr,data={}) => { 
    let url = getUrl(urlarr)
    return Axios.get(url,{params:data}).then(res => res)
} 
const post = (urlarr,data={}) => {
    let url = getUrl(urlarr)
    // console.log(url)
    return  Axios.post(url,data).then(res => res)
    }
const dele = (urlarr,data={}) => {
    let url = getUrl(urlarr)
    return Axios.delete(url,{params: data}).then(res => res )
    }
const formDataPost =  (urlarr,data={}) => {
    let url = urlarr[1] ? urlarr[1] + urlarr[0] : API + '/' + urlarr[0]
    data.contentType = 'application/x-www-form-urlencoded'
    return Axios.post(url,data).then(res => res)
    }
export default {
    get,
    post,
    dele,
    formDataPost
}
