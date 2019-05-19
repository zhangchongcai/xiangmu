<template>
    <div class="meals">
        <div class="pageTitle">备餐登记</div>
        <main class="main">
            <div class="meals-warp" v-for=" (item,ind) in mealsList" :key="ind">
                <div class="title">交易单号：20170856321458652321</div>
                <div class="content">
                    <ul class="inof">
                        <li>交易时间：<span>2017-08-09-20:23</span> </li>
                        <li>交易金额：<span>50元</span></li>
                        <li>交易终端：<span>1002</span></li>
                        <li>备餐期限：<span>2017-08-09-20：23</span> 
                        <span style="color:orange;float:right;margin-right:5%" v-if="item.isSent">自取</span>
                        <span style="color:#34B886;float:right;margin-right:5%" v-else>送餐</span>
                        </li>
                    </ul>
                    <ul class="food">
                        <li><span>三人乐享套餐 x 1</span>(中爆米花x1，可乐x1) </li>
                        <li><span>香辣鸡腿堡x1；鲜橙多果粒橙x1；可爱多x1</span> </li>
                    </ul>
                    <div class="footer">
                        <span @click="register">备餐登记</span>
                    </div>
                </div>
            </div>
            <div class="pagination">
                <ul>
                    <li class="pre"> < </li>
                    <li>1/2</li>
                    <li class="next">></li>
                </ul>
                <el-button type="primary" style="float:right" plain  @click="goBack">返回</el-button>
            </div>
        </main>
        <el-dialog
            title="备餐登记"
            :visible.sync="dialogVisible"
            width="42.7vw"
            >
            <div class="meals-row" style="line-height:4.2vh">
                <span>备餐期限：</span>
                <el-input v-model="num"></el-input>
            </div>
            <div class="meals-row">
                <span>取餐类型：</span>
                <el-radio-group v-model="type">
                    <el-radio :label="1">自取</el-radio>
                    <el-radio :label="2">送餐</el-radio>
                </el-radio-group>
            </div>
            <div class="meals-row">
                <span>备注：</span>
                <el-input type="textarea" v-model="desc"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible:false,
            num:'',
            type:1,
            desc:'',
            mealsList:[
                {isSent:1},
                {isSent:0},
                {isSent:1},
                {isSent:1},
                {isSent:1},
                {isSent:0},
            ]
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        register() {
            this.dialogVisible = true
        }
    },
}
</script>
<style lang="scss">
.main{
    padding: 2vw .9vw;
    background: #f5f5f5;
}
.pageTitle{
    font-size: $font-size16;
    @include bg_color($background-color-theme);
    padding: 1.3vh 3vw;
    color:$font-color-white
}
.meals-warp{
    display: inline-flex;
    flex-direction: column;
    width: 31.1vw;
    padding-bottom: 2vh;
    margin-left:1.1vw;
    margin-bottom: 2.6vh; 
    color: #999999;
    background: #FFFFFF;
    .title{
        padding-left:5%; 
        height: 5.2vh;
        line-height: 5.2vh;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background: #3B74FF;
        color: #FFFFFF;
        font-size: $font-size14;
    }
    span{
        color: #151515;
        font-size: $font-size12;
    }
    .content{
        padding-left: 4%;
    }
    .inof{
        box-sizing: border-box;
        height: 15.1vh;
        padding: 2% 0;
        border-bottom: 1px dashed #999999;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        li{
            font-size: $font-size12;

        }
    }
    .food{
        flex: 1;
        li{
            margin-top: 3%;
            font-size: $font-size12;
        }
    }
    .footer{
        margin-top: 5%;
        text-align: center;
        span{
            display: inline-block;
            width: 14.9vw;
            height: 4.2vh;
            line-height: 4.2vh;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            background: #3B74FF;
            color: #FFFFFF;
            font-size: $font-size12;
        }
    }
}
.main .pagination{
    padding: 2vw;
    text-align: center;
    ul{
        display: inline-flex;
        line-height: 3.4vh;
        li:nth-child(2){
            margin: 0 5%;
        }
    }
    .pre,.next{
        width: 3.9vw;
        height: 3.4vh;
        text-align: center;
        line-height: 3.4vh;
        color: #3B74FF;
        cursor: pointer;
        font-size: $font-size12;
        background: #FFFFFF;
        border: 1px solid #BCBCBC;
        border-radius: 2px;
        border-radius: 2px;
    }
    
}
.meals-row{
        margin-bottom: 2vh;
        display: flex;
        width: 27vw;
        justify-content: flex-end;
        margin: 0 auto;
        margin-bottom:20px;
        .el-input,.el-textarea,.el-radio-group{
            width: 19.5vw;
        }
        .el-input{height: 4.2vh;input{height: 100%;}}
}

</style>


