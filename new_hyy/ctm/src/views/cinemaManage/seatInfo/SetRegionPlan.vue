<template>
  <section class="set-region-plan">

    <el-dialog :title="currentIndex > -1 ? '编辑分区' : '新建分区'" width="500px" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form :model="regionPlanForm" :rules="rules" ref="regionPlanForm" label-width="120px">
        <el-form-item label="分区类型：" prop="regionTypeUid">
          <el-select style="width: 193px" v-model="regionPlanForm.regionTypeUid" :disabled="currentIndex > -1" placeholder="请选择">
            <el-option v-for="item in regionTypeList" :key="item.uid" :label="item.name" :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="toRegionTypeManage">管理分区类型</el-button>
        </el-form-item>
        <el-form-item label="分区名称：" prop="name">
          <el-input style="width: 193px" v-model="regionPlanForm.name" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false; currentIndex = -1">取 消</el-button>
        <el-button type="primary" @click="confirmSave">确 定</el-button>
      </div>
    </el-dialog>

    <i v-if="seatRegionList.length > 0" class="add-icon el-icon-plus" @click="addRegionInfo"></i>

    <el-tabs v-if="seatRegionList.length > 0" v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in seatRegionList" :key="index" :label="item.name" :name="index.toString()">
        <el-form size="mini">
          <el-form-item label="分区名称：" :label-width="formLabelWidth">
            <span style="font-size: 12px">{{item.name}}</span>

            <div style="float: right; margin-right: 20px">
              <el-button v-if="item.code !== 0" style="padding: 8px 0" type="text" @click="editCurRegionInfo(index)">编辑</el-button>
              <el-button v-if="item.code !== 0" style="padding: 8px 0; margin-left: 0" type="text" @click="delCurRegionInfo(index, item.uid, item.color)">删除</el-button>
            </div>

          </el-form-item>
          <el-form-item label="分区类型：" :label-width="formLabelWidth">
            <span style="font-size: 12px">{{item.regionTypeName}}</span>
          </el-form-item>
          <el-form-item label="总座位数：" :label-width="formLabelWidth">
            <span style="font-size: 12px">{{item.regionSeatCount}}</span>
          </el-form-item>
          <el-form-item size="large" style="padding: 0 20px">
            <el-button v-if="item.code !== 0" :class="{'is-active' : delFlag}" @click="delSeatRegion(index)">清除关联座位</el-button>
            <el-button v-if="item.code !== 0" :class="{'is-active' : addFlag}" style="margin-left: 28px" @click="addSeatRegion(index)">添加选中座位</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
    </el-tabs>
    <div v-else class="add-region">
      <el-button type="text" icon="el-icon-plus" @click="addRegionInfo">新建</el-button>
    </div>

  </section>
</template>

