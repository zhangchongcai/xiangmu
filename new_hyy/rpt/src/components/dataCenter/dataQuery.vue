<template>
  <div ref="queryWrapper" class="data-query">
    <div class="datacenter-query clearfix" v-if="dataQueryObj.isHighShow">
      <ul class="datacenter-query-ul clearfix">
        <template v-for="(item,index) in baseQueryArr">
          <!-- dic_many -->
          <li v-if="item.controlType === 'DIC_MANY'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <dic-many :queryData="item" :dicManyObj="dicManyObj" :resetStatus="resetStatus"></dic-many>
            </div>
          </li>
          <!-- 支付状态 -->
          <li v-if="item.controlType === 'PAY_STATUS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <pay-status :resetStatus="resetStatus" :queryData="item"></pay-status>
            </div>
          </li>
          <!-- 销售单类型 -->
          <li v-if="item.controlType === 'SALES_TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <sales-ticket-type :resetStatus="resetStatus" :queryData="item"></sales-ticket-type>
            </div>
          </li>
          <!-- 活动选择 -->
          <li v-if="item.controlType === 'ACTIVITY_SELECT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <activity :resetStatus="resetStatus" :queryData="item"></activity>
            </div>
          </li>
          <!-- 票类控件 -->
          <li v-if="item.controlType === 'TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <ticket-type :cinemaUid="dataQueryObj.cenimaUid" :resetStatus="resetStatus" :controllerObj="controllerObj" :queryData="item"></ticket-type>
            </div>
          </li>
          <!-- 套餐商品 -->
          <li v-if="item.controlType === 'COMBO_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <combo-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></combo-goods>
            </div>
          </li>
          <!-- 套餐子商品 -->
          <li v-if="item.controlType === 'SON_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <son-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></son-goods>
            </div>
          </li>
          <!-- 取货状态 -->
          <li v-if="item.controlType === 'DIC'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <dic :queryData="item" :resetStatus="resetStatus"></dic>
            </div>
          </li>
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <warehouse :queryData="item" :resetStatus="resetStatus" :warehouseObj="warehouseObj" :cenimaUid="dataQueryObj.cenimaUid" @selectWarehouseData="getWarehouseData"></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf :goodsShelfObj="goodsShelfObj" :resetStatus="resetStatus" :cenimaUid="dataQueryObj.cenimaUid" @selectGoodsShelfData="getGoodsShelfData"></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <data-input :dataInputObj="dataInputObj" :resetStatus="resetStatus" :queryData="item" @inputValueChange="inputValueChange"></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <month-select :monthSelectObj="monthSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectMonthData="getMonthData"></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <date-select :dateSelectObj="dateSelectObj" :queryData="item" :resetStatus="resetStatus" @selectDateData="getDateData"></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && reportCode !== 'T05'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <date-time-select :dateTimeSelectObj="dateTimeSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectDateTimeData="getDateTimeData"></date-time-select>
          </li>
          <!-- T05交易时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && item.queryColKey ==='transaction_date' && reportCode === 'T05'" :key="`transaction_date_${index}`" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <transaction-date :queryName="item.queryName" :transactionDateObj="transactionDateObj" :resetStatus="resetStatus" @selectTransactionDateDate="getTransactionDateDate"></transaction-date>
          </li>
          <!-- T05放映时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && item.queryColKey ==='show_time' && reportCode === 'T05'" :key="`show_time_${index}`" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <show-time :showTimeObj="showTimeObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectShowTimeData="getShowTimeData"></show-time>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <time-select :timeSelectObj="timeSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectTimeData="getTimeData"></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order :resetStatus="resetStatus" :transactionOderObj="transactionOderObj" @selectTransactionOrderData="getTransactionOrderData"></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <deal-type :dealTypeObj="dealTypeObj" :resetStatus="resetStatus" @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <hall-type :hallTypeObj="hallTypeObj" :resetStatus="resetStatus" @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 影厅 -->
          <li v-if="item.controlType === 'HALL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <hall :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item" :cinemaUid="dataQueryObj.cenimaUid"></hall>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <channel :channelObj="channelObj" :resetStatus="resetStatus" @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 单选影院 -->
          <!-- <li v-if="item.controlType === 'CINEMA_TREE' && reportCode == 'T05'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <single-cinema :multiCinemaObj="multiCinemaObj" :resetStatus="resetStatus" @selectSingleCinemaData="getSingleCinemaData"></single-cinema>
            </div>
          </li>-->
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema :multiCinemaObj="multiCinemaObj" :resetStatus="resetStatus" :queryData="item" :multiCinemaLoading="multiCinemaLoading" @selectMultiCinemaData="getMultiCinemaData" @setMultiCinemaLoading="setMultiCinemaLoading"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <member-class :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version :movieReleasedVersionObj="movieReleasedVersionObj" :resetStatus="resetStatus" @selectmovieReleasedVersionData="getmovieReleasedVersionData"></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie-type :movieTypeObj="movieTypeObj" :resetStatus="resetStatus" :selectValue="item" @selectMovieTypeData="getMovieTypeData"></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <agent :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item"></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item"></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <pay-type :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item" @handlePayTypeValue="handlePayTypeValue"></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <sale-type :saleTypeObj="saleTypeObj" :resetStatus="resetStatus" @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <tran-user :resetStatus="resetStatus" :controllerObj="controllerObj" :queryData="item"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-class :merClassObj="merClassObj" :resetStatus="resetStatus" @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-type :merTypeObj="merTypeObj" :resetStatus="resetStatus" @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :merClassUid="dataQueryObj.merClassUid" :queryData="item"></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <combo-son-goods :comboSonGoodsObj="comboSonGoodsObj" :queryName="item.queryName" @selectComboSonGoodsData="getComboSonGoodsData"></combo-son-goods>
          </li>
        </template>
        <!-- 更多 -->
        <li class="more">
          <!-- <el-checkbox v-model="paydetails" name="paydetails1">展示支付明细</el-checkbox> -->
          <button class="search-button" @click="getTableValue">查询</button>
          <button class="reset-button" @click="resetClick">重置</button>
          <span class="GJBtn DC666" @click="conditionShow">
            <span>高级筛选</span>
            <i class="el-icon-arrow-down DC-icon-left"></i>
          </span>
        </li>
      </ul>
    </div>
    <div class="datacenter-query clearfix" v-else>
      <!-- 基本条件筛选排列区 -->
      <ul class="datacenter-query-ul clearfix">
        <template v-for="(item,index) in baseQueryArr">
          <!-- dic_many -->
          <li v-if="item.controlType === 'DIC_MANY'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <dic-many :queryData="item" :dicManyObj="dicManyObj" :resetStatus="resetStatus"></dic-many>
            </div>
          </li>
          <!-- 支付状态 -->
          <li v-if="item.controlType === 'PAY_STATUS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <pay-status :resetStatus="resetStatus" :queryData="item"></pay-status>
            </div>
          </li>
          <!-- 销售单类型 -->
          <li v-if="item.controlType === 'SALES_TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <sales-ticket-type :resetStatus="resetStatus" :queryData="item"></sales-ticket-type>
            </div>
          </li>
          <!-- 活动选择 -->
          <li v-if="item.controlType === 'ACTIVITY_SELECT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <activity :resetStatus="resetStatus" :queryData="item"></activity>
            </div>
          </li>
          <!-- 票类控件 -->
          <li v-if="item.controlType === 'TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <ticket-type :cinemaUid="dataQueryObj.cenimaUid" :resetStatus="resetStatus" :controllerObj="controllerObj" :queryData="item"></ticket-type>
            </div>
          </li>
          <!-- 套餐商品 -->
          <li v-if="item.controlType === 'COMBO_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <combo-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></combo-goods>
            </div>
          </li>
          <!-- 套餐子商品 -->
          <li v-if="item.controlType === 'SON_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <son-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></son-goods>
            </div>
          </li>
          <!-- 取货状态 -->
          <li v-if="item.controlType === 'DIC'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <dic :queryData="item" :resetStatus="resetStatus"></dic>
            </div>
          </li>
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <warehouse :queryData="item" :resetStatus="resetStatus" :warehouseObj="warehouseObj" :cenimaUid="dataQueryObj.cenimaUid" @selectWarehouseData="getWarehouseData"></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf :goodsShelfObj="goodsShelfObj" :resetStatus="resetStatus" :cenimaUid="dataQueryObj.cenimaUid" @selectGoodsShelfData="getGoodsShelfData"></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <data-input :dataInputObj="dataInputObj" :resetStatus="resetStatus" :queryData="item" @inputValueChange="inputValueChange"></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <month-select :monthSelectObj="monthSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectMonthData="getMonthData"></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <date-select :dateSelectObj="dateSelectObj" :queryData="item" :resetStatus="resetStatus" @selectDateData="getDateData"></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && reportCode !== 'T05'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <date-time-select :dateTimeSelectObj="dateTimeSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectDateTimeData="getDateTimeData"></date-time-select>
          </li>
          <!-- T05交易时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && item.queryColKey ==='transaction_date' && reportCode === 'T05'" :key="`transaction_date_${index}`" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <transaction-date :queryName="item.queryName" :transactionDateObj="transactionDateObj" :resetStatus="resetStatus" @selectTransactionDateDate="getTransactionDateDate"></transaction-date>
          </li>
          <!-- T05放映时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && item.queryColKey ==='show_time' && reportCode === 'T05'" :key="`show_time_${index}`" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <show-time :showTimeObj="showTimeObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectShowTimeData="getShowTimeData"></show-time>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <time-select :timeSelectObj="timeSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectTimeData="getTimeData"></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order :resetStatus="resetStatus" :transactionOderObj="transactionOderObj" @selectTransactionOrderData="getTransactionOrderData"></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <deal-type :dealTypeObj="dealTypeObj" :resetStatus="resetStatus" @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <hall-type :hallTypeObj="hallTypeObj" :resetStatus="resetStatus" @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 影厅 -->
          <li v-if="item.controlType === 'HALL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <hall :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item" :cinemaUid="dataQueryObj.cenimaUid"></hall>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <channel :channelObj="channelObj" :resetStatus="resetStatus" @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 单选影院 -->
          <!-- <li v-if="item.controlType === 'CINEMA_TREE' && reportCode == 'T05'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <single-cinema :multiCinemaObj="multiCinemaObj" :resetStatus="resetStatus" @selectSingleCinemaData="getSingleCinemaData"></single-cinema>
            </div>
          </li>-->
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema :multiCinemaObj="multiCinemaObj" :resetStatus="resetStatus" :queryData="item" :multiCinemaLoading="multiCinemaLoading" @selectMultiCinemaData="getMultiCinemaData" @setMultiCinemaLoading="setMultiCinemaLoading"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <member-class :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version :movieReleasedVersionObj="movieReleasedVersionObj" :resetStatus="resetStatus" @selectmovieReleasedVersionData="getmovieReleasedVersionData"></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie-type :movieTypeObj="movieTypeObj" :resetStatus="resetStatus" :selectValue="item" @selectMovieTypeData="getMovieTypeData"></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <agent :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item"></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item"></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <pay-type :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item" @handlePayTypeValue="handlePayTypeValue"></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <sale-type :saleTypeObj="saleTypeObj" :resetStatus="resetStatus" @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <tran-user :resetStatus="resetStatus" :controllerObj="controllerObj" :queryData="item"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-class :merClassObj="merClassObj" :resetStatus="resetStatus" @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-type :merTypeObj="merTypeObj" :resetStatus="resetStatus" @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :merClassUid="dataQueryObj.merClassUid" :queryData="item"></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <combo-son-goods :comboSonGoodsObj="comboSonGoodsObj" :queryName="item.queryName" @selectComboSonGoodsData="getComboSonGoodsData"></combo-son-goods>
          </li>
        </template>
        <li class="more">
          <span class="GJBtn DC666" @click="conditionDide">
            收起
            <i class="el-icon-arrow-up DC-icon-left"></i>
          </span>
        </li>
      </ul>

      <!-- 拓展条件筛选框排列区 -->
      <ul class="datacenter-query-ul datacenter-query-ul--active">
        <template v-for="(item,index) in styleExtQueryArr">
          <!-- dic_many -->
          <li v-if="item.controlType === 'DIC_MANY'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <dic-many :queryData="item" :dicManyObj="dicManyObj" :resetStatus="resetStatus"></dic-many>
            </div>
          </li>
          <!-- 支付状态 -->
          <li v-if="item.controlType === 'PAY_STATUS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <pay-status :resetStatus="resetStatus" :queryData="item"></pay-status>
            </div>
          </li>
          <!-- 销售单类型 -->
          <li v-if="item.controlType === 'SALES_TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <sales-ticket-type :resetStatus="resetStatus" :queryData="item"></sales-ticket-type>
            </div>
          </li>
          <!-- 活动选择 -->
          <li v-if="item.controlType === 'ACTIVITY_SELECT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <activity :resetStatus="resetStatus" :queryData="item"></activity>
            </div>
          </li>
          <!-- 票类控件 -->
          <li v-if="item.controlType === 'TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <ticket-type :cinemaUid="dataQueryObj.cenimaUid" :resetStatus="resetStatus" :controllerObj="controllerObj" :queryData="item"></ticket-type>
            </div>
          </li>
          <!-- 套餐商品 -->
          <li v-if="item.controlType === 'COMBO_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <combo-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></combo-goods>
            </div>
          </li>
          <!-- 套餐子商品 -->
          <li v-if="item.controlType === 'SON_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <son-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></son-goods>
            </div>
          </li>
          <!-- 取货状态 -->
          <li v-if="item.controlType === 'DIC'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <dic :queryData="item" :resetStatus="resetStatus"></dic>
            </div>
          </li>
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <warehouse :queryData="item" :resetStatus="resetStatus" :warehouseObj="warehouseObj" :cenimaUid="dataQueryObj.cenimaUid" @selectWarehouseData="getWarehouseData"></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf :goodsShelfObj="goodsShelfObj" :resetStatus="resetStatus" :cenimaUid="dataQueryObj.cenimaUid" @selectGoodsShelfData="getGoodsShelfData"></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <data-input :dataInputObj="dataInputObj" :resetStatus="resetStatus" :queryData="item" @inputValueChange="inputValueChange"></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <month-select :monthSelectObj="monthSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectMonthData="getMonthData"></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <date-select :dateSelectObj="dateSelectObj" :queryData="item" :resetStatus="resetStatus" @selectDateData="getDateData"></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && reportCode !== 'T05'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <date-time-select :dateTimeSelectObj="dateTimeSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectDateTimeData="getDateTimeData"></date-time-select>
          </li>
          <!-- T05交易时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && item.queryColKey ==='transaction_date' && reportCode === 'T05'" :key="`transaction_date_${index}`" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <transaction-date :queryName="item.queryName" :transactionDateObj="transactionDateObj" :resetStatus="resetStatus" @selectTransactionDateDate="getTransactionDateDate"></transaction-date>
          </li>
          <!-- T05放映时间控件 -->
          <li v-if="item.controlType === 'DATETIME' && item.queryColKey ==='show_time' && reportCode === 'T05'" :key="`show_time_${index}`" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <show-time :showTimeObj="showTimeObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectShowTimeData="getShowTimeData"></show-time>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <time-select :timeSelectObj="timeSelectObj" :queryName="item.queryName" :resetStatus="resetStatus" @selectTimeData="getTimeData"></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order :resetStatus="resetStatus" :transactionOderObj="transactionOderObj" @selectTransactionOrderData="getTransactionOrderData"></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <deal-type :dealTypeObj="dealTypeObj" :resetStatus="resetStatus" @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <hall-type :hallTypeObj="hallTypeObj" :resetStatus="resetStatus" @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 影厅 -->
          <li v-if="item.controlType === 'HALL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <hall :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item" :cinemaUid="dataQueryObj.cenimaUid"></hall>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <channel :channelObj="channelObj" :resetStatus="resetStatus" @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 单选影院 -->
          <!-- <li v-if="item.controlType === 'CINEMA_TREE' && reportCode == 'T05'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <single-cinema :multiCinemaObj="multiCinemaObj" :resetStatus="resetStatus" @selectSingleCinemaData="getSingleCinemaData"></single-cinema>
            </div>
          </li>-->
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema :multiCinemaObj="multiCinemaObj" :resetStatus="resetStatus" :queryData="item" :multiCinemaLoading="multiCinemaLoading" @selectMultiCinemaData="getMultiCinemaData" @setMultiCinemaLoading="setMultiCinemaLoading"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <member-class :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version :movieReleasedVersionObj="movieReleasedVersionObj" :resetStatus="resetStatus" @selectmovieReleasedVersionData="getmovieReleasedVersionData"></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie-type :movieTypeObj="movieTypeObj" :resetStatus="resetStatus" :selectValue="item" @selectMovieTypeData="getMovieTypeData"></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <agent :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item"></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item"></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <movie :controllerObj="controllerObj" :resetStatus="resetStatus" :queryData="item"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <pay-type :resetStatus="resetStatus" :cinemaUid="dataQueryObj.cenimaUid" :controllerObj="controllerObj" :queryData="item" @handlePayTypeValue="handlePayTypeValue"></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <sale-type :saleTypeObj="saleTypeObj" :resetStatus="resetStatus" @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <tran-user :resetStatus="resetStatus" :controllerObj="controllerObj" :queryData="item"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-class :merClassObj="merClassObj" :resetStatus="resetStatus" @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-type :merTypeObj="merTypeObj" :resetStatus="resetStatus" @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + " :" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods :controllerObj="controllerObj" :resetStatus="resetStatus" :merClassUid="dataQueryObj.merClassUid" :queryData="item"></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <combo-son-goods :comboSonGoodsObj="comboSonGoodsObj" :queryName="item.queryName" @selectComboSonGoodsData="getComboSonGoodsData"></combo-son-goods>
          </li>
        </template>
      </ul>

      <!-- 按钮排列区 -->
      <ul class="datacenter-query-ul">
        <li class="more">
          <!-- <el-checkbox v-model="checked">展示支付明细</el-checkbox> -->
          <button class="search-button" @click="getTableValue">查询</button>
          <button class="reset-button" @click="resetClick">重置</button>
          <button class="normal-button" @click="setCommonBtn">设置常用条件</button>
        </li>
      </ul>
    </div>

    <!-- 常用条件弹框区域 -->
    <my-dialog :title="'常用条件'" :isShow="isDialogShow" :dialogWidth="1016" :dialogHeight="576" :marginTop="0" :marginBottom="1" @handleBtnComfirmClick="setQdBtn" @handleBtnCancelClick="setDeBtn" @close="closeCCDialog">
      <div slot="dialog-content">
        <div class="common-box">
          <!-- <div class="commonbox-query-tips">拖动排序筛选顺序</div> -->
          <ul class="common-box-query1">
            <draggable v-model="dataQueryObj.showQueryArr" :options="{group:'people'}" @start="drag=true" @end="drag=false" :move="dragMove">
              <li class="commonbox-query-coment" v-for="(element,index) in dataQueryObj.showQueryArr" :key="index">{{ element.queryName }}</li>
            </draggable>
          </ul>
          <div class="commonbox-query-tips">将不需要的条件拖到此处</div>
          <ul class="common-box-query2">
            <draggable v-model="dataQueryObj.hideQueryArr" :options="{group:'people'}" @start="drag=true" @end="drag=false">
              <li class="commonbox-query-coment" v-for="(element, index) in dataQueryObj.hideQueryArr" :key="index">{{ element.queryName }}</li>
            </draggable>
          </ul>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script type="text/javascript">
