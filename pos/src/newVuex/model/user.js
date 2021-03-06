import * as TYPES from '../types'

export default {
    state: {
        token: '',
        userName: '',
        userUid: '',
        userInfo : {a:'dadada'},
        show:false,
        operator:'',
        tenantId:'' //test 377161
    },
    getters: {
        tenantId:(state)=>{
            return state.tenantId || localStorage['tenantId']
        },
        operator:(state)=>{
            return state.operator || localStorage['userName']
        }
    },
    mutations: {
        [TYPES.SAVE_USER_INFO] : (state, data) => {
            state.tenantId = data.tenantId;
            state.operator = data.userName;
            localStorage.setItem('token', data.token)
            localStorage.setItem('userName', data.userName)
            localStorage.setItem('userUid', data.userUid)
            localStorage.setItem('terminalId', data.terminalId)
            localStorage.setItem('cinemaCode', data.cinemaCode)
            localStorage.setItem('cinemaUid', data.cinemaId)
            localStorage.setItem('cinemaName', data.cinemaName)
            localStorage.setItem('cinemaId', data.cinemaId)
            localStorage.setItem('tenantId', data.tenantId)
            localStorage.setItem('channelId', '0')
            localStorage.setItem('channelNo', '0')
            localStorage.setItem('channelName', '柜台')
            localStorage.setItem('userAccount',data.userAccount)
            localStorage.setItem('workTimeUid',data.workTimeUid)
            localStorage.setItem('preAmount',data.preAmount)
            //会员交易相关公共参数
            sessionStorage['payParams'] = JSON.stringify({
                channelName:'柜台',
                cinemaName:data.cinemaName,
                operatorNo:data.userUid,
                posNo:data.terminalId,
                channelId:'0',
                channelNo:'0',
                cinemaId:data.cinemaId,
                cinemaCode:data.cinemaCode,
                operator:data.userName
              })
        }
    }
}