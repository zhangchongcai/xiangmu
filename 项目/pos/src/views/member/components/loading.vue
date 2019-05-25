<template>
    <transition name="fade">
        <div class="loadingWrap" v-show="show">
            <div class="content">
                <p class="img"></p>
                <p class="text">等待客户输入密码......</p>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props:{
        show:{
            type:Boolean,
            default:false
        }
    }
}
</script>

<style lang="scss" scoped>
.loadingWrap{
    position:fixed;
    top:0;
    left:0;
    z-index:999;
    width:100%;
    height:100%;
    background-color:rgba(0, 0, 0, .5);
    .content{
        position:absolute;
        top:50%;
        left:50%;
        width:50vw;
        height: 35vh;
        margin-left: -25vw;
        margin-top: -17.5vh;
        background-color:#fff;
        text-align:center; 
        border-radius: 4px;
        box-shadow: 0 1px 4px 0 rgba(102,102,102,0.25);
        .img{
            width:63px;
            height:63px;
            margin:11vh auto 1vh;
            background-image:url(../../../../static/memberImage/chongzhimima.png);
            background-repeat:no-repeat;
            background-size:cover;
        }
        .text{
            font-size: 13px;
            color: #666666;
        }
    }
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
