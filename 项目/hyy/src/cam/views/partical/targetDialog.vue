<template>
  <!-- 指标配置弹窗 -->
  <div class="reset-target-dialog">
    <el-dialog title="指标设置" :visible.sync="show" width="448px"
        :before-close="handleClose"
        :close-on-click-modal="false">
        <div class="content">
            <div class="select">
                <div class="label">选项库( {{selectList.length}} / {{total}})</div>
                <div class="item-wrap">
                    <!-- 销售类 -->
                    <div class="item-list">
                        <div class="item-name">
                        {{'销售类'}}
                        </div>
                        <el-checkbox-group v-model="selectList" :max="6"  >
                            <el-checkbox  class="item" v-for="(item,index1) in sale" 
                                :label="item"
                                :key="index1" 
                                :checked="item.userBinding ==1?true:false">
                                <span>{{item.name}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!-- 利润类 -->
                    <div class="item-list" >
                        <div class="item-name">
                        {{'利润类'}}
                        </div>
                        <el-checkbox-group v-model="selectList"  :max="6">
                            <el-checkbox class="item" 
                            :label="item" 
                            v-for="(item,index2) in profit" 
                            :key="index2" 
                            :checked="item.userBinding ==1?true:false">
                                <span>{{item.name}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!-- 效率类 -->
                    <div class="item-list" >
                        <div class="item-name">
                        {{'效率类'}}
                        </div>
                        <el-checkbox-group v-model="selectList" :max="6">
                            <el-checkbox class="item" :label="item" v-for="(item,index3) in ratio" :key="index3" :checked="item.userBinding ==1?true:false">
                                <span>{{item.name}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
            <div class="selected">
                <div class="label flex">
                    已选择({{selectList.length}} )
                    <div class="tip">拖拽可进行排序</div>
                </div>
                <div class="item-wrap">
                    <draggable v-model="selectList" group="people" @start="drag=true" @end="drag=false">
                    <transition-group>
                        <div class="selected-item flex" v-for="(item,index) in selectList" :key="index">
                        <div class="item-name">{{item.name}}</div>
                        <div>  
                            <i class="iconfont icon-danchuang-tuodongpaixu"></i>
                            </div>
                        </div>
                    </transition-group>
                    </draggable>
                </div>
            </div>
        </div>
       <div class="note-wrap">
            说明：一次最多可选6个指标
        </div>
        <div class="footer">
          <el-button type="primary" size="small" @click="sure">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  props:['userId'],
  data() {
    return {
      show: false,
      selectList:[],
      profit:[],// 利润类
      ratio:[], // 效率类
      sale:[],// 销售类
    };
  },
  computed:{
    total(){
      return this.profit.length*1 + this.ratio.length*1 + this.sale.length*1
    }
  },
  methods: {
    sure(){
      if(this.selectList.length <1){
        this.$message({type:'warning',message:'至少选择一个指标'})
        return 
      }
      let ids = this.selectList.map(item=>{
        return item.code
      })
       this.saveTarget(ids)
    },
    // 指标设置/保存
    saveTarget(ids){
      let params = {
        body:{
          userId:this.userId,
          indicatorCodes:ids
        } 
      };
      this.$camList.saleTargetSave(params).then(response =>{
        this.$parent.getTargetView()
        this.close() 
      })
    },  
    handleClose() {
     this.close()
    },
    close(){
      this.selectList = [];
      this.profit = [];
      this.ratio = [];
      this.sale = [];
      this.show = false;
    }
  }
};
</script>
<style scoped lang="scss">
.content {
    border:1px solid #e5e5e5;
    display: flex;
  .label {
    color: #666;
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;
    line-height: 48px;
  }
  .select {
    padding: 0 14px;
    width: 50%;
    border-right: 1px solid #e5e5e5;
    .item{
      font-size:12px;
    }
  }
  .selected {
    padding: 0 14px;
    width: 50%;
    .label{
      font-size:12px;
      .tip{
        font-size:12px;
        color:'#9b9b9b'
      }
    }
    .selected-item{
      cursor:pointer;
      padding:4px;
      cursor:pointer;
      &:hover{
          background:  #F5F5F5
      } 
      .item-name{
        font-size:12px;
      }
    }

  }
  .item-wrap {
    padding:6px 0 16px;
    height:400px;
    overflow:auto;
    .item-list {
        .item-name{
            color:#666;
            font-size:12px;
            margin-top:10px;
        }
        .item{
            padding-left:30px;
            padding-top:10px;
            span{
                font-size:12px;
            }
        }
       
    }
  }
}

</style>

