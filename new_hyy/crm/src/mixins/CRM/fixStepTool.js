export default {
  data () {
    return {
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: []
      }
    };
  },
  created () {
    this.$eventHub.$on('changeScroll', this.changeToolActive);
  },
  mounted () {
    this.$nextTick(() => {
      this.calcScrollTop(this.stepData.stepEl, this.stepData.stepList);
    });
  },
  updated () {
    let _this = this;
    window.setTimeout(() => {
      _this.calcScrollTop(this.stepData.stepEl, _this.stepData.stepList);
    }, 500);
  },
  methods: {
    calcScrollTop (el, arr) {
      let stepEles = document.querySelectorAll(el);
      let distance = document.querySelector('.content-wrapper').scrollTop;
      if (stepEles.length != 0) {
        arr.forEach((item, i) => {
          if (!stepEles[i]) {
            return;
          }
          item.scrollTop = stepEles[i].offsetTop;
          // 初始化 active 位置
          if (i > 0) {
            if (distance <= item.scrollTop && distance > arr[i - 1].scrollTop) {
              item.isactive = true;
            } else {
              item.isactive = false;
            }
          } else {
            if (distance <= item.scrollTop) {
              item.isactive = true;
            } else {
              item.isactive = false;
            }
          }
        });
      }
    },
    changeToolActive (arr = this.stepData.stepList) {
      let scrolled = document.querySelector('.content-wrapper').scrollTop;
      arr.forEach((step, i) => {
        if (i > 0) {
          if (scrolled <= step.scrollTop && scrolled > arr[i - 1].scrollTop) {
            step.isactive = true;
          } else {
            step.isactive = false;
          }
        } else {
          if (scrolled <= step.scrollTop) {
            step.isactive = true;
          } else {
            step.isactive = false;
          }
        }
      });
      if (arr.every(step => !step.isactive)) {
        arr[arr.length - 1].isactive = true;
      }
    }
  }
};
