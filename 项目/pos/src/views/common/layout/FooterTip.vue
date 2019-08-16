<template>
    <div class="footer-tip">
        <span>慧影云 V1.0.0</span> <span>&nbsp;&nbsp;{{cinemaName}}</span> <span>&nbsp;&nbsp;影院编码：{{cinemaCode}}</span>
              <!-- <span class="systemInform" :title="noticeData.content">
                  <template v-if="noticeData.content">
                     &nbsp;&nbsp; 系统通知：{{noticeData.content}}
                  </template>
              </span> -->
              <span >&nbsp;&nbsp;终端编号: {{terminalId}}</span>  
              <span >&nbsp;&nbsp;领取备用金: {{preAmount}}</span>  
              <span :style="{flex:1}"></span>
              <span>{{timeStr}}</span>
              <button class="mini-mize" @click="toMinimize"> — 最小化窗口</button>
    </div>
</template>

<script>
import util from "../../../http/app";
import { mapGetters } from 'vuex'
import { noticeList } from 'src/http/apis.js'
export default {
    data(){
        return {
            noticeData:{},
            timeStr:'',
            terminalId:JSON.parse(localStorage.getItem('terminalId'))  || '',
            dayStr:'',
            intervalId:null,
        }
    },
    computed:{
        ...mapGetters([
            'cinemaName',
            'cinemaCode',
            'preAmount'
        ])
    },
    mounted(){
        // this.getListData()
        const _this = this;
        this.intervalId =  setInterval(()=>{
            _this.time()
        },1000)
    },
    beforeDestroy(){
        clearInterval(this.intervalId)
    },
    methods:{
        //最小化窗口
        toMinimize(){
            util.toMinimize()
        },
        async getListData(){
            const data = await noticeList({
            page :1,
            pageSize : 1
            })
            if(data.code !=200) return this.$message.error(data.msg);
            if(data.data.list && data.data.list.length){
                this.noticeData = data.data.list[0]
            }
        },
        time(){
            const { evenNumber } = this;
            let dateStrArr = ['日','一','二','三','四','五','六'];
            let date = new Date();
            let dateStr = `${date.getFullYear()}-${evenNumber(date.getMonth()+1)}-${evenNumber(date.getDate())} ${evenNumber(date.getHours())}:${evenNumber(date.getMinutes())}:${evenNumber(date.getSeconds())} 星期${dateStrArr[date.getDay()]}`
            this.timeStr = dateStr;
        },
        evenNumber(number){
            return number > 9 ? number : '0'+number
        }
    }
}
</script>

<style lang="scss">
    .footer-tip {
        height: 2.6vh;
        width: calc(100vw);
        font-size: $font-size12;
        box-sizing: border-box;
        background-color: #EFF1FF;
        color: $font-color6;
        display: flex;
        align-items: center;
        padding: 0 20px;
        .systemInform{
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .scale-btn {
            width: 9.4vw;
            height: 2.0vh;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border: 1px solid $background-color-theme;
            font-size: $font-size12;
            color: $background-color-theme;
            margin-right: 10px;

            &:hover {
                cursor: pointer;
                font-weight: bold;
            }
        }
    }
    .mini-mize{
        margin-left: 20px;
        // width: 96px;   
        height: 18px;
        border: 1px solid #3559AF;
        border-radius: 2px;
        border-radius: 2px;
        color: #3559AF;
        
    }
</style>