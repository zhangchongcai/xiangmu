<template>
  <section>
    <el-select
      popper-class="rpt-select"
      v-model="value"
      @change="valueChange"
      class="transaction-order-type"
      multiple
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.keyCode"
        :label="item.keyName"
        :value="item.keyCode"
      ></el-option>
    </el-select>
  </section>
</template>

<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  name: "TradeTicketType",
  props: {
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: [
        "value"
      ],
      subComName: "transactionOrder",
      options: [],
      value: [],
      oldValue: []
    };
  },
  methods: {
    valueChange(val) {
      let transactionOrderTypeDom = document.getElementsByClassName(
        "transaction-order-type"
      );
      let el = transactionOrderTypeDom[0].children[0];
      console.log(el);
      let el_span = el.querySelector("span");
      el_span && el.removeChild(el_span);
      el.style.padding = " 0 10px";
      el.style.textOverflow = "ellipsis";
      el.style.fontSize = "12px";
      el.textContent = String(val).replace(/,/g, "、");

      const allValues = this.options.map(item => {
        return item.keyCode;
      });
      // 用来储存上一次选择的值，可进行对比
      const oldVal = this.oldValue.length > 0 ? this.oldValue : [];

      // 若选择全部
      if (val.includes("ALL_SELECT")) {
        this.value = allValues;
      }

      // 取消全部选中， 上次有， 当前没有， 表示取消全选
      if (oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT")) {
        this.value = [];
      }

      // 点击非全部选中，需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes("ALL_SELECT") && val.includes("ALL_SELECT")) {
        const index = val.indexOf("ALL_SELECT");
        val.splice(index, 1); // 排除全选选项
        this.value = val;
      }

      // 全选未选，但是其他选项都全部选上了，则全选选上
      if (!oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT")) {
        if (val.length === allValues.length - 1) {
          this.value = ["ALL_SELECT"].concat(val);
        }
      }

      // 储存当前选择的最后结果 作为下次的老数据
      this.oldValue = this.value;

      let orderValue = this.value.filter(item => {
        return item != "ALL_SELECT";
      });
      this.$emit("selectTransactionOrderData", orderValue.join(","));
    },

    MER_INTERFACE_STORE_BILL_SUBJECT() {
      this.$rptList
        .getDictionaryData({
          name: "MER_INTERFACE_STORE_BILL_SUBJECT"
        })
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            let data = [
              {
                keyCode: "ALL_SELECT",
                keyName: "全选"
              }
            ];
            this.options = data.concat(res.data);
          } else {
            this.error(res.msg);
          }
        });
    }
  },
  mounted() {
    this.MER_INTERFACE_STORE_BILL_SUBJECT();
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.value = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-select__tags {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 130px !important;
}

li.selected span {
  color: #3b74ff !important;
}
</style>
