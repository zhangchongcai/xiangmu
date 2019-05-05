<template>
  <!--左侧导航 -->
  <div class="el-aside-wrap">
    <div class="logo-wrap">
      <img src="../../assets/img/logo.png" alt="logo" class="logo">
    </div>
    <el-aside>
      <el-menu default-active="1" class="el-menu-vertical-demo" router>
        <el-submenu index="1">
          <template slot="title">
            <span>首页</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/group/home">集团</el-menu-item>
            <el-menu-item index="/area/home">城市体</el-menu-item>
            <el-menu-item index="/cinema/home">影院</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <span>卖品</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/group/sale/total">集团</el-menu-item>
            <el-menu-item index="/area/sale/total">城市体</el-menu-item>
            <el-menu-item index="/cinema/sale/total">影院</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <span>进销存</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/group/inventory">集团进销存</el-menu-item>
            <el-menu-item index="/area/inventory">城市体进销存</el-menu-item>
            <el-menu-item index="/cinema/inventory">影院进销存</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  name: "NavMenu",
  dada() {
    return {
      value1: ""
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" >
.logo-wrap {
  width: 80px;
  height: 50px;
  margin: 20px auto;
  img {
    width: 100%;
  }
}
//aside区域
.el-aside-wrap {
  position: fixed;
  z-index: 100;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 136px !important;
  background-color: #21376b;
  overflow: hidden;
}

.el-menu {
  background: none;
  width: 175px;
  border: none;
  position: relative;
  left: -10px;
  .el-submenu .el-submenu__title {
    color: white;
  }
  .el-menu-item-group__title {
    padding: 0px;
  }
  .el-submenu__title:hover {
    background: none;
    color: yellow;
  }
}
.el-menu-item {
  color: white;
}
.el-menu-item:hover {
  background: none;
  color: yellow;
}
.el-submenu .el-menu-item {
  padding: 0px;
}
</style>
