<template>
  <div>
    <div class="ticket-price-plan-header">
      <div class="search-wrap">
        <span>方案名称：</span>
        <el-input size="small" placeholder="请输入方案名称" v-model="name"></el-input>
      </div>
      <div class="search-wrap">
        <span>适用渠道：</span>
        <!-- <el-input
          size='small'
          placeholder="请输入营销渠道"
          prefix-icon="el-icon-search"
          v-model="channel"
        >
        </el-input>-->
        <el-select v-model="channel" placeholder="请输入适用渠道" @focus="getChannelList()">
          <el-option label="全部" value></el-option>
          <el-option v-for="(item,index) in channelList" :key="index" :label="item.name" :value="item.uid"></el-option>
        </el-select>
      </div>
      <div class="search-wrap plan-size">
        <span>方案状态：</span>
        <el-select v-model="status" placeholder="请选择方案状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
          <el-option label="全部" value></el-option>
        </el-select>
      </div>
      <div class="search-wrap plan-size">
        <span>适用影院：</span>
        <el-input v-model="chooseCinemas1" @focus="chooseCinema1()" :readonly="true" style="display: inline-block;"></el-input>
        <cinemaTable ref="chooseCinema1" :dialogTableVisible="dialogTableVisible" @searchUser1="searchUser1" @chooseUser1="chooseUser1" @changeCurrentPage1="changeCurrentPage1"></cinemaTable>
        <!-- <el-input v-model="checkNode" @focus="cinemaSelectFun()" class="cinema"></el-input>
        <cinemaSelect
          ref="checkNode"
          :selectCinemaStatus="selectCinemaStatus"
          :getCinemaTreeList="getCinemaTreeList"
          @getSelectedCinema="getSelectedCinema"
          @selectCinemaClose="selectCinemaClose"
          :ciCinemaList="sizeForm.ciCinemaList"
        ></cinemaSelect>
        <getCinema
          ref="chooseCinema"
          @searchUser="searchUser"
          @chooseUser="chooseUser"
          @changeCurrentPage="changeCurrentPage"
        ></getCinema>-->
      </div>

      <div class="button-wrap" style="margin-left:16px">
        <el-button type="primary" size="small" @click="getDatas">查询</el-button>
        <el-button type="primary" size="small" plain @click="resetHandle">重置</el-button>
      </div>
    </div>
    <div class="ticket-price-plan-table">
      <div class="ticket-price-plan-tableNew">
        <div class="creat-tickPrice">
          <el-button type="primary" size="small" plain @click="newticketPlan">新建</el-button>
        </div>
      </div>
      <el-table :data="tableData" :row-class-name="tableRowClassName" style="width: 100%" v-loading="loading">
        <el-table-column prop="code" label="方案编码" width="180"></el-table-column>
        <el-table-column prop="name" label="方案名称" width="180"></el-table-column>
        <el-table-column prop="channelNames" label="适用渠道"></el-table-column>
        <el-table-column prop="disVersion" label="影片版本"></el-table-column>
        <el-table-column prop="hallType" label="适用影厅">
          <template slot-scope="scope">
            <span v-if="!(scope.row.hallType =='')">{{scope.row.hallType}}</span>
            <span v-else>不限影厅</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status ==1">启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleScan(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20, 30]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import { deletePricePlan } from 'ctmSrc/http/interface';
