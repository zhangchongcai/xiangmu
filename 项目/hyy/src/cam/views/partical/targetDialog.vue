<template>
  <!-- 指标配置弹窗 -->
  <div class="reset-target-dialog">
    <el-dialog title="指标设置" :visible.sync="visible" width="50%" :before-close="handleClose">
      <div class="content">
        <div class="select">
          <div class="label">选项库(2/33)</div>
          <div class="detail">
            <div class="detail-item" v-for="(item,index) in selectArr" :key="index">
                <div class="type-name">
                  {{item.type}}
                </div>
                <el-checkbox-group v-model="selectList" class="type-item">
                    <el-checkbox :label="type" v-for="(type) in item.value" :key="type" >
                        {{type.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="selected">
          <div class="label">已选择</div>
          <div class="detail">
              <div v-for="(item,index) in selectList" :key="index">
                  {{item.name}}
              </div>
          </div>
        </div>
      </div>
        <div class="button-wrap">
            <div class="auto-cancle-button" @click= "visible = false">取消</div>
            <el-button type="primary" size="mini" @click="sure">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      selectList:[],
      selectArr: [
        {
          type: "销售类",
          value: [
            {
              id: 1,
              name: "销售额"
            },
            {
              id: 2,
              name: "销售单价"
            },
            {
              id: 3,
              name: "销售数量"
            },
            {
              id: 4,
              name: "客单价"
            },
            {
              id: 5,
              name: "件单价"
            },
            {
              id: 6,
              name: "客单量"
            }
          ]
        },
        {
          type: "利润类",
          value: [
            {
              id: 7,
              name: "销售额"
            },
            {
              id: 8,
              name: "销售单价"
            },
            {
              id: 9,
              name: "销售数量"
            },
            {
              id: 10,
              name: "客单价"
            },
            {
              id: 11,
              name: "件单价"
            },
            {
              id: 12,
              name: "客单量"
            }
          ]
        }
      ],
       selectedArr:[{
           id:1,
           name:'销售额'
       },{
           id:2,
           name:'销售单价'
       }]
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    sure(){
        console.log(this.selectList,'选择的list')
    }
  }
};
</script>
<style scoped lang="scss">

.auto-cancle-button{
    width:90px;
    line-height: 32px;
    height:32px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: inline-block;
    background: #fff;
    color:#606266;
    margin-right:30px;
    &:hover{
        color: #3B74FF;
        border-color:#c4d5ff;
        background-color:#ebf1ff
    }
}
.button-wrap{
    padding:12px;
    text-align:center;
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
  }
  .selected {
    padding: 0 14px;
    width: 50%;
  }
  .detail {
    padding:16px 0;
    .detail-item {
        .type-name{
            color:#666;
        }
        .type-item{
            padding-left:30px;
        }
    }
  }
}
</style>

