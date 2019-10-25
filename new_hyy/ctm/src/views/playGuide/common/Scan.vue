/*
* Description:查看详情
* Author:
* Update:
*/
<template>
  <div class="play-guide-edit">
    <!-- <div class="crumbs">
      <curmbs :address="address"></curmbs>
    </div> -->
    <div class="form-wrapper">

      <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="submitForm()" label-width="120px">
        <el-form-item label="影片名称：" prop="movieCode">
          <el-col :span="20">
            <el-input v-model="dataForm.movieName" :disabled="!enabledEdit" clearable placeholder="影片名称"></el-input>
            <el-input v-show="false" v-model="dataForm.movieCode" :disabled="!enabledEdit" clearable placeholder="影片名称"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button v-show="false" style="margin-left:5px;" @click.prevent="showSingleFilmModel">选择</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="适用影院：" prop="useCinema">
          <el-col :span="7">
            <el-select v-model="dataForm.useCinema" :disabled="!enabledEdit" placeholder="请选择">
              <el-option label="全部" :value="1"></el-option>
              <el-option label="指定影院" :value="0"></el-option>
            </el-select>
          </el-col>
          <el-col :span="13">
            <el-input v-show="dataForm.useCinema==0" ref="useCinemaNameInput" style="margin-left:5px;" v-model="dataForm.useCinemaName" :disabled="!enabledEdit" clearable placeholder="适用影院"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button v-show="dataForm.useCinema==0 && false" style="margin-left:10px;" @click.prevent="showCinemaModel">选择</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="放映日期：" prop="daterange">
          <el-date-picker :disabled="!enabledEdit" clearable v-model="dataForm.daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次占比：" prop="timeRatioUpper">
          <el-row>
            <span style="position:relative;">
              <el-input-number style="width:100px;" ref="timeRatioLowerInput" v-model="dataForm.timeRatioLower" :precision="2" :min="0" :max="100" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
              <span style="position:absolute;right:8px;top:2px;line-height:1;color:#b0b0b0;" slot="suffix">%</span>
            </span>
            <span>--</span>
            <span style="position:relative;">
              <el-input-number style="width:100px;" v-model="dataForm.timeRatioUpper" :precision="2" :min="0" :max="100" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
              <span style="position:absolute;right:8px;top:2px;line-height:1;color:#b0b0b0;" slot="suffix">%</span>
            </span>
          </el-row>
        </el-form-item>
        <el-form-item label="场次数：" prop="timeNumUpper">
          <el-row>
            <span>
              <el-input-number style="width:100px;" ref="timeNumLowerInput" v-model="dataForm.timeNumLower" :precision="0" :min="0" :max="10000" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
            </span>
            <span>--</span>
            <span>
              <el-input-number style="width:100px;" v-model="dataForm.timeNumUpper" :precision="0" :min="0" :max="10000" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
            </span>
          </el-row>
        </el-form-item>
        <el-form-item label="指导类型：" prop="guideType">
          <el-radio-group v-model="dataForm.guideType" :disabled="!enabledEdit" clearable>
            <el-radio :label="1">强制</el-radio>
            <el-radio :label="2">指导</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="enabledEdit">
          <el-button @click="submitForm" :loading="saveLoading" type="primary" :disabled="!enabledEdit || saveLoading">确定</el-button>
          <el-button @click="$router.go(-1);">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <muti-cinema title="选择影院" @close="cinemaDialogVisible=false" :innerData="dataForm.cinemaList" :dialogTableVisible.sync="cinemaDialogVisible" ref="movieSelectDialog" @callBack="handleCinemaDialogCallBack"></muti-cinema>
    <frame-singlefilm @close="singleFilmVisible=false" :framedialogVisible="singleFilmVisible" :whereUse="whereUse" :type="filmtype" :innerData="innerFilmDataSingle" @callBackFilSingle="handleSingleFileCallBack" ref='frameSingleFilm'>
    </frame-singlefilm>
  </div>
</template>

