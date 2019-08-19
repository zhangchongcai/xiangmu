<template>
  <div class="entity-card-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="批次号：" prop="cardBatchNo">
        <el-input v-model="formData.cardBatchNo" @blur="()=>{formData.cardBatchNo = formData.cardBatchNo.trim()}"
          placeholder="请输入卡批次编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="批次名称：" prop="cardBatchName">
        <el-input v-model="formData.cardBatchName" @blur="()=>{formData.cardBatchName = formData.cardBatchName.trim()}"
          placeholder="请输入卡批次名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="政策名称：" prop="cardProductId">
        <el-select v-model="formData.cardProductId" placeholder="请选择卡政策" filterable clearable>
          <el-option v-for="item in cardNameOptions" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡类型：" prop="cardType">
        <el-select v-model="formData.cardType" placeholder="全部类型" clearable disabled>
          <el-option v-for="item in cardTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：" prop="date">
        <el-date-picker style="width:256px" v-model="formData.date" type="daterange" align="right" unlink-panels
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="领用影院：" prop="receiveCinemaName">
        <el-input v-model="formData.receiveCinemaName"
          @blur="()=>{formData.receiveCinemaName = formData.receiveCinemaName.trim()}" placeholder="请输入影院名称" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="head-info-wrap">
      <div class="data-title">数据更新于 {{startOpenDate}}</div>
      <div>
        <el-button @click="handleApplyCard('apply')" size="small" plain
          class="_el-btn-custom _member-custom-ghost-button">
          领用
        </el-button>
      </div>
    </div>
    <div class="entity-card-list-table _m-member-table-custom">
      <el-table :data="tableDataList" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="createTime" label="创建时间" min-width="135" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchNo" label="批次号" min-width="105" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchName" label="批次名称" min-width="95" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cardProductName" label="政策名称" min-width="95" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="cardProductType" label="卡类型" min-width="70" :formatter="formateEmpty" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="cardValue" label="金额" min-width="65" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchCount" label="总张数" min-width="65" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cinemaReceiveCount" label="已领用" min-width="65" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="cinemaNoReceiveCount" label="未领用" min-width="65" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="cardBatchCinemaVOList" label="领用影院" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!scope.row.cardBatchCinemaVOList">-</span>
            <span
              v-else-if="scope.row.cardBatchCinemaVOList && scope.row.cardBatchCinemaVOList.length == 1">{{scope.row.cardBatchCinemaVOList[0].cinemaName}}</span>
            <span v-else @click="handleQueryCinema(scope.row.cardBatchCinemaVOList)"
              style="color:#3b74ff;cursor:pointer;">查看</span>
          </template>
        </el-table-column>
        <el-table-column prop="cinemaNeedReceiveCount" label="领用数量" min-width="95">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.cinemaNeedReceiveCount" class="used-num"></el-input> -->
            <el-input-number v-model="scope.row.cinemaNeedReceiveCount" :step="1" step-strictly :controls="false"
              :min='1' :max="scope.row.cinemaNoReceiveCount" class="used-num"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="cinemaNeedReturnCount" label="退还数量" min-width="95">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.cinemaNeedReturnCount" class="return-num"></el-input> -->
            <el-input-number v-model="scope.row.cinemaNeedReturnCount" :step="1" step-strictly :controls="false"
              :min='1' :max="scope.row.cinemaReceiveCount" class="return-num"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="170">
          <template slot-scope="scope">
            <el-button @click="handleCardbatchDetail(scope.row)" type="text" size="small" class="download-btn">查看
            </el-button>
            <el-button @click="handleApplyCard('return',scope.row.id)" type="text" size="small" class="download-btn">退还
            </el-button>
            <el-button @click="handleDownload(scope.row.id)" type="text" size="small" class="download-btn">下载Excel
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="current-0" :page-sizes="[20 , 50 , 100]" :page-size="pageSize-0"
        layout="total, sizes, prev, pager, next, jumper" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!-- 领用、退还影院弹层 -->
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="cinemaDialogVisible" :type="'2'"
      :whereUse="whereUse" @callBackSingle="handleCinemaCallBack" :innerData={}
      :dialogTitle="this.flag=='apply'?'选择领用影院':'选择退还影院'">
      <div slot="footerId">
        <el-button @click="cinemaDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData()">确定
        </el-button>
      </div>
    </singleCinema>
    <!-- 变更历史dialog -->
    <el-dialog title="领用影院信息" :visible.sync="cinemaInfoVisible" class="_mbmber-used-cinema-info-visible" width="576px">
      <div class="__table-wrap">
        <div class="_m-member-table-custom">
          <el-table :data="cinemaInfoList" stripe style="width: 100%" empty-text="暂无领用影院信息">
            <el-table-column prop="cinemaName" label="领用影院" min-width="110" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="cinemaReceiveCount" label="张数" min-width="110" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cinemaInfoVisible = false" class="_el-btn-custom">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import singleCinema from "../../../../frame_cpm/dialogs/cinemaDialog/singleCinema.vue";
