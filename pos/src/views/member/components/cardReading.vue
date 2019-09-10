<template>
  <div class="_card-reading">
    <div class="query-phone-or-card">
      <label class="lable" for="phoneOrCard">{{cardReadingTitle}}</label>
        <input type="text" 
          v-model="phoneOrCard"
          @keyup.enter="handleSearch" 
          :placeholder="isApply?'请输入会员卡号':'请输入会员卡号/手机号'"
          class="phoneOrCard"
          ref="searchInp"
          autocomplete="off"
          @focus="(e)=>{e.target.style.borderColor = 'rgb(63, 118, 253)'}"
          @blur="(e)=>{e.target.style.borderColor = '#bcbcbc'}">
      <el-button type="primary" @click="readCard" :loading="readLoading" class="common-btn">读卡</el-button>
      <el-button @click="search" v-if="!isApply" class="common-btn">{{$attrs.validateText ? '校验': '查询'}}</el-button>
      <div class="iskeyBoard" v-if="!!$attrs.iskeyBoard">
        <el-button @click="startKeyBorad" class="common-btn">启动密码输入</el-button>
        <label style="color:#666;font-size:1.04vw"><em style="color:red;font-size:1.04vw">*</em>输入后请按回车键或直接刷卡</label>
      </div>
    </div>
    <p v-if="!$attrs.iskeyBoard" class="enterTip">录入完成请按回车键</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { readCard ,secKeyBoard} from '../util/utils'
export default {
  data() {
    return {
      phoneOrCard: "",
      readLoading:false
    };
  },
  props: {
    isApply: {
      type: Boolean,
      default: true,
      required: false
    },
    cardReadingTitle: {
      type: String,
      default: "会员卡卡号：",
      required: false
    }
  },
  computed:{
    ...mapState(['member','config'])
  },
  mounted() {
    if (this.$route.query.phoneOrCard) {
      this.phoneOrCard = this.$route.query.phoneOrCard;
    }
  },
  methods: {
    input(e){
      this.phoneOrCard = e;
    },
    search() {
      this.$refs.searchInp.blur();
      let getPhoneOrCard = this.phoneOrCard.toString().trim();
      if (this.isApply) {
        console.log("开卡流程");
        if (getPhoneOrCard) {
          // if(!/\d{11}/.test(getPhoneOrCard)){
          //   this.member.cardNoOrphoneNumState = false;
          //   this.$message.warning('请输入正确卡号');
          //   return;
          // }
          this.member.cardNoOrphoneNumState = true;
          this.member.numberType = "card";
          this.member.cardNo = getPhoneOrCard;
          this.$emit("queryData", {
            phoneOrCard: getPhoneOrCard,
            type: "card"
          });
        } else {
            this.member.cardNoOrphoneNumState = false;
            this.$message.warning("卡号不能为空");
        }
      } else {
        if(!getPhoneOrCard){
          this.member.cardNoOrphoneNumState = false;
          this.$message.warning("卡号/手机号不能为空");
          return;
        }
        if (getPhoneOrCard) {
          if (
            /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(
              this.phoneOrCard.toString().trim()
            )
          ) {
            console.log("手机号");
            this.member.numberType = "phone";
            this.member.phoneNum = getPhoneOrCard;
            this.member.cardNoOrphoneNumState = true;
            this.$emit("queryData", {
              phoneOrCard: getPhoneOrCard,
              type: "phone"
            });
          } else{
            // if(!/\d{14}/.test(getPhoneOrCard)){
            //   this.member.cardNoOrphoneNumState = false;
            //     this.$message.warning('请输入正确会员卡号/手机号')
            //     return;
            //   }
            console.log("卡号");
            this.member.numberType = "card";
            this.member.cardNo = getPhoneOrCard;
            this.member.cardNoOrphoneNumState = true;
            this.$emit("queryData", {
              phoneOrCard: getPhoneOrCard,
              type: "card"
            });
          }
        }
      }
    },
    handleSearch(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.startKeyBorad()
      }
    },
    readCard(){
      this.readLoading = true
      readCard(this.config.configData).then((e)=>{
        this.readLoading = false;
        this.phoneOrCard = e.replace(/\,| \，/g,'');
        if(this.$route.path === '/member/memberApplyCard'){
          this.search()
        }
      }).catch((e)=>{
        this.readLoading = false;
      })
    },
    startKeyBorad(){
        this.search()
    }
  }
};
</script>
<style lang="scss">
._card-reading {
  padding: 2.7vh 2vw 0;
  .query-phone-or-card {
    display: flex;
    align-items: center;
    .lable {
      width:9vw;
      font-size: $font-size12;
    }
    .el-input {
      width: 34.2vw;
      margin-right: 0.9vw;
    }
  }
  .enterTip{
      padding:0.3vw 0 0 9vw;
      color:#2A2A2A;
      font-size:.8vw;
      &::before{
        content: '*';
        font-size:.8vw;
        color: #F56C6C;
      }
  }
}
.iskeyBoard{
  display:inline-block;
  margin-left:1vw;
}
.phoneOrCard{
    width: 34.2vw;
    height:5vh;
    padding:0 15px;
    margin-right: .9vw;
    border-radius: 4px;
    border: 1px solid #bcbcbc;
    color: rgb(96, 98, 102);
    font-size:$font-size12;
    outline:none;
    box-sizing: border-box;
    &::-webkit-input-placeholder {
      color:#D0D3D9
    }
}
</style>


