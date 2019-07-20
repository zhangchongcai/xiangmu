<template>
  <el-container style="width: 100%; height: -webkit-fill-available;">
    <el-aside width="200px" style="padding-top: 30px;">
      <el-menu class="el-menu-vertical-demo">
        <template v-for="(item,index) in routerLinks">
          <el-submenu
            :index="index+1+''"
            :key="item.name"
            v-if="item.children && item.children.length>0"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item
              v-for="(children,childrenIndex) in item.children"
              :index="childrenIndex+1+''"
              :key="children.name"
              @click="addTab(children)"
            >{{children.name}}</el-menu-item>
          </el-submenu>
          <!-- <el-menu-item :index="index+1+''" :key="item.name" v-else>
            <i class="el-icon-menu"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>-->
        </template>
      </el-menu>
      <!-- <div
        class="link-item"
        v-for="(item, index) in routerLinks"
        :key="index + 1"
        @click="addTab(item)"
      >{{item.name}}</div>-->
    </el-aside>
    <el-main>
      <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabsArray"
          :key="item.name"
          :label="item.name"
          :name="item.name"
          :closable="item.closable"
        >
          <iframe :src="item.path" height="800px" width="100%"></iframe>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
// import salesTerminal from "./salesTerminal/index.vue";
// import salesType from "./salesType/index.vue";
// import goodsUnit from "./goodsUnit/index.vue";
// import goodsBrand from "./goodsBrand/index.vue";
// import salesAttribute from "./salesAttribute/index.vue";
import mixin from "cim/mixins/cim/paginationConfig.js";
export default {
  mixins: [mixin],
  data() {
    return {
      editableTabsValue: "卖品首页",
      editableTabsArray: [
        {
          name: "卖品首页",
          path: ""
        }
      ],
      routerLinks: [
        {
          name: "基础设置",
          icon: "el-icon-setting",
          path: "",
          children: [
            {
              name: "仓库管理",
              path: "goodsStorehouse/list"
            },
            {
              name: "货架管理",
              path: "storageRack/index"
            },
            {
              name: "销售地点",
              path: "salesLocation/index"
            },
            {
              name: "销售终端",
              path: "salesTerminal/index"
            },
            {
              name: "销售大类",
              path: "salesType/index"
            },
            {
              name: "类别管理",
              path: "goodsCategories/index"
            },
            {
              name: "商品分类管理",
              path: "goodsCategoriesManagement/index"
            },
            {
              name: "单位管理",
              path: "goodsUnit/index"
            },
            {
              name: "品牌管理",
              path: "goodsBrand/index"
            },
            {
              name: "销售属性",
              path: "salesAttribute/index"
            }
          ]
        },
        {
          name: "商品资料",
          icon: "el-icon-menu",
          path: "",
          children: [
            {
              name: "总部商品管理",
              path: "commodityInformation"
            },
            {
              name: "门店商品管理",
              path: "commodityInformationStore"
            }
          ]
        }
      ]
    };
  },
  methods: {
    addTab(item) {
      let existTab = false;
      for (let i = 0; i < this.editableTabsArray.length; i++) {
        if (item.name == this.editableTabsArray[i].name) {
          existTab = true;
          break;
        }
      }
      if (!existTab) {
        item.closable = true;
        this.editableTabsArray.push(item);
      }
      this.editableTabsValue = item.name;
    },
    removeTab(targetName) {
      let tabs = this.editableTabsArray;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabsArray = tabs.filter(tab => tab.name !== targetName);
    }
  },
  components: {
    // salesTerminal,
    // salesType,
    // goodsUnit,
    // goodsBrand,
    // salesAttribute
  }
};
</script>

<style lang="scss">

</style>