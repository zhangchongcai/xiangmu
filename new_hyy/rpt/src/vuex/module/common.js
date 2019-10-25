const state = {
  clearTableData: {},
  isClear: false,
  adsUpdateTime: '',
  colData: [],
  isSent: false,
  pageArr: [],
  colArr: [],
  isSetTableHeader: false,
  isFilted: false,
  isGotData: false,
  isTableMouted: false
};

const mutations = {
  clearTableQueryData (state, data) {
    state.clearTableData = data;
    state.isClear = true;
  },
  resetIsClear (state, data) {
    state.isClear = data;
  },
  getUpdateTime (state, data) {
    state.adsUpdateTime = data.slice(0, -2);
  },
  sendSearchData (state, data) {
    state.colData = data;
    state.isSent = true;
  },
  resetIsSent (state) {
    state.isSent = false;
  },
  setPageArr (state, data) {
    if (data[1]) {
      let index;
      if (data[1] === true) {
        index = state.pageArr.findIndex(
          element => element == data[0].path.split('=')[1]
        );
      }
      if (data[1] === 1) {
        index = state.pageArr.findIndex(element => element == data[0]);
      }
      if (index != -1) state.pageArr.splice(index, 1);
    } else {
      state.pageArr.push(data[0]);
    }
  },
  setColArr (state, data) {
    state.colArr = data;
    state.isSetTableHeader = true;
  },
  setIsSetTableHeader (state) {
    state.isSetTableHeader = false;
  },
  setIsFilted (state, data) {
    state.isFilted = data;
  },
  getMergeTableData (state, data) {
    state.isGotData = data;
  },
  setTableMountedStatus (state, data) {
    state.isTableMouted = data;
  }
};

export default {
  state,
  mutations
};
