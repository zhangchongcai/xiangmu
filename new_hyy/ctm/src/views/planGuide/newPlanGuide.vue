<template>
  <div class="create-new-guide">
    <div class="tltle" v-if="showType == 'new'">
      {{addType == 'force' ? '添加强制型影片指导' : '添加指导型影片指导'}}
    </div>
    <div class="tltle" v-if="showType == 'edit'">
      {{addType == 'force' ? '修改强制型影片指导' : '修改指导型影片指导'}}
    </div>
    <div class="tltle" v-if="showType == 'view'">
      {{addType == 'force' ? '查看强制型影片指导' : '查看指导型影片指导'}}
    </div>
    <el-form ref="form" label-width="72px" size="small">
      <el-form-item label="影片名称:">
        <!-- :filter-method="searchMovie" -->
        <!-- <el-select v-model="curMovieId" filterable placeholder="请选择" @change="curMovieChange" :disabled="showType == 'view'">
                    <el-option
                    v-for="item in movieList"
                    :key="item.id"
                    :label="item.movieName"
                    :value="item.movieId">
                    </el-option>
                </el-select> -->
        <el-select v-model="curMovieIds" multiple filterable placeholder="请选择" size="small" @change="curMovieChange" :disabled="showType == 'view'">
          <el-option v-for="item in movieList" :key="item.id" :label="item.movieName" :value="item.movieId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用日期:">
        <el-date-picker :disabled="showType == 'view'" style="width: 256px" v-model="ctimeValue" type="daterange" :clearable="false" :picker-options="pickerOptions" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="适用影院:">
        <cinemaSel style="margin-right: 10px;" :mode="mode" :showType="showType" :curCheckedCinema="selectCinema" @changeCurCheckedCinema="changeCurCheckedCinema"></cinemaSel> 已选{{selectCinema.length}}家
      </el-form-item>
      <el-form-item>
        <div class="advice-title">排片建议</div>
        <div class="table-top">
          <div class="top-tip">
            提示：请按”3场“”3-5场“”10-20%“10%-20%”样式输入
          </div>
          <div class="rule-tip">
            <span>输入规则说明</span>
            <el-tooltip effect="dark" placement="top">
              <div slot="content">
                <div class="input-rule">
                  固定场：3场、3-5场；3场&lt;=排片场次&lt;=5场
                </div>
                <div class="input-rule">
                  排片比率：10-20%；10%&lt;=排片场次/总场次<br />&lt;=20%
                </div>
                <div class="input-rule">
                  周转率：10%-20%；影院总排片数下限*10%&lt;=排片<br />场次&lt;=影院总排片数上限*20%
                </div>
              </div>
              <i class="el-icon-info" style="color: #3B74FF;"></i>
            </el-tooltip>

          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-table :data="hallData">
          <el-table-column :label="item.type == 'h' ? '黄金场' : item.type + '个厅'" v-for="(item, index) in hallList" :key="index" width="110">
            <template slot-scope="scope">
              <span class="table-range-con">
                <el-input :disabled="showType == 'view'" v-model="scope.row[item.type]" @change="inputChange($event, index)"></el-input>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div class="save-tool" v-if="mode != 'view'">
        <el-button class="w80-btn" type="primary" @click="saveEdit">确定</el-button>
        <el-button class="w80-btn" @click="cancelAdd">取消</el-button>
      </div>
      <div class="save-tool" v-else>
        <el-button class="w80-btn" @click="cancelAdd">关闭</el-button>
      </div>

    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @closed="handleClose">
      <div v-if="errorObj.type != 'p6'" style="font-size: 14px; color: #666; text-align: center;">{{errorObj.msg}}</div>
      <div v-if="errorObj.type == 'p6'" style="font-size: 14px; color: #666; text-align: center;"><i class="el-icon-warning" style="color: rgb(255, 139, 4); font-size: 18px; margin-right: 4px;"></i>{{errorObj.msg}}</div>
      <div v-if="errorObj.type == 'p6'" style="margin-top: 32px;">
        <div style="color: #666; margin-bottom: 14px; line-height: 16px;">示例: </div>
        <div class="input-rule">
          固定场：3场、3-5场；3场&lt;=排片场次&lt;=5场
        </div>
        <div class="input-rule">
          排片比率：10-20%；10%&lt;=排片场次/总场次<br />&lt;=20%
        </div>
        <div class="input-rule">
          周转率：10%-20%；影院总排片数下限*10%&lt;=排片<br />场次&lt;=影院总排片数上限*20%
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="w80-btn" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cinemaSel from './cinemaSelectByGeo';
import { getBaseMovieInfo } from 'ctmSrc/http/interface';
export default {
  props: {
    addType: {
      type: String,
      required: true
    },
    forceGuide: {
      type: Array,
      required: true
    },
    adviseGuide: {
      type: Array,
      required: true
    },
    timeValue: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      requried: true,
      default: 'view'
    },
    editData: {
      type: Object,
      required: true,
      default: {}
    },
    showType: {
      type: String,
      required: true,
      default: 'new'
    },
    // 编辑模式当前索引
    curCtrlGuideIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    showType (data, oldData) {
      this.resetData();
    },
    editData (data, oldData) {
      this.initEditData();
    }
  },
  data () {
    return {
      selectCinema: [],
      curMovieId: '',
      curMovieIds: [],
      curMovie: {

      },
      curMovies: [],
      hallList: [],
      hallData: [{}],
      addData: {},
      dialogVisible: false,
      errorObj: {},
      ctimeValue: null,
      searchMovieName: '',
      // 获取到的所有影片数据
      movieData: [],
      // 当前下拉框展示
      movieList: [],
      pickerOptions: {

      }

    };
  },
  mounted () {
    this.getBaseMovieInfo();
    this.initEditData();

    let that = this;
    this.pickerOptions = {
      disabledDate (time) {
        return (time.getTime() < new Date(that.timeValue[0]).getTime() - 1000 * 24 * 60 * 60) || (time.getTime() > new Date(that.timeValue[1]).getTime());
      }
    };
  },
  methods: {
    // 初始化转换当前操作数据
    editViewDataInit () {
      this.curMovieIds = this.editData.movieInfoVoList.map(item => Number(item.cmcBaseMovieId));

      this.ctimeValue = [this.editData.startDate, this.editData.endDate];
      this.selectCinema = this.editData.guidanceMovieCinemaVoList;
    },
    cancelAdd () {
      this.$emit('cancelAddGuide', this.addType);
    },
    saveEdit () {
      this.checkedSave();
    },
    changeGuideData (data) {
      this.$emit('changeGuideData', data);
    },
    submitData () {
      let data = {};
      data.cinemaNumber = this.selectCinema.length;
      data.guideType = this.addType;
      data.guidanceMovieCinemaVoList = this.selectCinema;

      data.movieInfoVoList = this.curMovieIds.map(item => {
        return {
          cmcBaseMovieId: this.movieList.find(citem => Number(citem.movieId) == Number(item)).movieId,
          dateShowFirst: this.movieList.find(citem => Number(citem.movieId) == Number(item)).dateShowFirst,
          dateShowOff: this.movieList.find(citem => Number(citem.movieId) == Number(item)).dateShowOff,
          disVersions: this.movieList.find(citem => Number(citem.movieId) == Number(item)).disVersions,
          movieLevel: this.movieList.find(citem => Number(citem.movieId) == Number(item)).movieLevel,
          movieName: this.movieList.find(citem => Number(citem.movieId) == Number(item)).movieName,
          timeLong: this.movieList.find(citem => Number(citem.movieId) == Number(item)).timeLong
        };
      });
      data.startDate = this.ctimeValue[0];
      data.endDate = this.ctimeValue[1];
      data.movieDetailVoList = this.hallList.filter(item => item.value).map(item => {
        let numberOrRatio = item.value.includes('%') ? 0 : 1;
        let value1 = numberOrRatio == 1 ? item.value.includes('-') ? item.value.split('场')[0].split('-')[0] : item.value.split('场')[0] : item.value.split('%')[0].split('-')[0];

        let value2 = numberOrRatio == 1 ? item.value.includes('-') ? item.value.split('场')[0].split('-')[1] : item.value.split('场')[0] : item.value.split('%')[0].split('-')[1];

        return {
          detailType: item.type,
          numberOrRatio: numberOrRatio,
          timeNumLower: value1,
          timeNumUpper: value2,
          timeRatioLower: value1,
          timeRatioUpper: value2
        };
      });
      if (this.showType == 'edit') {
        this.changeGuideData(data);
        return;
      }
      this.$emit('confirmGuide', data);
    },
    getBaseMovieInfo () {
      let data = {
        startDate: this.timeValue[0],
        endDate: this.timeValue[1],
        movieName: ''
      };
      getBaseMovieInfo(data).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200) {
          this.movieData = res.data;
          this.movieList = res.data;
        }
      });
    },
    checkedSave () {
      // 同一个影片同一个适用日期指导类型唯一
      var p1 = new Promise((resolve, reject) => {
        let isResolve = this.curMovieIds.length;

        if (!isResolve) {
          reject({
            type: 'p1',
            data: [],
            msg: '排片必须选择一部影片!'
          });
        } else {
          resolve();
        }
      });
      // 影片是否在全局适应日期内(具体适用于修改了全局适用时间之后)
      var movieP = new Promise((resolve, reject) => {
        let isResolve = this.curMovieIds.every(item => this.movieList.some(citem => citem.movieId == item));
        if (!isResolve) {
          reject({
            type: 'movieP',
            data: [],
            msg: '存在不在全局适用日期的影片, 请修改!'
          });
        } else {
          resolve();
        }
      });
      // 同一个影片同一个适用日期指导类型唯一
      var p2 = new Promise((resolve, reject) => {
        let isResolve = !!this.ctimeValue;

        if (!isResolve) {
          reject({
            type: 'p2',
            data: [],
            msg: '请选择指导时间段!'
          });
        } else {
          resolve();
        }
      });
      // 同一个影片同一个适用日期指导类型唯一
      var p3 = new Promise((resolve, reject) => {
        let isResolve = !!this.selectCinema.length;

        if (!isResolve) {
          reject({
            type: 'p3',
            data: [],
            msg: '请至少选择一家影院!'
          });
        } else {
          resolve();
        }
      });
      // 同一个影片同一个适用日期指导类型唯一
      var p4 = new Promise((resolve, reject) => {
        let contrastData = this.addType == 'force' ? JSON.parse(JSON.stringify(this.adviseGuide)) : JSON.parse(JSON.stringify(this.forceGuide));
        let isResolve = true;
        contrastData.some(guide => {
          // TODO 判断影片是否相同
          if (guide.movieInfoVoList.some(item => this.curMovieIds.includes(Number(item.cmcBaseMovieId)))) {
            if (!(new Date(guide.endDate).getTime() < new Date(this.ctimeValue[0]).getTime() || new Date(this.ctimeValue[1]).getTime() < new Date(guide.startDate).getTime())) {
              isResolve = false;
              return true;
            }
          }
        });
        if (!isResolve) {
          reject({
            type: 'p4',
            data: [],
            msg: '影片在其他指导中存在重复的适用日期'
          });
        } else {
          resolve();
        }
      });
      // 同一指导类型同一影城同一影片同一个适用日期只能有一条限制规则
      var p5 = new Promise((resolve, reject) => {
        let contrastData = this.addType == 'force' ? JSON.parse(JSON.stringify(this.forceGuide)) : JSON.parse(JSON.stringify(this.adviseGuide));
        if (this.showType == 'edit') {
          contrastData = contrastData.filter((item, index) => index != this.curCtrlGuideIndex);
        }
        let isResolve = true;
        contrastData.some(guide => {
          // TODO 判断影片是否相同
          if (guide.movieInfoVoList.some(item => this.curMovieIds.includes(Number(item.cmcBaseMovieId)))) {
            if (!(new Date(guide.endDate).getTime() < new Date(this.ctimeValue[0]).getTime() || new Date(this.ctimeValue[1]).getTime() < new Date(guide.startDate).getTime())) {
              if (guide.guidanceMovieCinemaVoList.some(item => !this.selectCinema.every(cinema => cinema.cinemaUid != item.cinemaUid))) {
                isResolve = false;
                return true;
              }
            }
          }
        });
        if (!isResolve) {
          reject({
            type: 'p5',
            data: [],
            msg: '影片在其他指导中存在重复的适用影城'
          });
        } else {
          resolve();
        }
      });
      // 判断输入是否符合规范
      var p6 = new Promise((resolve, reject) => {
        let errorData = [], isResolve = true, msg = '';
        this.hallList.forEach(item => {
          if (item.type == 'h') {
            if (item.value != '') {
              if (!this.inputCheck(item.value)) {
                errorData.push('黄金场');
                isResolve = false;
              }
            }
          } else {
            if (!this.inputCheck(item.value)) {
              errorData.push(item.type + '厅');
              isResolve = false;
            }
          }
        });

        if (!isResolve) {
          msg = '"' + errorData.join(',') + '" 输入不符合规范';
          reject({
            type: 'p6',
            data: errorData,
            msg: msg
          });
        } else {
          resolve();
        }
      });

      Promise.all([p1, movieP, p2, p3, p4, p5, p6]).then(() => {
        this.submitData();
      }).catch(res => {
        console.log(res);
        this.errorObj = res;
        let type = res.type;
        if (type == 'p1' || type == 'p2' || type == 'p3' || type == 'movieP') {
          this.error(this.errorObj.msg);
        } else {
          this.dialogVisible = true;
        }
        // this.error(res)
      });
    },
    handleClose () {
      this.errorObj = {};
    },
    // searchMovie(val) {
    //     console.log(val)
    // },
    initHallList () {
      // if (this.showType == 'new') {
      //     this.hallList = []
      //     this.hallData = [{}]
      //     return
      // }
      let hallList = this.editData.movieDetailVoList ? this.editData.movieDetailVoList.map(item => {
        if (item.numberOrRatio) {
          if (item.timeNumLower == item.timeNumUpper) {
            return {
              type: item.detailType,
              value: item.timeNumLower + '场'
            };
          } else {
            return {
              type: item.detailType,
              value: item.timeNumLower + '-' + item.timeNumUpper + '场'
            };
          }
        } else {
          return {
            type: item.detailType,
            value: item.timeRatioLower + '-' + item.timeRatioUpper + '%'
          };
        }
      }) : [];
      hallList.sort((a, b) => a.detailType - b.detailType);
      this.hallList = this.editData.movieDetailVoList ? this.editData.movieDetailVoList.some(item => item.detailType == 'h') ? hallList : [{
        type: 'h',
        value: ''
      }].concat(hallList) : [{
        type: 'h',
        value: ''
      }].concat(hallList);
      let hallData = [];
      hallData = this.hallList.reduce((data, item) => {
        data[0][item.type] = item.value;
        return data;
      }, [{}]);
      this.hallData = hallData;
    },
    curMovieChange (val) {
      if (this.showType == 'view') return;
      this.ctimeValue = null;
    },
    changeCurCheckedCinema (data) {
      this.selectCinema = JSON.parse(JSON.stringify(data));
      let oldHallList = JSON.parse(JSON.stringify(this.hallData));
      let hallData = [];
      // debugger
      this.selectCinema.forEach(item => {
        if (hallData.every(hall => hall.type != item.hallCount)) {
          hallData.push({ type: item.hallCount, value: '' });
        }
      });
      hallData.sort((a, b) => a.type - b.type);
      let hallList = [{
        type: 'h',
        value: ''
      }].concat(hallData);
      hallList.forEach(item => {
        item.value = oldHallList[0][item.type] ? oldHallList[0][item.type] : '';
      });
      this.hallList = hallList;
      this.hallData = this.hallList.reduce((data, item) => {
        data[0][item.type] = item.value;
        return data;
      }, [{}]);
    },
    inputChange (value, index) {
      let hallList = JSON.parse(JSON.stringify(this.hallList));
      hallList[index].value = value;
      this.hallList = hallList;
    },
    inputCheck (data) {
      return /^((([0-9][0-9]?|100)(-[0-9][0-9]?|100)?场)|(([0-9][0-9]?|100)(-[0-9][0-9]?|100)%))$/.test(data);
    },
    resetData () {
      this.selectCinema = [];
      this.curMovieIds = [];
      this.curMovies = [];
      this.hallList = [];
      this.hallData = [{}];
      this.addData = {};
      this.errorObj = {};
      this.ctimeValue = null;
      // 获取到的所有影片数据
      this.movieData = [];
      // 当前下拉框展示
      this.movieList = [];

      this.getBaseMovieInfo();

      let that = this;
      this.pickerOptions = {
        disabledDate (time) {
          return (time.getTime() < new Date(that.timeValue[0]).getTime() - 1000 * 24 * 60 * 60) || (time.getTime() > new Date(that.timeValue[1]).getTime());
        }
      };
    },
    initEditData () {
      if (this.showType != 'new') {
        this.editViewDataInit();
      }
      this.initHallList();
    }
  },

  components: {
    cinemaSel
  }
};
</script>

