<template>
  <div class="ticket-type">
    <div v-if="!dialogShow">
      <!-- 查询块 -->
      <header class="header">
        <div class="item-warp" style="float:left">
          <span>影院名称:</span>
          <el-input v-model="cinemaName" @focus="cinemaDialogShow"></el-input>
        </div>
        <div class="search-Btn" style="float:left;margin-left:18px">
          <el-button type="primary" @click="searchCinema">查询</el-button>
        </div>
        <el-button type="primary" @click="addOrUpdateHandle()" style="float:right">新建</el-button>
      </header>
      <!-- 内容块 -->
      <div class="table-warp" ref="warp">
        <el-table
          :data='dataList'
          v-loading="dataListLoading"
          stripe
          :header-cell-style="{background:'#E7EBFF',height:'38px!important'}"
          style='width: 100%;'>
          <el-table-column
            type="index"
            label='序号'
            header-align="center"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop='name'
            label='票类名称'>
          </el-table-column>
          <el-table-column
            label='是否为标准票类'>
            <template slot-scope='scope'>
              <span v-if='scope.row.baseFlag === 1' >否</span>
              <span v-else >是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop='cinemaName'
            label='适用影院'>
          </el-table-column>
          <el-table-column
            label='是否允许打折'>
            <template slot-scope='scope'>
              <span v-if='scope.row.isDiscount === 1' >否</span>
              <span v-else >是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop='seq'
            label='票类顺序'>
          </el-table-column>
          <el-table-column
            width='200'
            label='操作'>
            <template slot-scope='scope'>
              <el-button size='small' type="text" @click='addOrUpdateHandle(scope.row)'>修改</el-button>
              <el-button size='small' v-if="scope.row.name!='成人票'&&scope.row.name!='团体票'&&scope.row.name!='学生票'" type="text" @click='deleteHandle(scope.row.uid)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

        <el-pagination
        background
        @size-change='sizeChangeHandle'
        @current-change='currentChangeHandle'
        :current-page='pageIndex'
        :page-sizes='[10, 15, 20 , 25 , 30]'
        :page-size='pageSize'
        :total='totalCount'
        layout='total, sizes, prev, pager, next, jumper'>
        </el-pagination>
      
    </div>
    <ticket-type v-else ref="addOrUpdate" @refreshDataList="getDataList"></ticket-type>
    <!-- 影院复选框 -->
    <frame-multicinemas 
      :framedialogVisible="multiCinemaVisible" 
      :whereUse="whereUse" 
      :type="cinematype" 
      :innerCinemaMultiData="innerCinemaMultiData" 
      :isListprop="true" 
      @callBack="handleCallBack" ref='frameMultiCinema'
    >
        <div slot="footerId">
            <el-button @click="closeDialogCinemaDialog(false)">取 消</el-button>
            <el-button type="primary" @click="confirmCinemaDialog()">确 定</el-button>
        </div>
    </frame-multicinemas>
  </div>