<script type='text/ecmascript-6'>
import MutiCinema from '../../../components/cinema/MutiCinema';
import FrameSinglefilm from '../../../components/film/SingleFilm';
import { getPlayGuideById, savePlayGuide } from 'ctmSrc/http/interface';
import curmbs from '../../../components/crumb';
export default {
  components: {
    MutiCinema,
    FrameSinglefilm,
    curmbs
  },
  data () {
    return {
      scan: 0,  // 0新增 1编辑 2查看
      saveLoading: false,
      dataForm: { movieCode: '', guideType: 1, cinemaList: [], useCinema: 1 },
      rules: {
        movieCode: [
          { required: true, message: '必填项不能为空', trigger: 'change' }
        ],
        useCinema: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
          { validator: this.validUseCinema, trigger: 'blur' }
        ],
        daterange: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        guideType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        timeRatioUpper: [
          { validator: this.validRatioUpper, trigger: 'blur' }
        ],
        timeNumUpper: [
          { validator: this.validTimeNumUpper, trigger: 'blur' }
        ]
      },
      cinemaDialogVisible: false,
      singleFilmVisible: false,
      whereUse: null,
      filmtype: 1, // 传递给 组件的调用的影院类型 属性参数
      innerFilmDataSingle: {},
      address: [{
        name: '排片指导管理',
        path: ''
      },
      {
        name: '查看排片指导',
        path: '',
        active: true
      }
      ]
    };
  },
  created () {
    this.resetPageStatus();
  },
  computed: {
    enabledEdit () {
      return false;
    }
  },
  activated () {
    console.log('activated');
    if (this.dataForm.uid != this.$route.query.uid) {
      this.getDetail();
    }
  },
  mounted () {
    console.log('mounted');
    if (this.$route.query.uid) {
      this.getDetail();
    } else {

    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log('beforeRouteUpdate');
    next();
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter');
    next();
  },
  beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave');
    next();
  },
  methods: {
    validUseCinema (rule, value, callback) {
      let useCinemaName = this.$refs.useCinemaNameInput.value;
      if (value == 0) {
        if (!useCinemaName) {
          callback(new Error('请选择指定影院'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validTimeNumUpper (rule, value, callback) {
      let timeNumLower = this.$refs.timeNumLowerInput.value;
      let timeRatioLower = this.$refs.timeRatioLowerInput.value;
      if (value && timeNumLower) {
        if (timeNumLower > value) {
          callback(new Error('最小场次数不能大于比最大场次数'));
        } else {
          callback();
        }
      } else {
        if (!timeRatioLower) {
          callback(new Error('场次占比和场次数，至少需要填写一项'));
        } else {
          callback();
        }
      }
    },
    validRatioUpper (rule, value, callback) {
      let timeNumLower = this.$refs.timeNumLowerInput.value;
      let timeRatioLower = this.$refs.timeRatioLowerInput.value;
      if (value && timeRatioLower) {
        if (timeRatioLower > value) {
          callback(new Error('最小场次占比的值不能大于比最大场次占比的值'));
        } else {
          callback();
        }
      } else {
        if (!timeNumLower) {
          callback(new Error('场次占比和场次数，至少需要填写一项'));
        } else {
          callback();
        }
      }
    },
    resetPageStatus () {
      if (this.$route.query.uid) {
        if (this.$route.fullPath.indexOf('/scan/') != -1) {
          // 查看页面
          this.scan = 2;
        } else {
          this.scan = 1;
          // 编辑页面
        }
      } else {
        this.scan = 0;
        // 新增
      }
    },
    getDetail () {
      let params = {
        uid: this.$route.query.uid
      };
      console.log(params);
      getPlayGuideById(params)
        .then((ret) => {
          console.log(ret);
          if (ret.code == 200) {
            if (ret.data.timeRatioLower == 0 && ret.data.timeRatioUpper == 0) {
              ret.data.timeRatioLower = undefined;
              ret.data.timeRatioUpper = undefined;
            }

            if (ret.data.timeNumLower == 0 && ret.data.timeNumUpper == 0) {
              ret.data.timeNumLower = undefined;
              ret.data.timeNumUpper = undefined;
            }
            if (ret.data.startDate) {
              ret.data.startDate = this.$moment(ret.data.startDate).format('YYYY-MM-DD');
            }
            if (ret.data.endDate) {
              ret.data.endDate = this.$moment(ret.data.endDate).format('YYYY-MM-DD');
            }
            ret.data.daterange = [ret.data.startDate, ret.data.endDate];
            let cinemaList = ret.data.cinemaList || [];
            ret.data.useCinemaName = '';
            if (cinemaList.length > 0) {
              if (cinemaList.length == 1) {
                ret.data.useCinemaName = cinemaList[0].cinemaName;
              } else {
                ret.data.useCinemaName = cinemaList[0].cinemaName + '等' + cinemaList.length + '家影城';
              }
            } else {
              ret.data.useCinemaName = '';
            }

            cinemaList.forEach(ele => {
              ele.uid = ele.cinemaUid;
              ele.code = ele.cinemaCode;
              ele.fullName = ele.cinemaName;
            });
            ret.data.cinemaList = cinemaList;

            this.dataForm = ret.data;
          }
        }).catch((err) => {
          console.log(err);
          this.$message({
            type: 'info',
            message: err.msg
          });
        });
    },
    submitForm () {
      if (this.dataForm.daterange && this.dataForm.daterange.length == 2) {
        this.dataForm.startDate = this.dataForm.daterange[0];
        this.dataForm.endDate = this.dataForm.daterange[1];
      }
      let cinemaList = [];
      this.dataForm.cinemaList.forEach(ele => {
        cinemaList.push({
          cinemaUid: ele.uid,
          cinemaCode: ele.code,
          cinemaName: ele.fullName,
          uid: ele.uid,
          code: ele.code,
          fullName: ele.fullName
        });
        // ele.cinemaUid=ele.uid,
        // ele.cinemaCode=ele.code,
        // ele.cinemaName=ele.fullName
      });
      this.dataForm.cinemaList = cinemaList;

      console.log(this.dataForm);
      this.$refs['dataForm'].validate(valid => {
        console.log(valid);
        if (valid) {
          console.log('valid');
          console.log(this);
          savePlayGuide(this.dataForm)
            .then((ret) => {
              console.log(ret);
              if (ret.code == 200) {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                });
              } else {
                this.$message({
                  type: 'info',
                  message: ret.msg ? ret.msg : '保存失败！'
                });
              }
            }).catch((err) => {
              this.$message({
                type: 'info',
                message: '保存失败！'
              });
            });
        } else {
          this.$message({
            type: 'info',
            message: '输入错误,请检查您的输入!!!'
          });
        }
      });
    },
    showSingleFilmModel () {
      this.singleFilmVisible = true;
      this.$refs.frameSingleFilm.listAuthCommCinemas();
      // console.log("showSingleFilmModel");
    },
    showCinemaModel () {
      this.cinemaDialogVisible = true;
      this.$refs.movieSelectDialog.getCinemaList();
    },
    handleSingleFileCallBack (opt) {
      this.innerFilmDataSingle = opt.data;
      this.singleFilmVisible = false;
      this.dataForm.movieName = opt.data.movieName;
      this.dataForm.movieCode = opt.data.movieCode;
      console.log(opt);
    },
    handleCinemaDialogCallBack (val) {
      console.log(val);
      this.cinemaDialogVisible = false;
      this.dataForm.cinemaList = val;
      if (val.length > 0) {
        if (val.length == 1) {
          this.dataForm.useCinemaName = val[0].fullName;
        } else {
          this.dataForm.useCinemaName = val[0].fullName + '等' + val.length + '家影城';
        }
      } else {
        this.dataForm.useCinemaName = '';
      }
    }
  }
};
</script>

<style lang='scss' scoped>
$color_disbled: #999;
.play-guide-edit {
  .crumbs {
    margin-left: 10px;
  }
  .form-wrapper {
    width: 600px;
    padding-top: 10px;
  }
  /deep/ input[disabled],
  input:disabled,
  input.disabled {
    color: $color_disbled;
    -webkit-text-fill-color: $color_disbled;
    -webkit-opacity: 1;
    opacity: 1;
  }
  /deep/ .el-cascader.is-disabled .el-cascader__label {
    color: $color_disbled;
  }
  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: $color_disbled;
  }
  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    color: $color_disbled;
  }
  // /deep/ .el-radio__input.is-disabled.is-checked .el-radio__inner {
  //   color: $color_disbled;
  //   border-color: $color_disbled;
  // }
  // /deep/ .el-radio__input.is-disabled .el-radio__inner {
  //   border-color: $color_disbled;
  // }
}
</style>