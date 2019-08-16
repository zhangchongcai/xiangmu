<template>
  <div class="cinemaList">
    <div class="searchAdition">
     
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="100px">
         <!-- <el-form-item label="影院名称：">
            <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="width:176px;height:32px;">
                {{ cinemaName }}</el-button>
          </el-form-item> -->
        <el-form-item label="资金科目:">
          <el-select v-model="searchAdition.subjectName">
            <el-option label="全部" value>全部</el-option>
            <el-option v-for="(item,index) in subjectList" :key="index" :label="item.subjectName" :value="item.subjectName">{{item.subjectName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制单人:">
           <el-input v-model="searchAdition.createUserName" @focus="openCreate"></el-input>
        </el-form-item>
        <el-form-item label="摘要说明:">
          <el-input v-model="searchAdition.remarks"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
      </el-form>
    </div>
    <div class="content">
      <el-row style="padding:5px;float:right;">
        <el-button type="primary" plain class="xinjian" @click="account_add">新建</el-button>
      </el-row>
      <br style="clear:both;">
      <el-row>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="fundCode" label="编号" width="200"></el-table-column>
          <el-table-column prop="createUserName" label="制单人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="制作时间" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="timeCode" label="关联单据"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="changed" label="调整内容" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="70" fixed="right">
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
              <!-- <span class="icon-color" @click="detail(scope.row)">查看</span> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <div class="page-wrap">
        <el-pagination background  @current-change="handleCurrentChange"
          :current-page="current" :page-size="size"
          layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
       <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
       <ShowDialog ref="dataDialog" :dialogTableVisible.sync="dialogTableVisible" :title="title" :showData="totalData" 
    :gridData="gridData" :pageData="pageData"  :uid ="$route.query.uid" :timeCode ="$route.query.timeCode"  :subjectList="subjectList"
    @changeDialogTableVisible="changeDialogTableVisible" @changeCurrentPage="changeCurrentPage" @addSuccess="addSuccess"></ShowDialog>
       <textDialog ref="textDialog" @callback="chooseWorker" @searchWorker="searchWorker"></textDialog>
    </div>
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType"
      :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId">
        <el-button @click="singleCinemaVisible = false">取 消</el-button>
        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
          定</el-button>
      </div>
    </singleCinema>
  </div>
</template>
<script type="text/javascript">
  import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
  import ShowDialog from "../public/moneyDialog"
  import mydialog from "../public/searchDialog"
  import textDialog from "../public/textDialog"
  export default {
    components:{
      singleCinema,
      ShowDialog,
      mydialog,
      textDialog
    },
    data() {
      return {
        singleCinemaVisible: false,
        singleCinemaType: 2,
        innerData: {
            id: '',
        },
        cinemaName: "", //影院名字
        total: 1, //总数
        current: 1, //当前页
        size: 10, //当前页数大小 
        tableData: [], //列表
        searchAdition: {
          createUserName: "",
        },
        subjectList:[],
        // 弹窗
        search2: {
          createName: ''
        },
        gridData2: [],
        templateRadio: '',
        createName: '',
        totalData:{},
        dialogTableVisible:false, // 增加
        title:"",
        gridData:[],
        thingGridData:[],
        pageData:{},
        current:1,
      };
    },
    methods: {
      changeDialogTableVisible(val) {
        this.dialogTableVisible = val;
      },
      changeCurrentPage(val){
        this.getThingsDetail(val);
      },
      // 新建资金调整
      account_add() {
        this.dialogTableVisible = true;
        this.title = "资金调整单";
      },
      //查询资金调整单
      search() {
        this.getList();
      },
      //获取列表数据
      getList() {
        let limit = {
          timeCode:this.$route.query.timeCode
        };
        let addition = this.searchAdition;
        this.$csmList.adjustList(Object.assign({}, limit, addition),this.current,this.size)
          .then(data => {
            if (data && data.code === 200) {
              this.tableData = [];
              this.tableData = data.data.records;
              this.total = data.data.total
              this.tableData.forEach((item,index) =>{
                item.itemEntityList && item.itemEntityList.forEach(el => {
                  el.changed = `${el.subjectName}:${el.changeValue}`;
                })
                let obj = item.itemEntityList.length>0 && item.itemEntityList.reduce((prev,curr)=>{
                  return {changed:`${prev.changed};${curr.changed}`}
                })
                this.tableData[index].changed = obj.changed
              })
            } else {}
          })
          .catch(err => {
            // console.log(err);
          })
      },
      //当前页改变
      handleCurrentChange(valua) {
        this.current = valua;
        this.getList();
      },
      //  获取制单人
      getCreater() {
        let limit = {
          current: this.current,
          size: this.size,
          userName: this.search2.createName,
          cinemaUid:this.$route.query.cinemaUid
        };
        this.$csmList.getCreater(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              // this.gridData2 = data.data.records
              // this.total = data.data.total;
              this.$refs.searchDialog.gridData = data.data.records
              this.$refs.searchDialog.pageData = data.data
            }
          })
      },
       // 打开制单人
      openCreate(event){
        event.srcElement.blur()
        this.getCreater()
          this.$refs.searchDialog.dialogTableVisible = true;
          this.$refs.searchDialog.title = "查找制单人";
          this.$refs.searchDialog.showWhich = "creater";
      },
       //  返回值
      chooseWorker(obj){
        let whichOne = this.$refs.searchDialog.showWhich;
        console.log(obj,whichOne)
        if(whichOne == "worker"){
          this.searchAdition.workerName = obj.userName
        }else if(whichOne == "creater"){
          this.searchAdition.createUserName = obj.userName
          console.log(this.searchAdition.createUserName)
        }
      },
      searchWorker(current,userName,userAccount){
        this.getWorker(current,userName,userAccount)
      },
      // 获取资金科目
      getSubject() {
        this.$csmList.getAdjustSubject({})
          .then(data => {
            if (data && data.code === 200) {
              console.log(data)
              this.subjectList = data.data.records;
            }
          })
      },
      // 获取详细内容
      detail(row){
        this.$refs.textDialog.dialogTableVisible = true;
        this.$refs.textDialog.title = "查找资金调整单";
        row.itemEntityList.forEach(item =>{
          item.payTypeCode = item.payTypeCode == "XRMB"?"现金":"银联"
        })
        this.$refs.textDialog.gridData = row.itemEntityList;
        this.$refs.textDialog.billCode = row.timeCode;
          // this.$refs.textDialog.showWhich = "creater";
        console.log(row)
      },
      addSuccess(){  // 添加成功之后
        this.getList();
        this.$refs.dataDialog.tableData = [];
      },
      // 打开影院
      callback(val) {
        console.log(val)
        this.cinemaName = val.orgName
        this.queryData.cinemaUid = val.cinemaUID
      },

     callBackSingle(data) {
          console.log(data, '-----> data')
          this.queryData.cinemaUid = data.data.id
          this.cinemaName = data.data.name
          this.cinemaName = this.cinemaName.length> 10?this.cinemaName.substring(0,9)+"...": this.cinemaName
          this.innerData.id = data.data.id
          this.singleCinemaVisible = data.framedialogVisible
          // this.search() 
      },
      getUserInfo() {
          this.$ctmList.getUserInfo().then(res => {
              console.log(res)
              if (res.code === 200) {
                  this.cinemaName = res.data.cinemaName
                  this.queryData.cinemaUid = res.data.cinemaUid
                  this.innerData.id = Number(res.data.cinemaUid)

                  this.search()

              } else {
                  this.error(res.msg)
              }
          })
      },
    },
    created() {
      this.getList();
      // this.getCreater();
      this.getSubject()
    }
  };
