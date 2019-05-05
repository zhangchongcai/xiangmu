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
              <h1>{{MemberTop.newMember}}</h1>
              <p>新增会员人数</p>
            </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>会员消费金额</div>
          <div>
            <span>{{MemberTop.memberConsumeAmount | capitalizeFloor}}</span>元
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>会员消费占比</div>
          <div>
            <span>{{MemberTop.memberConsumePer}}</span>%
          </div>
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>开卡数量</div>
          <div>
            <span>{{MemberTop.newCardCount}}</span>张
          </div>
        </li>
        <li @click="MeClick('4')" :class="{active:cur==4}">
          <div>储值金额</div>
          <div>
            <span>{{MemberTop.totalStoreAmount}}</span>元
          </div>
        </li>
      </ul>
    </div>
    
    <!--新增会员人数Content-->
    <div class="membership_Container" v-if="cur==0">
      <!--KPI完成率-->
        <div class="ModuleTitleLayout">
          <div class="ModuleTitle">
            <div>
              KPI完成率
              <i class="iconfont icon-danchuang-tishi"></i>
            </div>
            <div class="last">截止:2018/02/21</div>
          </div>
          <div class="kip-wrap">
            <member-dash :MemberKPIvalue="MemberKPIData"></member-dash>
          </div>
        </div>
      <!--新增会员人数 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>新增会员人数趋势</div>
          <div></div>
        </div>
        <ve-line
          :data="lineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table">
          <el-table 
            size="mini" 
            :data="MemberTableTop" 
            border
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="新增会员人数" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}人</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--会员消费金额Content-->
    <div class="membership_Container" v-if="cur==1">
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
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table">
          <el-table 
            size="mini" 
            :data="MemberTableTop" 
            border
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="会员消费金额" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--会员消费占比Content-->
    <div class="membership_Container" v-if="cur==2">
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
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table">
          <el-table size="mini" :data="MemberTableTop" border>
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="会员消费占比" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--开卡数量Content-->
    <div class="membership_Container" v-if="cur==3">
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
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table">
          <el-table size="mini" :data="MemberTableTop" border>
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="开卡数量" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}张</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--储值金额Content-->
    <div class="membership_Container" v-if="cur==4">
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
          :extend="lineExtend"
        ></ve-line>
        
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table">
          <el-table size="mini" :data="MemberTableTop" border>
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="储值金额" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
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
  name: "BoxOffice",
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
    startTime: {
      type:String
    },
    endTime: {
      type:String
    },
    time:{
      type:String
    },
    MemberKPIData:{
      type:Object
    }
  },
  components: {
    MemberDash
  },
  data() {
    return {
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      total:'100',
      BoxType:true,
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
      },
      // 折线图扩展
      lineExtend: {}
    };
  },
  filters: {
    capitalizeOne(value) {
      if (!value) return "";
      value = value / 10000;
      return value.toFixed(2);
    },
    capitalizeTwo(value) {
      if (!value) return "";
      value = value * 100;
      return value.toFixed(2);
    },
    capitalizeFloor(value) {
      if (!value) return "";
      return value.toFixed(2);
    }
  },
  methods: {
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
          //调用票房首页分页数据
          this.getMemberPages('new_member',this.currentPage);
        }
      }
      else if(val === '1'){
        if(this.BoxType){
         //调用会员消费金额指标数据
         this.getMemberTab('member_consume_price');
         //调用会员消费金额分页数据
         this.getMemberPages('member_consume_price',this.currentPage);
        }
      }
      else if(val === '2'){
         if(this.BoxType){
          //调用会员消费占比指标数据
          this.getMemberTab('member_consume_percent');
          //调用会员消费占比分页数据
          this.getMemberPages('member_consume_percent',this.currentPage);
         }
      }
      else if(val === '3'){
        if(this.BoxType){
          //调用开卡数量指标数据
          this.getMemberTab('card_number');
          //调用开卡数量分页数据
          this.getMemberPages('card_number',this.currentPage);
         }
      }
      else if(val === '4'){
        if(this.BoxType){
          //调用储值金额指标数据
          this.getMemberTab('store_price');
          //调用储值金额分页数据
          this.getMemberPages('store_price',this.currentPage);
         }
      }
    },
     // 初始页currentPage、初始每页数据数pagesize和数据data
    handleCurrentChange: function(val){
      this.currentPage = val
      if(this.BoxType === "new_member"){
        //调用会员新增人数分页数据
        this.getMemberPages('new_member',this.currentPage)
      }else if(this.BoxType === "member_consume_price"){
        //调用会员消费金额分页数据
        this.getMemberPages('member_consume_price',this.currentPage)
      }else if(this.BoxType === "member_consume_percent"){
        //调用会员消费占比分页数据
        this.getMemberPages('member_consume_percent',this.currentPage)
      }else if(this.BoxType === "card_number"){
        //调用开卡数量分页数据
        this.getMemberPages('card_number',this.currentPage)
      }
      else if(this.BoxType === "store_price"){
        //调用储值金额分页数据
        this.getMemberPages('store_price',this.currentPage)
      }
    },
    //票房分页公用组件
    getMemberPages(val,currentPage){
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val;

      this.$nextTick(() => {
        this.$camList.MemberPager({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType
          }
        })
        .then(res => {
            let resData = res.memberCinemaPageInfo.list
            this.MemberTablePage = resData;
            this.total = res.memberCinemaPageInfo.total
            this.MemberTableTop = this.MemberTablePage; 
        });
      })
    },
    //指标切换接口
    getMemberTab (val) {  
      this.BoxType = val
      this.$nextTick(() => {
        this.$camList.SwitchMemberTab({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType
          }
        })
        .then(res => {
          //获取总数据
          if(this.BoxType === "new_member"){
            let resData = res.memberCinemaPageInfo.list;
            //把数据赋值到新变量
            this.MemberTableMain = resData;
            this.MemberTableTop = this.MemberTableMain
          } 
          else if(this.BoxType === "member_consume_price"){
            let resData = res.memberCinemaPageInfo.list;
            //把数据赋值到新变量
            this.MemberTableMain = resData;
            this.MemberTableTop = this.MemberTableMain
            //获取会员消费金额
            this.getAmountChart(res)            
          }
          else if(this.BoxType === "member_consume_percent"){
            let resData = res.memberCinemaPageInfo.list;
            //把数据赋值到新变量
            this.MemberTableMain = resData;
            this.MemberTableTop = this.MemberTableMain
            //获取会员消费占比
            this.getPropChart(res)
            
          }
          else if(this.BoxType === "card_number"){
            let resData = res.memberCinemaPageInfo.list;
            //把数据赋值到新变量
            this.MemberTableMain = resData;
            this.MemberTableTop = this.MemberTableMain
            //获取开卡数量折线图
            this.getQuantChart(res)
          }
          else if(this.BoxType === "store_price"){
            let resData = res.memberCinemaPageInfo.list;
            //把数据赋值到新变量
            this.MemberTableMain = resData;
            this.MemberTableTop = this.MemberTableMain
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
        path: "/area/home",
        query: {
          cityId: cityId
        }
      });
    },

  }
  
};
</script>

<style lang="scss" scoped>
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
.el-table .cell > .color:hover{
  color:#3b74ff;
  cursor:pointer;
}
.green{
  color:green;
}
.red{
  color:red;
}
</style>