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
  updated: function () {
    let _this = this;
    window.setTimeout(() => {
      _this.calcScrollTop(this.stepData.stepEl, _this.stepData.stepList);
    }, 500);
  },
  methods: {
    calcScrollTop (el, arr) {
      let stepEles = document.querySelectorAll(el);
      let distance =
        document.documentElement.scrollTop || document.body.scrollTop;
      arr.forEach((item, i) => {
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
    },
    changeToolActive (arr = this.stepData.stepList) {
      let scrolled =
        document.documentElement.scrollTop || document.body.scrollTop;
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
