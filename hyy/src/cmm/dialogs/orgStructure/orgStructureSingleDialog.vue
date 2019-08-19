<template>
  <div class="my_dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="mydialogTableVisible">
           <div class="header-wrap">
              <div class="search-wrap">
                <span style="color:#666666;">查询组织：</span>
                <el-input size="small" placeholder="请输入查询内容"  v-model="filterText"></el-input>
              </div>
              <div class="button-wrap">
                <el-button type="primary" size="small" @click="searchOrganization">搜索</el-button>
              </div>
            </div>
            <div style="min-height: 405px;">
              <el-tree
                @node-click="handleNodeClick"
                show-checkbox
                :data="dataTree"
                node-key="id"
                ref="tree"
                default-expand-all
                :filter-node-method="filterNode"
                :check-strictly="true"
                :expand-on-click-node="false"
                :props="defaultProps"
                :default-checked-keys="reviewList"
                >
              </el-tree>
            </div>
      <div style="height:12px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseOrganization" style="margin-right:22px;">确定</el-button>
        <el-button @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {organizationList} from "cmm/http/interface.js"
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
        reviewList:[],
        defaultProps: {
          children:'children',
          label:'text'
        },
        resultOneOrg:'',
        tenantId:JSON.parse(localStorage.getItem('user')).consumerId
      }
    },
    methods: {
        //过滤数据
        filterNode(value, data) {
          if (!value) return true;
          return data.text.indexOf(value) !== -1;
        },
        //获取组织
        handleNodeClick(data) {
            this.resultOneOrg=data
        },
        //查询
        searchOrganization(){
          this.$refs.tree.filter(this.filterText);
        },
        // 确定选择
        chooseOrganization() {
          this.$emit("callBack", this.$refs.tree.getCheckedNodes());
          this.mydialogTableVisible = false;
        },
        //打开弹窗
        openDialog(val,reviewList){
          this.filterText=""
          this.reviewList=[]
          this.mydialogTableVisible=val
          this.getOrganizationList(reviewList)
        },
        //获取组织结构列表
        getOrganizationList(reviewList){
          let params={
              tenantId:this.tenantId
          }
          organizationList(params).then(res=>{
            if(res.data&&res.code==200){
              this.dataTree = JSON.parse(JSON.stringify(res.data))
              //回显
              if(reviewList){
                this.reviewList = reviewList
              }
            }
          }).catch(err => {
            console.log(err)
          })
        },
    },
    watch: {
      dialogTableVisible(val) {
        this.mydialogTableVisible = val;
      },
      
      mydialogTableVisible(val) {

      }
    }
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
      .el-dialog__headerbtn{
        top: 15px;
      }
      .el-checkbox__inner{
        width: 12px;
        height: 12px;
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