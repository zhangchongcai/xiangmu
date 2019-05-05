<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            :title="title"
            :visible.sync="showStatus"
            :modal-append-to-body='false'
            :append-to-body="false"
            center>
            <div >
                <ul class="more-list">
                    <li v-for="(item,ind) in allTickets" :key="ind" 
                    @click="hanlderItem(item.id)"
                    >
                    {{item.name}}
                    <i v-show="item.id == currentTicketId" class="iconfont iconpiaoleixuanzhong1 have-sel-pos"></i>
                    </li>
                </ul>
            </div>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button icon="iconfont iconzuojiantouda"></el-button>
                <el-button icon="iconfont iconyoujiantouda"></el-button>
            </div> -->
        </el-dialog>

    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {MORE_TICKETS_TRIGER, SET_CURRENT_TICKET_ID,GET_CART_DATA} from 'types'
export default {
    props:{
        list:{
            type:Array
        },
        title:{
            type:String,
            default:'更多票类'
        }
    },
    data() {
        return {
            hoveItem:null,
        }
    },
    computed:{
      ...mapGetters([
          'ticketsDialog',
          'allTickets',
          'currentTicketId',
          'currentTicketItem',
          'billCode'   
      ]),

      showStatus: {
          get() {
              return this.ticketsDialog
          },

          set(val) {
              this.MORE_TICKETS_TRIGER()
          }
      }
    },
    methods: {
        ...mapMutations([
            MORE_TICKETS_TRIGER,
            SET_CURRENT_TICKET_ID,
            GET_CART_DATA
        ]),

        hanlderItem(id) {
            this.SET_CURRENT_TICKET_ID(id)
            this.MORE_TICKETS_TRIGER()
        }

    },
    created() {
    }
    
    
}
</script>
<style lang="scss" scoped>
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
                    position: relative;
                    cursor: pointer;

                    &:hover {
                        color: $font-color3;
                    }
                    &:first {
                        margin-left: 0px;
                    }

                    .have-sel-pos {
                        position: absolute;
                        right: 0;
                        top: 0;
                        font-size: 32px;
                        color: #3B74FF;
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


