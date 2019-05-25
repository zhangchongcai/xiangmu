<template>
  <section class="datacenter-box">
    <!-- <data-navheader :reportName="reportName"></data-navheader> -->
    <data-query
      :baseQueryArr="baseQueryArr"
      :extQueryArr="extQueryArr"
      :styleExtQueryArr="styleExtQueryArr"
      :colArr="colArr"
      :styleColArr="styleColArr"
      :reportName="reportName"
      :tableName="tableName"
      :groupArr="groupArr"
      :styleGroupArr="styleGroupArr"
      :styleName="styleName"
      :reportCode="reportCode"
      :Pagination="Pagination"
      :tableLoading="tableLoading"
      :routeChangeStatus="routeChangeStatus"
      @tableDataArrEventNoGroup="tableDataArrEventNoGroup"
    ></data-query>
    <data-btn
      :colArr="colArr"
      :baseQueryArr="baseQueryArr"
      :groupArr="groupArr"
      :styleGroupArr="styleGroupArr"
      :tableName="tableName"
      :styleUid="styleUid"
      :reportCode="reportCode"
      :isDef="isDef"
      :styleArr="styleArr"
      :styleColArr="styleColArr"
      :styleExtQueryArr="styleExtQueryArr"
      :styleName="styleName"
      :datatable="Jdata"
      :Pagination="Pagination"
      :reportName="reportName"
      :getDataSucc="getDataSucc"
      @printTable="printTable"
      @groupDatatable="groupDatatable"
    ></data-btn>
    <data-table
      :datatable="Jdata"
      :Pagination="Pagination"
      :colArr="colArr"
      :Jdata="Jdata"
      :groupArr="groupArr"
      :styleGroupArr="styleGroupArr"
      :styleColArr="styleColArr"
      :tableName="tableName"
      :reportCode="reportCode"
      :baseQueryArr="baseQueryArr"
      :styleExtQueryArr="styleExtQueryArr"
      :colSummary="colSummary"
      :summary="summary"
      :tableLoading="tableLoading"
      ref="multipleSelection"
    ></data-table>
    <data-show
      :datatable="Jdata"
      :Pagination="Pagination"
      :tableName="tableName"
      :colArr="colArr"
      :styleColArr="styleColArr"
      :reportCode="reportCode"
      :sortArray="sortArray"
      v-if="pagesShow"
      :baseQueryArr="baseQueryArr"
      :styleExtQueryArr="styleExtQueryArr"
      :searchData="searchData"
    ></data-show>
  </section>
</template>
<script>
import datacenterBus from "../assets/datacenterBus.js";
import dataNavheader from "../components/dataCenter/dataNavheader";
import dataBtn from "../components/dataCenter/dataBtn";
import dataQuery from "../components/dataCenter/dataQuery";
import dataTable from "../components/dataCenter/dataTable";
import dataShow from "../components/dataCenter/dataShow";
import cinemaTree2 from "../components/dataCenter/dataCommon/cinemaTree2.vue";