</script>
<style lang="scss" scoped>
  .cinemaList {
    box-sizing: border-box;
    width: 100%;

    .search-form {
      background: #f5f5f5;
      padding: 24px 24px 6px 24px;
      margin-bottom: 10px;
    }
  }

  .el-form-item {
    width: 300px;
  }
  .el-button--primary{
    padding: 8px 25px;
  }
  //表格样式
  .cinemaList tr th {
    background: #f2f4fd;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  //行高
  .cinemaList .el-table th {
    padding: 7px 0;
  }

  .cinemaList .el-table td {
    padding: 7px 0;
  }

  .cinemaList .el-pagination {
    text-align: center;
  }

  //时间选择器样式
  .el-date-editor .el-range-separator {
    line-height: 24px;
  }

  .el-date-editor .el-range__icon {
    line-height: 24px;
  }

  .el-date-editor--daterange.el-input__inner {
    width: 256px;
  }

  .el-date-table td span {
    border-radius: 0;
  }

  .like-lable {
    color: #606266;
    padding: 0 12px 0 0;
    width: 100px;
    box-sizing: border-box;
    white-space: nowrap;
    text-align: right;
  }

  .search-time {
    display: flex;
  }

  .el-input--suffix,
  .el-input__inner,
  .el-select,
  .el-form-item__content {
    width: 176px;
  }

  .search-btn {
    margin-left: 30px;
  }

  // dialog的样式
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

      .two_search {
        width: 214px;
      }

      .one_search {
        width: 268px;
      }

      .el-form-item__label {
        font-size: 12px;
      }

      .el-table {
        margin-top: 11px;
        height: 340px;

        .cinemaList .has-gutter tr th {
          padding: 0;
        }

        .cell {
          font-size: 12px;
          line-height: 30px;
          // text-align: center;
        }

        .el-radio__label {
          padding: 0;
          display: none;
        }
      }

      .block {
        margin-top: 15px;
      }
    }

    .btn-area {
      display: flex;
      justify-content: center;
    }
  }
</style>