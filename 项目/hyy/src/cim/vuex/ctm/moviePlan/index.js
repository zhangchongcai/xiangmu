let state = {
    // 操作方式
    type: '',
    // 当前选中数据
    current_item: {},
    // 当前选中数据所在行
    current_row: [],
    // 价格方案
    pricePlan: {}
};

let mutations = {
    setMoviePlanControl(state, data) {
        state.type = data.type;
        state.current_item = data.current_item;
        state.current_row = data.current_row;
        state.pricePlan = data.pricePlan;
    },
    deletMoviePlanControl() {
        state.type = '';
        state.current_item = {};
        state.current_row = [];
        state.pricePlan = {};
    }
};

let actions = {
    setMoviePlanControl({ commit }, data) {
        commit('setMoviePlanControl', data);
    },
    deletMoviePlanControl({ commit }) {
        commit('deletMoviePlanControl');
    }
};

let getters = {
    getMoviePlanControl(state) {
        return state
    }
}

export default {
    namespace: true,
    state,
    mutations,
    actions,
    getters
}