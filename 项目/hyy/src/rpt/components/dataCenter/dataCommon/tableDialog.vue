<template>
  <div class="advanced-search-wrapper">
    <el-dialog
      title="高级筛选"
      :visible.sync="visible"
      @close="handleClose"
      :lock-scroll="false"
      :show-close="false"
    >
      <div class="input-wrapper">
        <el-select v-model="value" placeholder="请选择条件">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入筛选内容"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">       
        <el-button type="primary" @click="handleSubmitClick">确 定</el-button>
        <el-button @click="handleCancelClick">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datacenterBus from "../../../assets/datacenterBus.js";

export default {
  props: {
    dialogVisible: Boolean,
    colKey: String,
    colData: Array
  },
  data() {
    return {
      visible: false,
      input: "",
      options: [
        {
          value: "=",
          label: "等于"
        },
        {
          value: "<",
          label: "小于"
        },
        {
          value: ">",
          label: "大于"
        },
        {
          value: ">=",
          label: "大于或等于"
        },
        {
          value: "=<",
          label: "小于或等于"
        },
        {
          value: "like",
          label: "类似"
        }
      ],
      value: ""
    };
  },
  methods: {
    handleClose() {
      datacenterBus.$emit('visibleStatus');
    },
    handleSubmitClick() {
      let colItem;
      if (this.value == "like") {
        colItem = {
          queryColKey: this.colKey,
          queryColValue: this.input + "%",
          operation: this.value,
          isAdvanced: true
        };
      } else {
        colItem = {
          queryColKey: this.colKey,
          queryColValue: this.input,
          operation: this.value,
          isAdvanced: true
        };
      }
      let selectStatus = {
        select: true,
        value: this.colKey
      };
      //处理高级搜索数据传递
      let colList = [];
      for (let i = 0; i < this.colData.length; i++) {
        if (this.colData[i].queryColKey != colItem.queryColKey) {
          colList.push(this.colData[i]);
        }
      }
      colList.push(colItem);
      if (colList[0].queryColValue != "" && colList[0].queryColValue != []) {
        console.log(colList)
        datacenterBus.$emit("sendSearchData", colList);
        this.$emit("sendSelectStatus", selectStatus);
        this.$emit("sendDialog1Visible")
        this.$emit("sendAdvancedData", colList);
        this.visible = false;
        colList = [];
        this.$forceUpdate();
      } else {
        this.$message({
          message: "请输入条件和内容",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
          center: "true"
        });
      }
    },
    handleCancelClick() {
      this.visible = false;
      datacenterBus.$emit('visibleStatus');
    }
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      this.visible = newVal;
    }
  }
};
</script>

<style scoped>
.input-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.input-wrapper .el-input__inner {
  color: '#666666';
  font-size: 12px;
}
</style>

