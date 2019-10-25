<template>
  <div class="cwf_normalApproval">
    <div>
      <!-- 搜索栏 -->
      <section>
        <el-form :inline="true" :model="searchFormData" ref="searchFormData" class="cwf_search">
          <el-form-item label="业务单据号：" label-width="84px">
            <el-input v-model="searchFormData.bizNo" @blur="()=>{searchFormData.bizNo = searchFormData.bizNo.trim();}" placeholder="业务单据号" clearable></el-input>
          </el-form-item>
          <el-form-item label="申请人：" label-width="60px">
            <el-input v-model="searchFormData.applyUserName" @blur="()=>{searchFormData.applyUserName = searchFormData.applyUserName.trim();}" placeholder="申请人" clearable></el-input>
          </el-form-item>
          <el-form-item label="单据类型：" label-width="72px">
            <el-select v-model="searchFormData.bizTypeName" placeholder="请选择单据类型">
              <el-option v-for="item in bizTypeNameOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审批状态：" label-width="72px">
            <el-select v-model="searchFormData.status" placeholder="请选择审批状态">
              <el-option v-for="item in approvalStatusOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetForm()" plain>重置</el-button>
          </el-form-item>
        </el-form>
      </section>

      <!-- 表格 -->
      <section>
        <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
      </section>

      <!-- 分页 -->
      <section class="flex-base flex-center pageStyle" v-if="tableData.length != 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
        </el-pagination>
      </section>

    </div>
  </div>
</template>

