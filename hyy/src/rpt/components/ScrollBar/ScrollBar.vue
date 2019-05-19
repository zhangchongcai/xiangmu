<template>
    <div class="scroll-wrap" ref="scrollWrap" >
        <div class="scroll-cont" ref="scrollCont" :style="{left: left + 'px'}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        message: String
    },
    data(){
        return {
            left: 0,
            wheelSpeed: 100,
            speed: ''
        }
    },
    updated() {
      this.speed = this.message
      this.scroll()
    },
    watch:{
      message(val) {
        this.speed = val
      }
    },
    methods: {
        scroll() {
          const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
          const scrollContWidth = this.$refs.scrollCont.offsetWidth
          if(scrollContWidth > scrollWrapWidth) {
            const scrollSpace = this.speed > 0 ? -1 * this.wheelSpeed : this.wheelSpeed
            if (this.speed > 0) {
              if (Math.abs(this.left + scrollSpace) <= (scrollContWidth - scrollWrapWidth + this.wheelSpeed)) {
                this.left += scrollSpace
              }
            } else {
              if (this.left + scrollSpace < 0) {
                this.left += scrollSpace
              } else {
                this.left = 0
              }
            }
          } else {
            return
          }
        },
        scrollToCurTag(tar) {
            const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
            const tarWidth = tar.offsetWidth
            const tarLeft = tar.offsetLeft
            if (tarLeft < -this.left) {
                // 激活的标签导航在左边
                this.left = -tarLeft
            } else if (tarLeft + tarWidth > scrollWrapWidth) {
                // 激活的标签导航在右边
                this.left = -(tarLeft + tarWidth - scrollWrapWidth)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.scroll-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
}
.scroll-cont{
    position: absolute;
    transition: all .3s ease;
}

</style>


