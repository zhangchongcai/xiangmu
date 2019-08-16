<template>
    <div v-if="availableCouponList.length" class="coupon-list-container">
        <div class="coupon-list">
          <div class="left">
              <span v-for="(item, index) in pageCouponlist" :key="index" class="coupon-item">
                <span>{{item.ticketName}}：{{item.ticketCode}}</span>
                <i class="iconfont iconshanchu" @click="delCoupon(item)"></i>
              </span>
          </div>

          <div class="right">
              <el-pagination
                background
                layout="prev, next"
                :current-page.sync="currentPage"
                :page-size="3"
                :total="availableCouponList.length"
                class="pager"
                >
              </el-pagination>
          </div>
        </div>
    </div>
</template>

<script>
import {cancelTicket} from 'http/apis'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {DEL_SELECTED_COUPON, CART_FIND_CART_DATA, SET_ACTIVITY_LIST} from 'types'
export default {
    props: {
        addedNum: {
            type: Number,
            default: 0
        },
        isSelNum: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            currentPage: 1,
        }
    },

    computed: {
     ...mapGetters([
        'availableCouponList',
        'billCode',
        'payMethod',
        'selActivityList',
        'payedList'
     ]),
      pageCouponlist() {
          if(this.availableCouponList.length)
          return this.availableCouponList.slice((this.currentPage-1) * 3, (this.currentPage) * 3)
      }
    },

    methods: {
        ...mapMutations([
           DEL_SELECTED_COUPON,
           SET_ACTIVITY_LIST
        ]),
        ...mapActions([
            CART_FIND_CART_DATA
        ]),
        //继续添加优惠券
        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox")
        },
        //删除优惠券 billCode   ticketCode  chooseKeys  payTypeCode
        delCoupon(item) {
            // console.log(item)
            cancelTicket({
              billCode: this.billCode,
              ticketCode: item.ticketCode,
              chooseKeys: this.selActivityList,
              payTypeCode: this.payMethod.currentPayMethodId
            }).then(res => {
                if(res.code == 200) {
                    this.DEL_SELECTED_COUPON(item)
                    this.SET_ACTIVITY_LIST(res.data.marketingResultList)
                    this.CART_FIND_CART_DATA()
                }else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
  .coupon-list-container {
      width: 28.3vw;
      height: 14.8vh;

      .coupon-header {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          font-size: $font-size12;
          color: $font-color6;
          line-height: 3.2vh;

          .btn {
              width: 4.2vw;
              height: 2.6vh;
              border: 1px solid $blue-color;
              color: $blue-color;
          }
      }

      .coupon-list {
          box-sizing: border-box;
          padding: 8px;
          width: 100%;
          height: calc(100% - 2.6vh);
          background: #EFF3FF;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          .left {
              width: calc(100% - 4.2vw);
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;

              .coupon-item {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  font-size: $font-size12;
                  line-height: 3.5vh;
              }
          }

          .right {
            width: 4.2vw;
            height: 100%;
            position: relative;

            .pager {
                position: absolute;
                right: 66%;
                top: 64%;
                transform: rotate(90deg);
                transform-origin: right bottom;
            }
          }
      }
  }
</style>

