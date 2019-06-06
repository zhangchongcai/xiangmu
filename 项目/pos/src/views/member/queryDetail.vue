<template>
  <div class="_member-query-detail">
    <div class="member-home-title">查询</div>
    <CardReading @queryData="queryData" :cardReadingTitle="cardReadingTitle" :isApply="isApply" />
    <div class="member-query-content" v-if="memberInfo && dataType == 'phone' && member.cardNoOrphoneNumState">
      <MemberIofo :memberInfo="memberInfo" />
      <HoldingCardList :memberCardList="memberInfo.memberCardList" />
      <ul class="operation-btn-wrap">
        <li class="btn-item" v-for="(item, index) of phoneBtnData" :key="index" @click="handleOperation(item.routePath)">{{item.name}}</li>
      </ul>

    </div>
    <div class="member-query-content" v-if="memberCardInfo && dataType == 'card' && member.cardNoOrphoneNumState">
      <MemberCardIofo :memberCardInfo="memberCardInfo" :checkMovie='true'/>
      <ul class="operation-btn-wrap">
        <li class="btn-item" v-for="(item, index) of cardBtnData" :key="index" @click="handleOperation(item.routePath)">{{item.name}}</li>
      </ul>
    </div>
    <div class="foot-buttom-layer">
      <el-button size="medium" @click="$router.push({name:'memberHome'})">返回</el-button>
    </div>
  </div>
</template>

<script>
import CardReading from "./components/cardReading";
import MemberIofo from "./components/memberInfo";
import MemberCardIofo from "./components/memberCardInfo";
import HoldingCardList from "./components/holdingCardList";
import {MemberAjax} from "src/http/memberApi.js";
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      cardReadingTitle: "会员卡/手机号：",
      isApply: false,
      phoneOrCard: "",
      dataType: "phone",
      memberInfo: "",
      memberCardInfo: "",
      phoneBtnData: [
        {
          name: "充值",
          routePath: "/member/memberRecharge"
        },
        {
          name: "修改资料",
          routePath: "/member/ModifyData"
        },
        {
          name: "修改密码",
          routePath: "/member/memberChangePsd"
        },
        {
          name: "冲销",
          routePath: "/member/sterilisation"
        },
        {
          name: "补卡",
          routePath: "/member/repairCard"
        },
        {
          name: "绑定票券",
          routePath: "/member/bindTicket"
        },
        {
          name: "交易记录",
          routePath: "/member/records"
        },
        {
          name: "变更记录",
          routePath: "/member/changeRecord"
        }
      ],
      cardBtnData: [
        {
          name: "充值",
          routePath: "/member/memberRecharge"
        },
        {
          name: "修改资料",
          routePath: "/member/ModifyData"
        },
        {
          name: "修改密码",
          routePath: "/member/memberChangePsd"
        },
        {
          name: "冲销",
          routePath: "/member/sterilisation"
        },
        {
          name: "补卡",
          routePath: "/member/repairCard"
        },
        {
          name: "交易记录",
          routePath: "/member/records"
        }
      ]
    };
  },
  computed:{
    ...mapState(['member']),
    ...mapGetters(['tenantId'])
  },
  created(){
    if(!!this.$route.query.type){
        this.queryData(this.$route.query)
    }
  },
  methods: {
    handleOperation(routePath) {
      this.$router.push({
        path: routePath,
        query: { phoneOrCard: this.phoneOrCard ,type: this.dataType}
      });
    },
    queryData(data) {
      this.dataType = data.type;
      this.phoneOrCard = data.phoneOrCard;
      this.member.pageLoading = true;
      if (data.type == "phone") {
        // TODO 请求会员详情
        let params = { mobileNum: data.phoneOrCard, tenantId: this.tenantId , verifyCode:false,validateCode:''};
        MemberAjax.getInfoByPhone(params)
          .then(data => {
            this.member.pageLoading = false;
              this.memberInfo = data.data;
              if (data.data && data.code === 200) {
                sessionStorage['memberId'] = data.data.id;
              }else{
                this.$message.warning(data.msg);
              }
          })
          .catch(err => {
            this.member.pageLoading = false;
            this.memberInfo = data.data;
            console.log(err);
          });
      } else if (data.type == "card") {
        // TODO 请求会员卡详情
        let params = { cardNo: data.phoneOrCard, tenantId: this.tenantId ,verifyPassword:false};
        MemberAjax.getCardInfoByNo(params)
          .then(data => {
            this.member.pageLoading = false;
            this.memberCardInfo = data.data;
            if(data.data && data.code === 200){
              sessionStorage['memberId'] = data.data.memberId;
              sessionStorage['cardProductId'] = data.data.cardProductId
            }else{
              this.$message.warning(data.msg);
            }
          })
          .catch(err => {
            this.member.pageLoading = false;
            this.memberCardInfo = data.data;
            console.log(err);
          });
      }
    }
  },
  components: {
    CardReading,
    MemberIofo,
    HoldingCardList,
    MemberCardIofo
  }
};
</script>
<style lang="scss">
._member-query-detail {
  .member-query-content {
    padding: 2.6vh 2vw;
    // 按钮样式
    .operation-btn-wrap {
      display: flex;
      flex-wrap: wrap;
      margin-top: 6.5vh;
      .btn-item {
        width: 11.7vw;
        height: 5.2vh;
        line-height: 5.2vh;
        margin-right: 1.7vw;
        margin-bottom: 2.6vh;
        cursor: pointer;
        border: 1px solid #a7b8e4;
        border-radius: 2px;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
      }
      .btn-item:hover {
        border: 1px solid #3b74ff;
        color: #3b74ff;
      }
    }
  }
}
</style>
