<template>
    <div class="print-check">
        <main class="main">
            <div class="pageTitle">重打印影票</div>
            <div class="row-item">
                <p class="title">基本信息</p>
                <ul>
                    <li><span class="name">订单编号：</span>90013215465215646546532</li>
                    <li><span class="name">终端编号：</span>10056</li>
                    <li><span class="name">收银员：</span>系统管理员</li>
                </ul>
                <ul>
                    <li><span class="name">交易类型：</span>消费</li>
                    <li><span class="name">交易时间：</span>2018-10-23 16：33：44</li>
                    <li><span class="name">总金额：</span>120元</li>
                </ul>
            </div>
            <div class="row-item">
                <p class="title">商品信息</p>
                <ul>
                    <li><span class="name">订单编号：</span>幕后玩家（普通/国语） |  2018-10-23 星期二  |  3号  激光厅  18:00 4排9号,4排8号(共2张)</li>
                </ul>
            </div>
            <div class="row-item">
                <p class="title">支付信息</p>
                <ul>
                    <li><span class="name">银行卡号：</span>20.00元</li>
                    <li><span class="name">重打印部分：</span><span style="color:orange;">该交易没有可重打印的凭证数据</span> </li>

                </ul>
            </div>
        </main>
        <footer class="footer">
            <el-button type="primary" plain @click="back">取消</el-button>
            <el-button type="primary"  >重打印</el-button>
        </footer>
    </div>
</template>
<script>
export default {
    data() {
        return{}
    },
    methods: {
        back() {
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss">
.print-check{
    display: flex;
    flex-direction: column;
    height: 100vh;
    .main{
        flex:1
    }
    .pageTitle{
      font-size: $font-size16;
      @include bg_color($background-color-theme);
      padding: 1.3vh 2%;
      color:$font-color-white
    }
    .row-item{
        padding-left: 2%;
        .title{
            font-size: $font-size14;
            color: #333333;
            font-weight: 550;
            padding: 1vh;
        }
        ul{
            display: flex;
            margin: 1vw;
            li{
                flex: 1;
                font-size: $font-size12;
                .name{
                    color: #666666;
                    font-size: $font-size12;
                }
            }
        }
    }
    .footer{
        text-align: right;
        height: 7.2vh;
        padding-right: 2%;
    }
}
</style>


