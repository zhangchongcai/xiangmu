<template>
    <div class="sell-coupon">
        <header class="pageTitle">票卷销售</header>
        <main class="main">
            <section class="section">
                <div class="name">选择票卷</div>
                <div class="content">
                    <ul>
                        <li v-for="(n,ind) in 15" :key="ind" @click="handerItem(item,ind)" :class="ind==active?'active':''">
                            <div class="title">2D电影票兑换</div>
                            <div class="price">￥42</div>
                        </li>
                    </ul>
                </div>
            </section>
            <aside class="aside">
                <div class="name">购物车</div>
                <div class="content">
                    <ul class="row-item">
                        <li>
                            <span>2D电影票兑换券</span>
                            <span>100分</span>
                        </li>
                        <li>
                            <el-input-number size="mini" v-model="num"></el-input-number>
                        </li>
                        <li><span class="iconfont iconshanchu color-blue pointer"></span></li>
                    </ul>

                </div>
            </aside>
        </main>
    </div>
</template>
<script>
export default {
    data() {
        return {
            num:0,
            active:0,
        }
    },
    methods: {
        handerItem(item,ind) {
            this.active = ind 
        }
    }
}
</script>
<style lang="scss">
.sell-coupon{
    background: #f5f5f5;
    .pageTitle{
        font-size: $font-size16;
        @include bg_color($background-color-theme);
        padding: 1.3vh 3vw;
        color:$font-color-white
    }
    .name{
        height: 4.3vh;
    }
    .main{
        padding:2vw; 
        display: flex;
    }
    .section{
        width: 62vw;
        margin-right: 1.1vw;
        .content{
            box-sizing: border-box;
            width: 100%;
            padding: 2.6vh 1.7vw;
            background: #fff;
            ul{
                li{
                    display: inline-flex;
                    flex-direction: column;
                    cursor: pointer;
                    margin-bottom: .8vh;
                    margin-right: .5vw;
                    width: 19vw;
                    height: 7.8vh;
                    border: 1px solid #A7B8E4;
                    border-radius: 2px;
                    text-align: center;
                    .title{
                        flex:1;
                        font-size: 12px;
                        color: #333333;
                        line-height: 3.9vh;
                    }
                    .price{
                        flex:1;
                        font-size: 14px;
                        color: #FE825E;
                        line-height: 3.9vh;
                    }
                }
                &>li:nth-child(3n){
                    margin-right: 0;
                }
                .active{
                    background: #3B74FF 100%;
                    div{ color:#FFFFFF}
                }

            }
        }
    }
    .aside{
        flex: 1;
        .content{
            background: #fff;
            box-sizing: border-box;
            padding: 1vw;
        }
        .row-item{
            display: flex;
            li{
                line-height: 28px;
                display: inline-block;
                &:nth-child(1){
                    flex:1
                }
                &:nth-child(2){
                    flex:.1
                }
                &:nth-child(3){
                    flex:.2;
                    text-align:right;
                }
            }

        }
    }
}
</style>


