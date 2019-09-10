<template>
<transition name="fade">
    <div class="pay-wrap" v-if="visible">
        <div class="pay-show">
            <i class="iconfont icondengdaisaomiaokehuzhifupingzheng" v-show="isIconPic"></i>
            <img src="./wait_pay.png" v-show="!isIconPic" class="pay_wait">
            <p style="padding-bottom:3vh;font-size:1.26vw">{{statusText}}</p>
            <el-button 
                type="primary" 
                class="common-btn"
                v-if="payMethod === 'XRMB'" 
                @click="cashPay">收款成功</el-button>
            <input
                v-else 
                type="text" 
                :value="barCode" 
                @input="$emit('focusChange', $event.target.value)" 
                ref="barCodeInp"
                style="opacity:0">
        </div>
    </div>
</transition>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name:'payLoading',
    model:{
        prop:'barCode',
        event:'focusChange'
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        barCode:{
            type:String
        },
        payMethod:{
            type:String
        }
    },
    data(){
        return{
            inheritAttrs:false,
            isIconPic:true,
            statusText:'等待扫描客户支付凭证……'
        }
    },
    computed: {
        ...mapState(["member"]),
    },
    async mounted(){
        let self = this;
        // await this.$nextTick();
        document.addEventListener('keyup', function (e) {
            if (e.keyCode == 27) {
                self.handleEsc();
            }
        })
    },
    methods:{
        handleEsc(){
            this.$emit('update:visible',false)
        },
        cashPay(){
            this.member.cashBox = true;
            this.$emit('update:visible',false)
        }
    },
    watch:{
        barCode(newVal){
            if(/\d{18}/.test(newVal.trim())){
                this.isIconPic = false;
                this.statusText = '支付中，请耐心等待......';
            }
        },
        async visible(newVal,oldVal){
            if(newVal){
                await this.$nextTick();
                try{
                    this.$refs.barCodeInp.focus();
                }catch(err){}
            }else{
                this.isIconPic = true;
                this.statusText = '等待扫描客户支付凭证……';
                this.$emit('focusChange', '');
            }
        },
        payMethod(val){
            if(val === 'XRMB'){
                this.isIconPic = false;
                this.statusText = '请确认客户支付金额...';
            }
        }
    }
}
</script>
<style lang='scss' scoped>
.pay-wrap{
    position: fixed;
    z-index:888;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background-color:rgba(0, 0, 0, .5);
    .pay-show{
        position:absolute;
        top:50%;
        left:50%;
        width:50vw;
        // height:35vh;
        margin-left: -25vw;
        margin-top: -17.5vh;
        padding-bottom: 20px;
        background-color:#fff;
        text-align:center; 
        border-radius: 4px;
    }
    i{
        margin:7.5vh 0 3vh;
    }
}
.iconfont{
    display:inline-block;
    font-size:90px;
    color:#3B74FF
}
.pay_wait{
    width:10vw;
    height:10vw;
    margin:7.5vh 0 3vh;
}
</style>


