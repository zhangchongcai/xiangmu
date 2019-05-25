<template>
  <div ref="queryWrapper" class="data-query">
    <div class="datacenter-query clearfix" v-if="isHighShow">
      <ul class="datacenter-query-ul clearfix">
        <template v-for="(item,index) in baseQueryArr">
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <warehouse :cenimaUid="cenimaUid" @selectWarehouseData="getWarehouseData"></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf :cenimaUid="cenimaUid" @selectGoodsShelfData="getGoodsShelfData"></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input :inputValue="item" @inputValueChange="inputValueChange"></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <month-select
              @selectMonthStartData="getMonthStartData"
              @selectMonthEndData="getMonthEndData"
            ></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-select @selectDateData="getDateData"></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-time-select @selectDateTimeData="getDateTimeData"></date-time-select>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <time-select @selectTimeData="getTimeData"></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order @selectTransactionOrderData="getTransactionOrderData"></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <deal-type @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall-type @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <channel @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema @selectMultiCinemaData="getMultiCinemaData"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <member-class @selectMemberClassData="getMemberClassData"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version
                :selectValue="item"
                @selectmovieReleasedVersionData="getmovieReleasedVersionData"
              ></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-type :selectValue="item" @selectMovieTypeData="getMovieTypeData"></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <agent @selectAgentData="getAgentData"></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel @selectTransactionChannelData="getTransactionChannelData"></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie @selectFilmData="getFilmData"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <pay-type :cinemaUid="cenimaUid" @selectPayTypeData="getPayTypeData"></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <sale-type @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <tran-user @selectUserData="getUserData"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-class @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-type @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods @selectMerGoodsData="getMerGoodsData"></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <check-sing :selectValue="item"></check-sing>
          </li>
        </template>
        <!-- 更多 -->
        <li class="more">
          <!-- <el-checkbox v-model="paydetails" name="paydetails1">展示支付明细</el-checkbox> -->
          <button class="search-button" @click="getTableValue">查询</button>
          <span class="GJBtn DC666" v-if="styleExtQueryArr.length > 0" @click="conditionShow">
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
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <warehouse :cenimaUid="cenimaUid" @selectWarehouseData="getWarehouseData"></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf :cenimaUid="cenimaUid" @selectGoodsShelfData="getGoodsShelfData"></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input :inputValue="item" @inputValueChange="inputValueChange"></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <month-select
              @selectMonthStartData="getMonthStartData"
              @selectMonthEndData="getMonthEndData"
            ></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-select @selectDateData="getDateData"></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-time-select @selectDateTimeData="getDateTimeData"></date-time-select>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <time-select @selectTimeData="getTimeData"></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order @selectTransactionOrderData="getTransactionOrderData"></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <deal-type @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall-type @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <channel @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema @selectMultiCinemaData="getMultiCinemaData"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <member-class @selectMemberClassData="getMemberClassData"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version
                :selectValue="item"
                @selectmovieReleasedVersionData="getmovieReleasedVersionData"
              ></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-type :selectValue="item" @selectMovieTypeData="getMovieTypeData"></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <agent @selectAgentData="getAgentData"></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel @selectTransactionChannelData="getTransactionChannelData"></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie @selectFilmData="getFilmData"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <pay-type :cinemaUid="cenimaUid" @selectPayTypeData="getPayTypeData"></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <sale-type @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <tran-user @selectUserData="getUserData"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-class @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-type @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods @selectMerGoodsData="getMerGoodsData"></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <check-sing :selectValue="item"></check-sing>
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
          <!-- 仓库控件 -->
          <li v-if="item.controlType === 'WAREHOUSE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <warehouse :cenimaUid="cenimaUid" @selectWarehouseData="getWarehouseData"></warehouse>
            </div>
          </li>
          <!-- 货架控件 -->
          <li v-if="item.controlType === 'GOODS_SHELF'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <goods-shelf :cenimaUid="cenimaUid" @selectGoodsShelfData="getGoodsShelfData"></goods-shelf>
            </div>
          </li>
          <!-- 文本框控件 -->
          <li v-if="item.controlType === 'TEXT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <data-input :inputValue="item" @inputValueChange="inputValueChange"></data-input>
            </div>
          </li>
          <!-- 月份控件 -->
          <li v-if="item.controlType === 'MONTH'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <month-select
              @selectMonthStartData="getMonthStartData"
              @selectMonthEndData="getMonthEndData"
            ></month-select>
          </li>
          <!-- 日期控件 -->
          <li v-if="item.controlType === 'DATE'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-select @selectDateData="getDateData"></date-select>
          </li>
          <!-- 精确时间控件 -->
          <li v-if="item.controlType === 'DATETIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <date-time-select @selectDateTimeData="getDateTimeData"></date-time-select>
          </li>
          <!-- 时间控件 -->
          <li v-if="item.controlType === 'TIME'" :key="index" class="date">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <time-select @selectTimeData="getTimeData"></time-select>
          </li>
          <!-- 交易单类型控件 -->
          <li v-if="item.controlType === 'TRANSACTION_ORDER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-order @selectTransactionOrderData="getTransactionOrderData"></transaction-order>
            </div>
          </li>
          <!-- 交易类型 -->
          <li v-if="item.controlType === 'DEAL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <deal-type @selectDealTypeData="getDealTypeData"></deal-type>
            </div>
          </li>
          <!-- 影厅类型 -->
          <li v-if="item.controlType === 'HALL_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <hall-type @selectHallTypeData="getHallTypeData"></hall-type>
            </div>
          </li>
          <!-- 渠道 -->
          <li v-if="item.controlType === 'CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <channel @selectChannelData="getChannelData"></channel>
            </div>
          </li>
          <!-- 多选影院 -->
          <li v-if="item.controlType === 'CINEMA_TREE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <multi-cinema @selectMultiCinemaData="getMultiCinemaData"></multi-cinema>
            </div>
          </li>
          <!-- 会员等级 -->
          <li v-if="item.controlType === 'MEMBER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <member-class @selectMemberClassData="getMemberClassData"></member-class>
            </div>
          </li>
          <!-- 发行版本 -->
          <li v-if="item.controlType == 'MOVIE_RELEASED_VERSION'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-released-version
                :selectValue="item"
                @selectmovieReleasedVersionData="getmovieReleasedVersionData"
              ></movie-released-version>
            </div>
          </li>
          <!-- 影片类型 -->
          <li v-if="item.controlType == 'MOVIE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie-type :selectValue="item" @selectMovieTypeData="getMovieTypeData"></movie-type>
            </div>
          </li>
          <!-- 代理商控件 -->
          <li v-if="item.controlType === 'AGENT'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <agent @selectAgentData="getAgentData"></agent>
            </div>
          </li>
          <!-- 交易渠道控件 -->
          <li v-if="item.controlType === 'TRANSACTION_CHANNEL'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <transaction-channel @selectTransactionChannelData="getTransactionChannelData"></transaction-channel>
            </div>
          </li>
          <!-- 影片控件 -->
          <li v-if="item.controlType === 'MOVIE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <movie @selectFilmData="getFilmData"></movie>
            </div>
          </li>
          <!-- 支付方式 -->
          <li v-if="item.controlType === 'PAY_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <pay-type :cinemaUid="cenimaUid" @selectPayTypeData="getPayTypeData"></pay-type>
            </div>
          </li>
          <!-- 销售类型 -->
          <li v-if="item.controlType === 'SALE_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <sale-type @selectSaleTypeData="getSaleTypeData"></sale-type>
            </div>
          </li>
          <!-- 授权人/收银员 -->
          <li v-if="item.controlType === 'TRAN_USER'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <tran-user @selectUserData="getUserData"></tran-user>
            </div>
          </li>
          <!-- 商品类别 -->
          <li v-if="item.controlType === 'MER_CLASS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-class @selectMerClassData="getMerClassData"></mer-class>
            </div>
          </li>
          <!-- 商品类型 -->
          <li v-if="item.controlType === 'MER_TYPE'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-type @selectMerTypeData="getMerTypeData"></mer-type>
            </div>
          </li>
          <!-- 商品 -->
          <li v-if="item.controlType === 'MER_GOODS'" :key="index">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <mer-goods @selectMerGoodsData="getMerGoodsData"></mer-goods>
            </div>
          </li>
          <!-- 套餐拆分成子商品控件 -->
          <li v-if="item.controlType == 'CHECK_SING'" :key="index">
            <check-sing :selectValue="item"></check-sing>
          </li>
        </template>
      </ul>

      <!-- 按钮排列区 -->
      <ul class="datacenter-query-ul">
        <li class="more">
          <!-- <el-checkbox v-model="checked">展示支付明细</el-checkbox> -->
          <button class="search-button" @click="getTableValue">查询</button>
          <button class="normal-button" @click="setCommonBtn">设置通用条件</button>
        </li>
      </ul>
    </div>

    <!-- 常用条件弹框区域 -->
    <my-dialog
      :title="'自定义条件'"
      :isShow="isDialogShow"
      :dialogWidth="616"
      :dialogHeight="394"
      @handleBtnComfirmClick="setQdBtn"
      @handleBtnCancelClick="setDeBtn"
      @close="closeCCDialog"
    >
      <div slot="dialog-content">
        <div class="common-box">
          <div class="commonbox-query-tips">拖动排序筛选顺序</div>
          <ul class="common-box-query">
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
          <div class="commonbox-query-tips">选择通用条件</div>
          <ul class="common-box-query">
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
import CommonConditions from "./dataCommon/commonConditions";
import CheckSing from "./dataCommon/checkSing";
import CinemaTree from "./dataCommon/cinemaTree";
import CheckSelect from "./dataCommon/checkSelect";
import CinemaTree2 from "./dataCommon/cinemaTree2";
import datacenterBus from "../../assets/datacenterBus.js";
import DataInput from "./dataCommon/dataInput";
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
function app(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].seq = i + 1;
  }
  return arr;
}
export default {
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
    groupArr: Array,
    styleGroupArr: Array,
    reportCode: String,
    Pagination: Object,
    routeChangeStatus: Boolean
  },
  components: {
    DateSelect,
    MonthSelect,
    DateTimeSelect,
    CommonConditions,
    Draggable,
    CinemaTree,
    CinemaTree2,
    CheckSelect,
    CheckSing,
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
    GoodsShelf
  },
  data() {
    return {
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
      // 商品类型id
      merType: "",
      //开始月份
      monthStartData: "",
      //结束月份
      monthEndData: ""
    };
  },
  mounted() {
    var self = this;
    //对外暴露查询按钮点击事件
    datacenterBus.$on("searchButtonClick", function(data) {
      self.getTableValue(data);
    });
  },
  methods: {
    inputChange(val) {
      let textArr = this.styleExtQueryArr.filter(element => {
        return element.controlType == "CHECKBOX";
      });
    },
    changeSelectData(data) {
      console.log(data);
      for (let i = 0; i < this.styleExtQueryArr.length; i++) {
        if (this.styleExtQueryArr[i].queryName == data.queryName) {
          console.log(data);
          this.styleExtQueryArr[i] = JSON.parse(JSON.stringify(data));
        }
      }
      this.$forceUpdate();
    },
    //遍历基础查询和拓展查询数据并匹配查询数据
    getQueryData(data, controlType) {
      console.log(data);
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
    //传递交易渠道控件所选数据
    getTransactionChannelData(data) {
      this.getQueryData(data, "transaction_channel");
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
      this.merType = data;
      this.getQueryData(data, "mer_type");
    },
    //传递商品类别控件所选数据
    getMerClassData(data) {
      this.getQueryData(data, "mer_class");
    },
    //传递支付方式控件所选数据
    getPayTypeData(data) {
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
    getMonthStartData(data) {
      this.monthStartData = data;
      let monthValue = `${data},${this.monthEndData}`;
      this.getQueryData(monthValue, "month");
    },
    //月份选择控件结束月份
    getMonthEndData(data) {
      this.monthEndData = data;
      let monthValue = `${this.monthStartData},${data}`;
      this.getQueryData(monthValue, "month");
    },
    //精确时间控件
    getDateTimeData(data) {
      this.getQueryData(data, "datetime");
    },
    // 时间控件
    getTimeData(data) {
      this.getQueryData(data, "time");
    },
    //商品控件
    getMerGoodsData(data) {
      console.log(data);
      this.getQueryData(data, "mer_goods");
    },
    //日期控件
    getDateData(data) {
      console.log(data);
      this.getQueryData(data, "date");
    },
    //仓库控件
    getWarehouseData(data) {
      console.log('================A')
      this.getQueryData(data, "warehouse");
    },
    //货架控件
    getGoodsShelfData(data) {
      console.log('================B')
      this.getQueryData(data, "goods_shelf");
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
    },
    //确定按钮触发事件
    setQdBtn: function() {
      //向父级传值
      console.log("拖动后的showQueryArr", this.showQueryArr);
      console.log("拖动后的hideQueryArr", this.hideQueryArr);
      datacenterBus.$emit(
        "CcArrEvent",
        app(this.showQueryArr),
        app(this.hideQueryArr)
      );
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
    //获取表格内容
    getTableValue: function(value) {
      let queryArr;
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
      //如果查询条件存在则不能为空才能进行查询
      queryArr.forEach(element => {
        if (element.controlType === "DATE") {
          if (element.queryColValue === "") {
            this.$message({
              message: "请先选择时间再进行查询",
              iconClass: "iconfont icon-danchuang-jingtanhao",
              customClass: "alert-message",
              center: "true"
            });
          } else {
            datacenterBus.$emit("visibleEvent", false);
            datacenterBus.$emit("tableLoading");
            this.getDataStatus = true;
            //如果没有分组，就是明细查询
            if (this.styleGroupArr.length === 0) {
              //声明参数
              let param = {
                summaryFlag: 1,
                reportTableInfo: {
                  reportCode: this.reportCode,
                  queryArr: queryArr,
                  tableName: this.tableName,
                  colArr: this.styleColArr
                },
                pagingInfo: {
                  startIndex: 1,
                  rows: this.Pagination.pagesize
                }
              };
              //调用api，展示表格内容
              console.log(param);
              this.$rptList
                .showReportData(param)
                .then(data => {
                  const tableData = JSON.parse(data.data);
                  console.log(tableData);
                  this.$emit("tableDataArrEventNoGroup", tableData);
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
                  colArr: this.styleColArr,
                  groupArr: this.styleGroupArr
                }
              };
              //调用api，展示表格内容
              this.$rptList
                .showReportData(param)
                .then(data => {
                  const tableData = JSON.parse(data.data);
                  console.log(tableData);

                  datacenterBus.$emit("tableDataArrEventYesGroup", tableData);
                })
                .catch(msg => {
                  console.log(msg);
                });
            }
          }
        }
      });
    }
  },
  watch: {
    styleExtQueryArr: function(newVal, oldVal) {
      this.styleExtQueryArr = newVal;
    },
    //通过监听styleGroupArr的变化，同步模板切换时表格的数据
    styleGroupArr(newVal, oldVal) {
      if (this.routeChangeStatus === false) {
        if (newVal.length !== 0 && this.getDataStatus === true) {
          this.getTableValue("");
        }
        if (newVal.length === 0 && this.getDataStatus === true) {
          this.getTableValue("");
        }
      }
    }
  },
  created() {
    //监听表格搜索
    datacenterBus.$on("sendSearchData", data => {
      data.forEach(element => {
        if (element.queryColValue === "空白") {
          element.operation = " is";
          element.queryColValue = "null";
        }
        if (element.queryColValue === "无空白") {
          element.operation = " is not";
          element.queryColValue = "null";
        }
      });
      let inputData = JSON.parse(JSON.stringify(this.baseQueryArr));
      data.forEach(element => {
        inputData.push(element);
      });

      this.searchData = JSON.parse(JSON.stringify(inputData));
      this.getTableValue(inputData);
      console.log(this.searchData);
    });
    datacenterBus.$on("clearTableQueryData", data => {
      console.log(this.searchData);
      for (let i = 0; i < this.searchData.length; i++) {
        if (
          this.searchData[i].queryColKey === data.queryColKey &&
          this.searchData[i].queryColValue === data.queryColValue
        ) {
          this.searchData.splice(i, 1);
        }
      }
      this.getTableValue(this.searchData);
      // datacenterBus.$emit("sendSearch", this.searchData);
    });
    //监听切换模板样式时获取表格数据的事件
    datacenterBus.$on("getTableData", () => {
      this.getTableValue("");
    });
    //监听分组查询表格排序
    datacenterBus.$on();
  }
};
</script>

<style lang="scss" scoped>
@import url("../../assets/style/dataQuery.css");
</style>