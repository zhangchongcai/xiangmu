<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <!-- <bread-crumb  :dataList="dataList"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <span class="label-title">时间选择:</span>
          <el-date-picker :editable="false" clearable size="small" v-model="time" type="month" placeholder="选择月" @change="changeTime">
          </el-date-picker>
        </div>
        <div class="time-item">
          <span class="label-title">影院名称:</span>
          <el-input size="small" style="width:200px" v-model="cinemaName"></el-input>
        </div>
        <div class="time-item">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title flex">
        <div>影院列表</div>
        <div class="flex" style="vertical-align:middle">
          <el-button @click="downTemplate" style="margin-right:10px;">模版下载</el-button>
          <el-upload :show-file-list="false" :action="uploadUrl" :data="uploadData" name="excel" list-type='text' :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload">
            <el-button style="margin-right:10px;">导入KPI</el-button>
          </el-upload>
          <el-button @click="createShow">新建</el-button>
        </div>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column prop="cinemaCode" label="专资编码" min-width="90" fixed></el-table-column>
            <el-table-column prop="cinemaName" label="影院名称" min-width="160" fixed></el-table-column>
            <el-table-column prop="dateKey" label="月份" min-width="100"></el-table-column>
            <el-table-column prop="boxOfficeTarget" label="票房收入目标(元)" min-width="120" :formatter="formatNum">
            </el-table-column>
            <el-table-column prop="audienceCountTarget" label="观影人次目标(次)" min-width="120" :formatter="formatNum"></el-table-column>
            <el-table-column prop="sellGoodsTarget" label="卖品收入目标(元)" min-width="120" :formatter="formatNum"></el-table-column>
            <el-table-column prop="addMemberCount" label="新增会员目标(人)" min-width="120" :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberConsumeTarget" label="会员消费金额目标(元)" min-width="140" :formatter="formatNum"></el-table-column>
            <el-table-column prop="marketShare" label="票房市场份额目标(%)" min-width="140"></el-table-column>
            <el-table-column label="操作" min-width="90">
              <template slot-scope="scope">
                <span class="text-blue cursor" @click="updateShow(scope.row)"> 编辑</span>
                <span class="text-blue cursor" style="padding-left:10px" @click="delKpi(scope.row.id,scope.row.dateKey)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination v-if="total > 15" size="mini" layout="total,sizes,prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="sizes" :page-size="size" :total="total"></el-pagination>
          <span class="page-else" v-else-if="total>0">共{{total}}条</span>
        </div>
      </div>
    </div>
    <!-- 编辑kpi弹窗 -->
    <update-cinema-kpi ref="update" @updateKpi="updateKpi"> </update-cinema-kpi>
    <!-- 新建kpi弹窗 -->
    <create-cinema-kpi ref="create" @createKpi="createKpi"></create-cinema-kpi>
  </div>
</template>
<script>
import BreadCrumb from '../partical/breadCrumb';
import UpdateCinemaKpi from './dialog/update-cinema-kpi';
import CreateCinemaKpi from './dialog/create-cinema-kpi';
// import config from 'frame_cpm/http/config';
import global from '../../util/global.js';
export default {
  components: { BreadCrumb, UpdateCinemaKpi, CreateCinemaKpi },
  data () {
    return {
      dataList: [{ name: '影院KPI管理' }],
      uploadData: {
        token: this.$store.state.loginToken,
        userId: this.$store.state.loginUser.uid
      },
      fullscreenLoading: false,
      userId: this.$store.state.loginUser ? this.$store.state.loginUser.uid : null,
      uploadUrl: this.$store.state.default.apiConfig.baseURL + `/analysis/cinemaManage/uploadCinemaKpi`,
      time: null,
      cinemaName: null,
      info: null,
      tableData: [], // 表格列表
      sizes: global.pageSizes,
      size: 15,
      page: 1,
      total: 0,
      loading: false
    };
  },
  created () {
    this.getAllData();
  },
  methods: {
    getAllData () {
      this.page = 1;
      this.size = 15;
      this.getList();
    },
    // 下载模版
    downTemplate () {
      // let baseURL = config.baseURL;
      let baseURL = this.$store.state.default.apiConfig.baseURL;
      let downloadUrl = `${baseURL}/analysis/cinemaManage/downloadCinemaKpi?token=${this.$store.state.loginToken}`;
      window.location.href = downloadUrl;
    },
    // 上传模版
    uploadSuccess (response, file, fileList) {
      let code = response.code;
      let message = response.message;
      if (code == (-1024)) {
        this.$message({
          type: 'warning',
          message: message
        });
      } else if (code == 495) {
        this.$message({
          type: 'warning',
          message: message
        });
      } else {
        this.getList();
      }
    },
    uploadError (err, file, fileList) {
    },
    beforeUpload (file) {
    },
    // 1.影院列表（已设置kpi）
    getList () {
      //   this.loading = true;
      let params = {
        body: {
          userId: this.userId,
          cinemaName: this.cinemaName,
          monthDate: this.time,
          pageNo: this.page,
          pageSize: this.size
        }
      };
      this.$camList.getCinemaKpi(params).then(response => {
        //   this.loading = false;
        let res = response.data;
        if (res) {
          this.tableData = res.cinemaKpiList.list;
          this.total = res.cinemaKpiList.total;
        } else {
          this.total = 0;
        }
      });
    },
    // 2.新建kpi
    createKpi (info) {
      let params = {
        body: info
      };
      this.$camList.createKpi(params).then(response => {
        if (response.code == 200) {
          this.$refs.create.handleClose();
          this.getAllData();
        } else {
          this.$message({
            type: 'warning',
            message: response.message
          });
        }
      });
    },
    // 3.更新kpi
    updateKpi (info) {
      let params = {
        body: info
      };
      this.$camList.updateKpi(params).then(response => {
        this.$refs.update.show = false;
        this.getAllData();
      });
    },
    // 4.删除kpi
    delKpi (id, date) {
      this.$confirm('确定删除此影院的kpi?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let params = {
          body: {
            id: id,
            dateKey: date,
            userId: this.userId
          }
        };
        this.$camList.deleteKpi(params).then(response => {
          this.getAllData();
        });
      });
    },
    // 查询
    search () {
      this.getAllData();
    },
    // 改变时间
    changeTime (time) {
      if (time) {
        this.time = this.$moment(time).format('YYYY-MM');
      } else {
        this.time = null;
      }
    },
    // 新建弹窗
    createShow () {
      this.$refs.create.show = true;
    },
    // 更新弹窗
    updateShow (row) {
      this.info = row;
      this.info.userId = this.userId,
        this.$refs.update.infoData = Object.assign({}, this.info);
      this.$refs.update.show = true;
    },
    // 分页/大小
    handleSizeChange (num) {
      this.size = num;
      this.getList();
    },
    // 分页/页码
    handleCurrentChange (num) {
      this.page = num;
      this.getList();
    },
    formatNum (row, column, cellValue) {
      return global.formatNum(cellValue);
    }
  }
};
</script>
