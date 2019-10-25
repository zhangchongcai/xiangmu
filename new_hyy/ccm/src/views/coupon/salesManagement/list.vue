<template>
  <div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
      <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" :searchLevelButton="searchLevelButton" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 按钮组 -->
    <section class="btnGroup-section flex-base flex-end">
      <el-button type="primary" plain @click="create" style="width:80px;height:32px">新建</el-button>
    </section>

    <!-- 表格 -->
    <section class="table-section">
      <el-table :data="tableConfig.data" style="width: 100%">
        <template v-for="(item,index) in tableConfig.title">
          <el-table-column :key="index" v-if="!item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip></el-table-column>
          <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="item.prop == 'couponType'">
                {{scope.row.couponType == '0' ? '兑换券' : scope.row.couponType == '1' ? '代金券' : '优惠券'}}
              </div>
              <div v-if="item.prop == 'state'">
                {{ticketStatus(scope.row)}}
              </div>
              <div v-else-if="item.prop == 'auditState'">
                <span v-if="scope.row.auditState=='0'" style="font-size:12px;color:#2DBC2D;">
                  {{auditStatus(scope.row.auditState)}}
                </span>
                <span v-else-if="scope.row.auditState=='1'" style="font-size:12px;color:#F33430;">
                  {{auditStatus(scope.row.auditState)}}
                </span>
                <span v-else-if="scope.row.auditState=='2'" style="font-size:12px;color:#739BFF;">
                  {{auditStatus(scope.row.auditState)}}
                </span>
                <span v-else>
                  {{auditStatus(scope.row.auditState)}}
                </span>
              </div>
              <div v-else-if="item.prop == 'validDateStart' || item.prop == 'validDateEnd'">
                {{tiemRule(scope.row[`${item.prop}`])}}
              </div>
              <div v-else-if="item.label == '操作'">
                <el-row>
                  <!-- 此处返回一级操作菜单 -->
                  <el-button v-for="(item,index) in level1Template(scope.row.auditState, scope.row.state,scope.row)" :key="index" type="text" @click="controlEmitFn(item.emitFn,scope.row)">{{item.label}}</el-button>
                  <!-- 此处返回更多操作菜单 -->
                  <el-dropdown @command="commandLevel2">
                    <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(item,index) in level2Template(scope.row.auditState, scope.row.state,scope.row)" :key="index" :command="[scope.row,item]">{{item.label}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </section>

    <!-- 分页 -->
    <section class="flex-base flex-center pageStyle" v-if="tableConfig.data.length != 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNo" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" background layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
      </el-pagination>
    </section>

    <!-- 弹窗 -->
    <el-dialog title="票券延期" :visible.sync="delayWindow.isShow" :close-on-click-modal=false>
      <el-form>
        <el-form-item label="调整票券有效期:" :label-width="delayWindow.labelWidth">
          <el-row class="flex-base">
            <span>{{delayWindow.validDateStart}}</span>
            <span class="delayLine"> - </span>
            <el-date-picker v-model="delayWindow.validDateEnd" align="right" type="date" placeholder="选择日期" :picker-options="delayWindow.pickerOptions"></el-date-picker>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleDelay">取 消</el-button>
        <el-button type="primary" @click="sureDelay">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看审批 -->
    <checkApporveDialog v-if="dialogFormVisible" @close="close" :dialogFormVisible="dialogFormVisible" :bizNo="bizNo"></checkApporveDialog>
  </div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
import checkApporveDialog from 'ccmSrc/dialogs/approval/approvalDialog'
// import config from 'frame_cpm/http/config.js';
// import checkApporveDialog from 'cmm/dialogs/approval/approvalDialog'
// import minxins from 'frame_cpm/mixins/cacheMixin.js';
import { cacheMixin } from 'base';

// import { approvalDialog } from 'cmm';
// const { approvalDialog } = requireModule('cmm');

