<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <!-- <bread-crumb   :dataList="naveList"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <div class="reset-button">
            <span class="label-title">我的影院:</span>
            <el-input style="width:200px" size="small" v-model="cinemaName" clearable readonly></el-input>
            <el-button style="vertical-align: middle" @click="myCinemaShow">选择</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title clearfix">
        竞对影院列表
        <div class="right reset-button">
          <el-button size="small" @click="addShow">添加</el-button>
        </div>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="competeCinemaList">
            <el-table-column prop="cinemaCompeteUnicode" label="专资编码" min-width="90"></el-table-column>
            <el-table-column prop="cinemaName" label="竞对影院名称" min-width="180"></el-table-column>
            <el-table-column prop="cinemaHall" label="影厅数" min-width="90"></el-table-column>
            <el-table-column prop="cinemaSeat" label="座位数" min-width="90"></el-table-column>
            <el-table-column prop="cinemaAddress" label="地址" min-width="90"></el-table-column>
            <el-table-column prop="cinemaLine" label="所属院线" min-width="90"></el-table-column>
            <el-table-column prop="cinemaInvest" label="所属影投" min-width="90"></el-table-column>
            <el-table-column label="操作" min-width="110px">
              <template slot-scope="scope">
                <span class="text-blue cursor" @click="delet(scope.row.id)">移除</span>
                <span class="text-blue cursor" @click="sort(scope.row.id,scope.$index,'up')" v-if="scope.$index >0">上移</span>
                <span class="text-blue cursor" @click="sort(scope.row.id,scope.$index,'down')" v-if="scope.$index < (competeCinemaList.length-1)">下移</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page" style="padding:0 auto;">
          <el-pagination v-if="total > 15" size="mini" layout="total,sizes,prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="sizes" :page-size="size" :total="total">
          </el-pagination>
          <span class="page-else" v-else-if="total>0">共{{total}}条</span>
        </div>
      </div>
    </div>
    <!-- 竞对影院选择弹窗 -->
    <cinema-select ref="selectDailog" :cinemaId="cinemaId" @addCinema="addCinema"></cinema-select>
    <!-- 我的影院选择弹窗 -->
    <cinema-my-select ref="mySelectDialog" @getList="getAllData"></cinema-my-select>
  </div>
</template>
<script>
import BreadCrumb from '../partical/breadCrumb';
import Global from '../../util/global.js';
import CinemaMySelect from './dialog/select-my-cinema';
import CinemaSelect from './dialog/select-compete-cinema';
export default {
  components: { BreadCrumb, CinemaMySelect, CinemaSelect },
  data () {
    return {
      naveList: [{ name: '竞对影院管理' }],
      userId: this.$store.state.loginUser ? this.$store.state.loginUser.uid : 805852,
      cinemaName: null,
      cinemaId: null,
      competeCinemaList: [],
      sizes: Global.pageSizes,
      size: 15,
      page: 1,
      total: 0
    };
  },
  created () {
    // this.getAllData();
  },
  methods: {
    getAllData (option) {
      if (option) {
        this.cinemaName = option.cinemaName;
        this.cinemaId = option.cinemaId;
      }
      this.page = 1;
      this.size = 15;
      this.getBindingCinema();
    },
    // 1.我的影院弹窗
    myCinemaShow () {
      this.$refs.mySelectDialog.initData();
      this.$refs.mySelectDialog.show = true;
    },
    // 2. 查询竞对影院（已绑定）
    getBindingCinema (option) {
      if (option) {
        this.cinemaName = option.cinemaName;
        this.cinemaId = option.cinemaId;
      }
      let params = {
        body: {
          userId: this.userId,
          cinemaCode: this.cinemaId,
          pageNo: this.page,
          pageSize: this.size
        }
      };
      this.$camList.getBindingCinemaList(params).then(response => {
        let res = response.data;
        if (res) {
          this.competeCinemaList = res.list;
          this.total = res.total;
        } else {
          this.competeCinemaList = [];
          this.total = 0;
        }
      });
    },
    // 3.竞对影院弹窗
    addShow () {
      if (!this.cinemaId) {
        this.$message({ type: 'error', message: '请选择我的影院' });
      } else {
        this.$refs.selectDailog.getCompeteList();
        this.$refs.selectDailog.show = true;
      }
    },
    // 4. 添加竞对影院
    addCinema (info) {
      let params = {
        body: info
      };
      this.$camList.addCompeteCinema(params).then(response => {
        this.getBindingCinema();
        this.$refs.selectDailog.show = false;
      });
    },
    // 5.排序
    sort (id, index, type) {
      let toId = null;
      let toIndex = null;
      if (type == 'up') {
        toId = this.competeCinemaList[(index - 1)].id;
        toIndex = index - 1;
      } else if (type == 'down') {
        toId = this.competeCinemaList[(index + 1)].id;
        toIndex = index + 1;
      }
      let params = {
        body: {
          id: id,
          sortId: toId,
          userId: this.userId
        }
      };
      this.$camList.sortCompeteCinema(params).then(response => {
        let oldRow = this.competeCinemaList[index];
        let toRow = this.competeCinemaList[toIndex];
        this.$set(this.competeCinemaList, index, toRow);
        this.$set(this.competeCinemaList, toIndex, oldRow);
      });
    },
    // 6.删除竞对影院
    delet (id) {
      this.$confirm('确定删除该竞对影院?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          body: {
            idList: [id]
          }
        };
        this.$camList.deleteCompeteBind(params).then(response => {
          // this.getBindingCinema()
          this.getAllData();
        });
      });
    },
    // 分页/大小
    handleSizeChange (num) {
      this.size = num;
      this.getBindingCinema();
    },
    // 分页/页码
    handleCurrentChange (num) {
      this.page = num;
      this.getBindingCinema();
    }
  }
};
</script>
