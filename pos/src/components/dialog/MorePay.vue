<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            title="更多支付方式"
            :visible.sync="showStatus"
            :modal-append-to-body='false'
            :append-to-body="false"
            center>
            <div >
                <ul class="more-list" v-if="sortState">
                    <draggable v-model="sortArr">
                        <li v-for="(item,ind) in sortArr" :key="ind" 
                        >
                        {{item.payTypeName}}</li>
                    </draggable>
                </ul>
                <ul class="more-list" v-else>
                        <li v-for="(item,ind) in allPayWays" :key="ind" 
                        @click="hanlderItem(item)"
                        >
                        {{item.payTypeName}}</li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <template v-if="!sortState">
                    <el-button plain  size="small" v-if="paySort" @click="sortStart">排序</el-button>
                    <el-button  plain size="small" @click="close">返回</el-button>
                </template>
                <template v-else>
                    <el-button plain  size="small" @click="upSort" >确定</el-button>
                    <el-button  plain size="small" @click="sortState= false">取消</el-button>
                </template>
                
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {MORE_PAY_TRIGER, PAY_METHOD_TRIGER, PAY_DIALOG_TRIGER, GET_ACTIVITY_DATA, SET_VIP_CHECKOUT_BOX} from 'types'
import { VM_ON_SORT_GET_PAY_LIST } from 'types/vmOnType'
import { faPayTypeCinemaSeqencing } from 'src/http/apis.js'
import draggable from 'vuedraggable'
export default {
    components: {
        draggable,
    },
    props: {
        usedInBox: {
            type: String,
            default: 'home'
        }
    },
    data() {
        return {
            sortArr:[],
            sortState:false,
        }
    },
    computed:{
      ...mapGetters([
          'morePayDialog',
          'allPayWays',
          'seatSelection',
          'cartDatalist',
          'payDialog',
          'payMethod',
          'getUserConfig',
          'payedList',
          'paySort',
          'vipInfo',
          'isPayIng'
      ]),

      withoutCouponPayList() {
         if(this.payedList.length) {
             let arr = this.payedList.filter((item) => {
                 return item.payTypeCode != '0X09'
             })

             return arr.length
         }else {
             return 0
         }
      },

      showStatus: {
          get() {
              return this.morePayDialog
          },

          set(val) {
              this.MORE_PAY_TRIGER()
          }
      },
    },
    mounted(){
        this.arr = JSON.parse(JSON.stringify(this.allPayWays))
    },
    methods: {
        ...mapMutations([
            MORE_PAY_TRIGER,
            PAY_METHOD_TRIGER,
            PAY_DIALOG_TRIGER,
            SET_VIP_CHECKOUT_BOX
        ]),
        ...mapActions([
            GET_ACTIVITY_DATA
        ]),
        hanlderItem(item) {
            if(item.payTypeCode != this.payMethod.currentPayMethodId && this.payMethod.currentPayMethodId != '' && this.getUserConfig.is_full_pay != '1' && this.withoutCouponPayList != 0) {
                this.$message({
                message: '此门店不支持混合支付方式！',
                type: 'warning'
                });
                this.MORE_PAY_TRIGER()
                return
            }
            if(this.isPayIng && this.payMethod.currentPayMethodId == '0X03' && !this.vipInfo.withCash){
                this.$message({
                message: '该卡不支持混合支付方式!',
                type: 'warning'
                });
                this.MORE_PAY_TRIGER()
                return
            }

            if((this.seatSelection.length || this.cartDatalist.length) && item.payTypeCode != '0X03') {
                  this.PAY_METHOD_TRIGER(item)
                  if(!this.payDialog) this.PAY_DIALOG_TRIGER();
                  this.GET_ACTIVITY_DATA()
           }else if((this.seatSelection.length || this.cartDatalist.length) && item.payTypeCode == '0X03') {
               this.SET_VIP_CHECKOUT_BOX(true)
           }else {
               this.$message({
                message: '请您选择座位或者卖品',
                type: 'warning'
                });
           }
           this.MORE_PAY_TRIGER()
        },
        sortStart(){
            this.sortArr = JSON.parse(JSON.stringify(this.allPayWays))
            this.sortState = true;
        },
        async upSort(){
            const data = await faPayTypeCinemaSeqencing(
                this.sortArr.map((item,index) => {
                     return {
                        seq : index+1,
                        uid : item.uid

                    }
                    
                })
            )
            if(data.code != 200) return this.$message.error(data.code);
            this.$message.success(data.msg)
            this.$vm.$emit(VM_ON_SORT_GET_PAY_LIST)
            this.sortState = false;
        },
        close(){
            this.MORE_PAY_TRIGER()
        },
    },
    created() {
    },
    
    
    
}
</script>
<style lang="scss">
    .more-pay-ticket-warp{
            ul{
                li{
                    display: inline-block;
                    width: 10.2vw;
                    height: 5.2vh;
                    text-align: center;
                    line-height: 5.2vh;
                    background: #FFFFFF;
                    border: 1px solid #A7B8E4;
                    border-radius: 2px;
                    margin-left: 1.1vw;
                    margin-top: 1.3vh;
                    font-size: $font-size12;
                    cursor: pointer;
                    &:first {
                        margin-left: 0px;
                    }
                    &:hover{
                        @include btn-background-color-theme($btn-background-color-theme);
                        @include font_color($font-color-white);
                    }
                }
            }
            .el-dialog__header{
                text-align: left;
                .el-dialog__title{
                    font-size: $font-size12;
                }
                    font-size: $font-size12;
            }
            .dialog-footer{
                text-align: right;
                padding-right: 2.9vw;
                // .el-button{
                //     padding: 4px 11px;
                //     width: 3.9vw;
                //     height: 3.5vh;
                //     font-size: $font-size12;
                // }
            }
        }
        
</style>


