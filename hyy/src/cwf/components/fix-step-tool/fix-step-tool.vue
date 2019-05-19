<template>
  <div class="fix-step-tool">
    <ul>
      <li
        v-for="(step, index) in stepList"
        :key="index"
        class="single-step"
        :class="{'isactive': step.isactive}"
        @click="stepPos(index)"
      >
        <i class="fix-step-icon"></i>
        <i class="iconfont icon-neiye-yemianquyuxuanze"></i>
        <span>{{step.name}}</span>
        <span class="connect-line"></span>
        <span
          class="connect-line-first"
          v-if="!index"
        ></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepList: this.stepData
    };
	},
	props: ['stepData'],
  name: "fixStepTool",
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("scroll", this.onScroll)
    })
  },
  methods: {
    stepPos(index) {
      // 获取需要滚动到的位置
			let total = this.stepList[index].scrollTop
			// 当前位置
			let distance = document.documentElement.scrollTop || document.body.scrollTop
			// 平滑滚动，时长300ms，每10ms一跳，共30跳
			// console.log(total, distance)
      // let count = Math.floor((total - distance) / 500) * 10
      let count = 25
      let step = (total - distance) / count
      if (total > distance) {
        smoothDown()
      } else {
        let newTotal = distance - total
        step = newTotal / count
        smoothUp()
      }
      function smoothDown() {
        if (distance < total) {
          distance += step
          document.body.scrollTop = distance
          document.documentElement.scrollTop = distance
          setTimeout(smoothDown, 10)
        } else {
          document.body.scrollTop = total
          document.documentElement.scrollTop = total
        }
      }
      function smoothUp() {
        if (distance > total) {
          distance -= step
          document.body.scrollTop = distance
          document.documentElement.scrollTop = distance
          setTimeout(smoothUp, 10);
        } else {
          document.body.scrollTop = total
          document.documentElement.scrollTop = total
        }
      }
    },
    onScroll() {
			this.$eventHub.$emit("changeScroll")
    }
  }
};
</script>

<style lang="scss">
.fix-step-tool {
  position: fixed;
  z-index: 99999;
  right: 200px;
  top: 25%;
  .single-step {
    height: 16px;
    line-height: 16px;
    margin-bottom: 46px;
    position: relative;
    color: #666;
    font-size: 12px;
    cursor: pointer;
    .fix-step-icon {
      width: 5px;
      height: 5px;
      display: inline-block;
      border-radius: 50%;
      background-color: rgb(188, 188, 188);
      margin-right: 18px;
      position: relative;
      top: -2px;
    }
    .icon-neiye-yemianquyuxuanze {
      display: none;
      color: #3b74ff;
      position: relative;
      left: -5px;
      font-size: 16px;
    }
    .connect-line,
    .connect-line-first {
      position: absolute;
      width: 2px;
      height: 46px;
      left: 2px;
      bottom: -45px;
      border-radius: 20%;
      background-color: rgb(188, 188, 188);
    }
    .connect-line-first {
      bottom: 16px;
    }
  }
  .single-step.isactive {
    color: #3b74ff;
    height: 24px;
    line-height: 24px;
    .connect-line-first {
      bottom: 24px;
    }
    .fix-step-icon {
      display: none;
    }
    .icon-neiye-yemianquyuxuanze {
      display: inline-block;
      margin-right: 8px;
    }
  }
}
</style>