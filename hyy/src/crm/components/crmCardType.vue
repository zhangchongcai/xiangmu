<template>
  <div>
    <dialogWarp :dialogVisible.sync="dialogVisible" name="会员卡类型" @crmDialogOutputFlag="handleCrmDialogFlag">
      <div class="_crm-card-type-dialog-wrap">
        <div class="_m-member-table-custom">
          <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect"
            :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="cardTypeCode" :formatter="emptyShow" label="会员卡类型编号" min-width="120"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="cardType" :formatter="emptyShow" label="会员卡类型名称" min-width="120"
              show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
    </dialogWarp>
    <el-button type="primary" @click="()=>{dialogVisible=true}">点击打开</el-button>
  </div>
</template>
<script type="text/javascript">
import dialogWarp from "../views/member/components/dialogWarp/dialogWarp";

export default {
  data() {
    return {
      dialogVisible: false, //控制弹窗显示隐藏
      multipleSelectionItem: [], //临时选择的自有权益
      callBackData: [], //暴露出去的已选数据
      tableData: [
        //table表格数据
        {
          cardTypeCode: "stored_card",
          cardType: "储值卡"
        },
        {
          cardTypeCode: "equity_card",
          cardType: "权益卡"
        },
        {
          cardTypeCode: "cobranded_card",
          cardType: "联名卡"
        }
      ]
    };
  },
  components: {
    dialogWarp
  },
  props: {
    dialogInnerData: {
      // 默认查询的基础数据
      type: Object,
      default: ()=>{}
    },
    dialogFeedbackData: {
      //回显数据
      type: Object,
      default: ()=>{}
    },
    disableData: {
      //禁选数据
      type: Object,
      default: ()=>{}
    },
    mainPageUnique: {
      // 调用弹窗的识别参数
      type: String,
      default: "mainPageUnique"
    }
  },
  created() {},
  mounted() {
      this.$refs.multipleTable.clearSelection();
      this.rowMultipleChecked()
  },
  methods: {
    //数据为空格式化
    emptyShow(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    },
    getRowKeys(row) {
      return row.id;
    },
    //单一数据toggle
    rowOneToggle(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].id) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据add
    rowOneAdde(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].id) {
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据reomove
    rowOneRemove(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].id) {
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
            if (selectedArr[i].id == this.tableData[k].id) {
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
      console.log("falag---", flag, typeof flag);
      if(flag == 1){
          this.callBackData = new Array(...this.multipleSelectionItem) ;
      }else if(flag == 0){
          this.multipleSelectionItem = new Array(...this.callBackData) ;
      }
      var selectedData = {
        btnType: flag,
        whereUse: this.mainPageUnique,
        data: this.callBackData
      };
      this.$emit("crmCardTypeDialogCallBack", selectedData);
    }
  }
};
</script>
<style lang="scss">
._crm-card-type-dialog-wrap {
  padding: 20px 0;
}
</style>