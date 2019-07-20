<template>
  <div ref="queryWrapper" class="data-query">
    <div class="datacenter-query clearfix" v-if="isHighShow">
      <ul class="datacenter-query-ul clearfix">
        <template v-for="(item,index) in baseQueryArr">
          <!-- 票类控件 -->
          <li v-if="item.controlType === 'TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <ticket-type
                :cinemaUid="cenimaUid"
                :resetStatus="resetStatus"
                @selectTicketTypeData="getTicketTypeData"
              ></ticket-type>
            </div>
          </li>
          <!-- 套餐商品 -->
          <li v-if="item.controlType === 'COMBO_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <combo-goods :resetStatus="resetStatus" @selectComboGoodsData="getComboGoodsData"></combo-goods>
            </div>
          </li>
          <!-- 套餐子商品 -->
          <li v-if="item.controlType === 'SON_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <son-goods :resetStatus="resetStatus" @selectSonGoodsData="getSonGoodsData"></son-goods>
            </div>
          </li>
          <!-- 取货状态 -->
          <li v-if="item.controlType === 'DIC'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <dic
                :dicTag="item.dicTag"
                :queryColKey="item.queryColKey"
                :resetStatus="resetStatus"
                @selectDicData="getDicData"
              ></dic>
            </div>
          </li>
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <warehouse
                :resetStatus="resetStatus"
                :cenimaUid="cenimaUid"
                @selectWarehouseData="getWarehouseData"
              ></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf
                :resetStatus="resetStatus"
                :cenimaUid="cenimaUid"
                @selectGoodsShelfData="getGoodsShelfData"
              ></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input
                :resetStatus="resetStatus"
                :inputValue="item"
                @inputValueChange="inputValueChange"
              ></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <month-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectMonthData="getMonthData"
            ></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectDateData="getDateData"
            ></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-time-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectDateTimeData="getDateTimeData"
            ></date-time-select>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <time-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectTimeData="getTimeData"
            ></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order
                :resetStatus="resetStatus"
                @selectTransactionOrderData="getTransactionOrderData"
              ></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <deal-type :resetStatus="resetStatus" @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall-type :resetStatus="resetStatus" @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 影厅 -->
          <li v-if="item.controlType === 'HALL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall :resetStatus="resetStatus" @selectHallData="getHallData" :cinemaUid="cenimaUid"></hall>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <channel :resetStatus="resetStatus" @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema :resetStatus="resetStatus" @selectMultiCinemaData="getMultiCinemaData"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <member-class :resetStatus="resetStatus" @selectMemberClassData="getMemberClassData"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version
                :resetStatus="resetStatus"
                :selectValue="item"
                @selectmovieReleasedVersionData="getmovieReleasedVersionData"
              ></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-type
                :resetStatus="resetStatus"
                :selectValue="item"
                @selectMovieTypeData="getMovieTypeData"
              ></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <agent
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                @selectAgentData="getAgentData"
              ></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                :queryName="item.queryName"
                @selectTransactionChannelData="getTransactionChannelData"
              ></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie :resetStatus="resetStatus" @selectFilmData="getFilmData"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <pay-type
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                @selectPayTypeData="getPayTypeData"
              ></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <sale-type :resetStatus="resetStatus" @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <tran-user :resetStatus="resetStatus" @selectUserData="getUserData"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-class :resetStatus="resetStatus" @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-type :resetStatus="resetStatus" @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods
                :resetStatus="resetStatus"
                :merClassUid="merClassUid"
                @selectMerGoodsData="getMerGoodsData"
              ></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <combo-son-goods
              :queryName="item.queryName"
              @selectComboSonGoodsData="getComboSonGoodsData"
            ></combo-son-goods>
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
          <!-- 票类控件 -->
          <li v-if="item.controlType === 'TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <ticket-type
                :cinemaUid="cenimaUid"
                :resetStatus="resetStatus"
                @selectTicketTypeData="getTicketTypeData"
              ></ticket-type>
            </div>
          </li>
          <!-- 套餐商品 -->
          <li v-if="item.controlType === 'COMBO_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <combo-goods :resetStatus="resetStatus" @selectComboGoodsData="getComboGoodsData"></combo-goods>
            </div>
          </li>
          <!-- 套餐子商品 -->
          <li v-if="item.controlType === 'SON_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <son-goods :resetStatus="resetStatus" @selectSonGoodsData="getSonGoodsData"></son-goods>
            </div>
          </li>
          <!-- 取货状态 -->
          <li v-if="item.controlType === 'DIC'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <dic
                :dicTag="item.dicTag"
                :queryColKey="item.queryColKey"
                :resetStatus="resetStatus"
                @selectDicData="getDicData"
              ></dic>
            </div>
          </li>
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <warehouse
                :resetStatus="resetStatus"
                :cenimaUid="cenimaUid"
                @selectWarehouseData="getWarehouseData"
              ></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf
                :resetStatus="resetStatus"
                :cenimaUid="cenimaUid"
                @selectGoodsShelfData="getGoodsShelfData"
              ></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input
                :resetStatus="resetStatus"
                :inputValue="item"
                @inputValueChange="inputValueChange"
              ></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <month-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectMonthData="getMonthData"
            ></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectDateData="getDateData"
            ></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-time-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectDateTimeData="getDateTimeData"
            ></date-time-select>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <time-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectTimeData="getTimeData"
            ></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order
                :resetStatus="resetStatus"
                @selectTransactionOrderData="getTransactionOrderData"
              ></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <deal-type :resetStatus="resetStatus" @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall-type :resetStatus="resetStatus" @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 影厅 -->
          <li v-if="item.controlType === 'HALL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall :resetStatus="resetStatus" @selectHallData="getHallData" :cinemaUid="cenimaUid"></hall>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <channel :resetStatus="resetStatus" @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema :resetStatus="resetStatus" @selectMultiCinemaData="getMultiCinemaData"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <member-class :resetStatus="resetStatus" @selectMemberClassData="getMemberClassData"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version
                :resetStatus="resetStatus"
                :selectValue="item"
                @selectmovieReleasedVersionData="getmovieReleasedVersionData"
              ></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-type
                :resetStatus="resetStatus"
                :selectValue="item"
                @selectMovieTypeData="getMovieTypeData"
              ></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <agent
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                @selectAgentData="getAgentData"
              ></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                :queryName="item.queryName"
                @selectTransactionChannelData="getTransactionChannelData"
              ></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie :resetStatus="resetStatus" @selectFilmData="getFilmData"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <pay-type
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                @selectPayTypeData="getPayTypeData"
              ></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <sale-type :resetStatus="resetStatus" @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <tran-user :resetStatus="resetStatus" @selectUserData="getUserData"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-class :resetStatus="resetStatus" @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-type :resetStatus="resetStatus" @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods
                :resetStatus="resetStatus"
                :merClassUid="merClassUid"
                @selectMerGoodsData="getMerGoodsData"
              ></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <combo-son-goods
              :queryName="item.queryName"
              @selectComboSonGoodsData="getComboSonGoodsData"
            ></combo-son-goods>
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
          <!-- 票类控件 -->
          <li v-if="item.controlType === 'TICKET_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <ticket-type
                :cinemaUid="cenimaUid"
                :resetStatus="resetStatus"
                @selectTicketTypeData="getTicketTypeData"
              ></ticket-type>
            </div>
          </li>
          <!-- 套餐商品 -->
          <li v-if="item.controlType === 'COMBO_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <combo-goods :resetStatus="resetStatus" @selectComboGoodsData="getComboGoodsData"></combo-goods>
            </div>
          </li>
          <!-- 套餐子商品 -->
          <li v-if="item.controlType === 'SON_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <son-goods :resetStatus="resetStatus" @selectSonGoodsData="getSonGoodsData"></son-goods>
            </div>
          </li>
          <!-- 取货状态 -->
          <li v-if="item.controlType === 'DIC'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <dic
                :dicTag="item.dicTag"
                :queryColKey="item.queryColKey"
                :resetStatus="resetStatus"
                @selectDicData="getDicData"
              ></dic>
            </div>
          </li>
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <warehouse
                :resetStatus="resetStatus"
                :cenimaUid="cenimaUid"
                @selectWarehouseData="getWarehouseData"
              ></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf
                :resetStatus="resetStatus"
                :cenimaUid="cenimaUid"
                @selectGoodsShelfData="getGoodsShelfData"
              ></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input
                :resetStatus="resetStatus"
                :inputValue="item"
                @inputValueChange="inputValueChange"
              ></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <month-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectMonthData="getMonthData"
            ></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectDateData="getDateData"
            ></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-time-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectDateTimeData="getDateTimeData"
            ></date-time-select>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <time-select
              :queryName="item.queryName"
              :resetStatus="resetStatus"
              @selectTimeData="getTimeData"
            ></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order
                :resetStatus="resetStatus"
                @selectTransactionOrderData="getTransactionOrderData"
              ></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <deal-type :resetStatus="resetStatus" @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall-type :resetStatus="resetStatus" @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 影厅 -->
          <li v-if="item.controlType === 'HALL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall :resetStatus="resetStatus" @selectHallData="getHallData" :cinemaUid="cenimaUid"></hall>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <channel :resetStatus="resetStatus" @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema :resetStatus="resetStatus" @selectMultiCinemaData="getMultiCinemaData"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <member-class :resetStatus="resetStatus" @selectMemberClassData="getMemberClassData"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version
                :resetStatus="resetStatus"
                :selectValue="item"
                @selectmovieReleasedVersionData="getmovieReleasedVersionData"
              ></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-type
                :resetStatus="resetStatus"
                :selectValue="item"
                @selectMovieTypeData="getMovieTypeData"
              ></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <agent
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                @selectAgentData="getAgentData"
              ></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                :queryName="item.queryName"
                @selectTransactionChannelData="getTransactionChannelData"
              ></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie :resetStatus="resetStatus" @selectFilmData="getFilmData"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <pay-type
                :resetStatus="resetStatus"
                :cinemaUid="cenimaUid"
                @selectPayTypeData="getPayTypeData"
              ></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <sale-type :resetStatus="resetStatus" @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <tran-user :resetStatus="resetStatus" @selectUserData="getUserData"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-class :resetStatus="resetStatus" @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-type :resetStatus="resetStatus" @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods
                :resetStatus="resetStatus"
                :merClassUid="merClassUid"
                @selectMerGoodsData="getMerGoodsData"
              ></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <combo-son-goods
              :queryName="item.queryName"
              @selectComboSonGoodsData="getComboSonGoodsData"
            ></combo-son-goods>
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
    <my-dialog
      :title="'常用条件'"
      :isShow="isDialogShow"
      :dialogWidth="1016"
      :dialogHeight="576"
      :marginTop="0"
      :marginBottom="1"
      @handleBtnComfirmClick="setQdBtn"
      @handleBtnCancelClick="setDeBtn"
      @close="closeCCDialog"
    >
      <div slot="dialog-content">
        <div class="common-box">
          <!-- <div class="commonbox-query-tips">拖动排序筛选顺序</div> -->
          <ul class="common-box-query1">
            <draggable
              v-model="showQueryArr"
              :options="{group:'people'}"
              @start="drag=true"
              @end="drag=false"
              :move="dragMove"
            >
              <li
                class="commonbox-query-coment"
                v-for="(element,index) in showQueryArr"
                :key="index"
              >{{ element.queryName }}</li>
            </draggable>
          </ul>
          <div class="commonbox-query-tips">将不需要的条件拖到此处</div>
          <ul class="common-box-query2">
            <draggable
              v-model="hideQueryArr"
              :options="{group:'people'}"
              @start="drag=true"
              @end="drag=false"
            >
              <li
                class="commonbox-query-coment"
                v-for="(element, index) in hideQueryArr"
                :key="index"
              >{{ element.queryName }}</li>
            </draggable>
          </ul>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script type="text/javascript">
