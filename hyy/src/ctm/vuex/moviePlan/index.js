let state = {
    cinemaUid: "1y",
    terminalInfo:{}
};

let mutations = {
    changeCinemaUid(state, data) {
        console.log('执行了2')
        console.log('data:',data)
        state.cinemaUid = data
    },
    ctmRemberTerminal( state,data ){
        state.terminalInfo = data
    },
};


export default {
    namespace: true,
    state,
    mutations
}