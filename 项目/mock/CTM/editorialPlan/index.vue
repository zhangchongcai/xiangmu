<template>
  <section class="plan-window">
    <div class="select-menu"></div>
    <div class="scorll-window">
        <div class="drage-window" @mousedown="drawShadow">
      <div
        class="drage-item"
        v-for="item in items"
        v-bind:key="item"
        v-bind:data-item="item.item"
        v-bind:class="{'select-item': item.isSelect}"
        @mousedown="move"
      >{{item.item}}</div>
      <div
        class="shadow"
        v-bind:style="{left: shadow.positionX +'px', top:shadow.positionY+'px',width:shadow.width+'px',height:shadow.height+'px'}"
      ></div>
    </div>
    </div>
    
  </section>
</template>

<script  type="text/javascript">
export default {
  data() {
    return {
      items: [
        {
          item: "item1",
          isSelect: false
        },
        {
          item: "item2",
          isSelect: false
        },
        {
          item: "item3",
          isSelect: false
        }
      ],
      positionX: 0,
      positionY: 0,
      isPressCtrl: false,
      isSelectMore: false,
      selectElements: [],
      shadow: {
        width: 0,
        height: 0,
        positionX: 0,
        positionY: 0
      }
    };
  },
  methods: {
    move: function(e) {
      let ctrlKey = e.ctrlKey || e.metaKey;
      let item = e.target.dataset.item;
      let items = this.items;
      if (!ctrlKey) {
        e.stopPropagation();
        if (!this.isSelectMore) {
          for (let i = 0; i < items.length; i++) {
            if (item != items[i].item) {
              this.items[i].isSelect = false;
            } else {
              this.items[i].isSelect = true;
            }
          }
        }
      } else {
        let isSelectMore = false;
        let selectNum = 0;
        for (let i = 0; i < items.length; i++) {
          if (item == items[i].item) {
            this.items[i].isSelect = !this.items[i].isSelect;
          }
          if (items[i].isSelect) {
            selectNum++;
          }
          if (selectNum >= 2 && i == items.length - 1) {
            isSelectMore = true;
          }
        }
        this.isSelectMore = isSelectMore;
      }
      let element = e.target;
      // 元素宽高
      let e_width = element.offsetWidth;
      let e_height = element.offsetHeight;

      // 鼠标距离元素左顶部的距离
      let disX = e.clientX - element.offsetLeft;
      let disY = e.clientY - element.offsetTop;
      // 鼠标移动的上下距离是元素移动的上下距离
      document.onmousemove = function(e) {
        // 当前元素所在位置 减去相对位置
        let newLeft = e.clientX - disX;
        let newTop = e.clientY - disY;

        // 边框
        let parentElement = element.parentElement;
        let p_offsetLeft = parentElement.offsetLeft;
        let p_offsetTop = parentElement.offsetTop;
        let p_width = parentElement.clientWidth;
        let p_height = parentElement.clientHeight;

        // 边框位置
        let left_line = p_offsetLeft;
        let right_line = p_offsetLeft + p_width;
        let top_line = p_offsetTop;
        let bottom_line = p_offsetTop + p_height;
        let ele_left, ele_top;
        // 左右边框检测
        if (
          newLeft + p_offsetLeft <= left_line ||
          newLeft + e_width + p_offsetLeft >= right_line
        ) {
          if (newLeft <= left_line) {
            ele_left = left_line - p_offsetLeft;
          } else {
            ele_left = right_line - e_width - p_offsetLeft;
          }
        } else {
          ele_left = newLeft;
        }

        // 上下边距检测
        if (
          newTop + p_offsetTop <= top_line ||
          newTop + e_height + p_offsetTop >= bottom_line
        ) {
          if (newTop <= top_line) {
            ele_top = top_line - p_offsetTop;
          } else {
            ele_top = bottom_line - e_height - p_offsetTop;
          }
        } else {
          ele_top = newTop;
        }
        // 修改元素位置
        element.style.left = ele_left + "px";
        element.style.top = ele_top + "px";
      };
    },
    // 绘制阴影
    drawShadow: function(e) {
      // let ctrlKey = e.ctrlKey || e.metaKey;
      e.stopPropagation();
      let that = this;
      let e_offsetLeft = e.target.offsetLeft;
      let e_offsetTop = e.target.offsetTop;
      let e_right = e_offsetLeft + e.target.clientWidth;
      let e_bottom = e_offsetTop + e.target.clientHeight;
       // 鼠标起始位置
      let parentElement = e.target.parentElement;
      console.log(window)
      let disX = e.clientX  + parentElement.scrollLeft + window.scrollX;
      let disY = e.clientY + parentElement.scrollTop + window.scrollY;
      let originX;
      let originY;
      document.onmousemove = function(e) {
        let cDisX = e.clientX  + parentElement.scrollLeft + window.scrollX;
        let cDisY = e.clientY + parentElement.scrollTop + window.scrollY;
        let width = cDisX - disX;
        let height = cDisY - disY;
        // 鼠标移动的位置
        // 确定矩形位置
        if (width >= 0) {
            
          // x 正方向
          if (height >= 0) {
            // y 负方向
            originX = disX;
            originY = disY;
            if(originY  + Math.abs(height) >= e_bottom) {
                height = e_bottom -  originY;
            }
          } else {
            // y 正方向
            originX = disX;
            originY = cDisY;
            if (originY <= e_offsetTop) {
              height = disY - e_offsetTop;
              originY = e_offsetTop;
            }
          }
          if (originX + Math.abs(width)  >= e_right ) {
                width = e_right - originX;
          }
        } else {
          // x 负方向
          if (height >= 0) {
            // y 负方向
            originX = cDisX;
            originY = disY;
            if(originY + Math.abs(height) >= e_bottom) {
                height = e_bottom - originY;
            }
          } else {
            // y 正方向
            originX = cDisX;
            originY = cDisY;
            if(originY <= e_offsetTop) {
                height = disY - e_offsetTop;
                originY = e_offsetTop;
            }
          }
          if(originX <= e_offsetLeft) {
              width = disX - e_offsetLeft;
              originX = e_offsetLeft;
          }
        }

        that.shadow.positionX = originX - e_offsetLeft;
        that.shadow.positionY = originY - e_offsetTop;
        // 宽高
        that.shadow.width = Math.abs(width);
        that.shadow.height = Math.abs(height);
      };
    }
  },
  mounted: function(event) {
    let that = this;
    document.onkeydown = function(e) {
      let keyCode = e.keyCode || e.which || e.charCode;
      let ctrlKey = e.ctrlKey || e.metaKey;
      // A键
      if (ctrlKey && keyCode == 65) {
        let items = that.items;
        for (let i = 0; i < items.length; i++) {
          that.items[i].isSelect = true;
        }
      }
    };
    // 移除绘制阴影
    document.onmouseup = function(e) {
      document.onmousemove = null;
      that.shadow.positionX = 0;
      that.shadow.positionY = 0;
      that.shadow.width = 0;
      that.shadow.height = 0;
    };
  }
};
</script>

<style lang="scss">
.plan-window {
  width: 100%;
  height: 100%;
  user-select: none;
}
.drage-window {
  width: 1000px;
  height: 500px;
position: relative;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
 margin-left: 100px;
 margin-top: 100px;
  background: grey;
}
.drage-item {
  background: red;
  width: 200px;
  height: 96px;
  position: absolute;
  border: 2px solid red;
}
.select-item {
  border: 2px solid black;
}
.shadow {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
}
.scorll-window {
    width: 500px;
    height: 500px;
    overflow: scroll;
    margin: auto;
}
</style>
