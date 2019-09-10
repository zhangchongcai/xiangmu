<template>
  <div class="_member-recharge">
    <div class="member-home-title">{{$attrs.memberTitle}}</div>
    <CardReading @queryData="queryData" :cardReadingTitle="cardReadingTitle" :isApply="isApply" v-bind="$attrs"/>
    <div class="member-recharge-content" v-if="memberInfo && dataType == 'phone' && member.cardNoOrphoneNumState ">
      <MemberIofo :memberInfo="memberInfo" :isSingleQuery="false" v-bind="$attrs"/>
      <HoldingCardList
        @selectedCard="selectedCard"
        :memberCardList="memberInfo.memberCardList"
        :isSelected='true'/>
    </div>
    <div class="member-recharge-content" v-if="isshow && member.memberCardInfo && dataType == 'card' && member.cardNoOrphoneNumState ">
      <MemberCardIofo :memberCardInfo="member.memberCardInfo" :isSingleQuery="false"/>
    </div>
    <slot name="addBlock"></slot>
    <div class="bottom-btn-warp">
      <el-button  @click="back()" v-text="isshow && member.cardNoOrphoneNumState ? '取消' : '返回'" class="common-btn"></el-button>
      <el-button
        class="common-btn"
        v-show="isshow && !$attrs.submitShow && member.cardNoOrphoneNumState"
        @click="submit" type="primary">{{$attrs.submitText ? textState : '确定'}}</el-button>
    </div>
  </div>
</template>

<script>
import CardReading from "./cardReading";
import MemberIofo from "./memberInfo";
import MemberCardIofo from "./memberCardInfo";
import HoldingCardList from "./holdingCardList";
import moreSelectOne from "./moreSelectOne.vue";
import { mapState, mapGetters } from 'vuex'
import { MemberAjax,memeberApi} from "src/http/memberApi";
import { back , cardStatusCN} from '../util/utils'
export default {
  props:{
    isshow:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      inheritAttrs:false,
      cardReadingTitle: "会员卡/手机号：",
      isApply: false,
      dataType: "phone",
      memberInfo: "",
      memberCardInfo: "",
    };
  },
  mounted() {
    if (this.$route.query.phoneOrCard) {
      this.queryData(this.$route.query);
    }
  },
  computed:{
      ...mapState(['member']),
      ...mapGetters(['tenantId']),
      textState(){
        return this.member.cardState === 'normal' ? '挂失' : this.member.cardState === 'loss' ? '解挂' : '确定'
      },
  },
  methods: {
    // 选中持有卡
    selectedCard(data) {
      console.log("所选择的持有卡", data);
      this.isshow = true;
      this.member.cardNo = data.cardNo
      this.member.cardState = data.status;
      this.member.cardTypeCode = data.cardTypeCode;
      this.member.canCharge = data.canCharge;
      this.member.cardProductId = data.cardProductId
    },
    // 点击查询按钮或敲回车
    back() {
      back(this)
    },
    //触发确定
    submit(e) {
        this.$emit('submit',true)
    },
    //权益卡数据过滤
    filterData(arr) {
      if (arr) {
        return arr.filter((item, index) => {
          return !!this.$attrs.cardJudge ? item.cardTypeCode === 'stored_card' :item;
        });
      } else {
        return [];
      }
    },
    cardStatusfilter(arr){
      //正常卡状态筛选
        if(!!this.$attrs.cardStatus && arr){
          let cardArr = [];
          (this.$attrs.cardStatus).forEach((v,i)=>{
            (this.filterData(arr)).filter((val,index) => {
              if(val.status === v && val.cardTypeCode != 'gift_card'){
                cardArr.push(val) 
              } 
            })
          })
          return cardArr;
        }else{
          return this.filterData(arr)
        }
    },
    queryData(data) {
      this.dataType = data.type;
      this.member.pageLoading = true;
      if (data.type == "phone") {
        // TODO 请求会员详情
        let params = { mobileNum: data.phoneOrCard, tenantId: this.tenantId, verifyCode:false,validateCode:''};
        MemberAjax.getInfoByPhone(params)
          .then(response => {
            this.member.cardState = '';
            this.member.cardNo = '';
            this.member.cardTypeCode = '';
            this.member.canCharge = '';
            this.member.pageLoading = false;
            var memberdata = response.data;
            this.member.memberCardInfo = this.memberInfo = memberdata;
            if (!memberdata) {
              this.$message.warning(response.msg);
              this.$emit('isShow',false)
              return;
            }
            memberdata.memberCardList = this.cardStatusfilter(
              response.data.memberCardList
            );
            if (memberdata.memberCardList.length == 0) {
              this.$emit('isShow',false)
            } else {
              this.$emit('isShow',true)
            }
          })
          .catch(err => {
            this.member.pageLoading = false;
            console.log(err);
            this.$emit('isShow',false)
          });
      } else if (data.type == "card") {
        // TODO 请求会员卡详情
        let params = { cardNo: data.phoneOrCard, tenantId: this.tenantId,verifyPassword:false};
        MemberAjax.getCardInfoByNo(params)
          .then(reponse => {
            let info = reponse.data;
            this.member.pageLoading = false;
            this.member.memberCardInfo = this.memberCardInfo = info;
            if (!info) {
              this.$message.warning(reponse.msg);
              this.$emit('isShow',false) 
              return false;
            }
            this.member.cardState = info.status;//输入卡号获取卡状态
            this.member.cardNo = info.cardNo;
            this.member.phoneNum = info.phoneNumber;
            this.member.cardTypeCode = info.cardTypeCode;
            this.member.canCharge = info.canCharge; //是否可充值
            this.member.cardProductId = info.cardProductId;
            if(info.cardTypeCode === 'gift_card'){
              this.$message.warning(`${info.cardType}不支持此操作`);
              this.$emit('isShow',false) 
              return;
            }
            this.$emit('isShow',true)           
          })
          .catch(err => {
            this.member.pageLoading = false;
            // this.isshow = false;
            this.$emit('isShow',false)
            this.memberCardInfo = ''
            console.log(err);
          });
      }
    },
    beforeCreate() {
      this.member.pageLoading = false;
    },
  },
  components: {
    CardReading,
    MemberIofo,
    HoldingCardList,
    MemberCardIofo,
    moreSelectOne
  }
};
</script>
<style lang="scss">
._member-recharge {
  min-height: 93vh;
  position: relative;


  .member-recharge-content {
    padding: 0 2vw 0vh 2vw;
  }
  .demo-ruleForm {
    margin-top:1vh;
    width: 60vw;
  }
  
}
</style>
