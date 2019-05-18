let state = {
    // 同影厅拍片数据
    current_row: null,
    cinemaUid: null
};

let mutations = {
    changeCurrentRow(state, data) {
        state.current_row = data
    },
    deleteCurrentRow() {
        state.current_row = []
    }
};


export default {
    namespace: true,
    state,
    mutations
}