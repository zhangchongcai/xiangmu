/*
* Description:
* Author:
* Update:
*/
<template>
  <div class="ctm play-guide-edit">
    <!-- <div class="crumbs">
      <curmbs :address="address"></curmbs>
    </div> -->
    <div class="form-wrapper">

      <el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="submitForm()" label-width="120px">
        <el-form-item label="影片名称：" prop="movieCode">
          <el-col :span="20">
            <el-input v-model="dataForm.movieName" :disabled="scan!=0" clearable placeholder="影片名称"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button v-if="scan==0" plain type="primary" style="margin-left:5px;" @click.prevent="showSingleFilmModel">选择</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="适用影院：" prop="useCinema">
          <el-col :span="7">
            <el-select v-model="dataForm.useCinema" placeholder="请选择">
              <el-option label="全部" :value="1"></el-option>
              <el-option label="指定影院" :value="0"></el-option>
            </el-select>
          </el-col>
          <el-col :span="13">
            <el-input v-show="dataForm.useCinema==0" ref="useCinemaNameInput" style="margin-left:5px;" :readonly="true" v-model="dataForm.useCinemaName" :disabled="!enabledEdit" placeholder="适用影院"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button plain type="primary" v-show="dataForm.useCinema==0" style="margin-left:10px;" @click.prevent="showCinemaModel">选择</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="放映日期：" prop="daterange">
          <el-date-picker :disabled="!enabledEdit" clearable v-model="dataForm.daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次占比：" prop="timeRatioUpper">
          <el-row>
            <span style="position:relative;">
              <el-input-number style="width:160px;" @change="validTimeNumber" ref="timeRatioLowerInput" v-model="dataForm.timeRatioLower" :precision="2" :min="0" :max="100" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
              <span style="position:absolute;right:8px;top:2px;line-height:1;color:#b0b0b0;" slot="suffix">%</span>
            </span>
            <span class="m-h-5">至</span>
            <span style="position:relative;">
              <el-input-number style="width:160px;" @change="validTimeNumber" v-model="dataForm.timeRatioUpper" :precision="2" :min="0" :max="100" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
              <span style="position:absolute;right:8px;top:2px;line-height:1;color:#b0b0b0;" slot="suffix">%</span>
              <!-- <div class="ratio-number-tip">
                <div>
                  占比数或场次数，至少填写一种，占比和场次同时填写，则同时判断
                </div>
              </div> -->
            </span>
          </el-row>
        </el-form-item>
        <el-form-item label="场次数：" prop="timeNumUpper">
          <el-row>
            <span>
              <el-input-number style="width:160px;" @change="validTimeRatioUpper" ref="timeNumLowerInput" v-model="dataForm.timeNumLower" :precision="0" :min="0" :max="10000" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
            </span>
            <span class="m-h-5">至</span>
            <span>
              <el-input-number style="width:160px;" @change="validTimeRatioUpper" v-model="dataForm.timeNumUpper" :precision="0" :min="0" :max="10000" :disabled="!enabledEdit" :controls="false" clearable placeholder="">
              </el-input-number>
            </span>
            <div class="ratio-number-tip">
              <div>
                占比数或场次数，至少填写一种，占比和场次同时填写，则同时判断
              </div>
            </div>
          </el-row>
        </el-form-item>
        <el-form-item label="指导类型：" prop="guideType">
          <el-radio-group v-model="dataForm.guideType" :disabled="!enabledEdit" clearable>
            <el-radio :label="1">强制</el-radio>
            <el-radio :label="2">指导</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="enabledEdit" class="btn-wrapper">
      <el-button class="w-80" @click="submitForm" :loading="saveLoading" type="primary" :disabled="!enabledEdit || saveLoading">确定</el-button>
      <el-button class="w-80" @click="$router.go(-1);">取消</el-button>
    </div>
    <muti-cinema title="选择影院" v-if="cinemaDialogVisible" @close="cinemaDialogVisible=false" :innerData="dataForm.cinemaList" :dialogTableVisible.sync="cinemaDialogVisible" ref="movieSelectDialog" @callBack="handleCinemaDialogCallBack"></muti-cinema>
    <frame-singlefilm v-if="singleFilmVisible" @close="singleFilmVisible=false" :framedialogVisible="singleFilmVisible" :whereUse="whereUse" :type="filmtype" :innerData="innerFilmDataSingle" @callBackFilSingle="handleSingleFileCallBack" ref='frameSingleFilm'>
    </frame-singlefilm>
  </div>
</template>

