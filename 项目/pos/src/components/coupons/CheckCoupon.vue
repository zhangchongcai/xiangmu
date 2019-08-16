<template>
    <div class="coupon-container">
        <div class="btns">
            <el-button class="common-btn" @click="openCouponCheckoutBox">使用票券</el-button>
            <el-button class="common-btn" @click="CHECK_OUT_COUPON">会员票券查询</el-button>
            <el-button class="common-btn" @click="checkoutGroupCoupon">使用团购券</el-button>
        </div>
        <div class="sel-coupon-container" :style="{height: !isExtend ? '4.2vh' : 'auto'}">
          <div class="sel-coupon-container-header">
               <span style="padding-left: 12px">
                 已添加({{availableCouponList.length}}张)
                </span>
                <span style="padding-right: 12px" @click="isExtend = !isExtend">
                    {{this.isExtend ? '收起' : '展开'}}
                    <i class="iconfont iconxiangxiazhankaixiaojiantou"></i>
                </span>
          </div>
          <div class="coupon-list-container">
             <!-- 选中可用的票券后弹出的票券列表 -->
            <coupon-list v-if="isExtend" @openCouponCheckoutBox="openCouponCheckoutBox"></coupon-list> 
          </div>
        </div>
    </div>
</template>

<script>
import {getGroupCoupon} from 'src/http/apis.js'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {CHECK_OUT_COUPON, CHECK_OUT_GCOUPON_RESULT, GET_GC_DATA} from 'types'
import CouponList from 'components/settlement/CouponList'
export default {
    data() {
        return {
            isExtend: false
        }
    },
    computed: {
        ...mapGetters(
            ['availableCouponList']
        ) 
    },
    methods: {
        ...mapMutations([
          CHECK_OUT_COUPON,
          CHECK_OUT_GCOUPON_RESULT
        ]),
        ...mapActions([
          GET_GC_DATA
        ]),
        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox")
        },
        checkoutGroupCoupon() {
            this.GET_GC_DATA()
            this.CHECK_OUT_GCOUPON_RESULT()
        }
    },
    components: {
        CouponList
    }
}
</script>

<style lang="scss" scoped>
.coupon-container {
    width: 29.9vw;
    margin-top: 20px;
    .btns {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .common-btn {
            padding: 0 1.8vw;
            height: 4.2vh;
            line-height: 4.2vh;
            color: #3b74ff;
            font-size: $font-size12;
            border-color: #3b74ff;
            border-radius: 2px;
        }
    }
    .sel-coupon-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: $font-size12;
        color: #666;
        border: 1px solid #A7B8E4;
        border-radius: 2px;
        background: #fff;
        position: relative;

        .sel-coupon-container-header {
            width: 100%;
            height: 4.2vh;
            line-height: 4.2vh;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .coupon-list-container {
            display: flex;
            justify-content: center;
        }
    }
}
</style>


