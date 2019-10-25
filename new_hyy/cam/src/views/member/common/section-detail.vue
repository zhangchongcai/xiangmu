<template>
  <div class="section">
    <div class="section-title">
      <i class="el-icon-arrow-up icon"></i>
      {{type == 'group'?'区域明细':'影院明细'}}
    </div>
    <div class="section-content">
      <div class="reset-table">
        <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
          <el-button class="right" size="mini" @click="getOut">导出</el-button>
        </div>
        <el-table border :data="allData">
          <el-table-column label="序号" width="60" type="index" fixed></el-table-column>
          <el-table-column label="区域名称" min-width="120" fixed v-if="type == 'group'">
            <template slot-scope="scope">
              <span class="text-blue cursor" @click="goDetail({cityId:scope.row.cityId,name:scope.row.cityName,type:'city'})">{{scope.row.cityName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="影院名称" min-width="120" fixed v-else-if="type == 'city'">
            <template slot-scope="scope">
              <div class="text-blue cursor" @click="goDetail({cinemaId:scope.row.cinemaId,name:scope.row.cinemaName,type:'cinema'})">{{scope.row.cinemaName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="newMember" label="新增会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="effectiveMember" label="有效会员数(人)" min-width="130" sortable :formatter="formatNum" v-if="timeType == 'day'"> </el-table-column>
          <el-table-column prop="cumulativeMember" label="累计会员数(人)" min-width="130" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
          <el-table-column prop="coverMember" label="可转化用户数(人)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="newCardMember" label="新卡会员数(人)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="renewMember" label="续卡会员数(人)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="patchCardMember" label="补卡会员数(人)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="storeMember" label="储值会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="expireMember30" label="已到期30天会员(人)" min-width="160" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
          <el-table-column prop="expireMember7" label="已到期7天会员(人)" min-width="150" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
          <el-table-column prop="memberCardProfit" label="会员卡费收益(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberStoreAmount" label="会员储值金额(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberConsumeAmount" label="会员消费金额(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="totalStoreAmount" label="累计储值余额(元)" min-width="140" sortable :formatter="formatNum" v-if="type == 'group' && timeType == 'day'"></el-table-column>
          <el-table-column prop="memberNewCardProfit" label="会员开新卡收益(元)" min-width="160" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberRenewCardProfit" label="会员续卡收益(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberPatchCardProfit" label="会员补卡收益(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberUnitPrice" label="会员客单价(元)" min-width="130" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberPersonProfit" label="会员人均贡献(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="memberConsumePercent" label="会员消费占比(%)" min-width="140" sortable :formatter="formatNum"></el-table-column>
          <el-table-column prop="effectiveMemberRate" label="有效会员占比(%)" min-width="140" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
        </el-table>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Global from '../../../util/global.js';
export default {
  props: {
    allData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    type: {
      type: String,
      default: 'group'
    },
    timeType: {
      type: String,
      default: 'day'
    }
  },
  methods: {
    // 下载
    getOut () {
      this.$emit('getOut');
    },
    // 前往城市版
    goDetail (option) {
      this.$emit('go', option);
    },

    handleSizeChange (num) {
      this.$emit('getData', { page: this.page, size: num });
    },
    handleCurrentChange (num) {
      this.emit('getData', { page: num, size: this.size });
    },
    formatNum (row, column, cellValue) {
      let item = column.label;
      let arr = ['新增会员数(人)', '有效会员数(人)', '累计会员数(人)',
        '可转化用户数(人)', '新卡会员数(人)', '续卡会员数(人)', '补卡会员数(人)',
        '储值会员数(人)', '已到期30天会员(人)', '已到期7天会员(人)'];
      if (arr.includes(item)) {
        return Global.formatNum(cellValue, 0);
      } else {
        return Global.formatNum(cellValue);
      }
    }
  }
};
</script>