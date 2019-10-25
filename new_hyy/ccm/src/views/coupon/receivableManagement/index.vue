<template>
  <div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
      <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch" :searchLevelButton=true></searchLan>
    </section>

    <!-- 表格 -->
    <section class="table-section">
      <!-- <div style="padding:12px 0;text-align:right">
            <el-button type="text" @click="create">新建</el-button>
        </div> -->
      <el-table :data="tableConfig.data" style="width: 100%">
        <template v-for="(item,index) in tableConfig.title">
          <el-table-column v-if="!item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
          <el-table-column v-else-if="item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
            <template slot-scope="scope">
              <div v-if="item.prop == 'receivableState'">
                {{formal(scope.row.receivableState)}}
              </div>
              <div v-if="item.label == '操作'">
                <el-button type="text" @click="checkReceivable(scope.row)">查看</el-button>
                <el-button type="text" @click="create(scope.row)" v-if="scope.row.receivableState=='0'">新建</el-button>
                <el-button type="text" @click="endReceivable(scope.row)" v-if="scope.row.receivableState=='0'">终止</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </section>

    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center pageStyle" v-if="tableConfig.data.length != 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNo" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" background layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
      </el-pagination>
    </section>
    <!-- 弹窗 -->
    <check-dialog ref="checkDialog" :formData="dialogForm" :tableData="dialogArr"></check-dialog>
  </div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
import checkDialog from './checkDialog';
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
import { cacheMixin } from 'base';

