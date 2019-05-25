<template>
<div v-if="brandQueryData" class="cmmSingleDialog">
    <el-dialog
      title="选择品牌"
      :visible.sync="branddialog"
      width="70%">
      <div class="brand-box">
        <el-form
        :inline="true"
        label-width="80px"
        style="padding:0 10px"
        
      >
        <el-form-item label="商品品牌:" style="line-height:50px">
          <el-input v-model="queryData.name" placeholder="请输内容" prefix-icon="el-icon-search" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="brandQueryBtn">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-body">
        <el-table :data="brandData" stripe highlight-current-row height="330px" @row-click= "showRow" ref="brandListRef">
          <el-table-column align="center" width="55" label="" >
              <template slot-scope="scope">
                    <el-radio 
                    :label="scope.row.id" 
                    v-model="BRadio" 
                    @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
              </template>
          </el-table-column>
          <el-table-column
            v-for="item in brandColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
          > 
            <template slot-scope="{row,$index}">
              <div>
                <span>{{row[item.key]}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table> 
      </div>
      <div class="page-wrap">
          <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.page"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="queryData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryData.total">
          </el-pagination>
      </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="brandhandleClose(false)">取 消</el-button>
        <el-button type="primary" @click="brandDetermineBtn()">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>

export default {
  name:"ComBank",
  props:{},
  data(){
    return{
      branddialog:false,
      queryData: {
        code: "",
        name: "",
        page: 1,
        pageSize: 10,
        pageNum:1,
        total:null
      },
      
      brandQueryData: {
        list:{id:1}
      },
    
      BRadio:-1,
      brandColumn: [
        {
          label: "品牌名称",
          key: "name",
        },
        {
          label: "备注",
          key: "remark"
        }
      ],
      brandData:[],
    }
  },
  mounted(){},
  watch:{
    BRadio(val){
      this.BRadio = val
    },
    branddialog(news){
      this.init()
    }
  },
  methods:{
    //初始化数据
    init(){
      this.resFindBrandList(this.queryData)
    },
    getTemplateRow(index,row){
      this.brandQueryData.list = row
     },
     // 品牌查询
     brandQueryBtn(){
        this.init()
     },
    brandhandleClose(flag){
      this.branddialog = flag
    },
    brandDetermineBtn(){
      this.brandhandleClose(false)
      this.$emit("getBrandQueryData",this.brandQueryData);
    },
    // 品牌请求
    resFindBrandList(val){
      this.$cimList.findBrandList(val).then( res => {
          if(res.code === 200) {
            this.brandData = res.data.list || ''
            this.queryData.total = res.data.total
            }else {
                this.error(res.msg);
            }
        }).catch( err => {

        })
    },
    showRow(row){
      console.log(row)
        //赋值给radio
        let _this = this;
        let selectedRowsIndex = this.brandData.indexOf(row);
        this.brandQueryData.list = row;
        this.BRadio=this.brandQueryData.list.id;
        _this.$nextTick(function () {
            if(selectedRowsIndex != -1){
                _this.$refs.brandListRef.setCurrentRow(selectedRowsIndex);
            }
        })
    },
    //分页控制
    handleSizeChange(val) {
      console.log(val)
      this.queryData.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.queryData.page = val
      this.queryData.pageNum = val
      this.init()
    }
  }
}
</script>


<style lang="scss">
.cmmSingleDialog{
  .el-dialog {
    .el-dialog__body{
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;
        padding: 20px 0px 0 !important;
    }
  }
  .table-body{
    height: 332px;
    overflow: auto;
    padding: 0 10px;
  }
  .page-wrap{

  }
}

</style>