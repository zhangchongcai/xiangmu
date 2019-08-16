 <template>
   <div class="film-edit-wrap">
     <div class="film-edit-content">
       <el-collapse v-model="activeNames">
         <el-form :inline=true label-width="100px" size="small" class="demo-ruleForm">
           <el-collapse-item title="基础信息" name="1">
             <div class="basic-info">
               <el-form-item label="单据编号">
                 <span class="download-film-scan-text">
                   {{totalData.timeCode}}
                 </span>
               </el-form-item>
               <el-form-item label="备用金：" prop="movieCode">
                 <span class="download-film-scan-text">
                   {{Number(totalData.preAmount).toFixed(2)}}元
                 </span>
               </el-form-item>
               <el-form-item label="收银员：" prop="movieDescLanguage">
                 <span class="download-film-scan-text">
                   {{totalData.workerName}}
                 </span>
               </el-form-item>
               <el-form-item label="统计时间：" prop="disVersion">
                 <span class="download-film-scan-text">
                   {{totalData.workStartTime}}-{{totalData.workEndTime	}}
                 </span>
               </el-form-item>
               <el-form-item label="票纸编号：" prop="movieArea">
                 <span class="download-film-scan-text">
                   {{totalData.tpCodeStart}}-{{totalData.tpCodeEnd}}
                 </span>
               </el-form-item>
               <el-form-item label="制单人：" prop="movieClass">
                 <span class="download-film-scan-text">
                   {{totalData.createUserName}}
                 </span>
               </el-form-item>
               <el-form-item label="清机人" prop="movieClass">
                 <span class="download-film-scan-text">
                   {{totalData.updateUserName}}
                 </span>
               </el-form-item>
             </div>
           </el-collapse-item>
           <el-collapse-item title="领用记录" name="2">
             <p class="table-detail" @click="thingDetail">查看领用明细</p>
             <div class="basic-info">
               <el-table :data="getThings" style="width: 100%" :stripe="true" border>
                 <el-table-column prop="thingName" label="领用物品" width="180">
                 </el-table-column>
                 <el-table-column prop="thingCount" label="领用数量" width="180">
                 </el-table-column>
                 <el-table-column prop="retThingCount" label="退还数量">
                 </el-table-column>
                 <el-table-column prop="sellCount" label="售出数量">
                 </el-table-column>
                 <el-table-column prop="remark" label="备注">
                 </el-table-column>
               </el-table>
             </div>
           </el-collapse-item>
         </el-form>
         <el-collapse-item title="资金收入统计" name="3" v-show="isCanSee">
           <p>单位：元</p>
           <div class="flex_div">
             <ul class="ul_line">
               <li></li>
               <li></li>
               <li></li>
               <li></li>
               <li></li>
               <li></li>
               <div class="plan_money">
                 <p class="plan_number">{{Number( totalData.shouldAmount).toFixed(2)}}</p>
               </div>
               <div class="actual_money">
                 <p class="actual_number">{{ Number(totalData.realAmount).toFixed(2)}}</p>
               </div>
               <div class="beyond_money">
                 <p class="beyond_number">{{Number(totalData.realAmount).toFixed(2)}}</p>
               </div>
               <i class="iconfont icon-icon-youjiantou"></i>
             </ul>
             <div class="num_div">
               <p class="tip_word">收入合计差异</p>
               <p class="num_word"><span class="is_more">多</span><span
                   class="num_span">{{countAmount.toFixed(2)}}</span></p>
               <p class="tip_word2">【收入差异=实收金额-应收金额】</p>
               <el-button type="primary" @click="moneyAdjust">资金收入调整</el-button>
             </div>
           </div>
           <!-- 实际金额 -->
           <div class="table_div">
             <ul class="plan_money">
               <li :class="totalData.realXrmbAmount!= totalData.saleBillPayFlowVo.xrmbAmount? 'special_li':''" @click="openMoney">
                 <p> {{Number(totalData.realXrmbAmount).toFixed(2)}}</p>
                 <p>现金</p>
               </li>
               <li :class="totalData.bandCardTotal!= totalData.saleBillPayFlowVo.xunpAmount? 'special_li':''" style="cursor:default">
                 <p>{{Number(totalData.bandCardTotal).toFixed(2)}}</p>
                 <p>银行卡</p>
               </li>
               <li @click="openAlipay('支付宝收入','ALIPAY')">
                 <p>{{Number(totalData.saleBillPayFlowVo.alipayAmount).toFixed(2)}}</p>
                 <p>支付宝</p>
               </li>
               <li @click="openAlipay('微信收入','WXPAY')">
                 <p>{{Number(totalData.saleBillPayFlowVo.wxpayAmount).toFixed(2)}}</p>
                 <p>微信</p>
               </li>
               <li @click="openAlipay('会员收入','0X03')">
                 <p>{{Number(totalData.saleBillPayFlowVo.memPayAmount).toFixed(2)}}</p>
                 <p>会员</p>
               </li>
               <li @click="openAlipay('票券收入','0X09')">
                 <p>{{Number(totalData.saleBillPayFlowVo.ticketPayAmount).toFixed(2)}}</p>
                 <p>票券</p>
               </li>
               <li @click="openAlipay('其他收入','OTHERS')">
                 <p>{{Number(totalData.saleBillPayFlowVo.otherPayAmount).toFixed(2)}}</p>
                 <p>其他</p>
               </li>
               <li :class="totalData.fundChangeAmount!= 0? 'special_li':''" @click="moneyAdjust">
                 <p>{{Number(totalData.fundChangeAmount).toFixed(2)}}</p>
                 <p>资金调整单</p>
               </li>
               <div class="finally_div">
                 <i class="iconfont icon-icon-youjiantou"></i>
                 <p>
                   <span class="nums">{{Number(totalData.realAmount).toFixed(2)}}</span>
                   <span class="words">实收金额合计</span>
                 </p>
               </div>
             </ul>
             <!-- 应收金额 -->
             <ul class="actual_money">
               <li class="special_li" @click="openAlipay('现金收入','XRMB')">
                 <p>{{Number(totalData.saleBillPayFlowVo.xrmbAmount).toFixed(2)}}</p>
                 <p>现金</p>
               </li>
               <li class="special_li" @click="openAlipay('银行卡收入','XUNP')">
                 <p>{{Number(totalData.saleBillPayFlowVo.xunpAmount).toFixed(2)}}</p>
                 <p>银行卡</p>
               </li>
               <li @click="openAlipay('支付宝收入','ALIPAY')">
                 <p>{{Number(totalData.saleBillPayFlowVo.alipayAmount).toFixed(2)}}</p>
                 <p>支付宝</p>
               </li>
               <li @click="openAlipay('微信收入','WXPAY')">
                 <p>{{Number(totalData.saleBillPayFlowVo.wxpayAmount).toFixed(2)}}</p>
                 <p>微信</p>
               </li>
               <li @click="openAlipay('会员收入','0X03')">
                 <p>{{Number(totalData.saleBillPayFlowVo.memPayAmount).toFixed(2)}}</p>
                 <p>会员</p>
               </li>
               <li @click="openAlipay('票券收入','0X09')">
                 <p>{{Number(totalData.saleBillPayFlowVo.ticketPayAmount).toFixed(2)}}</p>
                 <p>票券</p>
               </li>
               <li @click="openAlipay('其他收入','OTHERS')">
                 <p>{{Number(totalData.saleBillPayFlowVo.otherPayAmount).toFixed(2)}}</p>
                 <p>其他</p>
               </li>
               <li style="opacity: 0;cursor:default">

               </li>
               <div class="finally_div">
                 <i class="iconfont icon-icon-youjiantou"></i>
                 <p>
                   <span class="nums">{{Number(totalData.shouldAmount).toFixed(2) }}</span>
                   <span class="words">应收金额合计</span>
                 </p>
               </div>
             </ul>
             <ul class="big_ul">
               <li @click="openBoxOffice">
                 <p>{{Number(totalData.movieTicketAmount).toFixed(2)}}</p>
                 <p>电影票销售</p>
               </li>
               <li @click="openGoods">
                 <p>{{Number(totalData.merAmount).toFixed(2)}}</p>
                 <p>卖品销售</p>
               </li>
               <li @click="openVipDetail">
                 <p>{{Number(totalData.memberAmount).toFixed(2)}}</p>
                 <p>会员业务</p>
               </li>
               <li @click="openTicket">
                 <p>{{Number(totalData.ticketAmount).toFixed(2)}}</p>
                 <p>票券销售</p>
               </li>
               <li @click="openOther">
                 <p>{{Number(totalData.otherAmount).toFixed(2)}}</p>
                 <p>其他销售</p>
               </li>
               <div class="finally_div">
                 <i class="iconfont icon-icon-youjiantou"></i>
                 <p>
                   <span class="nums">{{Number(totalData.saleAmount).toFixed(2)}}</span>
                   <span class="words">销售金额合计</span>
                 </p>
               </div>
             </ul>
           </div>
           <p>备注</p>
           <el-input placeholder="请输入内容" v-model="totalData.remark" clearable style="width:918px;"
             :disabled="!parentPage">
           </el-input>
         </el-collapse-item>
         <!-- <el-collapse-item title="销售报表" name="4">
          <div class="basic-info">
            <p>支付明细</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px;" border :stripe="true" :show-summary="true">
              <el-table-column prop="date" label="支付方式">
              </el-table-column>
              <el-table-column prop="name" label="金额">
              </el-table-column>
            </el-table>
            <p>票券回收明细</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" border :stripe="true" :show-summary="true">
              <el-table-column prop="date" label="票券名称">
              </el-table-column>
              <el-table-column prop="name" label="回收数量">
              </el-table-column>
              <el-table-column prop="name" label="抵用金额（元）">
              </el-table-column>
            </el-table>
            <p>卖品销售明细</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" border :stripe="true" :show-summary="true">
              <el-table-column prop="date" label="商品名称">
              </el-table-column>
              <el-table-column prop="name" label="销售数量">
              </el-table-column>
              <el-table-column prop="name" label="销售金额（元）">
              </el-table-column>
            </el-table>
            <p>票券销售明细</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" border :stripe="true" :show-summary="true">
              <el-table-column prop="date" label="票券名称">
              </el-table-column>
              <el-table-column prop="name" label="销售数量">
              </el-table-column>
              <el-table-column prop="name" label="抵用金额（元）">
              </el-table-column>
            </el-table>
            <p>取票退票</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" border :stripe="true" :show-summary="true">
              <el-table-column prop="date" label="影片名称">
              </el-table-column>
              <el-table-column prop="name" label="取票数量">
              </el-table-column>
              <el-table-column prop="date" label="取票金额（元）">
              </el-table-column>
              <el-table-column prop="name" label="退票数量">
              </el-table-column>
              <el-table-column prop="name" label="退票金额（元）">
              </el-table-column>
            </el-table>
            <p>取货退货</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" border :stripe="true" :show-summary="true">
              <el-table-column prop="date" label="商品名称">
              </el-table-column>
              <el-table-column prop="name" label="取票数量">
              </el-table-column>
              <el-table-column prop="date" label="取货金额（元）">
              </el-table-column>
              <el-table-column prop="name" label="退货数量">
              </el-table-column>
              <el-table-column prop="name" label="退货金额（元）">
              </el-table-column>
            </el-table>
            <p>会员服务</p>
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px" border :stripe="true" :show-summary="true"
              class="middle_table">
              <el-table-column prop="date" label="会员等级">
              </el-table-column>
              <el-table-column prop="name" label="开卡">
                <el-table-column prop="date" label="数量">
                </el-table-column>
                <el-table-column prop="date" label="充值金额">
                </el-table-column>
                <el-table-column prop="date" label="工本费">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="充值（含冲销）">
                <el-table-column prop="date" label="数量">
                </el-table-column>
                <el-table-column prop="date" label="充值金额">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="name" label="升级换卡">
                <el-table-column prop="date" label="数量">
                </el-table-column>
                <el-table-column prop="date" label="充值金额">
                </el-table-column>
                <el-table-column prop="date" label="工本费">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="name" label="补卡">
                <el-table-column prop="address" label="数量">
                </el-table-column>
                <el-table-column prop="date" label="充值金额">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="name" label="注销">
                <el-table-column prop="date" label="数量">
                </el-table-column>
                <el-table-column prop="date" label="充值金额">
                </el-table-column>
                <el-table-column prop="date" label="工本费">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="总金额">
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item> -->
       </el-collapse>
       <div style="height:64px;"></div>
       <div class="bottom-handler-tool">
         <div class="btn-area">
           <el-button type="primary" v-if="parentPage" @click="clearFinish">班次完成</el-button>
           <el-button type="primary" @click="moneyAdjust">资金调整单</el-button>
           <el-button @click="$router.go(-1)">返回</el-button>
         </div>
       </div>
     </div>
     <!-- <fixStepTool :stepData="stepData.stepList"></fixStepTool> -->
     <ShowDialog ref="showDialog" :dialogTableVisible.sync="dialogTableVisible" :title="title" :showData="totalData"
       :gridData="gridData" :pageData="pageData" :parentDialog="parentDialog"
       @changeDialogTableVisible="changeDialogTableVisible" @changeCurrentPage="changeCurrentPage"
       @searchInfo="searchInfo"></ShowDialog>
     <ShowBigDialog ref="bigDialog" :dialogTableVisible2.sync="dialogTableVisible2" :title="title" :showData="totalData"
       :gridData="gridData" :pageData="pageData" :parentDialog="parentDialog" :tipsword="tipsword"
       @changeDialogTableVisible2="changeDialogTableVisible2" @changeCurrentPage="changeCurrentPage"
       @searchInfo="searchInfo"></ShowBigDialog>
   </div>
 </template>
 <script>
   import ShowDialog from "../public/showDialog"
   import ShowBigDialog from "../public/showBigDialog"
   import FixStepTool from "../public/fix-step-tool"
   import fixStepMixin from "../public/fixStepTool.js"
   export default {
     data() {
       return {
         activeNames: ["1", "2", "3", "4"],
         totalData: {
           saleBillPayFlowVo: {}
         },
         getThings: [], //领用物品
         countAmount: 0, // 差值
         stepData: {
           stepEl: ".el-collapse-item",
           stepList: [{
               name: "基础信息",
               isactive: false
             },
             {
               name: "领用详情",
               isactive: false
             },
             {
               name: "资金收入统计",
               isactive: false
             }
           ]
         },
         // 弹窗的变量
         dialogTableVisible: false,
         dialogTableVisible2: false,
         title: "",
         payTypeQuery: "",
         gridData: [],
         thingGridData: [],
         pageData: {},
         current: 1,
         size: 10,
         parentDialog: "",
         isbig: false,
         tips: [{}],
         tipsword: "",
         // 
         tableData: [{
           date: '2016-05-02',
           name: '王小虎',
           address: 1.00
         }],
         // remark: "",
         parentPage: false, // 班次按钮是否要
         vipsellType: {
           MEMBER_REG: "会员开卡",
           RECHARGE: "会员充值",
           REVERSING: "充值冲销",
           PATCH_CARD: "会员补卡",
           CHANGE_CARD: "升级换卡",
           MEMBER_LOGOUT: "会员注销",
           ACTIVE_CARD: "会员激活"
         }, // vip
         transactionType: {
           0: "退货",
           1: "商品销售",
           2: "会员服务",
           3: "赠送",
           4: "报损",
           5: "留座",
           6: "影票补登",
           21: "会员开卡",
           22: "会员充值",
           23: "会员补卡",
           24: "会员注销",
           25: "升级换卡",
           26: "充值冲销",
           27: "会员激活",
           28: "余额结转"
         },
         isCanSee: false
       };
     },
     mixins: [fixStepMixin],
     components: {
       fixStepTool: FixStepTool,
       ShowDialog,
       ShowBigDialog
     },
     methods: {
       changeDialogTableVisible(val) {
         this.dialogTableVisible = val;
       },
       changeDialogTableVisible2(val) {
         this.dialogTableVisible2 = val;
         console.log(val)
       },
       // 改变当前页
       changeCurrentPage(val) {
         console.log(val)
         switch (this.parentDialog) {
           case "isboxOffice":
             this.openBoxOffice(this.searchInfo, val, this.size)
             break;
           case "isGood":
             this.openGoods(this.searchInfo, val, this.size)
             break;
           case "isvipDetail":
             this.openVipDetail(this.searchInfo, val, this.size)
             break;
           case "isTicket":
             this.openTicket(this.searchInfo, val, this.size)
             break;
           case "isOther":
             this.openOther(this.searchInfo, val, this.size)
             break;
           case "isAlipay":
             this.openAlipay(this.title, this.payTypeQuery, this.searchInfo, val, this.size)
             break;
           default:
             break;
         }
         // this.getThingsDetail(val);
       },
       // 弹窗的搜索
       searchInfo(val) {
         switch (this.parentDialog) {
           //  销售金额合计 弹窗 
           case "isboxOffice":
             this.openBoxOffice(val, this.current, this.size)
             break;
           case "isGood":
             this.openGoods(val, this.current, this.size)
             break;
           case "isvipDetail":
             this.openVipDetail(val, this.current, this.size)
             break;
           case "isTicket":
             this.openTicket(val, this.current, this.size)
             break;
           case "isOther":
             this.openOther(val, this.current, this.size)
             break;
             // 支付宝 弹窗
           case "isAlipay":
             this.openAlipay(this.title, this.payTypeQuery, val, this.current, this.size)
             break;
           default:
             break;
         }
         console.log(val)
       },
       // 班次详情
       clearDetail() {
         let limit = {
           workTimeUid: this.$route.query.uid
         };
         this.$csmList.clearDetail(Object.assign({}, limit))
           .then(data => {
             if (data && data.code === 200) {
               this.totalData = data.data;
              //  this.totalData.saleBillPayFlowVo.xrmbAmount =22;
               console.log(this.totalData.saleBillPayFlowVo)
               this.totalData.saleBillPayFlowVo ? this.isCanSee = true : this.totalData.saleBillPayFlowVo = {}
               this.getThings.push(...data.data.timeGetThings) // 领用物品
               this.getThings.forEach(item => {
                 // item.retThingCount = null 
                 if (item.retThingCount === null) {
                   item.sellCount = null
                   return;
                 }
                 item.sellCount = Number(item.thingCount) - Number(item.retThingCount)
               })
               const planEl = document.querySelector('.flex_div .plan_money');
               const actualEl = document.querySelector('.flex_div .actual_money');
               const beyondEl = document.querySelector('.flex_div .beyond_money');
               let shouldAmount = Number(this.totalData.shouldAmount).toFixed(2);
               // this.totalData.realAmount = 0;
               let realAmount = Number(this.totalData.realAmount).toFixed(2);
               // let realAmount = 200;
               let countAmount = shouldAmount - realAmount;
               console.log(countAmount)
               this.countAmount = Math.abs(countAmount)
               // console.log(countAmount)
               if (countAmount < 0) {
                 // 实际收的多于应收的
                 planEl.style.height = `${400*(shouldAmount/realAmount)}px`
                 actualEl.style.height = `${400*(shouldAmount/realAmount)}px`
                 beyondEl.style.bottom = `${400*(shouldAmount/realAmount)+80}px`
                 beyondEl.style.height = `${400-400*(shouldAmount/realAmount)}px`
                 actualEl.firstElementChild.style.display = "none"
               } else if (countAmount == 0) {
                 console.log(realAmount, realAmount == 0)
                 if (realAmount == 0) {
                   planEl.style.height = 0;
                   actualEl.style.height = 0;
                   beyondEl.style.display = "none";
                   document.querySelector(".is_more").style.display = "none"
                   return;
                 }
                 planEl.style.height = `${400*(shouldAmount/realAmount)}px`
                 actualEl.style.height = `${400*(shouldAmount/realAmount)}px`
                 beyondEl.style.display = "none";
                 document.querySelector(".is_more").style.display = "none"
               } else {
                 planEl.style.height = "400px";
                 actualEl.style.height = `${400*(realAmount/shouldAmount)}px`;
                 beyondEl.style.height = `${400-400*(realAmount/shouldAmount)}px`;
                 beyondEl.style.bottom = `${400*(realAmount/shouldAmount)+80}px`
                 beyondEl.firstElementChild.style.display = "none";
                 actualEl.firstElementChild.style.zIndex = "99";
                 document.querySelector(".is_more").textContent = "少"
                if(this.totalData.realAmount < 0){
                  actualEl.style.height = 0;
                  beyondEl.style.height = 0
                 }
               }
               console.log(this.totalData.shouldAmount, this.totalData.realAmount)
             }
           })
       },

       thingDetail() {
         this.dialogTableVisible = true;
         this.title = "领用明细";
         this.gridData = this.thingGridData;
         this.parentDialog = "isDetail"
       },
       // 打开现金收入
       openMoney() {
         this.dialogTableVisible = true;
         this.title = "现金收入";
         this.parentDialog = "isCash";
         this.$csmList.actualCash({
             workTimeUid: this.$route.query.uid
           })
           .then(data => {
             if (data && data.code === 200) {
               this.gridData = data.data.list;
               this.gridData.forEach(item => {
                 item.operateType = item.operateType == 1 ? '清机交付' : item.operateType == 2 ? '抽钞' : '扣除备用金'
               })
               // this.$refs.showDialog.$refs.borderDiv.style.height = "460px";
               console.log(data)
             }
           })
       },
       // 打开支付宝
       openAlipay(title, payTypeQuery, search, current = 1, size = this.size) {
         console.log(payTypeQuery)
        //  if (payTypeQuery == '0X03') {
        //    this.$refs.showDialog.isVip = true;
        //  } else {
        //    this.$refs.showDialog.isVip = false;
        //  }
         this.$refs.showDialog.payTypeQuery = payTypeQuery;
         this.dialogTableVisible = true;
         this.payTypeQuery = payTypeQuery;
         this.title = title;
         this.parentDialog = "isAlipay";
         let limit = {
           workTimeUid: this.$route.query.uid,
           payTypeQuery,
         };
         this.$csmList.payTotal(Object.assign({}, limit, search), current, size)
           .then(data => {
             console.log(data)
             this.gridData = data.data.records.records;
             this.gridData.forEach(item => {
               item.transactionType = this.transactionType[item.transactionType]
               item.payAmount = Number(item.payAmount).toFixed(2);
             })
             this.pageData = data.data.records;
           })
       },
       // 打开电影票销售
       openBoxOffice(search, current = 1, size = 10) {
         this.dialogTableVisible2 = true;
         this.title = "票房收入明细"
         this.parentDialog = "isboxOffice"
         let limit = {
           workTimeUid: this.$route.query.uid,
         };
         this.$csmList.filmSell(Object.assign({}, limit, search), current, size)
           .then(data => {
             this.gridData = data.data.records.records;
             this.gridData.forEach(item => {
               item.saleType = item.saleType == "1" ? "销售" : item.saleType == "2" ? "退票" : "补登";
               item.filmTime = item.hallName + item.showTime; // 场次
               item.position = `${item.seatRowNo}排${item.seatColumnNo}号` //位置
               item.ticketPrice = Number(item.ticketPrice).toFixed(2)
               item.getInfo = item.getInfo == "1" ? "已取票" : item.getInfo == "0" ? "未取票" : "已退票";
             })
             this.pageData = data.data.records;
             this.tipsword = ""
             this.tips = data.data.payInfo;
             // this.tips = this.tips.concat(this.tips)
             this.tips.map(item => {
               item.tip = `${item.payTypeName }:${Number(item.totalAmount).toFixed(2)};`
             })
             // this.tips = this.tips.slice(0,1)
             console.log(this.tips)
             this.$refs.bigDialog.totalAmount = data.data.totalAmount // 传入的合计值
             this.$refs.bigDialog.totalNum = data.data.totalNum // 传入的合计值
             // this.tipsword = `${data.data.totalAmount}元`
             if (this.tips.length > 0) {
               if (this.tips.length == 1) {
                 this.tipsword = this.tips[0].tip.slice(0, length - 1)
               } else {
                 this.tips.forEach(item => {
                   this.tipsword += item.tip
                 })
                 this.tipsword = this.tipsword.slice(0, length - 1)
               }
             } else {
               this.tipsword = ""
             }
           })
       },
       // 打开卖品销售
       openGoods(search, current = 1, size = 10) {
         this.dialogTableVisible2 = true;
         this.title = "卖品收入明细"
         this.parentDialog = "isGood"
         let limit = {
           workTimeUid: this.$route.query.uid,
         };
         this.$csmList.goodsSell(Object.assign({}, limit, search), current, size)
           .then(data => {
             console.log(data)
             this.tipsword = ""
             this.gridData = data.data.records.records;
             this.gridData.forEach(item => {
               item.merName = item.skuName?`${item.merName} ${item.skuName}`:item.merName // 商品名称
               item.saleType = item.saleType == "1" ? "销售" : item.saleType == "2" ? "退票" : "补登";
               item.numPrice = Number(item.salePrice * Math.abs(Number(item.saleNum))).toFixed(2); // 金额
               // item.position = `${item.seatColumnNo}排${item.seatRowNo}号` //位置
               item.salePrice = Number(item.salePrice).toFixed(2)
               item.getInfo = item.getInfo == "1" ? "已取货" : item.getInfo == "0" ? "未取货" : "已退货";
             })
             this.$refs.bigDialog.totalAmount = data.data.totalAmount // 传入的合计值
             this.$refs.bigDialog.totalNum = data.data.totalNum // 传入的合计值
             this.pageData = data.data.records;
             this.tips = data.data.payInfo;
             this.tips.map(item => {
               item.tip = `${item.payTypeName }:${ item.totalAmount};`
             })
             if (this.tips.length > 0) {
               if (this.tips.length == 1) {
                 this.tipsword = this.tips[0].tip.slice(0, length - 1)
               } else {
                 this.tips.forEach(item => {
                   this.tipsword += item.tip
                 })
                 this.tipsword = this.tipsword.slice(0, length - 1)
               }
             } else {
               this.tipsword = ""
             }
           })
       },
       // 会员开卡充值明细
       openVipDetail(search, current = this.current, size = this.size) {
         this.dialogTableVisible2 = true;
         this.title = "会员开卡充值明细"

         this.parentDialog = "isvipDetail"
         let limit = {
           workTimeUid: this.$route.query.uid,
         };
         this.$csmList.vipSell(Object.assign({}, limit, search), current, size)
           .then(data => {
             console.log(data)
             this.gridData = data.data.records.records;
             this.tipsword = ""
             this.gridData.forEach(item => {
               item.saleType = item.saleType == "1" ? "销售" : item.saleType == "2" ? "退票" : "补登";
               item.sellType = this.vipsellType[item.serviceType]
               item.payPrice = Number(item.payPrice).toFixed(2);
               switch (item.serviceType) {
                 case "MEMBER_REG":
                   item.bookCost = item.payPrice;
                   item.rebackCost = "--"
                   break;
                 case "CHANGE_CARD":
                   item.bookCost = item.payPrice;
                   item.rebackCost = "--"
                   break;
                 case "PATCH_CARD":
                   item.bookCost = item.payPrice;
                   item.rebackCost = "--"
                   break;
                 default:
                   item.bookCost = "--"
                   item.rebackCost = item.payPrice;
                   break;
               }
             })
             this.$refs.bigDialog.totalAmount = data.data.totalAmount // 传入的合计值
             this.$refs.bigDialog.totalNum = data.data.totalNum // 传入的合计值
             this.pageData = data.data.records;
             this.tips = data.data.payInfo;
             this.tips.map(item => {
               item.tip = `${item.payTypeName }:${ item.totalAmount};`
             })
             if (this.tips.length > 0) {
               if (this.tips.length == 1) {
                 this.tipsword = this.tips[0].tip.slice(0, length - 1)
               } else {
                 this.tips.forEach(item => {
                   this.tipsword += item.tip
                 })
                 this.tipsword = this.tipsword.slice(0, length - 1)
               }
             } else {
               this.tipsword = ""
             }
           })
       },
       // 票券销售明细
       openTicket(search, current = this.current, size = this.size) {
         this.dialogTableVisible2 = true;
         this.title = "票券销售明细"
         this.parentDialog = "isTicket";
         let limit = {
           workTimeUid: this.$route.query.uid,
         };
         this.$csmList.ticketSell(Object.assign({}, limit, search), current, size)
           .then(data => {
             console.log(data)
             this.gridData = data.data.records.records;
             this.tipsword = ""
             this.gridData.forEach(item => {
               item.saleNum = 1;
               item.numPrice = item.payPrice * item.saleNum;
               item.saleType = item.saleType == "1" ? "销售" : item.saleType == "2" ? "退票" : "补登";
               // item.sellType = this.vipsellType[item.serviceType]
               // item.payPrice = Number(item.payPrice).toFixed(2);

             })
             this.$refs.bigDialog.totalAmount = data.data.totalAmount // 传入的合计值
             this.$refs.bigDialog.totalNum = data.data.totalNum // 传入的合计值
             this.pageData = data.data.records;
             this.tips = data.data.payInfo;
             this.tips.map(item => {
               item.tip = `${item.payTypeName }:${ item.totalAmount};`
             })
             if (this.tips.length > 0) {
               if (this.tips.length == 1) {
                 this.tipsword = this.tips[0].tip.slice(0, length - 1)
               } else {
                 this.tips.forEach(item => {
                   this.tipsword += item.tip
                 })
                 this.tipsword = this.tipsword.slice(0, length - 1)
               }
             } else {
               this.tipsword = ""
             }
           })
       },
       // 其他销售明细
       openOther(search, current = this.current, size = this.size) {
         this.dialogTableVisible2 = true;
         this.title = "其他销售明细"
         this.parentDialog = "isOther";
         let limit = {
           workTimeUid: this.$route.query.uid,
         };
         this.$csmList.otherSell(Object.assign({}, limit, search), current, size)
           .then(data => {
             console.log(data)
             this.gridData = data.data.records.records;
             this.gridData.forEach(item => {
               item.goodsType = item.goodsType == "5" ? "网络代售费" : "增值服务费"; // 商品类型
               item.numPrice = item.saleType == "2" ? Number(item.salePrice * item.saleNum * -1).toFixed(2) :
                 Number(item.salePrice * item.saleNum).toFixed(2); // 金额
               item.saleType = item.saleType == "1" ? "销售" : item.saleType == "2" ? "退票" : "补登";
             })
             this.$refs.bigDialog.totalAmount = data.data.totalAmount // 传入的合计值
             this.$refs.bigDialog.totalNum = data.data.totalNum // 传入的合计值
             this.pageData = data.data.records;
             this.tipsword = ""
             this.tips = data.data.payInfo;
             this.tips.map(item => {
               item.tip = `${item.payTypeName }:${ item.totalAmount};`
             })
             if (this.tips.length > 0) {
               if (this.tips.length == 1) {
                 this.tipsword = this.tips[0].tip.slice(0, length - 1)
               } else {
                 this.tips.forEach(item => {
                   this.tipsword += item.tip
                 })
                 this.tipsword = this.tipsword.slice(0, length - 1)
               }
             } else {
               this.tipsword = ""
             }
           })
       },
       // 资金调整
       moneyAdjust() {
         this.$router.push({
           path: 'moneyAdjust',
           query: this.$route.query
         })
       },
       // 获取领用明细
       getThingsDetail(current) {
         let limit = {
           workTimeUid: this.$route.query.uid,
           current,
           size: 10
         };
         this.$csmList.thingDetail(Object.assign({}, limit))
           .then(data => {
             if (data && data.code === 200) {
               this.thingGridData = [];
               this.thingGridData.push(...data.data.records);
               this.gridData = this.thingGridData
               this.pageData = data.data;
               console.log(this.pageData)
             }
           })
       },
       // 班次完结
       clearFinish() {
         let limit = {
           remark: this.totalData.remark,
           uid: this.$route.query.uid
         };
         if (this.countAmount != 0 && !this.totalData.remark) {
           this.$message({
             message: '存在收入合计差异，请在备注中说明原因',
             type: 'warning'
           });
           return;
         }
         this.$csmList.clearFinish(Object.assign({}, limit))
           .then(data => {
             if (data && data.code === 200) {
               this.$router.push({
                 path: "list"
               })
             }
           })
       }
     },
     created() {
       this.clearDetail();
       console.log(this.$route.query)
       this.getThingsDetail(this.current);
       this.$route.query.parentPage == 'clear' ? this.parentPage = true : '';
     }
   };
 </script>
 <style lang='scss' type="text/css" scoped>
   .film-edit-wrap {
     width: 100%;
     position: relative;

     .film-edit-breadcrumb {
       margin-left: 24px;
       margin-top: 10px;
       margin-bottom: 10px;
     }

     .table-detail {
       width: 918px;
       color: #3b74ff;
       font-size: 14px;
       text-align: right;
       cursor: pointer;
       padding: 0 1em 1em;
     }

     .basic-info {
       width: 918px;
       margin-left: 30px;

       .el-form-item__label {
         font-size: 12px;
         text-align: left;
       }

       .el-form-item {
         width: 350px;
       }

       .el-select,
       .el-textarea,
       .el-input__inner {
         width: 360px;
       }

       .el-form-item__label {
         font-size: 12px;
       }

       .download-film-scan-text {
         font-size: 12px;
         color: #808080;
         width: 360px;
       }

       .film-edit-text {
         font-size: 12px;
         color: #808080;
       }
     }

     .film-info-save {
       text-align: center;
       margin-top: 12px;
       margin-bottom: 12px;
     }

     //新button样式
     .bottom-handler-tool {
       height: 64px;
       width: 100%;
       // position: fixed;
       z-index: 999;
       bottom: 0;
       right: 0;
       // background-color: #f5f5f5;

       .btn-area {
         width: 500px;
         margin: 0 auto;
         height: 64px;
         text-align: center;
         padding-top: 16px;
         box-sizing: border-box;
       }
     }

     //设置折叠框箭头和位置
     .el-collapse-item__arrow {
       margin: 0 8px 0;
       transform: rotate(-90deg);
       float: left;
     }

     .el-collapse-item__arrow.is-active {
       transform: rotate(90deg);
     }

     .el-collapse-item__wrap {
       border: 1px solid #ffffff;
     }

     .flex_div {
       display: flex;
     }

     // 柱状图
     .ul_line {
       padding: 40px 0 0 80px;
       position: relative;

       // width: 880px;
       // 展示信息栏
       .icon-icon-youjiantou::before {
         font-size: 36px;
         color: rgb(255, 110, 60);
         position: absolute;
         top: 88px;
         right: 15px;
       }

       li {
         width: 520px;
         border-top: 1px solid #eaeaea;
         height: 80px;
         box-sizing: border-box;
         // cursor: pointer;
       }

       div {
         width: 150px;
         height: 240px;
         background-color: rgb(93, 140, 254);
         position: absolute;
         border-radius: 5px;
         bottom: 80px;
         box-sizing: border-box;
       }

       .plan_money {
         left: 150px;
         position: absolute;

         .plan_number {
           height: 32px;
           line-height: 32px;
           position: relative;
           top: -32px;
           text-align: center;
         }

         &::after {
           display: block;
           content: '应收金额';
           position: absolute;
           width: 100%;
           text-align: center;
           line-height: 32px;
           bottom: -40px;
         }
       }

       .actual_money {
         left: 380px;
         background-color: rgb(145, 177, 254);

         .actual_number {
           height: 32px;
           line-height: 32px;
           position: relative;
           top: -32px;
           text-align: center;
         }

         &::after {
           display: block;
           content: '实收金额';
           position: absolute;
           width: 100%;
           text-align: center;
           line-height: 32px;
           bottom: -40px;
         }
       }

       .beyond_money {
         height: 160px;
         left: 380px;
         bottom: 320px;
         background: #fff;
         border: 1px dashed rgb(255, 170, 140);
         border-bottom: none;
         position: absolute;

         .beyond_number {
           height: 32px;
           line-height: 32px;
           position: relative;
           top: -32px;
           text-align: center;
         }
       }
     }



     .num_div {
       width: 300px;
       height: 214px;
       border: 1px dashed rgb(255, 170, 140);
       border-radius: 5px;
       margin-top: 40px;
       padding: 1.5em 2em;
       box-sizing: border-box;

       .tip_word {
         font-size: 14px;
         margin-bottom: 1em;
       }

       .num_word {
         display: flex;
         align-items: center;
         margin-bottom: 1em;

         .is_more {
           display: block;
           background-color: rgb(255, 110, 60);
           color: #fff;
           padding: 2px 8px 2px;
           line-height: 26px;
           font-weight: 600;
           height: 26px;
           border-radius: 3px;
           font-size: 16px;

         }

         .num_span {
           display: block;
           margin-left: 12px;
           font-weight: 700;
           font-size: 30px;
           padding-top: 2px;
           line-height: 36px;
         }
       }

       .tip_word2 {
         color: rgb(153, 153, 153);
         margin-bottom: 1.5em;
       }
     }

     .table_div {
       .plan_money {
         display: flex;
         margin-bottom: 10px;

         li {
           width: 88px;
           height: 64px;
           // border: 1px dashed rgb(255, 170, 140);
           background-color: #91b1fe;
           margin-right: 10px;
           box-sizing: border-box;
           padding: 10px 0;
           border-radius: 5px;
           cursor: pointer;

           p {
             text-align: center;
           }
         }

         .special_li {
           border: 1px dashed rgb(255, 170, 140);
           background-color: #fff;
           color: #ff6e3c;
         }

         .finally_div {
           display: flex;

           .icon-icon-youjiantou::before {
             font-size: 36px;
             color: #91b1fe;
           }

           p {
             span {
               display: block;
               text-align: center;
               // margin-left: 10px;
               width: 100px;
             }

             .nums {
               font-weight: bold;
               font-size: 20px;
             }

             .words {
               font-size: 12px;
             }
           }
         }
       }

       .actual_money {
         display: flex;

         li {
           width: 88px;
           height: 64px;
           background-color: #5d8cfe;
           margin-right: 10px;
           box-sizing: border-box;
           padding: 10px 0;
           border-radius: 5px;
           margin-bottom: 10px;
           cursor: pointer;

           p {
             text-align: center;
           }
         }

         .finally_div {
           display: flex;

           .icon-icon-youjiantou::before {
             font-size: 36px;
             color: #5d8cfe;
           }

           p {
             span {
               display: block;
               text-align: center;
               // margin-left: 10px;
               width: 100px;

             }

             .nums {
               font-weight: bold;
               font-size: 20px;
             }

             .words {
               font-size: 12px;
             }
           }
         }
       }

       .big_ul {
         display: flex;
         margin-bottom: 10px;

         li {
           // width: 186px;
           width: 147px;
           height: 64px;
           background-color: #edf1ed;
           margin-right: 10px;
           box-sizing: border-box;
           padding: 10px 0;
           border-radius: 5px;
           cursor: pointer;

           // cursor: default
           p {
             text-align: center;
             color: #666;
           }
         }

         .finally_div {
           display: flex;

           .icon-icon-youjiantou::before {
             font-size: 36px;
             color: #edf1ed;
           }

           p {
             span {
               display: block;
               text-align: center;
               // margin-left: 10px;
               width: 100px;

             }

             .nums {
               font-weight: bold;
               font-size: 20px;
             }

             .words {
               font-size: 12px;
             }
           }
         }
       }
     }

     // 表格
     .middle_table {
       th {
         text-align: center;
       }
     }
   }
 </style>