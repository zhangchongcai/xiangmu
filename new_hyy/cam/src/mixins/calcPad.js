import throttle from 'lodash/throttle';
export default {
  mounted () {
    this.calcPad();
    window.onresize = throttle(() => {
      this.calcPad();
    }, 300);
  },
  methods: {
    calcPad () {
      let target = this.$refs['targetRef'];
      let headerFixed = this.$refs['headerFixed'];
      if (target && headerFixed) {
        let newHeaderH = headerFixed.clientHeight;
        if (newHeaderH > 150) {
          target.style.paddingTop = 30 + newHeaderH - 149 + 'px';
        } else {
          target.style.paddingTop = 30 + 'px';
        }
      }
    }
  }
};
