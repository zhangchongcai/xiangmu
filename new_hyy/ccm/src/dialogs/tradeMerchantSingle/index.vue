<template>
  <div class="ccm_dialog">
    <el-dialog title="选择客商名称" :visible.sync="dialogVisible" :close-on-click-modal="false">

      <el-form label-width="" :inline="true">
        <el-form-item label="客户账号" class="two_search">
          <el-input v-model="customerCode" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="客户全称">
          <el-input v-model="customerName" style="width:100px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="客户类型:">
          <el-select v-model="customerType" style="width:150px" @change="change()">
            <el-option label="全部" value>全部</el-option>
            <el-option label="大客户" value="1">大客户</el-option>
            <el-option label="第三方" value="2">第三方</el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态:">
          <el-select v-model="customerStatus" style="width:150px" @change="change()">
            <el-option label="全部" value>全部</el-option>
            <el-option label="启用" value="1">启用</el-option>
            <el-option label="禁用" value="2">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="position:absolute;right:0" @click="searchUser">查询</el-button>
      </el-form>
      <div class="choose-body">
        <div class="choose-table">
          <el-table :data="tableList" @row-click="select" ref="singleTable">
            <el-table-column label="选择" width="50">
              <template slot-scope="scope">
                <el-radio v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <template v-for="(item,index) in tableConfig">
              <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''">
                <div slot-scope="scope">
                  {{item.label=="客户类型"?formatType(scope.row.type):formatRole(scope.row.status)}}
                </div>
              </el-table-column>
              <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column> -->
            </template>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="page-wrap">
          <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum" :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
          </el-pagination>
        </div>

      </div>
      <div slot="footer">
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
// import {cusList} from "frame_cpm/http/interface.js"
export default {
  props: {
    customerType: {
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      selectedId: '',
      customerCode: '',
      customerName: '',
      customerStatus: '',
      selectRows: '',
      tableList: [],
      pageData: {
        pageNum: 1,
        total: 0,
        size: 10
      },
      tableConfig: [
        {
          label: '客户账号',
          prop: 'code',
          width: '',
          hasTemplate: false
        }, {
          label: '客户全称',
          prop: 'fullName',
          width: '',
          hasTemplate: false
        }, {
          label: '客户类型',
          prop: 'propertyName',
          width: '',
          hasTemplate: true
        },
        {
          label: '状态',
          prop: 'status',
          width: '',
          hasTemplate: true
        }
      ]
    };
  },
  methods: {
    formatRole (status) {
      return status == 1 ? '启用' : '禁用';
    },
    formatType (type) {
      return type == 1 ? '大客户' : type == 2 ? '第三方' : '未知';
    },
    // 点击选择数据（暂时储存的数据）
    select (row) {
      if (row) {
        console.log(row);
        this.selectedId = row.id;
        this.selectRows = row;
      }
    },
    // 确定选择
    chooseUser () {
      if (this.selectRows) {
        this.$emit('tradeMerchantSingleCallBack', this.selectRows);
      }
      this.dialogVisible = false;
    },
    // 打开弹窗
    openDialog (val, innerdata) {
      this.dialogVisible = val;
      this.searchData();
      this.selectedId = Number(innerdata);
    },
    // 页面改变
    handleCurrentChange (val) {
      this.pageData.pageNum = val;
      this.searchData();
    },
    // 查询
    searchUser () {
      this.searchData();
    },
    searchData () {
      console.log();
      let params = {
        pageNum: this.pageData.pageNum,
        pageSize: this.pageData.size,
        name: this.customerName,
        code: this.customerCode,
        status: this.customerStatus,
        consumerId: this.$store.state.loginUser['consumerId']  // 租户id
      };
      if (this.customerType) {
        params.type = this.customerType == 3 ? 1 : 2;      // 这里传入3或者4   1是大客户  2是第三方
      }
      this.$ccmList.listBuyerCondition(params).then(res => {
        if (res.data && res.code == 200) {
          this.tableList = res.data.rows;
          this.pageData.total = res.data.total;
          // this.selectData()
        }
      });
    }

  },
  created () { }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/dialogs.scss";
</style>