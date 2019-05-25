<template>
  <div class="ticket-type">
    <div v-if="!dialogShow">
      <!-- 查询块 -->
      <div style="text-align:right;margin-bottom:16px;">
          <el-button type="primary" @click="addOrUpdateHandle()">新建</el-button>
      </div>
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
        <!-- <SirTable
          :data='dataList'
          v-loading="dataListLoading"
          stripe
          :header-cell-style="{background:'#E7EBFF',height:'38px!important'}"
          :row-style = "rowStyle"
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
            fixed='right'
            width='200'
            label='操作'>
            <template slot-scope='scope'>
              <el-button size='small' type="text" @click='addOrUpdateHandle(scope.row)'>修改</el-button>
              <el-button size='small' v-if="scope.row.name!='成人票'&&scope.row.name!='团体票'&&scope.row.name!='学生票'" type="text" @click='deleteHandle(scope.row.uid)'>删除</el-button>
            </template>
          </el-table-column>
        </SirTable> -->
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
  </div>
</template>
<script>
  import TicketType from './ticketType-add-or-update'
  import SirTable from './sirTable'
  import qs from 'qs';
  let getDom = className => {
    return document.getElementsByClassName(className);
  };
  export default {
    components: {
      TicketType,
      SirTable
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
        dataListLoading: false
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
      console.log(table)
      tableWarp.addEventListener("scroll", () => {
        console.log(tableWarp.scrollTop)
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
        let limit = qs.stringify({
          'page': this.pageIndex,
          'pageSize': this.pageSize
        })
        // console.log(limit)
        this.$api.tickettypeList(limit).then( data => {
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
           this.$api.tickettypeDel(id).then( data => {
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