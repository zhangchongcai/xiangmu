<template>
  <div class="film-edit-wrap">
    <div class="film-edit-content">
      <el-collapse v-model="activeNames">
        <el-form :rules="rules" ref="ruleForm" :model="sizeForm" label-width="85px" size="small" inline>
          <el-collapse-item title="基础信息" name="1">
            <div class="basic-info">
              <div>
                <el-form-item label="影片名称：" prop="movieName">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieName}}
                  </span>
                </el-form-item>

                <el-form-item label="影片编码：" prop="movieCode">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieCode}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="影片英文：" prop="movieenglishname">
                  <el-input v-model="sizeForm.movieenglishname"></el-input>
                </el-form-item>

                <el-form-item label="影片别名：" prop="movieothername">
                  <el-input v-model="sizeForm.movieothername"></el-input>
                </el-form-item>

              </div>
              <div>
                <el-form-item label="影片语言：" prop="movieLanguageList">
                  <el-select v-model="sizeForm.movieLanguageList" placeholder="请选择" multiple @change="selectFilmLanguageFun()">
                    <template>
                      <el-option v-for="(item,index) in optionFilmLanguageList" :key="index" :label="item.propertyName" :value="item.propertyValue"></el-option>
                    </template>

                  </el-select>
                </el-form-item>

                <el-form-item label="影片产地：" prop="movieArea">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieArea}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="发行版本：" prop="disVersion">
                  <span class="download-film-scan-text">
                    {{sizeForm.disVersion}}
                  </span>
                </el-form-item>

                <el-form-item label="影片级别：" prop="movieLevel">
                  <el-select v-model="sizeForm.movieLevel" placeholder="请选择">
                    <el-option v-for="(item,index) in optionFilmLevelList" :key='index' :label="item.propertyName" :value="item.propertyValue"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="影片分类：" prop="movieClass">
                  <el-select v-model="sizeForm.movieClass" placeholder="请选择">
                    <el-option v-for="(item,index) in optionFilmTypeList" :key='index' :label="item.propertyName" :value="item.propertyValue"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="影片时长：" prop="timeLong">
                  <div class="input-edit-wrap">
                    <el-input v-model="sizeForm.timeLong" @change="timeLongChange(sizeForm.timeLong)"></el-input>
                  </div><span style="font-size:12px;color:#666666;margin-left:5px">分钟</span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="影片字幕：" prop="filmCaption">
                  <el-select v-model="sizeForm.filmCaption" placeholder="请选择影片字幕">
                    <el-option v-for="(item,index) in optionFilmSubtitlesList" :key='index' :label="item.propertyName" :value="item.propertyValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公映日期：" prop="datePublicShow">
                  <span class="download-film-scan-text" v-if='sizeForm.datePublicShow'>
                    {{sizeForm.datePublicShow.substring(0,10)}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="首映日期：" prop="dateShowFirst">
                  <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="sizeForm.dateShowFirst" style="width: 100%;" @change="changeMinPriceStartTimeFun"></el-date-picker>
                </el-form-item>
                <el-form-item label="下映日期：" prop="dateShowOff">
                  <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="sizeForm.dateShowOff" style="width: 100%;" @change="changeMinPriceEndtTimeFun"></el-date-picker>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="帧数：" prop="frameNumber">
                  <el-select v-model="sizeForm.frameNumber" placeholder="请选择帧数">
                    <el-option label="24" value="24"></el-option>
                    <el-option label="48" value="48"></el-option>
                    <el-option label="120" value="120"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发行商：" prop="publisher">
                  <el-input v-model="sizeForm.publisher"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="制作人：" prop="movieMaker">
                  <el-input v-model="sizeForm.movieMaker"></el-input>
                </el-form-item>
                <el-form-item label="导演：" prop="movieDirect">
                  <el-input v-model="sizeForm.movieDirect"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="演员：" prop="movieActor">
                  <el-input v-model="sizeForm.movieActor"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item class="textarea-item" label="简介：" prop="movieDesc">
                  <el-input type="textarea" v-model="sizeForm.movieDesc"></el-input>
                </el-form-item>
              </div>

            </div>
          </el-collapse-item>
          <el-collapse-item title="分账信息" name="3">
            <div class="basic-info">
              <div class="separate-accounts-wrap">

                <div>
                  <el-form-item prop="dateShowFirst" label-width="0px">
                    <div class="f-12 label-color">
                      <span class="valid-color">* </span>
                      <span class="c-s-title f-w-b">A类城市（{{movieAreaGradeVo.areaGradeListA?movieAreaGradeVo.areaGradeListA.length:""}}）：</span>
                      <el-tooltip popper-class="w-400" class="item" effect="dark" :content="movieAreaGradeVo.areaA || ''" placement="bottom">
                        <span class="c-s-title f-w-b">{{movieAreaGradeVo.areaAStr || ""}}</span>
                      </el-tooltip>
                      <span class="m-l-15 c-primary cur-p" @click="editCitys('A')">编辑</span>
                    </div>
                    <div v-for="(item,index) in priceListA" class="m-l-19 m-t-8" :key="index">
                      <div class="separate-accounts-price">
                        <span>最低票价：</span>
                        <el-input size="small" v-model="item.minPrice" @change="priceGradeChange(priceListA,item.minPrice,index)"></el-input>
                        <span>元 ，</span>
                      </div>

                      <div class="separate-accounts-date">
                        <span>日期</span>
                        <el-date-picker disabled v-model="item.dateStart" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                        </el-date-picker>
                        <el-date-picker @change="priceDateEndGradeFun($event,index,priceListA)" :disabled="index == priceListA.length*1-1" v-model="item.dateEnd" value-format="yyyy-MM-dd" type="date" @focus="pickerOptionsFun(priceListA,'pickerOptionsA',index)" :picker-options="pickerOptionsA" placeholder="选择日期">
                        </el-date-picker>
                      </div>
                      <span class="delete" @click="deleGradeMinPrice(priceListA,index)" v-if="priceListA.length >1">删除</span>
                    </div>
                    <div class="no-info" v-if="priceListA.length==0">
                      暂无
                    </div>
                    <span class="add m-l-80" @click="addGradeMinPrice(priceListA)"><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                  </el-form-item>
                </div>

                <div>
                  <el-form-item prop="dateShowFirst" label-width="0px">
                    <div class="f-12 label-color">
                      <span class="valid-color">* </span>
                      <span class="c-s-title f-w-b">B类城市（{{movieAreaGradeVo.areaGradeListB?movieAreaGradeVo.areaGradeListB.length:""}}）：</span>
                      <el-tooltip popper-class="w-400" class="item" effect="dark" :content="movieAreaGradeVo.areaB || ''" placement="bottom">
                        <span class="c-s-title f-w-b">{{movieAreaGradeVo.areaBStr || ""}}</span>
                      </el-tooltip>
                      <span @click="editCitys('B')" class="m-l-15 c-primary cur-p">编辑</span>
                    </div>
                    <div v-for="(item,index) in priceListB" class="m-l-19 m-t-8" :key="index">
                      <div class="separate-accounts-price">
                        <span>最低票价：</span>
                        <el-input size="small" v-model="item.minPrice" @change="priceGradeChange(priceListB,item.minPrice,index)"></el-input>
                        <span>元 ，</span>
                      </div>

                      <div class="separate-accounts-date">
                        <span>日期</span>
                        <el-date-picker disabled v-model="item.dateStart" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                        </el-date-picker>
                        <el-date-picker @change="priceDateEndGradeFun($event,index,priceListB)" :disabled="index == priceListB.length*1-1" v-model="item.dateEnd" value-format="yyyy-MM-dd" type="date" @focus="pickerOptionsFun(priceListB,'pickerOptionsB',index)" :picker-options="pickerOptionsB" placeholder="选择日期">
                        </el-date-picker>
                      </div>
                      <span class="delete" @click="deleGradeMinPrice(priceListB,index)" v-if="priceListB.length >1">删除</span>
                    </div>
                    <div class="no-info" v-if="priceListB.length==0">
                      暂无
                    </div>
                    <span class="add m-l-80" @click="addGradeMinPrice(priceListB)"><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                  </el-form-item>
                </div>

                <div>
                  <el-form-item prop="dateShowFirst" label-width="0px">
                    <div class="f-12 label-color">
                      <span class="valid-color">* </span>
                      <span class="c-s-title f-w-b">C类城市：</span>
                      <span class="c-s-title f-w-b">除A类 B类所有城市外默认都归为C类</span>
                    </div>
                    <div v-for="(item,index) in priceListC" class="m-l-19 m-t-8" :key="index">
                      <div class="separate-accounts-price">
                        <span>最低票价：</span>
                        <el-input size="small" v-model="item.minPrice" @change="priceGradeChange(priceListC,item.minPrice,index)"></el-input>
                        <span>元 ，</span>
                      </div>

                      <div class="separate-accounts-date">
                        <span>日期</span>
                        <el-date-picker disabled v-model="item.dateStart" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                        </el-date-picker>
                        <el-date-picker @change="priceDateEndGradeFun($event,index,priceListC)" :disabled="index == priceListC.length*1-1" v-model="item.dateEnd" value-format="yyyy-MM-dd" type="date" @focus="pickerOptionsFun(priceListC,'pickerOptionsC',index)" :picker-options="pickerOptionsC" placeholder="选择日期">
                        </el-date-picker>
                      </div>
                      <span class="delete" @click="deleGradeMinPrice(priceListC,index)" v-if="priceListC.length >1">删除</span>
                    </div>
                    <div class="no-info" v-if="priceListC.length==0">
                      暂无
                    </div>
                    <span class="add m-l-80" @click="addGradeMinPrice(priceListC)"><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                  </el-form-item>
                </div>

                <!-- <div>
                  <el-form-item
                    label="最低票价："
                    prop="dateShowFirst"
                  >
                    <div
                      v-for="(item,index) in priceList"
                      style="margin-top:8px;"
                      :key="index"
                    >
                      <div class="separate-accounts-price">
                        <el-input
                          size="small"
                          v-model="item.minPrice"
                          @change="priceChange(item.minPrice,index)"
                        ></el-input>
                        <span>元 ，</span>
                      </div>

                      <div class="separate-accounts-date">
                        <span>日期</span>
                        <el-date-picker
                          disabled
                          v-model="item.dateStart"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        >
                        </el-date-picker>
                        <el-date-picker
                          @change="priceDateEndFun($event,index)"
                          :disabled="index == priceList.length*1-1"
                          v-model="item.dateEnd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          @focus='priceChangePickerOptionsFun(index)'
                          :picker-options="pickerOptions"
                          placeholder="选择日期"
                        >
                        </el-date-picker>
                      </div>
                      <span
                        class="delete"
                        @click="deleMinPrice(index)"
                        v-if="priceList.length >1"
                      >删除</span>
                    </div>
                    <div
                      class="no-info"
                      v-if="priceList.length==0"
                    >
                      暂无
                    </div>
                    <span
                      class="add"
                      @click="addMinPrice()"
                    ><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                  </el-form-item>
                </div> -->

                <el-form-item prop="dateShowFirst" label-width="0px">
                  <div class="f-12 label-color">
                    <span class="valid-color">* </span>
                    <span class="c-s-title f-w-b">发行方分账：</span>
                  </div>
                  <div v-for="(item,index) in rateList" class="m-l-79 m-t-8" :key='index'>
                    <div class="separate-accounts-price rate">
                      <el-input size="small" v-model="item.rate" @change="accountChange(item.rate,index)"></el-input>
                      <span>% ，</span>
                    </div>

                    <div class="separate-accounts-date">
                      <span>日期</span>
                      <el-date-picker v-model="item.dateStart" disabled type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                      </el-date-picker>
                      <el-date-picker v-model="item.dateEnd" @change="accountDateEndFun($event,index)" :disabled="index == rateList.length*1-1" type="date" :picker-options="pickerOptions" @focus='rateChangePickerOptionsFun(index)' value-format="yyyy-MM-dd" placeholder="选择日期">
                      </el-date-picker>
                    </div>
                    <span class="delete" @click="deleAccounts(index)" v-if="rateList.length >1">删除</span>
                  </div>
                  <div class="no-info" v-if="rateList.length==0">
                    暂无
                  </div>
                  <span class="add m-l-79" @click="addAccount()"><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                </el-form-item>
              </div>
            </div>
          </el-collapse-item>
        </el-form>
      </el-collapse>
      <div class="more-info" @click="moreInfoChange()">
        更多信息...
      </div>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button type="primary" @click="onSubmit('ruleForm')">保存</el-button>
          <el-button @click="cancelFun">返回</el-button>
        </div>

      </div>
    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    <TableSelect :formItems="formItems" nameKey="areaName" rowKey="areaCode" :request="requestApi" :columns="brandColumns" :multiSelect="true" title="修改城市级别分类" :modelVisible="modelVisible" @close="modelVisible=false" @select="selectedTable" :defaultSelectRows="defaultSelectRows" />
  </div>
</template>
<script>
import FixStepTool from 'ctmSrc/components/fix-step-tool/fix-step-tool';
import TableSelect from 'ctmSrc/components/TableSelect/TableSelect';
import fixStepMixin from 'ctmSrc/mixins/fixStepTool';
import { fetchCitySortList, queryAreatList, saveCitySortList } from 'ctmSrc/http/interface';

export default {
  data () {
    return {
      formItems: [
        {          label: '所在城市：',
          prop: 'provinceCode',
          prop1: 'cityCode',
          type: 'divider-cascader',
          options: 'divider-area',
          options1: [],
          props: { disabled: false, props: { value: 'areaCode', label: 'areaName' }, level: 2 }        }
      ],
      defaultSelectRows: [],
      currentGrade: '',
      brandColumns: [
        { label: '城市名称', prop: 'areaName' }
      ],
      requestApi: queryAreatList,
      modelVisible: false,
      movieAreaGradeVo: {},
      sum: 1,
      accountSum: 1,
      priceItem: {
        dateEnd: '',
        dateStart: '',
        minPrice: '0'
      },
      accountItem: {
        dateEnd: '',
        dateStart: '',
        rate: '0'
      },
      noDatadialogVisible: false,
      activeNames: ['1', '2', '3'],
      sizeForm: {
        movieName: '',
        disVersion: '',
        movieCode: '',
        movieArea: '',
        movieClass: '',
        frameNumber: '',
        timeLong: '',
        dateShowFirst: '',
        dateShowOff: '',
        filmCaption: '',
        movieLevel: '',
        publisher: '',
        movieMaker: '',
        movieActor: '',
        movieDirect: '',
        movieDesc: '',
        // 自己定义字段
        movieDescLanguage: '',
        movieLanguageList: [],
        movieenglishname: '',
        movieothername: '',
        movieOtherActor: '',
        // 交互部分
        activeNames: ['3'],
        dialogImageUrl: '',
        dialogVisible: false
      },
      movieLanguageList: [],
      moviedesclanguages: [],
      // 字典系列
      optionFilmLanguageList: [],
      optionFilmLevelList: [],
      optionFilmSubtitlesList: [],
      optionFilmTypeList: [],
      priceList: [],
      priceListA: [],
      priceListB: [],
      priceListC: [],
      rateList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      pickerOptionsA: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      pickerOptionsB: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      pickerOptionsC: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [
          {
            name: '基础信息',
            isactive: false
          },
          {
            name: '分账信息',
            isactive: false
          }
        ]
      },
      rules: {
        timeLong: [
          { required: true, message: '请输入电影时长', trigger: 'blur' }
        ],
        dateShowFirst: [
          { required: true, message: '请输入首映日期', trigger: 'blur' }
        ],
        dateShowOff: [
          { required: true, message: '请输入下映日期', trigger: 'blur' }
        ],
        movieLanguageList: [
          { required: true, message: '请选择影片语言', trigger: 'blur' }
        ]
        // movieDirect: [
        //   { required: true, message: '请输入影片导演', trigger: 'blur' },
        //   { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
        // ],
      }
    };
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool,
    TableSelect
  },
  methods: {
    editCitys (grade) {
      // console.log(grade);
      this.currentGrade = grade;
      if (grade == 'A') {
        this.defaultSelectRows = this.movieAreaGradeVo.areaGradeListA || [];
      } else if (grade == 'B') {
        this.defaultSelectRows = this.movieAreaGradeVo.areaGradeListB || [];
      }
      // this.defaultSelectRows = row.areaList || [];
      this.modelVisible = true;
    },

    async selectedTable (val) {
      // console.log(val);
      if (this.currentGrade == 'A') {
        this.movieAreaGradeVo.areaGradeListA = val;
        let tempArr = [];
        this.movieAreaGradeVo.areaGradeListB.forEach(item => {
          let elItem = this.movieAreaGradeVo.areaGradeListA.find(el => {
            return item.areaCode === el.areaCode;
          });
          if (!elItem) {
            tempArr.push(item);
          }
        });
        // console.log(tempArr);
        this.movieAreaGradeVo.areaGradeListB = tempArr;
      } else if (this.currentGrade == 'B') {
        this.movieAreaGradeVo.areaGradeListB = val;
        let tempArr = [];
        this.movieAreaGradeVo.areaGradeListA.forEach(item => {
          let elItem = this.movieAreaGradeVo.areaGradeListB.find(el => {
            return item.areaCode === el.areaCode;
          });
          if (!elItem) {
            tempArr.push(item);
          }
        });
        // console.log(tempArr);
        this.movieAreaGradeVo.areaGradeListA = tempArr;
      }

      let arr = this.movieAreaGradeVo.areaGradeListA;
      let str = '';
      if (arr && arr.length > 0) {
        arr.forEach((item, index) => {
          if (index != arr.length - 1) {
            str = str + item.areaName + ',';
          } else {
            str = str + item.areaName;
          }
        });
        this.movieAreaGradeVo.areaAStr = str + '共' + arr.length + '个城市';
        this.movieAreaGradeVo.areaA = str;
        if (arr.length > 4) {
          this.movieAreaGradeVo.areaAStr = arr[0].areaName + ',' + arr[1].areaName + ',' + arr[2].areaName + ',' + arr[3].areaName + '共' + arr.length + '个城市';
        }
      }

      arr = this.movieAreaGradeVo.areaGradeListB;
      str = '';
      if (arr && arr.length > 0) {
        arr.forEach((item, index) => {
          if (index != arr.length - 1) {
            str = str + item.areaName + ',';
          } else {
            str = str + item.areaName;
          }
        });
        this.movieAreaGradeVo.areaBStr = str + '共' + arr.length + '个城市';
        this.movieAreaGradeVo.areaB = str;
        if (arr.length > 4) {
          this.movieAreaGradeVo.areaBStr = arr[0].areaName + ',' + arr[1].areaName + ',' + arr[2].areaName + ',' + arr[3].areaName + '共' + arr.length + '个城市';
        }
      }
    },
    moreInfoChange () {
      // 有数据再跳转
      if (!this.getInfo()) {
        this.$message({
          message: '暂无更多信息',
          type: 'warning'
        });
        return;
      }
      this.$router.push({
        path: '/sys/filmDetail',
        query: {
          code: this.sizeForm.movieCode
        }
      });
    },
    getInfo () {
      let idCache = this.sizeForm.movieCode;
      this.$cpmList
        .getByCode({ code: idCache })
        .then((ret) => {
          if (ret.code === 200 && ret.data.id) {
            this.noDatadialogVisible = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      return this.noDatadialogVisible;
    },
    // 修改最低票价时间配置项禁用
    pickerOptionsFun (priceList, pickerOptions, index) {
      // let _this = this
      console.log('pickerOptionsFun');

      let date_A = new Date(priceList[index].dateStart);
      let date_B = new Date(priceList[index + 1].dateEnd);
      date_B.setTime(date_B.getTime() - 3600 * 1000 * 24);
      this[pickerOptions] = {
        disabledDate (time) {
          return !(time.getTime() < date_B && time.getTime() >= date_A);
        }
      };
    },
    // 修改最低票价时间配置项禁用
    priceChangePickerOptionsFun (index) {
      let _this = this;
      let date_A = new Date(_this.priceList[index].dateStart);
      let date_B = new Date(_this.priceList[index + 1].dateEnd);
      date_B.setTime(date_B.getTime() - 3600 * 1000 * 24);
      this.pickerOptions = {
        disabledDate (time) {
          return !(time.getTime() < date_B && time.getTime() >= date_A);
        }
      };
    },
    // 修改分账比例的时间配置禁用
    rateChangePickerOptionsFun (index) {
      let _this = this;
      let date_A = new Date(_this.rateList[index].dateStart);
      let date_B = new Date(_this.rateList[index + 1].dateEnd);
      date_B.setTime(date_B.getTime() - 3600 * 1000 * 24);
      this.pickerOptions = {
        disabledDate (time) {
          return !(time.getTime() < date_B && time.getTime() >= date_A);
        }
      };
    },
    priceGradeChange (priceList, val, index) {
      let newVal = parseFloat(val);
      console.log('newVal:', newVal);
      if (newVal < 0) {
        priceList[index].minPrice = 0;
        return;
      }
      priceList[index].minPrice = newVal || '';
      console.log(' this.priceList[index].minPrice:', priceList[index].minPrice);
    },
    priceChange (val, index) {
      let newVal = parseFloat(val);
      console.log('newVal:', newVal);
      if (newVal < 0) {
        this.priceList[index].minPrice = 0;
        return;
      }
      this.priceList[index].minPrice = newVal || '';
      console.log(' this.priceList[index].minPrice:', this.priceList[index].minPrice);
    },
    accountChange (val, index) {
      let newVal = parseFloat(val);
      if (newVal < 0) {
        this.rateList[index].rate = 0;
        return;
      }
      this.rateList[index].rate = newVal || '';
    },
    timeLongChange (val) {
      let newVal = parseFloat(val);
      if (newVal < 0) {
        this.sizeForm.timeLong = 0;
        return;
      }
      this.sizeForm.timeLong = newVal || '';
    },
    // 计算日期差天数
    getTime2Time ($time1, $time2) {
      var time1 = arguments[0], time2 = arguments[1];
      time1 = Date.parse(time1) / 1000;
      time2 = Date.parse(time2) / 1000;
      var time_ = time1 - time2;
      return (time_ / (3600 * 24));
    },
    // 修改下个日期起始日期
    priceDateEndGradeFun ($event, index, priceList) {
      if (priceList.length <= 1) {

      } else {
        priceList[index + 1].dateStart = this.nowDayAddOneFun($event, 1);
      }
    },
    // 修改下个日期起始日期
    priceDateEndFun ($event, index) {
      if (this.priceList.length <= 1) {

      } else {
        this.priceList[index + 1].dateStart = this.nowDayAddOneFun($event, 1);
      }
    },
    accountDateEndFun ($event, index) {
      if (this.rateList.length <= 1) {

      } else {
        this.rateList[index + 1].dateStart = this.nowDayAddOneFun($event, 1);
      }
    },
    // 首映日期改变最低票价启始时间
    changeMinPriceStartTimeFun (val) {
      let self = this;
      self.priceList[0].dateStart = val;
      self.rateList[0].dateStart = val;
      self.priceListA[0].dateStart = val;
      self.priceListB[0].dateStart = val;
      self.priceListC[0].dateStart = val;
      self.sum = 1;
      self.accountSum = 1;
    },
    // 下映日期改变最低票价启始时间
    changeMinPriceEndtTimeFun (val) {
      let self = this;
      self.priceList[self.priceList.length - 1].dateEnd = val;
      self.rateList[self.rateList.length - 1].dateEnd = val;
      self.priceListA[self.priceListA.length - 1].dateEnd = val;
      self.priceListB[self.priceListB.length - 1].dateEnd = val;
      self.priceListC[self.priceListC.length - 1].dateEnd = val;
      self.sum = 1;
      self.accountSum = 1;
    },
    // 新增最低票价和分账比列
    addGradeMinPrice (priceList) {
      let self = this;
      if (!self.sizeForm.dateShowFirst) {
        this.$message({
          message: '上映日期不能为空',
          type: 'warning'
        });
        return;
      }
      if (!self.sizeForm.dateShowOff) {
        this.$message({
          message: '下映日期不能为空',
          type: 'warning'
        });
        return;
      }
      let item = {
        dateEnd: '',
        dateStart: '',
        minPrice: 0
      };
      // 设置日期
      // 默认只有一条时
      if (priceList.length == 1) {
        // if (self.sum == 1) {
        priceList[0].dateEnd = self.dayFun(priceList.length);
        item.dateStart = self.dayFun(priceList.length + 1);
        // }
      }
      // if (priceList.length == 2 && self.sum == 2) {
      //   priceList[1].dateEnd = self.nowDayAddOneFun(priceList[1].dateStart, 1)
      //   item.dateStart = self.nowDayAddOneFun(priceList[1].dateEnd, 1)
      // }
      // 默认有两条时
      if (priceList.length == 2) {
        priceList[1].dateEnd = self.nowDayAddOneFun(priceList[1].dateStart, 1);
        item.dateStart = self.nowDayAddOneFun(priceList[1].dateEnd, 1);
      }
      item.dateEnd = self.sizeForm.dateShowOff;
      if (priceList.length > 2) {
        this.$message({
          message: '不能超过三条',
          type: 'warning'
        });
        return;
      }
      priceList.push(item);
      // if (this.sum < 2) {
      //   this.sum++;
      // }
    },
    // 新增最低票价和分账比例
    addMinPrice () {
      let self = this;
      if (!self.sizeForm.dateShowFirst) {
        this.$message({
          message: '上映日期不能为空',
          type: 'warning'
        });
        return;
      }
      if (!self.sizeForm.dateShowOff) {
        this.$message({
          message: '下映日期不能为空',
          type: 'warning'
        });
        return;
      }
      let item = {
        dateEnd: '',
        dateStart: '',
        minPrice: 0
      };
      // 设置日期
      // 默认只有一条时
      if (self.priceList.length == 1) {
        if (self.sum == 1) {
          self.priceList[0].dateEnd = self.dayFun(self.sum);
          item.dateStart = self.dayFun(self.sum + 1);
        }
      }
      if (self.priceList.length == 2 && self.sum == 2) {
        self.priceList[1].dateEnd = self.nowDayAddOneFun(self.priceList[1].dateStart, 1);
        item.dateStart = self.nowDayAddOneFun(self.priceList[1].dateEnd, 1);
      }
      // 默认有两条时
      if (self.priceList.length == 2 && self.sum == 1) {
        self.priceList[1].dateEnd = self.nowDayAddOneFun(self.priceList[1].dateStart, 1);
        item.dateStart = self.nowDayAddOneFun(self.priceList[1].dateEnd, 1);
      }
      item.dateEnd = self.sizeForm.dateShowOff;
      if (this.priceList.length > 2) {
        this.$message({
          message: '不能超过三条',
          type: 'warning'
        });
        return;
      }
      this.priceList.push(item);
      if (this.sum < 2) {
        this.sum++;
      }
    },
    // 删除
    deleGradeMinPrice (priceList, index) {
      if (priceList.length <= 1) {
        return;
      }
      let isLast = false;
      if (index == priceList.length - 1) {
        isLast = true;
        priceList[index - 1].dateEnd = this.sizeForm.dateShowOff;
      } else {

      }
      priceList.splice(index, 1);
    },
    // 删除
    deleMinPrice (index) {
      if (this.priceList.length <= 1) {
        return;
      }
      this.priceList.splice(index, 1);
      this.priceList[index - 1].dateEnd = this.sizeForm.dateShowOff;
      if (this.sum > 1) {
        this.sum--;
      }
    },
    // 抽离增加日期方法
    dayFun (sum) {
      let self = this;
      let resultDate;
      // 增加一天
      let addDay = new Date(self.sizeForm.dateShowFirst).getDate() + sum;
      // 当前日期
      let currentDate = new Date(self.sizeForm.dateShowFirst);
      // 目标日期
      resultDate = new Date(currentDate.setDate(addDay));
      return resultDate;
    },
    // 根据当前日期加一天
    nowDayAddOneFun (current, type) {
      let self = this;
      let resultDate;
      // 增加一天
      let addDay;
      if (type) {
        addDay = new Date(current).getDate() + 1;
      } else {
        addDay = new Date(current).getDate() - 1;
      }
      // 当前日期
      let currentDate = new Date(current);
      // 目标日期
      resultDate = new Date(currentDate.setDate(addDay));
      return resultDate;
    },
    addAccount () {
      let self = this;
      if (!self.sizeForm.dateShowFirst) {
        this.$message({
          message: '上映日期不能为空',
          type: 'warning'
        });
        return;
      }
      if (!self.sizeForm.dateShowOff) {
        this.$message({
          message: '下映日期不能为空',
          type: 'warning'
        });
        return;
      }
      let item = {
        dateEnd: '',
        dateStart: '',
        rate: 0
      };
      // 设置日期
      // 默认只有一条时
      if (self.rateList.length == 1) {
        if (self.accountSum == 1) {
          self.rateList[0].dateEnd = self.dayFun(self.accountSum);
          item.dateStart = self.dayFun(self.accountSum + 1);
        }
      }
      if (self.rateList.length == 2 && self.accountSum == 2) {
        self.rateList[1].dateEnd = self.nowDayAddOneFun(self.rateList[1].dateStart, 1);
        item.dateStart = self.nowDayAddOneFun(self.rateList[1].dateEnd, 1);
      }
      // 默认有两条时
      if (self.rateList.length == 2 && self.accountSum == 1) {
        self.rateList[1].dateEnd = self.nowDayAddOneFun(self.rateList[1].dateStart, 1);
        item.dateStart = self.nowDayAddOneFun(self.rateList[1].dateEnd, 1);
      }
      item.dateEnd = self.sizeForm.dateShowOff;
      if (this.rateList.length > 2) {
        this.$message({
          message: '不能超过三条',
          type: 'warning'
        });
        return;
      }
      this.rateList.push(item);
      if (this.accountSum < 2) {
        this.accountSum++;
      }
    },
    deleAccounts (index) {
      if (this.rateList.length <= 1) {
        return;
      }
      this.rateList.splice(index, 1);
      this.rateList[index - 1].dateEnd = this.sizeForm.dateShowOff;
    },

    formatDateTime (timeStamp, type) { // type: 0 全格式 1 仅日 2 仅时间
      var date = new Date(timeStamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let h = date.getHours();
      h = h < 10 ? `0${h}` : h;
      let mm = date.getMinutes();
      mm = mm < 10 ? `0${mm}` : mm;
      let ss = date.getSeconds();
      ss = ss < 10 ? `0${ss}` : ss;

      return type == 0 ? `${y}-${m}-${d} ${h}:${mm}:${ss}` : type == 1 ? `${y}-${m}-${d}` : type == 2 ? `${h}:${mm}` : `${y}-${m}-${d} ${h}:${mm}`;
    },
    // 提交form表单
    onSubmit (ruleForm) {
      console.log(this.priceListA);
      console.log(this.priceListB);
      console.log(this.priceListC);
      console.log(this.rateList);
      // return;
      this.$refs[ruleForm].validate((valid) => {
        console.log('valid', valid);
        if (valid) {
          let self = this;
          if (new Date(self.sizeForm.dateShowFirst).getTime() > new Date(self.sizeForm.dateShowOff).getTime()) {
            this.$message({
              message: '上映日期大于下映日期',
              type: 'warning'
            });
            return;
          }
          if (new Date(self.priceList[self.priceList.length - 1].dateEnd).getTime() < new Date(self.priceList[self.priceList.length - 1].dateStart).getTime()) {
            this.$message({
              message: '最低票价日期不正确',
              type: 'warning'
            });
            return;
          }
          if (new Date(self.rateList[self.rateList.length - 1].dateEnd).getTime() < new Date(self.rateList[self.rateList.length - 1].dateStart).getTime()) {
            this.$message({
              message: '分账比例日期不正确',
              type: 'warning'
            });
            return;
          }
          self.sizeForm.datePublicShow = self.formatDateTime(self.sizeForm.datePublicShow, 0);
          self.sizeForm.dateShowFirst = self.formatDateTime(self.sizeForm.dateShowFirst, 0);
          self.sizeForm.dateShowOff = self.formatDateTime(self.sizeForm.dateShowOff, 0);

          self.priceList.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0);
            item.dateStart = self.formatDateTime(item.dateStart, 0);
          });
          self.priceListA.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0);
            item.dateStart = self.formatDateTime(item.dateStart, 0);
          });
          self.priceListB.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0);
            item.dateStart = self.formatDateTime(item.dateStart, 0);
          });
          self.priceListC.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0);
            item.dateStart = self.formatDateTime(item.dateStart, 0);
          });

          self.rateList.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0);
            item.dateStart = self.formatDateTime(item.dateStart, 0);
          });
          if (self.sizeForm.timeLong == 0) {
            self.$message({
              message: '影片时长不能为0',
              type: 'warning'
            });
            return;
          }
          // 最低票价和分账比例不能为零
          if (self.priceList.some((item, index) => { return (item.minPrice == 0); })) {
            self.$message({
              message: '最低票价不能为空或者为0',
              type: 'warning'
            });
            return;
          }
          if (self.priceListA.some((item, index) => { return (item.minPrice == 0); })) {
            self.$message({
              message: '最低票价不能为空或者为0',
              type: 'warning'
            });
            return;
          }
          if (self.priceListB.some((item, index) => { return (item.minPrice == 0); })) {
            self.$message({
              message: '最低票价不能为空或者为0',
              type: 'warning'
            });
            return;
          }
          if (self.priceListC.some((item, index) => { return (item.minPrice == 0); })) {
            self.$message({
              message: '最低票价不能为空或者为0',
              type: 'warning'
            });
            return;
          }
          if (self.rateList.some((item, index) => { return (item.rate == 0); })) {
            self.$message({
              message: '分账比例不能为空或者为0',
              type: 'warning'
            });
            return;
          }
          if (self.rateList.some((item, index) => { return (item.rate * 1 > 100); })) {
            self.$message({
              message: '分账比例不能超过100%',
              type: 'warning'
            });
            return;
          }
          // 处理影片语言字段
          let moviedesclanguagesResult = [];
          self.moviedesclanguages.forEach((item, index) => {
            let resultItem = {};
            resultItem.languageCode = item.languageCode ? item.languageCode : item.propertyCode;
            resultItem.languageName = item.languageName ? item.languageName : item.propertyName;
            moviedesclanguagesResult.push(resultItem);
          });
          let data =
          {
            // 分账比例
            schBashMovie: self.sizeForm,
            priceList: self.priceListA,
            priceListB: self.priceListB,
            priceListC: self.priceListC,
            rateList: self.rateList,
            movieLanguages: moviedesclanguagesResult,
            movieAreaGradeVo: self.movieAreaGradeVo
          };
          console.log('data------------------', data);
          self.$ctmList
            .DownloadmovieEdit(data)
            .then(ret => {
              console.log('retsssssssssss', ret.data);
              if (ret.data) {
                self.$message({
                  message: '修改成功',
                  type: 'success'
                });
                self.$router.push({
                  path: 'list'
                });
              } else {
                self.$message({
                  message: '上传失败',
                  type: 'warning'
                });
              }
            })
            .catch(() => {
              console.log('哪里出错了，检擦一下哥哥');
              self.$message({
                message: '网络出错，稍后重试！',
                type: 'warning'
              });
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getDatas () {
      let self = this;
      let data = {
        movie_code: this.$route.query.movieId
      };
      self.$ctmList
        .DownloadmovieScan(data)
        .then(ret => {
          console.log('retsssssssssss', ret.data);
          if (ret.data) {
            let result = ret.data;

            let arr = result.movieAreaGradeVo.areaGradeListA;
            let str = '';
            if (arr && arr.length > 0) {
              arr.forEach((item, index) => {
                if (index != arr.length - 1) {
                  str = str + item.areaName + ',';
                } else {
                  str = str + item.areaName;
                }
              });
              result.movieAreaGradeVo.areaAStr = str + '共' + arr.length + '个城市';
              result.movieAreaGradeVo.areaA = str;
              if (arr.length > 4) {
                result.movieAreaGradeVo.areaAStr = arr[0].areaName + ',' + arr[1].areaName + ',' + arr[2].areaName + ',' + arr[3].areaName + '共' + arr.length + '个城市';
              }
            }

            // 重置str
            str = '';
            let arr1 = result.movieAreaGradeVo.areaGradeListB;
            if (arr1 && arr1.length > 0) {
              arr1.forEach((item, index) => {
                if (index != arr1.length - 1) {
                  str = str + item.areaName + ',';
                } else {
                  str = str + item.areaName;
                }
              });
              result.movieAreaGradeVo.areaBStr = str + '共' + arr1.length + '个城市';
              result.movieAreaGradeVo.areaB = str;
              if (arr1.length > 4) {
                result.movieAreaGradeVo.areaBStr = arr1[0].areaName + ',' + arr1[1].areaName + ',' + arr1[2].areaName + ',' + arr1[3].areaName + '共' + arr1.length + '个城市';
              }
              self.movieAreaGradeVo = result.movieAreaGradeVo;
            }

            // self.sizeForm = result.schBashMovie;
            Object.assign(self.sizeForm, result.schBashMovie);
            result.priceListA = result.priceList;
            if (!result.priceList) {
              result.priceList = [];
            }
            if (!result.priceListA) {
              result.priceListA = [];
            }
            if (!result.priceListB) {
              result.priceListB = [];
            }
            if (!result.priceListC) {
              result.priceListC = [];
            }

            // 如果分账比例 最低票价只有一条
            if (result.priceList.length == 1) {
              result.priceList[0].dateStart = self.sizeForm.dateShowFirst;
              result.priceList[0].dateEnd = self.sizeForm.dateShowOff;
            }
            // 如果分账比列 最低票价只有一条
            if (result.priceListA.length == 1) {
              result.priceListA[0].dateStart = self.sizeForm.dateShowFirst;
              result.priceListA[0].dateEnd = self.sizeForm.dateShowOff;
            }
            if (result.priceListB.length == 1) {
              result.priceListB[0].dateStart = self.sizeForm.dateShowFirst;
              result.priceListB[0].dateEnd = self.sizeForm.dateShowOff;
            }
            if (result.priceListC.length == 1) {
              result.priceListC[0].dateStart = self.sizeForm.dateShowFirst;
              result.priceListC[0].dateEnd = self.sizeForm.dateShowOff;
            }

            if (result.rateList.length == 1) {
              result.rateList[0].dateStart = self.sizeForm.dateShowFirst;
              result.rateList[0].dateEnd = self.sizeForm.dateShowOff;
            }
            // 处理影院语言
            if (result.movieLanguages.length > 0) {
              let arrItem = [];
              result.movieLanguages.forEach((item, index) => {
                arrItem.push(item.languageName);
              });
              self.sizeForm.movieLanguageList = arrItem;
            }
            self.moviedesclanguages = [...result.movieLanguages];
            // 如果沒有数据
            if (result.priceList.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                minPrice: 0
              };
              result.priceList.push(item);
            }
            if (result.priceListA.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                minPrice: 0
              };
              result.priceListA.push(item);
            }
            if (result.priceListB.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                minPrice: 0
              };
              result.priceListB.push(item);
            }
            if (result.priceListC.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                minPrice: 0
              };
              result.priceListC.push(item);
            }

            if (result.rateList.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                rate: 0
              };
              result.rateList.push(item);
            }
            self.priceList = result.priceList;
            self.priceListA = result.priceListA;
            self.priceListB = result.priceListB;
            self.priceListC = result.priceListC;
            self.rateList = result.rateList;
          }
        })
        .catch(() => {
          console.log('哪里出错了，检擦一下哥哥');
        });
    },
    cancelFun () {
      this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '留下',
        cancelButtonText: '放弃修改'
      })
        .then(() => {
          //  this.onSubmit()
        })
        .catch(action => {
          console.log('action', action);
          if (action != 'cancel') return;
          this.$router.push({
            path: 'list'
          });
        });
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取影片字典
    getDictionary (val) {
      let _this = this;
      let params = {
        code: val
      };
      _this.$ctmList
        .getSysByCode(params)
        .then(ret => {
          if (ret.data) {
            let result = ret.data.propertyList;
            if (val == 'movie_film_film_language') {
              // 影片语言
              _this.optionFilmLanguageList = [...result];
            }
            if (val == 'movie_film_film_level') {
              // 影片级别
              _this.optionFilmLevelList = [...result];
            }
            if (val == 'movie_film_film_subtitles') {
              // 影片字幕
              _this.optionFilmSubtitlesList = [...result];
            }
            if (val == 'movie_film_film_type') {
              // 影片分类
              _this.optionFilmTypeList = [...result];
            }
          }
        });
    },
    selectFilmLanguageFun () {
      let arrItem = [];
      this.optionFilmLanguageList.forEach((item, index) => {
        this.sizeForm.movieLanguageList.forEach((item2, index2) => {
          if (item2 == item.propertyName) {
            arrItem.push(item);
          }
        });
      });
      this.moviedesclanguages = arrItem;
    }
  },
  created () {
    this.getDatas();
    this.getDictionary('movie_film_film_level');
    this.getDictionary('movie_film_film_language');
    this.getDictionary('movie_film_film_subtitles');
    this.getDictionary('movie_film_film_type');
  }
};
</script>
<style  lang='scss' type="text/css" >
.film-edit-wrap {
  width: 100%;
  .f-w-b {
    font-weight: bold;
  }
  .c-s-title {
    color: #666666;
  }
  .cur-p {
    cursor: pointer;
  }
  .label-color {
    color: #606266;
  }
  .valid-color {
    color: #f56c6c;
  }
  .more-info {
    color: #3b74ff;
    cursor: pointer;
    // padding-bottom: 64px;
  }
  .el-collapse-item__header::after {
    height: 0px !important;
  }
  position: relative;
  .film-edit-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .el-collapse-item__content {
    padding-bottom: 0px;
  }
  .basic-info {
    // width: 420px;
    margin-left: 10px;
    .el-form-item--small.el-form-item {
      margin-bottom: 18px;
      // display: inline-block;
      width: 580px;
      margin-right: 48px;
    }
    .el-form-item--small.el-form-item.textarea-item {
      width: 960px;
    }
    .el-form-item--small.el-form-item:nth-of-type(even) {
      margin-right: 0px;
    }

    .el-form-item__label {
      font-size: 12px;
      text-align: right;
      // text-align: left;
      color: #666666;
    }
    .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
      font-size: 12px;
      color: #666666;
    }
    .el-textarea {
      width: 360px;
    }
    .input-edit-wrap {
      display: inline-block;
      .el-input__inner {
        width: 325px;
      }
    }
    .el-form-item__label {
      font-size: 12px;
    }
    .download-film-scan-text {
      font-size: 12px;
      color: #666666;
      width: 360px;
    }

    .film-edit-text {
      font-size: 12px;
      color: #666666;
    }
    .separate-accounts-wrap {
      .el-form-item--small .el-form-item__content {
        width: 520px;
        // margin-left: 87px;
        // margin-top: -40px;
      }
    }
    //添加or删除
    .separate-accounts-wrap {
      .add {
        color: #3b74ff;
        font-size: 12px;
        cursor: pointer;
        .icon-neiye-tianjia- {
          font-size: 12px;
          margin-right: 4px;
        }
      }
      .no-info {
        font-size: 12px;
        color: #666666;
        width: 360px;
      }
    }
    //分账信息and最低票价
    .separate-accounts-date,
    .separate-accounts-price,
    .separate-accounts-action {
      display: inline;
      //   height: 32px;
    }
    .separate-accounts-price {
      width: 83px;
      .el-input--small {
        width: 62px;
        .el-input__inner {
          width: 62px;
        }
      }
      span {
        font-size: 12px;
        color: #666666;
      }
    }
    .separate-accounts-date {
      width: 297px;
      margin-left: -10px;
      span {
        font-size: 12px;
        color: #666666;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 196px;
      }
      .el-date-editor {
        width: 120px;
        margin-right: 8px;
        .el-input__inner {
          width: 107%;
        }
      }
    }
    .delete {
      color: #3b74ff;
      font-size: 12px;
      cursor: pointer;
    }
    .no-info {
      font-size: 12px;
      color: #666666;
      width: 360px;
    }
    .separate-accounts-action {
      margin-left: 6px;
      .el-button {
        border: 1px solid #3b74ff;
        color: #3b74ff;
        span {
          font-size: 12px;
        }
      }
      .el-button--mini {
        padding: 10px 5px 8px;
      }
    }
  }

  .film-info-save {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  //新button样式
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    // position: fixed;
    z-index: 999;
    bottom: 0;
    right: 0;
    // background-color: #f5f5f5;
    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
      .el-button {
        width: 80px;
        height: 32px;
        margin-left: 0px;
      }
      .el-button--primary {
        margin-right: 30px;
      }
    }
  }
  .el-collapse {
    border-bottom: none;
    padding-bottom: 0px;
  }
  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    // margin: 0 8px 0;
    margin: 16px 5px 0;
    float: left;
  }
  .el-collapse-item__header {
    display: inline-block;
    border-bottom: none;
    position: relative;
    padding: 7px 0;
    font-size: 14px;
    color: #333;
    &::after {
      left: 0;
      bottom: 0;
      // width: 968px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
    }
  }
  .el-collapse-item__wrap {
    border: none;
    padding-top: 0px;
  }
}
</style>