import Draggable from "vuedraggable";
import DateSelect from "./controllers/dateSelect";
import MonthSelect from "./controllers/monthSelect";
import DateTimeSelect from "./controllers/dateTimeSelect";
import timeSelect from "./controllers/timeSelect";
import ComboSonGoods from "./controllers/comboSonGoods";
import datacenterBus from "src/rpt/util/datacenterBus.js";
import DataInput from "./controllers/dataInput";
import MyDialog from "./dataCommon/myDialog";
import TransactionChannel from "./controllers/transactionChannel";
import Agent from "./controllers/agent";
import TransactionOrder from "./controllers/transactionOder";
import PayType from "./controllers/payType";
import DealType from "./controllers/dealType";
import SaleType from "./controllers/saleType";
import Channel from "./controllers/channel";
import HallType from "./controllers/hallType";
import TranUser from "./controllers/tranUser";
import Movie from "./controllers/movie";
import MultiCinema from "./controllers/multiCinema";
import MerClass from "./controllers/merClass";
import MerType from "./controllers/merType";
import MerGoods from "./controllers/merGoods";
import MemberClass from "./controllers/memberClass";
import MovieType from "./controllers/movieType";
import MovieReleasedVersion from "./controllers/movieReleasedVersion";
import Warehouse from "./controllers/warehouse";
import GoodsShelf from "./controllers/goodsShelf";
import Dic from "./controllers/dic";
import ComboGoods from "./controllers/comboGoods";
import SonGoods from "./controllers/sonGoods";
import Hall from "./controllers/hall";
import TicketType from "./controllers/ticketType";
import { mapState } from "vuex";
import { filterFunc } from "src/rpt/util/commonFunc.js";
import mixins from "src/frame_cpm/mixins/cacheMixin.js";