</template>
<script>
  import frameMulticinemas  from 'frame_cpm/components/frameadmin/cinemaDialog/multiCinema2.vue'
  import TicketType from './ticketType-add-or-update'
  import SirTable from './sirTable'
  import qs from 'qs';
  let getDom = className => {
    return document.getElementsByClassName(className);
  };
  export default {
    components: {
      TicketType,
      SirTable,
      frameMulticinemas
    },
    data () {
      return {
        // 添加/编辑数据
        dialogShow: false,
        dataForm: {
          
        },
        // 回调数据
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        dataListLoading: false,
        // 影院复选
        cinemaName:null,
        cinemaUid:[],
        multiCinemaVisible: false,
        whereUse:null,
        cinematype:2, // 传递给 组件的调用的影院类型 属性参数
        innerCinemaMultiData:[], // 传递给 组件的可选参数 props 参数
        selectedCinemas:{ //业务定义的 选中的数据1
          editData:[]
        },
        selectedCinemas2:{ //业务定义的 选中的数据2
          editData:[]
        },
      }
    },
    created () {
      this.getDataList()
    },
    mounted() {
      let tableWarp = getDom("table-warp")[0]
      let header = getDom("el-table__header-wrapper")[0]
      // console.log(tableWarp)
      let table = getDom("el-table")[0];
      // console.log(table)
      tableWarp.addEventListener("scroll", () => {
        // console.log(tableWarp.scrollTop)
        if(tableWarp.scrollTop<=0){
          header.style.transform = 'translateY(0)'
          header.style.position = 'static'
          return;
        }
        header.style.position = 'absolute'
        header.style.top = 0
        header.style.zIndex = 999
        header.style.borderTop = '1px #f0f0f0 solid'
        header.style.height = '38px'
        header.style.transform = `translateY(${tableWarp.scrollTop-1}px)`
      })
    },
    updata() {
      
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dialogShow = false
        let limit = {
          'page': this.pageIndex,
          'pageSize': this.pageSize
        }
        let addition = {cinemaUid:this.cinemaUid}
        // console.log(limit)
        this.$ctmList.tickettypeList(limit,addition).then( data => {
            console.log(data)
            if (data && data.code === 200) {
              this.dataList = data.data.list
              this.totalCount = data.data.total
              // this.pageIndex = data.data.current
              // this.pageSize = data.data.size
            } else {
              this.dataList = []
              this.totalCount = 0
            }
            this.dataListLoading = false

        }).catch( err => {
            console.log(err)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        // console.log(val)
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        // console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      addOrUpdateHandle (row) {
        this.dialogShow = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
        })
      },
      // 删除
      deleteHandle (id) {
        // console.log(id)
        this.$confirm(`您确定要删除此记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$ctmList.tickettypeDel(id).then( data => {
              // console.log(data)
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }

          }).catch( err => {
              console.log(err)
          })
        }).catch(() => {})
      },
      getDom(className) {
            let getDom = className => {
          return document.getElementsByClassName(className);
        };
      },
      //弹窗方法
      handleCallBack (opt) {
          if(opt.whereUse == 1){
              this.selectedCinemas.editData = opt.dataList
          }else if(opt.whereUse == 2){
              this.selectedCinemas2.editData = opt.dataList
          }
          this.multiCinemaVisible = opt.dialogVisible;
          this.whereUse = opt.whereUse
          console.log(opt)
          this.cinemaName = ''
          this.cinemaUid = []
          opt.dataList.forEach(item => {
            this.cinemaName += item.name + ','
            this.cinemaUid.push(item.id)
          })
          this.multiCinemaVisible = false
      },
      cinemaDialogShow(){
        this.multiCinemaVisible = true
        this.$refs.frameMultiCinema.listAuthCommCinemas()
      },
      closeDialogCinemaDialog(){
          this.multiCinemaVisible = false
      },
      confirmCinemaDialog(value){
          this.$refs.frameMultiCinema.confirmData()
      },
      //查询  
      searchCinema() {
        this.getDataList(this.cinemaUid)
      }
    }
  }
</script>

<style lang="scss">
.demo-ruleForm{
  padding-right: 50px;
  padding-top: 20px;
  float: right;
}
.header{
  height: 50px;
  .item-warp{
      float: left;
      display: inline-flex;
      .el-input{display: inline-block;}
      span{
        display:inline-block;
        width: 80px;line-height: 32px;
        color:#333;
      }
    }
}

.el-pagination{
  margin-top: 20px;
  text-align: center;
  height: 24px;
  line-height: 24px;
  padding: 0px 5px;
  ul{height: 24px;li{height: 24px;};}
  .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
  .el-input__icon {
    line-height: 24px;
  }
  .el-pagination__editor.el-input .el-input__inner {
    height: 24px;
}
}


.ticket-type .table-warp{
  max-height: 609px;
  overflow: auto;
  position: relative;
  .el-table__header-wrapper,.has-gutter tr th{
    height: 38px;
    box-sizing: border-box;
  }
  .el-table{
    border-left: #f0f0f0 1px solid;
    border-top: #f0f0f0 1px solid;
  }
  .el-table th, .el-table td{
    border-right: 1px solid #e5e5e5 !important;
    border-bottom: 1px solid #e5e5e5 !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td{
    background: #f0f0f0;
  }
  
} 
</style>