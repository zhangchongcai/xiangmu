<template>
  <section class="datacenter-box">
    <data-query :baseQueryArr="baseQueryArr" :extQueryArr="extQueryArr" :styleExtQueryArr="styleExtQueryArr" :colArr="colArr" :styleColArr="styleColArr" :initStyleColArr="initStyleColArr" :tableStyleColArr="tableStyleColArr" :payTypeDataArr="payTypeDataArr" :reportName="reportName" :tableName="tableName" :groupArr="groupArr" :styleGroupArr="styleGroupArr" :styleName="styleName" :reportCode="reportCode" :Pagination="Pagination" :tableLoading="tableLoading" :searchClickStatus="searchClickStatus" :orderCol="orderCol" :automaticSearchStatus="automaticSearchStatus" :dataQueryObj="dataQueryObj" :channelObj="channelObj" :comboSonGoodsObj="comboSonGoodsObj" :dataInputObj="dataInputObj" :dateSelectObj="dateSelectObj" :dateTimeSelectObj="dateTimeSelectObj" :dealTypeObj="dealTypeObj" :dicObj="dicObj" :dicManyObj="dicManyObj" :goodsShelfObj="goodsShelfObj" :hallTypeObj="hallTypeObj" :merClassObj="merClassObj" :merTypeObj="merTypeObj" :monthSelectObj="monthSelectObj" :movieReleasedVersionObj="movieReleasedVersionObj" :movieTypeObj="movieTypeObj" :multiCinemaObj="multiCinemaObj" :saleTypeObj="saleTypeObj" :showTimeObj="showTimeObj" :timeSelectObj="timeSelectObj" :transactionDateObj="transactionDateObj" :transactionOderObj="transactionOderObj" :warehouseObj="warehouseObj" :mergeTableObj="mergeTableObj" :controllerObj="controllerObj" :dataBtnObj="dataBtnObj" @sendStyleColArr="getStyleColArr" @tableDataArrEventNoGroup="tableDataArrEventNoGroup" @tableDataArrEventYesGroup="tableDataArrEventYesGroup" @setSearchStatus="setSearchStatus" @returnAutomaticSearchStatus="returnAutomaticSearchStatus" @CcArrEvent="CcArrEvent"></data-query>
    <data-btn :isSearched="isSearched" :colArr="colArr" :baseQueryArr="baseQueryArr" :groupArr="groupArr" :styleGroupArr="styleGroupArr" :tableName="tableName" :styleUid="styleUid" :reportCode="reportCode" :isDef="isDef" :styleArr="styleArr" :styleColArr="styleColArr" :styleExtQueryArr="styleExtQueryArr" :styleName="styleName" :datatable="Jdata" :Pagination="Pagination" :reportName="reportName" :getDataSucc="getDataSucc" :dataBtnObj="dataBtnObj" :mergeTableObj="mergeTableObj" :cinemaUid="dataQueryObj.cenimaUid" @printTable="printTable" @groupDatatable="groupDatatable" @handleMergeTablePrint="handleMergeTablePrint" @groupArrEvent="groupArrEvent" @setStyleColArr="setStyleColArr" @searchButtonClick="searchButtonClick" @getStyle="getStyle"></data-btn>
    <data-table :datatable="Jdata" :Pagination="Pagination" :colArr="colArr" :Jdata="Jdata" :groupArr="groupArr" :styleGroupArr="styleGroupArr" :styleColArr="styleColArr" :tableStyleColArr="tableStyleColArr" :tableName="tableName" :reportCode="reportCode" :baseQueryArr="baseQueryArr" :styleExtQueryArr="styleExtQueryArr" :colSummary="colSummary" :summary="summary" :tableLoading="tableLoading" :dataTableObj="dataTableObj" :tableFilterObj="tableFilterObj" :tableSearcherObj="tableSearcherObj" :mergeTableObj="mergeTableObj" :sonTableLoading="sonTableLoading" :cinemaUid="dataQueryObj.cinemaUid" :setNoGroupLoading="setNoGroupLoading" @setSonTableLoading="setSonTableLoading" @newtableDataArrEvent="newtableDataArrEvent" @closeNewtableDataArrEvent="closeNewtableDataArrEvent" @closeNewtableDataArrEvent1="closeNewtableDataArrEvent1" @closeNewtableDataArrEvent2="closeNewtableDataArrEvent2" @closeNewtableDataArrEvent3="closeNewtableDataArrEvent3" @closeNewtableDataArrEvent4="closeNewtableDataArrEvent4" @closeNewtableDataArrEvent5="closeNewtableDataArrEvent5" @closeNewtableDataArrEvent6="closeNewtableDataArrEvent6" @newtableDataArrEvent1="newtableDataArrEvent1" @newtableDataArrEvent2="newtableDataArrEvent2" @newtableDataArrEvent3="newtableDataArrEvent3" @newtableDataArrEvent4="newtableDataArrEvent4" @newtableDataArrEvent5="newtableDataArrEvent5" @newtableDataArrEvent6="newtableDataArrEvent6" @tableDataArrEventYesGroup="tableDataArrEventYesGroup" @tableDataArrEventNoGroup="tableDataArrEventNoGroup" ref="multipleSelection"></data-table>
    <merge-table :reportCode="reportCode" :tableName="tableName" :styleGroupArr="styleGroupArr" :baseQueryArr="baseQueryArr" :styleExtQueryArr="styleExtQueryArr" :styleColArr="styleColArr" :groupArr="groupArr" :mergeTableLoading="mergeTableLoading" :Pagination="Pagination" :mergeTableObj="mergeTableObj" @setMergeTableLoading="setMergeTableLoading" ref="mergeTable"></merge-table>
    <data-show :datatable="Jdata" :Pagination="Pagination" :tableName="tableName" :colArr="colArr" :styleColArr="styleColArr" :reportCode="reportCode" :sortArray="sortArray" :baseQueryArr="baseQueryArr" :styleExtQueryArr="styleExtQueryArr" :searchData="dataQueryObj.searchData" :orderCol="orderCol" :tableStyleColArr="tableStyleColArr" @sendStyleColArr="getStyleColArr" v-if="pagesShow && styleGroupArr.length === 0"></data-show>
  </section>
