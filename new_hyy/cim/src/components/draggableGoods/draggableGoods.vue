<template>
  <div>
    <draggable class="clearfix" element="ul" v-model="goodList">
      <li name="list" tag="li" class="draggable-box-li left" v-for="(item,index) in value" :key="item.skuUid || item.uid || item.categoryUid" :style="{ borderColor:item.color }">
        <i class="el-icon-close remove" @click="handleRemove(item,index)"></i>
        <div :class="{'name-box':true,'classify-good':type=='classifyGood'}" class="">
          <div v-if="item.merName || item.name">
            <p class="name">{{item.merName || item.name}} </p>
            <div class="clearfix">
              <span class="price left" v-if="showPrice(item.price,item.merPrice)">￥{{showPrice(item.price,item.merPrice)}}</span>
            </div>
          </div>
          <div class="right setting clearfix" @click="handleSetColor(item)"><span class="option left">设置颜色</span> <i class="color right" v-if="item.color" :style="{ backgroundColor:item.color }"></i></div>
        </div>
      </li>
    </draggable>
    <el-dialog title="请选择颜色" class="retail-style" :visible.sync="colorDialogVisible" width="590px" append-to-body>
      <ul class="select-color clearfix">
        <li class="left" v-for="(item,index) in selectColorList" :key="index" :style="{background:item.color}" @click="handleSelectColor(item,index)">
          <i class="el-icon-circle-check icon" v-if="item.selected"></i>
          <div v-if="item.text" class="text">{{item.text}}</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleColorConfirm">确 定</el-button>
        <el-button @click="colorDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import sortable from 'sortablejs';

export default {
  props: {
    value: {
      type: [Object, Array]
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Object, String]
    },
    type: {
      type: String,
      default: 'userGood'
    }
  },
  data () {
    return {
      goodList: this.value,
      colorDialogVisible: false,
      selectColorList: [
        {
          color: '#FF6E3C'
        },
        {
          color: '#15B3EA'
        },
        {
          color: '#FFD900'
        },
        {
          color: '#7ED321'
        },
        {
          color: '#FF8D12'
        },
        {
          color: '#EB28CA'
        },
        {
          color: '#8B4DFF'
        },
        {
          color: '#1BDA5C'
        },
        {
          color: '#FC5294'
        },
        {
          color: '#00DFEF'
        },
        {
          color: '',
          text: '无'
        }
      ],
      currentSelectColor: {}
    };
  },
  updated () {
    this.goodList = this.value;
    // console.log(this.goodList)
  },
  methods: {
    init () {
      // console.log(this.goodList)
    },
    // 设置颜色
    handleSetColor (item) {
      this.colorDialogVisible = true;
      this.currentSelectColor.colorUid = item.skuUid || item.categoryUid || item.uid;
    },
    // 选择颜色
    handleSelectColor (row, index) {
      this.currentSelectColor.color = row.color;
      this.selectColorList = this.selectColorList.map(item => {
        if (item.color == row.color) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      });
    },
    // 移除常用商品
    handleRemove (row, index) {
      this.goodList = this.goodList.filter((item, goodIndex) => {
        return index != goodIndex;
      });
      this.$emit('input', this.goodList);
    },
    // 确定选择颜色
    handleColorConfirm () {
      // console.log(this.currentSelectColor);
      this.goodList = this.goodList.map(item => {
        if (this.currentSelectColor.colorUid == (item.skuUid || item.categoryUid || item.uid)) {
          item.color = this.currentSelectColor.color;
        }
        return item;
      });
      this.$emit('input', this.goodList);
      this.$emit('on', this.goodList);
      this.colorDialogVisible = false;
    },
    showPrice (price, merPrice) {
      if (typeof merPrice === 'number') {
        merPrice = merPrice.toString();
      }
      if (typeof price === 'number') {
        price = price.toString();
      }
      let tempPrice = price || merPrice;
      return tempPrice;
    }

  },
  watch: {
    goodList: function (newVal) {
      this.$emit('input', newVal);
    }
  },
  components: {
    draggable,
    sortable
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/common.scss";
@import "../../assets/css/element-common.scss";
.draggable-box-li {
  position: relative;
  width: 168px;
  height: 70px;
  cursor: move;
  border-radius: 5px;
  margin-left: 16px;
  margin-top: 16px;
  border: 1px solid #bcbcbc;
  padding: 8px 10px;
  .name-box {
    /*height: 50px;*/
  }

  .name {
    /*padding: 20px 5px 10px;*/
    margin-bottom: 10px;
    padding-right: 8px;
    height: 30px;
    font-weight: 700;
    color: #666;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-left: 5px;
    margin-top: 3px;
  }

  .price {
    font-weight: 700;
  }

  .setting {
    position: absolute;
    right: 10px;
    bottom: 5px;
  }

  .remove {
    padding: 5px;
    position: absolute;
    right: 3px;
    top: 5px;
    cursor: pointer;
    color: #3b74ff;
    font-weight: 700;
    font-size: 14px;
    display: none;
  }
  .option {
    opacity: 0;
    cursor: pointer;
  }
}
.draggable-box-li:hover {
  .option {
    opacity: 1;
  }

  .remove {
    display: inline;
  }
}

.select-color {
  li {
    cursor: pointer;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    margin-left: 5px;
    margin-top: 10px;
    position: relative;
    line-height: 100px;
    text-align: center;
  }

  .text {
    font-size: 14px;
    font-weight: 700;
  }
  li:hover {
    // border: 1px dotted #000;
    /*transform: rotate(3);*/
  }

  .icon {
    font-size: 20px;
    color: #000;
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.classify-good {
  /*margin-top: 20px;*/
  /*height: 20px;*/
}
</style>
