<template>
  <div>
    <!-- table -->
    <transition name="fade">
      <div
        class="card-list-table"
        v-show="isShowTable">
        <div class="searchAndWrite">
          <el-form
            :inline="true"
            @submit.native.prevent>
            <el-form-item
              label="会员卡号"
              class="row-line-center">
              <el-input
                @keyup.enter="getCardPoolList(1)"
                v-model="cardNo"
                placeholder="会员卡号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="common-btn"
                type="primary"
                @click="getCardPoolList(1)">查询</el-button>
              <el-button
                class="common-btn"
                type="primary"
                @click="handleWriteCard">写卡</el-button>
              <el-button
                class="common-btn"
                @click="cancelShwoTable">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="card-table">
          <el-table
            :data="tableData"
            @row-click='handleRowClick'
            :header-cell-style="getRowClass"
            v-loading="tableLoading">
            <el-table-column
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-radio
                  @change.native="getCurrentRow(scope.$index)"
                  :label="scope.$index"
                  v-model="newRadio"
                >&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item,index) in tableList"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :total="tableTotal"
            :page-size="11"
            :current-page.sync='current'
            @current-change='getCardPoolList'
            style="height:4vh;">
          </el-pagination>
        </div>
      </div>
    </transition>
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="50%"
      center>
      <div style="text-align:center">
        <img
          src="./payLoading/wait_pay.png"
          class="pay_wait">
        <p
          style="margin-top:1vw"
          v-if="!dialogWirteSuccess">卡号为已写卡状态，是否覆盖原卡号</p>
        <p
          style="margin-top:1vw"
          v-if="dialogWirteSuccess">写卡成功 {{second}} 秒后跳转至会员服务</p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="!dialogWirteSuccess">
        <el-button
          type="primary"
          @click="coverCard">覆盖卡号</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MemberAjax } from "src/http/memberApi.js";
import { mapGetters ,mapState} from 'vuex'
import { readCard , writeCard ,resetCardPwd} from '../util/utils';
export default {
  model:{
    prop:'radio',
    event:'change'
  },
  props: {
    isShowTable: {
      type: Boolean
    },
    cardProductId:{
        type:String
    },
    radio:{
      type:String | Number
    }
  },
  data() {
    return {
      cardNo: "",
      current: 1,
      tableTotal: 0,
      tableData: [],
      writeCardData: "", //写卡数据
      centerDialogVisible: false,
      dialogWirteSuccess: false, //写卡成功dialog
      second: 3, //成功倒计时
      readCardNo: "", //读卡器读出的卡
      tableLoading: false, //table 获取数据
      tableList: [
        { prop: "batchNo", label: "卡批次号" },
        { prop: "cardNo", label: "卡号" },
        { prop: "cardValue", label: "预充值金额" },
        { prop: "cardType", label: "卡类型" },
        { prop: "isWrite", label: "状态" }
      ]
    };
  },
  computed:{
    ...mapState(['member',"config"]),
    ...mapGetters(['tenantId','operator']),
    newRadio:{
      get:function(){
        return this.radio;
      },
      set:function(value){
        this.$emit('change', value);
      }
    }
  },
  watch:{
      isShowTable(value){
          if(value)this.getCardPoolList(1)
      }
  },
  methods: {
    //表头颜色设置
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#e5eafd;color:#333";
      }
    },
    //取消
    cancelShwoTable() {
      this.newRadio = "";
      this.cardNo = "";
      this.$emit('update:isShowTable',!this.isShowTable)
    },
    //获取该卡政策下的卡列表
    getCardPoolList(current, cardProductId = this.cardProductId , cardNo = this.cardNo) {
      this.tableLoading = true;
      this.current = current;
      this.newRadio = "";
      let _params = {
        cardNo: cardNo,
        cardProductId: cardProductId,
        current: current || this.current,
        size: 11,
        tenantId: this.tenantId
      };
      MemberAjax.getCardPoolList(_params)
        .then(res => {
          this.tableLoading = false;
          if (res.code === 200 && res.data) {
            this.tableData = res.data.records;
            this.tableTotal = Number(res.data.total);
          } else {
            this.tableData = [];
            this.tableTotal = 0;
            this.$message.warning(res.msg);
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //点击单选狂获取行数据
    getCurrentRow(index) {
      this.newRadio = index;
      this.writeCardData = this.tableData[index];
    },
    //点击获取行数据
    handleRowClick(item) {
      this.newRadio = this.tableData.indexOf(item);
      this.writeCardData = item;
    },
    //写卡 检测
    async handleWriteCard() {
      let _query = this.writeCardData;
      if (!this.newRadio.toString()) return this.$message.warning("请选择一个卡号");
      let resetCard = await resetCardPwd(this.config.configData);
      if(resetCard.indexOf('0')>=0){
        let response = await readCard(this.config.configData);
        this.readCardNo = response.replace(/\,| \，/g, "");
        let params = {
          batchId: _query.batchId || "",
          selectCardNo: _query.cardNo,
          readCardNo: this.readCardNo || "",
          tenantId: this.tenantId
        };
        MemberAjax.checkWriteStatus(params).then(async res => {
          if (res.code === 200) {
            let iswrite = await writeCard(this.config.configData, _query.cardNo);
            if (iswrite.toString().indexOf("0") >= 0) {
              this.handleWriteCardSubmit(_query);
            } else {
              this.$message.warning(iswrite);
            }
          } else if (res.code === 202) {
            this.centerDialogVisible = true;
          } else {
            this.$message.warning(res.msg);
          }
        });
      }
    },
    //写卡操作
    handleWriteCardSubmit(query) {
      let _query = query;
      let params = {
        batchId: _query.batchId,
        cardNo: _query.cardNo,
        readCardNo: this.readCardNo,
        tenantId: this.tenantId
      };
      MemberAjax.writeCard(params).then(res => {
        if (res.code === 200) {
          this.dialogWirteSuccess = true;
          this.centerDialogVisible = true;
          let t = setInterval(() => {
            if (this.second <= 0) {
              this.second = 3;
              clearInterval(t);
              this.$router.go(-1);
            }
            this.second -= 1;
          }, 1000);
        }
      });
    },
    //覆盖卡号
    async coverCard() {
      let _query = this.writeCardData;
      let iswrite = await writeCard(this.config.configData, _query.cardNo);
      if (iswrite.toString().indexOf("0") >= 0) {
        this.handleWriteCardSubmit(_query);
      } else {
        this.$message.warning(iswrite);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.card-list-table {
  position: absolute;
  top: 6.3vh;
  background-color: #fff;
  width: 100%;
  height: 93.7vh;
  z-index: 888;
  .searchAndWrite,
  .card-table {
    width: 90%;
    margin: 0 auto;
  }
  .el-form--inline {
    display: flex;
    justify-content: space-between;
  }
  .el-form-item {
    margin: 1.5vh 0;
  }
  /deep/ .el-table {
    td,
    th {
      padding: 0;
    }
    .cell {
      height: 6vh;
      line-height: 6vh;
      text-align: left !important;
      font-size: $font-size12;
    }
  }
  .pagination {
    margin-top: 3vh;
    margin-bottom: 3vh;
  }
}
.pay_wait {
  width: 95px;
  height: 98px;
}
</style>