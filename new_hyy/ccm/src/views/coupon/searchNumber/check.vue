<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="票券信息" name="couponInfo">
        <template v-for="item in couponInfoArr">
          <el-row :key="item.key" class="flex-base couponInfoItem">
            <span class="title">{{item.text}}:</span>
            <span class="text-content" v-if="!item.isCheck">{{item.value}}</span>
            <el-button type="text" v-else @click="checkApplyCode(item)">{{item.value}}</el-button>
          </el-row>
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-row class="flex-base flex-center">
      <el-button type="primary" @click="router('path','searchNumber',{applyCode: query.applyCode})">返回</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeNames: ['couponInfo'],
      couponInfoArr: [],
      query: {}
    }
  },
  created () {
    this.setCouponInfoArr(this.$route.query);
    this.query = this.$route.query;
  },
  methods: {
    /**
     * @function router - 跳转路由
     * 
     * @param {String} type - 路由类型: name , path
     * @param {String} path - 路由地址
     * @param {Object} [param] - 路由参数
     */
    router (type, path, param) {
      let routerObj = {};
      routerObj[`${type}`] = path;
      if (typeof param == 'object' && JSON.stringify(param) != '{}') {
        if (type == 'path') {
          routerObj[`query`] = param;
        } else {
          routerObj[`params`] = param;
        }
      }
      this.$store.commit("tagNav/removeTagNav", {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      })
      this.$router.push(routerObj)
    },
    /**
     * @function setCouponInfoArr - 设置票券信息
     */
    setCouponInfoArr (params) {
      let keysArr = Object.keys(params);
      let couponInfoArr = [];
      let keysText = {
        couponCode: '票券编号',
        couponName: '票券名称',
        applyCode: '销售申请单号',
        actTime: '激活日期',
        status: '状态'
      };
      keysArr.forEach((item, index) => {
        let obj = {};
        obj[`key`] = item;
        obj[`text`] = keysText[`${item}`];
        let val = params[`${item}`];

        if (item == 'status') {
          obj[`value`] = this.counponStatus(val);
        } else if (item == 'actTime') {
          obj[`value`] = this.ruleTime(val);
        } else {
          obj[`value`] = val;
        }

        if (item == 'applyCode') {
          obj[`isCheck`] = false;
        }

        if (keysText[`${item}`]) {
          couponInfoArr.push(obj);
        }
      });
      this.couponInfoArr = couponInfoArr;
    },
    /**
     * @function checkApplyCode - 查看票券申请单信息
     */
    checkApplyCode (params) {
      console.log(params);
    },
    /**
     * @function counponStatus - 修改票卷状态显示对应text
     */
    counponStatus (status) {
      let text = '未知';
      let statusTextKey = {
        0: '未激活',
        1: '已激活',
        2: '已消费',
        3: '已退货',
        4: '已停用',
        5: '未生成',
        6: '已作废',
        7: '已过期'
      }
      if (statusTextKey[`${status}`]) {
        text = statusTextKey[`${status}`];
      }
      return text;
    },
    /**
     * @function ruleTime - 格式化时间
     * @param {Object} time - 时间
     * @param {String} [type='time'] - 可选参数,格式化类型 时分 
     */
    ruleTime (time, type) {
      if (!time) {
        return `未填写`;
      }
      let _time = new Date(time);

      let _year = _time.getFullYear(),
        _mounth = _time.getMonth() + 1,
        _day = _time.getDate(),
        _hours = _time.getHours(),
        _minutes = _time.getMinutes();

      let returnStr = `${_year}-${_mounth}-${_day}`;
      if (type == 'time') {
        returnStr = `${_hours}:${_minutes}`;
      }

      return returnStr;
    },
  }
}
</script>

<style lang="scss" scoped>
.couponInfoItem {
  margin-bottom: 10px;
}
.title {
  margin-left: 15px;
  width: 150px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
.text-content {
  padding: 0px 20px;
}
</style>
