import { payType } from 'cmm/http/interface.js';
<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="mydialogTableVisible">
      <el-form label-width="100px" :model="form">
          <el-row v-show="isFristPage">
            <el-col :span="24">
              <el-form-item label="关联业务单据：">
                {{uid}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter=10>
            <!-- {{ subject}} -->
            <el-col :span="12">
              <el-form-item label="资金科目：" required>
                <el-select v-model="subject">
                  <!-- <el-option label="请选择" value>请选择</el-option> -->
                  <el-option v-for="(item,index) in subjectList" :key="index" :label="item.subjectFull" :value="`${item.subjectName},${item.subjectCode},${item.bpType}`">{{item.subjectFull}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付方式：" required>
                 <el-select v-model="form.payTypeCode">
                  <el-option label="现金" value="XRMB">现金</el-option>
                  <el-option label="银联" value="XUNP">银联</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="调整值：" required>
                <el-input v-model="form.changeValue"></el-input>
              </el-form-item>
            </el-col>
           </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="摘要说明：">
                <el-input v-model="form.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="adjustTemporary">新增</el-button>
            <el-button @click="adjustClearn">清空</el-button>
          </el-form-item>
      </el-form>

      <el-table :data="tableData" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row   max-height="210">
        <el-table-column property="subjectName" label="资金科目" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="payType" label="支付方式" width="96"></el-table-column>
        <el-table-column property="changeValue" label="调整值" width="96"></el-table-column>
        <el-table-column property="remarks" label="摘要说明"  show-overflow-tooltip></el-table-column>
         <el-table-column label="操作" width="70">
            <template slot-scope="scope">
              <el-button size='small' type="text"  @click="adjustDelate(scope)">删除</el-button>
              <!-- <span class="icon-color" @click="adjustDelate(scope)">删除</span> -->
            </template>
          </el-table-column>
      </el-table>
     
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="adjustAdd">确定</el-button>
        <el-button  @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
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
      uid: {
        type: String,
        default: "父组件尚未传值"
      },
      timeCode: {
        type: String,
        default: "父组件尚未传值"
      },
      showData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      gridData: {
        type: Array,
        default: function () {
          return []
        }
      },
      subjectList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        form: {},
        subject:'',
        tableData:[],
        mydialogTableVisible: this.dialogTableVisible,
        currentPage: 1,
        isFristPage:true
      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val, 1111)
        this.currentPage = val
      },
      adjustTemporary(){
        if(!this.subject){
          this.$message("请填写资金科目")
          return
        }
        if(!this.form.payTypeCode){
          this.$message("请填写支付方式")
          return
        }
        if(!this.form.changeValue){
          this.$message("请填写调整值")
          return
        }
        console.log(this.subject)
        let limit = {
          timeCode:this.$route.query.timeCode,
          workTimeUid:this.$route.query.uid,
          subjectName: this.subject.split(",")[0],
          subjectCode:this.subject.split(",")[1],
          cinemaUid:this.$route.query.cinemaUid,
          payType:this.form.payTypeCode=="XRMB"?'现金':'银联',
          bpType:this.subject.split(",")[2]
        };
        let addition = this.form;
        this.tableData.push(Object.assign({}, limit, addition))
        console.log(this.tableData)
        this.form = {}
        this.subject = ''
      },
      adjustDelate(scope){
        this.tableData.splice(scope.$index,1)
      },
      adjustAdd(){
        console.log(this.tableData)
        if(this.tableData.length == 0){
          this.$message('请先新增要调整的资金科目')
          return;
        }
        this.$csmList.adjustAdd(this.tableData).then(data=>{
          if (data && data.code === 200) {
           this.$alert('新建资金调整单成功', '成功', {
              confirmButtonText: '确定',
              callback: () => {
                this.mydialogTableVisible = false;
                this.$emit("addSuccess")
              }
            });
          } else {
            this.$message({
              type: 'info',
              message: `${data.msg}`
            });  
          }
          
        });
        
      },
      adjustClearn(){
        this.tableData = [];
        this.form = {}
        this.subject = ''
      }

    },
    watch: {
      dialogTableVisible(val) {
        this.mydialogTableVisible = val;
      },
      mydialogTableVisible(val) {
        this.$emit("changeDialogTableVisible", val)
      },
      currentPage(val) {
        this.$emit("changeCurrentPage", val)
      },
      "form.changeValue"(val){
        try {
           this.form.changeValue = val.replace(/\-/g,'')
        } catch (error) {
          
        } 
      }
    },
    created() {
      console.log(this.$store.state.csm.cinemaUid)
    }
  }
</script>

<style lang="scss" scoped>
  .my_dialog {
    /deep/ .el-dialog {
      width: 576px;
      height: 576px;

      .el-dialog__header::after {
        content: "";
        display: block;
        width: 536px;
        height: 1px;
        background: #e5e5e5;
      }

      .el-dialog__body {
        padding: 0 20px;

        .el-form-item__label,
        .el-form-item__content {
          font-size: 12px;
          line-height: 32px;
        }
        /deep/ .el-form-item{
          margin-bottom:10px;
        }
        .el-table {
          margin-top: 11px;
          height: 230px;

          .has-gutter tr th {
            padding: 0;
          }

          .cell {
            font-size: 12px;
            line-height: 30px;
          }

          .el-radio__label {
            padding: 0;
            display: none;
          }
        }

        .block {
          margin-top: 15px;

          .el-pagination {
            text-align: center;
          }
        }
      }

      .btn-area {
        display: flex;
        justify-content: center;
      }

      /deep/ .content .el-input {
        width: 50px;
      }
    }
     /deep/ .el-pagination.is-background .el-pager li {
    margin: 0 1px;
  }
  }
</style>