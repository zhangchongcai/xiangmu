<template>
  <div class="page-wrapper">
    <crmCardTypeDialog @crmCardTypeDialogCallBack="handleCallback1" :reviewData="huixianData1" :dialogVisible.sync="dialogVisible2" />
    <el-button type="primary" @click="()=>{dialogVisible2=true}">会员卡政策</el-button>
  </div>
</template>

<script>
import crmCardTypeDialog from "frame_cpm/dialogs/film/testdialog.vue";
import { userList, resetPassword, orgList } from "frame_cpm/http/interface.js";
export default {
  name: "userList",
   components: {
    crmCardTypeDialog,
  },
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      huixianData1: [],
      huixianData2: [],
      huixianData3: []
    }
  },
  created() {
    // this.getUserList()
  },
  methods: {
    handleCallback1(res) {
      this.huixianData1 = res.data;
      console.log(this.huixianData1)
    },
    handleCallback2(res) {
      this.huixianData2 = res.data;
    },
    handleCallback3(res) {
      this.huixianData3 = res.data;
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
