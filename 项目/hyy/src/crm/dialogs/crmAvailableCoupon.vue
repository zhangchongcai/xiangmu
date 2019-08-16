<template>
  <div>
    <dialogWarp :dialogVisible="dialogVisible" :name="customTitle" @crmDialogOutputFlag="handleCrmDialogFlag">
      <div class="__crm-available-coupon-wrap">
        <el-form :inline="true" :model="formData" ref="formData" class="__crm-available-coupon-search">
          <el-form-item label="可用券名称：" prop="couponName">
            <el-input v-model="formData.couponName" placeholder="可用券名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
            <!-- <el-button @click="resetForm('formData')" class="_el-btn-custom">重置</el-button> -->
          </el-form-item>
        </el-form>
        <div class="__crm-available-coupon-dialog-content-wrap">
          <div class="__crm-available-coupon-dialog-content-left">
            <div class="__crm-available-coupon-dialog-table _m-member-table-custom">
              <el-table ref="multipleTable" :empty-text="tipMessage" :data="tableData" stripe style="width: 100%"
                @select="handleSelect" @select-all="handleSelect" :row-key="getRowKeys">
                <el-table-column type="selection" width="55" :reserve-selection="true">
                </el-table-column>
                <el-table-column prop="applyCode" :formatter="emptyShow" label="票券申请单号" min-width="110"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="couponName" :formatter="emptyShow" label="票券名称" min-width="110"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="stateRemark" :formatter="emptyShow" label="票券申请单状态" min-width="110"
                  show-overflow-tooltip></el-table-column>
              </el-table>
              <!-- 分页 start -->
              <div class="page-wrap __crm-available-coupon-paginatioin">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :current-page="formData.current-0" :page-size="formData.size-0"
                  layout="total, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0">
                </el-pagination>
              </div>
              <!-- 分页 end -->
            </div>
          </div>
          <div class="__crm-available-coupon-dialog-content-right">
            <div class="__content-right-wrap">
              <div class="__content-right-title">
                已选可用券
              </div>
              <div class="__clear-btn" @click="handleEmpty">清空</div>
            </div>
            <ul class="__selected-equity-wrap">
              <li class="__selected-equity-item-inner" v-for="(item, index) of multipleSelectionItem" :key="index">
                <div class="__selected-equity-name-desc">{{item.couponName}}</div>
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
      tipMessage: "",
      total: 0,
      // 查询卡政策的数据
      formData: {
        couponName: "", //可用券名称
        saleMode: 2, //销售模式
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      multipleSelectionItem: [], //临时选择的可用券
      callBackData: [], //暴露出去的已选数据
      tableData: []
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
      default: "选择可用券"
    }
  },
  created() {},
  mounted() {
    this.multipleSelectionItem = this.reviewData;
    // this.search();
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
    // 点击搜索按钮
    handleSearch() {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 搜索可用券
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = "数据加载中...";
      this.$crmList
        .couponList(params)
        .then(data => {
          this.tipMessage = "暂无数据";
          if (data.total == 0) {
            this.tipMessage = "暂无数据";
          }
          this.tableData = data.records;
          this.total = data.total;
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
      return row.applyCode;
    },
    //单一数据toggle
    rowOneToggle(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.applyCode == this.multipleSelectionItem[index].applyCode) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据add
    rowOneAdde(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.applyCode == this.multipleSelectionItem[index].applyCode) {
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据reomove
    rowOneRemove(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.applyCode == this.multipleSelectionItem[index].applyCode) {
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
            if (selectedArr[i].applyCode == this.tableData[k].applyCode) {
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
      if (flag == 1) {
        if (new Array(...this.multipleSelectionItem).length == 0) {
          this.$message.warning("请至少选择一项可用券");
          return false;
        } else {
          this.callBackData = new Array(...this.multipleSelectionItem);
          this.$emit("update:dialogVisible", false);
        }
      } else if (flag == 0) {
        this.$emit("update:dialogVisible", false);
        this.multipleSelectionItem = new Array(...this.reviewData);
        this.callBackData = new Array(...this.multipleSelectionItem);
      }
      var selectedData = {
        btnType: flag,
        whereUse: this.whereUse,
        data: this.callBackData
      };
      this.$emit("crmAvailableCouponDialogCallBack", selectedData);
    }
  }
};
</script>
<style lang="scss">
</style>