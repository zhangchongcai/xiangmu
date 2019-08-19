<template>
    <div class="scroll-wrap" ref="scrollWrap">
        <div class="scroll-cont" ref="scrollCont" :style="{left: left + 'px'}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            left: 0,
            wheelSpeed: 140,
            msg: '',
        }
    },
    mounted(){
        let self = this
        this.$eventHub.$on("scrollTab",(msg)=>{
            self.msg = msg
            if(msg){
                this.scroll()
            }
        })
    },
    methods: {
        scroll() {
          // debugger
          const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
          const scrollContWidth = this.$refs.scrollCont.offsetWidth
          if(scrollContWidth > scrollWrapWidth) {
            const scrollSpace = this.msg > 0 ? -1 * this.wheelSpeed : this.wheelSpeed
            if (this.msg> 0) {
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


