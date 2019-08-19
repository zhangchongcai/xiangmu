import cam from 'cam/vuex'
import ccm from 'ccm/vuex'
import cmm from 'cmm/vuex'
import crm from 'crm/vuex'
import rpt from 'rpt/vuex'
import ctm from 'ctm/vuex'
import cim from 'cim/vuex'
import csm from 'csm/vuex'
import frameCpm from './modules'
import cwf from 'cwf/vuex'

let modules = Object.assign({}, ctm, cam, ccm, cmm, crm, rpt, cim, csm, cwf, frameCpm)
    // let modules = Object.assign({}, ctm, cam, ccm, cmm, crm, rpt,  frameCpm)

export default new Vuex.Store({
    state: {
        domain: '',
        loginToken: null, //登录用户token
        loginUser: null, //登录用户信息
        innerWidth: null, // 浏览器宽度
        innerHeight: null,// 浏览器高度
        changeCinemaData: null,//影片资料影院data
        password: null,
        CpmUserKey: null,
        sliderData: null
    },
    mutations: {
        updateLoginTokenCPM(state, newToken) { //更新token信息
            state.loginToken = newToken;
        },
        updateLoginUserCPM(state, newUserInfor) { //更新登录用户信息
            state.loginUser = newUserInfor;
        },
        changeWindowSize(state, data) {
            // 修改浏览器窗口大小信息
            state.innerWidth = data.innerWidth;
            state.innerHeight = data.innerHeight;
        },
        changeCinemaData(state, data) {
            // console.log('进来了：',data)
            state.changeCinemaData = data
        },
        changePwd(state,data) {
            state.password = data
        },
        updateUserKey(state, data) { //更新登录用户信息
            state.CpmUserKey = data;
        },

    },
    modules
})
