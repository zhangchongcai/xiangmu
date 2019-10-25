<template>
  <div class="query-dialog-wrapper">
    <div class="input-button">
      <div @mouseenter="showIcon" @mouseleave="hideIcon">
        <el-input v-model="multiCinemaObj[`${queryData.queryColKey}`].cinemaValue" :disabled="true">
          <i v-if="isShowIcon" class="iconfont icon-neiye-danchuangquxiao" slot="suffix" @click="handleIconClick"></i>
        </el-input>
      </div>
      <button class="edit-button" @click="openDialog">选择</button>
    </div>
    <my-dialog title="影院选择" :isShow="selectTreeValue" :dialogWidth="576" :dialogHeight="576" :dialogContentHeight="473" :marginTop="1" :marginBottom="1" @handleBtnComfirmClick="confirmTreeBtn" @handleBtnCancelClick="cancelTreeBtn" @close="handleClose">
      <div slot="dialog-content">
        <div class="search-content">
          <el-form>
            <el-form-item label="影院名称" style="width: 213px;">
              <el-input v-model="cinemaName" style="width:160px"></el-input>
            </el-form-item>
            <el-form-item label="影院编码" style="width: 213px;">
              <el-input v-model="cinemaCode" style="width:160px"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="searchClick">查询</el-button>
        </div>
        <div v-if="!Object.keys(resData).length" class="no-data">暂无数据</div>
        <div class="tree-content">
          <el-tree @node-click="nodeClick" :data="this.multiCinemaObj[`${this.queryData.queryColKey}`].newselectValue" show-checkbox default-expand-all node-key="applicableobj" ref="tree" highlight-current :props="defaultProps" icon-class="iconfont icon-neiye-zhankaijiantou" :default-checked-keys="multiCinemaObj[`${queryData.queryColKey}`].defaultCinemaArr" v-loading="multiCinemaLoading"></el-tree>
        </div>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import MyDialog from '../dataCommon/myDialog';
