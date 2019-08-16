<template>
  <div class="my_dialog">
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="mydialogTableVisible">
      <!-- 查询 -->
      <div class="header-wrap">
        <div class="search-wrap">
          <span style="color:#666666;">查询分类：</span>
          <el-input size="small" placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="filterText"></el-input>
        </div>
        <div class="button-wrap">
          <el-button type="primary" size="small" @click="searchGoodClass">搜索</el-button>
        </div>
      </div>
      <!-- 列表 -->
      <div style="min-height: 405px;">
        <el-tree
          @node-click="handleNodeClick"
          show-checkbox
          :data="dataTree"
          node-key="uid"
          ref="tree"
          default-expand-all
          :filter-node-method="filterNode"
          :check-strictly="false"
          :expand-on-click-node="false"
          :props="defaultProps"
          :default-checked-keys="reviewList"
          >
        </el-tree>
      </div>
      <div style="height:12px;background:transparent;"></div>
      <!-- 底部按钮 -->
      <div class="btn-area">
        <el-button @click="mydialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="chooseGoodClass" style="margin-right:22px;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCategoryTrees} from "cim/http/cim/basicSettings.js"
  export default {
    props: {
      dialogTableVisible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "父组件尚未传值"
      },
    },
    data() {
      return {
        filterText:"",
        mydialogTableVisible: this.dialogTableVisible,
        name:'',
        dataTree: [],
        reviewList: [],
        defaultProps: {
          children:'children',
          label:'name'
        },
        resultOneOrg:'',
        tenantId:JSON.parse(localStorage.getItem('user')).consumerId
      }
    },
    watch: {
      dialogTableVisible(val) {
        this.mydialogTableVisible = val;
      },
    },
    methods: {
      //过滤数据
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //获取组织
      handleNodeClick(data) {
        this.resultOneOrg=data
      },
      //查询
      searchGoodClass(){
        this.$refs.tree.filter(this.filterText);
      },
      // 确定选择
      chooseGoodClass() {
        this.$emit("callBack", this.$refs.tree.getCheckedNodes());
        this.mydialogTableVisible = false;
      },
      //打开弹窗
      openDialog(val,reviewList){
        this.filterText=""
        this.reviewList=[]
        this.mydialogTableVisible=val
        this.getGoodClassList(reviewList)
      },
      //获取组织结构列表
      getGoodClassList(reviewList){
        let params={}
        getCategoryTrees(params).then(res=>{
          if(res.data&&res.code==200){
            this.dataTree = JSON.parse(JSON.stringify(res.data.children))
            if(reviewList){
              this.reviewList = reviewList
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .my_dialog {
    .header-wrap{
      .search-wrap {
        display: inline-block;
        height: 32px;
        .el-input {
          width: 226px;
        }
        span {
          color: #666666;
          font-size: 12px;
        }
      }
      .button-wrap {
        margin-left: 3px;
        display: inline-block;
        .el-button--primary{
          width:80px;
          height: 32px;
          padding-top:7px;
          span{
            font-size: 12px;
          }
        }
      }
    }
    /deep/ .el-dialog {
      // width: calc(576px + 224px);
      width: 576px;
      // height: 576px;
      overflow: hidden;
      border-radius: 4px;
      .el-dialog__header {
        padding: 14px 20px 10px;
       
        .el-dialog__title{
          color: #333;
        }
      }
      .el-checkbox__inner{
        width: 12px;
        height: 12px;
      }
      .el-dialog__headerbtn{
        top: 15px;
      }
      .el-dialog__header::after {
        content: "";
        display: block;
        // width: calc(536px + 224px);
        width: 536px;
        height: 1px;
        background: #e5e5e5;
      }
      .header-wrap{
        margin-bottom:20px;
      }
      .el-input__inner{
        font-size: 12px;
      }
      .el-icon-close {
        font-size: 8px;
      }
      .el-dialog__body{
        padding:6px 20px 20px 20px;
      }
      .btn-area {
        // margin-bottom: 10px;
        display: flex;
        justify-content: center;
      }
      .el-tree{
        .el-tree-node__label{
          font-size: 12px;
          color: #666666;
        }
      }
      .el-button--primary{
        width:80px;
        height: 32px;
        padding-top:7px;
      }
      .el-button{
        width:80px;
        height: 32px;
        font-size: 12px;
      }
      .content .el-input {
        width: 50px;
      }
    }
  }
</style>