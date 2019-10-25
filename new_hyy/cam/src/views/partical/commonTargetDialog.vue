<template>
  <!-- 指标配置弹窗 -->
  <div class="reset-target-dialog">
    <el-dialog title="指标设置" :visible.sync="show" :before-close="handleClose" :close-on-click-modal="false">
      <div class="content">
        <div class="select">
          <div class="label">选项库( {{selectList.length}} / {{total}})</div>
          <div class="detail">
            <!-- 销售类 -->
            <div class="detail-item">
              <div class="type-name">
                {{'销售类'}}
              </div>
              <el-checkbox-group v-model="selectList" class="type-item" :max="6" @change="changeSelect">
                <el-checkbox :label="item" v-for="(item,index) in sale" :key="index" :checked="item.userBinding ==1?true:false">
                  <span class="item">{{item.name}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <!-- 利润类 -->
            <div class="detail-item">
              <div class="type-name">
                {{'利润类'}}
              </div>
              <el-checkbox-group v-model="selectList" class="type-item" :max="6" @change="changeSelect">
                <el-checkbox :label="item" v-for="(item,index) in profit" :key="index" :checked="item.userBinding ==1?true:false">
                  <span class="item">{{item.name}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <!-- 效率类 -->
            <div class="detail-item">
              <div class="type-name">
                {{'效率类'}}
              </div>
              <el-checkbox-group v-model="selectList" class="type-item" :max="6" @change="changeSelect">
                <el-checkbox :label="item" v-for="(item,index) in ratio" :key="index" :checked="item.userBinding ==1?true:false">
                  <span class="item">{{item.name}}</span>
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
        说明：一次最多可选6个指标
      </div>
      <div class="button-wrap">
        <el-button type="primary" size="small" @click="sure">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  props: ['userId'],
  data () {
    return {
      show: false,
      selectList: [],
      profit: [], // 利润类
      ratio: [], // 效率类
      sale: [] // 销售类
    };
  },
  computed: {
    total () {
      return this.profit.length * 1 + this.ratio.length * 1 + this.sale.length * 1;
    }
  },
  methods: {
    sure () {
      if (this.selectList.length < 1) {
        this.$message({ type: 'warning', message: '至少选择一个指标' });
        return;
      }
      let ids = this.selectList.map(item => {
        return item.code;
      });
      this.saveTarget(ids);
    },
    // 指标设置/保存
    saveTarget (ids) {
      let params = {
        body: {
          userId: this.userId,
          indicatorCodes: ids
        }
      };
      this.$camList.saleTargetSave(params).then(response => {
        this.$parent.getTargetView();
        this.close();
      });
    },
    handleClose () {
      this.close();
    },
    close () {
      this.selectList = [];
      this.profit = [];
      this.ratio = [];
      this.sale = [];
      this.show = false;
    },
    changeSelect (id) {
      // console.log(id)
    }
  }
};
</script>
<style scoped lang="scss">
.auto-cancle-button {
  width: 90px;
  line-height: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: inline-block;
  background: #fff;
  color: #606266;
  margin-right: 30px;
  &:hover {
    color: #3b74ff;
    border-color: #c4d5ff;
    background-color: #ebf1ff;
  }
}
.button-wrap {
  padding: 12px;
  text-align: center;
}
.content {
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.25);
  border-radius: 4px;
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
    .item {
      font-size: 12px;
    }
  }
  .selected {
    padding: 0 14px;
    width: 50%;
    .label {
      font-size: 12px;
      .tip {
        font-size: 12px;
        color: "#9b9b9b";
      }
    }
    .selected-item {
      cursor: pointer;
      padding: 4px;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
      .item-name {
        font-size: 12px;
      }
    }
  }
  .detail {
    padding: 16px 0;
    .detail-item {
      .type-name {
        color: #666;
      }
      .type-item {
        padding-left: 30px;
      }
    }
  }
}
.note-wrap {
  line-height: 40px;
  font-size: 12px;
}
</style>

