<template>
  <div class="ccm_dialog">
    <el-dialog title="选择支付方式" 
    :close-on-click-modal="false" 
    :visible="mydialogTableVisible">
      <el-form label-width="" :inline="true">
        <div style="position:relative">

        </div>
      </el-form>
      <div class="choose-body">
        <el-table :data="tableList" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
            ref="multipleTable"  @row-click="select">
          <el-table-column label="选择" width="50">
              <template slot-scope="scope">
                  <el-radio v-model="selectedId" :label="scope.row.payTypeCode">&nbsp;</el-radio>
              </template>
          </el-table-column>
          <el-table-column property="payTypeCode" label="支付编码" ></el-table-column>
          <el-table-column property="payTypeName" label="支付名称" ></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum"
            :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer">
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {payType} from "cmm/http/interface.js"
  export default {
    props: {},
    data() {
      return {
        consumerId: JSON.parse(localStorage.getItem('user')).consumerId,
        mydialogTableVisible:false,
        chooseItem: '',
        selectedId:'',
        tableList:[],
        pageData:{
          pageNum:1,
          total:0,
          size:10,
        },
       
      }
    },
    methods: {
        //获取row的key值
        getRowKeys(row){
            return row.id
        },
        // 点击选择数据（暂时储存的数据）
        select(row) {
            this.chooseItem = row 
            this.selectedId = row.payTypeCode
        },
        // 确定选择
        chooseUser() {
            this.$emit("payTypeCallBack", this.chooseItem);
            this.mydialogTableVisible = false;
        },
        //打开弹窗
        openDialog(){
            this.mydialogTableVisible=true
            this.getPayTypeList()
        },
        // 页面改变
        handleCurrentChange(val) {
            this.pageData.pageNum=val
            console.log(val)
            this.getPayTypeList()
        },
        // 查询
        searchUser() {
            this.getPayTypeList()
        },
        // 删除
        delateSpan(item){
            console.log(item)
            if (item) {
                this.$refs.multipleTable.toggleRowSelection(item);
            }
        },
        clearSelection(){
            this.$refs.multipleTable.clearSelection();
            this.chooseItem = []
        },
        //获取影院类型列表
        getPayTypeList(){
            let params={
              current:this.pageData.pageNum,
              pageSize:this.pageData.size,
              tenantId:this.consumerId,
            }
            console.log(params)
            payType(params).then(res=>{
              if(res.data&&res.code==200){
                  this.tableList=res.data.list
                  this.pageData.total=res.data.list.length
              }
              
            })
        },
        selectData(){
          
        },
      
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/dialogs.scss";
</style>