<script>
import commonTable from '../../../components/Table/commonTable.vue';
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
const { cacheMixin } = requireModule('base');
export default {
  components: {
    commonTable,
  },
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      //缓存对象数据
      cacheField: ["searchFormData", "bizTypeNameOptions", "pageConfig"],
      subComName: "normalApproval",//缓存数据唯一标识
      //查询头
      searchFormData: {
        applyUserName: "",
        bizNo: "",
        bizTypeName: "",
        pageNo: 1,
        pageSize: 10,
        status: '1',
      },
      //单据类型选项列表
      bizTypeNameOptions: [],
      //审批状态选项列表
      approvalStatusOptions: [
        {
          label: '全部',
          value: '0'
        }, {
          label: '待审批',
          value: '1'
        }, {
          label: '审核通过',
          value: '2'
        }, {
          label: '审核驳回',
          value: '3'
        }
      ],
      tenantId: this.$store.state.loginUser.consumerId || "", //商户id
      //分页设置
      pageConfig: {
        start: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      },
      //表格数据
      tableData: [],
      //表格项名称数据
      tableLabels: [{
        prop: 'bizNo',
        label: '业务单据号',
        // width: '250'
      },
      {
        prop: 'bizName',
        label: '单据名称',
        // width: '250'
      },
      {
        prop: 'bizTypeName',
        label: '单据类型',
        // width: '165'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        // width: '200'
      },
      {
        prop: 'applyUserName',
        label: '申请人',
        // width: '120'
      },
      {
        prop: 'applyGroupName',
        label: '申请人单位',
        // width: '150'
      },
      {
        prop: 'statusRespons',
        label: '审批状态',
        // width: '100',
        hasTemplate: true,
        formatRole: (scope) => {
          switch (scope.row.statusRespons) {
            case 1:
              return '待审批';
              break;
            case 2:
              return '审核通过';
              break;
            case 3:
              return '驳回审核';
              break;
            case 4:
              return '未审批';
              break;
            default:
              return '未知状态';
              break;
          };
        }
      }
      ],
      //表格操作设置
      tableOptions: {
        label: "操作",
        fixed: "right",
        width: '200',
        options: [{
          text: "查看",
          method: "approvalDetail",
          condition: (scope) => {
            return true;
          }
        }, {
          text: "审批",
          method: "approvalSetting",
          condition: (scope) => {
            return (scope.row.statusRespons == 1)
          }
        }
        ]
      },
    }
  },
  created () {
    this.handleSearch();
    //判断是否缓存
    if (this.bizTypeNameOptions.length == 0) {
      this.getBillNormalSetting()
    }
  },
  methods: {
    //获取单据设置列表
    getBillNormalSetting () {
      let params = {
        global: 1,
        orginizationId: 0,
        tenantId: this.tenantId
      }
      this.$cwfList.getBillNormalSetting(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          this.resetSearchParams(data.data.businessTypeList)
        } else if (data.code === 200 && data.flag == 2) {
          this.resetSearchParams(data.data.businessTypeList)
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //渲染单据设置列表
    resetSearchParams (list) {
      this.bizTypeNameOptions = list.map((item) => {
        return {
          label: item.businessName,
          value: item.businessName
        }
      })
      console.log("bizTypeNameOptions", this.bizTypeNameOptions)
      this.bizTypeNameOptions.unshift({
        label: "全部",
        value: ""
      })
    },
    //搜索
    search () {
      this.pageConfig.currentPage = 1;
      this.handleSearch();
    },
    //重置
    resetForm () {
      this.searchFormData = {
        applyUserName: "",
        bizNo: "",
        bizTypeName: "",
        pageNo: 1,
        pageSize: 10,
        status: '1',
      }
    },
    //获取数据
    handleSearch () {
      console.log("searchFormData", this.searchFormData)
      let params = {}
      this.searchFormData.pageSize = this.pageConfig.pageSize
      this.searchFormData.pageNo = this.pageConfig.currentPage

      if (this.searchFormData.status == "0") {
        params.status = [1, 2, 3]
      } else {
        let list = []
        list.push(parseInt(this.searchFormData.status))
        params.status = list
      }
      //过滤空值
      for (const key in this.searchFormData) {
        if (key != "status") {
          if (this.searchFormData[key]) {
            params[key] = this.searchFormData[key];
          }
        }
      }
      console.log("params", params)

      this.getDataList(params)
    },
    // 获取数据列表
    getDataList (params) {
      this.$cwfList.searchApproval(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          this.tableData = data.data;
          this.pageConfig.total = data.pageNum;
        } else if (data.code === 200 && data.flag == 2) {
          this.tableData = [];
          this.pageConfig.total = 0;
        } else {
          this.tableData = [];
          this.pageConfig.total = 0;
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //操作列回调
    handleButton (data) {
      this[`${data.method}`](data.scope);
    },
    /* 查看审批单 */
    approvalDetail (scope) {
      console.log("checkInfo", scope)
      this.$router.push({
        path: "/workflow/checkNormalApproval",
        query: {
          atId: scope.row.atId,
          type: "check"
        }
      })
    },
    /* 审批审批单 */
    approvalSetting (scope) {
      console.log("approvalInfo", scope)
      this.$router.push({
        path: "/workflow/checkNormalApproval",
        query: {
          atId: scope.row.atId,
          type: "approval"
        }
      })
    },
    //修改分页大小
    handleSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize;
      this.pageConfig.currentPage = 1;
      this.handleSearch()
    },
    //修改当前显示页
    handleCurrentChange (currentPage) {
      this.pageConfig.currentPage = currentPage;
      this.handleSearch()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/comList.scss";
/deep/ .el-select-dropdown__item {
  font-size: 12px !important;
  font-family: "MicrosoftYaHei" !important;
}
.cwf_normalApproval {
  //查询头样式
  .cwf_search {
    padding: 24px;
    background-color: #f3f3f3;
    .el-form-item {
      margin: 0;
      margin-right: 32px;
      /deep/ .el-form-item__label {
        color: #666666;
        font-size: 12px !important;
      }
      .el-input {
        width: 192px;
        font-size: 12px !important;
        color: #666666;
      }
      /deep/ .el-select {
        width: 192px;
        .el-input__inner {
          font-size: 12px !important;
        }
      }
    }
    .el-button {
      width: 80px;
    }
  }
  section {
    margin-bottom: 15px;
  }
  .el-pagination {
    text-align: center;
  }
}
</style>
