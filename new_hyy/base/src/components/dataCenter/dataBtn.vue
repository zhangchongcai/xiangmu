<template>
  <div class="datacenter-btn">
    <div class="datacenter-btn-left">报表页面数据按营业日（06:00:00-次日05:59:59）统计，数据更新于2018-12-21 17:11:40</div>
    <div class="datacenter-btn-right">
      <div class="datacenter-btn-rightul">
        <el-button plain @click="customHeader = true">自定义表头</el-button>
        <el-button plain @click="groupView = true">分组查看</el-button>
        <el-button plain>打印</el-button>
        <el-button plain>导出Excel</el-button>
      </div>
    </div>
    <el-dialog title="标题调整" :visible.sync="customHeader" width="616px" :before-close="handleClose">
      <div class="common-box">
        <ul class="common-box-query">
          <draggable v-model="fruit" :options="{group:'people'}">
            <li class="commonbox-query-coment" v-for="element in fruit">{{ element }}</li>
          </draggable>
        </ul>
        <div class="commonbox-query-tips">拖动排序筛选顺序</div>
        <ul class="common-box-query">
          <draggable v-model="girl" :options="{group:'people'}">
            <li class="commonbox-query-coment" v-for="element in girl">{{ element }}</li>
          </draggable>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customHeader = false">取 消</el-button>
        <el-button type="primary" @click="customHeader = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分组查看" :visible.sync="groupView" width="576px" :before-close="handleClose">
      <div class="groupView-box">
        <div class="groupView-left">
          <div class="groupView-left-header">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <div class="groupView-left-main">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="groupView-middle">
          <div class="groupView-middle-box positioncenter">
            <el-button plain>添加<i class="el-icon-arrow-right"></i></el-button>
            <el-button plain><i class="el-icon-arrow-left"></i>删除</el-button>
          </div>

        </div>
        <div class="groupView-right">
          <div class="groupView-left-header">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <div class="groupView-left-main">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupView = false">取 消</el-button>
        <el-button type="primary" @click="groupView = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import commonConditions from './dataCommon/commonConditions.vue';
const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  components: {
    commonConditions,
    draggable
  },
  props: {

  },
  data () {
    return {
      // 自定义表头
      customHeader: false,
      // 分组查看
      groupView: false,
      fruit: ['apple', 'banana', 'orage', 'apple', 'banana', 'orage', 'apple', 'banana', 'orage'],
      girl: ['linzhil', 'cjk', 'bdyjy'],

      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true
    };
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
  }
};
</script>
<style Scoped>
.datacenter-btn {
  height: 48px;
  line-height: 48px;
  color: #999999;
  overflow: hidden;
}
.datacenter-btn-left {
  float: left;
}
.datacenter-btn-right {
  float: right;
}
.datacenter-btn-rightul {
  overflow: hidden;
}

.groupView-box {
  width: 100%;
  position: relative;
  height: 196px;
}
.groupView-left {
  width: 200px;
  height: 196px;
  border: 1px solid #bcbcbc;
  border-radius: 2px;
  box-sizing: border-box;
  background: #ffffff;
  padding: 0px 16px;
  position: absolute;
  left: 0;
  top: 0;
}
.groupView-middle {
  box-sizing: border-box;
  position: absolute;
  left: 200px;
  right: 200px;
  width: auto;
  height: 100%;
}
.groupView-right {
  width: 200px;
  height: 196px;
  border: 1px solid #bcbcbc;
  border-radius: 2px;
  box-sizing: border-box;
  background: #ffffff;
  padding: 0px 16px;
  position: absolute;
  right: 0;
  top: 0;
}
.groupView-left-header {
  height: 48px;
  border-bottom: 1px solid #f2f2f2;
}
.groupView-left-main {
  height: 131px;
  overflow: auto;
}
.groupView-middle-box {
}
.groupView-middle-box .el-button {
  margin-bottom: 12px;
}
.el-checkbox-group label {
  display: block;
  height: 30px;
  line-height: 30px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.positioncenter {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>