export default {
  name: "ReceiveEntityCard",
  data() {
    return {
      cinemaInfoVisible: false,
      cinemaInfoList: [], //领用影院信息
      applyArr: [],
      flag: "",
      cardBatchCinemaVO: {},
      cinemaDialogVisible: false,
      whereUse: "1",
      tipMessage: "",
      formData: {
        cardBatchName: "",
        date: [
          new Date().addMonths(-1).formatDate("yyyy-MM-dd"),
          new Date().formatDate("yyyy-MM-dd")
        ],
        cardBatchNo: "",
        cardProductId: "",
        cardType: "gift_card", //卡类型
        receiveCinemaName: "" //领用影院
      },
      cardNameOptions: [],
      current: 1,
      pageSize: 20,
      total: 0,
      tableDataList: [],
      startOpenDate: new Date().addDays(0).formatDate("yyyy-MM-dd hh:mm:ss"),
      cardTypeOptions: [], //卡类型
      cardCurrent: 1,
      cardPageSize: 1000
    };
  },
  components: {
    singleCinema
  },
  created() {
    this.handleCardType();
    this.getCardbatchList();
    this.getCardproductList();
    // console.log(this.$crmList.cardbatchExport);
  },
  // activated() {
  //   this.getCardbatchList();
  //   this.getCardproductList();
  // },
  methods: {
    // 影院回调
    handleCinemaCallBack(opt) {
      if (opt.isCloseWindow) {
        this.cinemaDialogVisible = false;
        return false;
      } else {
        if (JSON.stringify(opt.data) != "{}") {
          if (this.flag == "return") {
            this.applyArr.forEach(item => {
              let cArr = JSON.parse(JSON.stringify(item.cardBatchCinemaVOList));
              let cIdArr = cArr.map(i => {
                return i.cinemaId;
              });
              if (cIdArr.indexOf(opt.data.id + "") > -1) {
                receiveReturnCinema.call(this);
              } else {
                this.$message.warning(
                  "该影院未领取当前批次礼品卡，请选择其他影院"
                );
                return false;
              }
            });
          } else {
            receiveReturnCinema.call(this);
          }
          function receiveReturnCinema() {
            this.cardBatchCinemaVO = {
              cinemaCode: opt.data.code,
              cinemaId: opt.data.id,
              cinemaName: opt.data.name
            };
            let newApplyArr = this.applyArr.map(item => {
              item.cardBatchCinemaVO = this.cardBatchCinemaVO;
              return item;
            });
            let data = { receiveCardBatchVOList: newApplyArr };
            this.$crmList
              .receiveBtach(data)
              .then(() => {
                this.getCardbatchList();
                this.$message.success(
                  `${this.flag == "apply" ? "领用" : "退还"}成功`
                );
                this.cinemaDialogVisible = false;
              })
              .catch(err => {
                console.log(err);
                // this.$message.error(
                //   `${this.flag == "apply" ? "领用" : "退还"}失败，请重试`
                // );
              });
          }
        } else {
          this.cinemaDialogVisible = true;
          this.$message.warning(
            `请选择${this.flag == "apply" ? "领用" : "退还"}影院`
          );
        }
      }
    },
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    },
    // 卡类型
    handleCardType() {
      let params = { tenantId: this.$store.state.loginUser.consumerId };
      let _this = this;
      _this.$crmList.getCardType(params).then(ret => {
        _this.cardTypeOptions = ret;
      });
    },
    getCardbatchList() {
      let _this = this;
      if (_this.formData.date == null) {
        _this.$message.warning("请选择查询时间");
        return false;
      }
      _this.tipMessage = "数据加载中...";
      let param = {
        current: _this.current,
        size: _this.pageSize,
        tenantId: _this.$store.state.loginUser.consumerId,
        cardBatchName: _this.formData.cardBatchName,
        startTime: _this.formData.date[0],
        endTime: _this.formData.date[1],
        cardBatchNo: _this.formData.cardBatchNo,
        cardProductId: _this.formData.cardProductId,
        cardProductType: _this.formData.cardType,
        receiveCinemaName: _this.formData.receiveCinemaName
      };
      _this.$crmList
        .receiveList(param)
        .then(ret => {
          if (ret.total == 0 || ret.data == null) {
            _this.tipMessage = "暂无数据";
          }
          for (var i = 0; i < ret.records.length; i++) {
            ret.records[i].cinemaNeedReceiveCount = undefined;
            ret.records[i].cinemaNeedReturnCount = undefined;
          }
          _this.tableDataList = ret.records;
          _this.current = ret.current;
          _this.pageSize = ret.size; // 每页数量
          _this.total = ret.total;
        })
        .catch(err => {
          console.log(err);
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = "系统繁忙，请稍后重试！";
          }
        });
    },
    getCardproductList() {
      let _this = this;
      let param = {
        cardType: "gift_card",
        current: _this.cardCurrent,
        size: _this.cardPageSize,
        tenantId: this.$store.state.loginUser.consumerId,
        status: "start"
      };
      _this.$crmList.cardproductList(param).then(ret => {
        _this.cardNameOptions = ret.records;
      });
    },
    search() {
      this.current = 1;
      this.getCardbatchList();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //   申请会员卡
    handleApplyCard(flag, id) {
      this.flag = flag;
      this.applyArr = [];
      this.tableDataList.map(item => {
        if (this.flag == "apply") {
          if (item.cinemaNeedReceiveCount) {
            item.cinemaNeedReturnCount = undefined;
            this.applyArr.push(item);
          }
        } else {
          if (item.cinemaNeedReturnCount && id == item.id) {
            item.cinemaNeedReceiveCount = undefined;
            this.applyArr.push(item);
          }
        }
      });
      console.log("this.applyArr===", this.applyArr);
      if (this.applyArr.length == 0) {
        this.$message.warning(
          `请填写${this.flag == "apply" ? "领用" : "退还"}数量`
        );
        return false;
      }
      if (this.flag == "return") {
        if (this.applyArr[0].cardBatchCinemaVOList == null) {
          this.$message.warning("没有领用影院，无法退还");
          return false;
        } else {
          this.cinemaDialogVisible = true;
        }
      } else {
        this.cinemaDialogVisible = true;
      }
    },
    // 下载Excel
    handleDownload(cardBatchId) {
      let url =
        this.$store.state.crm.domain +
        "/cardbatch/exportReceiveCard?cardBatchId=" +
        cardBatchId +
        "&tenantId=" +
        this.$store.state.loginUser.consumerId +
        "&token=" +
        this.$store.state.loginToken;
      window.open(url, "_blank");
    },
    // 查看领用影院
    handleQueryCinema(cinemaList) {
      this.cinemaInfoVisible = true;
      this.cinemaInfoList = cinemaList ? cinemaList : [];
    },
    handleSizeChange(val) {
      let _this = this;
      _this.pageSize = val;
      _this.getCardbatchList();
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.current = val;
      _this.getCardbatchList();
    },
    // 查看
    handleCardbatchDetail(scope) {
      this.$router.push({ path: "/member/membershipCard/cardBatchDetail" });
      sessionStorage.setItem("crmCardBatchInfo", JSON.stringify(scope));
    }
  }
};
</script>