function app(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].seq = i + 1;
  }
  return arr;
}
export default {
  mixins: [mixins.cacheMixin],
  props: {
    //报表名称
    reportName: String,
    //
    tableName: String,
    // 基础查询
    baseQueryArr: Array,
    // 扩展查询
    extQueryArr: Array,
    styleExtQueryArr: Array,
    //表头
    colArr: Array,
    styleColArr: Array,
    tableStyleColArr: Array,
    payTypeDataArr: Array,
    groupArr: Array,
    styleGroupArr: Array,
    reportCode: String,
    Pagination: Object,
    searchClickStatus: Boolean,
    automaticSearchStatus: Number,
    orderCol: String
  },
  components: {
    DateSelect,
    MonthSelect,
    DateTimeSelect,
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
    ComboGoods,
    SonGoods,
    Hall,
    TicketType
  },
  data() {
    return {
      cacheField: [
        "showQueryArr",
        "hideQueryArr",
        "searchData",
        "cenimaUid",
        "merTypeUid",
        "merClassUid",
        "payTypeArr",
        "isHighShow"
      ],
      subComName: "dataQuery",
      isDialogShow: false, //是否显示自定义扩展条件
      isHighShow: true, //是否显示高级筛选
      showQueryArr: [], //设置条件窗口中要显示的条件
      hideQueryArr: [], //设置条件窗口中不显示的条件
      tempShowQueryArr: [], //临时存放，要显示的扩展条件
      tempHideQueryArr: [], //临时存放，不显示的扩展条件
      searchData: [], //存储表格筛选条件
      //是否查询表格数据
      getDataStatus: false,
      cenimaUid: "",
      //商品类型Uid
      merTypeUid: "",
      //商品类别Uid
      merClassUid: "",
      //是否重置
      resetStatus: false,
      //支付方式数据
      payTypeArr: []
    };
  },
  mounted() {
    var self = this;
    //对外暴露查询按钮点击事件
    // datacenterBus.$on("searchButtonClick", function(data) {
    //   self.getTableValue(data);
    // });
  },
  computed: mapState({
    clearTableData: state => state.rpt.clearTableData,
    isClear: state => state.rpt.isClear,
    colData: state => state.rpt.colData,
    isSent: state => state.rpt.isSent,
    storeColArr: state => state.rpt.colArr,
    isSetTableHeader: state => state.rpt.isSetTableHeader
  }),
  methods: {
    //重置细节处理
    resetDetail(element) {
      if (
        element.controlType === "TIME" ||
        element.controlType === "DATETIME" ||
        element.controlType === "MONTH" ||
        element.controlType === "DATE"
      ) {
        this.resetStatus = true;
        setTimeout(() => {
          this.resetStatus = false;
        }, 500);
      } else {
        element.queryColValue = "";
        this.resetStatus = true;
        setTimeout(() => {
          this.resetStatus = false;
        }, 500);
      }

      if (this.automaticSearchStatus !== 2) {
        this.$message({
          message: "重置成功！",
          iconClass: "iconfont icon-danchuang-wancheng",
          customClass: "rpt-alert-message",
          center: "true"
        });
      }
    },
    //点击重置
    resetClick() {
      this.baseQueryArr.forEach(element => {
        this.resetDetail(element);
      });

      this.styleExtQueryArr.forEach(element => {
        this.resetDetail(element);
      });
    },
    inputChange(val) {
      let textArr = this.styleExtQueryArr.filter(element => {
        return element.controlType == "CHECKBOX";
      });
    },
    changeSelectData(data) {
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (this.styleExtQueryArr[i].queryName == data.queryName) {
          this.styleExtQueryArr[i] = JSON.parse(JSON.stringify(data));
        }
      }
      this.$forceUpdate();
    },
    //遍历基础查询和拓展查询数据并匹配查询数据
    getQueryData(data, controlType) {
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
    //时间、复选框相关控件数据
    getComplexQueryData(data, queryName, controlType) {
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
    inputValueChange(val) {
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
    //传递代理商控件所选数据
    getAgentData(data) {
      this.getQueryData(data, "agent");
    },
    //传递渠道控件所选数据
    getTransactionChannelData(data, queryName) {
      this.getComplexQueryData(data, queryName, "transaction_channel");
    },
    //传递影片控件所选数据
    getFilmData(data) {
      this.getQueryData(data, "movie");
    },
    //传递交易类型控件所选数据
    getDealTypeData(data) {
      this.getQueryData(data, "deal_type");
    },
    //传递销售类型控件所选数据
    getSaleTypeData(data) {
      this.getQueryData(data, "sale_type");
    },
    //传递渠道控件所选数据
    getChannelData(data) {
      this.getQueryData(data, "channel");
    },
    //传递影厅类型控件所选数据
    getHallTypeData(data) {
      this.getQueryData(data, "hall_type");
    },
    //传递影厅控件所选数据
    getHallData(data) {
      this.getQueryData(data, "hall");
    },
    //传递收银员/授权人控件所选数据
    getUserData(data) {
      this.getQueryData(data, "tran_user");
    },
    //传递多选影院控件所选数据
    getMultiCinemaData(data) {
      this.cenimaUid = data;
      this.getQueryData(data, "cinema_tree");
    },
    //传递商品类型控件所选数据
    getMerTypeData(data) {
      this.merTypeUid = data;
      this.getQueryData(data, "mer_type");
    },
    //传递商品类别控件所选数据
    getMerClassData(data) {
      this.merClassUid = data;
      this.getQueryData(data, "mer_class");
    },
    //传递支付方式控件所选数据
    getPayTypeData(data) {
      this.payTypeArr = data.split(",");
      this.getQueryData(data, "pay_type");
    },
    //传递会员等级控件所选数据
    getMemberClassData(data) {
      this.getQueryData(data, "member_class");
    },
    //传递会员等级控件所选数据
    getTransactionOrderData(data) {
      this.getQueryData(data, "transaction_order_type");
    },
    //传递影片类型控件所选数据
    getMovieTypeData(data) {
      this.getQueryData(data, "movie_type");
    },
    //传递发行版本控件所选数据
    getmovieReleasedVersionData(data) {
      this.getQueryData(data, "movie_released_version");
    },
    //月份选择控件开始月份
    getMonthData(data, queryName) {
      this.getComplexQueryData(data, queryName, "month");
    },
    //精确时间控件
    getDateTimeData(data, queryName) {
      this.getComplexQueryData(data, queryName, "datetime");
    },
    // 时间控件
    getTimeData(data, queryName) {
      this.getComplexQueryData(data, queryName, "time");
    },
    //商品控件
    getMerGoodsData(data) {
      this.getQueryData(data, "mer_goods");
    },
    //日期控件
    getDateData(data, queryName) {
      this.getComplexQueryData(data, queryName, "date");
    },
    //仓库控件
    getWarehouseData(data) {
      this.getQueryData(data, "warehouse");
    },
    //货架控件
    getGoodsShelfData(data) {
      this.getQueryData(data, "goods_shelf");
    },
    //套餐拆分成子商品
    getComboSonGoodsData(data, queryName) {
      this.getComplexQueryData(data, queryName, "check_sing");
    },
    //取货状态控件
    getDicData(data, colKey) {
      for (let i = 0; i < this.baseQueryArr.length; i++) {
        if (this.baseQueryArr[i].queryColKey === colKey) {
          this.baseQueryArr[i].queryColValue = data;
        }
      }
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (this.styleExtQueryArr[i].queryColKey === colKey) {
          this.styleExtQueryArr[i].queryColValue = data;
        }
      }
      this.$forceUpdate();
    },
    //套餐商品
    getComboGoodsData(data) {
      this.getQueryData(data, "combo_goods");
    },
    //套餐子商品
    getSonGoodsData(data) {
      this.getQueryData(data, "son_goods");
    },
    //票类控件
    getTicketTypeData(data) {
      this.getQueryData(data, "ticket_type");
    },
    dragMove(evt) {},
    conditionShow: function() {
      this.isHighShow = false;
    },
    conditionDide: function() {
      this.isHighShow = true;
    },
    //关闭自定义查询条件窗口事件
    closeCCDialog: function() {
      //还原条件
      this.showQueryArr = this.tempShowQueryArr;
      this.hideQueryArr = this.tempHideQueryArr;
      this.isDialogShow = false;
    },
    //确定按钮触发事件
    setQdBtn: function() {
      //向父级传值
      this.$emit("CcArrEvent", app(this.showQueryArr), app(this.hideQueryArr));
      //修改临时存放的值
      this.tempShowQueryArr = this.showQueryArr;
      this.tempHideQueryArr = this.hideQueryArr;
      //改变窗口显示状态
      this.isDialogShow = false;
      // this.showQueryArr
    },
    //取消按钮触发事件
    setDeBtn: function() {
      this.isDialogShow = false;
    },
    //点击设置常用条件按钮触发事件
    setCommonBtn: function() {
      //初始化窗口中显示和不显示的扩展条件数组
      this.showQueryArr = this.styleExtQueryArr;
      this.hideQueryArr = this.extQueryArr;
      //保存原始值
      this.tempShowQueryArr = this.showQueryArr;
      this.tempHideQueryArr = this.hideQueryArr;
      //改变窗口显示状态
      this.isDialogShow = true;
    },
    messageDialog(message) {
      this.$message({
        message: message,
        iconClass: "iconfont icon-danchuang-jingtanhao",
        customClass: "rpt-alert-message",
        center: "true"
      });
      throw message;
    },
    //获取表格内容
    getTableValue(value) {
      let queryArr;
      let payTypeList = [];
      let styleColList = [];
      let newPayTypeArr = [];
      let newStyleColArr = [];
      let newColArr = [];
      let colDataArr = [];
      //处理支付方式查询信息
      if (this.reportCode == "T05") {
        if (this.payTypeArr.length !== 0) {
        this.payTypeDataArr.forEach(element => {
          payTypeList.push(element);
        });
        this.tableStyleColArr.forEach((element, index) => {
          if (element.colKey.indexOf("pay_type") === -1)
          // if (element.children === null)
            styleColList.push(element);
        });
        payTypeList.forEach(element1 => {
          this.payTypeArr.forEach(element2 => {
            element1.colName === element2 ? newPayTypeArr.push(element1) : null;
          });
        });
        newStyleColArr = [...styleColList, ...newPayTypeArr];
        this.$emit("sendStyleColArr", newStyleColArr);
      } else {
        this.tableStyleColArr.forEach(element => {
          if (element.children === null) {
            newColArr.push(element);
          }
        });
      }

      //  向后端传送的表头数据
      this.payTypeArr.length === 0
        ? (colDataArr = newColArr)
        : (colDataArr = newStyleColArr);
      if (this.isSetTableHeader === true) {
        colDataArr = this.storeColArr;
        this.$store.commit("setIsSetTableHeader");
      }
      }

      //拼接基础查询和扩展查询
      if (this.searchData.lenght != 0) {
        value = JSON.parse(JSON.stringify(this.searchData));
      }
      if (value.length > 0) {
        queryArr = value;
      } else {
        queryArr = this.baseQueryArr;
      }
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
      }

      //如果日期查询条件存在则不能为空才能进行查询,并处理checkbox的值
      let timeVlaue = [];
      queryArr.forEach(element => {
        element.controlType === "CHECK_SING" && element.queryColValue === ""
          ? (element.queryColValue = "0")
          : null;

        element.controlType === "DATE" ||
        element.controlType === "MONTH" ||
        element.controlType === "DATETIME" ||
        element.controlType === "TIME"
          ? timeVlaue.push(element.queryColValue)
          : null;
        if (
          element.controlType === "CINEMA_TREE" &&
          element.queryColValue === ""
        ) {
          this.messageDialog("请先选择影院再进行查询");
          return;
        }
      });
      if (
        timeVlaue.every(element => element === "") &&
        timeVlaue.length !== 0
      ) {
        this.messageDialog("请先选择时间再进行查询");
        return;
      }

      datacenterBus.$emit("visibleEvent", false);
      datacenterBus.$emit("tableLoading");
      this.getDataStatus = true;
      this.$store.commit("setIsFilted", true);

      //如果没有分组，就是明细查询
      if (this.styleGroupArr.length === 0) {
        //声明参数
        let param = {
          summaryFlag: 1,
          reportTableInfo: {
            reportCode: this.reportCode,
            queryArr: queryArr,
            tableName: this.tableName,
            colArr: colDataArr.length === 0 ? this.tableStyleColArr : colDataArr,
            // colArr: colDataArr,
            orderArr: [
              {
                colKey: this.orderCol === "" ? null : this.orderCol,
                orderDesc: "DESC"
              }
            ]
          },
          pagingInfo: {
            startIndex: 1,
            rows: this.Pagination.pagesize
          }
        };
        //调用api，展示表格内容
        this.$rptList
          .showReportData(param)
          .then(data => {
            const tableData = JSON.parse(data.data);
            this.$emit("tableDataArrEventNoGroup", tableData);
            this.$store.commit("getUpdateTime", tableData.adsUpdateTime);
          })
          .catch(msg => {
            console.log(msg);
          });
      } else {
        //有分组，分组查询
        //声明参数
        let param = {
          summaryFlag: 1,
          groupFlag: 1,
          firstQueryFlag: 1,
          reportTableInfo: {
            reportCode: this.reportCode,
            queryArr: queryArr,
            tableName: this.tableName,
            colArr: colDataArr.length === 0 ? this.tableStyleColArr : colDataArr,
            // colArr: colDataArr,
            groupArr: this.styleGroupArr,
            orderArr: [
              {
                colKey: this.orderCol === "" ? null : this.orderCol,
                orderDesc: "DESC"
              }
            ]
          }
        };
        //调用api，展示表格内容
        this.$rptList
          .showReportData(param)
          .then(data => {
            const tableData = JSON.parse(data.data);

            this.$emit("tableDataArrEventYesGroup", tableData);
          })
          .catch(msg => {
            console.log(msg);
          });
      }
    }
  },
  watch: {
    styleExtQueryArr: function(newVal, oldVal) {
      this.styleExtQueryArr = newVal;
    },
    searchClickStatus(newVal, oldVal) {
      if (newVal) {
        this.$emit("setSearchStatus");
        setTimeout(() => {
          this.getTableValue();
        }, 100);
      }
    },
    automaticSearchStatus(newVal, oldVal) {
      if (newVal === 2) {
        this.getTableValue();
      }
    },
    isClear(newVal, oldVal) {
      if (newVal) {
        for (let i = 0; i < this.searchData.length; i++) {
          if (
            this.searchData[i].queryColKey ===
              this.clearTableData.queryColKey &&
            this.searchData[i].queryColValue ===
              this.clearTableData.queryColValue
          ) {
            this.searchData.splice(i, 1);
          }
        }
        this.getTableValue(this.searchData);
        this.$store.commit("resetIsClear", false);
        // datacenterBus.$emit("sendSearch", this.searchData);
      }
    },
    isSent(newVal, oldVal) {
      if (newVal) {
        let data = filterFunc(this.colData, this.baseQueryArr);
        this.searchData = data;
        this.getTableValue(data);
        this.$store.commit("resetIsSent");
      }
    }
  }
};
</script>

