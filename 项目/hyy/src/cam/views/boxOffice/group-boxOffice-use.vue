<template>
  <div class="boxOffice-content-wrap">
    <div class="header-fixed" ref="headerFixed">
      <!-- <div class="flex">
        <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path:'/analysis/new/home' }">
            <span class="text-gray fs12">经营决策</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span class="text-blue fs12">票房概览</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <div class="time-wrap">
        <div class="time-item">
            <Authority-Name :orgType="orgType" :orgName="orgName"></Authority-Name>
        </div>
        <div class="time-item">
            <span class="label-title">时间选择:</span>
            <calendar-view
              size="mini"
              v-model="time"
              format="yyyy/MM/dd"
              :dateType="dateType"
              :dateTypeActive="dateTypeActive"
              :dateTypeIndex="dateTypeIndex"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
        </div>
        <div class="time-item">
          <span class="label-title">影院品牌:</span> 
          <el-select
            v-model="cinemaId"
            placeholder="请选择影院品牌"
            clearable
            @change="changeCinema">
            <el-option
              v-for="(item,index) in cinemaList"
              :key="index"
              :label="item.brandName"
              :value="item.brandCode">
            </el-option>
          </el-select>
        </div>
        <div class="time-item">
          <el-button type="primary"  @click="search">查询</el-button>
          <div class="member-type">
             <el-checkbox v-model="memberType" @change="changeMemberType">仅会员</el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="section" ref="targetRef">
      <div class="section-title flex">
        <div class="flex-left">
          <i class="el-icon-arrow-up icon"></i>
          指标概览
          <span class="quota-time">({{showTimeLabel}})</span>
        </div>
        <div>
          <el-radio-group class="reset-radios-group" v-model="ratioType" @change="changeRadio">
            <el-radio :label="1" :disabled="disabledChain">环比</el-radio>
            <el-radio :label="2" :disabled="disabledSame">同比</el-radio>
          </el-radio-group>
          <el-button style="margin-left:20px" @click="showTargetSetting">指标设置</el-button>
        </div>
      </div>
      <div class="section-content" v-if="targetArr">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index" v-show="isShowTarget(item.code)">
            <div class="target-title">{{item.name}}</div>
            <div class="money">
              <i class="iconfont" :class="icons[index]" :style="{color:iconColors[index]}"></i>
              <span class="money-num">{{item.value| formatMoney(item.code)}}</span>
              <span class="unit">{{item.code|formatTargetUnit(item.value*1)}}</span>
            </div>
            <div class="ratio" v-if="ratioType == 1 && !disabledChain">
              环比
              <span
                class="ratio-num"
                :class="item.valueRound*1 > 0 ? 'text-green':'text-red' "
              >
                <i
                  class="iconfont"
                  :class="[item.valueRound > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"
                ></i>
                {{item.valueRound | numberToFixed}}%
              </span>
            </div>
            <div class="ratio" v-if="ratioType == 2 && !disabledSame">
              同比
              <span class="ratio-num" :class="item.valueSame*1 >0?'text-green':'text-red'">
                <i
                  class="iconfont"
                  :class="[item.valueSame > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"
                ></i>
                {{item.valueSame | numberToFixed}}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        趋势图
        <span class="quota-time">({{showTimeLabel}})</span>
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px">
          <!-- 单位：元 -->
        </div>
        <div>
          <target-label
            ref="targetLabel"
            :activeType="activeType"
            :targetLabel="targetLabel"
            :otherLabel="otherLabel"
            @getType="changeTrendType"
          ></target-label>
        </div>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue"  @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line
          v-if="isLine"
          :data="boxLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
          :data-empty="lineChartEmpty"
        ></ve-line>
        <div class="reset-table" v-else>
          <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
            <el-button class="right" size="mini" @click="getTrendOut">导出</el-button>
          </div>
          <el-table border :data="boxTableData" height="380" class="mt10">
            <el-table-column prop="dateKey" label="日期" min-width="100" fixed  key="dateKey"></el-table-column>
            <el-table-column prop="boxOffice" label="票房(元)" min-width="140" fixed key="boxOffice">
              <template slot-scope="scope">{{scope.row.boxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="audienceCount" label="观影人次(人)" min-width="100" fixed  key="audienceCount">
              <template slot-scope="scope">{{scope.row.audienceCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="planShowCount" label="场次(场)" min-width="100" fixed v-if="memberTypeVal === 0" key="planShowCount">
              <template slot-scope="scope">{{scope.row.planShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="avgTicketPrice" label="平均票价(元)" min-width="100" key="avgTicketPrice">
              <template slot-scope="scope">{{scope.row.avgTicketPrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="servicePrice" label="三方服务费(元)" min-width="130" key="servicePrice">
              <template slot-scope="scope">{{scope.row.servicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="hallServicePrice" label="影厅服务费(元)" min-width="130" key="hallServicePrice">
              <template slot-scope="scope">{{scope.row.hallServicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="payBoxOffice" label="应缴专资票房(元)" min-width="140" key="payBoxOffice">
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="splitBoxOffice" label="分帐票房(元)" min-width="120" key="splitBoxOffice">
              <template slot-scope="scope">{{scope.row.splitBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="attendanceRate" label="上座率(%)" min-width="100" v-if="memberTypeVal === 0" key="attendanceRate">
              <template slot-scope="scope">{{scope.row.attendanceRate | formatNum }}</template>
            </el-table-column>
            <el-table-column prop="avgPlanShowCount" label="场均人次(人)" min-width="100" v-if="memberTypeVal === 0" key="avgPlanShowCount">
              <template slot-scope="scope">{{scope.row.avgPlanShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="avgSeatPrice" label="单座产出(元)" min-width="110" v-if="memberTypeVal === 0" key="avgSeatPrice">
              <template slot-scope="scope">{{scope.row.avgSeatPrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="memberBoxOfficePer" label="会员消费占比(%)" min-width="140" key="memberBoxOfficePer">
              <template slot-scope="scope">{{scope.row.memberBoxOfficePer | formatNum }}</template>
            </el-table-column>
            <el-table-column prop="marketShare" label="市场份额(%)" min-width="100" v-if="memberTypeVal === 0" key="marketShare">
              <template slot-scope="scope">{{scope.row.marketShare | formatNum }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        渠道及影片分布
        <span class="quota-time">({{showTimeLabel}})</span>
      </div>
      <div class="flex-wraper">
        <div class="section-item">
          <target-label
            ref="targetLabel2"
            :activeType="activeType"
            :targetLabel="targetLabel2"
            :otherLabel="otherLabel2"
            @getType="changeChannelType"
          ></target-label>
          <div style="width:100%">
            <!-- <ve-pie
              :title="channelTitle"
              :data="channelData"
              :extend="pieExtend"
              :colors="colors"
              :settings="channelSettings"
              :data-empty="channelChartEmpty"
              v-if="showChannelPie"
            >
            </ve-pie> -->
            <ve-ring
              :title="channelTitle"
              :settings="{roseType: 'radius'}"
              :data="channelData"
              :extend="pieExtendChannel"
              :colors="colors"
              :data-empty="channelChartEmpty"
              v-if="showChannelPie"
            ></ve-ring>
            <ve-histogram
              :title="channelTitle1"
              :data="channelData"
              :extend="barExtendChannel"
              :legend-visible="false"
              :data-empty="channelChartEmpty"
              v-else
            ></ve-histogram>
          </div>
        </div>
        <div class="section-item">
          <target-label
            ref="targetLabel1"
            :activeType="activeType"
            :targetLabel="targetLabel1"
            :otherLabel="otherLabel1"
            @getType="changeMovieType"
          ></target-label>
          <div style="width:100%">
            <ve-ring
              :title="movieTitle"
              :settings="{roseType: 'radius'}"
              :data="movieData"
              :extend="pieExtendMovie"
              :colors="colors"
              :data-empty="movieChartEmpty"
              v-if="showMoviePie"
            ></ve-ring>
            <ve-histogram
              :title="movieTitle1"
              :data="movieData"
              :extend="barExtendMovie"
              :legend-visible="false"
              :data-empty="movieChartEmpty"
              v-else
            ></ve-histogram>
          </div>
        </div>
        
      </div>
      
    </div>
    <div class="section">
      <div class="section-title flex">
        <div class="flex-left">
            <i class="el-icon-arrow-up icon"></i>
            区域明细
          <span class="quota-time">({{showTimeLabel}})</span>
        </div>
        <el-button class="right" size="mini" @click="getAreaOut">导出</el-button>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData" key="tableData" @sort-change="tableSortChange">
            <el-table-column label="序号" width="60" type="index" fixed key="id"></el-table-column>
            <el-table-column label="区域名称" min-width="110" fixed key="area">
              <template slot-scope="scope">
                <div class="cursor" @click="goDetail(scope.row.cityId,scope.row.name)">
                  <span class="text-blue">{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="boxOffice" label="票房(元)" min-width="110" sortable="custom" key="boxOffice">
              <template slot-scope="scope">{{scope.row.boxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="audienceCount" label="观影人次(人)" min-width="120" sortable="custom" key="audienceCount">
              <template slot-scope="scope">{{scope.row.audienceCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="planShowCount" label="场次(场)" min-width="120" sortable="custom"  v-if="memberTypeVal === 0" key="planShowCount">
              <template slot-scope="scope">{{scope.row.planShowCount | formatNum | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="avgTicketPrice" label="平均票价(元)" min-width="120" sortable="custom" key="avgTicketPrice">
              <template slot-scope="scope">{{scope.row.avgTicketPrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="servicePrice" label="三方服务费(元)" min-width="140" sortable="custom" key="servicePrice">
              <template slot-scope="scope">{{scope.row.servicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="hallServicePrice" label="影厅服务费(元)" min-width="140" sortable="custom" key="hallServicePrice">
              <template slot-scope="scope">{{scope.row.hallServicePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="payBoxOffice" label="应缴专资票房(元)" min-width="140" sortable="custom" key="payBoxOffice">
              <template slot-scope="scope">{{scope.row.payBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="splitBoxOffice" label="分帐票房(元)" min-width="120" sortable="custom" key="splitBoxOffice">
              <template slot-scope="scope">{{scope.row.splitBoxOffice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="unShowCountRate" label="空场率(%)" min-width="110" sortable="custom" v-if="memberTypeVal === 0" key="unShowCountRate">
               <template slot-scope="scope">{{scope.row.unShowCountRate | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="attendanceRate" label="上座率(%)" min-width="110" sortable="custom" v-if="memberTypeVal === 0" key="attendanceRate">
               <template slot-scope="scope">{{scope.row.attendanceRate | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="avgPlanShowCount" label="场均人次(人)" min-width="130" sortable="custom" v-if="memberTypeVal === 0" key="avgPlanShowCount">
              <template slot-scope="scope">{{scope.row.avgPlanShowCount  | formatFixed}}</template>
            </el-table-column>
            <el-table-column prop="avgSeatPrice" label="单座产出(元)" min-width="130" sortable="custom" v-if="memberTypeVal === 0" key="avgSeatPrice">
                <template slot-scope="scope">{{scope.row.avgSeatPrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="memberBoxOfficePer" label="会员消费占比(%)" min-width="140" sortable="custom" key="memberBoxOfficePer">
               <template slot-scope="scope">{{scope.row.memberBoxOfficePer | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="marketShare" label="市场份额(%)" min-width="130" sortable="custom" v-if="memberTypeVal === 0" key="marketShare">
              <template slot-scope="scope">{{scope.row.marketShare | formatNum}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page" >
          <el-pagination v-if="total>15"
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            layout="total,sizes,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
          <span class="page-else" v-else-if="total>0">共{{total}}条</span>
          <span class="page-else" v-else></span>
        </div>
      </div>
    </div>
    <!-- 指标设置弹窗 -->
    <target-dialog ref="targetDialog" :userId="userId" :targetList="targetList" @saveTarget="saveTarget"></target-dialog>
  </div>
</template>
<script>
import BoxOffice from './common/boxOffice.js'
export default {
  mixins: [BoxOffice],
  data() {
    return {

    }
  }
};
</script>
