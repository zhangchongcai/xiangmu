<template>
  <section>
    <el-select v-model="value" @change="valueChange" multiple placeholder="请选择">
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
export default {
  name: "TradeTicketType",
  data() {
    return {
      options: [],
      value: [],
      oldValue: []
    };
  },
  methods: {
    valueChange(val) {
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

      this.$emit(
        "selectTransactionOrderData",
        this.value.filter(item => {
          return item != "ALL_SELECT";
        })
      );
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
  }
};
</script>

<style scoped>
</style>
