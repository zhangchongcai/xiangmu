<template>
    <div v-if="replacegoods.length" class="replaceDialog">
        <el-dialog
            title="更换"
            :visible.sync="dialogVisible"
            width="77.3vw"
            >
            <div class="title">两人分享套餐</div>
            <ul v-if="replacegoods.length" class="dialog-goods">
                <li class="item-warp" v-for="(item,ind) in replacegoods" :key="ind" @click="handerItem(item,ind)">
                    <div   :class="['row-item',status==ind?'active':'']">
                        {{item.skuName}}
                    </div>
                    <div class="label" v-if="status==ind">
                        <span class="iconfont iconsanjiaoxing-up"></span>
                    </div>
                </li>
            </ul>
            <ul class="replace">
                <div>{{replacegoods[status].skuName}}可更换</div>
                <li v-for="(item,ind) in isReplacedArray[status].skuList" :key="ind" href='javascript:void(0)' class="row-item">
                    {{item.name}}
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {replaceGood} from 'http/apis'
import {SHOW_REPLACE_GOODS} from 'types'
import {mapMutations,mapGetters} from 'vuex'
export default {
    props:{
        
    },
    data() {
        return {
            status:0,
            isReplacedArray: []
        }
    },
    computed: {
        ...mapGetters([
            'showReplacegoods',
            'replacegoods'
        ]),
        dialogVisible: {
            get() {
                return this.showReplacegoods
            },
            set(val) {
                this.SHOW_REPLACE_GOODS()
            }
        }
    },
    methods: {
        ...mapMutations([
            SHOW_REPLACE_GOODS
        ]),
        handerItem(item,ind) {
               console.log(ind)
               this.status = ind
        },
    },
    mounted() {
       replaceGood({
           cinemaUid:"123123",    //影院Uid, 以后改成从Vuex中获得
		   comboUid:"12345678"    //套餐商品Uid 以后改成从Vuex中获得
       }).then(res => {
           if(res.code == 200) {
               this.isReplacedArray = res.data
           }
       })
    }
}
</script>
<style lang="scss">
    .replaceDialog{
        .el-dialog{
            padding: 0;
        }
        .el-dialog .el-dialog__body{
            padding: 0!important;
        }
        .title{
            font-family: MicrosoftYaHei-Bold;
            font-size: $font-size12;
            color: #333333;
            padding-left: 2.9vw;
            letter-spacing: 0;
            margin-bottom: 1vh;
            font-weight: 550;
        }
        .dialog-goods{
            padding-left: 2.9vw;
        }
        .replace{
            padding-left: 2.9vw;
            background: #E5EAFF;
            padding-bottom: 2.6vh;
            padding-top: 2.6vh;
        }
        .item-warp{
            display:inline-flex;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: space-between;
            height: 9vh;
            text-align: center;
            .label{
                flex:1;
                box-sizing: border-box;
                margin-right: .8vw;
                position: relative;
                .iconfont{
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    display: inline-block;
                    color: #E5EAFF;
                    width:0;
                    height:0;
                    border-width:0 15px 15px;
                    border-style:solid;
                    border-color:transparent transparent #E5EAFF;/*透明 透明  灰*/
                }
            }
        }
        .row-item{
            display: inline-block;
            width: 13.7vw;
            height: 5.2vh;
            text-align: center;
            line-height: 5.2vh;
            background: #FFFFFF;
            border: 1px solid #A7B8E4;
            border-radius: 2px;
            margin-right: .8vw;
            font-size: $font-size12;
        }
        .noSel {
            cursor: not-allowed;
        }
        .active{
            background: #3B74FF;
            color: #F5F5F5;
        }
    }
</style>


