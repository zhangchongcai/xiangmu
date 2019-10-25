<template>
  <div class="_card-batch-detail">
    <el-collapse v-model="activeNames" class="holding-card-info">
      <!-- 批次信息 -->
      <el-collapse-item title="批次信息" name="0">
        <div class="_card-batch-basic-info">
          <div class="_card-batch-desc-wrap">
            <div class="itemInfo">
              <label class="lable">批次号：</label>
              {{information.batchNo | emptyShow}}
            </div>
            <div class="itemInfo">
              <label class="lable">卡类型：</label>
              礼品卡
            </div>
            <div class="itemInfo">
              <label class="lable">总张数：</label>
              {{information.batchCount | emptyShow}}
            </div>
          </div>
          <div class="_card-batch-desc-wrap">
            <div class="itemInfo">
              <label class="lable">批次名称：</label>
              {{information.batchName | emptyShow}}
            </div>
            <div class="itemInfo">
              <label class="lable">有效期：</label>
              {{information | formateValidTime}}
            </div>
            <div class="itemInfo">
              <label class="lable">已领用：</label>
              {{information.cinemaReceiveCount | emptyShow}}
            </div>
          </div>
          <div class="_card-batch-desc-wrap">
            <div class="itemInfo">
              <label class="lable">政策名称：</label>
              {{information.cardProductName | emptyShow}}
            </div>
            <div class="itemInfo">
              <label class="lable">金额：</label>
              {{information.cardValue | emptyShow}}
            </div>
            <div class="itemInfo">
              <label class="lable">未领用：</label>
              {{information.cinemaNoReceiveCount | emptyShow}}
            </div>
          </div>
        </div>
        <div class="_m-member-table-custom">
          <el-table :data="information.cardBatchCinemaVOList" stripe style="width:414px">
            <!-- <template slot="empty">{{unusedCouponsTip}}</template> -->
            <template slot="empty">暂无领用影院</template>
            <el-table-column prop="cinemaName" label="领用影院" width="206" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="cinemaReceiveCount" label="张数" width="206" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <!-- 卡信息 -->
      <el-collapse-item title="卡信息" name="1">
        <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
          <el-form-item label="卡号：" prop="cardNo">
            <el-input v-model="formData.cardNo" placeholder="请输入卡号"></el-input>
          </el-form-item>
          <el-form-item label="影院名称：" prop="cinemaName">
            <el-input v-model="formData.cinemaName" placeholder="请输入影院名称"></el-input>
          </el-form-item>
          <el-form-item label="领用状态：" prop="isCinemaReceived">
            <el-select v-model="formData.isCinemaReceived" placeholder="全部类型" clearable style="width:192px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" class="_el-btn-custom">搜索</el-button>
            <el-button @click="resetForm('formData')" class="_el-btn-custom _member-custom-ghost-button">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="card-info-table _m-member-table-custom">
          <el-table :data="cardInfoList" stripe style="width: 100%">
            <template slot="empty">{{tipMessage}}</template>
            <el-table-column prop="cardNo" label="卡号" width="206" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="isCinemaReceived" label="领用状态" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.isCinemaReceived | formatIsCinemaReceived}}</template>
            </el-table-column>
            <el-table-column prop="cinemaName" label="影院名称" min-width="240" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0">
          </el-pagination>
        </div>
        <!-- 分页 end -->
      </el-collapse-item>
    </el-collapse>
    <div class="detail-btn-wrap">
      <el-button class="_el-btn-custom" @click="handleBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardBatchDetail',
  data () {
    return {
      total: 0,
      activeNames: ['0', '1'],
      information: {},
      cardInfoList: [],
      tipMessage: '',
      statusOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已领用',
          value: 1
        },
        {
          label: '未领用',
          value: 0
        }
      ],
      formData: {
        batchId: JSON.parse(sessionStorage.getItem('crmCardBatchInfo')).id, // 批次ID
        cardNo: '', // 卡号
        cinemaName: '', // 影院名称
        current: 1,
        isCinemaReceived: '',
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId
      }
    };
  },
  filters: {
    formatIsCinemaReceived (val) {
      if (val == null || val === '') {
        return '-';
      } else if (val == 0 || val == '0') {
        return '未领用';
      } else if (val == 1 || val == '1') {
        return '已领用';
      }
    },
    emptyShow: function (value) {
      if (value == null || value == undefined || value === '') {
        return '-';
      } else {
        return value;
      }
    },
    formateValidTime (val) {
      if (val.validTimeType == 'custom') {
        let unit = '日';
        switch (val.customTimeUnit) {
          case 'day':
            unit = '日';
            break;
          case 'month':
            unit = '月';
            break;
          case 'year':
            unit = '年';
            break;
        }
        return val.customTimeNum + unit;
      } else if (val.validTimeType == 'fixed') {
        return val.startTime + '至' + val.endTime;
      } else {
        return '-';
      }
    }
  },
  created () {
    this.loadingData();
    this.receiveCardPoolList();
  },
  methods: {
    // 关闭
    handleBack () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push({ path: '/member/membershipCard/receiveEntityCard' });
    },
    formateEmpty (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    },
    loadingData () {
      // 批次信息数据
      if (sessionStorage.getItem('crmCardBatchInfo')) {
        this.information = JSON.parse(
          sessionStorage.getItem('crmCardBatchInfo')
        );
      } else {
        this.information = {};
      }
    },
    // 卡信息列表
    receiveCardPoolList (val) {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = '数据加载中...';
      this.$crmList
        .receiveCardPoolList(params)
        .then(ret => {
          if (ret.total == 0) {
            this.tipMessage = '暂无数据';
          }
          this.cardInfoList = ret.records ? ret.records : [];
          this.formData.size = ret.size;
          this.total = ret.total;
        })
        .catch(err => {
          this.cardInfoList = [];
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = '系统繁忙，请稍后重试！';
          }
          console.log(err);
        });
    },
    handleSizeChange (val) {
      this.formData.size = val;
      this.receiveCardPoolList();
    },
    handleCurrentChange (val) {
      this.formData.current = val;
      this.receiveCardPoolList();
    },
    search () {
      this.formData.current = 1;
      this.receiveCardPoolList();
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss">
._card-batch-detail {
  padding-right: 0;
  .holding-card-info {
    margin-top: 20px;
    border: 0;
    ._card-batch-basic-info {
      display: flex;
      justify-content: space-between;
      width: 70%;
      margin-top: -14px;
      ._card-batch-desc-wrap {
        .itemInfo {
          margin: 10px;
          color: #666666;
          font-size: 12px;
          .lable {
            width: 64px;
            font-size: 12px;
            color: #666666;
            display: inline-block;
          }
        }
      }
    }
    .form-data-wrap {
      margin-bottom: 15px;
    }
  }
  .detail-btn-wrap {
    width: 100%;
    margin: 1px 0 40px;
    text-align: center;
  }
}
</style>


