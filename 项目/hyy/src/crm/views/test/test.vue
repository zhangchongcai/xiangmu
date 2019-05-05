<template>
  <div class="canvas-warp">
    <img
      class="login-canvas-bg"
      src="../../assets/image/login-canvas-bg.png"
      alt=""
    >
    <canvas id="login-canvas"></canvas>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      moveModelData: [
        {
          area: {
            width: 2,
            height: 2
          },
          location: {
            x: 0,
            y: 0
          }
        }
      ]
    };
  },
  components: {
    // editor
  },
  mounted() {
    this.initcanvas();
  },
  methods: {
    //初始化canvas
    initcanvas() {
        setInterval(res =>{
            this.getRandomModelOne()
        },500)
    },
    //随机透明度
    randomOpcity() {},
    //随机宽高
    randomArea() {
      var randomArea = {
        width: 0,
        height: 0
      };
      let randomNum = parseInt(Math.random() * 5);
      randomArea.width = randomNum ? randomNum : 1;
      randomArea.height = randomNum ? randomNum : 1;
      return randomArea;
    },
    //随机原型中心点位置函数
    randomLocation(randomArea){
      let maxX = 288;
      let x = parseInt(
        Math.random() * (288 - 2 * randomArea.width) + randomArea.width
      );
      let location = { x: x, y: 0 };
      return location;
    },
    //获取更新随机点对象
    getRandomModelOne() {
      var randomArea = this.randomArea();
      var location = this.randomLocation(randomArea);
      var moveModelOne = {
          area:randomArea,
          location:location
      };
      this.moveModelData.push(moveModelOne)
    },
    //绘制随机点canvas
    randerCanvas() {},
    //canvas顶部虚化触碰
    canvasTopOpcity() {},
    //canvas顶部消失数据删除
    canvasTopRemove() {}
  }
};
</script>
<style lang="scss" scoped>
.canvas-warp {
  width: 156px;
  height: 288px;
  position: relative;
  .login-canvas-bg {
    display: block;
    width: 156px;
    height: 288px;
    position: absolute;
    left: 0;
    top: 0;
  }
  #login-canvas {
    display: block;
    width: 156px;
    height: 288px;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>