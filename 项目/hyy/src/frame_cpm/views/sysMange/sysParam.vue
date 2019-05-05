<template>
<div>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/sys' }">系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数设置</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="sys-params-wrap">
      <div class="org-params-header">
        <div class="search-wrap">
          <span>操作名称：</span>
          <el-input size="small" placeholder="请输入操作名称" prefix-icon="el-icon-search" v-model="name"></el-input>
        </div>
        <div class="search-wrap">
          <span>操作描述：</span>
          <el-input size="small" placeholder="请输入操作描述" prefix-icon="el-icon-search" v-model="name"></el-input>
        </div>
      <div class="search-wrap">
          <span>操作人名称：</span>
          <el-input size="small" placeholder="请输入操作名称" prefix-icon="el-icon-search" v-model="name"></el-input>
        </div>
      <div class="button-wrap">
        <el-button type="primary" size="small" @click="getDatas">查询</el-button>
      </div>
      <div class="button-wrap">
        <el-button type="primary" size="small" plain @click="resetHandle">重置</el-button>
      </div>
      </div>
        <div class="org-right-table">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                :stripe=true
                 :row-class-name="tableRowClassName"
                 :header-cell-style='{"background":"#E7EBFF"}'
              >
                <el-table-column
                  prop="actioner"
                  label="操作人"
                 >
                </el-table-column>
                <el-table-column
                  prop="actionerName"
                  label="操作人名称"
                 >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="操作名称"
                 >
                </el-table-column>
                <el-table-column
                  prop="actionDes"
                  label="操作描述"
                 >
                </el-table-column>
                <el-table-column
                  prop="actionTime"
                  label="操作时间"
                 >
                </el-table-column>
                <el-table-column
                  prop="ip"
                  label="ip"
                 >
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="100px"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      @click="removeRelation(scope.$index, scope.row)"
                    >查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </div>
            <div class="page-wrap">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
    </div>
  </div>  
</template>

<script>
  export default {
    name: "sysParam",
    data(){
      return{
        currentPage:  1,
        total: "" || 1,
        size: 10,
        pages: "" || 1,
        name:'',
        dialogVisible:false,
        multipleSelection:[],
        tableData: [{
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        }, {
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        },
        {
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        },
        {
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        },
        {
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        },
        {
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        },
        {
          actioner:'admin',
          actionerName:'超级管理员',
          name: '操作名称',
          actionDes:'单影院产品授权',
          actionTime:'2019-03-06 13:15:45',
          ip:'121.32.27.26',
          action:'查看详情',
        },],
        
      }
    },
    methods:{
      resetHandle() {
      let self = this;
      self.name = "";
     
    },
    getDatas() {
      let self = this;
    },
          //交互模块
      handleSizeChange(val) {
        let self = this;
        self.size = val;
        console.log(`每页 ${val} 条`);
        self.getDatas();
      },
      handleCurrentChange(val) {
        let self = this;
        self.currentPage = val;
        console.log(`当前页: ${val}`);
        self.getDatas();
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex % 2 == 1) {
          return "warning-row";
        } else {
          return "success-row";
        }
        return "";
      },
      removeRelation(){
        this.dialogVisible =true
      },
    }
  }
</script>

<style type="text/css" lang="scss">
  .sys-params-wrap{
    margin-left: 24px;
    margin-right:24px;
    .org-params-header{
      width: 100%;
      padding-top: 25px;
      padding-bottom: 25px;
      padding-left: 24px;
      background: #f5f5f5;
      box-sizing: border-box;
      .search-wrap {
        display: inline-block;
        height: 32px;
        margin-left: 32px;

        .el-input {
          width: 264px;
        }
        span {
          color: #666666;
          font-size: 12px;
        }
      }
      .plan-size {
        .el-input {
          width: 160px;
        }
      }
      .button-wrap {
        margin-left: 50px;
        display: inline-block;
        margin-top: 15px;
      }
    }
    //表格
      .org-right-table{
        margin-top:24px;
        width:100%;
        .el-table .warning-row {
          background: #f0f0f0;
        }

        .el-table .success-row {
          background: #ffffff;
        }
        .handleSelectioHead {
          background: #E7EBFF;
        }
      }
      
  }
</style>
