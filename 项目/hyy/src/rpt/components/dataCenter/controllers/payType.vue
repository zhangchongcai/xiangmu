<template>
  <div>
    <el-input v-model="payTypeValue" v-on:click.native="openPayDialog"></el-input>
    <pay-type-view
      ref="payTypeView"
      :payTypeData="payTypeData"
      :cinemaUidList="cinemaUidList"
      :dialogVisible="dialogVisible"
      @getData="getData"
    ></pay-type-view>
  </div>
</template>

<script>
import PayTypeView from "./components/payTypeView";
export default {
  props: {
    cinemaUid: {
      type: String,
      default: ""
    }
  },
  components: {
    PayTypeView
  },
  data() {
    return {
      payTypeValue: "",
      dialogVisible: false,
      cinemaUidList: [],
      payTypeData: []
    };
  },
  methods: {
    openPayDialog() {
      console.log(this.cinemaUid);
      this.cinemaUidList = this.cinemaUid.split(",");
      console.log(this.cinemaUidList);
      if (this.cinemaUidList[0] === '') {
        this.$message({
          message: "请先选择影院",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "alert-message",
          center: "true"
        });
      } else {
          this.dialogVisible = true;
          console.log(this.dialogVisible)
        this.$rptList
          .selectForTenant({
            cinemaUidList: this.cinemaUidList,
            payTypeName: ""
          })
          .then(res => {
            console.log(res);
            if (res.code === 200) {
              this.payTypeData = res.data;
              console.log(this.payTypeData)
            } else {
              this.error(res.msg);
            }
          });
      }
    },
    getData(data) {
      this.payTypeValue = data;
      this.$emit("selectPayTypeData", data);
    }
  },
  watch: {
    payTypeValue(val) {
      console.log(val);
      this.$emit("selectPayTypeData", val);
    }
  }
};
</script>

<style scoped>
</style>

