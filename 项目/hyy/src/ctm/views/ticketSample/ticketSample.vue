<template>
  <div class="ticketSample">
      <!-- 查询块 -->
        <div class="demo-ruleForm">
          <div class="item-warp" >
            <span>影院名称:</span>
            <el-input v-model="cinemaName" @focus="cinemaDialogShow" style="width:220px;" readonly></el-input>
          </div>
            <div style="display:inline-block;margin-left:12px;">
              <el-button type="primary" @click="searchCinema">查询</el-button>
            </div>
        </div>
        <div style="text-align:right;padding:12px 0">
          <el-button type="primary"  plain @click="addTicket()" >新建</el-button>
        </div>
      
      <!-- 内容块 -->
      <el-table
        :data='dataList'
        stripe
        v-loading="dataListLoading"
        style='width: 100%;'>
        <el-table-column
          type="index"
          label='序号'
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop='cinemaName'
          label='适用影院'
          header-align="center"
          align="center"
          width="">
          <template slot-scope="scope">
            <span v-if="scope.row.cinemaNames">{{scope.row.cinemaNames.join(',')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop='name'
          label='票版名称'>
        </el-table-column>
        <el-table-column
          prop='width'
          label='票版宽度'
					:formatter = "widthFormat"
          width="80"
          >
        </el-table-column>
        <el-table-column
          prop='height'
          label='票版高度'
					:formatter = "heightFormat"
          width="80"
          >
        </el-table-column>
        <el-table-column
          prop='ticketsampleChannelNames'
          label='渠道'>
        </el-table-column>
        <el-table-column
          prop='isDefault'
          label='是否默认票版'
          :formatter = "isDefaultFormat"
          >
        </el-table-column>
        <el-table-column
          prop='createTime'
          label='制作时间'>
        </el-table-column>
        <el-table-column
          prop='createUser'
          label='制作人'>
        </el-table-column>
        <el-table-column
          fixed='right'
          width='230'
          label='操作'>
          <template slot-scope='scope' >
            <el-button size='mini' type="text" @click='searchDetail(scope.row.uid)'>查看</el-button>
            <el-button size='mini' type="text" @click='ediHandle(scope.row.uid)'>修改</el-button>
            <el-button size='mini' type="text" @click='deleteHandle(scope.row)' v-if="scope.row.isDefault == 0">删除</el-button>
            <el-button size='mini' type="text" @click='importHandle(scope.row.uid)'>导入</el-button>
            <input class="hidden" ref="importExecl" type="file" @change="selExcelFile($event)">
            <el-button size='mini' type="text" @click='exportHandle(scope.row.uid)'>导出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
			<div class="page-wrap">
        <span v-if="total<10 && dataList.length" style="color:#666;font-size:14px">共{{dataList.length}}条</span>
        <el-pagination
          v-if="total>10"
          background
          style="text-align:center"
          @size-change='sizeChangeHandle'
          @current-change='currentChangeHandle'
          :current-page='pageIndex'
          :page-sizes='[10, 15, 20 , 25 ,30]'
          :page-size='pageSize'
          :total='total'
          :small=false
          layout='total, sizes, prev, pager, next, jumper'>
        </el-pagination>
      </div>
      <frameSinglecinema
        @cinemaCallback="cinemaCallback"
        ref="frameSingleCinema"
      >
      </frameSinglecinema>
  </div>
</template>
<script>
import frameSinglecinema  from "ctm/components/cinema"
import minxins from 'frame_cpm/mixins/cacheMixin.js'

  export default {
    components:{frameSinglecinema},
		mixins: [minxins.cacheMixin],
    data () {
      return {
        /* 缓存数据 */
        cacheField: ["cinemaName","cinemaUid","dataList","pageIndex","pageSize","total"],
        subComName:'ticketSample',
        excelUrl: '',
        // 添加/编辑数据
        dataForm: {},
        // 回调数据
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        total: 10,
        dataListLoading: false,
        uid:null,
        /* 选择影院参数 */
        cinemaUid:'',
        cinemaName:'',
        innerDataSingle: { id: 38 },
        singleCinemaVisible: false,
        whereUse: null,
        cinematype: 2, // 传递给 组件的调用的影院类型 属性参数
        innerData: [], // 传递给 组件的可选参数 props 参数
      }
    },
    created () {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList (uid) {
        let limit = {
          'page': this.pageIndex,
          'pageSize': this.pageSize,
        }
        let cinemaUid = {cinemaUid:uid||''}
        this.$ctmList.ticketList(limit,cinemaUid).then( data => {
            if (data && data.code === 200) {
              data = data.data;
              this.total = data.total  //页数
              console.log(data)
              data.list.map(item=>{
                item.createTime = item.createTime
              })
              this.dataList = data.list
            } else {
              this.dataList = []
              this.totalPage = 0
            }

        }).catch( err => {
            console.log(err)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
        console.log(val)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      //新建
      addTicket() {
        this.$router.push({
          path:"ticketdesign"
        })
      },
      //px单位转换mm
      widthFormat(row, column) {
				return Math.ceil(row.width/3.99)
      },
      heightFormat(row, column) {
				return Math.ceil(row.height/3.99)
      },
      //默认票版
      isDefaultFormat(row) {
        return row.isDefault==1?'是':'否'
      },

      //查询
      searchDetail(uid){
        this.$router.push({
          path:'ticketdetail',
          query:{uid:uid}
        })
      },
      //修改
      ediHandle(uid) {
        this.$router.push({
          path:'ticketdesign',
          query:{uid:uid},
        })
      },
      // 删除
      deleteHandle (item) {
         if(item.isDefault == 1) {
            return this.$message({
                  message: '默认票版不允许删除',
                  type: 'warning',
                  duration: 1500,
                })
          }
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ctmList.ticketsampleDel(item.uid).then( data => {
              console.log(data)
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
      //导入数据
      selExcelFile: function (e,uid) {
          let files = e.target.files;
          let fileObj = files[0];
          let fileName = fileObj.name;
          console.log(files)
          let extName = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
          if (typeof (fileObj) == "undefined" || fileObj.size <= 0) {
              this.$message({
              type:'error',
              message:'请选择文件'
            })
              this.$refs.importExecl.value='';
              return;
          }else if (!(extName == 'ots')){
            this.$message({
              type:'error',
              message:'请选择ots的文件'
            })
            this.$refs.importExecl.value='';
            return;
          }
          var reader = new FileReader();
			    reader.readAsDataURL(fileObj);
          reader.onloadend = e => {
            console.log(e.target)
            let data = {
              dataInfo : e.target.result,
              name : fileName.slice(0,fileName.lastIndexOf('.')),
              uid:this.uid
            }
            this.$ctmList.importTicketFile(
            data
            ).then( data => {
                console.log(data)
                this.$refs.importExecl.value='';
                if (data && data.code === 200) {
                  this.$message({
                    message: '导入成功',
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
          }
     
      },
      importHandle (uid) {
        this.uid = uid
        console.log(uid)
        this.$refs.importExecl.click();
      },
      // 导出数据
      exportHandle (uid) {
        console.log(uid)
        this.$ctmList.exportTicketFile(uid)
        .then(data=> {
          if(data && data.code === 200){
            data = data.data
            console.log(data)
            const exportExlUrl = `data:application/vnd.ms-excel;base64,${data.dataInfo}`
            const fileName = data.name + ".ots"
            if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = exportExlUrl
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            }else { // IE10+下载
                console.log('ie')
                var elemIF = document.createElement("iframe");  
                elemIF.src = exportExlUrl;  
                elemIF.style.display = "none";  
                document.body.appendChild(elemIF); 
            }
          }
        })
      },
      
      //查询  
      searchCinema() {
        this.getDataList(this.cinemaUid)
      },
      /**
       * 弹窗方法
       */
      //弹窗方法
        confirmCinemaSingleDialog(){
            this.$refs.frameSingleCinema.confirmData()
        },
        cinemaCallback(opt) {
            console.log("这里返回数据",opt)
            this.cinemaUid = opt.data.id
            this.cinemaName= opt.data.name
        },
        cinemaDialogShow() {
        this.$refs.frameSingleCinema.openDialog()
        this.$refs.frameSingleCinema.listAuthCommCinemas();
        },
    }
  }
</script>
<style lang="scss">
.hidden{
  display: none;
}

.ticketSample{
  padding: 0 14px;
  .demo-ruleForm{
    background: #f5f5f5;
    width: 100%;
    padding: 18px 24px;
    .item-warp{
      display: inline-block;
      span{
        display:inline-block;
        width: 70px;line-height: 32px;
        color:#666666;
        font-size: 12px;
      }
    }
    .search-Btn{
      margin-left: 24px;      
    }
    .el-button{
      width: 80px;
      height: 32px;
      font-size: 12px;
      span{
        font-size: 12px;
      }
    }
  }
  .el-button{
    font-size: 12px;
  }
  .el-pagination{
    padding-top: 15px;
  }
  .el-table .el-button{
    margin-left: 0;
    font-size: 12px;
  }
  //分页器高度
	.el-pagination{
		height: 24px;
    line-height: 24px;
		padding: 0px 5px;
		ul{height: 24px;li{height: 24px;};}
		button{height: 24px;}
	}

}

</style>

