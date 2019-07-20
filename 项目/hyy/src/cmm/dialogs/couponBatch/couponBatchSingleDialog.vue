<template>
  <div class="my-dialog">
    <el-dialog title="选择票券批次" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-form label-width="" :inline="true">
        <div class="select-header">
          <el-form-item label="申请单号:">
            <el-input v-model="applyCode" style="width:220px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="票券名称:">
            <el-input v-model="couponName" style="width:150px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="票券类型:">
            <el-select v-model="couponType" style="width:150px">
              <el-option label="全部" value>全部</el-option>
              <el-option label="兑换券" value="0">兑换券</el-option>
              <el-option label="代金券" value="1">代金券</el-option>
              <el-option label="优惠券" value="2">优惠券</el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" style="margin-top:4px;font-size:12px;" @click="searchCoupon">查询</el-button>
        </div>
      </el-form>
      <div class="choose_table">
        <div>
          <el-table class="choose-table-list" :data="tableList" 
            @row-click= "select"
             ref="singleTable">
            <el-table-column label="选择" width="50">
                <template slot-scope="scope">
                    <el-radio v-model="selectedId" :label="scope.row.applyCode">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <template v-for="(item,index) in tableConfig" >
                <el-table-column :key="index" v-if="item.hasTemplate" 
                  :prop="item.prop?item.prop:''" 
                  :label="item.label?item.label:''" 
                  :width="item.width?item.width:''" >
                    <div slot-scope="scope">
                        {{item.label=="票券类型"?formatType(scope.row):""}}
                    </div>
                </el-table-column>
                <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column> -->
            </template>
          </el-table>
        </div>
          <!-- 分页 -->
          <div class="pagation">
            <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum"
              :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
          </div>

      </div>
      <div class="btn-area" slot="footer" >
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {findSaleList} from "ccm/http/interface.js"
  export default {
    props: {
      customerType:{
        default:''
      }
    },
    data() {
      return {
        dialogVisible:false,
        selectedId:'',
        applyCode:"",
        couponName:"",
        couponType:"",
        selectRows:'',
        tableList:[],
        pageData:{
          pageNum:1,
          total:0,
          size:10,
        },
        tableConfig:[
          {
            label: '申请单号',
            prop: 'applyCode',
            width: '315px',
            hasTemplate: false
          }, {
              label: '票券名称',
              prop: 'couponName',
              width: '315px',
              hasTemplate: false
          },{
              label: '票券类型',
              prop: 'couponTypeRight.couponType',
              width: '314px',
              hasTemplate: true,
          },
        ]
      }
    },
    methods: {
      formatType(row){
          if(row.couponTypeRight.couponType==0) return '兑换券'
          if(row.couponTypeRight.couponType==1) return '代金券'
          if(row.couponTypeRight.couponType==2) return '优惠券'
      },
        // 点击选择数据（暂时储存的数据）
        select(row) {
            if (row) {
                console.log(row)
                this.selectedId = row.id
                this.selectRows=row;
            }
        },
        // 确定选择
        chooseUser() {
            this.$emit("callBack", this.selectRows);
            this.dialogVisible = false;
        },
        //打开弹窗
        openDialog(val){
            this.dialogVisible=val
            this.searchData()
        },
        // 页面改变
        handleCurrentChange(val) {
            this.pageData.pageNum=val
            console.log(val)
            this.searchData()
        },
        // 查询
        searchCoupon() {
            this.searchData()
        },
        searchData(){
            let params={
              pageNo:this.pageData.pageNum,
              pageSize:this.pageData.size,
              couponType:this.couponType,
              applyCode:this.applyCode,
              couponName:this.couponName,
              state: "2",//已激活
              isPop: "true",//数量不为0
            }

            findSaleList(params).then(res=>{
              if(res.data&&res.code==200){
                  this.tableList=res.data
                  this.pageData.total=res.pageNum
              }
              
            })
        },
      
    },
  }
</script>

<style lang="scss" scoped>
.my-dialog {
  /deep/ .el-dialog{
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #666666;
    // width: calc(576px + 224px);
    width: 892px;
    // height: 576px;
    border-radius: 4px;
    overflow: hidden;
    .choose_table{
      .choose-table-list{
        max-height:420px;
      }
    }
    .el-dialog__header {
      padding: 14px 20px 10px;
      .el-dialog__title {
        font-family: MicrosoftYaHei;
        color: #333333;
        letter-spacing: 0;
        line-height: 28px;
      }
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #979797;
    }
    .el-table__header-wrapper,.el-table__body-wrapper{
      overflow: hidden;
    }
    .el-icon-close {
      font-size: 8px;
    }
    .el-button {
      display: inline-block;
      width: 80px;
      height: 32px;
      line-height: 15px;
      vertical-align: middle;
      font-size: 12px;
    }
    .el-dialog__header::after {
      content: "";
      display: block;
      // width: calc(536px + 224px);
      width: 852px;
      height: 1px;
      background: #e5e5e5;
    }
    .pagation{
      text-align: center
    }
    .el-pagination{
      padding: 24px 0;
    }
    .el-form-item {
      margin-right: 16px;
      .el-input__inner{
        font-size: 12px;
      }
      .el-form-item__label {
        font-size: 12px;
      }
    }
    .el-table__row
      .cell{
        >div{
          font-size: 12px;
        }
      }
    .el-dialog__body{
      padding:20px 20px 0 20px;
    }
    .el-dialog__footer{
      padding: 0 20px 20px 20px;
    }
  }
}

</style>