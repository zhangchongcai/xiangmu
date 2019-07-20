<template>
  <div class="search-wrapper">
    <my-dialog
      :title="'筛选条件'"
      :dialogWidth="372"
      :dialogHeight="458"
      :marginTop="1"
      :marginBottom="1"
      :isShow="visible"
      @handleBtnComfirmClick="handleSubmitClick"
      @handleBtnCancelClick="handleCancelClick"
      @close="handleClose"
    >
      <div slot="dialog-content">
        <div class="input-wrapper">
          <el-input
            v-model="inputData"
            placeholder="请输入内容"
            autocomplete
            :clearable="true"
            suffix-icon="el-icon-circle-close"
            @change="inputChange"
          />
          <!-- <button @click="handleSearchClick" class="search">搜索</button> -->
          <button class="clear-button" @click="handleClearClick">清除筛选</button>
          <button @click="showDetailDialog">高级筛选</button>
        </div>
        <div class="data-wrapper">
          <template
            v-if="(showData.length === 0 && inputData === '') ||
            (showData.length !== 0 && inputData === '')"
          >
            <div
              class="data-item"
              v-for="(item,index) in searchData"
              :key="`data-item-${index}`"
              :ref="`dataItem${index}`"
              :id="index"
              @click="handleItemClick(item,index)"
            >{{item}}</div>
          </template>
          <template v-if="showData.length !== 0 && inputData !== ''">
            <div
              class="data-item"
              v-for="(item,index) in showData"
              :ref="`dataItem${index}`"
              :key="index"
              :id="index"
              @click="handleItemClick(item,index)"
            >{{item}}</div>
          </template>

          <div
            class="data-item data-empty"
            v-if="showData.length == 0 && inputData != ''"
          >没有匹配到相关数据！</div>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import datacenterBus from "src/rpt/util/datacenterBus.js";
import MyDialog from "./myDialog.vue";
import mixins from "src/frame_cpm/mixins/cacheMixin.js";

