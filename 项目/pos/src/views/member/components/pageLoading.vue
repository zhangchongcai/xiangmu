<template>
<transition name="slider">
    <div class="wrap" v-show="show" :style="{'top':show ?'100px':'-100px'}">
        <div class="mop-css-5 chasing-dots">
            <div class="dot1"></div>
            <div class="dot2"></div>
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
.wrap{
    position:fixed;
    left:50%;
    top:0;
    width:100px;
    height:100px;
    transform:translateX(-50%);
    transition:.5s linear;
}
.chasing-dots {
    min-width: 100px;
    min-height: 100px;
    position: relative;
    text-align: center;
    -webkit-animation: rotate 2s infinite linear;
    -moz-animation: rotate 2s infinite linear;
    -o-animation: rotate 2s infinite linear;
    animation: rotate 2s infinite linear;
}
.mop-load-text {
    font-weight: 700;
    margin-left: 1.2em;
    font-family: Trebuchet MS,Verdana,Helvetica,Arial,sans-serif;
}
.dot1, .dot2 {
    width: 50%;
    height: 50%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #3559AF;
    border-radius: 100%;
    -webkit-animation: bounce 2s infinite ease-in-out;
    -moz-animation: bounce 2s infinite ease-in-out;
    -o-animation: bounce 2s infinite ease-in-out;
    animation: bounce 2s infinite ease-in-out;
}
.dot2 {
    top: auto;
    bottom: 0;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}
@-webkit-keyframes rotate {
    100% {
        -webkit-transform:rotate(360deg)
    }
}
@-moz-keyframes rotate {
    100% {
        -moz-transform:rotate(360deg)
    }
}
@-o-keyframes rotate {
    100% {
        -o-transform:rotate(360deg)
    }
}
@keyframes rotate {
    100% {
        transform:rotate(360deg)
    }
}
@-webkit-keyframes bounce {
    0%, 100% {
        -webkit-transform:scale(0)
    }
    50% {
        -webkit-transform:scale(1)
    }
}
@-moz-keyframes bounce {
    0%, 100% {
        -moz-transform:scale(0)
    }
    50% {
        -moz-transform:scale(1)
    }
}
@-o-keyframes bounce {
    0%, 100% {
        -o-transform:scale(0)
    }
    50% {
        -o-transform:scale(1)
    }
}
@keyframes bounce {
    0%, 100% {
        transform:scale(0)
    }
    50% {
        transform:scale(1)
    }
}
.slider-enter,.slider-enter-to{
    opacity:1
}
.slider-leave-to,.slider-leave{
    opacity:0;
}
.slider-enter-active, .slider-leave-active {
    transition: all .4s
}
</style>
