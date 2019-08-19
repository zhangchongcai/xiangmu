<template>
  <div class="_member-integral-rules">
    <div class="level-detail-head">
      <div class="level-cycle">
        <div class="cycle-left">
          <div class="lable">积分有效期：</div>
          <span class="level-cycle-num">{{formData.validityYear}}</span>
          <span class="unit-desc">年</span>
          <!-- <div class="cycle-tips">注：每日1点进行会员升级调整，定级周期内最后一月月末1点进行会员降级调整，修改会员等级后，新等级将在次日1点生效。</div> -->
        </div>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </div>
    <!-- 内容区 -->
    <el-collapse v-model="activeNames" class="_edit-membership-level-content">
      <!-- 购买影票规则 -->
      <el-collapse-item title="购买影票规则" name="0" class="get-rules">
        <div class="growth-value-options">
          <div class="item-inner">
            <label class="lable-name">获取渠道：</label>
            <template v-for="(item,index) in formData.ticketChannel" tag="span">
              {{item}}
              {{(index==formData.ticketChannel.length-1)?"":"，"}}
            </template>
          </div>
          <div class="rules-selection">
            <div class="rules-lable">获取规则：</div>
            <div class="rules-box">
              <div style="width:100%"  v-for="(item,key,index) in formData.ticket" :key="index">
                <template v-if="item.length!=0">
                  <div class="rules-title">{{key}}</div>
                  <div class="rules-item">
                    <div class="buy-ticket"  v-for="childItem in item" :key="childItem.id">
                      <!-- <div class="buy-type"></div> -->
                      <div class="buy-word">
                        会员等级
                        【{{ childItem.memberLevelLower | numberEmptyShowFilter }}】至【{{ childItem.memberLevelUpper | numberEmptyShowFilter }}】
                        支付方式【{{ childItem.payType | payTpyeFilter }}】，
                        订单满【{{ childItem. everyFullOrder | numberEmptyShowFilter }}】元&nbsp;&nbsp;
                        获取【{{ childItem. everyFullIntegral | numberEmptyShowFilter }}】积分，
                        设置获取积分上限：{{childItem. integralUpper ? "是" : "否" }}&nbsp;&nbsp;
                        每订单获取上限【{{childItem. everyOrderUpper | integralUpperShowFilter(childItem. integralUpper) }}】积分，
                        每日上限【{{ childItem. everyDayUpper | integralUpperShowFilter(childItem. integralUpper) }}】积分
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <!-- 购买卖品规则 -->
      <el-collapse-item title="购买卖品规则" name="1" class="get-rules">
        <div class="growth-value-options">
          <div class="item-inner">
            <label class="lable-name">获取渠道：</label>
            <template v-for="(item,index) in formData.goodsChannel" tag="span">
              {{item}}
              {{(index==formData.goodsChannel.length-1)?"":"，"}}
            </template>
          </div>
          <div class="rules-selection">
            <div class="rules-lable">获取规则：</div>
            <div class="rules-box">
              <div style="width:100%"  v-for="(item,key,index) in formData.goods" :key="index">
                <template v-if="item.length!=0">
                  <div class="rules-title">{{key}}</div>
                  <div class="rules-item">
                    <div class="buy-ticket"  v-for="childItem in item" :key="childItem.id">
                      <!-- <div class="buy-type"></div> -->
                      <div class="buy-word">
                        会员等级
                        【{{ childItem.memberLevelLower | numberEmptyShowFilter }}】至【{{ childItem.memberLevelUpper | numberEmptyShowFilter }}】
                        支付方式【{{ childItem.payType | payTpyeFilter }}】，
                        订单满【{{ childItem. everyFullOrder | numberEmptyShowFilter }}】元&nbsp;&nbsp;
                        获取【{{ childItem. everyFullIntegral | numberEmptyShowFilter }}】积分，
                        设置获取积分上限：{{ childItem. integralUpper ? "是" : "否" }}&nbsp;&nbsp;
                        每订单获取上限【{{ childItem. everyOrderUpper | integralUpperShowFilter(childItem. integralUpper) }}】积分，
                        每日上限【{{ childItem. everyDayUpper | integralUpperShowFilter(childItem. integralUpper) }}】积分
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool> -->
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
export default {
  name: "MembershipLevelDetail",
  data() {
    return {
      activeNames: ["0", "1"],
      tenantId: this.$store.state.loginUser.consumerId, //租户id
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "购买影票规则",
            isactive: false
          },
          {
            name: "购买卖品规则",
            isactive: false
          }
        ]
      },
      //支付方式
      payTypeOptions:[
        { code: "all", desc: "全部" },
        { code: "wxmicropay", desc: "微信支付码付款" },
        { code: "cash", desc: "现金" },
        { code: "alimicropay", desc: "支付宝支付码付款" },
        { code: "membercard", desc: "会员卡付款" },
      ],
      //渲染数据
      formData:{
        ticket:{},
        goods:{},
        ticketChannel:[],
        goodsChannel:[],
      },
       //假数据
      data:{
        "ticket":[
            {
                "柜台POS": [
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "0",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "ticket",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:27:51",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:26:41",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "柜台POS",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356385274579648512"
                    },
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "0",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "ticket",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:43:56",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:43:56",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "柜台POS",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356389323148361729"
                    },
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "0",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "ticket",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:45:49",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:45:48",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "柜台POS",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356389794290335745"
                    }
                ]
            },
            {
                "自助终端": [
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "0",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "ticket",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:27:51",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:26:41",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "柜台POS",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356385274579648512"
                    },
                ]
            },
            {
                "淘票票": []
            },
            {
                "猫眼(北京三快科技有限公司)": []
            },
            {
                "MOVIE365": []
            }
        ],
        "goods": [
            {
                "柜台POS": []
            },
            {
                "自助终端": [
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "1",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "goods",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:28:11",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:26:41",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "自助终端",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356385356037226497"
                    },
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "1",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "goods",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:43:57",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:43:56",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "自助终端",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356389323802673152"
                    },
                    {
                        "everyFullOrder": 10.00,
                        "modifyBy": null,
                        "channelNo": "1",
                        "everyOrderUpper": 100.00,
                        "everyDayUpper": 120.00,
                        "integralWayType": "gain",
                        "isDelete": 0,
                        "exchangeRateIntegral": null,
                        "integralExchangeType": "goods",
                        "discount": "0",
                        "integralUpper": 1,
                        "createBy": null,
                        "payType": "微信支付",
                        "modifyTime": "2019-07-12 10:45:49",
                        "memberLevelUpper": 3,
                        "createTime": "2019-07-12 10:45:48",
                        "cinemaId": "1",
                        "exchangeRateMoney": null,
                        "cinemaName": "Nick's cinema",
                        "tenantId": "432814",
                        "channelName": "自助终端",
                        "memberLevelLower": 1,
                        "everyFullIntegral": 10.00,
                        "id": "356389795800285184"
                    }
                ]
            },
            {
                "淘票票": []
            },
            {
                "猫眼(北京三快科技有限公司)": []
            },
            {
                "MOVIE365": []
            }
        ],
        "validityYear":"1"
      },
      searchData: ""
    };
  },
  filters: {
    //过滤支付方式
    payTpyeFilter:(value)=> {
      switch (value) {
        case "":
          return "-";
          break;
        case "all":
          return "全部";
          break;
        case "wxmicropay":
          return "微信支付码付款";
          break;
        case "cash":
          return "现金";
          break;
        case "alimicropay":
          return "支付宝支付码付款";
          break;
        case "membercard":
          return "会员卡付款";
          break;
        default:
          return value;
          break;
      }
    },
    //数字过滤
    numberEmptyShowFilter:(value)=>  {
      if (value) {
        return value;
      } else {
        return "0";
      }
    },
    //设置获取积分上限过滤
    integralUpperShowFilter:(value,integralUpper)=>  {
      console.log(value,integralUpper)
      if (integralUpper) {
        if(value){
          return value;
        }else{
          return "0";
        }
      } else {
        return "0";
      }
    },
    //文字过滤
    stringEmptyShowFilter:(value)=>  {
      if (value) {
        return value;
      } else {
        return "-";
      }
    }
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool
  },
  created() {
    this.getIntegralRulesList()
    // this.resetFormDataRenderData(JSON.parse(JSON.stringify(this.data)))
  },
  methods: {
    getIntegralRulesList() {
      let params = {
        tenantId:this.tenantId
      }
      console.log(params)
      this.$crmList.getIntegralRulesList(params)
      .then(res => {
        if(res){
          this.resetFormDataRenderData(JSON.parse(JSON.stringify(res)))
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
     //组装列表渲染数据
    resetFormDataRenderData(data){
      console.log(data)
      let ticket = {}
      let goods = {}
      let ticketChannel =[]
      let goodsChannel = []
      let validityYear =data.validityYear
      //购买影票
      data.ticket.forEach(item=>{
        for (let key in item) {
          item[key].forEach(el=>{
            if(el.integralUpper==1){
              el.integralUpper = true
            } 
            if(el.integralUpper==0){
              el.integralUpper = false
            }
          })
          ticket[key] = item[key]
          if(item[key].length!=0){
            ticketChannel.push(key)
          }
        }
      })
      //购买卖品
      data.goods.forEach(item=>{
        for (let key in item) {
          item[key].forEach(el=>{
            if(el.integralUpper==1){
              el.integralUpper = true
            } 
            if(el.integralUpper==0){
              el.integralUpper = false
            }
          })
          goods[key] = item[key]
          if(item[key].length!=0){
            goodsChannel.push(key)
          }
        }
      })
      console.log("ticket",ticket)
      console.log("goods",goods)

      this.formData.ticket=ticket
      this.formData.goods=goods
      this.formData.validityYear=validityYear
      this.formData.ticketChannel=ticketChannel
      this.formData.goodsChannel=goodsChannel
      
      console.log("this.formData",this.formData)
    

    },
    handleEdit() {
      // this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({
        path: "/member/memberIntegral/editRules",
      });
    }
  }
};
</script>
<style lang="scss">
._member-integral-rules {
  .level-detail-head {
    background: #f5f5f5;
    height: 64px;
    line-height: 64px;
    padding: 0 24px;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    .level-cycle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cycle-left {
        display: flex;
        .lable {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
        }
        .level-cycle-num {
          font-size: 12px;
          font-weight: bold;
          color: #151515;
          letter-spacing: 0;
        }
        .unit-desc {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
          // margin-left: 8px;
        }
        .cycle-tips {
          font-size: 12px;
          color: #3b74ff;
          letter-spacing: 0;
          margin-left: 24px;
        }
      }
      .el-button {
        width: 80px;
        height: 32px;
        padding: 8px 20px;
      }
    }
  }
  ._edit-membership-level-content {
    width: 84%;
    margin-top: 20px;
    border: 0;
    .el-form-item__label {
      font-size: 12px;
    }
    // 购买影票、卖品规则
    .get-rules {
      .growth-value-options {
        background: #f5f5f5;
        border-radius: 4px;
        padding: 15px 0 20px 20px;
        margin: 0 0 15px 20px;
        .item-inner {
          display: flex;
          align-items: baseline;
          font-size: 12px;
          color: #666666;
          .lable-name {
            width: 70px;
            display: inline-block;
            font-size: 12px;
            color: #666666;
            line-height: 1.3;
          }
        }
        .rules-selection {
          margin-top: 15px;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          position: relative;
          .rules-box{
            padding-left: 70px;
          }
          .rules-lable {
            width: 65px!important;
            display: inline-block;
            font-size: 12px;
            color: #666666;
            letter-spacing: 0;
            position: absolute;
          }
          .rules-title {
            width: 100px;
            font-size: 12px;
            font-weight: bold;
            color: #666666;
            letter-spacing: 0;
            display: inline-block;

          }
          .rules-item {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-left: 80px;
            
            .buy-ticket {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #666666;
              width: 100%;
              padding-bottom: 10px;
              padding-right: 20px;
              .buy-type {
                float:left;
                width: 50px;
                font-size: 12px;
                color: #666666;
                letter-spacing: 0;
              }
              .buy-word {
                float:left; 
                width:100%;
              }
            }
          }
         
        }
      }
      .add-growth-value-btn {
        font-size: 12px;
        color: #3b74ff;
        letter-spacing: 0;
        cursor: pointer;
      }
    }
  }
}
</style>