</template>
<script>
import datacenterBus from 'rptSrc/util/datacenterBus.js';
import DataBtn from '../components/dataCenter/dataBtn';
import DataQuery from '../components/dataCenter/dataQuery';
import DataTable from '../components/dataCenter/dataTable';
import MergeTable from '../components/dataCenter/mergeTable';
import DataShow from '../components/dataCenter/dataShow';
import $Print from 'rptSrc/util/prints';
import { mapState } from 'vuex';
import { filterFunc } from 'rptSrc/util/commonFunc.js';

// import mixins from 'src/frame_cpm/mixins/cacheMixin.js';
const { cacheMixin } = requireModule('base');

export default {
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: [
        'token',
        'isSearched',
        'baseQueryArr',
        'styleExtQueryArr',
        'extQueryArr',
        'Jdata',
        'Pagination',
        'reportName',
        'colArr',
        'styleColArr',
        'tableStyleColArr',
        'initStyleColArr',
        'groupArr',
        'styleGroupArr',
        'styleArr',
        'reportCode',
        'styleUid',
        'styleName',
        'sortArray',
        'colSummary',
        'summary',
        'searchData',
        'tableName',
        'pagesShow',
        'orderCol',
        'controllerObj',
        'mergeTableObj',
        'dataQueryObj',
        'dataBtnObj',
        'dataTableObj',
        'tableFilterObj',
        'tableSearcherObj',
        'channelObj',
        'comboSonGoodsObj',
        'dataInputObj',
        'dateSelectObj',
        'dateTimeSelectObj',
        'dealTypeObj',
        'goodsShelfObj',
        'hallTypeObj',
        'merClassObj',
        'merTypeObj',
        'monthSelectObj',
        'movieReleasedVersionObj',
        'movieTypeObj',
        'multiCinemaObj',
        'saleTypeObj',
        'showTimeObj',
        'timeSelectObj',
        'transactionDateObj',
        'transactionOderObj',
        'warehouseObj',
        'dicManyObj'
      ],
      subComName: `danteCenter${this.reportCode}`,
      controllerObj: {},
      // mergeTable数据
      mergeTableObj: {
        mergeTableBodyData: [],
        mergeTableHeaderData: [],
        totalWidth: '100%',
        summary: {},
        oneSpanArr: [],
        onePosition: 0,
        twoSpanArr: [],
        twoPosition: 0,
        threeSpanArr: [],
        threePosition: 0,
        fourSpanArr: [],
        fourPosition: 0,
        fiveSpanArr: [],
        fivePosition: 0,
        sixSpanArr: [],
        sixPosition: 0,
        sevenSpanArr: [],
        sevenPosition: 0,
        groupCount: '',
        isMerged: true
      },
      // dateQuery数据
      dataQueryObj: {
        showQueryArr: [], // 设置条件窗口中要显示的条件
        hideQueryArr: [], // 设置条件窗口中不显示的条件
        searchData: [], // 存储表格筛选条件
        cenimaUid: '',
        merTypeUid: '', // 商品类型Uid
        merClassUid: '', // 商品类别Uid
        payTypeValueArr: [], // 支付方式数据
        isHighShow: true // 是否显示高级筛选
      },
      // dataBtn数据
      dataBtnObj: {
        leftGroupsShow: [], // 显示的左边的分组内容
        rightGroupsShow: [], // 显示的右边的分组内容
        nowColArr: [],
        nownoColArr: [],
        leftGroupArr: [], // 左边分组数据
        rightGroupArr: [], // 右边分组数据
        // showStyleSave: true,
        showStyleList: true,
        groupColNameArr: [],
        isGroup: false,
        isOpenedGroupDialog: false,
        styleNameData: '',
        queryStoreData: []
      },
      // dataTable数据
      dataTableObj: {
        searchData: [],
        colData: [],
        noGroupTableData: [],
        noGroupStyleColArr: [],
        advancedData: [], // 高级筛选数据
        widthArr: [],
        widthTotal: '100%',
        searchBtnColor: {},
        searchIconIndex: '',
        outsideUrlArr: []
      },
      // 表格筛选数据
      tableFilterObj: {
        colValue: '',
        submitColValue: [],
        showData: [],
        colData: [],
        inputData: ''
      },
      // 表格高级筛选数据
      tableSearcherObj: {
        input: '',
        value: ''
      },
      // 渠道控件a数据
      channelObj: {
        channelValue: ''
      },
      // 套餐拆分成子商品控件数据
      comboSonGoodsObj: {
        checkValue: false
      },
      // 文本框控件数据
      dataInputObj: {
        inputData: ''
      },
      // 日期控件数据
      dateSelectObj: {
        dateTime: []
      },
      // 精确时间控件数据
      dateTimeSelectObj: {
        dateTime: []
      },
      // 交易类型控件数据
      dealTypeObj: {
        dealTypeValue: ''
      },
      // dicMany控件
      dicManyObj: {
        dicValue: [],
        dicName: []
      },
      // dic控件数据
      dicObj: {
        // dicValue: ""
      },
      // 货架控件数据
      goodsShelfObj: {
        goodsShelfValue: ''
      },
      // 影厅类型控件数据
      hallTypeObj: {
        hallTypeValue: ''
      },
      // 商品类别
      merClassObj: {
        merClassValue: '',
        merClassArr: []
      },
      // 商品类型控件数据
      merTypeObj: {
        value: []
      },
      // 月份控件数据
      monthSelectObj: {
        monthValue: ''
      },
      // 发行版本控件数据
      movieReleasedVersionObj: {
        movieReleasedVersion: []
      },
      // 影片类型控件数据
      movieTypeObj: {
        movieType: ''
      },
      // 多选影院控件数据
      multiCinemaObj: {},
      // 销售类型控件数据
      saleTypeObj: {
        saleTypeValue: ''
      },
      // 放映时间控件数据
      showTimeObj: {
        dateTime: []
      },
      // 时间控件数据
      timeSelectObj: {
        time: []
      },
      // 交易时间控件数据
      transactionDateObj: {
        dateTime: []
      },
      // 交易单类型控件
      transactionOderObj: {
        value: []
      },
      // 仓库控件数据
      warehouseObj: {
        warehouseValue: ''
      },
      dialogVisible: false,
      // 分页是否显示
      pagesShow: false,
      // 接收数据数组
      Jdata: [],
      // 分页配置参数
      Pagination: {
        // 默认显示第几页
        currentPage: 1,
        // 每页显示多少调数据
        pagesize: 15,
        // 设置每页显示多少条
        page_sizes: [15, 20, 50, 100],
        // 数据总数
        total: 0
      },
      // 报表名称
      reportName: '',
      // 数据中间表表名
      tableName: '',
      // 基础查询条件
      baseQueryArr: [],
      // 扩展查询条件

      extQueryArr: [],
      styleExtQueryArr: [],
      colArr: [],
      // 最初发请求时的表头数据
      initStyleColArr: [],
      styleColArr: [],
      tableStyleColArr: [],
      groupArr: [],
      styleGroupArr: [],
      // 模板样式
      styleArr: [],
      // 报表编码
      reportCode: '',
      // 皮肤ID
      styleUid: '',
      // 皮肤名称
      styleName: '',
      // 是否默认
      isDef: '',
      // 皮肤表头

      // 皮肤扩展查询条件

      // 表格排序
      sortArray: [],
      // 列汇总
      colSummary: {},
      // 分组汇总
      summary: [],
      // 首页loading
      firstLoading: true,
      // 表格loading
      tableLoading: false,
      searchData: [], // 基础查询和表格筛选查询的拼接数据
      // 是否获取到数据
      getDataSucc: false,
      searchClickStatus: false, // 是否需要进行查询数据
      automaticSearchStatus: 0, // 切换模板后是否查询,0为不查询，1无任何操作, 2为查询
      adsUpdateTime: '',
      haveGotData: false,
      // 初始支付方式数据
      payTypeDataArr: [],
      // 默认排序
      orderCol: '',
      mergeTableLoading: false,
      sonTableLoading: false,
      isSearched: false,
      token: ''
    };
  },
  components: {
    DataQuery,
    DataBtn,
    DataTable,
    DataShow,
    MergeTable
  },
  computed: mapState({
    pageArr: state => state.rpt.pageArr,
    isSent: state => state.rpt.isSent,
    colData: state => state.rpt.colData
  }),
  created () {
    if (this.token != sessionStorage.getItem('token')) {
      Object.assign(this.$data, this.$options.data());
      this.token = sessionStorage.getItem('token');
      this.$store.commit('setPageArr', [this.reportCode, 1]);
      this.getDatacenter(undefined);
    } else {
      if (
        !this.pageArr.some(element => element == this.$route.path.split('=')[1])
      ) {
        Object.assign(this.$data, this.$options.data());
        this.getDatacenter(undefined);
      }
    }
  },
  mounted () {
    datacenterBus.$on('haveGetTableData', data => {
      this.getDataStatus = data;
    });
    datacenterBus.$on('getAllStyles', data => {
      let param = {
        reportCode: this.$route.path.split('=')[1]
      };
      // 调用api，查询报表基础信息
      this.$rptList
        .reportTableInfo(param, data == null ? -1 : data)
        .then(res => {
          let ret = res.reportTableInfo;
          this.styleArr = ret.styleArr;
          this.styleName = ret.styleName;
          this.styleUid = ret.styleUid;
        })
        .catch(msg => {
          console.log(msg);
        });
    });
    datacenterBus.$on('tableLoading', () => {
      this.$nextTick(() => {
        this.tableLoading = true;
      });
    });
    datacenterBus.$on('cinemaTreeValue', val1 => {
      this.baseQueryArr.push(val1);
    });
    datacenterBus.$on('tableArrEvent', val => {
      this.Jdata = val;
      this.pagesShow = true;
    });
    datacenterBus.$on('pagesDataArrEvent', val => {
      this.Jdata = val.list;
      this.$nextTick(() => {
        this.tableLoading = false;
      });
    });
    datacenterBus.$on('sizeDataArrEvent', val => {
      this.Pagination.pagesize = val;
    });
    datacenterBus.$on('setMergeTable', data => {
      this.mergeTableObj.isMerged = data;
    });

    this.$forceUpdate();
  },
  destroyed () {
    datacenterBus.$off('haveGetTableData');
    datacenterBus.$off('getAllStyles');
    datacenterBus.$off('tableLoading');
    datacenterBus.$off('cinemaTreeValue');
    datacenterBus.$off('tableArrEvent');
    datacenterBus.$off('pagesDataArrEvent');
    datacenterBus.$off('sizeDataArrEvent');
    datacenterBus.$off('setMergeTable');
  },
  methods: {
    setSonTableLoading (data) {
      this.sonTableLoading = data;
    },
    setNoGroupLoading (data) {
      this.tableLoading = data;
    },
    setMergeTableLoading (data) {
      this.mergeTableLoading = data;
    },
    setReset () {
      this.automaticSearchStatus = true;
    },
    returnAutomaticSearchStatus () {
      this.automaticSearchStatus = 0;
    },
    printTable () {
      $Print(this.$refs.multipleSelection);
    },
    groupDatatable () {
      $Print(this.$refs.multipleSelection);
    },
    handleMergeTablePrint () {
      $Print(this.$refs.mergeTable);
    },
    pageIsShow () {
      this.styleGroupArr.length == 0
        ? (this.pagesShow = false)
        : (this.pagesShow = true);
    },
    getDatacenter (stylUid) {
      let param = {
        reportCode: this.$route.path.split('=')[1]
      };
      // 调用api，查询报表基础信息
      this.$rptList
        .reportTableInfo(param, stylUid)
        .then(data => {
          this.getDatacenterSucc(data.reportTableInfo);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    getTableStyleColFunc (data, tableStyleCol) {
      let payTypeArr = [];
      let deletIndex = '';
      data.forEach((element1, index) => {
        if (element1.children !== null && element1.children.length != 0) {
          // 初始支付方式数据
          this.payTypeDataArr = element1.children;
          element1.children.forEach(element2 => {
            payTypeArr.push(element2);
          });
          deletIndex = index;
          tableStyleCol.splice(deletIndex, 1);
          for (let i = payTypeArr.length - 1; i >= 0; i--) {
            tableStyleCol.splice(deletIndex, 0, payTypeArr[i]);
          }
        }
      });
    },
    getDatacenterSucc (data) {
      this.colArr = data.colArr;
      this.reportName = data.reportName;
      this.baseQueryArr = data.baseQueryArr;

      // 保存的扩展条件
      this.extQueryArr = data.extQueryArr;
      // 保存的扩展条件
      this.styleExtQueryArr = data.styleExtQueryArr;
      this.styleExtQueryArr.forEach(element => {
        if (element.queryControlKey === 'is_split_combo') { element.queryColValue = '0'; }
      });
      // 不保存的表头
      this.colArr = data.colArr;
      // 保存的表头
      this.styleColArr = JSON.parse(JSON.stringify(data.styleColArr));
      this.initStyleColArr = JSON.parse(JSON.stringify(data.styleColArr));
      this.getTableStyleColFunc(data.styleColArr, this.initStyleColArr);

      this.tableStyleColArr = JSON.parse(JSON.stringify(data.styleColArr));
      // 传给dataTable的表头数据
      this.getTableStyleColFunc(data.styleColArr, this.tableStyleColArr);
      // 不保存的分组
      this.groupArr = data.groupArr;
      // 保存的分组
      this.styleGroupArr = data.styleGroupArr;
      // 模板样式
      this.styleArr = data.styleArr;
      this.tableName = data.tableName;
      this.reportCode = data.reportCode;
      this.styleUid = data.styleUid;
      this.styleName = data.styleName;
      this.orderCol = data.orderCol;
      this.isDef = data.isDef;
      this.firstLoading = false;
      this.getDataSucc = true;
      if (this.automaticSearchStatus === 1) {
        let baseData = JSON.parse(localStorage.getItem('baseData'));
        let extendData = JSON.parse(localStorage.getItem('extendData'));

        this.getEachData(this.baseQueryArr, baseData);
        this.getEachData(this.styleExtQueryArr, extendData);
        this.automaticSearchStatus = 2;
        if (this.styleGroupArr.length > 0) {
          this.mergeTableObj.isMerged = true;
        } else {
          this.mergeTableObj.isMerged = false;
        }
      }
      this.$store.commit('setPageArr', [this.reportCode, false]);
    },
    getEachData (array1, array2) {
      if (array1 && array2) {
        array1.forEach(element1 => {
          array2.forEach(element2 => {
            if (element1.queryColKey === element2.queryColKey) { element1.queryColValue = element2.queryColValue; }
          });
        });
      }
    },
    getStyleColArr (data) {
      this.styleColArr.forEach(element1 => {
        if (element1.children) {
          element1.children = [];
          data.forEach(element2 => {
            if (element2.colKey.indexOf('pay_type') > -1) {
              element1.children.push(element2);
            }
          });
        }
      });
      this.tableStyleColArr = data;
    },
    CcArrEvent (val1, val2, val3) {
      this.styleExtQueryArr = val1;
      this.extQueryArr = val2;
    },
    tableDataArrEventNoGroup (val, sortArray) {
      this.Jdata = val.list;
      this.Pagination.total = val.totalNum;
      this.pagesShow = true;
      this.colSummary = val.summary;
      if (sortArray === undefined) {
        // 点击查询过来的，清空排序数组
        // this.$refs.multipleSelection.clearSort();
        this.sortArray = [];
        // 点击查询过来的，重置分页
        this.Pagination.currentPage = 1;
      } else {
        // 点击排序过来的，要给排序数组赋值
        this.sortArray = sortArray;
      }
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
      this.isSearched = true;
    },
    groupArrEvent (val1, val2) {
      this.groupArr = val1;
      this.styleGroupArr = val2;
      if (this.styleGroupArr.length != 0) {
        this.pagesShow = false;
      }
    },
    setStyleColArr (val1, val2) {
      this.styleColArr = JSON.parse(JSON.stringify(val1));
      // this.tableStyleColArr = JSON.parse(JSON.stringify(val1));
      this.colArr = val2;
      // 传给dataTable的表头数据
      let dataArray = val1;
      let temArray = dataArray.filter(element => element.colKey == 'pay_type_price' && element.children && element.children.length != 0);
      if (temArray && temArray.length != 0) {
        let deleteIndex = dataArray.findIndex(element => element.colKey == 'pay_type_price');
        dataArray.splice(deleteIndex, 1);
        temArray[0].children.forEach(element => dataArray.splice(deleteIndex, 0, element));
        this.tableStyleColArr = dataArray;
      } else {
        this.tableStyleColArr = dataArray;
      }
      // this.getTableStyleColFunc(val1, this.tableStyleColArr);
    },
    searchButtonClick () {
      this.searchClickStatus = true;
    },
    setSearchStatus () {
      this.searchClickStatus = false;
    },
    getStyle (data) {
      let stylUid = data;
      this.getDatacenter(stylUid);
      this.automaticSearchStatus = 1;
    },
    newtableDataArrEvent (val, d) {
      this.Jdata[d].childrenDatas1 = val.list;
      this.Jdata[d].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent (index) {
      this.Jdata[index].childrenDatas1 = [];
      this.Jdata[index].isShow = 'true';
    },
    newtableDataArrEvent1 (val, d, e) {
      this.Jdata[e].childrenDatas1[d].childrenDatas1 = val.list;
      this.Jdata[e].childrenDatas1[d].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent1 (index1, index) {
      this.Jdata[index].childrenDatas1[index1].childrenDatas1 = [];
      this.Jdata[index].childrenDatas1[index1].isShow = 'true';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    newtableDataArrEvent2 (val, d, e, f) {
      this.Jdata[f].childrenDatas1[e].childrenDatas1[d].childrenDatas1 =
        val.list;
      this.Jdata[f].childrenDatas1[e].childrenDatas1[d].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent2 (index2, index1, index) {
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[
        index2
      ].childrenDatas1 = [];
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].isShow =
        'true';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    newtableDataArrEvent3 (data, args) {
      let { fourthIndex, index2, index1, index } = args;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1 =
        data.list;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent3 ({ fourthIndex, index2, index1, index }) {
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1 = [];
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].isShow = 'true';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    newtableDataArrEvent4 (data, args) {
      let { fifthIndex, fourthIndex, index2, index1, index } = args;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1 =
        data.list;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent4 ({ fifthIndex, fourthIndex, index2, index1, index }) {
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1 = [];
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].isShow = 'true';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    newtableDataArrEvent5 (data, args) {
      let { sixthIndex, fifthIndex, fourthIndex, index2, index1, index } = args;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].childrenDatas1 =
        data.list;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent5 ({ sixthIndex, fifthIndex, fourthIndex, index2, index1, index }) {
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].childrenDatas1 = [];
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].isShow = 'true';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    newtableDataArrEvent6 (data, args) {
      let { seventhIndex, sixthIndex, fifthIndex, fourthIndex, index2, index1, index } = args;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].childrenDatas1[seventhIndex].childrenDatas1 =
        data.list;
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].childrenDatas1[seventhIndex].isShow = 'false';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    closeNewtableDataArrEvent6 ({ seventhIndex, sixthIndex, fifthIndex, fourthIndex, index2, index1, index }) {
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].childrenDatas1[seventhIndex].childrenDatas1 = [];
      this.Jdata[index].childrenDatas1[index1].childrenDatas1[index2].childrenDatas1[fourthIndex].childrenDatas1[fifthIndex].childrenDatas1[sixthIndex].childrenDatas1[seventhIndex].isShow = 'true';
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
    },
    tableDataArrEventYesGroup (val) {
      this.Jdata = val.list;
      this.summary = val.summary;
      if (val.summary.length != 0) {
        this.summary[0].colValue = '合计';
      }
      this.pagesShow = false;
      Vue.nextTick(() => {
        this.tableLoading = false;
      });
      this.isSearched = true;
    }
  },
  watch: {
    $route (to, from) {
      this.tableLoading = false;
    },
    isSent (newVal, oldVal) {
      if (newVal) {
        this.searchData = filterFunc(this.colData, this.baseQueryArr);
      }
    }
  }
};
</script>
<style lang="scss">
.rpt-data-picker {
  .el-input__icon,
  .el-range-separator {
    line-height: 24px;
  }
}
.rpt-select .el-select-dropdown__item span,
.rpt-select li {
  font-size: 12px !important;
  // font-family: "MicrosoftYaHei" !important;
}
.rpt-pagination .el-input {
  width: auto !important;
}
// .print-export-dropmenu {
//   margin-top: 7px !important;
// }
.rpt-alert-confirm {
  padding-bottom: 20px;
  .el-message-box__content {
    margin-left: 80px;
    /deep/ .icon-danchuang-jingtanhao {
      color: red;
      margin-top: -4px;
      &::before {
        font-size: 16px !important;
      }
    }
  }
  .el-message-box__btns {
    display: flex;
    justify-content: center;
    .el-button--primary {
      margin-left: -170px;
      width: 80px;
      background: #3b74ff;
      color: #ffffff;
      border: none;
    }
  }
}
.datacenter-box {
  position: relative;
  // min-width: 1280px;
  .el-input--suffix .el-input__inner {
    font-size: 12px !important;
    // font-family: "MicrosoftYaHei" !important;
  }
}
</style>
