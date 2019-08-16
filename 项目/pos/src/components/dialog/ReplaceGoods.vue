<template>
    <div v-if="replacegoods.length" class="replaceDialog" >
        <el-dialog
            title="更换"
            :visible.sync="dialogVisible"
            width="77.3vw"
            @close="close"
            >
            <div class="title">{{infoData.goodsName}}</div>
            <ul v-if="replacegoods.length" class="dialog-goods">
                <li class="item-warp" v-for="(item,ind) in replacegoods" :key="ind" @click="handerItem(item,ind)">
                    <div   :class="['row-item',status==ind?'active':'']">
                        {{item.skuName ? item.skuName : item.merName}}
                    </div>
                    <div class="label" v-if="status==ind">
                        <span class="iconfont iconsanjiaoxing-up"></span>
                    </div>
                </li>
            </ul>
            <ul class="replace"  :key="key">
                <div>{{replacegoods[status].skuName}}可更换</div>
                <li v-for="(subItem,subInd) in replacegoods[status].cinemaSetmealItemChangeVoList" 
                :key="subInd" 
                class="row-item"
                @click="handerSubItem(subItem,subInd)"
                :class="replacegoods[status].index === subInd ? 'active' : ''">
                <div >
                    <span>{{subItem.skuName}}</span>
                    <span class="price" v-if="subItem.addPrice">{{subItem.addFlag == 1 ? '减':'加'}}{{subItem.addPrice}}元</span>
                </div>
                    
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refor">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {replaceGood,saleBillSetmealChange} from 'http/apis'
import {SHOW_REPLACE_GOODS,CART_SET_REPLAC_GOODS,CART_FIND_CART_DATA,CART_REPLACE_GOOD_DATAS} from 'types'
import {mapMutations,mapGetters,mapState,mapActions} from 'vuex'
export default {
    props:{
        
    },
    data() {
        return {
            status:0,
            isReplacedArray: [],
            subItemIndex:'',
        }
    },
    computed: {
        ...mapState({
            infoData : state => state.cart.replacegoodsInfo,
            replaceGoodDatas : state => state.cart.replacegoodDatas
        }),
        ...mapGetters([
            'showReplacegoods',
            'replacegoods',
            'billCode',

        ]),
       
        dialogVisible: {
            get() {
                return this.showReplacegoods
            },
            set(val) {
                this.SHOW_REPLACE_GOODS()
            }
        },
        key(){
            return `${Math.random()}${this.status}${this.subItemIndex}`
        }
    },
    methods: {
        ...mapMutations([
            SHOW_REPLACE_GOODS,
            CART_SET_REPLAC_GOODS,
            CART_REPLACE_GOOD_DATAS
        ]),
         ...mapActions({
            CART_FIND_CART_DATA,
        }),
        handerItem(item,ind) {
               console.log(ind)
               this.status = ind;
               this.subItemIndex = '';
        },
        handerSubItem(item,index) {
            const { replacegoods,status } = this;
            this.subItemIndex= index
            item.subIndex = index
            replacegoods[status].index = index
            this[CART_SET_REPLAC_GOODS](replacegoods)
        },
        close(){
            this.status = 0;
            this.subItemIndex = '';
        },
        async refor(){
            let reForArr = [];
            let newArr = [];
            for(let i = 0;  i < this.replacegoods.length; i++){
                let dataItem = this.replacegoods[i];
                if(dataItem.index !== undefined){
                    let item = dataItem.cinemaSetmealItemChangeVoList[dataItem.index]
                    item.billCode = this.billCode;
                    item.goodsUid = this.infoData.uid;
                    if(item.merType == 2){
                        item.merItemList = item.cinemaMakeItemEntityList;
                    }
                    reForArr.push(item)
                    let newDataItem = JSON.parse(JSON.stringify(dataItem))
                    delete newDataItem.index
                    newDataItem.cinemaSetmealItemChangeVoList.splice(dataItem.index,1);
                    let newCinemaSetmealItemChangeVoList = newDataItem.cinemaSetmealItemChangeVoList;
                    delete newDataItem.cinemaSetmealItemChangeVoList
                    newCinemaSetmealItemChangeVoList.push(newDataItem);
                    let newArrData = {
                        ...item,
                        cinemaSetmealItemChangeVoList : newCinemaSetmealItemChangeVoList
                    }
                    newArr.push(newArrData);
                    continue
                }
                newArr.push(dataItem)
            }
            if(!reForArr.length) return this.dialogVisible = false
            reForArr = JSON.parse(JSON.stringify(reForArr))
            reForArr.map((item)=>{
                if(item.itemCount){
                    item.merCount = item.itemCount
                }
                item.skuUid = item.skuSellEntity.skuUid;
                item.skuCode = item.skuSellEntity.code;
                item.skuName = item.skuSellEntity.name;
            })
            let reforObj = {
                billCode : this.billCode,
                goodsUid : this.infoData.uid,
                itemList : reForArr
            }
            let data = await saleBillSetmealChange(reforObj);
            if(data.code != 200) return this.$message.error(data.msg)
            let obj = JSON.parse(JSON.stringify(this.replaceGoodDatas)) ;
            obj[this.infoData.uid] = newArr
            this[CART_REPLACE_GOOD_DATAS](obj)
            await this[CART_FIND_CART_DATA](this.billCode)
            this.dialogVisible = false
        }
    },
    mounted() {
      
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
            .price{
                color:#FF7900;
            }
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


