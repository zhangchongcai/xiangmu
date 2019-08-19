<template>
    <div class="tag-nav">
        <scroll-bar ref="scrollBar">
            <router-link
                    @click.native="toBreadCrumb(item)"
                    ref="tag"
                    class="tag-nav-item"
                    :class="isActive(item) ? 'cur' : ''"
                    v-for="(item, index) in tagNavList"
                    :to="{path: item.path, query: item.query,params: item.params}"
                    :key="index">
                <el-tooltip class="item" effect="light" :content="item.title" placement="bottom-start">
                    <b>{{item.title}}</b>
                </el-tooltip>
                <span class="iSpan">
                     <i class="el-icon-close" @click.prevent.stop="closeTheTag(item, index)"></i>
                 </span>
            </router-link>
        </scroll-bar>
    </div>
</template>

<script>
  import utils from '../../util/uiUtils';
  import ScrollBar from '../ScrollBar/ScrollBar'
  export default {
    data() {
      return {
        objFlag: false,
        obj: {}
      };
    },
    computed: {
      tagNavList() {
        return this.$store.state.tagNav.openedPageList
      }
    },
    mounted() {
      this.$eventHub.$on('tabObj', (val) => {
        if (val) {
          this.obj = val
          this.objFlag = true
        }
      })
      // 首次加载时将默认页面加入缓存
      this.addTagNav()
    },
    beforeDestroy() {
      this.$eventHub.$off("tabObj")
    },
    watch: {
      $route() {
        this.addTagNav()
        this.scrollToCurTag()
      },
    },
    methods: {
      toBreadCrumb(val) {
        if (JSON.stringify(val.obj) == "{}") {
          this.$store.commit('getLevel', '')
        } else {
          this.$store.commit('getLevel', val.obj)
        }
      },
      addTagNav() {
        if (this.$route.meta.hidden) {
          return
        }
        // 如果需要缓存则必须使用组件自身的name(this.$router.getMatchedComponents()[1].name)，而不是router的name
        this.$store.commit("tagNav/addTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query,
          obj: this.objFlag ? this.obj : {}
        })
        this.objFlag = false
      },
      isActive(item) {
        return item.path === this.$route.path
      },
      closeTheTag(item, index) {
        // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
        // 如果没有前一个Tag，则加载默认页面
        this.$store.commit("tagNav/removeTagNav", item)
        //清除页面缓存
        this.$store.commit('removeTabCache', item)
        this.$store.commit('setPageArr', [item, true])
        if (this.$route.path == item.path) {
          let path = localStorage.getItem('defaultPath')
          if (index) {
            this.$router.push({
              path: this.tagNavList[index - 1].path,
              query: this.tagNavList[index - 1].query,
              params: this.tagNavList[index - 1].params
            })
          } else {
            this.$router.push(path)
            if (this.$route.path == path) {
              this.addTagNav()
            }
          }
        }
      },
      scrollToCurTag() {
        let level3Arr = JSON.parse(localStorage.getItem('level3Arr'))
        this.$nextTick(() => {
          if (this.$refs.tag) {
            for (let item of this.$refs.tag) {
              if (item.to.path === this.$route.path) {
                this.$refs.scrollBar.scrollToCurTag(item.$el)
                break
              }
            }
          }
          let str = this.tagNavList.find(i => i.path === this.$route.path)
          if (str && level3Arr) {
            let br = level3Arr.find(v => v.menuCode === str.obj.menuCode)
            if (str && br) {
              this.$store.commit('getLevel', br)
            } else {
              this.$store.commit('getLevel', '')
            }
          } else {
            this.$store.commit('getLevel', '')
          }

        })
      },
    },
    components: {
      ScrollBar
    },
  };
</script>
<style lang="scss">
    .el-tooltip__popper.is-light {
        height: 6px !important;
        line-height: 6px !important;

    }
</style>
<style lang="scss" scoped>
    .tag-nav {
        display: inline-block;
        width: calc(100% - 180px);
        height: 58px;
        position: relative;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: middle;

        .tag-nav-item {
            /*text-align: center;*/
            display: inline-block;
            /*padding-left: 16px;*/
            line-height: 38px;
            height: 38px;
            vertical-align: bottom;
            margin-right: 3px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            width: 120px;
            background-color: #fff;
            border: 1px solid rgb(245, 245, 245);
            border-bottom: none;
            font-size: 12px;
            color: #666;
            text-decoration: none;

            b {
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
                text-overflow: ellipsis;
                width: 62px;
                vertical-align: middle;
                font-weight: normal;
                margin-left: 16px;
            }

            &:hover span {
                display: inline-block;
            }

            span {
                display: none;
                height: 38px;
                padding: 0 14px 0 12px;
                vertical-align: middle;
            }

            &.cur {
                border: none;
                background-color: #f2f4fd;
                color: #3b74ff;

                & span {
                    display: inline-block;
                    color: #3b74ff;
                }
            }

        }
    }
</style>
