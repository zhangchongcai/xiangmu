<template>
  <div class="imtc-style" ref="print">
    <div class="content">
      <div class="tittle"></div>
      <el-form :inline="true" ref="ruleForm" :model="queryData" label-position="left" label-width="100px" label-suffix="：">
        <div class="print-title">盘点单</div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="盘点门店" class="select-input" prop="cinemaName">
                <template v-if="printActive == false">
                  <el-input v-model="queryData.cinemaName" clearable @clear="onCinemalSumit" @focus="selectCinemalDialog" placeholder="请选择门店"></el-input>
                  <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain class="no-print">选择</el-button>
                </template>
                <span v-else>{{this.queryData.cinemaName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="盘点方案" prop="solutionName">
                <el-select v-model="queryData.solutionUid" @focus="pdfnSelEvent()" @change="changePdfnEvent()" v-if="printActive == false">
                  <el-option v-for="item in pdfnData" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
                </el-select>
                <span v-else>{{queryData.solutionName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label='' prop="storehouseName">
                <el-select v-model="queryData.storeType" @focus="ckhjEvent()" v-if="printActive == false" style="width:120px;">
                  <el-option label="盘点仓库" value="1"></el-option>
                  <el-option label="盘点货架" value="2"></el-option>
                </el-select>
                <span v-else>{{queryData.storeType == "1" ? "盘点仓库" : "盘点货架"}}</span>
                <span>:</span>
                <el-select v-model="queryData.storehouseCode" @focus="storeSelEvent()" @change="changeStoreEvent()" v-if="printActive == false">
                  <el-option v-for="item in storeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
                <span v-else>{{queryData.storehouseName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="print-two-title">盘点商品清单</div>
        <div>
          <el-table :data="queryData.checkBillMerEntityList" stripe>
            <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter">
              <template slot-scope="{row}" name="header">
                <div v-if="item.edit">
                  <el-input size="small" v-model="row[item.key]" placeholder></el-input>
                </div>
                <div v-else>
                  <span>{{row[item.key]}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- </div> -->
        <!-- 选择影院弹窗 -->
        <cinemal-dialog class="no-print" ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="saleCinemaList"></cinemal-dialog>
        <div class="submit-box no-print">
          <el-button type="primary" @click="ThandleSubmit">打印</el-button>
          <!-- <el-button type="primary" @click="ChandleSubmit" v-if="this.queryData.status != 2">导出Excel</el-button> -->
          <el-button @click="fanhuihandleCancel">关闭</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import moment from 'moment';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import Print from 'cimSrc/mixins/cim/print.js';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import suppliersDialog from 'cimSrc/components/suppliersDialog/suppliersDialog.vue';
import selectedGoods from 'cimSrc/dialogs/cimSelectedGoods/index.vue';
Vue.use(Print);
export default {
  mixins: [mixin],
  data () {
    return {
      // 打印状态
      printActive: false,
      activeNames: ['1', '2', '3'],
      saleCinemaList: [],
      // 盘点商品当前分页数
      currentPage: '',
      // 盘点商品总数
      totalPag: '',

      selectedGoodsDialogVisible: false,
      goodList: [],
      pdfnData: [],
      storeData: [],
      // 查询数据
      queryData: {
        billCode: '',
        cinemaName: '',
        cinemaUid: '',
        remarks: '',
        saveStatus: '',
        solutionName: '',
        solutionUid: '',
        storeType: '1',
        storehouseCode: '',
        storehouseName: '',
        checkBillMerEntityList: []
      },
      options: [
        {
          label: '江苏',
          cities: []
        },
        {
          label: '浙江',
          cities: []
        }
      ],
      props: {
        value: 'label',
        children: 'cities'
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: '商品名称',
          key: 'merName'
        },
        {
          label: 'SKU编码',
          key: 'skuCode'
        },
        {
          label: '商品规格',
          key: 'merSpec'
        },
        {
          label: '基本单位',
          key: 'unitName'
        },
        {
          label: '实盘库存数',
          key: 'checkStoreCount',
          edit: true
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  mounted () {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init () {
      if (this.$route.query.type == '1') {
        this.resCheckBillCreateBillCode();
        // console.log(JSON.parse(this.$route.query.data))
      } else if (this.$route.query.type == '2') {
        this.queryData = JSON.parse(this.$route.query.data);
        console.log(this.queryData);
      }
    },
    // 查询
    onQuery () {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
    // 选泽门店回调
    setCinema (data = []) {
      this.clearQueryData();
      if (data.length > 0) {
        this.queryData.cinemaName = data[0].name || data[0].cinemaName;
        this.queryData.cinemaUid = data[0].uid || data[0].cinemaUid;
      } else {
        this.queryData.cinemaName = '';
        this.queryData.cinemaUid = '';
      }
      let newArr = [];
      data.forEach((val, index, arr) => {
        let newObj = {};
        newObj.cinemaUid = val.cinemaUid || val.uid;
        newObj.name = val.cinemaName || val.name;
        newArr.push(newObj);
      });
      this.saleCinemaList = newArr;
    },
    // 选泽门店回调
    onCinemalSumit (val = [], type) {
      console.log(val, ' 选泽门店回调', type);
      if (val.length > 0) {
        if (type == 'default') {
          if (val.length == 1) {
            this.setCinema(val);
          }
        } else {
          this.setCinema(val);
        }
      } else {
        this.setCinema();
      }
    },
    // 获取分类列表
    getCategoryTrees (param) {
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(param)
        .then(resData => {
          if (resData.code == 200) {
            this.categoryTrees = resData.data.children;
          }
        });
    },
    handleOperateEvent (row, index) {
      this.goodList.splice(index, 1);
      console.log(this.goodList);
    },
    //
    ThandleSubmit () {
      if (this.queryData.cinemaName == '') {
        this.$message('请选择影院');
      } else {
        if (this.queryData.solutionName == '') {
          this.$message('请选择盘点方案');
        } else {
          if (this.queryData.storehouseName == '') {
            this.$message('请选择仓库或货架');
          } else {
            this.$print(this.$refs.print);
          }
        }
      }
      // this.printActive = true

      // let newAvtive = {}
      // let dqActive = ""
      // this.queryData.checkBillMerEntityList.some((val,newindex,arr)=>{
      //   let check = /(^[1-9][0-9]{0,})|(^0)/g
      //   if(val.checkStoreCount === "" || val.checkStoreCount === null || !check.test(val.checkStoreCount)){
      //     return newAvtive = {a1:true,a2:val}
      //   }
      // })
      // if(newAvtive.a1 === true){
      //   this.$message(newAvtive.a2.merName+":没有填入实盘库存数字");
      // }else{
      // this.$refs["ruleForm"].validate(valid => {
      //   if (valid) {
      //      this.$print(this.$refs.print)
      //   }else{
      //     return false;
      //   }
      // })
      // }
    },
    ChandleSubmit () {
      let newAvtive = {};
      let dqActive = '';
      this.queryData.checkBillMerEntityList.some((val, newindex, arr) => {
        let check = /(^[1-9][0-9]{0,})|(^0)/g;
        if (val.checkStoreCount === '' || val.checkStoreCount === null || !check.test(val.checkStoreCount)) {
          return newAvtive = { a1: true, a2: val };
        }
      });
      if (newAvtive.a1 === true) {
        this.$message(newAvtive.a2.merName + ':实盘库存数必须大于等于0');
      } else {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            if (this.$route.query.type == '1') {
              this.queryData.saveStatus = 1;
              console.log(this.queryData);
              this.queryData.checkBillMerEntityList.forEach((val, index, arr) => {
                delete val.uid;
              });
              this.resCheckBillSave(this.queryData);
            } else if (this.$route.query.type == '2') {
              this.queryData.saveStatus = 1;
              this.resCheckBillUpdate(this.queryData);
            }
          } else {
            return false;
          }
        });
      }
    },
    //
    handleCancel () {
      this.$store.commit('tagNav/removeTagNav', {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      });
      console.log(JSON.stringify(this.queryData));
      this.returnList({
        returnType: true,
        cinema: JSON.stringify(this.queryData)
      });
    },
    returnList (param) {
      this.$router.push({
        path: 'list',
        query: param
      });
    },
    saleCinemaType (type) {
      switch (type) {
        case '0':
          return '指定门店';
          break;
        case '1':
          return '全部门店';
          break;
        case '2':
          return '排除门店';
          break;
      }
    },
    selectCinemalDialog () {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    clearQueryData () {
      this.queryData.solutionName = '';
      this.queryData.solutionUid = '';
      this.queryData.storehouseCode = '';
      this.queryData.storehouseName = '';
      this.queryData.checkBillMerEntityList = [];
      this.pdfnData = [];
    },
    selectSuppliersDialog () {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    ckhjEvent () {
      this.queryData.storehouseName = '';
      this.queryData.storehouseCode = '';
    },
    selectedGoodsDialogCallBack (value) {
      this.goodList = value.data;
      console.log(value);
    },
    // 仓库货架事件
    storeSelEvent () {
      if (this.queryData.cinemaUid == '' || this.queryData.cinemaUid == undefined || this.queryData.cinemaUid == null) {
        this.$message('请选择门店');
      } else {
        if (this.queryData.storeType == '1') {
          this.rescheckBillStorehouse(this.queryData.cinemaUid);
        } else if (this.queryData.storeType == '2') {
          this.resCheckBillStorageRack(this.queryData.cinemaUid);
        }
      }
    },
    // 取消返回
    fanhuihandleCancel () {
      this.$store.commit('tagNav/removeTagNav', {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      });
      this.$router.push({
        path: '/retail/InventoryManagement/inventoryManagement/list'
      });
    },
    // 盘点方案事件
    pdfnSelEvent () {
      if (this.queryData.cinemaUid == '' || this.queryData.cinemaUid == undefined || this.queryData.cinemaUid == null) {
        this.$message('请选择门店');
      } else {
        this.resCheckBillNames('row');
      }
    },
    changePdfnEvent () {
      let selectedWorkName = {};
      selectedWorkName = this.pdfnData.find((item) => {
        return item.uid === this.queryData.solutionUid;
      });
      this.queryData.solutionName = selectedWorkName.name;
      if (this.queryData.solutionUid == '') {
      } else {
        this.resCheckBillCheckSolutionMerInfo();
      }
    },
    // fanhuihandleCancel() {
    //   this.$router.go(-1);
    // },
    changeStoreEvent () {
      let selectedWorkName = {};
      selectedWorkName = this.storeData.find((item) => {
        return item.code === this.queryData.storehouseCode;
      });
      this.queryData.storehouseName = selectedWorkName.name;
    },
    // 请求仓库列表
    rescheckBillStorehouse (row) {
      let val = {
        cinemaUid: row
      };
      console.log(val);
      this.$cimList.inventoryManagement
        .checkBillStorehouse(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data;
            console.log(res);
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    // 请求货架列表
    resCheckBillStorageRack (row) {
      let val = {
        cinameUid: row
      };
      this.$cimList.inventoryManagement
        .checkBillStorageRack(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data;
            console.log(res);
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    // 请求盘点单号
    resCheckBillCreateBillCode () {
      this.$cimList.inventoryManagement
        .checkBillCreateBillCode()
        .then(res => {
          if (res.code === 200) {
            this.queryData.billCode = res.data;
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    // 请求盘点方案
    resCheckBillNames (row) {
      let val = {
        cinemaUid: this.queryData.cinemaUid
      };
      this.$cimList.inventoryManagement
        .checkBillNames(val)
        .then(res => {
          if (res.code === 200) {
            this.pdfnData = res.data;
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    // 请求查询盘点商品清单列表
    resCheckBillCheckSolutionMerInfo (row) {
      this.currentPage = 1;
      let val = {
        uid: this.queryData.solutionUid,
        page: this.currentPage,
        pageSize: 10
      };
      this.$cimList.inventoryManagement
        .checkBillCheckSolutionMerInfo(val)
        .then(res => {
          if (res.code === 200) {
            this.queryData.checkBillMerEntityList = res.data.list;
            this.totalPag = res.data.total;
            console.log(res);
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    // 请求新增盘点单
    resCheckBillSave (row) {
      this.$cimList.inventoryManagement
        .checkBillSave(row)
        .then(res => {
          if (res.code === 200) {
            this.handleCancel();
            this.$message('新增成功');
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => { });
    },
    // 请求修改盘点单
    resCheckBillUpdate (row) {
      this.$cimList.inventoryManagement
        .checkBillUpdate(row)
        .then(res => {
          if (res.code === 200) {
            // this.queryData.checkBillMerEntityList = res.data.list
            console.log(res);
            this.handleCancel();
            this.$message('修改成功');
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => { });
    }
  },
  computed: {
    routeQuery () {
      return this.$route.query;
    },
    routeMerData () {
      if (this.$route.query.data) {
        return JSON.parse(this.$route.query.data);
      } else {
        return {};
      }
    },
    typeText () {
      // 1新建，2修改，3查看
      switch (this.routeQuery.type) {
        // 单品
        case '1':
          return '新建';
          break;
        // 财务
        case '2':
          return '修改';
          break;
        // 合成品
        case '3':
          return '查看';
          break;
      }
    }
  },
  components: {
    cinemalDialog,
    suppliersDialog,
    selectedGoods
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.imtc-style {
  .print-title {
    font-size: 24px;
    text-align: center;
    width: 100%;
    margin-bottom: 24px;
    height: 30px;
    line-height: 30px;
    color: #333;
  }
  .print-two-title {
    font-size: 16px;
    text-align: left;
    height: 20px;
    line-height: 20px;
    width: 100%;
    margin-bottom: 24px;
    color: #333;
  }
  .basic-input {
    min-width: 250px;
  }
  .select-input {
    .el-input {
      width: 65%;
    }
  }
  .remark-input {
    min-width: 450px;
    margin-top: 10px;
    input {
      width: 80%;
    }
  }
  .putaway-timer {
    .el-form-item__content {
      min-width: 150px;
    }
  }

  .recipe-box {
    margin: 30px 0;
  }
  .recipe-tittle-box {
    margin: 10px 0;
  }
  .recipe-tittle {
    line-height: 40px;
    text-align: center;
    font-size: 20px;
  }
  .change-dialog {
    .el-form-item__content {
      width: 60%;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
  }
  .delete-recipe-group {
    font-size: 20px;
  }
  .recipe-name-inp {
    width: 200px;
  }
  .price-inp {
    width: 100px;
  }
  .content {
    padding: 20px;
  }
  .tittle {
    font-weight: 900;
    font-size: 18px;
  }
  .sub-tittle {
    height: 40px;
    line-height: 40px;
    width: 100%;
    background: #f5f5f5;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .submit-box {
    margin-top: 50px;
    text-align: center;
  }
  .table-box {
    margin-top: 10px;
  }
  .both-edit-inp {
    width: 60px;
  }
  .breadcrumb {
    margin-bottom: 30px;
  }
  .text-right {
    text-align: right;
    margin-bottom: 10px;
  }
  .endTime-input {
    width: 110px;
  }
  .empty-box {
    padding: 10px;
    .selected-content {
      margin-top: 6px;
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }
    .empty-content {
      height: 300px;
      overflow-y: auto;
      li {
        margin-top: 5px;
      }
    }
    .el-tag {
      width: 100%;
    }
    .el-tag .el-icon-close {
      float: right;
      top: 4px;
    }
  }
  .el-form-item {
    margin-bottom: 14px;
  }
}
</style>