import Draggable from 'vuedraggable';
import DateSelect from './controllers/dateSelect';
import MonthSelect from './controllers/monthSelect';
import DateTimeSelect from './controllers/dateTimeSelect';
import ShowTime from './controllers/showTime';
import TransactionDate from './controllers/transactionDate';
import timeSelect from './controllers/timeSelect';
import ComboSonGoods from './controllers/comboSonGoods';
import datacenterBus from 'rptSrc/util/datacenterBus.js';
import DataInput from './controllers/dataInput';
import MyDialog from './dataCommon/myDialog';
import TransactionChannel from './controllers/transactionChannel';
import Agent from './controllers/agent';
import TransactionOrder from './controllers/transactionOder';
import PayType from './controllers/payType';
import DealType from './controllers/dealType';
import SaleType from './controllers/saleType';
import Channel from './controllers/channel';
import HallType from './controllers/hallType';
import TranUser from './controllers/tranUser';
import Movie from './controllers/movie';
import MultiCinema from './controllers/multiCinema';
import singleCinema from './controllers/singleCinema';
import MerClass from './controllers/merClass';
import MerType from './controllers/merType';
import MerGoods from './controllers/merGoods';
import MemberClass from './controllers/memberClass';
import MovieType from './controllers/movieType';
import MovieReleasedVersion from './controllers/movieReleasedVersion';
import Warehouse from './controllers/warehouse';
import GoodsShelf from './controllers/goodsShelf';
import Dic from './controllers/dic';
import DicMany from './controllers/dicMany';
import ComboGoods from './controllers/comboGoods';
import SonGoods from './controllers/sonGoods';
import Hall from './controllers/hall';
import TicketType from './controllers/ticketType';
import dateSelectVue from './controllers/dateSelect';
import Activity from './controllers/activity';
import SalesTicketType from './controllers/salesTicketType';
import PayStatus from './controllers/payStatus';
import { mapState } from 'vuex';
import { filterFunc, messageAlertFunc } from 'rptSrc/util/commonFunc.js';