export default {
  data() {
    return {
      dialogVisible: false,
      // 分页是否显示
      pagesShow: false,
      // 接收数据数组
      Jdata: [],
      // 分页配置参数
      Pagination: {
        //默认显示第几页
        currentPage: 1,
        //每页显示多少调数据
        pagesize: 15,
        //设置每页显示多少条
        page_sizes: [15, 20, 50, 100],
        //数据总数
        total: 45
      },
      // 报表名称
      reportName: "",
      //数据中间表表名
      tableName: "",
      // 基础查询条件
      baseQueryArr: [],
      // 扩展查询条件

      extQueryArr: [],
      styleExtQueryArr: [],
      colArr: [],
      styleColArr: [],
      groupArr: [],
      styleGroupArr: [],
      //模板样式
      styleArr: [],
      //报表编码
      reportCode: "",

      //皮肤ID
      styleUid: "",
      //皮肤名称
      styleName: "",
      //是否默认
      isDef: "",
      //皮肤表头

      //皮肤扩展查询条件

      //表格排序
      sortArray: [],
      //列汇总
      colSummary: {},
      // 分组汇总
      summary: [],
      // 首页loading
      firstLoading: true,
      // 表格loading
      tableLoading: false,
      searchData: [], //基础查询和表格筛选查询的拼接数据
      //是否获取到数据
      getDataSucc: false,
      routeChangeStatus: false //路由是否发生变化
    };
  },
  components: {
    dataNavheader,
    dataQuery,
    dataBtn,
    dataTable,
    dataShow,
    cinemaTree2
  },
  mounted() {
    let styleUid;
    this.getDatacenter(styleUid);
    var self = this;
    //监听是否查询表格数据
    datacenterBus.$on("haveGetTableData", data => {
      this.getDataStatus = data;
    });
    datacenterBus.$on("getAllStyles", data => {
      this.getDatacenter(data);
    });
    datacenterBus.$on("getStyle", data => {
      let stylUid = data;
      this.getDatacenter(stylUid);
    });
    datacenterBus.$on("sendSearchData", data => {
      console.log('==================>',data);
      data.forEach(element => {
        if (element.queryColValue === "空白") {
          element.operation = " is";
          element.queryColValue = "null";
        }
        if (element.queryColValue === "无空白") {
          element.operation = " is not";
          element.queryColValue = "null";
        }
      });
      let inputData = JSON.parse(JSON.stringify(this.baseQueryArr));
      data.forEach(element => {
        inputData.push(element);
      });

      this.searchData = JSON.parse(JSON.stringify(inputData));
    });
    // datacenterBus.$on("sendSearch", data => {
    //   console.log('==================>',data);
    //   data.forEach(element => {
    //     if (element.queryColValue === "空白") {
    //       element.operation = " is";
    //       element.queryColValue = "null";
    //     }
    //     if (element.queryColValue === "无空白") {
    //       element.operation = " is not";
    //       element.queryColValue = "null";
    //     }
    //   });
    //   let inputData = JSON.parse(JSON.stringify(this.baseQueryArr));
    //   data.forEach(element => {
    //     inputData.push(element);
    //   });

    //   this.searchData = JSON.parse(JSON.stringify(inputData));
    // });
    datacenterBus.$on("styleColArr", (val1, val2) => {
      this.styleColArr = val1;
      this.colArr = val2;
    });
    datacenterBus.$on("CcArrEvent", function(val1, val2, val3) {
      self.styleExtQueryArr = val1;
      self.extQueryArr = val2;
    });
    datacenterBus.$on("tableLoading", function() {
      Vue.nextTick(function() {
        self.tableLoading = true;
      });
    });
    datacenterBus.$on("cinemaTreeValue", function(val1) {
      self.baseQueryArr.push(val1);
      console.log(val1);
    });
    datacenterBus.$on("tableArrEvent", function(val) {
      self.Jdata = val;
      self.pagesShow = true;
    });
    datacenterBus.$on("GroupArrEvent", function(val1, val2) {
      self.groupArr = val1;
      self.styleGroupArr = val2;
      if (self.styleGroupArr.length != 0) {
        self.pagesShow = false;
      }
    });
    datacenterBus.$on("tableDataArrEventYesGroup", function(val) {
      self.Jdata = val.list;
      self.summary = val.summary;
      if (val.summary.length != 0) {
        self.summary[0].colValue = "合计";
      }
      self.pagesShow = false;
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
    datacenterBus.$on("pagesDataArrEvent", function(val) {
      self.Jdata = val.list;
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
    datacenterBus.$on("sizeDataArrEvent", function(val) {
      self.Pagination.pagesize = val;
    });
    datacenterBus.$on("newtableDataArrEvent", function(val, d) {
      self.Jdata[d].childrenDatas1 = val.list;
      self.Jdata[d].isShow = "false";
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
    datacenterBus.$on("closeNewtableDataArrEvent", function(index) {
      self.Jdata[index].childrenDatas1 = [];
      self.Jdata[index].isShow = "true";
    });
    datacenterBus.$on("newtableDataArrEvent1", function(val, d, e) {
      console.log("123456");
      self.Jdata[e].childrenDatas1[d].childrenDatas1 = val.list;
      self.Jdata[e].childrenDatas1[d].isShow = "false";
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
    datacenterBus.$on("closeNewtableDataArrEvent1", function(index1, index) {
      self.Jdata[index].childrenDatas1[index1].childrenDatas1 = [];
      self.Jdata[index].childrenDatas1[index1].isShow = "true";
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
    datacenterBus.$on("newtableDataArrEvent2", function(val, d, e, f) {
      self.Jdata[f].childrenDatas1[e].childrenDatas1[d].childrenDatas1 =
        val.list;
      self.Jdata[f].childrenDatas1[e].childrenDatas1[d].isShow = "false";
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
    datacenterBus.$on("closeNewtableDataArrEvent2", function(
      index2,
      index1,
      index
    ) {
      self.Jdata[index].childrenDatas1[index1].childrenDatas1[
        index2
      ].childrenDatas1 = [];
      self.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].isShow =
        "true";
      Vue.nextTick(function() {
        self.tableLoading = false;
      });
    });
  },
  methods: {
    printTable: function() {
      this.$refs.multipleSelection.printTable();
    },
    groupDatatable: function() {
      this.$refs.multipleSelection.groupDatatable();
    },
    pageIsShow: function() {
      this.styleGroupArr.length == 0
        ? (this.pagesShow = false)
        : (this.pagesShow = true);
    },
    getDatacenter: function(stylUid) {
      // let param = {
      //   reportCode: this.$route.query.id
      // };
      let param = {
        reportCode: this.$route.path.split("=")[1]
      };
      //调用api，查询报表基础信息
      this.$rptList
        .reportTableInfo(param, stylUid)
        .then(data => {
          this.getDatacenterSucc(data.reportTableInfo);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    getDatacenterSucc(data) {
      this.colArr = data.colArr;
      console.log(data);
      this.reportName = data.reportName;
      this.baseQueryArr = data.baseQueryArr;

      // 保存的扩展条件
      this.extQueryArr = data.extQueryArr;
      // 保存的扩展条件
      this.styleExtQueryArr = data.styleExtQueryArr;
      console.log(this.styleExtQueryArr);
      // 不保存的表头
      this.colArr = data.colArr;
      // 保存的表头
      this.styleColArr = data.styleColArr;
      // 不保存的分组
      this.groupArr = data.groupArr;
      // 保存的分组
      this.styleGroupArr = data.styleGroupArr;
      //模板样式
      this.styleArr = data.styleArr;
      this.tableName = data.tableName;
      this.reportCode = data.reportCode;
      this.styleUid = data.styleUid;
      this.styleName = data.styleName;
      this.isDef = data.isDef;
      this.firstLoading = false;
      this.getDataSucc = true;
    },
    tableDataArrEventNoGroup(val, sortArray) {
      this.Jdata = val.list;
      this.Pagination.total = val.totalNum;
      // if(self.Jdata==null || self.Jdata.length == 0){

      // }
      this.pagesShow = true;
      this.colSummary = val.summary;
      if (sortArray == undefined) {
        //点击查询过来的，清空排序数组
        this.$refs.multipleSelection.clearSort();
        this.sortArray = [];
        //点击查询过来的，重置分页
        this.Pagination.currentPage = 1;
      } else {
        //点击排序过来的，要给排序数组赋值
        this.sortArray = sortArray;
      }
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    }
  },
  watch: {
    $route(to, from) {
      let styleUid;
      this.getDatacenter(styleUid);
      this.routeChangeStatus = true;
      console.log(this.Jdata, this.styleColArr);
    }
  }
};
</script>
<style Scoped>
.datacenter-box {
  position: relative;
  min-width: 1280px;
}
</style>