export default {
  components: {
    searchLan,
    checkDialog
  },
  mixins: [cacheMixin.cacheMixin],
  data () {
    var checkNum = (rule, value, callBack) => {
      let regExp = /^[1-9]\d*$/;
      if (!value) {
        return callBack(new TypeError('请输入数量！'));
      } else if (!regExp.test(value)) {
        return callBack(new TypeError('请输入小于5位的正整数！'));
      } else {
        return callBack();
      }
    };
    return {
      /* 缓存数据 */
      cacheField: ['pageConfig', 'tableConfig'],
      subComName: 'receivable',
      modelName: 'printManagement',
      searchParam: {},
      dialogForm: '',
      dialogArr: [],
      searchConfig: [
        {
          name: '申请单号',
          keyName: 'applyCode',
          type: 'input',
          value: ''
        }, {
          name: '入账影院',
          keyName: 'incomeCinemaName',
          alertCompontsName: 'cinemaSingle',
          type: 'input',
          value: {
            value: '',
            text: ''
          },
          alertButton: true,
          clearable: true
        }, {
          name: '创建人',
          keyName: 'names',
          type: 'input',
          value: ''
        }, {
          name: '日期范围',
          keyName: 'proposDate',
          type: 'date-picker',
          value: ''
        }, {
          name: '合同协议号',
          keyName: 'contractCode',
          type: 'input',
          level: 'hight',
          value: ''
        }, {
          name: '客户名称',
          keyName: 'custName',
          type: 'input',
          value: '',
          level: 'hight'
        }, {
          name: '申请部门',
          keyName: 'departmentName',
          type: 'input',
          value: '',
          level: 'hight'
        }, {
          name: '下次收款时间',
          keyName: 'nextReceiptDate',
          type: 'date-picker',
          dateType: 'date',
          level: 'hight',
          value: ''
        }, {
          name: '收款状态',
          keyName: 'receivableState',
          type: 'select',
          value: '0',
          level: 'hight',
          options: [{
            label: '全部',
            value: ''
          }, {
            label: '未收齐',
            value: '0'
          }, {
            label: '已收齐',
            value: '1'
          }, {
            label: '已终止 ',
            value: '2'
          }]
        }
      ],
      tableConfig: {
        title: [{
          label: '申请单号',
          prop: 'applyCode',
          width: '180'
        }, {
          label: '入账影院',
          prop: 'incomeCinemaName'
        }, {
          label: '创建人',
          prop: 'createUserName'
        }, {
          label: '申请部门',
          prop: 'createDepartmentName'
        }, {
          label: '客户名称',
          prop: 'custName'
        }, {
          label: '申请日期',
          prop: 'dateOfApplication'
        }, {
          label: '收款状态',
          prop: 'receivableState',
          hasTemplate: true
        }, {
          label: '总金额（元）',
          prop: 'totalAmount'
        }, {
          label: '未收款金额（元）',
          prop: 'uncollectedAmount'
        }, {
          label: '下次回收日期',
          prop: 'nextReceiptDate',
          width: '100'
        },
        {
          label: '操作',
          width: '180',
          hasTemplate: true,
          fixed: 'right'
        }],
        data: []
      },

      /* 分页设置 */
      pageConfig: {
        pageNo: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 15
      },
      searchParam: {}
    };
  },
  created () {
    if (!this.tableConfig.data.length || this.$route.params.isFresh) {
      this.search({ 'receivableState': '0' });
    }
  },
  methods: {
    /**
     * @function setSearch - 修改搜索栏
     */
    setSearch (params) {
      this.searchParam = params;
    },
    /**
     * @function setParams
     */
    setParams (params) {
      console.log('有参数', params);
      params = params || '';
      let _params = {};
      let searchParam = this.searchParam;
      // input框处理
      let objKey = ['applyCode', 'names', 'contractCode', 'departmentName', 'custName', 'receivableState'];
      objKey.forEach(item => {
        if (!_params[item]) {
          _params[item] = params[item] ? params[item] : searchParam[item] ? searchParam[item] : '';
        }
      });
      // 时间日期处理
      let timesArr = [{
        keys: 'proposDate',
        children: ['validDateStart', 'validDateEnd']
      }];
      timesArr.forEach((item, index) => {
        let key = item.keys;
        let c_keys = item.children;
        c_keys.forEach((item, index) => {
          if (!_params[`${item}`]) {
            _params[`${item}`] = params[`${key}`] ? this.tiemRule(params[`${key}`][index]) : searchParam[`${key}`] ? this.tiemRule(searchParam[`${key}`][index]) : '';
          }
        });
      });
      _params['nextReceiptDate'] = params['nextReceiptDate'] ? this.tiemRule(params['nextReceiptDate']) : searchParam['nextReceiptDate'] ? this.tiemRule(searchParam['nextReceiptDate']) : '';
      // 弹窗处理
      let alertArr = ['incomeCinemaName'];
      alertArr.forEach(item => {
        _params[item] = params[item] ? params[item].value : searchParam[item] ? searchParam[item].value : '';
      });
      if (params) {
        this.pageConfig.pageNo = 1;   // 点击按钮查询 页数回到第一页
      }
      _params['pageNo'] = this.pageConfig.pageNo;
      _params['pageSize'] = this.pageConfig.pageSize;
      return _params;
    },
    /**
     * @function checkReceivable -查看
     */
    checkReceivable (data) {
      this.dialogForm = data;
      this.$refs.checkDialog.openDialg(data.receivableId);
    },
    /**
     * @function endReceivable -终止
     */
    endReceivable (data) {
      let params = {
        applyCode: data.applyCode,
        state: 2
      };
      this.$confirm('确认执行终止操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ccmList.receivableUpdateState(params).then(res => {
          console.log(res);
          let type = 'warning';
          let message = res.msg ? res.msg : '新增收款记录失败';
          if (res.code == 200) {
            type = 'success',
              message = res.msg ? res.msg : '新增收款记录成功';
            this.search();
          }
          this.$message({
            type,
            message
          });
        });
      });
    },

    create (row) {
      console.log(row);
      this.$router.push({
        name: 'createReceivable',
        query: {
          id: row.receivableId
        }
      });
    },

    /**
     * @function search - 搜索
     */
    search (data) {
      console.log(data);
      let param = this.setParams(data);
      this.$ccmList.receivableList(param).then(res => {
        if (res.code == 200) {
          this.tableConfig.data = res.data.list;
          this.pageConfig.total = res.data.pageNum;
        }
      });
    },
    /**
     * @function tiemRule - 格式化时间
     *
     */
    tiemRule (time, type) {
      let _time = new Date(time);
      let returnStr = '';
      switch (type) {
        case 'time':
          returnStr = `${_time.getHours()}:${_time.getMinutes()}`;
          break;
        default:
          returnStr = `${_time.getFullYear()}-${_time.getMonth() + 1}-${_time.getDate()}`;
      }
      return returnStr;
    },
    /**
     * @function handleSizeChange - 分页改变size
     */
    handleSizeChange (value) {
      this.pageConfig.pageSize = value;
      this.search();
    },

    /**
     * @function handleCurrentChange - 分页改变页码
     */
    handleCurrentChange (value) {
      this.pageConfig.pageNo = value;
      this.search();
    },
    formal (state) {
      let statusText = '';
      switch (state) {
        case 0:
          statusText = '未收齐';
          break;
        case 1:
          statusText = '已收齐';
          break;
        case 2:
          statusText = '已终止';
      }
      return statusText;
    }
  },
  mounted () { }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/comList.scss";
</style>