function app (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].seq = i + 1;
  }
  return arr;
}
export default {
  props: {
    // 报表名称
    reportName: String,
    //
    tableName: String,
    // 基础查询
    baseQueryArr: Array,
    // 扩展查询
    extQueryArr: Array,
    styleExtQueryArr: Array,
    // 表头
    colArr: Array,
    styleColArr: Array,
    initStyleColArr: Array,
    tableStyleColArr: Array,
    payTypeDataArr: Array,
    groupArr: Array,
    styleGroupArr: Array,
    reportCode: String,
    Pagination: Object,
    searchClickStatus: Boolean,
    automaticSearchStatus: Number,
    orderCol: String,
    dataQueryObj: Object,
    channelObj: Object,
    comboSonGoodsObj: Object,
    dataInputObj: Object,
    dateSelectObj: Object,
    dateTimeSelectObj: Object,
    dealTypeObj: Object,
    dicObj: Object,
    dicManyObj: Object,
    goodsShelfObj: Object,
    hallTypeObj: Object,
    merClassObj: Object,
    merTypeObj: Object,
    monthSelectObj: Object,
    movieReleasedVersionObj: Object,
    movieTypeObj: Object,
    multiCinemaObj: Object,
    saleTypeObj: Object,
    showTimeObj: Object,
    timeSelectObj: Object,
    transactionDateObj: Object,
    transactionOderObj: Object,
    warehouseObj: Object,
    activityObj: Object,
    mergeTableObj: Object,
    controllerObj: Object,
    dataBtnObj: Object
  },
  components: {
    DateSelect,
    MonthSelect,
    DateTimeSelect,
    TransactionDate,
    ShowTime,
    Draggable,
    ComboSonGoods,
    DataInput,
    MyDialog,
    TransactionChannel,
    TransactionOrder,
    PayType,
    DealType,
    SaleType,
    Channel,
    HallType,
    TranUser,
    MultiCinema,
    singleCinema,
    Movie,
    MerClass,
    MerType,
    MerGoods,
    MemberClass,
    MovieReleasedVersion,
    MovieType,
    Agent,
    timeSelect,
    Warehouse,
    GoodsShelf,
    Dic,
    DicMany,
    ComboGoods,
    SonGoods,
    Hall,
    TicketType,
    Activity,
    SalesTicketType,
    PayStatus
  },
  data () {
    return {
      isDialogShow: false, // 是否显示自定义扩展条件
      tempShowQueryArr: [], // 临时存放，要显示的扩展条件
      tempHideQueryArr: [], // 临时存放，不显示的扩展条件
      // 是否查询表格数据
      getDataStatus: false,
      // 是否重置
      resetStatus: false,
      multiCinemaLoading: false
    };
  },
  computed: mapState({
    clearTableData: state => state.rpt.clearTableData,
    isClear: state => state.rpt.isClear,
    colData: state => state.rpt.colData,
    isSent: state => state.rpt.isSent,
    storeColArr: state => state.rpt.colArr,
    isSetTableHeader: state => state.rpt.isSetTableHeader,
    isTableMouted: state => state.rpt.isTableMouted
  }),
  methods: {
    // 重置细节处理
    resetDetail (element) {
      if (
        element.controlType === 'TIME' ||
        element.controlType === 'DATETIME' ||
        element.controlType === 'MONTH' ||
        element.controlType === 'DATE'
      ) {
        this.resetStatus = true;
        setTimeout(() => {
          this.resetStatus = false;
        }, 500);
      } else {
        element.queryColValue = '';
        this.resetStatus = true;
        setTimeout(() => {
          this.resetStatus = false;
        }, 500);
      }

      if (this.automaticSearchStatus !== 2) {
        this.$message({
          message: '重置成功！',
          iconClass: 'iconfont icon-danchuang-wancheng',
          customClass: 'rpt-alert-message',
          center: 'true'
        });
      }
    },
    // 点击重置
    resetClick () {
      this.baseQueryArr.forEach(element => {
        this.resetDetail(element);
      });

      this.styleExtQueryArr.forEach(element => {
        this.resetDetail(element);
      });
    },
    setMultiCinemaLoading (data) {
      this.multiCinemaLoading = data;
    },
    inputChange (val) {
      let textArr = this.styleExtQueryArr.filter(element => {
        return element.controlType == 'CHECKBOX';
      });
    },
    changeSelectData (data) {
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (this.styleExtQueryArr[i].queryName == data.queryName) {
          this.styleExtQueryArr[i] = JSON.parse(JSON.stringify(data));
        }
      }
      this.$forceUpdate();
    },
    // 遍历基础查询和拓展查询数据并匹配查询数据
    getQueryData (data, controlType) {
      for (let i = 0; i < this.baseQueryArr.length; i++) {
        if (this.baseQueryArr[i].queryControlKey === controlType) {
          this.baseQueryArr[i].queryColValue = data;
        }
      }
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (this.styleExtQueryArr[i].queryControlKey === controlType) {
          this.styleExtQueryArr[i].queryColValue = data;
        }
      }
      this.$forceUpdate();
    },
    // 时间、复选框相关控件数据
    getComplexQueryData (data, queryName, controlType) {
      for (let i = 0; i < this.baseQueryArr.length; i++) {
        if (
          this.baseQueryArr[i].queryControlKey === controlType &&
          this.baseQueryArr[i].queryName === queryName
        ) {
          this.baseQueryArr[i].queryColValue = data;
        }
      }
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (
          this.styleExtQueryArr[i].queryControlKey === controlType &&
          this.styleExtQueryArr[i].queryName === queryName
        ) {
          this.styleExtQueryArr[i].queryColValue = data;
        }
      }
      this.$forceUpdate();
    },
    // 文本输入框控件
    inputValueChange (val) {
      this.baseQueryArr.forEach(element => {
        if (element.queryName === val.queryName) {
          element.queryColValue = val.queryColValue;
        }
      });
      this.styleExtQueryArr.forEach(element => {
        if (element.queryColKey === val.queryColKey) {
          element.queryColValue = val.queryColValue;
        }
      });
    },
    // 传递交易类型控件所选数据
    getDealTypeData (data) {
      this.getQueryData(data, 'deal_type');
    },
    // 传递销售类型控件所选数据
    getSaleTypeData (data) {
      this.getQueryData(data, 'sale_type');
    },
    // 传递渠道控件所选数据
    getChannelData (data) {
      this.getQueryData(data, 'channel');
    },
    // 传递影厅类型控件所选数据
    getHallTypeData (data) {
      this.getQueryData(data, 'hall_type');
    },
    // 传递多选影院控件所选数据
    getMultiCinemaData (data, queryName) {
      this.dataQueryObj.cenimaUid = data;
      this.getComplexQueryData(data, queryName, 'cinema_tree');
    },
    // 传递商品类型控件所选数据
    getMerTypeData (data) {
      this.dataQueryObj.merTypeUid = data;
      this.getQueryData(data, 'mer_type');
    },
    // 传递商品类别控件所选数据
    getMerClassData (data) {
      this.dataQueryObj.merClassUid = data;
      this.getQueryData(data, 'mer_class');
    },
    // 传递交易单控件所选数据
    getTransactionOrderData (data) {
      this.getQueryData(data, 'transaction_order_type');
    },
    // 传递影片类型控件所选数据
    getMovieTypeData (data) {
      this.getQueryData(data, 'movie_type');
    },
    // 传递发行版本控件所选数据
    getmovieReleasedVersionData (data) {
      this.getQueryData(data, 'movie_released_version');
    },
    // 月份选择控件开始月份
    getMonthData (data, queryName) {
      this.getComplexQueryData(data, queryName, 'month');
    },
    // 精确时间控件
    getDateTimeData (data, queryName) {
      this.getComplexQueryData(data, queryName, 'datetime');
    },
    // T05放映时间控件
    getShowTimeData (data, queryName) {
      this.getComplexQueryData(data, queryName, 'datetime');
    },
    // T05交易时间控件
    getTransactionDateDate (data, queryName) {
      this.getComplexQueryData(data, queryName, 'datetime');
    },
    // 时间控件
    getTimeData (data, queryName) {
      this.getComplexQueryData(data, queryName, 'time');
    },
    // 日期控件
    getDateData (data, queryName) {
      this.getComplexQueryData(data, queryName, 'date');
    },
    // 仓库控件
    getWarehouseData (data) {
      this.getQueryData(data, 'warehouse');
    },
    // 货架控件
    getGoodsShelfData (data) {
      this.getQueryData(data, 'goods_shelf');
    },
    // 套餐拆分成子商品
    getComboSonGoodsData (data, queryName) {
      this.getComplexQueryData(data, queryName, 'check_sing');
    },
    // 支付方式
    handlePayTypeValue (data) {
      this.dataQueryObj.payTypeValueArr = data;
    },
    dragMove (evt) { },
    conditionShow: function () {
      this.dataQueryObj.isHighShow = false;
    },
    conditionDide: function () {
      this.dataQueryObj.isHighShow = true;
    },
    // 关闭自定义查询条件窗口事件
    closeCCDialog: function () {
      // 还原条件
      this.dataQueryObj.showQueryArr = this.tempShowQueryArr;
      this.dataQueryObj.hideQueryArr = this.tempHideQueryArr;
      this.isDialogShow = false;
    },
    // 确定按钮触发事件
    setQdBtn: function () {
      // 向父级传值
      this.$emit(
        'CcArrEvent',
        app(this.dataQueryObj.showQueryArr),
        app(this.dataQueryObj.hideQueryArr)
      );
      // 修改临时存放的值
      this.tempShowQueryArr = this.dataQueryObj.showQueryArr;
      this.tempHideQueryArr = this.dataQueryObj.hideQueryArr;
      // 改变窗口显示状态
      this.isDialogShow = false;
      // this.dataQueryObj.showQueryArr
    },
    // 取消按钮触发事件
    setDeBtn: function () {
      this.isDialogShow = false;
    },
    // 点击设置常用条件按钮触发事件
    setCommonBtn: function () {
      // 初始化窗口中显示和不显示的扩展条件数组
      this.dataQueryObj.showQueryArr = this.styleExtQueryArr;
      this.dataQueryObj.hideQueryArr = this.extQueryArr;
      // 保存原始值
      this.tempShowQueryArr = this.dataQueryObj.showQueryArr;
      this.tempHideQueryArr = this.dataQueryObj.hideQueryArr;
      // 改变窗口显示状态
      this.isDialogShow = true;
    },
    messageDialog (message) {
      this.$message({
        message: message,
        iconClass: 'iconfont icon-danchuang-jingtanhao',
        customClass: 'rpt-alert-message',
        center: 'true'
      });
      throw message;
    },
    // 获取表格内容
    getTableValue (value) {
      let queryArr;
      let styleColList = [];
      let colDataArr = [];
      // 处理支付方式查询信息
      if (this.reportCode == 'T050000000000') {
        // 支付方式控件是否选择
        if (
          this.dataQueryObj.payTypeValueArr.length !== 0
        ) {
          let deleteIndex = [];
          let usefulPaytypeItem = [];
          // 不包含支付方式的表头数据
          styleColList = this.initStyleColArr.filter(element => {
            return element.colKey.indexOf('pay_type_') == -1;
          });
          // 只有支付方式的表头数据
          this.initStyleColArr.forEach((element, index) => {
            if (element.colKey.indexOf('pay_type_') > -1) {
              deleteIndex.push(index);
            }
          });
          // 支付方式表头数据
          let payTypeItem = this.initStyleColArr.filter(
            element => element.colKey.indexOf('pay_type_') != -1
          );
          // 与支付方式控件匹配的支付表头数据
          payTypeItem.forEach(element1 => {
            this.dataQueryObj.payTypeValueArr.forEach(element2 => {
              if (element1.colName == element2) {
                usefulPaytypeItem.push(element1);
              }
            });
          });
          // 拼接最终的表头数据
          usefulPaytypeItem.forEach(element => {
            styleColList.splice(deleteIndex[0], 0, element);
          });
        }

        //  向后端传送的表头数据
        if (this.isSetTableHeader === true) {
          colDataArr = this.storeColArr;
          this.$store.commit('setIsSetTableHeader');
        } else {
          if (this.dataQueryObj.payTypeValueArr.length !== 0) {
            colDataArr = styleColList;
          } else {
            colDataArr = this.initStyleColArr;
          }
        }
        this.$emit('sendStyleColArr', colDataArr);
      }
      colDataArr.length == 0
        ? this.$emit('sendStyleColArr', this.tableStyleColArr)
        : styleColList;
      // 拼接基础查询和扩展查询
      if (this.dataQueryObj.searchData.length != 0) {
        value = JSON.parse(JSON.stringify(this.dataQueryObj.searchData));
      }
      if (value && value.length > 0) {
        queryArr = value;
      } else {
        queryArr = this.baseQueryArr;
      }
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
      }

      messageAlertFunc(this, queryArr);

      // 导出功能的数据
      this.dataBtnObj.queryStoreData = JSON.parse(JSON.stringify(queryArr));

      datacenterBus.$emit('visibleEvent', false);
      datacenterBus.$emit('setScrollStatus', false);
      datacenterBus.$emit('tableLoading');
      this.getDataStatus = true;
      this.$store.commit('setIsFilted', true);

      if (
        this.mergeTableObj.isMerged == true &&
        this.styleGroupArr.length > 0
      ) {
        this.$store.commit('getMergeTableData', true);
      } else {
        // 如果没有分组，就是明细查询
        if (this.styleGroupArr.length === 0) {
          // 声明参数
          let param = {
            summaryFlag: 1,
            reportTableInfo: {
              reportCode: this.reportCode,
              queryArr: queryArr,
              tableName: this.tableName,
              colArr:
                colDataArr.length == 0 ? this.tableStyleColArr : colDataArr,
              orderArr: [
                {
                  colKey: this.orderCol === '' ? null : this.orderCol,
                  orderDesc: 'DESC'
                }
              ]
            },
            pagingInfo: {
              startIndex: 1,
              rows: this.Pagination.pagesize
            }
          };
          // 调用api，展示表格内容
          this.$rptList
            .showReportData(param)
            .then(data => {
              const tableData = JSON.parse(data.data);
              this.$emit('tableDataArrEventNoGroup', tableData);
              this.$store.commit('getUpdateTime', tableData.adsUpdateTime);
            })
            .catch(msg => {
              console.log(msg);
            });
        } else {
          // 有分组，分组查询
          // 声明参数
          let param = {
            summaryFlag: 1,
            groupFlag: 1,
            firstQueryFlag: 1,
            reportTableInfo: {
              reportCode: this.reportCode,
              queryArr: queryArr,
              tableName: this.tableName,
              colArr:
                colDataArr.length == 0 ? this.tableStyleColArr : colDataArr,
              // colArr: colDataArr,
              groupArr: this.styleGroupArr,
              orderArr: [
                {
                  colKey: this.orderCol === '' ? null : this.orderCol,
                  orderDesc: 'DESC'
                }
              ]
            }
          };
          // 调用api，展示表格内容
          this.$rptList
            .showReportData(param)
            .then(data => {
              const tableData = JSON.parse(data.data);

              this.$emit('tableDataArrEventYesGroup', tableData);
            })
            .catch(msg => {
              console.log(msg);
            });
        }
      }
    }
  },
  watch: {
    styleExtQueryArr: function (newVal, oldVal) {
      this.styleExtQueryArr = newVal;
    },
    searchClickStatus (newVal, oldVal) {
      if (newVal) {
        this.$emit('setSearchStatus');
        setTimeout(() => {
          this.getTableValue();
        }, 100);
      }
    },
    automaticSearchStatus (newVal, oldVal) {
      if (newVal === 2) {
        this.getTableValue();
      }
    },
    isClear (newVal, oldVal) {
      if (newVal) {
        for (let i = 0; i < this.dataQueryObj.searchData.length; i++) {
          if (
            this.dataQueryObj.searchData[i].queryColKey ===
            this.clearTableData.queryColKey &&
            this.dataQueryObj.searchData[i].queryColValue ===
            this.clearTableData.queryColValue
          ) {
            this.dataQueryObj.searchData.splice(i, 1);
          }
        }
        this.getTableValue(this.dataQueryObj.searchData);
        this.$store.commit('resetIsClear', false);
        // datacenterBus.$emit("sendSearch", this.dataQueryObj.searchData);
      }
    },
    isSent (newVal, oldVal) {
      if (newVal) {
        let data = filterFunc(this.colData, this.baseQueryArr);
        this.dataQueryObj.searchData = data;
        this.getTableValue(data);
        this.$store.commit('resetIsSent');
      }
    }
    // styleGroupArr: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal, oldVal);
    //     if (this.isTableMouted === false) {
    //       this.getTableValue();
    //     }
    //     if (this.isTableMouted === true) this.$store.commit("setTableMountedStatus", false);
    //   }
    // }
  }
};
</script>

