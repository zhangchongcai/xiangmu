<template>
  <div>
    <dialogWarp :dialogVisible="dialogVisible" name="会员卡政策" @crmDialogOutputFlag="handleCrmDialogFlag">
      <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
          <el-form-item label="政策名称：" prop="cardProductName">
            <el-input v-model="formData.cardProductName" placeholder="政策名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="政策编号：" prop="cardProductNo">
            <el-input v-model="formData.cardProductNo" placeholder="政策编号" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="el-btn-custom">搜索</el-button>
            <el-button @click="resetForm('formData')" class="el-btn-custom">重置</el-button>
          </el-form-item>
        </el-form>
      <div class="_crm-card-type-dialog-wrap">
        <div class="_m-member-table-custom">
          <el-table ref="multipleTable" :empty-text="tipMessage" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect"
            :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="code" label="影院编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="影院全称" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0"
        :page-size="formData.size-0" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
      </div>
    </dialogWarp>
  </div>
</template>
<script type="text/javascript">
import { authQueryUserCinemas } from "frame_cpm/http/interface.js";
import dialogWarp from "./dialogWrap";
export default {
  data() {
    return {
      searchAdition: {
        code: "",
        fullName: "",
        provinceCode: "",
        cityName: "",
        regionName: ""
      },
      tipMessage: "",
      total:0,
      // 查询卡政策的数据
      formData: {
        cardProductName: "", //政策名称
        cardProductNo: "",//政策编号：
        cardType: "", //卡类型
        channelNo: "", //适用影院（渠道id）
        status: "",
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      multipleSelectionItem: [], //临时选择的自有权益
      callBackData: [], //暴露出去的已选数据
      tableData: []
    };
  },
  components: {
    dialogWarp
  },
  props: {
    dialogVisible: {
      type:Boolean,
      default:false
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
          this.search();
        }
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
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
     // 搜索自有权益
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = "数据加载中...";
    //   this.$crmList
    //     .getCardTypeList(params)
    //     .then(data => {
    //       if (data.total == 0) {
    //         this.tipMessage = "暂无数据";
    //       }
    //       this.tableData = data.records;
    //       this.total = data.total;
    //       this.$refs.multipleTable.clearSelection();
    //       this.rowMultipleChecked(this.multipleSelectionItem);
    //     })
    //     .catch(err => {
    //       this.tipMessage = err.message;
    //     });
    let _this = this;
    //   let params = this.innerCinemaMultiData;
      let postObj = {
        fullName: this.searchAdition.fullName,
        code: this.searchAdition.code,
        type: this.$attrs.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      authQueryUserCinemas(postObj)
        .then(data => {
          if (data && data.code === 200) {
            if (data.total == 0) {
                this.tipMessage = "暂无数据";
            }
            this.tableData = data.data.rows;
            this.total = data.data.total;
            this.$refs.multipleTable.clearSelection();
            this.rowMultipleChecked(this.multipleSelectionItem);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
        if (
          row.productNo == this.multipleSelectionItem[index].productNo
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
          row.productNo == this.multipleSelectionItem[index].productNo
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
          row.productNo == this.multipleSelectionItem[index].productNo
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
      console.log("selectedData", selectedData);
      this.$emit("crmCardPolicyDialogCallBack", selectedData);
    }
  }
};
</script>
<style lang="scss">
._crm-card-type-dialog-wrap {
}
</style>