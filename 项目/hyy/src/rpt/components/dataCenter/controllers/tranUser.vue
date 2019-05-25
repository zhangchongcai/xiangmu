<template>
  <div>
    <el-input v-model="workName" @focus="openAgencyDialog"></el-input>
    <tran-user-view
      :title="title"
      :dialogTableVisible.sync="dialogTableVisible"
      :gridData="gridData"
      :pageData="pageData"
      @changeDialogTableVisible="changeDialogTableVisible"
      @changeCurrentPage="changeCurrentPage"
      @searchUser="searchUser"
      @chooseUser="chooseUser"
    ></tran-user-view>
  </div>
</template>

<script>
import TranUserView from "./components/tranUserView";
export default {
  components: {
    TranUserView
  },
  data() {
    return {
      workName: "",
      title: "",
      pageNum: 1,
      pageSize: 10,
      pageData: {},
      dialogTableVisible: false,
      gridData: []
    };
  },
  methods: {
    openAgencyDialog() {
      this.dialogTableVisible = true;
      this.title = "收银员/授权人";
      // this.getData(0, 10, "");
      this.getData(this.pageNum, this.pageSize, "");
    },
    getData(pageNum, pageSize, fullName) {
      this.$rptList.getUser(pageNum, pageSize, fullName).then(data => {
        console.log(data);
        this.gridData = JSON.parse(JSON.stringify(data.rows));
        this.pageData = data;
      });
    },
    changeDialogTableVisible(val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage(val) {
      console.log(val);
      this.pageNum = val;
      this.getData(this.pageNum, this.pageSize, "");
    },
    searchUser(data) {
      this.getData(this.pageNum, this.pageSize, data);
    },
    chooseUser(arr) {
      this.workName = "";
      arr.forEach(item => {
        this.workName += item.fullName + ",";
      });
      this.$emit("selectUserData", this.workName);
    }
  }
};
</script>

<style lang="sass" scoped>

</style>
