<template>
    <div class="footer-tip">
        <span>&nbsp;&nbsp;中鑫汇科票务系统 V1.00.00</span>    <button class="mini-mize" @click="toMinimize"> — 最小化窗口</button> 系统通知：最新消息 错误报告等信息滚动栏 鼠标单击打开信息详情面板    等级：常规 
    </div>
</template>

<script>
import util from "../../../http/app";
export default {
    data(){
        return {

        }
    },
    methods:{
        //最小化窗口
        toMinimize(){
            util.toMinimize()
        }
    }
}
</script>

<style lang="scss">
    .footer-tip {
        height: 2.6vh;
        width: calc(100vw);
        // padding: 0 24px;
        box-sizing: border-box;
        background-color: #EFF1FF;
        color: $font-color6;

        .scale-btn {
            width: 9.4vw;
            height: 2.0vh;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border: 1px solid $background-color-theme;
            font-size: $font-size12;
            color: $background-color-theme;
            margin-right: 10px;

            &:hover {
                cursor: pointer;
                font-weight: bold;
            }
        }
    }
    .mini-mize{
        margin:1px 20px;
        // width: 96px;   
        height: 18px;
        border: 1px solid #3559AF;
        border-radius: 2px;
        border-radius: 2px;
        color: #3559AF;
        
    }
</style>