<template>
<transition name="fade">
    <div class="pay-wrap" v-if="visible">
        <div class="pay-show">
            <i :class="['iconfont',isIconPic]"></i>
            <p>{{statusText}}</p>
            <input 
                type="text" 
                :value="barCode" 
                @input="$emit('focusChange', $event.target.value)" 
                ref="barCodeInp"
                style="">
                <!-- opacity:0 -->
        </div>
    </div>
</transition>
</template>
<script>
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
        }
    },
    data(){
        return{
            isIconPic:'icondengdaisaomiaokehuzhifupingzheng',
            statusText:'等待扫描客户支付凭证……'
        }
    },
    async mounted(){
        let self = this;
        await this.$nextTick();
        document.addEventListener('keyup', function (e) {
            //此处填写你的业务逻辑即可
            if (e.keyCode == 27) {
                self.handleEsc();
            }
        })
    },
    methods:{
        handleEsc(){
            this.$emit('update:visible',false)
        }
    },
    watch:{
        barCode(newVal){
            if(/\d{18}/.test(newVal.trim())){
                this.isIconPic = 'iconzhifuzhongqingnaixindengdai';
                this.statusText = '支付中，请耐心等待......';
            }
        },
        async visible(newVal,oldVal){
            if(newVal){
                await this.$nextTick();
                this.$refs.barCodeInp.focus();
            }else{
                this.isIconPic = 'icondengdaisaomiaokehuzhifupingzheng';
                this.statusText = '等待扫描客户支付凭证……';
                this.$emit('focusChange', '')
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
.fade-enter, .fade-leave-to {
    opacity: 0
}
.fade-leave, .fade-enter-to {
    opacity: 1
}
.fade-enter-active, .fade-leave-active {
    transition: all .5s
}
</style>


