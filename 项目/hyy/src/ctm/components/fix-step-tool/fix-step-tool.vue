<template>
  <div class="fix-step-tool" :style="{right: right}">
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
		}
	},
	props: ['stepData'],
	name: "fixStepTool",
	mounted() {
		this.$nextTick(() => {
			document.querySelector('.content-wrapper').addEventListener("scroll", this.onScroll)
		})
  	},
  methods: {
    stepPos(index) {
      	// 获取需要滚动到的位置
		let total = this.stepList[index].scrollTop
		// 当前位置
		let distance = document.querySelector('.content-wrapper').scrollTop
		
		let topDistance =  document.querySelector('.el-container').offsetHeight - document.querySelector('.content-wrapper').offsetHeight - (this.getStyle(document.querySelector('.el-main'), 'paddingBottom').split('px')[0])
		total -= topDistance
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
				document.querySelector('.content-wrapper').scrollTop = distance
				setTimeout(smoothDown, 10)
			} else {
				document.querySelector('.content-wrapper').scrollTop = total
			}
		}
		function smoothUp() {
			if (distance > total) {
				distance -= step
				document.querySelector('.content-wrapper').scrollTop = distance
				setTimeout(smoothUp, 10)
			} else {
				document.querySelector('.content-wrapper').scrollTop = total
			}
      }
    },
    onScroll() {
		this.$eventHub.$emit("changeScroll")
    },
    getStyle(dom, attr){
      	return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr]
    }
  },
  computed: {
		right() {
			return document.body.offsetWidth > 1440 ? document.body.offsetWidth > 1540 ? '200px' : (200 - document.body.offsetWidth + 1440) + 'px' : '80px'
		}
	},
	destroyed() {
		document.querySelector('.content-wrapper').removeEventListener("scroll", this.onScroll)
	}
}
</script>

<style lang="scss">
.fix-step-tool {
	position: fixed;
	z-index: 99999;
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
			width: 4px;
			height: 4px;
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
			top: -3px;
			font-size: 16px;
		}
		.connect-line,
		.connect-line-first {
			position: absolute;
			width: 1px;
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