<style lang="scss" scoped>
.create-new-guide {
  background-color: #f5f5f5;
  padding: 30px 24px 24px;
  height: 488px;
  .tltle {
    color: #333;
    font-size: 14px;
    margin-bottom: 24px;
  }
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      font-size: 12px;
      color: #666666;
    }
    .el-form-item__content {
      color: #666;
      font-size: 12px;
      .advice-title {
        font-size: 12px;
        color: #666;
        height: 16px;
        line-height: 16px;
        margin-bottom: 4px;
      }
      .table-top {
        height: 16px;
        .top-tip {
          color: #999;
          height: 16px;
          line-height: 16px;
          float: left;
        }
        .rule-tip {
          // position: absolute;
          // right: 0;
          // top: 0;
          float: right;
          width: 140px;
          height: 16px;
          line-height: 16px;
          text-align: right;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  /deep/ .el-date-editor {
    vertical-align: middle;
    width: 256px;
    .el-range-separator {
      position: relative;
      top: -1px;
      width: 10%;
    }
    .el-range__icon,
    .el-range__close-icon {
      position: relative;
      top: -1px;
    }
    .el-range-input,
    .el-range-separator {
      font-size: 12px;
    }
  }
  .w80-btn {
    width: 80px;
    height: 32px;
    box-sizing: border-box;
  }
  .save-tool {
    height: 32px;
    padding: 24px 0 0;
    text-align: center;
    font-size: 0;
    .el-button {
      display: inline-block;
      margin-right: 32px;
    }
    .el-button + .el-button {
      margin-left: 0px;
    }
  }
}
.el-table {
  .table-range-con {
    display: inline-block;
    width: 80px;
  }
}
.el-tooltip__popper {
  .input-rule {
    margin-bottom: 5px;
    font-size: 12px;
    line-height: 16px;
  }
}
.el-dialog {
  .input-rule {
    margin-bottom: 5px;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>