<style lang="scss">
//浮层提示框样式
.rpt-alert-message {
  display: flex;
  justify-content: center;
  align-items: center;
  // position: absolute;
  // top: calc(50% - 24px);
  min-width: 192px;
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
  border: none;
  .icon-danchuang-wancheng,
  .icon-danchuang-jingtanhao {
    color: #ffffff;
    font-size: 16px;
    line-height: 48px;
    margin-right: 10px;
  }
  .el-message__content {
    // font-family: "MicrosoftYaHei";
    font-size: 16px;
  }
}

.data-query {
  .query-dialog-wrapper {
    .el-input__inner {
      background: #f5f5f5 !important;
    }
    .my_dialog {
      .el-input__inner {
        background: #ffffff !important;
      }
    }
  }
  .el-input {
    font-size: 12px !important;
    // font-family: "MicrosoftYaHei" !important;
  }
  .el-date-editor {
    .el-range-separator {
      width: 10%;
    }
  }
  .datacenter-query {
    .el-input {
      width: 192px;
    }
    padding: 24px 24px 16px 24px;
    background: #f5f5f5;
    .datacenter-query-ul {
      // display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        float: left;
        justify-content: center;
        margin-bottom: 8px;
        margin-right: 32px;
        // font-family: "MicrosoftYaHei";
        color: #666666;
        letter-spacing: 0;
        .DC-margin-left32 {
          font-size: 12px;
          display: block;
          margin-right: 16px;
          height: 32px;
          line-height: 32px;
          text-align: right;
        }
        .DC-input208 {
          display: block;
          height: 32px;
          line-height: 32px;
          .input-button {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            div:nth-child(1) {
              width: 192px;
              margin-right: 8px;
            }
          }
        }
      }
      .more {
        float: right;
        margin-bottom: 0;
        .search-button {
          margin-right: 8px;
          width: 80px;
          height: 32px;
          // font-family: "MicrosoftYaHei";
          font-size: 12px;
          color: #fff;
          background: #3b74ff;
          border: none;
          border-radius: 4px;
          &:hover {
            cursor: pointer;
            background-color: #0f55ff;
          }
        }
        .reset-button {
          width: 80px;
          height: 32px;
          // line-height: 32px;
          text-align: 32px;
          font-size: 12px;
          // font-family: "MicrosoftYaHei";
          color: #3b74ff;
          border: 1px solid #3b74ff;
          border-radius: 4px;
          background: #ffffff;
          &:hover {
            cursor: pointer;
            background: #ffffff;
            border: 1px solid #0f55ff;
          }
        }
        .GJBtn {
          margin-left: 8px;
          height: 32px;
          line-height: 32px;
          color: #666666;
          font-size: 12px;
          // font-family: "MicrosoftYaHei";
          span {
            font-size: 12px;
            // font-family: "MicrosoftYaHei";
          }
        }
        .GJBtn:hover {
          cursor: pointer;
        }
        .normal-button {
          margin-left: 8px;
          width: 100px;
          height: 32px;
          font-size: 12px;
          // font-family: "MicrosoftYaHei";
          color: #666666;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #bcbcbc;
        }
        .normal-button:hover {
          cursor: pointer;
        }
      }
      .date {
        .el-input__icon,
        .el-range-separator {
          line-height: 24px;
        }
      }
    }
  }

  /deep/ .my-dialog {
    .dialog-content {
      .common-box-query1 {
        div {
          margin-top: 10px;
          height: 272px;
          overflow-y: scroll;
          li {
            float: left;
            display: flex;
            margin-top: 4px;
            margin-right: 4px;
            padding: 6px 10px;
            width: 94px;
            height: 40px;
            line-height: 14px;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 12px;
            color: #666666;
            background: #ffffff;
            border: 1px solid #bcbcbc;
            border-radius: 4px;
            box-sizing: border-box;
            &:nth-child(10n) {
              margin-right: 0;
            }
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
      .commonbox-query-tips {
        margin-top: 12px;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
      }
      .common-box-query2 {
        div {
          margin-top: 8px;
          height: 134px;
          overflow-y: scroll;
          li {
            float: left;
            display: flex;
            margin-top: 4px;
            margin-right: 4px;
            padding: 6px 10px;
            width: 94px;
            height: 40px;
            line-height: 14px;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 12px;
            color: #666666;
            background: #ffffff;
            border: 1px solid #bcbcbc;
            border-radius: 4px;
            box-sizing: border-box;
            &:nth-child(10n) {
              margin-right: 0;
            }
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>