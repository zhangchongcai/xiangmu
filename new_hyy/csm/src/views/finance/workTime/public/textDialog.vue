<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="dialogTableVisible" id="wrap" ref="print">
      <el-form label-width="60px" :inline="true">
        <div>
          <el-form-item label="单号" class="two_search">
            {{billCode}}
          </el-form-item>
        </div>
      </el-form>
      <div class="border_div">
        <el-table :data="gridData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0} highlight-current-row border>
          <el-table-column property="subjectName" label="资金项目"></el-table-column>
          <el-table-column property="payTypeCode" label="支付方式"></el-table-column>
          <el-table-column property="changeValue" label="调整值"></el-table-column>
          <el-table-column property="remarks" label="摘要说明"></el-table-column>
        </el-table>
      </div>
      <div class="btn-area">
        <el-button type="primary" v-print="'#wrap'">打印</el-button>
        <el-button type="primary" @click="exportThis()">导出Excel</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import Print from '../clearAccount/vue-print'
// import config from 'frame_cpm/http/config.js';
import Axios from 'axios';
Vue.use(Print); // 打印注册
export default {
  data () {
    return {
      dialogTableVisible: false,
      title: "",
      showWhich: "",
      pageData: {}, // 分页信息
      gridData: [], // 表格数据
      userName: "",
      userUid: "",
      selectObj: {},
      billCode: "", // 单号
      uid: "",
      baseURL: this.$store.state.default.apiConfig.baseURL,
    }
  },
  methods: {
    exportThis () { // 倒出
      let limit = {
        uid: this.$route.query.uid
      };
      // let url = this.baseURL + "/trade/workTime/exportExcel?uid=" + this.$route.query.uid;
      let url = this.baseURL + "/trade/fundChange/exportExcel?uid=" + this.uid
      console.log(this.baseURL)
      // let store = this.$stroe
      let headers = {
        "Cpm-User-Token": sessionStorage.getItem("token")
      };
      // this.$ccmList.exportExcel({batchCode:param}).
      this.axios(url, {
        headers,
        method: "post",
        responseType: "blob",
        data: limit
      }).then(data => {
        console.log(data)
        let flag = data.headers;
        let message = data.msg ? data.msg : '班次收银导出失败！';
        let type = "warning";
        if (flag) {
          type = "success";
          message = '班次收银导出成功！';
          const blob = new Blob([data.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          const fileName = this.billCode;
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }
        this.$message({
          message
        });
      })
    }

  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.my_dialog {
  // .el-button{
  //   width: 80px;
  // }
  /deep/ .el-dialog {
    width: 576px;
    height: 576px;

    .el-form-item__label,
    .el-form-item__content {
      font-size: 12px;
      line-height: 32px;
    }

    .el-form-item {
      margin: 0;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #979797;
      font-size: 16px;
    }

    .el-dialog__header {
      padding: 16px 20px 12px;

      &::after {
        display: block;
        content: "";
        width: 536px;
        height: 1px;
        margin-top: 5px;
        background-color: #e5e5e5;
      }

      .el-dialog__close {
        font-size: 18px;
      }
    }

    .border_div {
      border: 1px solid #e5e5e5;
      margin-top: 11px;
      box-sizing: border-box;

      // flex-direction: column;
      .el-table {
        margin: 0;
        border: none;
        height: 410px;
        // overflow-y: scroll;
        width: 100%;

        .has-gutter tr th {
          padding: 0;
          height: 30px;
          line-height: 30px;
        }

        .cell {
          font-size: 12px;
          line-height: 30px;
        }

        .el-radio__label {
          padding: 0;
          display: none;
        }
      }
    }

    .el-dialog__body {
      padding: 0 20px;
      tr th,
      tr td {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #e5e5e5;
      }

      .two_search {
        width: 214px;
        font-size: 12px;
      }

      .one_search {
        width: 268px;
      }

      .block {
        margin: 15px 0 12px;

        .el-pagination {
          text-align: center;
        }
      }
    }

    .btn-area {
      margin: 12px 0;
      display: flex;
      justify-content: center;
    }

    /deep/ .content .el-input {
      width: 50px;
    }
  }
}
</style>
<style lang="scss" scoped media="print">
.btn-area {
  display: none;
}
.el-table {
  // width: 1200px;
  // height: 576px;
}
</style>
