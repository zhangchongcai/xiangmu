<template>
    <div :id="modelName" :class="[modelName]">
        <div class="nc-container"></div>
        <!-- <no-captcha-js src="http://g.alicdn.com/sd/ncpc/nc.js?t=2015052012" type="text/javascript" charset="utf-8" /> -->
    </div>

</template>

<script>

  export default {
    name: "noCaptcha",
    data() {
      return {
        'appKey': '"FFFF0N0000000000817D',
        'modelName': 'no-captcha',
        'nc_token': null,
        'lang': 'cn',
        'NC_Opt': null
      }
    },
    mounted() {
      this.init()
      this.$eventHub.$on('sliderInit', (val) => {
        if (val) {
          console.log(val)
          this.generarte()
        }
      })
    },
    beforeDestroy() {
      this.$eventHub.$off('sliderInit')
    },
    methods: {
      init() {
        var self = this;
        this.nc_token = ["FFFF0N0000000000817D", (new Date()).getTime(), Math.random()].join(':');
        this.NC_Opt = {
          renderTo: "#no-captcha",
          appkey: "FFFF0N0000000000817D",
          scene: "nc_login",
          token: this.nc_token,
          customWidth: 280,
          trans: {"key1": "code0"},
          // elementID: ["usernameID"],
          is_Opt: 0,
          language: this.lang,
          isEnabled: true,
          timeout: 3000,
          times: 5,
          apimap: {},
          callback: function (data) {
            console.log(data)
            if (data.value == 'pass') {
              self.$emit('sliderData', {
                sessionId: data.csessionid,
                sig: data.sig,
                token: self.nc_token,
              })
            }
            /*window.console && console.log(self.nc_token)
            window.console && console.log(data.csessionid)
            window.console && console.log(data.sig)*/
            //将这三个参数在这里回调服务器的接口，进行服务器的验证

          }
        }
        this.seriesLoadScripts(["//g.alicdn.com/sd/ncpc/nc.js?t=2015052012"], function () {
          /*
          debug = new $.debug({
              posTo : { x:'right', y:'bottom' },
              width: '480px',
              height: '50%',
              itemDivider : '<hr>',
              listDOM : 'all'
          });

          */
          self.generarte();
        });

      },

      generarte() {
        var nc = new noCaptcha(this.NC_Opt)
        console.log(nc)
        nc.upLang('cn', {
          _startTEXT: "请按住滑块，拖动到最右边",
          _yesTEXT: "验证通过",
          _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
          _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
        });
      },
      /**
       * 串联加载指定的脚本
       * 串联加载[异步]逐个加载，每个加载完成后加载下一个
       * 全部加载完成后执行回调
       * @param array|string 指定的脚本们
       * @param function 成功后回调的函数
       * @return array 所有生成的脚本元素对象数组
       */

      seriesLoadScripts(scripts, callback) {
        if (typeof (scripts) != "object") var scripts = [scripts];
        var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
        var s = new Array(), last = scripts.length - 1, recursiveLoad = function (i) { //递归
          s[i] = document.createElement("script");
          s[i].setAttribute("type", "text/javascript");
          s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
            if (!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
              this.onload = this.onreadystatechange = null;
              this.parentNode.removeChild(this);
              if (i != last) recursiveLoad(i + 1); else if (typeof (callback) == "function") callback();
            }
          }
          s[i].setAttribute("src", scripts[i]);
          HEAD.appendChild(s[i]);
        };
        recursiveLoad(0);
      },

      /**
       * 并联加载指定的脚本
       * 并联加载[同步]同时加载，不管上个是否加载完成，直接加载全部
       * 全部加载完成后执行回调
       * @param array|string 指定的脚本们
       * @param function 成功后回调的函数
       * @return array 所有生成的脚本元素对象数组
       */

      parallelLoadScripts(scripts, callback) {
        if (typeof (scripts) != "object") var scripts = [scripts];
        var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement, s = new Array(),
          loaded = 0;
        for (var i = 0; i < scripts.length; i++) {
          s[i] = document.createElement("script");
          s[i].setAttribute("type", "text/javascript");
          s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
            if (!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
              loaded++;
              this.onload = this.onreadystatechange = null;
              this.parentNode.removeChild(this);
              if (loaded == scripts.length && typeof (callback) == "function") callback();
            }
          };
          s[i].setAttribute("src", scripts[i]);
          HEAD.appendChild(s[i]);
        }
      }
    }
  }
</script>

<style>
    .nc-container #nc_1_wrapper, .nc-container.tb-login #nc_1_wrapper {
        width: 280px !important;
    }

    .nc-container .nc_scale span {
        height: 34px !important;
    }
</style>
