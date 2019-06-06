<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            title="更多支付"
            :visible.sync="showStatus"
            :modal-append-to-body='false'
            :append-to-body="false"
            center>
            <div >
                <ul class="more-list">
                    <li v-for="(item,ind) in allPayWays" :key="ind" 
                    @click="hanlderItem(item)"
                    >
                    {{item.payTypeName}}</li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button icon="iconfont iconzuojiantouda"></el-button>
                <el-button icon="iconfont iconyoujiantouda"></el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {MORE_PAY_TRIGER, PAY_METHOD_TRIGER, PAY_DIALOG_TRIGER} from 'types'
export default {
    props: {
        usedInBox: {
            type: String,
            default: 'home'
        }
    },
    data() {
        return {
            
        }
    },
    computed:{
      ...mapGetters([
          'morePayDialog',
          'allPayWays',
          'seatSelection',
          'cartDatalist'
      ]),

      showStatus: {
          get() {
              return this.morePayDialog
          },

          set(val) {
              this.MORE_PAY_TRIGER()
          }
      }
    },
    methods: {
        ...mapMutations([
            MORE_PAY_TRIGER,
            PAY_METHOD_TRIGER,
            PAY_DIALOG_TRIGER
        ]),
        hanlderItem(item) {
            if(this.cartDatalist.length || this.seatSelection.length) {
                this.PAY_DIALOG_TRIGER()
            }else {
                this.$message({
                message: '请您选择座位或者卖品',
                type: 'warning'
                });
            }
            this.PAY_METHOD_TRIGER(item)
            this.MORE_PAY_TRIGER()
        }
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
                .el-button{
                    padding: 4px 11px;
                    width: 3.9vw;
                    height: 3.5vh;
                    font-size: $font-size12;
                }
            }
        }
        
</style>


