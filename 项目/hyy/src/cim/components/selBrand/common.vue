<template>
    <el-dialog
      title="选择品牌"
      :visible.sync="branddialog"
      width="50%"
      :before-close="beforeClose">
      <div class="brand-box">
        <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
      <el-form-item label="商品品牌">
          <el-input
            v-model="queryData.name"
            placeholder="请输内容"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="brandQueryBtn">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="brandData" stripe >
               <el-table-column align="center" width="55" label="" >
                  <template slot-scope="scope">
                       <el-radio 
                       :label="scope.$index" 
                       v-model="BRadio" 
                       @change.native="getTemplateRow(scope.$index,scope.row)"></el-radio>
                  </template>
              </el-table-column>
              <el-table-column
                v-for="item in brandColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :width="item.width"
              > 
                <template slot-scope="{row}">
                  <div>
                    <span>{{row[item.key]}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table> 
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
  props:{
    brandQueryData: {
        type: Object
      }
    },
  data(){
    return{
      branddialog:false,
      queryData: {
        code: "",
        name: "",
        page: 1,
        pageSize: 10
      },
      BRadio:this.brandQueryData.list.id-1,
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
  mounted(){

  },
  watch:{
    BRadio(val){
      this.BRadio = val
    }
  },
  methods:{
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
     beforeClose(){
       this.branddialog = false
     },
    brandhandleClose:function(flag){
      this.branddialog = flag
    },
    brandDetermineBtn:function(){
      this.brandhandleClose(false)
      this.$emit("update:brandQueryData",this.brandQueryData);
    },
    // 品牌请求
    resFindBrandList(val){
      this.$cimList.findBrandList(val).then( res => {
          if(res.code === 200) {
            this.brandData = res.data.list
            }else {
                this.error(res.msg);
            }
        }).catch( err => {

        })
    },
  }
}
</script>


<style lang="scss">
.el-dialog__body{
  padding-top:10px;
}
.el-header{
  .el-form-item__content{
    width:100px;
  }
  .el-form-item__label{
    width:80px;
  }
}

.box{
  display:flex;
  height:470px;
  overflow: hidden;
}
.box-left{
  flex:0 0 200px;
  height:100%;
  overflow: auto;
  float: left;
} 
.box-right{
  flex:1;
  height:100%;
  display:flex;
  flex-direction:column;
  .box-right-top{
    height:60px;
    .el-input__inner{
      width:150px;
    }
  } 
}

.box-right-main{
  flex:1;
  overflow: hidden;
  display:flex;
}
.box-main-table{
  overflow: auto;
  flex:1;
  height:100%;
  display:flex;
  flex-direction:column;
  .page-table{
    flex:1;
  }
  .page-wrap{
    height:40px;
    padding:0;
  }
}
.box-main-right{
  flex:0 0 200px;
  border:1px solid #EBEEF5;
  box-sizing: border-box;
  padding:5px;
  .box-last-top{
    span{
      float: right;
      cursor: pointer;
    }
  }
  .box-last-ul{
    height:370px;
    overflow: auto;
    li{
      display:flex;
      height:30px;
      line-height:30px;
      .span-left{
        flex:1;
        width:168px;
        font-size:12px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
      .span-right{
        display:inline-block;
        flex:0 0 20px;
        cursor: pointer;
        i{

        }
      }
    }
  }
}
.next-box{
  display:flex;
  flex-direction:column;
  .next-pro-top{
    flex:0 0 30px;
    line-height:30px;
  }
  .next-pro-main{
    flex:1;
  }
}

</style>