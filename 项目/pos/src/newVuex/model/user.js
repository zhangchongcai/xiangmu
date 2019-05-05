import * as TYPES from '../types'

export default {
    state: {
    //    token: '',
    //    userName: '',
    //    userUid: ''
    },
    mutations: {
        [TYPES.SAVE_USER_INFO] : (state, data) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('userName', data.userName)
            localStorage.setItem('userUid', data.userUid)
            localStorage.setItem('cinemaCode', data.cinemaCode)
            localStorage.setItem('cinemaUid', data.cinemaId)
            localStorage.setItem('cinemaName', data.cinemaName)
            localStorage.setItem('terminalCode', data.tenantId)
        }
    }
}