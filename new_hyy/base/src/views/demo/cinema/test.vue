<template>
  <div class="page-wrapper">
    <frameMulticinema @frameCinemaDialogCallBack="handleCallback" :reviewData="huixianData" :dialogVisible.sync="dialogVisible" :whereUse="whereUse" :innerCinemaMultiData="innerData" :disabledData="disabledData" />
    <el-button type="primary" @click="handleSelect(1)">影院1</el-button>
    <div>
      <el-tag v-for="item in selectedCinama1" :key="item.id">{{item.fullName}}</el-tag>
    </div>
    <el-button type="primary" @click="handleSelect(2)">影院2</el-button>
    <div>
      <el-tag v-for="item in selectedCinama2" :key="item.id">{{item.fullName}}</el-tag>
    </div>
    <el-button type="primary" @click="handleSelect(3)">影院3</el-button>
    <div>
      <el-tag v-for="item in selectedCinama3" :key="item.id">{{item.fullName}}</el-tag>
    </div>
  </div>
</template>

<script>
import frameMulticinema from 'baseSrc/dialogs/cinemaDialog/multiCinema2.vue';
export default {
  name: 'cinemaDialogDemo',
  components: {
    frameMulticinema
  },
  data () {
    return {
      dialogVisible: false,
      huixianData: [],
      disabledData: [],
      whereUse: undefined,
      innerData: {
        // 1 所有影院  2 用户授权影院
        type: 2
      },
      selectedCinama1: [],
      selectedCinama2: [],
      selectedCinama3: []
    };
  },
  created () {
    // this.getUserList()
  },
  methods: {
    handleSelect (index) {
      switch (index) {
        case 1:
          this.whereUse = 1;
          this.huixianData = this.selectedCinama1;
          this.disabledData = [...this.selectedCinama2, ...this.selectedCinama3];
          console.log(this.disabledData);
          break;
        case 2:
          this.whereUse = 2;
          this.huixianData = this.selectedCinama2;
          this.disabledData = [...this.selectedCinama1, ...this.selectedCinama3];
          console.log(this.disabledData);
          break;
        case 3:
          this.whereUse = 3;
          this.huixianData = this.selectedCinama3;
          this.disabledData = [...this.selectedCinama1, ...this.selectedCinama2];
          console.log(this.disabledData);
          break;
      }
      this.dialogVisible = true;
    },
    selectableFunc (row, index) {
      if (row.disabled == true) {
        return false;
      } else {
        return true;
      }
    },
    handleCallback (res) {
      switch (this.whereUse) {
        case 1:
          this.selectedCinama1 = res.data;
          this.disabledData = [...this.selectedCinama1, this.selectedCinama2, this.selectedCinama3];
          break;
        case 2:
          this.selectedCinama2 = res.data;
          this.disabledData = [...this.selectedCinama1, this.selectedCinama2, this.selectedCinama3];
          break;
        case 3:
          this.selectedCinama3 = res.data;
          this.disabledData = [...this.selectedCinama1, this.selectedCinama2, this.selectedCinama3];
          break;
      }
    }
  }
};
</script>
<style lang="scss">
.el-input__inner {
  width: 150px;
}
.el-form-item__label {
  padding: 0;
}
.cell span {
  color: #3b74ff;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.bread {
  width: 100%;
  height: 20px;
}

.detail {
  .companySpan {
    display: inline-block;
    width: 40px;
    height: 32px;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    background-color: #3b74ff;
    color: #fff;
    margin-top: 4px;
    i {
      font-size: 30px;
    }
  }
  .newBuild {
    width: 100%;
    height: 60px;
    background-color: #ccc;
    border-top: #8b8b8b;
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
    /*p{*/
    /*    color: orangered;*/
    /*    margin-left: 20px;*/
    /*}*/
  }
  .table {
    width: 96%;
    margin: 30px auto;
  }
}
.window {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(204, 204, 204, 0.9);
  z-index: 1000;
  .treeBox {
    width: 500px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    top: 20%;
    left: 30%;
    border-radius: 2%;
    .title {
      font-size: 20px;
      text-align: left;
      text-indent: 20px;
      line-height: 40px;
      color: #8b8b8b;
      i {
        display: inline-block;
        float: right;
        font-size: 20px;
        font-weight: bolder;
        margin: 10px;
        &:hover {
          color: red;
          font-size: 25px;
        }
      }
    }
    .border {
      width: 100%;
      height: 1px;
      background-color: #ccc;
      margin: 6px 0;
    }
    .message {
      width: 90%;
      height: 60%;
      overflow-y: scroll;
      border: 1px solid #91bbe9;
      margin: 20px auto;
    }
    .btn {
      width: 90%;
      display: flex;
      justify-content: flex-end;
      margin: 20px auto;
    }
  }
}
</style>
