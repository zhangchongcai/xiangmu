<template>
  <section>
    <el-select popper-class="rpt-select" v-model="transactionOderObj.value" @change="valueChange" class="transaction-order-type" multiple placeholder="请选择">
      <el-option v-for="item in options" :key="item.keyCode" :label="item.keyName" :value="item.keyName"></el-option>
    </el-select>
  </section>
</template>

<script>
import { multiSelectionStyleFunc } from 'rptSrc/util/commonFunc';
export default {
  props: {
    resetStatus: Boolean,
    transactionOderObj: Object
  },
  data () {
    return {
      options: [],
      oldValue: []
    };
  },
  methods: {
    valueChange (val) {
      multiSelectionStyleFunc('transaction-order-type', val);
      // const allValues = this.options.map(item => {
      //   return item.keyCode;
      // });
      // // 用来储存上一次选择的值，可进行对比
      // const oldVal = this.oldValue.length > 0 ? this.oldValue : [];

      // // 若选择全部
      // if (val.includes("ALL_SELECT")) {
      //   this.transactionOderObj.value = allValues;
      // }

      // // 取消全部选中， 上次有， 当前没有， 表示取消全选
      // if (oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT")) {
      //   this.transactionOderObj.value = [];
      // }

      // // 点击非全部选中，需要排除全部选中 以及 当前点击的选项
      // // 新老数据都有全部选中
      // if (oldVal.includes("ALL_SELECT") && val.includes("ALL_SELECT")) {
      //   const index = val.indexOf("ALL_SELECT");
      //   val.splice(index, 1); // 排除全选选项
      //   this.transactionOderObj.value = val;
      // }

      // // 全选未选，但是其他选项都全部选上了，则全选选上
      // if (!oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT")) {
      //   if (val.length === allValues.length - 1) {
      //     this.transactionOderObj.value = ["ALL_SELECT"].concat(val);
      //   }
      // }

      // // 储存当前选择的最后结果 作为下次的老数据
      // this.oldValue = this.transactionOderObj.value;

      // let orderValue = this.transactionOderObj.value.filter(item => {
      //   return item != "ALL_SELECT";
      // });
      // let orderArr = [];
      // this.options.forEach(element1 => {
      //   orderValue.forEach(element2 => {
      //     if (element1.keyName === element2) orderArr.push(element1.keyCode)
      //   })
      // })
      // this.$emit("selectTransactionOrderData", orderArr.join(","));
      this.$emit('selectTransactionOrderData', val.join(','));
    },

    MER_INTERFACE_STORE_BILL_SUBJECT () {
      this.$rptList
        .getDictionaryData({
          name: 'MER_INTERFACE_STORE_BILL_SUBJECT'
        })
        .then(res => {
          if (res.code === 200) {
            // let data = [
            //   {
            //     keyCode: "ALL_SELECT",
            //     keyName: "全选"
            //   }
            // ];
            // this.options = data.concat(res.data);
            this.options = res.data;
          } else {
            this.error(res.msg);
          }
        });
    }
  },
  mounted () {
    this.MER_INTERFACE_STORE_BILL_SUBJECT();
    multiSelectionStyleFunc('transaction-order-type', this.transactionOderObj.value);
  },
  watch: {
    resetStatus (newVal) {
      if (newVal) {
        this.transactionOderObj.value = [];
        multiSelectionStyleFunc('transaction-order-type', []);
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