<style lang='scss' >
.entity-card-list {
  // padding: 20px;
  .form-data-wrap {
    padding: 20px 20px 0;
    background: #f5f5f5;
    margin-bottom: 10px;
    .el-form-item {
      margin-right: 30px;
      .el-input__inner {
        width: 192px;
      }
    }
    .el-form-item__label {
      font-size: 12px;
      color: #717171;
      padding: 0 6px 0 0;
    }
    .el-date-editor .el-range-input {
      // color: #717171;
      font-size: 12px;
    }
    .el-date-editor .el-range-separator {
      font-size: 12px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 170px;
      color: #717171;
      font-size: 12px;
    }

    .el-input--suffix .el-input__inner {
      // width: 125px;
      color: #717171;
      font-size: 12px;
      padding-right: 0;
    }
  }
  .head-info-wrap {
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 2;
    .data-title {
      font-size: 12px;
      color: #b1b1b1;
      padding: 8px 0;
    }
    // .apply-card-btn {
    //   padding: 0 15px;
    //   height: 30px;
    // }
  }
  .entity-card-list-table {
    .used-num,
    .return-num {
      width: 80px;
      font-size: 12px;
      color: #333;
      .el-input__inner {
        height: 20px;
        line-height: 20px;
      }
    }
    .download-btn span,
    .change-btn span {
      font-size: 12px;
    }
  }
  .noData {
    margin: 15% auto;
    // margin: 230px auto;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #bcbcbc;
    letter-spacing: 0.19px;
    p {
      margin-top: 30px;
    }
  }
}
// 领用影院dialog
._mbmber-used-cinema-info-visible {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .__table-wrap {
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    .el-form-item {
      margin: 0 5px 5px 0;
    }
    .heightBug input {
      height: 32px !important;
    }
    .el-table__body-wrapper {
      overflow-y: auto;
      height: 417px;
      .el-table__body {
        border-collapse: collapse;
        tbody {
          tr:last-child {
            border-bottom: 1px solid #f0f0f0;
          }
        }
      }
    }
  }
  // .el-dialog__body {
  //   padding: 30px 20px 0;
  // }
}
</style>