import Axios from 'axios';
export default {
  components: {
    searchLan,
    checkApporveDialog
  },
  mixins: [cacheMixin.cacheMixin],

  data () {
    let pointer = this;
    return {
      /* 缓存数据 */
      cacheField: ['pageConfig', 'tableConfig', 'searchParam'],
      subComName: 'salesManagement',
      // 查看审批
      dialogFormVisible: false,
      bizNo: '',
      baseUrl: this.$store.state.default.apiConfig.baseURL,
      modelName: 'salesManagement',
      searchLevelButton: true,
      searchConfig: [{
        keyName: 'incomeCinemaId',
        alertCompontsName: 'cinemaSingle',
        name: '入账影院',
        type: 'input',
        value: {
          value: '',
          text: ''
        },
        alertButton: true,
        clearable: true,
        alertSrc: 'http://192.168.100.148:8080/alertWindow'
      }, {
        keyName: 'applyCode',
        name: '申请单号',
        type: 'input',
        value: ''
      }, {
        keyName: 'couponName',
        name: '票券名称',
        type: 'input',
        value: ''
      }, {
        keyName: 'queryCreateUserName',
        name: '申请人',
        type: 'input',
        // value: {
        //     value: '',
        //     text: ''
        // },
        // alertButton: true,
        // readonly: true,
        value: '',
        alertSrc: ''
      },
      {
        keyName: 'proposDate',
        name: '申请日期',
        type: 'date-picker',
        level: 'hight',
        value: ''
      }, {
        keyName: 'contractCode',
        name: '合同协议号',
        type: 'input',
        level: 'hight',
        value: ''
      }, {
        keyName: 'custId',
        alertCompontsName: 'tradeMerchantSingle',
        name: '客商名称',
        type: 'input',
        level: 'hight',
        value: {
          value: '',
          text: ''
        },
        clearable: true,
        alertButton: true,
        alertSrc: ''
      },
      {
        keyName: 'couponType',
        name: '票券类型',
        type: 'select',
        level: 'hight',
        value: '',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '兑换券',
          value: '0'
        }, {
          label: '优惠券',
          value: '2'
        }, {
          label: '代金券',
          value: '1'
        }]
      }, {
        keyName: 'state',
        name: '状态',
        type: 'select',
        level: 'hight',
        value: '',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '未提交',
          value: '0'
        }, {
          label: '新建',
          value: '1'
        }, {
          label: '已激活',
          value: '2'
        }, {
          label: '已停用',
          value: '3'
        }, {
          label: '已作废',
          value: '4'
        }, {
          label: '已过期',
          value: '5'
        },
        {
          label: '修订中',
          value: '-1'
        },
        {
          label: '票券验证中',
          value: '7'
        }, {
          label: '票券验证不通过',
          value: '8'
        }, {
          label: '票券生成中',
          value: '9'
        }]
      },
      // {
      //     keyName: 'batchCode',
      //     name: '销售批次号',
      //     type: 'input',
      //     level: 'hight',
      //     value: '',
      // },
      {
        keyName: 'auditState',
        name: '审批状态',
        type: 'select',
        level: 'hight',
        value: '',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '审批通过',
          value: '0'
        }, {
          label: '审批未通过',
          value: '1'
        }, {
          label: '未审批',
          value: '2'
        }]
      }, {
        keyName: 'ticketTimeUp',
        name: '票券过期日期',
        type: 'date-picker',
        level: 'hight',
        value: ''
      }
      ],
      tableConfig: {
        title: [{
          label: '申请单号',
          prop: 'applyCode',
          width: '190'
        }, {
          label: '票券名称',
          prop: 'couponName',
          width: ''
        }, {
          label: '票券类型',
          prop: 'couponType',
          width: ''
        }, {
          label: '数量',
          prop: 'couponCount',
          width: ''
        }, {
          label: '有效期起',
          prop: 'validDateStart',
          width: '',
          hasTemplate: true
        }, {
          label: '有效期止',
          prop: 'validDateEnd',
          width: '',
          hasTemplate: true
        }, {
          label: '客商名称',
          prop: 'custName',
          width: '100'
        }, {
          label: '申请人',
          prop: 'createUserName',
          width: ''
        }, {
          label: '状态',
          prop: 'state',
          width: '',
          hasTemplate: true
        }, {
          label: '审批状态',
          prop: 'auditState',
          width: '',
          hasTemplate: true
        }, {
          label: '操作',
          hasTemplate: true,
          fixed: 'right',
          width: '200'
        }],
        data: []
      },
      pageConfig: {
        start: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        pageNo: 1,
        total: 0
      },
      searchParam: {},
      delayWindow: {
        labelWidth: '120px',
        isShow: false,
        pickerOptions: {
          disabledDate (time) {
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let dateString = `${y}-${m}-${d}`;
            // pointer.delayWindow.validDateStart
            return time.getTime() < new Date(dateString);
          }
        },
        applyCode: '',
        validDateStart: '',
        validDateEnd: ''
      }
    };
  },
  created () {

    if (!this.tableConfig.data.length || this.$route.params.isFresh) {
      this.search();
    }
  },
  methods: {
    /**
     * @function search - 搜索
     */
    search (param) {
      let params = this.setParams(param);
      this.getData(params);
    },
    /**
     * @function setSearch - 修改搜索栏数据
     */
    setSearch (param) {
      this.searchParam = param;
    },
    /**
     * @function setParams - 设置请求参数
     *
     * @return {Object} param
     */
    setParams (params) {
      console.log(params);
      params = params || '';
      let searchParam = this.searchParam;
      let keysArr = ['applyCode', 'auditState', 'batchCode', 'contractCode', 'couponName', 'couponType', 'state', 'queryCreateUserName'];

      let _params = {};
      keysArr.forEach((item) => {
        if (!_params[`${item}`]) {
          _params[`${item}`] = params[`${item}`] ? params[`${item}`] : searchParam[`${item}`] ? searchParam[`${item}`] : '';
        }
      });

      let timesArr = [{
        keys: 'proposDate',
        children: ['createTimeStart', 'createTimeEnd']
      }, {
        keys: 'ticketTimeUp',
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

      let _keysArr = ['custId', 'incomeCinemaId'];
      _keysArr.forEach((item, index) => {
        if (!_params[`${item}`]) {
          _params[`${item}`] = params[`${item}`] ? params[`${item}`].value : searchParam[`${item}`] ? searchParam[`${item}`].value : '';
        }
      });

      let pageKeysArr = ['pageSize', 'pageNo'];
      pageKeysArr.forEach((item, index) => {
        if (!_params[`${item}`]) {
          _params[`${item}`] = this.pageConfig[`${item}`];
        }
      });
      if (params) {   // 每次点击查询按钮，  理应页数返回第一页
        this.pageConfig['pageNo'] = 1;
        _params[`pageNo`] = 1;
        console.log(this.pageConfig['pageNo'], '页数回到第一页');
        console.log(_params);
      }
      return _params;
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
     * @function getData - 请求数据
     */
    getData (params) {
      this.$ccmList.findSaleList(params).then((data) => {
        let type = 'warning';
        if (data.flag == 2) {
          type = 'success';
        }
        if (type == 'success') {
          this.tableConfig.data = data.data;
          this.pageConfig.total = data.pageNum;
          this.tableConfig.data.map((item, idx) => {
            item.couponType = this.ticketTypes(item.couponTypeRight.couponType);
          });
        }
      }).catch((msg) => {
        console.log('查询销售单列表错误：', msg);
      });
    },
    /**
     * @function ticketTypes - 票券类型
     * @param {Number} statusVal - 状态码
     */
    ticketTypes (statusVal) {
      let statusText = '';
      switch (statusVal) {
        case '0':
          statusText = '兑换券';
          break;
        case '1':
          statusText = '代金券';
          break;
        case '2':
          statusText = '优惠券';
          break;
        default:
          statusText = '全部';
          break;
      }
      return statusText;
    },
    /**
     * @function ticketStatus - 票券状态
     * @param {Number} statusVal - 状态码
     */
    ticketStatus (row) {
      let statusText = '';
      switch (row.state) {
        case 0:
          statusText = '未提交';
          break;
        case 1:
          statusText = '新建';
          break;
        case 2:
          statusText = '已激活';
          statusText = row.isRevision == 1 && row.state == 2 ? '修订中' : statusText;
          if (row.genStatus) {              // genStatus==2 生成中优先级大于修订中
            // if(row.genStatus==1){
            //     statusText = '已经生成'
            // }else if(row.genStatus == 0){
            //     statusText = '未生成'
            // }else if (row.genStatus == 2){
            //     statusText = '生成中'
            // }
            if (row.genStatus == 2) {
              statusText = '票券生成中';
            }
          }
          break;
        case 3:
          statusText = '已停用';
          break;
        case 4:
          statusText = '已作废';
          break;
        case 5:
          statusText = '已过期';
          break;
        case 7:
          statusText = '票券验证中';
          break;
        case 8:
          statusText = '票券验证不通过';
          break;
        case 9:
          statusText = '票券生成中';
          break;
        case 10:
          statusText = '迁移';
          break;
        default:
          statusText = '未知';
          break;
      }
      return statusText;
    },
    /**
     * @function auditStatus - 审批状态
     */
    auditStatus (statusVal) {
      let statusText = '';
      switch (statusVal) {
        case 0:
          statusText = '审批通过';
          break;
        case 1:
          statusText = '审批未通过';
          break;
        case 2:
          statusText = '未审批';
          break;
        default:
          statusText = '未知';
          break;
      }
      return statusText;
    },
    /**
     * @function level1Template - 一级操作状态模板
     * @param {Number} auditStatus - 审批状态
     * @param {Number} ticketStatus - 票券状态
     */
    level1Template (auditStatus, ticketStatus, row) {
      // use中第一位为auditStatus，第二位为ticketStatus
      let controls = [{
        label: '查看',
        emitFn: 'check',
        use: 'all'
      }, {
        label: '导出',
        emitFn: 'export',
        use: '0&&2,0&&3,0&&4,0&&5'
      }, {
        label: '修改',
        emitFn: 'change',
        use: '2&&0,2&&8,1&&1,1&&0'
      }];
      if (row.genStatus == 2) {  // 票券生成中的按钮菜单
        return [{
          label: '查看',
          emitFn: 'check',
          use: 'all'
        }
        ];
      }

      if (ticketStatus == 10) {   // 数据迁移按钮菜单
        return [
          {
            label: '修订',
            emitFn: 'revise'
          }
        ];
      }
      let controlArray = [];
      let currentStatus = `${auditStatus}&&${ticketStatus}`;
      for (let i = 0; i < controls.length; i++) {
        let currentUse = controls[i].use;
        if (currentUse == 'all') {
          controlArray.push(controls[i]);
        } else if (currentUse.indexOf(currentStatus) != -1) {
          controlArray.push(controls[i]);
        }
      }
      return controlArray;
    },
    /**
     * @function level2Template - 二级操作状态模板
     * @param {Number} auditStatus - 审批状态
     * @param {Number} ticketStatus - 票券状态
     */
    level2Template (auditStatus, ticketStatus, row) {
      let controls = [{
        label: '删除',
        emitFn: 'delete',
        use: '2&&0,2&&8'
      }, {
        label: '复制',
        emitFn: 'copy',
        use: 'all'
      }, {
        label: '提交审批',
        emitFn: 'submit',
        use: '1&&1,2&&0,2&&8'
      }, {
        label: '查看审批单',
        emitFn: 'checkApporve',
        use: '2&&1,0&&9,0&&2,0&&3,0&&4,0&&5,1&&1,2&&7,1&&0'
      }, {
        label: '作废',
        emitFn: 'blankOut',
        use: '0&&9,0&&2,0&&3'
      }, {
        label: '修订',
        emitFn: 'revise',
        use: '0&&2'
      }, {
        label: '停用',
        emitFn: 'stop',
        use: '0&&2'
      }, {
        label: '延期',
        emitFn: 'delay',
        use: '0&&2,0&&5'
      }, {
        label: '启用',
        emitFn: 'start',
        use: '0&&3'
      }];

      let controlArray = [];
      if (row.genStatus == 2) {   // 票券生成中的按钮菜单
        return [
          {
            label: '复制',
            emitFn: 'copy'
          }, {
            label: '查看审批单',
            emitFn: 'checkApporve'
          }, {
            label: '作废',
            emitFn: 'blankOut'
          }
        ];
      } else if (ticketStatus == 10) {  // 数据迁移的按钮菜单
        return [
          {
            label: '修订',
            emitFn: 'revise'
          }
        ];
      }
      let currentStatus = `${auditStatus}&&${ticketStatus}`;
      for (let i = 0; i < controls.length; i++) {
        let currentUse = controls[i].use;
        if (currentUse == 'all') {
          controlArray.push(controls[i]);
        } else if (currentUse.indexOf(currentStatus) != -1) {
          if (controls[i]['emitFn'] == 'revise') {
            if (row.isRevision == 1) {
              // console.log('修订中---------')
              continue;
            }   // 如果是修订中 则去除修订菜单
          }
          controlArray.push(controls[i]);
        }
      }

      return controlArray;
    },
    /**
     * @function controlEmitFn - 操作状态分发事件
     */
    controlEmitFn (emitFn, param) {
      this[`${emitFn}`](param);
    },
    /**
     * @function commandLevel2 - 二级操作菜单分发
     * @param {Array} command - 只有两项，第一项为数据，第二项为触发方法
     */
    commandLevel2 (command) {
      let param = command[0];
      let emitFn = command[1].emitFn;
      this.controlEmitFn(emitFn, param);
    },
    /**
     * @function check - 查看
     */
    check (param) {
      this.$router.push({
        path: 'checkSaleList',
        query: {
          applyCode: param.applyCode
        }
      });
    },
    /**
     * @function create - 新建
     */
    create () {
      this.$router.push({
        name: 'createSales',
        query: {
          pageName: 'add',
          isAdd: true
        }
      });
    },
    /**
     * @function change - 修改
     */
    change (param) {
      this.$router.push({
        name: 'editSales',
        query: {
          applyCode: param.applyCode,
          isEdit: true,
          ischange: true,
          pageName: 'edit'
        }
      });
    },

    /**
     * @function copy - 复制
     */
    copy (param) {
      this.$router.push({
        name: 'copySales',
        query: {
          applyCode: param.applyCode,
          isEdit: true,
          isCopy: true,
          pageName: 'copy'
        }
      });
    },
    /**
     * @function revise - 修订
     */
    revise (param) {
      console.log('修订:', param);
      this.$router.push({
        name: 'reviseSales',
        query: {
          applyCode: param.applyCode,
          incomeCinemaId: param.incomeCinemaId,
          isEdit: true,
          isrevise: true,
          pageName: 'revise'
        }
      });
    },
    /**
     * @function export - 导出
     */
    export (param) {
      let pointer = this;
      let type = 'warning';
      let url = this.baseUrl + '/coupon/apply/export?applyCode=' + param.applyCode;
      let headers = {};
      if (this.$store.state.CpmUserKey) {
        headers['Cpm-User-Token'] = this.$store.state.CpmUserKey;
      }
      if (sessionStorage.getItem('token')) {
        headers['Cpm-User-Token'] = sessionStorage.getItem('token');
      }
      Axios(url, {
        headers,
        method: 'post',
        responseType: 'blob'
      })
        .then(data => {
          console.log(data.headers);
          let flag = data.headers.flag;
          let message = '导出失败，请稍后尝试！';
          if (flag == '1') {
            type = 'success';
            message = '导出成功！';
            const blob = new Blob([data.data]);
            const fileName = data.headers.filename;
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          }
          this.$message({
            type,
            message
          });
        });
    },
    /**
     * @function delete - 删除
     */
    delete (param) {
      console.log('删除:', param);
      let params = {
        applyCode: param.applyCode
      };
      this.$confirm('是否删除', '提示', { type: 'warning' }).then(_ => {
        this.$ccmList.deleteSaleList(params).then(res => {
          let type = 'warning';
          if (res.code == 200) {
            type = 'success';
          }
          this.$message({
            type,
            message: '删除票券申请单成功',
            onClose: _ => {
              if (res.code == 200) {
                this.search();
              }
            }
          });
        }).catch(msg => {
          console.log('删除票券申请单错误', msg);
        });
      });
    },
    /**
     * @function submit - 提交审批
     */
    submit (param) {
      console.log('提交审批:', param);
      let params = {
        applyCode: param.applyCode
      };
      this.$ccmList.createAuditBill(params).then(res => {
        let type = 'warning';
        let message = '提交审批单失败，请稍后尝试';
        if (res.code == 200) {
          type = 'success';
          message = '提交审批单成功';
        }
        this.$message({
          type,
          message,
          duration: 1000
        });
        if (res.code == 200) {
          this.search();
        }
      }).catch(msg => {
        console.log('提交审批单失败：', msg);
      });
    },
    /**
     * @function checkApporve - 查看审批单
     */
    checkApporve (param) {
      console.log('查看审批单:', param.applyCode);
      this.bizNo = param.applyCode;
      // this.bizNo = param.batchCode
      this.dialogFormVisible = true;
    },
    close (blool) {
      this.dialogFormVisible = false;
    },
    /**
     * @function blankOut - 作废
     */
    blankOut (param) {
      let params = {
        applyCode: param.applyCode
      };
      this.$ccmList.abandonSaleList(params).then(data => {
        let type = 'warning';
        let message = data.msg;
        if (data.flag == 3) {
          type = 'success';
          message = '作废销售单成功';
        }
        this.$message({
          type,
          message
        });
        if (type == 'success') {
          this.search();
        }
      }).catch(msg => {
        console.log('作废销售申请单错误：', msg);
      });
    },

    /**
     * @function start - 启用
     */
    start (param) {
      let params = {
        applyCode: param.applyCode,
        state: param.state
      };
      this.$ccmList.startSaleList(params).then(data => {
        let type = 'warning';
        let message = '启用票券销售单失败，请稍后尝试';
        if (data.flag == 2) {
          type = 'success';
          message = '启用销售单成功';
        }
        this.$message({
          type,
          message
        });
        if (type == 'success') {
          this.search();
        }
      }).catch(msg => {
        console.log('启用票券销售单错误：', msg);
      });
    },
    /**
     * @function stop - 停用
     */
    stop (param) {
      let params = {
        applyCode: param.applyCode,
        auditState: param.auditState
      };
      this.$ccmList.stopSaleList(params).then(data => {
        let type = 'warning';
        let message = '停用销售单失败，请稍后再尝试';
        if (data.flag == 2) {
          type = 'success';
          message = '停用销售单成功';
        }
        this.$message({
          type,
          message
        });
        if (type == 'success') {
          this.search();
        }
      }).catch(msg => {
        console.log('停用销售单错误：', msg);
      });
    },
    /**
     * @function delay - 延期
     */
    delay (param) {
      this.setDelayParam(true, param.applyCode, param.validDateStart, param.validDateEnd);
    },
    /**
     * @function setDelayParam - 设置延期参数
     */
    setDelayParam (isShow, applyCode, validDateStart, validDateEnd) {
      this.delayWindow[`applyCode`] = applyCode;
      this.delayWindow[`validDateStart`] = this.ruleTime(validDateStart);
      this.delayWindow[`validDateEnd`] = new Date(validDateEnd);
      this.delayWindow.isShow = isShow;
    },
    /**
     * @function sureDelay - 确定延期
     */
    sureDelay () {
      let params = {
        applyCode: this.delayWindow[`applyCode`],
        validDateEnd: this.ruleTime(this.delayWindow[`validDateEnd`])
      };
      this.$confirm('延期操作时，系统默认暂停票券申请单，请手启动恢复使用！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ccmList.delaySaleList(params).then(data => {
          let type = 'warning';
          let message = data.msg;
          if (data.flag == 2) {
            type = 'success';
            message = '票券延期成功';
          }
          this.$message({
            type,
            message
          });
          this.setDelayParam(false, '', '', '');
          if (type == 'success') {
            this.search();
          }
        }).catch(msg => {
          console.log(msg);
          this.setDelayParam(false, '', '', '');
        });
      });
    },
    /**
     * @function cancleDelay - 取消延期
     */
    cancleDelay () {
      this.setDelayParam(false, '', '', '');
    },
    /**
     * @function ruleTime - 格式化时间
     * @param {Object} time - 时间
     * @param {String} [type='time'] - 可选参数,格式化类型 时分
     */
    ruleTime (time, type) {
      let _time = new Date(time);

      let _year = _time.getFullYear(),
        _mounth = _time.getMonth() + 1,
        _day = _time.getDate(),
        _hours = _time.getHours(),
        _minutes = _time.getMinutes();

      let returnStr = `${_year}-${_mounth}-${_day}`;
      if (type == 'time') {
        returnStr = `${_hours}:${_minutes}`;
      }

      return returnStr;
    },
    /**
     * @function handleSizeChange - 修改分页大小
     */
    handleSizeChange (val) {
      this.pageConfig.pageSize = val;
      this.search();
    },
    /**
     * @function handleCurrentChange - 修改当前显示页
     */
    handleCurrentChange (val) {
      this.pageConfig.pageNo = val;
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/comList.scss";
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.delayLine {
  margin-left: 15px;
  margin-right: 15px;
}
/deep/.el-dropdown-link {
  color: #3b74ff;
}
</style>
