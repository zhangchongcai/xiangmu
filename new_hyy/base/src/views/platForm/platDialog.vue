<template>
    <div>
        <el-dialog title="自定义工作台" :visible.sync="dialogVisible"
                   :before-close="handleClose"
                   :close-on-click-modal="false">
            <div class="content">
                <div class="select">
                    <div class="label">资源隐藏( {{selectList.length}} / {{total}})</div>
                    <div class="detail">
                        <!-- 销售类 -->
                        <div class="detail-item">
                            <!--<div class="type-name">
                                {{'销售类'}}
                            </div>-->
                            <el-checkbox-group v-model="selectList" class="type-item" :max="6" @change="changeSelect">
                                <el-checkbox :label="item" v-for="(item,index) in sale" :key="index"
                                             :checked="item.userBinding ==1?true:false">
                                    <span class="item">{{item.name}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 利润类 -->
                        <!--<div class="detail-item" >
                            <div class="type-name">
                                {{'利润类'}}
                            </div>
                            <el-checkbox-group v-model="selectList" class="type-item" :max="6" @change="changeSelect">
                                <el-checkbox :label="item" v-for="(item,index) in profit" :key="index" :checked="item.userBinding ==1?true:false">
                                    <span class="item">{{item.name}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        &lt;!&ndash; 效率类 &ndash;&gt;
                        <div class="detail-item" >
                            <div class="type-name">
                                {{'效率类'}}
                            </div>
                            <el-checkbox-group v-model="selectList" class="type-item" :max="6" @change="changeSelect">
                                <el-checkbox :label="item" v-for="(item,index) in ratio" :key="index" :checked="item.userBinding ==1?true:false">
                                    <span class="item">{{item.name}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>-->
                    </div>
                </div>
                <div class="selected">
                    <div class="label flex">
                        工作台({{selectList.length}} )
                        <div class="tip">拖拽可进行排序</div>
                    </div>
                    <div class="detail">
                        <draggable v-model="selectList" group="people" @start="drag=true" @end="drag=false">
                            <transition-group>
                                <div class="selected-item flex" v-for="(item,index) in selectList" :key="index">
                                    <div class="item-name">{{item.name}}</div>
                                    <div>
                                        <i class="iconfont icon-danchuang-tuodongpaixu"></i></div>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
            <div class="note-wrap text-red">
                说明：一次最多可配置6个工作台
            </div>
            <div class="button-wrap">
                <el-button type="primary" size="small" @click="sure">确定</el-button>
                <el-button size="small" @click="close">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: "platDialog",
    prop: ['dialogVisible'],
    data() {
      return {
        selectList:[],
        profit:[],// 利润类
        ratio:[], // 效率类
        sale:[],// 销售类
        total:''
      }
    },
    method: {
      sure() {
        if (this.selectList.length < 1) {
          this.$message({type: 'warning', message: '至少选择一个指标'})
          return
        }
        let ids = this.selectList.map(item => {
          return item.code
        })
        this.saveTarget(ids)
      },
      // 指标设置/保存
      saveTarget(ids) {
        let params = {
          body: {
            userId: this.userId,
            indicatorCodes: ids
          }
        };
        this.$camList.saleTargetSave(params).then(response => {
          this.$parent.getTargetView()
          this.close()
        })
      },
      handleClose() {
        // this.close()
      },
      close() {
        this.selectList = [];
        this.profit = [];
        this.ratio = [];
        this.sale = [];
        this.dialogVisible = false;
      },
      changeSelect(id) {
        // console.log(id)
      }
    }

  }
</script>

<style scoped>

</style>
