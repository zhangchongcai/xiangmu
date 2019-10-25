<template>
  <div class="cinema-center">
    <div class="cinema-center-item" v-for="(item, index) of cinameCenterData" :key="index" @click="handleShowIframeClick(item)">{{item.cinemaName}}</div>
    <div @click="handleIframeClose" v-if="iframeState" class="close-icon">
      <i class="el-icon-close"></i>
    </div>
    <div v-if="iframeState" :style="iframeStyle" class="iframe-wrapper" v-loading="iframeLoading">
      <iframe class="rpt-iframe" id="rptIframe" :width="iframeWidth" :height="iframeHeight" frameborder="0" name="cinemaIframe" scrolling="auto" :src="iframeUrl"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cinameCenterData: Array
  },
  data () {
    return {
      iframeState: false,
      iframeStyle: {
        position: 'absolute',
        top: '105px',
        left: '160px',
        width: `${this.iframeWidth}px`,
        height: `${this.iframeHeight}px`,
        background: '#ffffff'
      },
      iframeWidth: 0,
      iframeHeight: 0,
      iframeName: '',
      iframeUrl: '',
      contentWrapper: '',
      iframeLoading: false
    };
  },
  methods: {
    handleShowIframeClick (data) {
      this.iframeState = true;
      this.iframeWidth = this.contentWrapper.offsetWidth - 50;
      this.iframeHeight = this.contentWrapper.offsetHeight - 30;
      this.iframeUrl = data.oldCinemaUrl;
    },
    handleIframeClose () {
      this.iframeState = false;
    }
  },
  mounted () {
    this.contentWrapper = document.getElementsByClassName('content-wrapper')[0];
    window.addEventListener(
      'resize',
      () => {
        let resizeTimeout;
        if (!resizeTimeout) {
          resizeTimeout = setTimeout(() => {
            resizeTimeout = null;
            this.iframeWidth = this.contentWrapper.offsetWidth - 60;
            this.iframeHeight = this.contentWrapper.offsetHeight - 35;
          }, 66);
        }
      },
      false
    );
  }
};
</script>

<style lang="scss" scoped>
.cinema-center {
  display: flex;
  justify-content: flex-start;
  .close-icon {
    position: absolute;
    top: 105px;
    right: 28px;
    z-index: 1000;
    i {
      font-size: 30px;
      color: #3b74ff;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .cinema-center-item {
    margin: 10px;
    padding: 5px 10px;
    max-width: 300px;
    height: 30px;
    line-height: 20px;
    text-align: center;
    border: 1px solid #bcbcbc;
    border-radius: 4px;
    box-sizing: border-box;
    &:hover {
      color: #3b74ff;
      border: 1px solid #3b74ff;
      cursor: pointer;
    }
  }
}
</style>


