<template>
  <div>
    <div class="flat">
      <p class="title">
        <i class="iconfont icon-changyonggongneng"></i>
        <span style="vertical-align: text-bottom"><strong style="font-size: 14px">我的常用功能</strong></span>
        <span>(可拖动调整顺序)</span>
      </p>
      <draggable class="list" tag="ul" v-model="commonList" @start="isDragging=true" v-bind="dragOptions" @end="endCommonList">
        <transition-group type="transition">
          <li v-for="(item,id) in commonList" :key="item.id">
            <p class="pTitle">
              <i class="yuan"></i>
              <span style="display: inline-block;">
                {{item.resourceName}}
              </span>
              <i class="el-icon-remove tubiao" @click="remove(item)"></i>
            </p>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class="xian"></div>
    <div class="flat">
      <p class="title">
        <i class="iconfont icon-zuijinfangwen"></i>
        <span style="vertical-align: text-bottom;font-size: 14px"><strong style="font-size: 14px">最近访问</strong></span>
        <span>(可将最近访问的功能添加到上方常用功能区)</span>
      </p>
      <ul class="list2">
        <li v-for="(item,index) in recentVisits" :key="index">
          <p class="pTitle">
            <i class="yuan"></i>
            <span>{{item.menuName}}</span>
            <i class="el-icon-circle-plus tubiao" @click="addComFun(item)"></i>
          </p>

        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { commonFunctions, functionSort, addFunction, removeCommonFunctions } from '../http/interface';
export default {
  name: 'commonFunctions',
  data () {
    return {
      editable: false,
      isDragging: false,
      delayedDragging: false,
      commonList: [],
      dragFlag: false
    };
  },
  created () {
    console.log("draggable");
    console.log(draggable);
    this.getFunctionList();
  },
  mounted () {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  computed: {
    dragOptions () {
      return {
        animation: 150,
        group: 'description',
        disabled: this.editable
      };
    },
    recentVisits () {
      return this.$store.state.tagNav.recentVisits;
    }
  },
  methods: {
    remove (val) {
      let _this = this;
      let params = {
        id: val.id
      };
      removeCommonFunctions(params)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.dragFlag = true;
            this.getFunctionList();
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {

        });
    },
    addComFun (val) {
      let _this = this;
      let data = {
        resourceCode: val.menuCode
      };
      this.$store.commit('tagNav/removeRecentVisits', val);
      addFunction(data)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.dragFlag = true;
            this.getFunctionList();
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {
        });
    },
    getFunctionList () {
      let _this = this;
      commonFunctions()
        .then(ret => {
          if (ret && ret.code == 200) {
            this.commonList = ret.data;
            if (this.dragFlag) {
              this.$eventHub.$emit('listFlag', { commonList: this.commonList });
              this.dragFlag = false;
            }
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {

        });
    },
    commonFunctionSort (arr) {
      let _this = this;
      functionSort(arr)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.$eventHub.$emit('listFlag', { commonList: this.commonList });
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {

        });
    },
    endCommonList () {
      this.commonList.map(item => {
        return {
          id: item.id
        };
      });
      this.commonFunctionSort(this.commonList);
    }
  },
  components: {
    draggable
  }

};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.flat {
  margin: 0px 10px;
  li {
    list-style: none;
    width: 25%;
    height: 32px;
    line-height: 32px;
    color: #666;
    /*text-overflow: ellipsis;
            white-space: nowrap;
            overflow: visible;*/
    &:hover .pTitle {
      background: #f0f0f0;
    }
    &:hover .tubiao {
      display: block;
    }
    .tubiao {
      position: absolute;
      right: -7px;
      bottom: 21px;
      font-size: 14px;
      display: none;
    }
  }
  .title {
    height: 19px;
    line-height: 9px;
    .iconfont {
      font-size: 18px;
      color: #3b74ff;
    }
    span:first-child {
      width: 23%;
      font-size: 14px;
      color: #333;
    }
    span:last-child {
      font-size: 14px;
      color: #c5c5c5;
      vertical-align: text-bottom;
    }
  }
  .pTitle {
    display: inline-block;
    height: 32px;
    border-radius: 6px;
    padding: 0 6px;
    position: relative;
    font-size: 14px;
  }
  .list {
    width: 100%;
    margin-top: 10px;
    span {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    li {
      cursor: move;
      i {
        color: red;
        cursor: pointer;
      }
    }
  }
  .yuan {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 4px;
    background: #999999;
    margin-right: 10px;
    cursor: pointer;
  }

  .list2 {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      cursor: pointer;
      i {
        color: forestgreen;
      }
    }
  }
}
.xian {
  width: 100%;
  height: 1px;
  background: #f5f5f5;
  margin: 20px 0 20px;
}
</style>
