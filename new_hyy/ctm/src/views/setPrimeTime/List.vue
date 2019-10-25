<template>
  <section class="set-prime-time-list">
    <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
      <el-form-item label="省市：">
        <el-select style="width: 128px;" v-model="formData.provinceCode" @change="provinceChange" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in provinceOptions" :key="item.provinceCode" :label="item.provinceName" :value="item.provinceCode">
          </el-option>
        </el-select>
        <el-select style="width: 128px;" v-model="formData.cityCode" @change="getCinemaAreaList" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in cityOptions" :key="item.cityCode" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="影院：">
        <el-select v-model="formData.cinemaUid" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in cinemaOptions" :key="item.cinemaUid" :label="item.cinemaName" :value="item.cinemaUid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-checkbox v-model="formData.isNotSet" :true-label="1" :false-label="0">未配置影城</el-checkbox>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="header clearfix">
      <div class="header-left">
        共<span style="color: #F33430">{{cinemaStatistic.allCount}}</span>家影院，
        <span style="color: #F33430">{{cinemaStatistic.setCount}}</span>家已配置，
        <span style="color: #F33430">{{cinemaStatistic.isNotSetCount}}</span>家未配置
      </div>
      <el-form class="header-right" :inline="true" :model="formInline">
        <el-form-item label="设置黄金时段：">
          <el-select v-model="formInline.dayType" placeholder="请选择">
            <el-option v-for="item in dayTypeOptions" :key="item.keyCode" :label="item.keyName" :value="item.keyCode">
            </el-option>
          </el-select>
          <el-time-picker class="table-date" style="height: 32px; line-height: 32px" is-range value-format="HH:mm" format="HH:mm" v-model="formInline.batchTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
          <el-button type="text" @click="batchSettingTime">批量设置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="treeTable" :data="tableData" row-key="cinemaUid" :header-cell-style="{'background': '#e7ebff'}" style="width: 100%">
      <el-table-column fixed width="150">
        <template slot="header" slot-scope="scope">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">城市</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-if="scope.row.children" :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checked" @change="handleCheckCityChange($event, scope.row.cityCode)">{{scope.row.cityName}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="影院" min-width="200" fixed show-overflow-tooltip>
        <template slot-scope="scope">
          <el-checkbox v-if="scope.row.cinemaName" v-model="scope.row.checked" @change="handleCheckCinemaChange($event, scope.row.cinemaUid)">{{scope.row.cinemaName}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column :key="index" v-for="(item, index) in dayTypeOptions" :label="item.keyName" width="321" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-time-picker v-if="!scope.row.children" class="table-date" is-range :clearable="false" value-format="HH:mm" format="HH:mm" v-model="scope.row.timeList[index].time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
        </template>
      </el-table-column>

    </el-table>

    <div class="btn-area">
      <el-button type="primary" @click="setPrimeTimeList">确定</el-button>
      <!--            <el-button @click="">取消</el-button>-->
    </div>
  </section>
</template>

<script>
import areaData from 'ctmSrc/assets/data/area';

export default {
  name: 'List',
  data () {
    return {
      checkAll: false,
      isIndeterminate: false,

      formData: {
        cinemaUid: '',
        cityCode: '',
        isNotSet: 0,
        provinceCode: '',
        current: 1,
        size: 1000
      },

      formInline: {
        dayType: 1,
        batchTime: ''
      },

      tableData: [],
      allTableData: [],
      dayTypeOptions: [{
        keyCode: 1,
        keyName: '节假日'
      }, {
        keyCode: 2,
        keyName: '周一至周四'
      }, {
        keyCode: 3,
        keyName: '周五'
      }, {
        keyCode: 4,
        keyName: '周六至周日'
      }],
      provinceOptions: [],
      cityOptions: [],
      cinemaOptions: []

    };
  },
  computed: {
    cinemaStatistic: function () {
      let isNotSetCount = 0;
      let setCount = 0;
      let allCount = 0;
      this.tableData.forEach(item => {
        item.children.forEach(innerItem => {
          let isNotSetFlag = innerItem.timeList.some(time => {
            return !time.time;
          });
          isNotSetFlag ? isNotSetCount++ : setCount++;
          allCount++;
        });
      });
      return { isNotSetCount, setCount, allCount };
    }

  },
  methods: {

    batchSettingTime () {
      if (!this.formInline.batchTime) {
        this.error('请先选择时间段！');
        return;
      }

      let flag = true;
      this.tableData.forEach(item => {
        item.children.forEach(innerItem => {
          if (innerItem.checked) {
            let data = innerItem.timeList.find(time => {
              return time.dayType === this.formInline.dayType;
            });
            data.time = this.formInline.batchTime;

            flag = false;
          }
        });
      });
      if (flag) {
        this.error('请先选择影院！');
      }

      // this.formInline.batchTime = ''
    },

    search () {
      let dataArr = [];
      if (this.formData.cinemaUid) {
        // 如果选了cinemaUid 先根据cinemaUid过滤
        let data = this.allTableData.find(item => {
          return item.cinemaUid === this.formData.cinemaUid;
        });
        // 然后根据未配置影城过滤
        if (this.formData.isNotSet) {
          let isNotSetFlag = data.timeList.some(item => {
            return !item.time;
          });
          if (isNotSetFlag) {
            dataArr.push(data);
          }
        } else {
          dataArr.push(data);
        }
      } else if (this.formData.cityCode) {
        // 选了市 影院是全部 根据cityCode过滤
        this.allTableData.forEach(item => {
          if (this.formData.cityCode === item.cityCode) {
            // 根据根据未配置影城过滤
            if (this.formData.isNotSet) {
              let isNotSetFlag = item.timeList.some(time => {
                return !time.time;
              });
              if (isNotSetFlag) {
                dataArr.push(item);
              }
            } else {
              dataArr.push(item);
            }
          }
        });
      } else if (this.formData.provinceCode) {
        // 只选了省 市和影院为全部 根据provinceCode过滤
        this.allTableData.forEach(item => {
          if (this.formData.provinceCode === item.provinceCode) {
            // 根据根据未配置影城过滤
            if (this.formData.isNotSet) {
              let isNotSetFlag = item.timeList.some(time => {
                return !time.time;
              });
              if (isNotSetFlag) {
                dataArr.push(item);
              }
            } else {
              dataArr.push(item);
            }
          }
        });
      } else {
        // 没选任何省市影院过滤条件 只需根据未配置影城过滤

        this.allTableData.forEach(item => {
          if (this.formData.isNotSet) {
            let isNotSetFlag = item.timeList.some(time => {
              return !time.time;
            });
            if (isNotSetFlag) {
              dataArr.push(item);
            }
          } else {
            dataArr.push(item);
          }
        });
      }

      console.log(dataArr, 'dataArr');

      let tableDataArr = [];
      dataArr.forEach(item => {
        // 判断dataArr里有没有当前城市 没有就push 有就不push
        let hasFlag = tableDataArr.find(innerItem => {
          return innerItem.cityCode === item.cityCode;
        });
        if (!hasFlag) {
          // 没有当前城市 需要push
          let dataObj = {
            provinceCode: item.provinceCode,
            provinceName: item.provinceName,
            cityName: item.cityName,
            cityCode: item.cityCode,
            checked: false,
            isIndeterminate: false,
            children: []
          };
          tableDataArr.push(dataObj);
        }
      });

      // 折叠表格 需要添加children
      tableDataArr.forEach((item, index) => {
        // cinemaUid 唯一标识
        item.cinemaUid = 'cinemaUid' + index;
        let checkCount = 0;
        dataArr.forEach(innerItem => {
          if (item.cityCode === innerItem.cityCode) {
            if (innerItem.checked) {
              checkCount++;
            }
            item.children.push(innerItem);
          }
        });
        if (checkCount === 0) {
          // 一个都没有checked
          item.checked = false;
          item.isIndeterminate = false;
        } else if (checkCount > 0 && checkCount < item.children.length) {
          // 部分checked
          item.checked = false;
          item.isIndeterminate = true;
        } else if (checkCount === item.children.length) {
          // 全部checked
          item.checked = true;
          item.isIndeterminate = false;
        }
      });

      console.log(tableDataArr, 'tableDataArr');

      this.tableData = tableDataArr;

      this.syncCheckAll();

      this.$nextTick(() => {
        setTimeout(_ => {
          this.expandAll();
        }, 50);
      });
    },

    handleCheckAllChange (val) {
      this.tableData.forEach(item => {
        item.isIndeterminate = false;
        item.checked = val;
        item.children.forEach(innerItem => {
          innerItem.checked = val;
        });
      });

      this.isIndeterminate = false;
    },

    handleCheckCityChange (val, cityCode) {
      console.log(val, cityCode);
      this.tableData.some(item => {
        if (item.cityCode === cityCode) {
          item.children.forEach(innerItem => {
            innerItem.checked = val;
          });
          item.isIndeterminate = false;
          return true;
        }
      });
      this.syncCheckAll();
    },

    handleCheckCinemaChange (val, cinemaUid) {
      this.tableData.some(item => {
        let data = item.children.find(innerItem => {
          return innerItem.cinemaUid === cinemaUid;
        });
        if (data) {
          if (val) {
            let flag = item.children.some(innerItem => {
              return !innerItem.checked;
            });
            if (flag) {
              item.checked = false;
              item.isIndeterminate = true;
            } else {
              item.checked = true;
              item.isIndeterminate = false;
            }
          } else {
            let flag = item.children.some(innerItem => {
              return innerItem.checked;
            });
            if (flag) {
              item.checked = false;
              item.isIndeterminate = true;
            } else {
              item.checked = false;
              item.isIndeterminate = false;
            }
          }
          return true;
        }
      });

      this.syncCheckAll();
    },

    syncCheckAll () {
      if (!this.tableData.length) {
        this.checkAll = false;
        this.isIndeterminate = false;
        return;
      }

      let checkAllFlag = this.tableData.every(item => {
        return item.checked;
      });

      if (checkAllFlag) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else {
        let noCheckFlag = this.tableData.every(item => {
          return !item.checked && !item.isIndeterminate;
        });
        if (noCheckFlag) {
          this.checkAll = false;
          this.isIndeterminate = false;
        } else {
          this.checkAll = false;
          this.isIndeterminate = true;
        }
      }
    },

    getAreaInfo () {
      this.provinceOptions = areaData;
      this.getCinemaAreaList();

      // this.$ctmList.getAreaInfo().then( res => {
      //     console.log(res)
      //     if(res.code === 200) {
      //         this.provinceOptions = res.data
      //
      //         this.getCinemaAreaList()
      //
      //     }else {
      //         this.error(res.msg)
      //     }
      //
      // }).catch( err => {
      //     console.log(err)
      // })
    },

    provinceChange (provinceCode) {
      let data = this.provinceOptions.find(item => {
        return item.provinceCode === provinceCode;
      });
      if (data) {
        this.cityOptions = data.cityVoList;
        this.formData.cityCode = this.cityOptions[0].cityCode;
      } else {
        this.cityOptions = [];
        this.formData.cityCode = '';
      }

      this.getCinemaAreaList();
    },

    getCinemaAreaList () {
      this.$ctmList.getCinemaAreaList(this.formData).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.cinemaOptions = res.data;
          this.formData.cinemaUid = '';
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 数组排序方法
    sortFunc (prop) {
      return function (obj1, obj2) {
        let value1 = obj1[prop];
        let value2 = obj2[prop];
        return value1 - value2;
      };
    },

    getPrimeTimeList () {
      this.$ctmList.getPrimeTimeList(this.formData).then(res => {
        console.log(res);
        if (res.code === 200) {
          let dataArr = [];
          let allDataArr = [];
          res.data.primeTimeListVoPageInfo.list.forEach(item => {
            // 判断dataArr里有没有当前城市 没有就push 有就不push
            let hasFlag = dataArr.find(innerItem => {
              return innerItem.cityCode === item.cityCode;
            });
            if (!hasFlag) {
              // 没有当前城市 需要push
              let dataObj = {
                provinceCode: item.provinceCode,
                provinceName: item.provinceName,
                cityName: item.cityName,
                cityCode: item.cityCode,
                checked: false,
                isIndeterminate: false,
                children: []
              };
              dataArr.push(dataObj);
            }
          });

          // 折叠表格 需要添加children
          dataArr.forEach((item, index) => {
            // cinemaUid 唯一标识
            item.cinemaUid = 'cinemaUid' + index;
            res.data.primeTimeListVoPageInfo.list.forEach(innerItem => {
              if (item.cityCode === innerItem.cityCode) {
                innerItem.checked = false;
                if (innerItem.timeList.length === 4) {
                  let data = [];
                  innerItem.timeList.forEach(time => {
                    data.push({
                      dayType: time.dayType,
                      time: (time.startTime && time.endTime) ? [time.startTime, time.endTime] : ['18:00', '22:00']
                    });
                  });
                  // 需要根据dayType排序
                  innerItem.timeList = data.sort(this.sortFunc('dayType'));
                } else {
                  innerItem.timeList = [{
                    dayType: 1,
                    time: ['18:00', '22:00']
                  }, {
                    dayType: 2,
                    time: ['18:00', '22:00']
                  }, {
                    dayType: 3,
                    time: ['18:00', '22:00']
                  }, {
                    dayType: 4,
                    time: ['18:00', '22:00']
                  }];
                }

                // 根据引用数据类型特点来同步数据
                item.children.push(innerItem);
                allDataArr.push(innerItem);
              }
            });
          });

          console.log(dataArr, 'dataArr');
          console.log(allDataArr, 'allDataArr');

          this.allTableData = allDataArr;
          this.tableData = dataArr;

          this.$nextTick(() => {
            setTimeout(_ => {
              this.expandAll();
            }, 50);
          });
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    setPrimeTimeList () {
      console.log(this.allTableData, 'allTableData');
      let dataArr = [];
      this.allTableData.forEach(item => {
        let dataObj = {
          cinemaUid: item.cinemaUid,
          timeList: []
        };
        item.timeList.forEach(time => {
          dataObj.timeList.push({
            dayType: time.dayType,
            startTime: time.time ? time.time[0] : '',
            endTime: time.time ? time.time[1] : ''
          });
        });
        dataArr.push(dataObj);
      });
      console.log(dataArr, 'dataArr');
      this.$ctmList.setPrimeTimeList({ list: dataArr }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.success('设置成功！');
        } else {
          this.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 默认展开所有行
    expandAll () {
      const els = this.$el.querySelectorAll('.el-table__fixed .el-table__expand-icon');
      console.log(els, 'els');
      for (let i = 0; i < els.length; i++) {
        els[i].click();
      }
    }

  },
  mounted () {
    this.getAreaInfo();
    this.getPrimeTimeList();
  }
};
</script>

<style lang="scss">
.set-prime-time-list {
  .table-date {
    width: 300px;
    height: 28px;
    line-height: 28px;
    .el-input__icon {
      line-height: 20px;
    }
    .el-range-input {
      font-size: 12px;
    }
    .el-range-separator {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      width: 15%;
    }
  }

  .header {
    .header-left {
      float: left;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #999999;
    }
    .header-right {
      float: right;
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
        .el-form-item__label {
          font-size: 12px;
        }
        .el-button {
          width: 48px;
          height: 32px;
          padding-left: 0;
          padding-right: 0;
          span {
            font-size: 12px;
            color: #3b74ff;
          }
        }
      }
    }
  }
  .btn-area {
    margin-top: 20px;
    text-align: center;
    margin-bottom: 56px;
    .el-button {
      width: 80px;
      height: 32px;
      border-radius: 4px;
      padding: 8px;
      span {
        font-size: 12px;
      }
    }
    .el-button + .el-button {
      margin-left: 32px;
    }
  }
}
</style>