<style lang="scss">
//浮层提示框样式
.rpt-alert-message {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(50% - 24px);
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
    font-family: "MicrosoftYaHei";
    font-size: 16px;
  }
}

.data-query {
  .el-input {
    font-size: 12px !important;
    font-family: "MicrosoftYaHei" !important;
  }
  .el-date-editor {
    .el-range-separator {
      width: 10%;
    }
  }
  .datacenter-query {
    padding: 24px;
    background: #f5f5f5;
    .datacenter-query-ul {
      // display: flex;
      flex-wrap: wrap;
      margin-top: 8px;
      li {
        display: flex;
        float: left;
        justify-content: center;
        margin-right: 32px;
        margin-bottom: 8px;
        font-family: "MicrosoftYaHei";
        color: #666666;
        letter-spacing: 0;
        .DC-margin-left32 {
          font-size: 12px;
          display: block;
          margin-right: 10px;
          width: 100px;
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
            div:nth-child(1) {
              width: 192px;
              margin-right: 8px;
            }
          }
        }
      }
      .more {
        float: right;
        .search-button {
          margin-right: 8px;
          width: 80px;
          height: 32px;
          font-family: "MicrosoftYaHei";
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
          line-height: 32px;
          text-align: 32px;
          font-size: 12px;
          font-family: "MicrosoftYaHei";
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
          font-family: "MicrosoftYaHei";
          span {
            font-size: 12px;
            font-family: "MicrosoftYaHei";
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
          font-family: "MicrosoftYaHei";
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
        /deep/ .el-input__icon,
        /deep/ .el-range-separator {
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