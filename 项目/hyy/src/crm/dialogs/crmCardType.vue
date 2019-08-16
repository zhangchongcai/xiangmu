<template>
  <div>
    <dialogWarp :dialogVisible="dialogVisible" :name="customTitle" @crmDialogOutputFlag="handleCrmDialogFlag">
      <div class="__crm-available-coupon-wrap">
        <div class="__crm-available-coupon-dialog-content-wrap _crm-card-type-dialog-wrap">
          <div class="__crm-available-coupon-dialog-content-left">
            <div class="__crm-available-coupon-dialog-table _m-member-table-custom">
              <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" @select="handleSelect"
                @select-all="handleSelect" :row-key="getRowKeys">
                <el-table-column type="selection" width="55" :reserve-selection="true">
                </el-table-column>
                <el-table-column prop="cardType" :formatter="emptyShow" label="会员卡类型名称" min-width="120"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="cardTypeCode" :formatter="emptyShow" label="会员卡类型编号" min-width="120"
                  show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="__crm-available-coupon-dialog-content-right">
            <div class="__content-right-wrap">
              <div class="__content-right-title">
                已选卡类型
              </div>
              <div class="__clear-btn" @click="handleEmpty">清空</div>
            </div>
            <ul class="__selected-equity-wrap _custom-selected-equity-height">
              <li class="__selected-equity-item-inner" v-for="(item, index) of multipleSelectionItem" :key="index">
                <div class="__selected-equity-name-desc">{{item.cardType}}</div>
                <i class="el-icon-close __dialog-icon-delete" @click="dialogDeleteEquity(index)"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </dialogWarp>
  </div>
</template>
<script type="text/javascript">
import dialogWarp from "../views/member/components/dialogWarp/dialogWarp";

export default {
  data() {
    return {
      multipleSelectionItem: [], //临时选择的自有权益
      callBackData: [], //暴露出去的已选数据
      tableData: [] //table表格数据
    };
  },
  components: {
    dialogWarp
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    innerData: {
      // 默认查询的基础数据（查询条件）
      type: Object,
      default: () => {}
    },
    reviewData: {
      //回显数据
      type: Array,
      default: () => []
    },
    disableData: {
      //禁选数据
      type: Array,
      default: () => []
    },
    whereUse: {
      // 调用弹窗的识别参数
      type: String,
      default: "mainPageUnique"
    },
    customTitle: {
      // 自定义弹窗title
      type: String,
      default: "会员卡类型"
    }
  },
  mounted() {
    this.multipleSelectionItem = this.reviewData;
  },
  watch: {
    dialogVisible: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.multipleSelectionItem = this.reviewData;
          this.search();
        }
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
    // dialog内删除已选权益
    dialogDeleteEquity(index) {
      this.multipleSelectionItem.splice(index, 1);
      this.$refs.multipleTable.clearSelection();
      this.rowMultipleChecked(this.multipleSelectionItem);
    },
    // 清空dialog内已选权益
    handleEmpty() {
      this.multipleSelectionItem = [];
      this.$refs.multipleTable.clearSelection();
    },
    // 查询卡类型
    search() {
      this.tipMessage = "数据加载中...";
      this.$crmList
        .getCardType({ tenantId: this.$store.state.loginUser.consumerId })
        .then(data => {
          this.tipMessage = "暂无数据";
          if (!data.length) {
            this.tipMessage = "暂无数据";
          }
          this.tableData = data.map(item => {
            return { cardType: item.desc, cardTypeCode: item.code };
          });
          this.$refs.multipleTable.clearSelection();
          this.rowMultipleChecked(this.multipleSelectionItem);
        })
        .catch(err => {
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = "系统繁忙，请稍后重试！";
          }
        });
    },
    //数据为空格式化
    emptyShow(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    },
    getRowKeys(row) {
      return row.cardTypeCode;
    },
    //单一数据toggle
    rowOneToggle(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (
          row.cardTypeCode == this.multipleSelectionItem[index].cardTypeCode
        ) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据add
    rowOneAdde(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (
          row.cardTypeCode == this.multipleSelectionItem[index].cardTypeCode
        ) {
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据reomove
    rowOneRemove(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (
          row.cardTypeCode == this.multipleSelectionItem[index].cardTypeCode
        ) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
    },
    //手动选择卡类型
    handleSelect(selection, row) {
      if (row) {
        this.rowOneToggle(row);
      } else {
        if (selection.length == 0) {
          for (let index = 0; index < this.tableData.length; index++) {
            const item = this.tableData[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
    },
    // 卡类型回显
    rowMultipleChecked(selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableData.length; k++) {
            if (selectedArr[i].cardTypeCode == this.tableData[k].cardTypeCode) {
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[k],
                true
              );
              break;
            }
          }
        }
      }
    },
    handleCrmDialogFlag(flag) {
      this.$emit("update:dialogVisible", false);
      if (flag == 1) {
        this.callBackData = new Array(...this.multipleSelectionItem);
      } else if (flag == 0) {
        this.multipleSelectionItem = new Array(...this.reviewData);
      }
      var selectedData = {
        btnType: flag,
        whereUse: this.whereUse,
        data: this.callBackData
      };
      this.$emit("crmCardTypeDialogCallBack", selectedData);
    }
  }
};
</script>
<style lang="scss">
._crm-card-type-dialog-wrap {
  margin-top: -5px;
  ._custom-selected-equity-height {
    height: 428px;
  }
  .el-table__body-wrapper {
    height: 449px !important;
  }
}
</style>