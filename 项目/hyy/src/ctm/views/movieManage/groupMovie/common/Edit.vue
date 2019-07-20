<template>
  <div class="film-edit-wrap">
    <div class="film-edit-content">
      <el-collapse v-model="activeNames">
        <el-form
          :rules="rules"
          ref="ruleForm"
          :model="sizeForm"
          label-width="85px"
          size="small"
          inline
        >
          <el-collapse-item
            title="基础信息"
            name="1"
          >
            <div class="basic-info">
              <div>
                <el-form-item
                  label="影片名称："
                  prop="movieName"
                >
                  <span class="download-film-scan-text">
                    {{sizeForm.movieName}}
                  </span>
                </el-form-item>

                <el-form-item
                  label="影片编码："
                  prop="movieCode"
                >
                  <span class="download-film-scan-text">
                    {{sizeForm.movieCode}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="影片英文："
                  prop="movieenglishname"
                >
                  <el-input v-model="sizeForm.movieenglishname"></el-input>
                </el-form-item>

                <el-form-item
                  label="影片别名："
                  prop="movieothername"
                >
                  <el-input v-model="sizeForm.movieothername"></el-input>
                </el-form-item>

              </div>
              <div>
                <el-form-item
                  label="影片语言："
                  prop="movieLanguageList"
                >
                  <el-select
                    v-model="sizeForm.movieLanguageList"
                    placeholder="请选择"
                    multiple
                    @change="selectFilmLanguageFun()"
                  >
                    <template>
                      <el-option
                        v-for="(item,index) in optionFilmLanguageList"
                        :key="index"
                        :label="item.propertyName"
                        :value="item.propertyValue"
                      ></el-option>
                    </template>

                  </el-select>
                </el-form-item>

                <el-form-item
                  label="影片产地："
                  prop="movieArea"
                >
                  <span class="download-film-scan-text">
                    {{sizeForm.movieArea}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="发行版本："
                  prop="disVersion"
                >
                  <span class="download-film-scan-text">
                    {{sizeForm.disVersion}}
                  </span>
                </el-form-item>

                <el-form-item
                  label="影片级别："
                  prop="movieLevel"
                >
                  <el-select
                    v-model="sizeForm.movieLevel"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item,index) in optionFilmLevelList"
                      :key='index'
                      :label="item.propertyName"
                      :value="item.propertyValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="影片分类："
                  prop="movieClass"
                >
                  <el-select
                    v-model="sizeForm.movieClass"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item,index) in optionFilmTypeList"
                      :key='index'
                      :label="item.propertyName"
                      :value="item.propertyValue"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="影片时长："
                  prop="timeLong"
                >
                  <div class="input-edit-wrap">
                    <el-input
                      v-model="sizeForm.timeLong"
                      @change="timeLongChange(sizeForm.timeLong)"
                    ></el-input>
                  </div><span style="font-size:12px;color:#666666;margin-left:5px">分钟</span>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="影片字幕："
                  prop="filmCaption"
                >
                  <el-select
                    v-model="sizeForm.filmCaption"
                    placeholder="请选择影片字幕"
                  >
                    <el-option
                      v-for="(item,index) in optionFilmSubtitlesList"
                      :key='index'
                      :label="item.propertyName"
                      :value="item.propertyValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="公映日期："
                  prop="datePublicShow"
                >
                  <span
                    class="download-film-scan-text"
                    v-if='sizeForm.datePublicShow'
                  >
                    {{sizeForm.datePublicShow.substring(0,10)}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="首映日期："
                  prop="dateShowFirst"
                >
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    v-model="sizeForm.dateShowFirst"
                    style="width: 100%;"
                    @change="changeMinPriceStartTimeFun"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  label="下映日期："
                  prop="dateShowOff"
                >
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    v-model="sizeForm.dateShowOff"
                    style="width: 100%;"
                    @change="changeMinPriceEndtTimeFun"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                label="帧数："
                prop="frameNumber"
              >
                <el-select
                  v-model="sizeForm.frameNumber"
                  placeholder="请选择帧数"
                >
                  <el-option
                    label="24"
                    value="24"
                  ></el-option>
                  <el-option
                    label="48"
                    value="48"
                  ></el-option>
                  <el-option
                    label="120"
                    value="120"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                  label="发行商："
                  prop="publisher"
                >
                  <el-input v-model="sizeForm.publisher"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="制作人："
                  prop="movieMaker"
                >
                  <el-input v-model="sizeForm.movieMaker"></el-input>
                </el-form-item>
                <el-form-item
                  label="导演："
                  prop="movieDirect"
                >
                  <el-input v-model="sizeForm.movieDirect"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label="演员："
                  prop="movieActor"
                >
                  <el-input v-model="sizeForm.movieActor"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  class="textarea-item"
                  label="简介："
                  prop="movieDesc"
                >
                  <el-input type="textarea" v-model="sizeForm.movieDesc"></el-input>
                </el-form-item>
              </div>

            </div>
          </el-collapse-item>
          <el-collapse-item
            title="分账信息"
            name="3"
          >
            <div class="basic-info">
              <div class="separate-accounts-wrap">
                
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
                

                <el-form-item
                  label="院方分账："
                  prop="dateShowFirst"
                >

                  <div
                    v-for="(item,index) in rateList"
                    style="margin-top:8px;"
                    :key='index'
                  >
                    <div class="separate-accounts-price">
                      <el-input
                        size="small"
                        v-model="item.rate"
                        @change="accountChange(item.rate,index)"
                      ></el-input>
                      <span>% ，</span>
                    </div>

                    <div class="separate-accounts-date">
                      <span>日期</span>
                      <el-date-picker
                        v-model="item.dateStart"
                        disabled
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                      <el-date-picker
                        v-model="item.dateEnd"
                        @change="accountDateEndFun($event,index)"
                        :disabled="index == rateList.length*1-1"
                        type="date"
                        :picker-options="pickerOptions"
                        @focus='rateChangePickerOptionsFun(index)'
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </div>
                    <span
                      class="delete"
                      @click="deleAccounts(index)"
                      v-if="rateList.length >1"
                    >删除</span>
                  </div>
                  <div
                    class="no-info"
                    v-if="rateList.length==0"
                  >
                    暂无
                  </div>
                  <span
                    class="add"
                    @click="addAccount()"
                  ><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                </el-form-item>
              </div>
            </div>
          </el-collapse-item>
        </el-form>
      </el-collapse>
      <div
        class="more-info"
        @click="moreInfoChange()"
      >
        更多信息...
      </div>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button
            type="primary"
            @click="onSubmit('ruleForm')"
          >保存</el-button>
          <el-button @click="cancelFun">返回</el-button>
        </div>

      </div>
    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>
<script>
import FixStepTool from "ctm/components/fix-step-tool/fix-step-tool"
import fixStepMixin from "ctm/mixins/fixStepTool"

export default {
  data () {
    return {
      sum: 1,
      accountSum: 1,
      priceItem: {
        dateEnd: '',
        dateStart: '',
        minPrice: '0',
      },
      accountItem: {
        dateEnd: '',
        dateStart: '',
        rate: '0',
      },
      noDatadialogVisible: false,
      activeNames: ['1', '2', '3'],
      sizeForm: {
        movieName: "",
        disVersion: "",
        movieCode: "",
        movieArea: "",
        movieClass: "",
        frameNumber: "",
        timeLong: "",
        dateShowFirst: '',
        dateShowOff: "",
        filmCaption: "",
        movieLevel: '',
        publisher: '',
        movieMaker:"",
        movieActor: "",
        movieDirect: '',
        movieDesc: '',
        //自己定义字段
        movieDescLanguage: '',
        movieLanguageList: [],
        movieenglishname: "",
        movieothername: '',
        movieOtherActor: '',
        //交互部分
        activeNames: ["3"],
        dialogImageUrl: "",
        dialogVisible: false
      },
      movieLanguageList: [],
      moviedesclanguages: [],
      //字典系列
      optionFilmLanguageList: [],
      optionFilmLevelList: [],
      optionFilmSubtitlesList: [],
      optionFilmTypeList: [],
      priceList: [],
      aPriceList: [],
      bPriceList: [],
      cPriceList: [],
      rateList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
      },
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "基础信息",
            isactive: false
          },
          {
            name: "分账信息",
            isactive: false
          },
        ]
      },
      rules: {

        frameNumber: [
          { required: true, message: '请输入电影帧数', trigger: 'blur' },
        ],
        timeLong: [
          { required: true, message: '请输入电影时长', trigger: 'blur' },
        ],
        dateShowFirst: [
          { required: true, message: '请输入首映日期', trigger: 'blur' },
        ],
        dateShowOff: [
          { required: true, message: '请输入下映日期', trigger: 'blur' },
        ],
        movieLanguageList: [
          { required: true, message: '请选择影片语言', trigger: 'blur' },
        ],
        // movieDirect: [
        //   { required: true, message: '请输入影片导演', trigger: 'blur' },
        //   { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
        // ],
      },
    };
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool
  },
  methods: {
    moreInfoChange () {
      //有数据再跳转
      if (!this.getInfo()) {
        this.$message({
          message: '暂无更多信息',
          type: 'warning'
        });
        return
      }
      this.$router.push({
        path: "/sys/filmDetail",
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
            this.noDatadialogVisible = true
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      return this.noDatadialogVisible
    },
    //修改最低票价时间配置项禁用
    priceChangePickerOptionsFun (index) {
      let _this = this
      let date_A = new Date(_this.priceList[index].dateStart)
      let date_B = new Date(_this.priceList[index + 1].dateEnd)
      date_B.setTime(date_B.getTime() - 3600 * 1000 * 24)
      this.pickerOptions = {
        disabledDate (time) {
          return !(time.getTime() < date_B && time.getTime() >= date_A);
        },
      }
    },
    //修改分账比例的时间配置禁用
    rateChangePickerOptionsFun (index) {
      let _this = this
      let date_A = new Date(_this.rateList[index].dateStart)
      let date_B = new Date(_this.rateList[index + 1].dateEnd)
      date_B.setTime(date_B.getTime() - 3600 * 1000 * 24)
      this.pickerOptions = {
        disabledDate (time) {
          return !(time.getTime() < date_B && time.getTime() >= date_A);
        },
      }
    },
    priceChange (val, index) {
      let newVal = parseFloat(val)
      console.log('newVal:', newVal)
      if (newVal < 0) {
        this.priceList[index].minPrice = 0
        return
      }
      this.priceList[index].minPrice = newVal ? newVal : ''
      console.log(' this.priceList[index].minPrice:', this.priceList[index].minPrice)
    },
    accountChange (val, index) {
      let newVal = parseFloat(val)
      if (newVal < 0) {
        this.rateList[index].rate = 0
        return
      }
      this.rateList[index].rate = newVal ? newVal : ''
    },
    timeLongChange (val) {
      let newVal = parseFloat(val)
      if (newVal < 0) {
        this.sizeForm.timeLong = 0
        return
      }
      this.sizeForm.timeLong = newVal ? newVal : ''
    },
    //计算日期差天数
    getTime2Time ($time1, $time2) {
      var time1 = arguments[0], time2 = arguments[1];
      time1 = Date.parse(time1) / 1000;
      time2 = Date.parse(time2) / 1000;
      var time_ = time1 - time2;
      return (time_ / (3600 * 24));
    },
    //修改下个日期起始日期
    priceDateEndFun ($event, index) {
      if (this.priceList.length <= 1) {

      } else {
        this.priceList[index + 1].dateStart = this.nowDayAddOneFun($event, 1)
      }
    },
    accountDateEndFun ($event, index) {
      if (this.rateList.length <= 1) {

      } else {
        this.rateList[index + 1].dateStart = this.nowDayAddOneFun($event, 1)
      }
    },
    //首映日期改变最低票价启始时间
    changeMinPriceStartTimeFun (val) {
      let self = this
      self.priceList[0].dateStart = val
      self.rateList[0].dateStart = val
      self.sum = 1
      self.accountSum = 1
    },
    //下映日期改变最低票价启始时间
    changeMinPriceEndtTimeFun (val) {
      let self = this
      self.priceList[self.priceList.length - 1].dateEnd = val
      self.rateList[self.rateList.length - 1].dateEnd = val
      self.sum = 1
      self.accountSum = 1
    },
    //新增最低票价和分账比例
    addMinPrice () {
      let self = this
      if (!self.sizeForm.dateShowFirst) {
        this.$message({
          message: '上映日期不能为空',
          type: 'warning'
        });
        return
      }
      if (!self.sizeForm.dateShowOff) {
        this.$message({
          message: '下映日期不能为空',
          type: 'warning'
        });
        return
      }
      let item = {
        dateEnd: '',
        dateStart: '',
        minPrice: 0,
      }
      //设置日期
      //默认只有一条时
      if (self.priceList.length == 1) {
        if (self.sum == 1) {
          self.priceList[0].dateEnd = self.dayFun(self.sum)
          item.dateStart = self.dayFun(self.sum + 1);
        }
      }
      if (self.priceList.length == 2 && self.sum == 2) {
        self.priceList[1].dateEnd = self.nowDayAddOneFun(self.priceList[1].dateStart, 1)
        item.dateStart = self.nowDayAddOneFun(self.priceList[1].dateEnd, 1)
      }
      //默认有两条时
      if (self.priceList.length == 2 && self.sum == 1) {
        self.priceList[1].dateEnd = self.nowDayAddOneFun(self.priceList[1].dateStart, 1)
        item.dateStart = self.nowDayAddOneFun(self.priceList[1].dateEnd, 1)
      }
      item.dateEnd = self.sizeForm.dateShowOff
      if (this.priceList.length > 2) {
        this.$message({
          message: '不能超过三条',
          type: 'warning'
        });
        return
      }
      this.priceList.push(item)
      if (this.sum < 2) {
        this.sum++;
      }
    },
    //删除
    deleMinPrice (index) {
      if (this.priceList.length <= 1) {
        return
      }
      this.priceList.splice(index, 1)
      this.priceList[index - 1].dateEnd = this.sizeForm.dateShowOff;
      if (this.sum > 1) {
        this.sum--;
      }
    },
    //抽离增加日期方法
    dayFun (sum) {
      let self = this
      let resultDate
      //增加一天
      let addDay = new Date(self.sizeForm.dateShowFirst).getDate() + sum
      //当前日期
      let currentDate = new Date(self.sizeForm.dateShowFirst)
      //目标日期
      resultDate = new Date(currentDate.setDate(addDay))
      return resultDate
    },
    //根据当前日期加一天
    nowDayAddOneFun (current, type) {
      let self = this
      let resultDate
      //增加一天
      let addDay
      if (type) {
        addDay = new Date(current).getDate() + 1
      } else {
        addDay = new Date(current).getDate() - 1
      }
      //当前日期
      let currentDate = new Date(current)
      //目标日期
      resultDate = new Date(currentDate.setDate(addDay))
      return resultDate
    },
    addAccount () {
      let self = this
      if (!self.sizeForm.dateShowFirst) {
        this.$message({
          message: '上映日期不能为空',
          type: 'warning'
        });
        return
      }
      if (!self.sizeForm.dateShowOff) {
        this.$message({
          message: '下映日期不能为空',
          type: 'warning'
        });
        return
      }
      let item = {
        dateEnd: '',
        dateStart: '',
        rate: 0,
      }
      //设置日期
      //默认只有一条时
      if (self.rateList.length == 1) {
        if (self.accountSum == 1) {
          self.rateList[0].dateEnd = self.dayFun(self.accountSum)
          item.dateStart = self.dayFun(self.accountSum + 1);
        }
      }
      if (self.rateList.length == 2 && self.accountSum == 2) {
        self.rateList[1].dateEnd = self.nowDayAddOneFun(self.rateList[1].dateStart, 1)
        item.dateStart = self.nowDayAddOneFun(self.rateList[1].dateEnd, 1)
      }
      //默认有两条时
      if (self.rateList.length == 2 && self.accountSum == 1) {
        self.rateList[1].dateEnd = self.nowDayAddOneFun(self.rateList[1].dateStart, 1)
        item.dateStart = self.nowDayAddOneFun(self.rateList[1].dateEnd, 1)
      }
      item.dateEnd = self.sizeForm.dateShowOff
      if (this.rateList.length > 2) {
        this.$message({
          message: '不能超过三条',
          type: 'warning'
        });
        return
      }
      this.rateList.push(item)
      if (this.accountSum < 2) {
        this.accountSum++;
      }
    },
    deleAccounts (index) {
      if (this.rateList.length <= 1) {
        return
      }
      this.rateList.splice(index, 1)
      this.rateList[index - 1].dateEnd = this.sizeForm.dateShowOff;
    },

    formatDateTime (timeStamp, type) { // type: 0 全格式 1 仅日 2 仅时间
      var date = new Date(timeStamp)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? `0${m}` : m
      let d = date.getDate()
      d = d < 10 ? `0${d}` : d
      let h = date.getHours()
      h = h < 10 ? `0${h}` : h
      let mm = date.getMinutes()
      mm = mm < 10 ? `0${mm}` : mm
      let ss = date.getSeconds()
      ss = ss < 10 ? `0${ss}` : ss

      return type == 0 ? `${y}-${m}-${d} ${h}:${mm}:${ss}` : type == 1 ? `${y}-${m}-${d}` : type == 2 ? `${h}:${mm}` : `${y}-${m}-${d} ${h}:${mm}`
    },
    //提交form表单
    onSubmit (ruleForm) {
      console.log(this.priceList);
      console.log(this.rateList);
      // return;
      this.$refs[ruleForm].validate((valid) => {
        console.log('valid', valid)
        if (valid) {
          let self = this;
          if (new Date(self.sizeForm.dateShowFirst).getTime() > new Date(self.sizeForm.dateShowOff).getTime()) {
            this.$message({
              message: '上映日期大于下映日期',
              type: 'warning'
            });
            return
          }
          if (new Date(self.priceList[self.priceList.length - 1].dateEnd).getTime() < new Date(self.priceList[self.priceList.length - 1].dateStart).getTime()) {
            this.$message({
              message: '最低票价日期不正确',
              type: 'warning'
            });
            return
          }
          if (new Date(self.rateList[self.rateList.length - 1].dateEnd).getTime() < new Date(self.rateList[self.rateList.length - 1].dateStart).getTime()) {
            this.$message({
              message: '分账比例日期不正确',
              type: 'warning'
            });
            return
          }
          self.sizeForm.datePublicShow = self.formatDateTime(self.sizeForm.datePublicShow, 0)
          self.sizeForm.dateShowFirst = self.formatDateTime(self.sizeForm.dateShowFirst, 0)
          self.sizeForm.dateShowOff = self.formatDateTime(self.sizeForm.dateShowOff, 0)


          self.priceList.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0)
            item.dateStart = self.formatDateTime(item.dateStart, 0)
          })

          self.rateList.forEach((item, index) => {
            item.dateEnd = self.formatDateTime(item.dateEnd, 0)
            item.dateStart = self.formatDateTime(item.dateStart, 0)
          })
          if (self.sizeForm.timeLong == 0) {
            self.$message({
              message: '影片时长不能为0',
              type: 'warning'
            });
            return
          }
          //最低票价和分账比例不能为零
          if (self.priceList.some((item, index) => { return (item.minPrice == 0) })) {
            self.$message({
              message: '最低票价不能为空或者为0',
              type: 'warning'
            });
            return
          }
          if (self.rateList.some((item, index) => { return (item.rate == 0) })) {
            self.$message({
              message: '分账比例不能为空或者为0',
              type: 'warning'
            });
            return
          }
           if (self.rateList.some((item, index) => { return (item.rate*1 > 100) })) {
            self.$message({
              message: '分账比例不能超过100%',
              type: 'warning'
            });
            return
          }
          //处理影片语言字段
          let moviedesclanguagesResult = []
          self.moviedesclanguages.forEach((item, index) => {
            let resultItem = {}
            resultItem.languageCode = item.languageCode ? item.languageCode : item.propertyCode;
            resultItem.languageName = item.languageName ? item.languageName : item.propertyName;
            moviedesclanguagesResult.push(resultItem)
          })
          let data =
          {
            //分账比例
            schBashMovie: self.sizeForm,
            priceList: self.priceList,
            rateList: self.rateList,
            movieLanguages: moviedesclanguagesResult
          };
          console.log('data------------------', data)
          self.$ctmList
            .DownloadmovieEdit(data)
            .then(ret => {
              console.log("retsssssssssss", ret.data);
              if (ret.data) {
                self.$message({
                  message: '修改成功',
                  type: 'success'
                });
                self.$router.push({
                  path: "list",
                });
              } else {
                self.$message({
                  message: '上传失败',
                  type: 'warning'
                });
              }

            })
            .catch(() => {
              console.log("哪里出错了，检擦一下哥哥");
              self.$message({
                message: '网络出错，稍后重试！',
                type: 'warning'
              });
            });
        }
        else {
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
          console.log("retsssssssssss", ret.data);
          if (ret.data) {
            let result = ret.data;
            // self.sizeForm = result.schBashMovie;
            Object.assign(self.sizeForm, result.schBashMovie);
            //如果分账比例 最低票价只有一条
            if (result.priceList.length == 1) {
              result.priceList[0].dateStart = self.sizeForm.dateShowFirst
              result.priceList[0].dateEnd = self.sizeForm.dateShowOff
            }
            if (result.rateList.length == 1) {
              result.rateList[0].dateStart = self.sizeForm.dateShowFirst
              result.rateList[0].dateEnd = self.sizeForm.dateShowOff
            }
            //处理影院语言
            if (result.movieLanguages.length > 0) {
              let arrItem = []
              result.movieLanguages.forEach((item, index) => {
                arrItem.push(item.languageName)
              })
              self.sizeForm.movieLanguageList = arrItem
            }
            self.moviedesclanguages = [...result.movieLanguages]
            //如果沒有数据
            if (result.priceList.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                minPrice: 0,
              }
              result.priceList.push(item)
            }
            if (result.rateList.length == 0) {
              let item = {
                dateEnd: self.sizeForm.dateShowOff,
                dateStart: self.sizeForm.dateShowFirst,
                rate: 0,
              }
              result.rateList.push(item)
            }
            self.priceList = result.priceList;
            self.rateList = result.rateList;
          }

        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
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
          console.log('action', action)
          if (action != 'cancel') return
          this.$router.push({
            path: "list",
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
    //获取影片字典
    getDictionary (val) {
      let _this = this
      let params = {
        code: val
      }
      _this.$ctmList
        .getSysByCode(params)
        .then(ret => {
          if (ret.data) {
            let result = ret.data.propertyList;
            if (val == 'movie_film_film_language') {
              //影片语言
              _this.optionFilmLanguageList = [...result]
            }
            if (val == 'movie_film_film_level') {
              //影片级别
              _this.optionFilmLevelList = [...result]
            }
            if (val == 'movie_film_film_subtitles') {
              //影片字幕
              _this.optionFilmSubtitlesList = [...result]
            }
            if (val == 'movie_film_film_type') {
              //影片分类
              _this.optionFilmTypeList = [...result]
            }
          }
        })
    },
    selectFilmLanguageFun () {
      let arrItem = []
      this.optionFilmLanguageList.forEach((item, index) => {
        this.sizeForm.movieLanguageList.forEach((item2, index2) => {
          if (item2 == item.propertyName) {
            arrItem.push(item)
          }
        })
      })
      this.moviedesclanguages = arrItem
    }
  },
  created () {
    this.getDatas()
    this.getDictionary('movie_film_film_level')
    this.getDictionary('movie_film_film_language')
    this.getDictionary('movie_film_film_subtitles')
    this.getDictionary('movie_film_film_type')
  }
};
</script>
<style  lang='scss' type="text/css" >
.film-edit-wrap {
  width: 100%;
  .more-info{
    color:#3B74FF;
    cursor:pointer;
    padding-bottom: 64px;
  }
  .el-collapse-item__header::after{
            height: 0px !important;
  }
  position: relative;
  .film-edit-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .el-collapse-item__content{
    padding-bottom:0px;
  }
  .basic-info {
    // width: 420px;
    margin-left: 30px;
    .el-form-item--small.el-form-item {
      margin-bottom: 18px;
      // display: inline-block;
      width: 480px;
      margin-right:48px;
    }
    .el-form-item--small.el-form-item.textarea-item{
        width: 960px;
    }
    .el-form-item--small.el-form-item:nth-of-type(even){
      margin-right:0px;
    }

    .el-form-item__label {
      font-size: 12px;
      text-align: right;
      color: #666666
    }
     .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
      font-size: 12px;
      color: #666666;
    }
    .el-textarea{
      width:720px;
    }
    .input-edit-wrap{
      display: inline-block;
      .el-input__inner{
        width: 325px ;
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
    .separate-accounts-wrap{
      .el-form-item--small .el-form-item__content{
      width: 420px;
      margin-left: 87px;
      margin-top: -40px;  
    }
    }
    //添加or删除
    .separate-accounts-wrap{
      .add{
        color:#3B74FF;
         font-size: 12px;
         cursor:pointer;
        .icon-neiye-tianjia-{
          font-size: 12px;
          margin-right: 4px
          
        }
      }
      .no-info{
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
      .el-input--small{
          width:62px;
          .el-input__inner {
             width: 62px;
          }
      }
      span{
          font-size: 12px;
          color: #666666 ;
      }
    }
    .separate-accounts-date {
      width: 297px;
      margin-left: -10px;
       span{
              font-size: 12px;
              color: #666666 ;
          }
      .el-date-editor--daterange.el-input__inner{
          width: 196px;
         
      }
      .el-date-editor{
        width: 120px;
        margin-right:8px;
        .el-input__inner{
          width: 107%;
        }
      }
    }
    .delete{
      color: #3B74FF;
      font-size: 12px;
      cursor:pointer
      
    }
     .no-info{
        font-size: 12px;
        color: #666666;
        width: 360px;
      }
    .separate-accounts-action{
        margin-left: 6px;
        .el-button{
            border: 1px solid #3B74FF;
            color: #3B74FF;
            span{
                font-size: 12px;
            }
        }
        .el-button--mini{
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
		position: fixed;
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
      .el-button{
        width: 80px;
        height: 32px;
        margin-left: 0px;
      }
      .el-button--primary{
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
			content: '';
			position: absolute;
			background-color: #ebeef5;
			z-index: 1
		}
    }
    .el-collapse-item__wrap {
		border: none;
		padding-top: 0px;
	}
}

</style>