<script>
export default {
  name: 'SetRegionPlan',
  props: {
    // 座位背景区域data
    seatAreaGrid: {
      type: Array,
      required: true
    },
    // 座位data
    seatCellGrid: {
      type: Array,
      required: true
    }
  },
  data () {
    let regionTypeUidValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择分区类型'));
      } else {
        let flag = this.seatRegionList.find((item, index) => {
          if (this.currentIndex !== index) {
            return item.regionTypeUid === value;
          }
        });
        if (flag) {
          callback(new Error('当前分区类型已被选择'));
        } else {
          callback();
        }
      }
    };

    let nameValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分区名称'));
      } else {
        let flag = this.seatRegionList.find((item, index) => {
          if (this.currentIndex !== index) {
            return item.name === value;
          }
        });
        if (flag) {
          callback(new Error('当前分区名称已存在'));
        } else {
          callback();
        }
      }
    };
    return {
      rules: {
        regionTypeUid: [
          { validator: regionTypeUidValidator, trigger: 'change' }
        ],
        name: [
          { validator: nameValidator, trigger: 'blur' }
        ]
      },
      regionPlanForm: {
        name: '',
        regionTypeUid: ''
      },
      dialogVisible: false,
      formLabelWidth: '90px',
      activeName: '0',
      // 分区list
      seatRegionList: [],

      // 分区类型list
      regionTypeList: [],
      hallUid: '',
      cinemaUid: '',
      currentIndex: -1,

      addFlag: false,
      delFlag: false

    };
  },
  watch: {
    activeName: function (val) {
      if (val === '0') {
        this.$emit('updateActiveType', 0);
        this.addFlag = false;
        this.delFlag = false;
      } else {
        this.$emit('updateDrawBgData', {
          drawBgColor: this.seatRegionList[Number(val)].color,
          drawBgRegionUid: this.seatRegionList[Number(val)].uid
        });
      }
    }
  },
  methods: {

    asyncRegionSeatCount () {
      console.log(this.seatCellGrid, 'seatCellGrid');
      this.seatRegionList.forEach(region => {
        let count = 0;
        this.seatCellGrid.forEach(item => {
          item.forEach(innerItem => {
            if (innerItem.regionUid === region.uid) {
              count++;
            }
          });
        });
        region.regionSeatCount = count;
      });
    },

    delSeatRegion (index) {
      this.addFlag = false;
      this.delFlag = !this.delFlag;
      this.$emit('updateActiveType', this.delFlag ? 11 : 0);
    },

    addSeatRegion (index) {
      this.addFlag = !this.addFlag;
      this.delFlag = false;
      this.$emit('updateActiveType', this.addFlag ? 10 : 0);
      if (this.addFlag) {
        this.$emit('updateDrawBgData', {
          drawBgColor: this.seatRegionList[index].color,
          drawBgRegionUid: this.seatRegionList[index].uid
        });
      }
    },

    dialogClose () {
      this.regionPlanForm = {
        name: '',
        regionTypeUid: ''
      };
      this.$refs.regionPlanForm.resetFields();
    },

    addRegionInfo () {
      this.currentIndex = -1;
      this.dialogVisible = true;
    },

    editCurRegionInfo (index) {
      this.currentIndex = index;
      this.regionPlanForm.name = this.seatRegionList[index].name;
      this.regionPlanForm.regionTypeUid = this.seatRegionList[index].regionTypeUid;
      this.dialogVisible = true;
    },

    delCurRegionInfo (index, uid, color) {
      this.$confirm('确定删除当前分区？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activeName = index ? (index - 1).toString() : '0';
        this.removeSeatRegion({ uid }, color);
      }).catch(() => {

      });
    },

    toRegionTypeManage () {
      this.$router.push({ path: '/ticket/regionTypeManage' });
    },

    confirmSave () {
      this.$refs.regionPlanForm.validate(valid => {
        if (valid) {
          if (this.currentIndex > -1) {
            // 修改
            this.updateSeatRegion({
              hallUid: this.hallUid,
              regionName: this.regionPlanForm.name,
              regionTypeUid: this.regionPlanForm.regionTypeUid,
              uid: this.seatRegionList[this.currentIndex].uid
            });
          } else {
            // 新建
            this.saveSeatRegion({
              cinemaUid: this.cinemaUid,
              hallUid: this.hallUid,
              regionName: this.regionPlanForm.name,
              regionTypeUid: this.regionPlanForm.regionTypeUid
            });
          }
        }
      });
    },

    handleClick (tab, event) {
      console.log(tab, event);
    },

    getRegionTypeList () {
      this.$ctmList.getRegionTypeList().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.regionTypeList = res.data;
          this.getSeatRegionList();
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 添加影厅座位分区
    saveSeatRegion (data) {
      this.$ctmList.saveSeatRegion(data).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.dialogVisible = false;
          this.getSeatRegionList();
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 修改影厅座位分区
    updateSeatRegion (data) {
      this.$ctmList.updateSeatRegion(data).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.dialogVisible = false;
          this.getSeatRegionList();
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 删除影厅座位分区
    removeSeatRegion (data, color) {
      this.$ctmList.removeSeatRegion(data).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.getSeatRegionList();
          this.$emit('updateSeatRegionData', color);
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 获取影厅座位分区列表
    getSeatRegionList () {
      this.$ctmList.getSeatRegionList({ hallUid: this.hallUid }).then(res => {
        console.log(res);
        if (res.code === 200) {
          res.data.forEach(item => {
            let data = this.regionTypeList.find(innerItem => {
              return innerItem.uid === item.regionTypeUid;
            });

            if (data) {
              item.regionTypeName = data.name;
              item.regionSeatCount = 0;
            }
          });
          this.seatRegionList = res.data;

          let data = this.seatRegionList.find(item => {
            return item.code === 0;
          });
          this.$emit('updateCommonBgData', {
            commonBgColor: data.color,
            commonBgRegionUid: data.uid

          });

          this.asyncRegionSeatCount();

          // 重置操作标识
          this.$emit('updateActiveType', 0);
          this.addFlag = false;
          this.delFlag = false;
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    }

  },
  mounted () {
    this.hallUid = this.$route.query.hallUid;
    this.cinemaUid = this.$route.query.cinemaUid;
    this.getRegionTypeList();
  }
};
</script>

<style lang="scss">
.set-region-plan {
  color: #333;
  border-radius: 0 0 2px 2px;
  /*background: #F2F4FD;*/
  position: relative;
  .el-dialog {
    .el-select {
      .el-input__inner {
        height: 32px !important;
      }
    }
  }
  .add-icon {
    background: #f2f4fd;
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
  }
  .el-tabs {
    .el-tabs__header {
      border: none;
      /*background: #F2F4FD;*/
      width: 210px;
      height: 24px;
      margin-bottom: 0;
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        line-height: 24px;
        background: #f2f4fd;
      }
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        height: 24px;
        line-height: 24px;
        border: none;
        background: rgba(126, 211, 33, 0.2);
        color: #999;
        font-size: 12px;
        margin-right: 2px;
      }
      .el-tabs__item.is-active {
        background: #ff6e3c;
        /*border: 1px solid #FF9301;*/
        color: #fff;
      }
    }
    .el-tabs__content {
      background: #f2f4fd;
      padding: 10px 0;
      .el-form {
        .el-form-item {
          margin-bottom: 0;
          .el-form-item__label {
            font-size: 12px;
          }
        }
        .el-form-item--large {
          .el-button {
            padding: 8px;
            border: 1px solid #3b74ff;
            background: transparent;
            color: #3b74ff;
          }
          .is-active {
            background: #3b74ff;
            color: #fff;
          }
        }
      }
    }
  }
  .add-region {
    background: #f2f4fd;
    height: 80px;
    .el-button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>