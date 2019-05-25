<template>
  <div>
    <draggable class="draggable-box clearfix" element="ul" v-model="goodList">
      <li name="list" tag="li" class="draggable-box-li left" v-for="(item) in value" :key="item.id">
        <div class="color" :style="{background:item.color}"></div>
        <div class="name-box">
          <div v-if="item.name">
            <p class="name">{{item.name}}</p>
            <p class="price">{{item.price}}</p>
          </div>
        </div>
        <div class="clearfix option">
          <span class="left" @click="handleSetColor(item)">设置颜色</span>
          <span class="right" @click="handleRemove(item)">移除</span>
        </div>
      </li>
    </draggable>
    <el-dialog title="请选择颜色" :visible.sync="colorDialogVisible" width="570px">
      <ul class="select-color clearfix">
        <li
          class="left"
          v-for="(item,index) in selectColorList"
          :key="index"
          :style="{background:item.color}"
          @click="handleSelectColor(item,index)"
        >
          <i class="el-icon-circle-check icon" v-if="item.selected"></i>
          <div v-if="item.text">{{item.text}}</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="colorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleColorConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import sortable from "sortablejs";
export default {
  props: {
    value: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      goodList: this.value,
      colorDialogVisible: false,
      selectColorList: [
        {
          color: "#CA8EFF"
          // selected: true
        },
        {
          color: "#003E3E"
        },
        {
          color: "#67C23A"
        },
        {
          color: "#67393E"
        },
        {
          color: "yellow"
        },
        {
          color: "blue"
        },
        {
          color: "red"
        },
        {
          color: "#ccc",
          text: "无"
        }
      ],
      currentSelectColor: {}
    };
  },
  methods: {
    //设置颜色
    handleSetColor(item) {
      this.colorDialogVisible = true;
      this.currentSelectColor.id = item.id;
    },
    //选择颜色
    handleSelectColor(row, index) {
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
    //移除常用商品
    handleRemove(row) {
      this.goodList = this.goodList.filter(item => {
        return item.id != row.id;
      });
      this.$emit("input", this.goodList);
    },
    // 确定选择颜色
    handleColorConfirm() {
      // console.log(this.currentSelectColor);
      this.goodList = this.goodList.map(item => {
        // debugger
        if (this.currentSelectColor.id == item.id) {
          item.color = this.currentSelectColor.color;
        }
        return item;
      });
      this.$emit("input", this.goodList);
      this.$emit("on", this.goodList);
      this.colorDialogVisible = false;
    }
  },
  watch: {
    goodList: function(newVal) {
      this.$emit("input", newVal);
    }
  },
  components: {
    draggable,
    sortable
  }
};
</script>
<style lang="scss">
@import "../../assets/css/common.scss";
@import "../../assets/css/element-common.scss";
.color {
  width: 40px;
  height: 20px;
  border-bottom-left-radius: 20px;
  position: absolute;
  right: 0;
  top: 0;
}
.draggable-box-li {
  position: relative;
  width: 120px;
  height: 100px;
  // line-height: 100px;
  cursor: move;
  border-radius: 5px;
  text-align: center;
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #909399;
  .name-box {
    height: 70px;
  }
  .name {
    padding-top: 20px;
    padding-bottom: 10px;
  }
  .option {
    margin-top: 30;
    display: none;
    cursor: pointer;
    span {
      padding: 8px;
    }
  }
}
.draggable-box-li:hover {
  .option {
    display: block;
  }
}
.select-color {
  li {
    cursor: pointer;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    margin-top: 10px;
    position: relative;
    line-height: 100px;
    text-align: center;
  }
  li:hover {
    // border: 1px dotted #000;
    transform: rotate(3);
  }
  .icon {
    font-size: 20px;
    color: #fff;
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