import getCinema from './getCinemaName';
import cinemaSelect from 'ctmSrc/components/common/check';
import cinemaTable from './cinemaTable';
export default {
  data () {
    return {
      loading: false,
      chooseCinemas1: '',
      sizeForm: {
        ciCinemaList: []
      },
      isSome: false, // 是否选择部分
      checkNode: '',
      dialogTableVisible: false,
      getCinemaTreeList: [],
      schBashMovieList: [],
      channel: '',
      name: '',
      status: '1',
      channelList: [],
      channelsList_1: [],
      channelsList_2: [],
      // 交互部分
      currentPage: '' || 0,
      total: '' || 1,
      size: '' || 10,
      pages: '' || 1,
      tableData: [],
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      value7: ''
    };
  },
  created () {
    this.getDatas();
  },
  methods: {
    // getLists() {
    //   this.$refs.chooseCinema1.dialogTableVisible = true;
    //   this.$ctmList
    //     .cinemaFindList({
    //       pageNum: 1,
    //       pageSize: "10"
    //     })
    //     .then(res => {
    //       this.$nextTick(_ => {
    //         this.$refs.chooseCinema1.gridData = res.data.records;
    //         this.$refs.chooseCinema1.pageData = res.data;
    //         // this.$refs.checkNode.initCheckedTreeNode(
    //         //   this.sizeForm.ciCinemaList
    //         // );
    //       });
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    getCinemaLi (val = 1, names) {
      let params = {
        // is_public_value: 0,
        // movieCode: "",
        pageNum: val,
        pageSize: '10',
        cinemaName: names || ''
      };
      this.$ctmList
        .cinemaFindList(params)
        .then(res => {
          this.$refs.chooseCinema1.gridData = res.data.records;
          this.$refs.chooseCinema1.pageData = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    searchUser1 (name) {
      console.log(name);
      this.getCinemaLi(1, name);
    },
    chooseUser1 (arr) {
      this.chooseCinemas1 = '';
      arr.forEach(item => {
        this.chooseCinemas1 += item.cinemaName + ',';
      });
      this.chooseCinemas1 = this.chooseCinemas1.slice(
        0,
        this.chooseCinemas1.length - 1
      );
      let self = this;
      self.sizeForm.ciCinemaList = arr;
      let UidArr = [];
      self.sizeForm.ciCinemaList.forEach((item, index) => {
        UidArr.push(item.cinemaUid);
      });
      self.sizeForm.ciCinemaList = UidArr;
      self.cinemaUids = UidArr.join(',');
    },
    chooseCinema1 () {
      event.srcElement.blur();
      // if (!this.cinemaUids) {
      //   this.$alert("请先选择影院", "提示", {
      //     confirmButtonText: "确定"
      //   });
      // } else {
      this.getCinemaLi();
      this.$refs.chooseCinema1.dialogTableVisible = true;
      this.$refs.chooseCinema1.title = '选择影院'; //  关联代码 getCinema
      this.$refs.chooseCinema1.title1 = '影院名称';
      this.$refs.chooseCinema1.heightOver = '630px';
      // }
    },
    changeCurrentPage1 (val) {
      console.log(val);
      this.getCinemaLi(val);
    },
    // selectCinemaClose(val) {
    //   console.log("val8888888888888888888", val);
    //   this.selectCinemaStatus = val;
    // },
    // 选择影院方法
    // cinemaSelectFun() {
    //   let self = this;
    //   self.selectCinemaStatus = true;
    //   let data = {};
    //   self.$ctmList
    //     .getCinemaTreeList(data)
    //     .then(ret => {
    //       if (ret.data) {
    //         self.getCinemaTreeList = ret.data.children;
    //         console.log(
    //           "this.sizeForm.ciCinemaList",
    //           this.sizeForm.ciCinemaList
    //         );
    //         this.$nextTick(_ => {
    //           this.$refs.checkNode.initCheckedTreeNode(
    //             this.sizeForm.ciCinemaList
    //           );
    //         });
    //       }
    //     })
    //     .catch(() => {
    //       console.log("哪里出错了，检擦一下哥哥");
    //     });
    // },
    // getSelectedCinema(val) {
    //   let self = this;
    //   self.sizeForm.ciCinemaList = val;
    //   let UidArr = [];
    //   self.sizeForm.ciCinemaList.forEach((item, index) => {
    //     UidArr.push(item.uid);
    //   });
    //   self.sizeForm.ciCinemaList = UidArr;
    //   self.cinemaUids = UidArr.join(",");
    //   self.ttVoList = [];
    //   var arr = val;
    //   this.checkNode = "";
    //   arr.forEach(item => {
    //     this.checkNode += item.name + ",";
    //   });
    //   this.checkNode = this.checkNode.slice(0, this.checkNode.length - 1);
    // },
    // selectCinemaClose(val) {
    //   console.log("val8888888888888888888", val);
    //   this.selectCinemaStatus = val;
    // },
    searchUser (name) {
      console.log(name);
      this.getMovieList(1, name);
    },
    chooseUser (arr) {
      console.log(arr);
      this.schBashMovieList = arr;
      this.checkNode = '';
      arr.forEach(item => {
        this.checkNode += item.cinemaName + ',';
      });
      this.checkNode = this.checkNode.slice(0, this.checkNode.length - 1);
    },
    changeCurrentPage (val) {
      console.log(val);
      this.getMovieList(val);
    },
    chooseCinema () {
      event.srcElement.blur();
      // if (!this.cinemaUids) {
      //   this.$alert("请先选择影院", "提示", {
      //     confirmButtonText: "确定"
      //   });
      // } else {
      this.$ctmList
        .cinemaFindList({
          pageSize: 10,
          pageNum: 1,
          cinemaCode: ''
        })
        .then(res => {
          this.$refs.chooseCinema.gridData = res.data.records;
          this.$refs.chooseCinema.name = 'cinemaName';
          this.$refs.chooseCinema.pageData = res.data;
        });
      this.$refs.chooseCinema.dialogTableVisible = true;
      this.$refs.chooseCinema.title = '选择影院'; //  关联代码 getMovieList
      this.$refs.chooseCinema.title1 = '影院名称'; //  关联代码 getMovieList
      this.$refs.chooseCinema.heightOver = '580px';
      // }
    },
    getMovieList (current = 1, cinemaName) {
      let self = this;
      let params = {
        // is_public_value: 0,
        // movieCode: "",
        pageSize: 10,
        pageNum: current,
        cinemaCode: self.cinemaUids || null,
        cinemaName
      };
      // console.log(JSON.stringify(params))
      self.$ctmList
        .cinemaFindList(params)
        .then(ret => {
          if (ret.data) {
            // self.movieList = ret.data;
            this.$refs.chooseCinema.gridData = ret.data.records;
            this.$refs.chooseCinema.pageData = ret.data;
          }
        })
        .catch(() => {
          console.log('哪里出错了，检擦一下哥哥');
        });
    },
    resetHandle () {
      let self = this;
      self.name = '';
      self.channel = '';
      self.status = '';
      self.sizeForm.ciCinemaList = [];
      this.checkNode = '';
      this.chooseCinemas1 = '';
    },
    getDatas () {
      let self = this;
      this.loading = true;
      let params = {
        channel: self.channel,
        status: self.status,
        name: self.name,
        size: self.size || 10,
        current: self.currentPage || 0,
        cinemaUidList: self.sizeForm.ciCinemaList
      };
      self.$ctmList
        .priceprogramFind(params)
        .then(ret => {
          this.loading = false;
          if (ret.data) {
            let result = ret.data;
            self.tableData = result.records;
            self.currentPage = result.current;
            self.total = result.total;
            self.size = result.size;
            self.pages = result.pages;
          }
        })
        .catch(() => {
          console.log('哪里出错了，检擦一下哥哥');
        });
    },
    getChannelList (val) {
      let self = this;
      let params = {
        channelNature: val
      };
      self.$ctmList
        .getPriceAddChannelList(params)
        .then(ret => {
          if (ret.data) {
            self.channelList = ret.data;
          }
        })
        .catch(() => {
          console.log('哪里出错了，检擦一下哥哥');
        });
    },
    // 交互部分
    handleSizeChange (val) {
      let self = this;
      self.size = val;
      console.log(`每页 ${val} 条`);
      self.getDatas();
    },
    handleCurrentChange (val) {
      let self = this;
      self.currentPage = val;
      console.log(`当前页: ${val}`);
      self.getDatas();
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
      return '';
    },
    handleScan (index, row) {
      this.$router.push({
        path: './scan',
        query: {
          id: row.uid
        }
      });
    },
    handleEdit (index, row) {
      this.$router.push({
        path: './edit',
        query: {
          id: row.uid
        }
      });
    },
    handleDelete (index, row) {
      let self = this;
      //  if(row.status == 1){
      //    self.$message({
      //             message: '价格方法正在使用中...',
      //             type: 'warning'
      //           });
      //           return
      //  }
      let params = {
        id: row.id
      };
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        deletePricePlan(params)
          .then(ret => {
            if (ret.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.loading = false;
              self.getDatas();
            } else {
              this.$message({
                message: ret.msg,
                type: 'warning'
              });
              this.loading = false;
            }
          });
      }).catch(() => {
      });
    },
    newticketPlan () {
      this.$router.push({
        path: './add'
      });
    }
  },
  components: {
    getCinema,
    cinemaSelect: cinemaSelect,
    cinemaTable
  }
};
</script>
<style lang="scss">
.ticket-price-plan-header {
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 24px;
  background: #f5f5f5;
  box-sizing: border-box;
  .cinema {
    width: 360px;
  }
  .search-wrap {
    display: inline-block;
    height: 32px;
    margin-right: 32px;

    .el-input {
      width: 264px;
      font-size: 12px;
    }
    > span {
      color: #666666;
      font-size: 12px;
    }
  }
  .plan-size {
    .el-input {
      width: 160px;
    }
  }
  .button-wrap {
    // float: right;
    margin-left: 16px;
    margin-top: 8px;
    margin-right: 24px;
    display: inline-block !important;
    span {
      font-size: 12px;
    }
    .el-button {
      width: 80px;
      height: 32px;
    }
  }
}
.ticket-price-plan-table {
  .ticket-price-plan-tableNew {
    width: 100%;
    height: 32px;
    .creat-tickPrice {
      margin-top: 11px;
      // margin-right: 22px;
      float: right;
      display: inline-block;
      margin-bottom: 12px;
      .el-button {
        width: 80px;
        height: 32px;
      }
    }
  }
  //   margin-left: 174px;
  .el-table .warning-row {
    background: #f5f5f5;
  }

  .el-table .success-row {
    background: #ffffff;
  }
  .el-table tr {
    background: #f2f4fd;
  }
}
</style>
