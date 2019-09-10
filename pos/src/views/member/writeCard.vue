<template>
  <div class="write-card">
    <div class="write-title">
      <span class="title">写卡</span>
      <div class="nav-warp">
        <div
          class="carousel-container"
          ref="twoNavScroll">
          <ul
            class="carousel"
            ref="carouselSed">
            <li
              v-for="(item,ind) in filtrate"
              :key="ind"
              :class='["carousel-item",ind == towMenuSele? "tow-active" : ""]'
              @click='handleItemType(ind,item)'>
              <span class="el-dropdown-link">
                {{item.desc}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-batch member-card-wrap">
        <p class="batchTitle">卡政策</p>
        <div class="card-list">
            <div v-if="batch.length" class="card-list-wrap">
                <template v-for="(item,index) in batch">
                    <div 
                        :key="index"
                        class="member-card-item stored_card" 
                        :class="item.cardTypeCode == 'stored_card'?'stored_card':item.cardTypeCode =='equity_card'?'equity_card':'cobranded_card'"
                        @click="handleSelected(item)">
                        <div class="item-up">
                            <div class="card-type" :class="item.cardTypeCode == 'stored_card'?'stored_card_type':item.cardTypeCode =='equity_card'?'equity_card_type':'cobranded_card_type'">{{item.cardType}}</div>
                            <div class="card-info">
                            <div class="card-name" :class="item.cardTypeCode == 'stored_card'?'stored_card_name':item.cardTypeCode =='equity_card'?'equity_card_name':'cobranded_card_name'">{{item.cardName}}</div>
                            <div class="card-num">{{item.productNo}}</div>
                            </div>
                        </div>
                        <div class="item-bottom">
                            <div class="card-status">创建时间：{{item.createTime}}</div>
                        </div>
                    </div>
                </template>
            </div>
            <div v-else class="cardTypeEmpty">暂未查询到卡政策</div>
        </div>
        <p class="batchTitle">总计：{{total}}卡政策</p>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="9"
            :current-page.sync='current'
            @current-change='getProductListByType'>
        </el-pagination>
        <cardList 
            :isShowTable.sync="isShowTable" 
            :cardProductId='cardProductId'
            v-model="radio"></cardList>
    </div>
    <div class="foot-buttom-layer">
      <el-button
        @click="$router.go(-1)"
        class="common-btn"
      >返回</el-button>
    </div>
  </div>

</template>
<script>
import { MemberAjax } from "src/http/memberApi.js";
import { mapGetters ,mapState} from 'vuex'
import cardList from './components/wirteCardList'
export default {
    data(){
        return {
            filtrate : [],
            batch:[],
            current:1,
            towMenuSele:0,
            total:0,
            cardType:'',
            isShowTable:false,
            cardProductId:'',
            radio:''
        }
    },
    computed:{
        ...mapState(['member']),
        ...mapGetters(['tenantId'])
    },
    mounted(){
        this.getCardType();
        this.getProductListByType(1,'stored_card')
    },
    methods:{
        //点击卡片获取table
        handleSelected(item){
            this.isShowTable = true;
            this.cardProductId = item.id;
        },
        //卡类型点击tab
        handleItemType(index,item){
            this.isShowTable = false;
            this.towMenuSele = index;
            this.radio = '';
            this.getProductListByType(1,item.code)
        },
        //获取卡类型
        getCardType(){
            MemberAjax.list({}).then(res=>{
                if(res.code !== 200){
                    this.$message.warning(re.msg);
                    return
                }
                this.filtrate = res.data.filter(item=>{
                    return item.code !== 'cobranded_card'
                })
            })
        },
        //根据卡类型获取卡列表
        getProductListByType(current,cardType = this.cardType){
            this.member.pageLoading = true;
            this.cardType = cardType;
            this.current = current;
            let params = {
                cardType:cardType,
                current:current || this.current,
                size:9,
                tenantId:this.tenantId
            }
            MemberAjax.getProductListByType(params).then(res=>{
                this.member.pageLoading = false;
                if(res.code !== 200){
                    this.$message.warning(re.msg);
                    return
                }
                this.batch = res.data.records;
                this.total = Number(res.data.total);
            }).catch(err=>{
                this.member.pageLoading = false;
                console.log(err)
            })
        }
    },
    components:{cardList}
};
</script>
<style lang="scss" scoped>
.write-card {
  .write-title {
    position: relative;
    height: 6.3vh;
    line-height: 6.3vh;
    display: flex;
    color: #fff;
    @include bg_color($background-color-theme);
    .title{
        font-size:$font-size13;
        padding-left:3vw;  
    }
    .nav-warp {
      position: relative;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: flex-end;
      & > .carousel-container {
        overflow: hidden;
        width: 81.9vw;
        height: 4.7vh;
        margin-left: 1.8vw;
        padding-top: 0.8vh;
        .carousel {
          height: 100%;
          line-height: 100%;
          white-space: nowrap;
          display: inline-block;
          vertical-align: top;
          .carousel-item {
            display: inline-block;
            width: 11.3vw;
            height: 100%;
            line-height: 4.7vh;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            background: #e4e7f6;
            margin-left: 0.4vw;
            text-align: center;
            cursor: pointer;
            span{
                font-size: $font-size13;
                color:#333;
            }
          }
        }
      }
      .tow-active{
            background: #FFFFFF!important;
        }
    }
  }
  .card-batch{
    .batchTitle{
        position:relative;
        padding:1vw 0 1vw 3vw;
        font-size:$font-size12;
        text-align:left;
    }
    .card-list{
        width:95vw;
        // max-height:60vh;
        min-height:60vh;
        margin:0 auto;
        .member-card-item{
            height:12vw;
            background-repeat:no-repeat!important;
            background-size:100% 100% !important;
            .item-bottom{
                margin-top:2.5vw
            }
        }
        .card-list-wrap{
            display:flex;
            justify-content:space-between;
            flex-wrap:wrap;
            &::after{
                content: '';    
                width: 27.3vw;
                border:1px solid transparent;
            }
        }
    }
    .cardTypeEmpty{
        font-size:$font-size13;
    }
 }

}
</style>