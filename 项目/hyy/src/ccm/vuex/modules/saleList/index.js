let state = {
    saleList: {},
    rule: {},
    checkRule: {}
}

let mutations = {
    updateForm(state, param) {
        state.saleList = param;
    },
    deleteForm(state) {
        state.saleList = {};
    },
    /**
     * @function updateChildRule - 保存添加子规则
     */
    updateChildRule(state, param) {
        state.rule = param;
    },
    /**
     * @function deleteChildRule - 删除添加子规则
     */
    deleteChildRule(state) {
        state.rule = {};
    },
    /**
     * @function updateCheckRule - 查看子规则
     */
    updateCheckRule(state, param) {
        state.checkRule = param;
    },
    /**
     * @function deleteCheckRule - 删除子规则
     */
    deleteCheckRule(state) {
        state.checkRule = {};
    },
}

let getters = {
    getForm(state) {
        return state.saleList;
    },
    getChildRule(state) {
        return state.rule;
    },
    getCheckRule(state) {
        return state.checkRule;
    }
}

let store = {
    namespaced: true,
    state,
    mutations,
    getters
}

export default store;