export default {
  mixins: [mixins.cacheMixin],
  props: {
    dialogVisible1: Boolean,
    searchData: Array,
    colKey: String,
    tableName: String,
    reportCode: String,
    advancedData: Array
  },
  components: {
    MyDialog
  },
  data() {
    return {
      cacheField: [
        "colValue",
        "submitColValue",
        "showData",
        "colData",
        "inputData",
      ],
      subComName: "tableFilter",
      colValue: "",
      submitColValue: [],
      visible: false,
      showData: [],
      colData: [],
      inputData: ""
    };
  },
  methods: {
    changeDataItemStatus(domItem, backgroundColor, color) {
      let dataItem = document.getElementsByClassName(domItem);
      for (let i = 0; i < dataItem.length; i++) {
        dataItem[i].style.background = backgroundColor;
        dataItem[i].style.color = color;
      }
    },
    //清除筛选
    handleClearClick() {
      let clearData = {};
      let selectedData = JSON.parse(JSON.stringify(this.colData));
      this.visible = false;
      this.changeDataItemStatus("data-item", "white", "rgb(51, 51, 51)");
      this.$emit("sendSelectStatus", {
        select: false,
        value: this.colKey
      });
      console.log(selectedData, this.advancedData);
      this.advancedData.forEach(element => {
        delete element.isAdvanced;
        selectedData.push(element);
      });
      // console.log(this.colKey);
      // console.log(this.colData);
      console.log(selectedData);
      selectedData.forEach(element => {
        if (element.queryColKey === this.colKey) {
          clearData.operation = element.operation;
          clearData.queryColKey = element.queryColKey;
          clearData.queryColValue = element.queryColValue;
        }
      });
      console.log(clearData);
      for (let i = 0; i < this.colData.length; i++) {
        if (this.colData[i].queryColKey === this.colKey) {
          this.colData.splice(i, 1);
        }
      }
      // datacenterBus.$emit("clearTableQueryData", clearData);
      this.$store.commit("clearTableQueryData", clearData);
    },
    //弹框关闭时的逻辑
    handleClose() {
      this.changeDataItemStatus("data-item", "#f5f5f5", "gray");
      this.colValue = [];
      this.showData = [];
      this.visible = false;
      datacenterBus.$emit("visibleEvent", false);
    },
    //点击取消按钮时的逻辑
    handleCancelClick() {
      this.showData = [];
      this.colValue = [];
      this.visible = false;
    },
    handleSubmitClick() {
      let colItem = {
        queryColKey: this.colKey,
        queryColValue: this.colValue,
        operation: "="
      };
      let selectStatus = {
        select: true,
        value: this.colKey
      };
      //保证提交筛选项时每个弹框有且仅有一个选中
      if (this.colData.length != 0) {
        for (let i = 0; i < this.colData.length; i++) {
          if (this.colData[i].queryColKey == this.colKey) {
            this.colData.splice(i, 1);
          }
        }
      }
      this.colData.push(colItem);
      //发出查询信息
      if (
        this.colData[0].queryColValue != "" &&
        this.colData[0].queryColValue != []
      ) {
        console.log(this.colData);
        this.$store.commit("sendSearchData", this.colData);
        //保存每次选择的数据
        if (this.submitColValue.length === 0) {
          this.submitColValue.push({
            colValue: this.colValue,
            colKey: this.colKey
          });
        } else {
          for (let i = 0; i < this.submitColValue.length; i++) {
            if (this.submitColValue[i].colKey === this.colKey) {
              this.submitColValue.splice(i, 1);
            }
          }
          this.submitColValue.push({
            colValue: this.colValue,
            colKey: this.colKey
          });
        }
        this.colValue = "";
        this.visible = false;
        this.$emit("sendSelectStatus", selectStatus);
      } else {
        this.$message({
          message: "请选择查询项",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      }
      this.showData = [];
    },
    showDetailDialog() {
      this.$emit("showDetailDialog", true);
    },
    inputChange(data) {
      this.inputData = data;
    },
    //点击选中调整样式并处理选中数据
    handleItemClick(item, index) {
      console.log(item, index);
      this.colValue = item;
      let dataItem = document.getElementsByClassName("data-wrapper")[0]
        .children;
      for (let i = 0; i < dataItem.length; i++) {
        dataItem[i].style.background = "white";
        dataItem[i].style.color = "#333333";
      }
      let selectItem = this.$refs[`dataItem${index}`][0];
      console.log(selectItem);
      selectItem.style.background = "#F0F0F0";
      console.log(selectItem.style.background);
    }
  },
  watch: {
    inputData(newVal, oldVal) {
      setTimeout(() => {
        this.$rptList
          .getFuzzySearchData(
            this.tableName,
            this.colKey,
            this.reportCode,
            newVal
          )
          .then(res => {
            this.showData = res.data.result;
          });
      }, 200);
    },
    visible(newVal, oldVal) {
      this.inputData = "";
    },
    dialogVisible1(newVal, oldVal) {
      console.log(this.visible);
      this.visible = newVal;
      console.log(this.visible);
    }
  },
  created() {
    datacenterBus.$on("sendSearchDataToDialog1", data => {
      console.log(this.colData, data);
      this.colData.push(data);
      console.log(this.colData, data);
    });
  },
  updated() {
    datacenterBus.$on("sendSearchDataToDialog1", data => {
      console.log(this.colData, data);
      // this.colData.forEach(element => {
      //   if(element.queryColKey !== data.queryColKey) {
      //     this.colData.push(data);
      //   }
      // })
      this.colData.push(data);
      console.log(this.colData, data);
    });
    if (document.getElementsByClassName("data-wrapper")[0]) {
      let dataItem = document.getElementsByClassName("data-wrapper")[0]
        .children;
      for (let i = 0; i < dataItem.length; i++) {
        dataItem[i].style.background = "white";
        dataItem[i].style.color = "#333333";
        this.submitColValue.forEach(element => {
          if (
            dataItem[i].innerHTML === element.colValue &&
            this.colKey === element.colKey
          ) {
            dataItem[i].style.background = "#F0F0F0 ";
            this.colValue = dataItem[i].innerHTML;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search-wrapper {
  .dialog-content {
    .input-wrapper {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      .el-input {
        width: 232px;
        height: 32px;
        .el-icon-circle-close {
          cursor: pointer;
        }
      }
      button {
        width: 80px;
        height: 32px;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        color: white;
        border: none;
        border-radius: 4px;
        background: #3b74ff;
        &:hover {
          cursor: pointer;
          background: #0f55ff;
        }
      }
      .clear-button {
        margin: 0 8px;
      }
    }
    .data-wrapper {
      margin-top: 13px;
      padding-top: 12px;
      width: 100%;
      height: 275px;
      border-top: 1px solid #e5e5e5;
      box-sizing: border-box;
      overflow-x: hidden;
      .data-item {
        padding-left: 15px;
        width: 332px;
        height: 30px;
        line-height: 30px;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        color: #666666;
        background: white;
        &:hover {
          cursor: pointer;
          background: #f0f0f0 !important;
        }
      }
      .data-empty {
        padding-left: 0;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        color: #666666 !important;
        text-align: center;
        &:hover {
          cursor: pointer;
          background: #f0f0f0 !important;
        }
      }
    }
  }
}
</style>




