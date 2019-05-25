<template>
  <div class="BoxContainer">
    <!--票房详情-->
    <div class="BoxOffice">
      <div class="BoxTitle flex" height="40">
        <div class="left">
          <span class="iconfont icon-shouye-huiyuan"></span>
          <span>会员</span>
        </div>
        <div class="right">
          <span class="tip">详情</span>
          <i class="iconfont icon-neiye-zhankaijiantou icon-arrow"></i>
        </div>
      </div>    
    </div>

    <!-- nav导航 -->

    <div class="right-col">
      <ul class="listUl">
        <li class="first-li" @click="MeClick('0')" :class="{active:cur==0}">
            <div class="cont">
              <h1>{{MemberTop.newMember | capitalizePerson}}</h1>
              <p>新增会员人数({{MemberTop.newMember | too}})</p>
            </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>会员消费金额</div>
          <div>
            <span>{{MemberTop.memberConsumeAmount | capitalizeOne}}</span>{{MemberTop.memberConsumeAmount | foo}}
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>会员消费占比</div>
          <div>
            <span>{{MemberTop.memberConsumePer | woo}}</span>%
          </div>
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>开卡数量</div>
          <div>
            <span>{{MemberTop.newCardCount | capitalizeSheet}}</span>{{MemberTop.newCardCount | sheets}}
          </div>
        </li>
        <li @click="MeClick('4')" :class="{active:cur==4}">
          <div>储值金额</div>
          <div>
            <span>{{MemberTop.totalStoreAmount | capitalizeOne}}</span>{{MemberTop.totalStoreAmount | foo}}
          </div>
        </li>
      </ul>
    </div>
    
    <!--新增会员人数Content-->
    <div class="membership_Container" v-if="cur==0">
      <!--KPI完成率-->
        <div class="ModuleTitleLayout ModuleKPI" v-if="flag">
          <div class="ModuleTitle">
            <div>
              KPI完成率
              <el-tooltip class="item" effect="dark" placement="right-start">
                <div slot="content" style="width:300px">
                  <ul id="ulMain">
                    <li>新增会员人数当日达成 : <span>{{MemberKPIData.newMemberCurrent | capitalizePerson}}{{MemberKPIData.newMemberCurrent | too}}</span></li>
                    <li>环比前一日 : <span :class="[MemberKPIData.memberChainDay > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[MemberKPIData.memberChainDay > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{MemberKPIData.memberChainDay | woo}}%</span></li>
                    <li>月至今达成 : <span>{{MemberKPIData.memberMonthToNow | capitalizePerson}}{{MemberKPIData.memberMonthToNow | too}}</span></li>
                    <li>环比上月 : <span :class="[MemberKPIData.memberChainMonth > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[MemberKPIData.memberChainMonth > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{MemberKPIData.memberChainMonth | woo}}%</span></li>
                    <li>本月目标为 : <span>{{MemberKPIData.newMemberTarget | capitalizePerson}}</span>{{MemberKPIData.newMemberTarget | too}}</li>
                    <li>达成率 : <span>{{MemberKPIData.newMemberRate | woo}}</span>%</li>
                    <li>与时间进度差距为 : <span :class="[MemberKPIData.timeRateGap > 0? 'green':'red']">{{MemberKPIData.timeRateGap | woo}}%</span></li>
                    <li>按目前进度,预计月底达成率为 : <span>{{MemberKPIData.memberExpect | woo}}</span>%</li>
                    <li>与目标额差距 : <span :class="[MemberKPIData.memberGap > 0? 'green':'red']">{{MemberKPIData.memberGap | woo}}%</span></li>
                  </ul>
                </div>
                <i class="iconfont icon-danchuang-tishi"></i>
              </el-tooltip>
            </div>
            <div class="last">截止:{{this.startDate && this.endDate}}</div>
          </div>
          <div class="kip-wrap">
            <member-dash :MemberKPIvalue="MemberKPIData"></member-dash>
          </div>
        </div>
      <!--新增会员人数 -->
      <div class="ModuleTitleLayout ModuleKPI">
        <div class="ModuleTitle">
          <div>新增会员人数趋势</div>
        </div>
        <ve-line
          :data="lineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout ">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            size="mini" 
            :data="CurrentMemberTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumMember', order: 'descending'}"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumMember" label="新增会员人数" min-width="115" align="left" sortable="custom" >
              <template slot-scope="scope">
                <span>{{ scope.row.showNumMember }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页 -->
      <div class="page">
       <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>

    <!--会员消费金额Content-->
    <div class="membership_Container ModuleKPI" v-if="cur==1">
      <!--会员消费金额 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>会员消费金额趋势</div>
          <div></div>
        </div>  
        <ve-line
          :data="ChartsAmount"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtendMoney"
        ></ve-line>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            size="mini" 
            :data="CurrentMemberTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumMember', order: 'descending'}"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumMember" label="会员消费金额" min-width="115" align="left" sortable="custom" >
              <template slot-scope="scope">
                <span>{{ scope.row.showNumMember }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页 -->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>

    <!--会员消费占比Content-->
    <div class="membership_Container ModuleKPI" v-if="cur==2">
      <!--会员消费占比趋势人数 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>会员消费占比趋势</div>
          <div></div>
        </div>
        <ve-line
          :data="ChartsProp"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtendBI"
        ></ve-line>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            size="mini" 
            :data="CurrentMemberTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumMember', order: 'descending'}"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumMember" label="会员消费占比" min-width="115" align="left" sortable="custom" >
              <template slot-scope="scope">
                <span>{{ scope.row.showNumMember}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页 -->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>

    <!--开卡数量Content-->
    <div class="membership_Container ModuleKPI" v-if="cur==3">
      <!--会员消费占比趋势人数 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>开卡数量趋势</div>
          <div></div>
        </div>
        <ve-line
          :data="ChartsOpen"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtendZhang"
        ></ve-line>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            size="mini" 
            :data="CurrentMemberTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumMember', order: 'descending'}"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumMember" label="开卡数量" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumMember }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页 -->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>

    <!--储值金额Content-->
    <div class="membership_Container ModuleKPI" v-if="cur==4">
      <!--储值金额趋势 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>储值金额趋势</div>
          <div></div>
        </div>
        <ve-line
          :data="ChartsProfit"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtendMoneyTwo"
        ></ve-line>
        
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            size="mini" 
            :data="CurrentMemberTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumMember', order: 'descending'}"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumMember" label="储值金额" min-width="115" align="left" sortable="custom" >
              <template slot-scope="scope">
                <span>{{ scope.row.showNumMember }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页 -->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>
  </div> 
</template>
<script>
import MemberDash from "./KPI/MemberDash";
export default {
  components:{
    MemberDash
  },
  name: "Member",
  props: {
    MemberTop: {
      type: Object
    },
    MemberTableTop: {
      type: Array
    },
    lineData: {
      type: Object
    },
    startDate:{
      type: String
    },
    endDate:{
      type: String
    },
    timeType:{
      type: String
    },
    MemberKPIData:{
      type:Object
    },
    MemberTotal:{
      type:Number
    },
    initMemberPage:{
      type:Number
    }
    
  },
  components: {
    MemberDash
  },
  data() {
    this.lineExtend = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}人'
      }
    };
    this.lineExtendBI = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}%'
      }
    };
    this.lineExtendMoneyTwo = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}元'
      }
    };
    this.lineExtendMoney = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}元'
      }
    };
    this.lineExtendZhang = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}张'
      }
    };
    return {
      seq:'',
      seqType:'',
      CurrentMemberTableTop:JSON.parse(JSON.stringify(this.MemberTableTop)),
      flag:true,
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      totalPage:0,
      BoxType:"new_member",
      BoxPage:true,
      MemberTableMain:[],  //票房指标数据
      MemberTablePage:[],  //票房分页数据
      ChartsAmount:{       //会员消费金额
        columns: [],
        rows: []
      },
      ChartsProp:{      //开卡数量
        columns: [],
        rows: []
      },
      ChartsOpen:{      //开卡数量
        columns: [],
        rows: []
      },
      ChartsProfit:{    //储存金额
        columns: [],
        rows: []
      },
      // 1.1折线图的设置
      lineSettings: {
        smooth: false,
        itemStyle: {
          color: "#3B74FF", // 折线点颜色
          lineStyle: {
            color: "#FE825E"
          }
        }
      }
    };
  },
  watch: {
    MemberTableTop(val){
      this.CurrentMemberTableTop = val
    }
  },
  filters: {
    woo(value){
      if (!value) return ""
      return value.toFixed(2)
    },
    //处理金钱计算保留两位
    capitalizeOne(value) {
      if (!value) return ""
      let newValue = value.toString();
      //判断逻辑
      if(newValue.indexOf('.') != -1){
        
        if(newValue.length < 7){
          return Number(newValue + '0').toFixed(2)
        }
        else if(newValue.length >= 7 && newValue.length <= 11){
          return (newValue / 10000).toFixed(2)
        }
        else if(newValue.length >= 12){
          return ((newValue / 10000) / 10000).toFixed(2)
        }
      }
      else
      {
        if(newValue.length < 5){
          return Number(newValue + '.00').toFixed(2)
        }
        else if(newValue.length >= 5 && newValue.length <= 8){
          return (newValue / 10000).toFixed(2)
        }
        else if(newValue.length >= 9){
          return ((newValue / 10000) / 10000).toFixed(2)
        }
      }
    },
    //处理万人计算保留两位小数
    capitalizePerson(value) {
      if (!value) return ""
      let newValue = value.toString();

      if(newValue.length < 5){
        return newValue
      }
      else if(newValue.length >= 5 && newValue.length <= 8){
        return (newValue / 10000).toFixed(2)
      }
      else if(newValue.length >= 9){
        return ((newValue / 10000) / 10000).toFixed(2)
      }
    },
    //处理开卡张数
    capitalizeSheet(value) {
      if (!value) return ""
      let newValue = value.toString();

      if(newValue.length < 5){
        return newValue
      }
      else if(newValue.length >= 5 && newValue.length <= 8){
        return (newValue / 10000).toFixed(2)
      }
      else if(newValue.length >= 9){
        return ((newValue / 10000) / 10000).toFixed(2)
      }
    },
    //处理万元计算
    foo(value){
      if (!value) return ""
      let newValue = value.toString();
      let foo = ''

      if(newValue.indexOf('.') != -1){
        if(newValue.length < 8){
          foo = '元'
          return foo
        }
        else if(newValue.length >= 8 && newValue.length <= 11){
          foo = '万元'
          return foo
        }
        else if(newValue.length >= 12){
          foo = '亿元'
          return foo
        }
      }
      else{
        if(newValue.length < 5){
          foo = '元'
          return foo
        }
        else if(newValue.length >= 5 && newValue.length <= 8){
          foo = '万元'
          return foo
        }
        else if(newValue.length >= 9){
          foo = '亿元'
          return foo
        }
      }
    },
    //处理万人单位计算
    too(value){
      if (!value) return ""

      let newValue = value.toString();
      let too = ''

      if(newValue.length < 5){
        too = '人'
        return too
      }
      else if(newValue.length >= 5 && newValue.length <= 8){
        too = '万人'
        return too
        
      }
      else if(newValue.length >= 9){
        too = '亿人'
        return too
      }
    },
    //处理万张单位计算
    sheets(value){
      if (!value) return ""

      let newValue = value.toString();
      let sheets = ''

      if(newValue.length < 5){
        sheets = '张'
        return sheets
      }
      else if(newValue.length >= 5 && newValue.length <= 8){
        sheets = '万张'
        return sheets
      }
      else if(newValue.length >= 9){
        sheets = '亿张'
        return sheets
      }
    }
  },
  methods: {
    active(){
      this.cur = 0
      this.currentPage = 1
    },
    formatValue(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num.toFixed(2)}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum
    },
    formatPerson(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum
    },
    formatZhang(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num}${company}`
      } 
      if (num > 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum
    },
    //初始化分页数据
    testFun(){
      this.totalPage = this.initMemberPage  
    },
    foo(val){
      this.flag = val
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    MeClick(val){
      this.cur = val
      if(val === '0'){
        if(this.BoxType){
          this.getMemberTab('new_member');
        }
      }
      else if(val === '1'){
        if(this.BoxType){
         //调用会员消费金额指标数据
         this.getMemberTab('member_consume_price');
        }
      }
      else if(val === '2'){
         if(this.BoxType){
          //调用会员消费占比指标数据
          this.getMemberTab('member_consume_percent');
         }
      }
      else if(val === '3'){
        if(this.BoxType){
          //调用开卡数量指标数据
          this.getMemberTab('card_number');
         }
      }
      else if(val === '4'){
        if(this.BoxType){
          //调用储值金额指标数据
          this.getMemberTab('store_price');
         }
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleCurrentChange(val){
      this.currentPage = val
      if(this.BoxType === "new_member"){
        //调用会员新增人数分页数据
        this.getMemberPages('new_member',this.currentPage,this.seqType)
      }else if(this.BoxType === "member_consume_price"){
        //调用会员消费金额分页数据
        this.getMemberPages('member_consume_price',this.currentPage,this.seqType)
      }else if(this.BoxType === "member_consume_percent"){
        //调用会员消费占比分页数据
        this.getMemberPages('member_consume_percent',this.currentPage,this.seqType)
      }else if(this.BoxType === "card_number"){
        //调用开卡数量分页数据
        this.getMemberPages('card_number',this.currentPage,this.seqType)
      }
      else if(this.BoxType === "store_price"){
        //调用储值金额分页数据
        this.getMemberPages('store_price',this.currentPage,this.seqType)
      }
    },
    //排序事件
    SortChange(column){
      if(column.order === 'descending'){
        this.seq = 'DESC'
        this.$camList.MemberPager({
          body: {
            groupId: 44,
            columnType: this.BoxType,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            seq:this.seq
          }
        })
        .then(response => {
          let res = response.data;
          
          if(this.BoxType === 'new_member'){
            //判断新增会员人数
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatPerson(item.columeName,'人')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'member_consume_price'){
            //判断会员消费金额
            if(res.memberCinemaPageInfo){

              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatValue(item.columeName,'元')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list

            }
          }
          else if(this.BoxType === 'member_consume_percent'){
            //判断会员消费占比
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatValue(item.columeName,'%')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'card_number'){
            //判断开卡数量
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatZhang(item.columeName,'张')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'store_price'){
            //判断储值金额
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatValue(item.columeName,'元')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          
        });
      }
      else if(column.order === 'ascending'){
        this.seq = 'ASC'
        this.$camList.MemberPager({
          body: {
            groupId: 44,
            columnType: this.BoxType,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            seq:this.seq
          }
        })
        .then(response => {
          let res = response.data;
           if(this.BoxType === 'new_member'){
            //判断新增会员人数
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatPerson(item.columeName,'人')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'member_consume_price'){
            //判断会员消费金额
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatValue(item.columeName,'元')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'member_consume_percent'){
            //判断会员消费占比
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatValue(item.columeName,'%')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'card_number'){
            //判断开卡数量
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatZhang(item.columeName,'张')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'store_price'){
            //判断储值金额
            if(res.memberCinemaPageInfo){
              res.memberCinemaPageInfo.list.forEach(item => {
                item.showNumMember = this.formatValue(item.columeName,'元')
              })
              this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
            }
          }
        });
      }
    },
    //票房分页公用组件
    getMemberPages(val,currentPage,seq){
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val;

      if(this.seq === 'DESC'){
        this.seqType = this.seq
      }
      else if(this.seq === 'ASC'){
        this.seqType = this.seq
      }

      this.$nextTick(() => {
        this.$camList.MemberPager({
          body: {
            groupId: 44,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType,
            seq:this.seqType
          }
        })
        .then(response => {
          let res = response.data;

          if(this.BoxType === "new_member"){
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatPerson(item.columeName,'人')
            })
          }
          else if(this.BoxType === "member_consume_price"){
            res.memberCinemaPageInfo.list.forEach(item => {
             item.showNumMember = this.formatValue(item.columeName,'元')
            })
          }
          else if(this.BoxType === "member_consume_percent"){
            res.memberCinemaPageInfo.list.forEach(item => {
             item.showNumMember = this.formatValue(item.columeName,'%')
            })
          }
          else if(this.BoxType === "card_number"){
            res.memberCinemaPageInfo.list.forEach(item => {
             item.showNumMember = this.formatZhang(item.columeName,'张')

            })
          }
          else if(this.BoxType === "store_price"){
            res.memberCinemaPageInfo.list.forEach(item => {
             item.showNumMember = this.formatValue(item.columeName,'元')
            })
          }
          this.CurrentMemberTableTop = res.memberCinemaPageInfo.list
        });
      })
    },
    //指标切换接口
    getMemberTab (val,currentPage) {  
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val
      this.$nextTick(() => {
        this.$camList.SwitchMemberTab({
          body: {
            groupId:44,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType,
            initNewMember:this.MemberTotal
          }
        })
        .then(response => {
          let res = response.data;
          if(this.BoxType === "new_member"){
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatPerson(item.columeName,'人')
            })
            this.CurrentMemberTableTop = res.memberCinemaPageInfo.list;
           
            //获取KPI
            let ResKPI = res.memberKpiInfo;
            this.MemberKPIData = ResKPI
          }
          else if(this.BoxType === "member_consume_price"){
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatValue(item.columeName,'元')
            })
            this.CurrentMemberTableTop = res.memberCinemaPageInfo.list;

            //获取会员消费金额
            this.getAmountChart(res)            
          }
          else if(this.BoxType === "member_consume_percent"){
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatValue(item.columeName,'%')
            })
            this.CurrentMemberTableTop = res.memberCinemaPageInfo.list;
            //获取会员消费占比
            this.getPropChart(res)
          }
          else if(this.BoxType === "card_number"){
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatZhang(item.columeName,'张')
            })
            this.CurrentMemberTableTop = res.memberCinemaPageInfo.list;
            //获取开卡数量折线图
            this.getQuantChart(res)
          }
          else if(this.BoxType === "store_price"){
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatValue(item.columeName,'元')
            })
            this.CurrentMemberTableTop = res.memberCinemaPageInfo.list;
            //获取储值金额折线图
            this.getStorageChart(res)
          }
        });
      })
    },
    //会员消费金额
    getAmountChart(res){    
      // 折线图
      this.ChartsAmount.columns = ["日期", "会员消费金额"];
      this.ChartsAmount.rows = res.memberIndex.yAxis.map(item => {
        return {
          日期: item.dateKey,
          会员消费金额: item.memberConsumeAmount
        };
      });
    },
    //会员消费占比
    getPropChart(res){
      // 折线图
      this.ChartsProp.columns = ["日期", "会员消费占比"];
      this.ChartsProp.rows = res.memberIndex.yAxis.map(item => {
        return {
          日期: item.dateKey,
          会员消费占比: item.memberConsumePercent
        };
      });
    },
    getQuantChart(res){
      // 折线图
      this.ChartsOpen.columns = ["日期", "开卡数量"];
      this.ChartsOpen.rows = res.memberIndex.yAxis.map(item => {
        return {
          日期: item.dateKey,
          开卡数量: item.newCardCount
        };
      });
    },
    getStorageChart(res){
      // 折线图
      this.ChartsProfit.columns = ["日期", "储值金额"];
      this.ChartsProfit.rows = res.memberIndex.yAxis.map(item => {
        return {
          日期: item.dateKey,
          储值金额: item.cardProfitAmount
        };
      });
    },
    clickCity(index, row) {
      let cityId = row.cityId;
      this.$router.push({
        path: "/analysis/area/home",
        query: {
          cityId: cityId
        }
      });
    },

  }
  
};
</script>

<style lang="scss" scoped>
#ulMain{
  width:250px;
  list-style-type:none;
  padding:0px;
  margin:0px;
  li{
    line-height:23px;
  }
}
.kip-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .kip {
    width: 100%;
    height: auto;
  }
}
.BoxContainer {
  background: white;
  border-radius: 6px;
  .BoxOffice {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 6px;
    .BoxTitle {
      box-sizing: border-box;
      width: 100%;
      line-height: 40px;
      padding: 0 16px;
      font-size: 16px;
      font-weight: bold;
      .iconfont {
        margin-right: 5px;
        color: #1296db;
        position: relative;
        top: -2px;
      }
      .icon-arrow {
        font-size: 10px;
        color: #3b74ff;
        position: relative;
        top: 0px;
      }
      .tip {
        font-size: 12px;
        color: #3b74ff;
        font-weight: normal;
        vertical-align: middle;
      }
    }
  }
  .right-col {
    height: 151px;
    position: relative;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    .listUl {
      padding: 0px;
      margin: 0px;
      padding-left: 43%;
      li.first-li{
        position: absolute;
        left: 0px;
        width: 43%;
        height: 151px;
        display: flex;
        justify-content: center;
        align-items: center;
        .cont{
          padding:0px;
          h1 {
            margin: 0px;
            color: black;
            font-size: 44px;
            text-align: center;
            display: block;
            margin-top:13px;
          }
          p {
            font-size: 12px;
            color: #333333;
            text-align: center;
          }
        }
      }
      li.active > .cont > p{
        color:#3b74ff;
      } 
      li.active > .cont > h1{
        color:#3b74ff;
      }
      li.active{
        background:#e8efff;
      }
      li.active div{
        color:#3b74ff;
      }
      li.active div > span{
        color:#3b74ff;
      }
      li {
        display: flex;
        justify-content: space-between;
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #f3f3f3;
        div {
          font-size: 12px;
          color: #666666;
          padding: 0px 10px;
          span {
            font-family: "Microsoft YaHei";
            font-size: 18px;
            color: black;
            letter-spacing: -1px;
            font-weight: bold;
            margin-right:3px;
          }
        }
        div.last {
          text-align: right;
        }
      }
    }
    i {
      position: absolute;
      right: 177px;
      bottom: 12px;
      color: #3b74ff;
      font-size: 12px;
    }
  }
}

//iconfont
.ModuleTitle .icon-danchuang-tishi {
  color: #3b74ff;
  font-size: 12px;
  margin-left: 10px;
  position: relative;
  top:-2px
}
.ModuleTable {
  width: 93%;
  margin: 0 auto;
  .el-table {
    .el-table__row {
      td {
        padding: 0px;
        height: 35px;
        line-height: 35px;
      }
    }
  }
}
.ModuleTable {
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
}

.ModuleTable {
  .el-table__header-wrapper {
    .has-gutter {
      tr th {
        padding: 0px;
      }
    }
  }
}
.icon-shouye-huiyuan {
  color: #eb76ff !important;
}

.page {
  text-align: center;
}
.icon-neiye-shangshengjiantou{
  color:green;
}
.icon-neiye-xiajiangjiantou{
  color:red;
}
.el-table .cell > .color{
  color:#3b74ff;
}
.el-table .cell > .color:hover{
  cursor:pointer;
}
.green{
  color:green;
}
.red{
  color:red;
}
.el-pagination{
  padding-bottom:20px;
}
</style>