<template>
  <div>
    <el-input v-model="workName" @focus="openAgencyDialog"></el-input>

    <transaction-channel
      :title="title"
      :dialogTableVisible.sync="dialogTableVisible"
      :gridData="gridData"
      :pageData="pageData"
      @changeDialogTableVisible="changeDialogTableVisible"
      @changeCurrentPage="changeCurrentPage"
      @searchUser="searchUser"
      @chooseUser="chooseUser"
    ></transaction-channel>
  </div>
</template>

<script>
import TransactionChannel from "./components/transactionChannelView";
export default {
  components: {
    TransactionChannel
  },
  data() {
    return {
      workName: "",
      title: "",
      page: 1,
      pageSize: 10,
      pageData: {},
      dialogTableVisible: false,
      gridData: []
    };
  },
  methods: {
    openAgencyDialog() {
      this.dialogTableVisible = true;
      this.title = "交易渠道";
      this.getData(1);
    },
    getData(page, type, name) {
      let limit = {
        cinemaUid: ["111112"],
        pageSize: this.pageSize,
        page,
        type,
        name
      };
      this.$rptList.getDitch(Object.assign({}, limit)).then(data => {
        console.log(data);
        if (data && data.code === 200) {
          this.gridData = data.data.list;
          this.pageData = data.data;
          // 数据的处理(将你需要的数据赋给deal-交易渠道，代理商-agent)
          this.gridData.forEach(item => {
            item.deal = item.code;
            item.agent = item.name;
          });
        }
      });
    },
    changeDialogTableVisible(val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage(val) {
      this.getData(val);
    },
    searchUser(type, name) {
      this.getData(1, type, name);
    },
    chooseUser(arr) {
      this.workName = "";
      arr.forEach(item => {
        this.workName += item.name + ",";
      });
      console.log(this.workName)
      this.$emit('selectTransactionChannelData', this.workName)
    }
  }
};
</script>

<style scoped>
</style>
