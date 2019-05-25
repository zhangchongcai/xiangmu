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
      <el-button @click="back()">返回</el-button>
      <el-button 
        class="submit" 
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
      // isshow: false,
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
      this.member.cardTypeCode = '';
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
              if(val.status === v){
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
          .then(data => {
            this.member.cardState = '';
            this.member.cardNo = '';
            this.member.cardTypeCode = '';
            this.member.pageLoading = false;
            var memberdata = data.data;
            if (!memberdata) {
              this.$message.warning(data.msg);
              this.$emit('isShow',false)
              return;
            }
            this.member.memberCardInfo = this.memberInfo = memberdata;
            memberdata.memberCardList = this.cardStatusfilter(
              data.data.memberCardList
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
          .then(data => {
            let info = data.data;
            this.member.pageLoading = false;
            this.member.memberCardInfo = this.memberCardInfo = info;
            if (!info) {
              this.$message.warning(data.msg);
              this.$emit('isShow',false) 
              return;
            }
            this.member.cardState = info.status;//输入卡号获取卡状态
            this.member.cardNo = info.cardNo;
            this.member.phoneNum = info.phoneNumber;
            this.member.cardTypeCode = info.cardTypeCode;
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
  padding-bottom: 7vh;
  position: relative;


  .member-recharge-content {
    padding: 0 2vw 2.6vh 2vw;
  }
  .recharge-info-title {
    font-size: $font-size14;
    color: #333;
    font-weight: bold;
    text-indent: 2vw;
    padding-bottom:3vh;
  }
  .psd-inp{
      width:65%;
  }
  .demo-ruleForm {
    margin-top:4vh;
    width: 60vw;
  }
  .start-btn{
      margin-left:1vw;
      border-color:#dcdfe6;
      border-radius:0;
  }
}
</style>
