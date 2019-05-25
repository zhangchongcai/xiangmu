<template>
  <div>
    <el-input v-model="workName" @focus="openAgencyDialog"></el-input>

    <member-class-view
      :gridData="gridData"
      :title="title"
      :dialogTableVisible.sync="dialogTableVisible"
      @searchUser="searchUser"
      @chooseUser="chooseUser"
      @changeDialogTableVisible="changeDialogTableVisible"
    ></member-class-view>
  </div>
</template>

<script>
import MemberClassView from "./components/memberClassView";
export default {
  components: {
    MemberClassView
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
      this.title = "会员等级";
      this.$rptList.selectCardProductList().then(res => {
        if (res.code === 200) {
          console.log(res);
          this.gridData = res.data.records;
        }
      });
    },
    changeDialogTableVisible(val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage(val) {
      this.getData(val);
    },
    searchUser(data) {
      console.log(data);
      this.$rptList.selectCardProductList(data).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.gridData = res.data.records;
        }
      });
    },
    chooseUser(arr) {
        console.log(arr)
      this.workName = "";
      arr.forEach(item => {
        this.workName += item.cardType + ",";
      });
      console.log(this.workName)
      this.$emit("selectMemberClassData", this.workName);
    }
  }
};
</script>

<style scoped>
</style>