export default {
  props: {
    resetStatus: Boolean,
    multiCinemaObj: Object,
    queryData: Object,
    multiCinemaLoading: Boolean
  },
  components: {
    MyDialog
  },
  data () {
    return {
      cinemaName: '',
      cinemaCode: '',
      isShowIcon: false,
      selectTreeValue: false,
      filterText: '',
      defaultProps: {
        children: 'subtree',
        label: 'menuName'
      },
      loading: false,
      resData: {},
      cinemaArr: [],
      isSearch: false,
      selectedCinemaIdArray: []
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val);
    },
    resetStatus (newVal) {
      if (newVal) {
        this.multiCinemaObj[`${this.queryData.queryColKey}`].cinemaValue = '';
        this.selectedCinemaUidArr = [];
        this.$forceUpdate();
        this.$emit('selectMultiCinemaData', '');
      }
    }
  },
  created () {
    this.getData('', '');
    if (!this.multiCinemaObj[`${this.queryData.queryColKey}`])
      {this.multiCinemaObj[`${this.queryData.queryColKey}`] = {
        cinemaValue: "",
        newselectValue: [],
        defaultCinemaArr: []
      };}
  },
  methods: {
    handleIconClick () {
      this.multiCinemaObj[`${this.queryData.queryColKey}`].cinemaValue = '';
      this.selectedCinemaUidArr = [];
      this.$forceUpdate();
      this.$emit(
        'selectMultiCinemaData',
        this.multiCinemaObj[`${this.queryData.queryColKey}`].cinemaValue,
        this.queryData.queryName
      );
    },
    showIcon () {
      if (
        this.multiCinemaObj[`${this.queryData.queryColKey}`].cinemaValue !== ''
      )
        {this.isShowIcon = true;}
    },
    hideIcon () {
      this.isShowIcon = false;
    },
    confirmTreeBtn () {
      let checkedData = this.$refs.tree.getCheckedNodes(true, false);
      let checkedArr = [];
      let checkedMenuName = [];
      let cinemaName = '';
      let checkedMenuId = [];
      checkedData.forEach(element => {
        if (element.applicableobj) {
          checkedArr.push(element);
          checkedMenuName.push(element.menuName);
          checkedMenuId.push(element.applicableobj);
        }
      });
      let cinemaValueArray = checkedMenuName.join('、');
      let cinameIdArray = checkedMenuId.join(',');
      this.selectedCinemaIdArray = checkedMenuId;
      this.multiCinemaObj[
        `${this.queryData.queryColKey}`
      ].cinemaValue = cinemaValueArray.substring(0, cinemaValueArray.length);
      this.selectedCinemaUidArr = JSON.parse(JSON.stringify(checkedMenuId));
      this.$emit(
        'selectMultiCinemaData',
        cinameIdArray.substring(0, cinameIdArray.length),
        this.queryData.queryName
      );
    },
    cancelTreeBtn () {
      this.selectTreeValue = false;
    },
    handleNodeClick (data) { },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    openDialog () {
      this.cinemaName = '';
      this.cinemaCode = '';
      this.getData(this.cinemaName, this.cinemaCode);
      this.selectTreeValue = true;
      if (this.cinemaArr.length > 1) {
        this.multiCinemaObj[
          `${this.queryData.queryColKey}`
        ].defaultCinemaArr = [];
        this.multiCinemaObj[`${this.queryData.queryColKey}`].cinemaValue
          .split('、')
          .forEach(element1 => {
            this.cinemaArr.forEach(element2 => {
              if (element1 == element2.menuName)
                {this.multiCinemaObj[
                  `${this.queryData.queryColKey}`
                ].defaultCinemaArr.push(element2.applicableobj);}
            });
          });
      }
      this.$nextTick(() => {
        let treeLable = document.getElementsByClassName('el-tree-node__label');
        for (let i = 0; i < treeLable.length; i++) {
          if (treeLable[i].innerText === '')
            {treeLable[i].parentNode.style.display = "none";}
        }
      });
      this.$forceUpdate();
    },
    searchClick () {
      this.$emit('setMultiCinemaLoading', true);
      this.getData(this.cinemaName, this.cinemaCode);
      this.$emit('setMultiCinemaLoading', false);
      this.isSearch = true;
    },
    getData (cinemaName, cinemaCode) {
      this.$rptList
        .getCinemaTree(cinemaName, cinemaCode)
        .then(res => {
          this.resData = res;
          let cinemaTree = [];
          this.cinemaArr = [];
          this.formData(res);
          cinemaTree.push(res);
          this.getCinemaCount(cinemaTree);
          if (this.cinemaArr.length == 1 && this.isSearch == false) {
            this.multiCinemaObj[
              `${this.queryData.queryColKey}`
            ].defaultCinemaArr = [this.cinemaArr[0].applicableobj];
            this.multiCinemaObj[
              `${this.queryData.queryColKey}`
            ].cinemaValue = this.cinemaArr[0].menuName;
            this.$emit(
              'selectMultiCinemaData',
              String(this.cinemaArr[0].applicableobj),
              this.queryData.queryName
            );
            this.isSearch = false;
          }
          this.multiCinemaObj.newselectValue = cinemaTree;
          this.multiCinemaObj[
            `${this.queryData.queryColKey}`
          ].newselectValue = cinemaTree;
          if (Object.keys(res).length == 0) {
            this.$refs.tree.$el.style.display = 'none';
          } else {
            this.$refs.tree.$el.style.display = 'block';
          }
          this.$nextTick(() => {
            let treeLable = document.getElementsByClassName(
              'el-tree-node__label'
            );
            for (let i = 0; i < treeLable.length; i++) {
              if (treeLable[i].innerText === '') {
                treeLable[i].parentNode.style.display = 'none';
              }
            }
            treeLable[0].parentNode.style.display = 'block';
          });
          this.$forceUpdate();
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    nodeClick (data) { },
    handleClose () {
      this.selectTreeValue = false;
    },
    getCinemaCount (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].subtree) {
          this.getCinemaCount(data[i].subtree);
        } else {
          this.cinemaArr.push(data[i]);
        }
      }
    },
    formData (obj) {
      if (obj.subtree) {
        if (obj.cinemas) {
          obj.cinemas.forEach(item => {
            let data = {
              applicableobj: item.id,
              menuName: item.name
            };
            obj.subtree.push(data);
          });
        }
        if (obj.subtree.length == 0) {
          obj.subtree = [{}];
        } else {
          for (let i = 0; i < obj.subtree.length; i++) {
            let item = obj.subtree[i];
            if (item.subtree) {
              this.formData(item);
            }
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.select-button {
  // font-family: "MicrosoftYaHei";
  font-size: 12px;
  color: #3b74ff;
  letter-spacing: 0;
  text-align: center;
  width: 80px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #3b74ff;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
  }
}

/deep/ .input-button {
  display: flex;
  .el-input {
    margin-right: 8px;
    .el-input__inner {
      width: 192px;
      height: 32px;
      padding-left: 16px;
      padding-right: 26px;
      // font-family: "MicrosoftYaHei";
      font-size: 12px;
      color: #666666;
      background: #ffffff;
      border: 1px solid #bcbcbc;
      border-radius: 4px;
      text-overflow: ellipsis;
    }
    .el-input__suffix {
      right: 15px;
    }
    .iconfont {
      font-size: 10px;
      line-height: 32px;
      color: #3b74ff;
      margin-right: 4px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .edit-button {
    width: 80px;
    height: 32px;
    // font-family: "MicrosoftYaHei";
    font-size: 12px;
    color: #3b74ff;
    background: #ffffff;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
    }
  }
}

.search-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;

  .el-form {
    display: flex;
    height: 54px;

    .el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__label {
      padding-right: 0;
    }

    .el-form-item:nth-child(2) {
      margin-left: 16px;
    }

    /deep/ .el-form-item__label {
      line-height: 54px;
      font-size: 12px;
      color: #666666;
      padding-right: 4px;
    }

    /deep/ .el-form-item__content {
      display: inline-block;
      line-height: 54px;
    }
  }

  /deep/ .el-button {
    width: 80px;
    height: 32px;
    span {
      font-size: 12px;
      // font-family: "MicrosoftYaHei";
    }
  }
}
.no-data {
  margin-top: 40px;
  font-size: 12px;
  color: #bcbcbc;
  text-align: center;
}
.tree-content {
  margin-top: 10px;
  height: 370px;
  overflow: auto;
  /deep/ .el-tree {
    .el-tree-node__label {
      font-size: 12px;
      color: #666666;
      margin-left: 4px;
    }
    .el-tree-node__expand-icon {
      font-size: 10px;
      color: #666666;
    }
    .el-checkbox__inner {
      width: 12px;
      height: 12px;
    }
    .el-checkbox__inner::after {
      height: 5px;
      left: 3px;
    }
    .icon-neiye-zhankaijiantou:before {
      font-size: 8px;
    }
    .el-tree__empty-block {
      display: none;
    }
    .is-leaf {
      visibility: hidden;
    }
  }
}
</style>
<style lang="scss">
.search-content {
  .el-form {
    .el-form-item {
      .el-input__inner {
        background: #ffffff !important;
      }
    }
  }
}
</style>
