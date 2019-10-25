let state = {
    cinemaUid: '',
    cinemaName: ''   
}

let mutations = {
    changeCurCinema(state, data) {
        state.cinemaUid = data.cinemaUid
        state.cinemaName = data.cinemaName
    }
}


export default {
    namespace: true,
    state,
    mutations
}