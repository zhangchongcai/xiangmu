<template>
  <div class="_card-reading">
    <div class="query-phone-or-card">
      <label class="lable" for="phoneOrCard">{{cardReadingTitle}}</label>
      <el-input 
        v-model="phoneOrCard" 
        @keyup.enter.native="handleSearch" 
        :placeholder="isApply?'请输入会员卡号':'请输入会员卡号/手机号'"
        id="phoneOrCard"
        ref="searchInp"
        @focus="keyboard"></el-input>
      <el-button size="medium" type="primary" @click="readCard" :loading="readLoading">读卡</el-button>
      <el-button size="medium" @click="search" v-if="!isApply">{{$attrs.validateText ? '校验': '查询'}}</el-button>
      <div class="iskeyBoard" v-if="!!$attrs.iskeyBoard">
        <el-button size="medium" @click="startKeyBorad">启动密码输入</el-button>
        <label style="color:#666"><em style="color:red">*</em>输入后请按回车键或直接刷卡</label>
      </div>
    </div>
    <KeyBoard v-model="phoneOrCard" @confirm="fillContent" ref="keyboard"></KeyBoard>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { readCard ,secKeyBoard} from '../util/utils'
import KeyBoard from 'components/keyboard'
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
    keyboard(){
      this.$refs.keyboard.show()
    },
    fillContent(val){
      this.phoneOrCard = val;
    },
    search() {
      this.$refs.searchInp.blur();
      this.$refs.keyboard.close();
      if (this.isApply) {
        console.log("开卡流程");
        if (this.phoneOrCard.trim()) {
          if(!/\d{14}/.test(this.phoneOrCard.trim())){
            this.member.cardNoOrphoneNumState = false;
            this.$message.warning('请输入正确卡号');
            return;
          }
          this.member.cardNoOrphoneNumState = true;
          this.member.numberType = "card";
          this.member.cardNo = this.phoneOrCard.trim();
          this.$emit("queryData", {
            phoneOrCard: this.phoneOrCard.trim(),
            type: "card"
          });
        } else {
            this.member.cardNoOrphoneNumState = false;
            this.$message.warning("卡号不能为空");
        }
      } else {
        if(!this.phoneOrCard.trim()){
          this.member.cardNoOrphoneNumState = false;
          this.$message.warning("卡号/手机号不能为空");
          return;
        }
        if (this.phoneOrCard.trim()) {
          if (
            /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(
              this.phoneOrCard.toString().trim()
            )
          ) {
            console.log("手机号");
            this.member.numberType = "phone";
            this.member.phoneNum = this.phoneOrCard.trim();
            this.member.cardNoOrphoneNumState = true;
            this.$emit("queryData", {
              phoneOrCard: this.phoneOrCard.trim(),
              type: "phone"
            });
          } else {
            if(!/\d{14}/.test(this.phoneOrCard.trim())){
              this.member.cardNoOrphoneNumState = false;
                this.$message.warning('请输入正确会员卡号/手机号')
                return;
              }
            console.log("卡号");
            this.member.numberType = "card";
            this.member.cardNo = this.phoneOrCard.trim();
            this.member.cardNoOrphoneNumState = true;
            this.$emit("queryData", {
              phoneOrCard: this.phoneOrCard.trim(),
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
  },
  components:{
   KeyBoard
  }
};
</script>
<style lang="scss">
._card-reading {
  padding: 2.7vh 2vw;
  .query-phone-or-card {
    display: flex;
    align-items: center;
    .lable {
      width: 10.2vw;
      font-size: $font-size14;
    }
    .el-input {
      width: 34.2vw;
      margin-right: 0.9vw;
      .el-input__inner {
        height: 38px;
      }
    }
  }
}
.iskeyBoard{
  display:inline-block;
  margin-left:1vw;
}
</style>


