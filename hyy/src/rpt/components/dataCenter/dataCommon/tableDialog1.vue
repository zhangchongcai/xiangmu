<template>
  <div class="search-wrapper">
    <my-dialog
      :title="'筛选条件'"
      :dialogWidth="372"
      :dialogHeight="458"
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
          <!-- <button @click="handleSearchClick" class="search">搜索</button>
          <button @click="handleClearClick">清除筛选</button>-->
          <button @click="showDetailDialog">高级筛选</button>
        </div>
        <div class="data-wrapper">
          <div
            class="data-item"
            v-if="(showData.length === 0 && inputData === '') ||
            (showData.length !== 0 && inputData === '')"
            v-for="(item,index) in searchData"
            :key="index"
            :id="index"
            @click="handleItemClick(item,index)"
          >{{item}}</div>
          <div
            class="data-item"
            v-if="showData.length !== 0 && inputData !== ''"
            v-for="(item,index) in showData"
            :key="index"
            :id="index"
            @click="handleItemClick(item,index)"
          >{{item}}</div>
          <div
            class="data-item data-empty"
            v-if="showData.length == 0 && inputData != ''"
          >没有匹配到相关数据！</div>
        </div>
      </div>
    </my-dialog>
    <!-- <el-dialog
      title="筛选条件"
      width="372px"
      height="458px"
      :visible.sync="visible"
      @close="handleClose"
      :lock-scroll="false"
      :show-close="false"
    >
      <div class="input-wrapper">
        <el-input
          v-model="inputData"
          placeholder="请输入内容"
          autocomplete
          :clearable="true"
          suffix-icon="el-icon-circle-close"
          @change="inputChange"
        />
        <button @click="showDetailDialog">高级筛选</button>
      </div>
      <div class="data-wrapper">
        <div
          class="data-item"
          v-if="(showData.length === 0 && inputData === '') ||
            (showData.length !== 0 && inputData === '')"
          v-for="(item,index) in searchData"
          :key="index"
          :id="index"
          @click="handleItemClick(item,index)"
        >{{item}}</div>
        <div
          class="data-item"
          v-if="showData.length !== 0 && inputData !== ''"
          v-for="(item,index) in showData"
          :key="index"
          :id="index"
          @click="handleItemClick(item,index)"
        >{{item}}</div>
        <div class="data-item data-empty" v-if="showData.length == 0 && inputData != ''">没有匹配到相关数据！</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitClick">确 定</el-button>
        <el-button @click="handleCancelClick">取 消</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import datacenterBus from "../../../assets/datacenterBus.js";
import MyDialog from "./myDialog.vue";

export default {
  props: {
    dialogVisible1: Boolean,
    searchData: Array,
    colKey: String,
    tableName: String,
    reportCode: String
  },
  components: {
    MyDialog
  },
  data() {
    return {
      colValue: "",
      submitColValue: [],
      visible: false,
      showData: [],
      colData: [],
      inputData: ""
    };
  },
  methods: {
    //弹框关闭时的逻辑
    handleClose() {
      let dataItem = document.getElementsByClassName("data-item");
      for (let i = 0; i < dataItem.length; i++) {
        dataItem[i].style.background = "#f5f5f5";
        dataItem[i].style.color = "gray";
      }
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
          if (this.colData[i]["queryColKey"] == this.colKey) {
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
        datacenterBus.$emit("sendSearchData", this.colData);
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
        console.log(this.submitColValue);
        this.colValue = "";
        this.visible = false;
        this.$emit("sendSelectStatus", selectStatus);
      } else {
        this.$message({
          message: "请选择查询项",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
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
      let selectItem = document.getElementById(index);
      console.log(selectItem);
      selectItem.style.background = "#F0F0F0";
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
  updated() {
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

<style scoped>
</style>


