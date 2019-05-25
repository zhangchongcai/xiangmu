<template>
  <div>
    <el-input v-model="goodsName" @focus="openMerTypeDialog"></el-input>
    <mer-goods-view
      :title="title"
      :dialogTableVisible.sync="dialogTableVisible"
      :goodsTabledata="goodsTabledata"
      :pageData="pageData"
      @changeDialogTableVisible="changeDialogTableVisible"
      @changeCurrentPage="changeCurrentPage"
      @searchUser="searchUser"
      @chooseUser="chooseUser"
    ></mer-goods-view>
  </div>
</template>

<script>
import MerGoodsView from "./components/merGoodsView";
export default {
  props: {
    merType: {
      type: String,
      default: ""
    }
  },
  components: {
    MerGoodsView
  },
  data() {
    return {
      title: "",
      goodsName: "",
      dialogTableVisible: false,
      goodsTabledata: [],
      pageData: {
        pageNum: 1,
        size: 10,
        total: 0
      },
      GoodsListQueryData: {
        pageSize: 10,
        page: 1,
        merName: "",
        merCode: "",
        classUid: "",
        canSale: "",
        merType: "",
        shorthandCode: "",
        skuCode: ""
      }
    };
  },
  methods: {
    openMerTypeDialog() {
      this.dialogTableVisible = true;
      this.title = "商品";
      this.GoodsListQueryData.merType = this.merType;
      this.goodsDataQueryGoodsList();
    },
    goodsDataQueryGoodsList() {
      let GoodsListQueryData = this.GoodsListQueryData;
      this.$rptList
        .goodsDataQueryGoodsList(GoodsListQueryData)
        .then(res => {
          if (res.code === 200) {
            console.log(res);
            this.goodsTabledata = JSON.parse(JSON.stringify(res.data.list));
            this.pageData.total = Number(res.data.total);
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    changeDialogTableVisible(val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage(val) {
      this.GoodsListQueryData.page = Number(val);
      this.goodsDataQueryGoodsList();
    },
    searchUser(data) {
      console.log(data);
      this.GoodsListQueryData.merName = data.goodsName;
      this.GoodsListQueryData.merCode = data.goodsNumber;
      this.GoodsListQueryData.classUid = data.classUid;
      this.GoodsListQueryData.merType = this.merType;
      console.log(this.GoodsListQueryData);
      this.goodsDataQueryGoodsList();
    },
    chooseUser(data) {
      let merNameArr = [];
      data.forEach(element => {
        merNameArr.push(element.merName);
      });
      this.goodsName = merNameArr.join(",");
      this.$emit("selectMerGoodsData", this.goodsName);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

