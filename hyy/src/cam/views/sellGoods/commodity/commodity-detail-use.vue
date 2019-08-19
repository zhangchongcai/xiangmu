<template>
  <div class="commodity-content-wrap">
    <div class="header-fixed" ref="headerFixed">
      <div class="time-wrap">
        <div class="time-item">
          <Authority-Name :orgType="orgType" :orgName="orgName"></Authority-Name>
        </div>
        <div class="time-item">
          <label class="label-title">
            时间选择：
            <calendar-view
              size="mini"
              v-model="time"
              format="yyyy-MM-dd"
              :dateType="dateType"
              :dateTypeActive="dateTypeActive"
              :dateTypeIndex="dateTypeIndex"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <label class="label-title">
             卖品名称：
          </label>
          <el-input style="display:inline-block;width:240px" v-model="commodityName" placeholder="请输入名称"></el-input>
        </div>
        <div class="time-item">
          <el-button type="primary" @click="search">查询</el-button>
          <div class="member-type">
            <el-checkbox v-model="memberType" @change="changeMemberType">仅会员</el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="section commodity-detail">
      <div class="shipment-left">
        <img :src="goodsInfo.skuImgUrl" alt="" v-if="goodsInfo.skuImgUrl">
        <img src="../../../assets/img/commobity-detail.png" alt="" v-else>
      </div>
      <div class="shipment-right">
        <div class="shipment-item">
          <div class="msg-bar">
            <span class="label">商品名称:</span>
            <span class="desp">{{goodsInfo.skuName}}</span>
          </div>
          <div class="msg-bar">
            <span class="label">商品ID:</span>
            <span class="desp">{{goodsInfo.skuCode}}</span>
          </div>
          <div class="msg-bar">
            <span class="label">商品品类:</span>
            <span class="desp">{{goodsInfo.categoryName}}</span>
          </div>
        </div>
        <div class="shipment-item">
          <div class="msg-bar">
            <span class="label">标准售价:</span>
            <span class="desp">{{goodsInfo.salePrice}}</span>
          </div>
          <div class="msg-bar">
            <span class="label">品牌:</span>
            <span class="desp">{{goodsInfo.brandName}}</span>
          </div>
          <div class="msg-bar">
            <span class="label">商品规格:</span>
            <span class="desp">{{goodsInfo.spec}}</span>
          </div>
        </div>
        <div class="shipment-item">
          <div class="msg-bar">
            <span class="label">采购方式:</span>
            <span class="desp">{{goodsInfo.purchaseModel}}</span>
          </div>
          <div class="msg-bar">
            <span class="label">存储方式:</span>
            <span class="desp">{{goodsInfo.storeMethod}}</span>
          </div>
          <div class="msg-bar">
            <span class="label">包装方式:</span>
            <span class="desp">{{goodsInfo.packageMethod}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
          指标概览
      </div>
      <div class="section-content">
        <div class="target-view" v-if="quotaList.length > 0">
          <div class="target-item" v-for="(itemList,inx) in quotaList" :key="inx">
            <div class="target-name">
              <span>{{itemList.label}}</span>
            </div>
            <div class="target-list">
              <div class="target-cell" v-for="(item,index) in itemList.list" :key="index">
                <div class="target-money">
                  <span>{{item.name}}</span>
                </div>
                <div class="target-middle">
                  <i class="iconfont" :class="icons[index]" :style="{color:iconColors[index]}"></i>
                  <span class="money-num">{{item.value | formatNum}}</span>
                  <span class="unit">{{item.name | formatTargetUnit(item.value)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div  class="target-view__empty" v-else>
          暂无数据
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        趋势图
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
            <el-table-column prop="dateKey" label="日期" min-width="80" fixed  key="dateKey"></el-table-column>
            <el-table-column prop="salesVolume" label="销售额(元)" min-width="120" fixed key="salesVolume">
              <template slot-scope="scope">{{scope.row.salesVolume | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="salesOrders" label="销售单量(单)" min-width="100"  key="salesOrders">
              <template slot-scope="scope">{{scope.row.salesOrders | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="salesCount" label="销售数量(件)" min-width="100"  key="salesCount">
              <template slot-scope="scope">{{scope.row.salesCount | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="客单价(元)" min-width="100" key="unitPrice">
              <template slot-scope="scope">{{scope.row.unitPrice | formatNull}}</template>
            </el-table-column>
            <el-table-column prop="piecePrice" label="件单价(元)" min-width="100" key="piecePrice">
              <template slot-scope="scope">{{scope.row.piecePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="unitCount" label="客单量(件/单)" min-width="110" key="unitCount">
              <template slot-scope="scope">{{scope.row.unitCount | formatNum}}</template>
            </el-table-column>
           
            <el-table-column prop="buyRate" label="购买率(%)" min-width="100" key="buyRate">
              <template slot-scope="scope">{{scope.row.buyRate | formatNum }}</template>
            </el-table-column>
            <el-table-column prop="sppPrice" label="人均卖品金额(元)" min-width="130" key="sppPrice">
              <template slot-scope="scope">{{scope.row.sppPrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="sellingCost" label="销售成本(元)" min-width="110" key="sellingCost">
              <template slot-scope="scope">{{scope.row.sellingCost | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="costPrice" label="成本价(元)" min-width="110" key="costPrice">
              <template slot-scope="scope">{{scope.row.costPrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="salesGrossProfit" label="销售毛利(元)" min-width="110" key="salesGrossProfit">
              <template slot-scope="scope">{{scope.row.salesGrossProfit | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="salesGrossProfitRate" label="销售毛利率(%)" min-width="120" key="salesGrossProfitRate">
              <template slot-scope="scope">{{scope.row.salesGrossProfitRate | formatNum }}</template>
            </el-table-column>
            <el-table-column prop="memberSalesVolumePercent" label="会员消费占比(%)" min-width="130" key="memberSalesVolumePercent">
              <template slot-scope="scope">{{scope.row.memberSalesVolumePercent | formatNum }}</template>
            </el-table-column>
            <el-table-column prop="setmealSalesVolumePercent" label="套餐消费占比(%)" min-width="130" key="setmealSalesVolumePercent">
              <template slot-scope="scope">{{scope.row.setmealSalesVolumePercent | formatNum }}</template>
            </el-table-column>
            <el-table-column prop="purchCount" label="采购数量(件)" min-width="110" key="purchCount">
              <template slot-scope="scope">{{scope.row.purchCount | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="purchAmount" label="采购成本(元)" min-width="110" key="purchAmount">
              <template slot-scope="scope">{{scope.row.purchAmount | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="avgPurchasePrice" label="平均采购价(元)" min-width="130" key="avgPurchasePrice">
              <template slot-scope="scope">{{scope.row.avgPurchasePrice | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="startInventory" label="期初库存数量(件)" min-width="130" key="startInventory">
              <template slot-scope="scope">{{scope.row.startInventory | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="startAmount" label="期初库存成本(元)" min-width="130" key="startAmount">
              <template slot-scope="scope">{{scope.row.startAmount | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="endInventory" label="期末库存数量(件)" min-width="130" key="endInventory">
              <template slot-scope="scope">{{scope.row.endInventory | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="endAmount" label="期末库存成本(元)" min-width="130" key="endAmount">
              <template slot-scope="scope">{{scope.row.endAmount | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="inventoryTurnoverDaysDay" label="库存数量周转天(天)" min-width="130" key="inventoryTurnoverDaysDay">
              <template slot-scope="scope">{{scope.row.inventoryTurnoverDaysDay | formatNum}}</template>
            </el-table-column>
            <el-table-column prop="inventoryTurnoverDaysAmount" label="库存金额周转天(天)" min-width="130" key="inventoryTurnoverDaysAmount">
              <template slot-scope="scope">{{scope.row.inventoryTurnoverDaysAmount | formatNum}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CommodityDetail from "./commodity-detail-use.js";
export default {
  mixins: [CommodityDetail],
  data() {
    return {};
  }
};
</script>
<style>
  /* .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  } */
</style>
