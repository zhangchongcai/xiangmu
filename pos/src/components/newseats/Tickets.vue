<template>
    <div class="tickets-container">
        <div class="tickets-header">
            <span class="tickets-type">票类</span>
            <span v-if="selPriceItem.length" class="have-sel">(已选：{{selPriceItem[0].name + ' ' +  '￥' + selPriceItem[0].price}})</span>
        </div>
        <div class="ticket-btn-container">
          <span v-for="(item, index) in ticketArr.slice(0, 5)" :key="'ticket' + index" class="default-ticket-btn active-ticket-btn" @click="selTicket(item.id)">
            {{item.name + ' ' + '￥' + item.price}}
            <i v-show="item.id == currentTicketId" class="iconfont iconpiaoleixuanzhong1 have-sel-pos"></i>
          </span>
          <span v-if="ticketArr.length > 5 " class="default-ticket-btn more-btn" @click="openMoreTicket">
             更多票类
          </span>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_CURRENT_TICKET_ID} from 'types'
export default {
    props: {
        ticketArr: {
            type: Array,
            default: () => []
                    }
    },

    computed: {
        ...mapGetters([
            'currentTicketId',
        ]),

        selPriceItem() {
            let arr = this.ticketArr.filter(item => {
                return item.id == this.currentTicketId
            })

            return arr
        }
    },

    methods: {
       ...mapMutations([
          SET_CURRENT_TICKET_ID
       ]),

       //选择电影票
       selTicket(id) {
        //    console.log(id)
           this.SET_CURRENT_TICKET_ID(id)
       },

      //打开更多票类
      openMoreTicket() {
          this.$emit("openMoreTicket")
      }
    }
}
</script>

<style lang="scss" scoped>
 .tickets-container {
     width: 100%;
     height: 16vh;
     box-sizing: border-box;
     overflow: hidden;
     @include header-bgcolor();

     .tickets-header {
        width: 100%;
        height: 38px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .tickets-type {
            font-size: $font-size14; 
            font-weight: bold; 
            padding: 0 12px;
        }

        .have-sel {
            font-size: $font-size12;
        }
     }

     .ticket-btn-container {
         width: 100%;
         display: flex;
         justify-content: flex-start;
         flex-wrap: wrap;

         .default-ticket-btn {
             box-sizing: border-box;
             width: calc((100% - 1% * 3) / 3);
             margin-left: 0.5%;
             margin-bottom: 2px;
             padding: 1.2vh 0;
             border: 1px solid #A4BEFC;
             background: #ffffff;
             display: flex;
             justify-content: center;
             align-items: center;
             color: $font-color3;
             font-size: $font-size12;
             position: relative;
             cursor: pointer;
         }

         .have-sel-pos {
           position: absolute;
           right: 0;
           top: 0;
           font-size: 32px;
           color: #3B74FF;
         }

         .more-btn {
             color: $font-color-blue;
         }
     }
 }
</style>


