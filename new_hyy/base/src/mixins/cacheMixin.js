export default {
  cacheMixin: {
    data () {
      return {
        cacheField: [],
        subComName: null,
        c_is_close_tab: false,
        c_last_route_fullPath: '',
        c_is_cache_fullPath: false
      };
    },
    mounted () {
      this.c_last_route_fullPath = this.$route.fullPath;
    },
    created () {
      this.$eventHub.$on('closeTab', val => {
        // console.log("closeTab");
        // console.log(val);
        // console.log(this.$route.fullPath);
        if (val.path === this.$route.fullPath) {
          this.c_is_close_tab = true;
          let key = val.path;
          if (!this.c_is_cache_fullPath) {
            let arr = key.split('?');
            if (arr.length === 2) {
              key = arr[0];
            }
          }
          if (this.subComName) {
            key = key + '__' + this.subComName;
          }
          this.$store.commit('removeCache', {
            key: key
          });
        }
      });
      let key = this.$route.fullPath;
      if (!this.c_is_cache_fullPath) {
        let arr = key.split('?');
        if (arr.length === 2) {
          key = arr[0];
        }
      }
      if (this.subComName) {
        key = key + '__' + this.subComName;
      }
      let cache = this.$store.state.commonData.cache;
      // console.log(this.$store);
      let cacheObj = cache[key];
      if (cacheObj && cacheObj.tab_cache_clear === true) {
        this.$store.commit('removeCache', {
          key: key
        });
      } else {
        if (cacheObj) {
          this.cacheField.forEach(ele => {
            // value[ele] = this[ele]
            let obj = cacheObj[ele];
            if (obj) {
              this[ele] = obj;
            }
          });
        }
      }
    },
    // beforeRouteUpdate(to, from, next) {
    //   // console.log("beforeRouteUpdate");
    //   if (this.c_is_close_tab == false) {
    //     let oldKey = from.fullPath;
    //     if (!this.c_is_cache_fullPath) {
    //       let arr = oldKey.split("?")
    //       if (arr.length == 2) {
    //         oldKey = arr[0]
    //       }
    //     }
    //     // console.log(this.$router);
    //     let value = {}
    //     this.cacheField.forEach(ele => {
    //       value[ele] = this[ele]
    //     });
    //     this.$store.commit('setCache', {
    //       key: oldKey,
    //       value: value
    //     })
    //   }
    //   let key = to.fullPath;
    //   // console.log(this.$store);
    //   let cache = this.$store.state.commonData.cache;
    //   // console.log(cache);
    //   let cacheObj = cache[key];
    //   if (cacheObj) {
    //     this.cacheField.forEach(ele => {
    //       // value[ele] = this[ele]
    //       let obj = cacheObj[ele]
    //       if (obj) {
    //         this[ele] = obj;
    //       }
    //     });
    //   } else {
    //     if (this.getDetail) {
    //       this.getDetail(this.$route.query.id);
    //     }
    //   }
    //   next();
    // },
    beforeDestroy () {
      // console.log("beforeDestroy");
      // console.log(this.c_last_route_fullPath);
      if (this.c_is_close_tab === false) {
        let key = this.c_last_route_fullPath;
        if (!this.c_is_cache_fullPath) {
          let arr = key.split('?');
          if (arr.length === 2) {
            key = arr[0];
          }
        }
        if (this.subComName) {
          key = key + '__' + this.subComName;
        }
        // console.log(this.$router);
        let cache = this.$store.state.commonData.cache;
        // console.log(cache);
        let cacheObj = cache[key];
        if (cacheObj && cacheObj.tab_cache_clear === true) {
          // console.log("清除缓存");
          this.$store.commit('removeCache', {
            key: key
          });
        } else {
          let value = {};
          if (this.cacheField && this.cacheField.length > 0) {
            this.cacheField.forEach(ele => {
              value[ele] = this[ele];
            });
            this.$store.commit('setCache', {
              key: key,
              value: value
            });
          }
        }
        // let cache = this.$store.state.commonData.cache;
        // console.log(cache);
      } else {
        // console.log("删除标签");
      }
      this.c_is_close_tab = false;
      this.$eventHub.$off('closeTab');
    },
    methods: {
      // 手动移除缓存
      removeCache () {
        this.c_is_close_tab = true;
        let key = this.c_last_route_fullPath;
        if (!this.c_is_cache_fullPath) {
          let arr = key.split('?');
          if (arr.length === 2) {
            key = arr[0];
          }
        }
        if (this.subComName) {
          key = key + '__' + this.subComName;
        }

        this.$store.commit('setTabCacheClear', {
          key: key
        });
      }
    }
  }
};
