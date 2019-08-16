<template>
  <!-- 指标配置弹窗 -->
  <div class="reset-target-dialog">
    <el-dialog title="指标设置" :visible.sync="show" width="448px"
    :close-on-click-modal="false">
      <div class="content">
        <div class="select">
          <div class="label">选项库( {{selectList.length}} / {{total}})</div>
          <div class="detail">
            <div class="detail-item" 
                v-for="(item,index1) in targetList" 
                :key="index1">
                <div class="type-name">
                  {{item.name}}
                </div>
                <el-checkbox-group v-model="selectList" class="type-item" :max="6">
                    <el-checkbox  class="item-wrap" 
                        v-for="(target) in item.list" 
                        :key="target.name" 
                        :label="target"
                        :disabled="target.gray == 1? true:false">
                        <span class="item">{{target.name}}</span>
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
          <div class="detail">
             <draggable v-model="selectList" group="people" @start="drag=true" @end="drag=false">
               <!-- <transition-group> -->
                 <div class="selected-item flex" 
                    v-for="(item,index) in selectList" 
                    :key="index">
                   <div class="item-name">{{item.name}}</div>
                   <div>  
                     <i class="iconfont icon-danchuang-tuodongpaixu"></i></div>
                  </div>
               <!-- </transition-group> -->
            </draggable>
          </div>
        </div>
      </div>
      <div class="note-wrap text-red">
        说明：一次最多可选6个指标
      </div>
      <div class="footer">
          <el-button type="primary"  @click="sure">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  props:['userId','targetList'],
  data() {
    return {
      show: false,
      selectList:[],// 选中的列表
    };
  },
  computed:{
    total(){
        let count = 0;
        this.targetList.forEach(item=>{
           count += item.list.length;
        })
      return count;
    }
  },
  watch:{
    targetList(){
        let arr = [];
        this.targetList.forEach(item =>{
            item.list.forEach(list_item =>{
                if(list_item.gray == 0 && list_item.userBinding == 1){
                    arr.push(list_item)
                }else if(!list_item.gray && list_item.userBinding == 1) {
                    arr.push(list_item)
                }
            })
        });
        this.selectList = arr;
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
      this.$emit('saveTarget',ids)
    },
    close(){
      this.selectList = [];
      this.show = false;
    }
  }
};
</script>
<style scoped lang="scss">
.content {
  background: #ffffff;
  border:1px solid #e5e5e5;
  border-radius: 2px 0px 0px 2px;
  display: flex;
  .label {
    color: #666;
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;
    line-height: 48px;
    height:48px;
    box-sizing:border-box;
  }
  .select {
    padding: 0 14px;
    width: 50%;
    border-right: 1px solid #e5e5e5;
    
  }
  .selected {
    padding: 0 14px;
    width: 50%;
    color:#666;
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
  .detail {
    box-sizing: border-box;
    padding:6px 0 16px;
    height:380px;
    overflow:auto;
    .detail-item {
        margin-top:10px;
        &:nth-of-type(1){
            margin-top:0;
        }
        .type-name{
            color:#666;
            font-size:12px;
        }
        .type-item{
            padding-left:30px;
        }
        .item-wrap{
            padding-top:8px;
        }
        .item{
            font-size:12px;
            color:#666;
         }
    }
  }
}
</style>

