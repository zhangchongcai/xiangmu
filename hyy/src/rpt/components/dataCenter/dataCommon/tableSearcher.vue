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
        <el-select popper-class="rpt-select" v-model="tableSearcherObj.value" placeholder="请选择条件">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="tableSearcherObj.input" placeholder="请输入筛选内容"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitClick">确 定</el-button>
        <el-button @click="handleCancelClick">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datacenterBus from "src/rpt/util/datacenterBus.js";

export default {
  props: {
    dialogVisible: Boolean,
    colKey: String,
    colData: Array,
    tableSearcherObj: Object
  },
  data() {
    return {
      visible: false,
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
          label: "包含"
        }
      ],
    };
  },
  methods: {
    handleClose() {
      datacenterBus.$emit("visibleStatus");
    },
    handleSubmitClick() {
      let colItem;
      if (this.tableSearcherObj.value == "like") {
        colItem = {
          queryColKey: this.colKey,
          queryColValue: this.tableSearcherObj.input + "%",
          operation: this.tableSearcherObj.value,
          isAdvanced: true
        };
      } else {
        colItem = {
          queryColKey: this.colKey,
          queryColValue: this.tableSearcherObj.input,
          operation: this.tableSearcherObj.value,
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
        this.$store.commit("sendSearchData", colList);
        this.$emit("sendSelectStatus", selectStatus);
        this.$emit("sendDialog1Visible");
        this.$emit("sendAdvancedData", colList);
        this.visible = false;
        colList = [];
        this.$forceUpdate();
      } else {
        this.$message({
          message: "请输入条件和内容",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      }
    },
    handleCancelClick() {
      this.visible = false;
      datacenterBus.$emit("visibleStatus");
    }
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      this.visible = newVal;
    }
  }
};
</script>

<style scoped lang="scss">
.advanced-search-wrapper {
  // padding: 16px 20px;
  /deep/ .el-dialog {
    width: 372px;
    height: 157px;
    .el-dialog__header {
      padding: 16px 20px 0 20px;
      &::after {
        width: 332px;
      }
      .el-dialog__title {
        font-size: 14px;
        font-family: "MicrosoftYaHei";
      }
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .el-dialog__footer {
      padding: 20px 0 16px 0;
      .el-button {
        width: 80px;
        height: 32px;
        &:nth-child(2) {
          margin-left: 32px;
        }
        span {
          font-family: "MicrosoftYaHei";
          font-size: 12px;
        }
      }
    }
    .input-wrapper {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      .el-select {
        .el-input {
          margin-left: 0;
          width: 128px;
          height: 32px;
          font-size: 12px;
        }
      }
      .el-input {
        margin-left: 20px;
        width: 184px;
        height: 32px;
        font-size: 12px;
      }
    }
  }
}

.el-select-dropdown__item {
  font-size: 12px;
}

.el-select-dropdown__item.selected {
  color: rgb(51, 51, 51);
  background: rgb(240, 240, 240);
  font-weight: normal;
}
</style>