<script type='text/ecmascript-6'>
import MutiCinema from '../../../components/cinema/MutiCinema';
import FrameSinglefilm from '../../../components/film/SingleFilm'
import { getPlayGuideById, savePlayGuide } from 'ctm/http/interface'
import mixins from 'src/frame_cpm/mixins/cacheMixin.js'
import curmbs from '../../../components/crumb';
export default {
  mixins: [mixins.cacheMixin],
  components: {
    MutiCinema,
    FrameSinglefilm,
    curmbs
  },
  data () {
    return {
      address: [{
        name: "排片指导管理",
        path: ""
      },
      {
        name: this.$route.query.uid ? '编辑排片指导' : '新建排片指导',
        path: "",
        active: true
      }
      ],
      cacheField: ["dataForm"],
      saveLoading: false,
      scan: 0,  //0新增 1编辑 2查看
      dataForm: { movieCode: "", guideType: 1, cinemaList: [], useCinema: 1 },
      rules: {
        movieCode: [
          { required: true, message: '必填项不能为空', trigger: 'change' }
        ],
        useCinema: [
          { required: true, message: '必填项不能为空', trigger: 'change' },
          { validator: this.validUseCinema, trigger: 'change' }
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
    }
  },
  created () {
    this.resetPageStatus();
  },
  activated () {
    console.log("activated");
    if (this.dataForm.uid != this.$route.query.uid) {
      this.getDetail();
    }
  },
  computed: {
    enabledEdit () {
      if (this.scan != 2) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    console.log("mounted");
    if (this.dataForm.uid != this.$route.query.uid) {
      this.getDetail();
    } else {

    }
  },
  methods: {
    resetForm () {
      this.dataForm = { movieCode: "", guideType: 1, cinemaList: [], useCinema: 1, daterange: [] };
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
      })
    },
    validTimeNumber (val) {
      console.log(val);
      if (val !== undefined) {
        this.$nextTick(() => {
          this.$refs.dataForm.validateField('timeNumUpper');
        })
      }
    },
    validTimeRatioUpper (val) {
      if (val !== undefined) {
        this.$nextTick(() => {
          this.$refs.dataForm.validateField('timeRatioUpper');
        })
      }
    },
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
      // console.log(value);
      if (value !== undefined && timeNumLower !== undefined) {
        if (timeNumLower > value) {
          callback(new Error('最小场次数不能大于比最大场次数'));
        } else {
          if (timeNumLower == 0 && value == 0) {
            callback(new Error('最小场次数和最大场次数不能同时为0'));
          } else {
            callback();
          }
          // this.$refs.dataForm.validateField('timeRatioUpper');
        }
      } else {
        if (timeRatioLower === undefined) {
          callback(new Error('场次占比和场次数，至少需要填写一项'));
        } else {
          callback();
        }
      }
    },
    validRatioUpper (rule, value, callback) {
      let timeNumLower = this.$refs.timeNumLowerInput.value;
      let timeRatioLower = this.$refs.timeRatioLowerInput.value;
      // console.log(value);
      if (value !== undefined && timeRatioLower !== undefined) {
        if (timeRatioLower > value) {
          callback(new Error('最小场次占比的值不能大于比最大场次占比的值'));
        } else {
          if (timeRatioLower == 0 && value == 0) {
            callback(new Error('最小场次占比的值和最大场次占比的值不能同时为0'));
          } else {
            callback();
          }
          // this.$refs.dataForm.validateField('timeNumUpper');
        }
      } else {
        if (timeNumLower === undefined) {
          callback(new Error('场次占比和场次数，至少需要填写一项'));
        } else {
          // this.$refs['dataForm'].validate(valid => {});
          callback();
        }
      }
    },
    resetPageStatus () {
      if (this.$route.query.uid) {
        if (this.$route.fullPath.indexOf("/scan/") != -1) {
          //查看页面
          this.scan = 2;
        } else {
          this.scan = 1;
          //编辑页面
        }
      } else {
        this.scan = 0;
        //新增
      }
    },
    getDetail () {
      let params = {
        uid: this.$route.query.uid
      }
      console.log(params);
      getPlayGuideById(params)
        .then((ret) => {
          console.log(ret);
          if (ret.code == 200) {
            if (!ret.data.timeRatioLower && !ret.data.timeRatioUpper) {
              ret.data.timeRatioLower = undefined;
              ret.data.timeRatioUpper = undefined;
            }
            if (!ret.data.timeNumLower && !ret.data.timeNumUpper) {
              ret.data.timeNumLower = undefined;
              ret.data.timeNumUpper = undefined;
            }

            if (ret.data.startDate) {
              ret.data.startDate = this.$moment(ret.data.startDate).format("YYYY-MM-DD")
            }
            if (ret.data.endDate) {
              ret.data.endDate = this.$moment(ret.data.endDate).format("YYYY-MM-DD")
            }
            ret.data.daterange = [ret.data.startDate, ret.data.endDate];
            let cinemaList = ret.data.cinemaList || [];
            ret.data.useCinemaName = "";
            if (cinemaList.length > 0) {
              if (cinemaList.length == 1) {
                ret.data.useCinemaName = cinemaList[0].cinemaName
              } else {
                ret.data.useCinemaName = cinemaList[0].cinemaName + "等" + cinemaList.length + "家影城"
              }
            } else {
              ret.data.useCinemaName = ""
            }
            cinemaList.forEach(ele => {
              ele.uid = ele.cinemaUid;
              ele.code = ele.cinemaCode;
              ele.fullName = ele.cinemaName;
            });
            ret.data.cinemaList = cinemaList;
            console.log(ret.data);
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
      this.saveLoading = true;
      if (this.dataForm.daterange && this.dataForm.daterange.length == 2) {
        this.dataForm.startDate = this.dataForm.daterange[0];
        this.dataForm.endDate = this.dataForm.daterange[1];
      }
      let cinemaList = [];
      if (this.dataForm.cinemaList && this.dataForm.cinemaList.length > 0) {
        this.dataForm.cinemaList.forEach(ele => {
          cinemaList.push({
            cinemaUid: ele.uid,
            cinemaCode: ele.code,
            cinemaName: ele.fullName,
            uid: ele.uid,
            code: ele.code,
            fullName: ele.fullName
          })
          // ele.cinemaUid=ele.uid,
          // ele.cinemaCode=ele.code,
          // ele.cinemaName=ele.fullName
        });
      }
      this.dataForm.cinemaList = cinemaList;
      console.log(this.dataForm);
      this.$refs['dataForm'].validate(valid => {
        console.log(valid);
        if (valid) {
          console.log("valid");
          // console.log(this);
          savePlayGuide(this.dataForm)
            .then((ret) => {
              this.saveLoading = false;
              console.log(ret);
              if (ret.code == 200) {
                this.$message({
                  type: 'info',
                  message: '保存成功！'
                });
                if (this.scan == 0) {
                  this.resetForm();
                }
                this.$router.push({
                  path: "./list"
                });

              } else {
                this.$message({
                  type: 'info',
                  message: ret.msg ? ret.msg : '保存失败！'
                });
              }
            }).catch((err) => {
              this.saveLoading = false;
              this.$message({
                type: 'info',
                message: '保存失败！'
              });
            });
        } else {
          this.saveLoading = false;
          this.$message({
            type: 'success',
            message: '输入错误,请检查您的输入!!!'
          });
        }
      })
    },
    showSingleFilmModel () {
      this.singleFilmVisible = true;
      // this.$refs.frameSingleFilm.listAuthCommCinemas()
      // console.log("showSingleFilmModel");
    },
    showCinemaModel () {
      this.cinemaDialogVisible = true;
      // this.$refs.movieSelectDialog.getCinemaList();
    },
    handleSingleFileCallBack (opt) {
      this.innerFilmDataSingle = opt.data
      this.singleFilmVisible = false;
      this.dataForm.movieName = opt.data.movieName
      this.dataForm.movieCode = opt.data.movieCode
      console.log(opt);
    },
    handleCinemaDialogCallBack (val) {
      console.log(val);
      this.cinemaDialogVisible = false;
      this.dataForm.cinemaList = val;
      if (val.length > 0) {
        if (val.length == 1) {
          this.dataForm.useCinemaName = val[0].fullName
        } else {
          this.dataForm.useCinemaName = val[0].fullName + "等" + val.length + "家影城"
        }
      } else {
        this.dataForm.useCinemaName = ""
      }
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('useCinema');
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.play-guide-edit {
  /deep/ .el-form.el-form--inline .el-form-item {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  /deep/ .el-form {
    .el-form-item__label {
      font-size: 12px;
    }
    .el-input__inner {
      font-size: 12px;
    }
    .el-radio__label {
      font-size: 12px;
    }
    .el-form-item {
      margin-right: 32px;
      margin-bottom: 16px;
    }
  }
  .crumbs {
    margin-left: 10px;
  }
  .form-wrapper {
    width: 600px;
    padding-top: 10px;
  }
  .ratio-number-tip {
    // position: absolute;
    // left: 130px;
    // top: 20px;
    // width: 250px;
    line-height: 1.8;
    color: #606266;
  }
  .btn-wrapper {
    text-align: center;
    margin-top: 15px;
  }
  /deep/ .el-date-editor .el-range__icon {
    line-height: 24px;
  }
  /deep/ .el-date-editor .el-range-separator {
    line-height: 24px;
    padding: 0;
  }

  /deep/ .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #bcbcbc;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f5f5;
  }
}
</style>