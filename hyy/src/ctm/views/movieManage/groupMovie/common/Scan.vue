<template>
  <div class="download-film-scan-wrap">
    <div class="download-film-scan-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="1">
          <div class="basic-info">
            <el-form ref="form" :model="sizeForm" label-width="85px" size="small" inline>
              <div>
                <el-form-item label="影片名称：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieName}}
                  </span>
                </el-form-item>
                <el-form-item label="影片编码：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieCode}}
                  </span>
                </el-form-item>

              </div>
              <div>
                <el-form-item label="影片英文名：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieenglishname}}
                  </span>
                </el-form-item>
                <el-form-item label="影片别名：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieothername}}
                  </span>
                </el-form-item>

              </div>
              <div>
                <el-form-item label="影片语言：">
                  <span class="download-film-scan-text">
                    {{movieLanguages}}
                  </span>
                </el-form-item>
                <el-form-item label="影片产地：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieArea}}
                  </span>
                </el-form-item>

              </div>
              <div>
                <el-form-item label="发行版本：">
                  <span class="download-film-scan-text">
                    {{sizeForm.disVersion}}
                  </span>

                </el-form-item>
                <el-form-item label="影片级别：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieLevel}}
                  </span>
                </el-form-item>

              </div>

              <div>
                <el-form-item label="影片分类：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieClass}}
                  </span>
                </el-form-item>
                <el-form-item label="影片时长：">
                  <span class="download-film-scan-text">
                    {{sizeForm.timeLong}}分钟
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="影片字幕：">
                  <span class="download-film-scan-text">
                    {{sizeForm.filmCaption}}
                  </span>
                </el-form-item>
                <el-form-item label="公映日期：">
                  <span class="download-film-scan-text">
                    {{getDateFatFun(sizeForm.datePublicShow)}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="首映日期：">
                  <span class="download-film-scan-text">
                    {{getDateFatFun(sizeForm.dateShowFirst)}}
                  </span>
                </el-form-item>
                <el-form-item label="下映日期：">
                  <span class="download-film-scan-text">
                    {{getDateFatFun(sizeForm.dateShowOff)}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="帧数：">
                  <span class="download-film-scan-text">
                    {{sizeForm.frameNumber}}
                  </span>
                </el-form-item>
                <el-form-item label="发行商：">
                  <span class="download-film-scan-text">
                    {{sizeForm.publisher}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="制作人：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieMaker}}
                  </span>
                </el-form-item>
                <el-form-item label="导演：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieDirect}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="演员：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieActor}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item class="textarea-item" label="简介：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieDesc}}
                  </span>
                </el-form-item>
              </div>
            </el-form>

          </div>
        </el-collapse-item>
        <el-collapse-item title="分账信息" name="3">
          <div class="basic-info account-fenge">
            <el-form ref="form" :model="sizeForm" label-width="85px" size="small" inline>
              <div>
                <div>
                  <el-form-item label-width="0px">
                    <div class="f-12 label-color">
                      <span class="c-s-title f-w-b">A类城市（{{movieAreaGradeVo.areaGradeListA?movieAreaGradeVo.areaGradeListA.length:""}}）：</span>
                      <el-tooltip popper-class="w-400" class="item" effect="dark" :content="movieAreaGradeVo.areaA || ''" placement="bottom">
                        <span class="c-s-title f-w-b">{{movieAreaGradeVo.areaAStr || ""}}</span>
                      </el-tooltip>
                    </div>
                    <div class="cinema-stock-scan-table">
                      <el-table :data="priceList" border>
                        <el-table-column prop="minPrice" label="最低票价">
                          <template slot-scope="scope">
                            ￥{{scope.row.minPrice}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="dateStart" label="有效期" width="199">
                          <template slot-scope="scope">
                            <span class="date-css">{{getDateFatFun(scope.row.dateStart.replace(/-/g, '/'))}} ~ {{getDateFatFun(scope.row.dateEnd.replace(/-/g, '/'))}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </div>

                <div class="m-t-10">
                  <el-form-item label-width="0px">
                    <div class="f-12 label-color">
                      <span class="c-s-title f-w-b">B类城市（{{movieAreaGradeVo.areaGradeListB?movieAreaGradeVo.areaGradeListB.length:""}}）：</span>
                      <el-tooltip popper-class="w-400" class="item" effect="dark" :content="movieAreaGradeVo.areaB || ''" placement="bottom">
                        <span class="c-s-title f-w-b">{{movieAreaGradeVo.areaBStr || ""}}</span>
                      </el-tooltip>
                    </div>
                    <div class="cinema-stock-scan-table">
                      <el-table :data="priceListB" border>
                        <el-table-column prop="minPrice" label="最低票价">
                          <template slot-scope="scope">
                            ￥{{scope.row.minPrice}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="dateStart" label="有效期" width="199">
                          <template slot-scope="scope">
                            <span class="date-css">{{getDateFatFun(scope.row.dateStart.replace(/-/g, '/'))}} ~ {{getDateFatFun(scope.row.dateEnd.replace(/-/g, '/'))}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </div>

                <div class="m-t-10">
                  <el-form-item label-width="0px">
                    <div class="f-12 label-color">
                      <span class="c-s-title f-w-b">C类城市：</span>
                      <span class="c-s-title f-w-b">除A类、B类所有城市外默认都归为C类</span>
                    </div>
                    <div class="cinema-stock-scan-table">
                      <el-table :data="priceListC" border>
                        <el-table-column prop="minPrice" label="最低票价">
                          <template slot-scope="scope">
                            ￥{{scope.row.minPrice}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="dateStart" label="有效期" width="199">
                          <template slot-scope="scope">
                            <span class="date-css">{{getDateFatFun(scope.row.dateStart.replace(/-/g, '/'))}} ~ {{getDateFatFun(scope.row.dateEnd.replace(/-/g, '/'))}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </div>

                <div class="m-t-10">
                  <el-form-item label-width="0px">
                    <div class="f-12 label-color">
                      <span class="c-s-title f-w-b">发行方分账：</span>
                    </div>
                    <div class="cinema-stock-scan-table">
                      <el-table :data="rateList" stripe border style="width: 100%">
                        <el-table-column prop="rate" label="比例">
                          <template slot-scope="scope">
                            {{scope.row.rate}}%
                          </template>
                        </el-table-column>
                        <el-table-column prop="dateStart" label="有效期" width="199">
                          <template slot-scope="scope">
                            <span class="date-css">{{getDateFatFun(scope.row.dateStart.replace(/-/g, '/'))}} ~ {{getDateFatFun(scope.row.dateEnd.replace(/-/g, '/'))}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-form-item>
                </div>
              </div>

            </el-form>
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item title="详细信息" name="2">
          <div class="basic-info">
            <el-form ref="form" :model="sizeForm" label-width="85px" size="small" inline>
              <div>
                <el-form-item label="发行商：">
                  <span class="download-film-scan-text">
                    {{sizeForm.publisher}}
                  </span>
                </el-form-item>
                <el-form-item label="导演：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieDirect}}
                  </span>
                </el-form-item>

              </div>
              <div>
                <el-form-item label="主演：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieActor}}
                  </span>
                </el-form-item>

                <el-form-item label="其他演员：">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieOtherActor}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="评分：">
                  <span class="download-film-scan-text">
                    {{sizeForm.score}}
                  </span>
                </el-form-item>
                <el-form-item label="一句话点评：">
                  <span class="download-film-scan-text">
                    {{sizeForm.comment}}
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="简介：" prop="desc">
                  <span class="download-film-scan-text">
                    {{sizeForm.movieDesc}}
                  </span>
                </el-form-item>
              </div>

              <div class="movie-picture">
                <el-form-item label="影片图片：">

                  <div class="main-container">

                    <el-button circle :disabled="leftDisabled" class="arrow-left" icon="el-icon-arrow-left" @click="handleCarousel(true)"></el-button>
                    <el-button circle :disabled="rightDisabled" class="arrow-right" icon="el-icon-arrow-right" @click="handleCarousel(false)"></el-button>

                    <div class="carousel-container">
                      <ul class="carousel" ref="carousel">
                        <li class="carousel-item" v-for="innerItem in movieFileList" :key="innerItem.index">
                          <el-popover :visible-arrow='false' placement="top">
                            <img :src="innerItem.relativePath" :alt="innerItem.name">
                            <img class="inner-img" slot="reference" :src="innerItem.relativePath" :alt="innerItem.name">
                          </el-popover>
                        </li>
                      </ul>
                    </div>

                  </div>
                </el-form-item>
              </div>

            </el-form>
          </div>
        </el-collapse-item> -->
      </el-collapse>

    </div>
    <div class="more-info" @click="moreInfoChange()">
      更多信息...
    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    <!-- <film-detail></film-detail> -->
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button type="primary" @click="goEdit">编辑</el-button>
        <el-button @click="cancelFun">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import FixStepTool from "ctm/components/fix-step-tool/fix-step-tool"
import fixStepMixin from "ctm/mixins/fixStepTool"
import filmDetail from "frame_cpm/views/film/filmDetail.vue"
import { cpmFilmget, getByCode } from "frame_cpm/http/interface.js";
export default {
  data () {
    return {
      //业务部分
      movieAreaGradeVo: {},
      priceList: [],
      priceListB: [],
      priceListC: [],
      rateList: [],
      sizeForm: {
      },
      movieLanguages: [],
      noDatadialogVisible: false,
      //交互部分
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
          // {
          //     name: "详细信息",
          //     isactive: false
          // },
        ]
      },
      // ***/
      activeNames: ['1', '2', '3'],
      leftDisabled: false,
      rightDisabled: true,

      //影片剧照list
      movieFileList: [{
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'
      },
      {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      },
      {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      }
        , {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      },
      {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      },
      {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      },
      {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      },
      {
        relativePath: 'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
        name: '大嘴巴子'

      }]
    };
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool,
    filmDetail
  },
  methods: {
    moreInfoChange () {
      //有数据再跳转
      // console.log('this.getInfo:',this.getInfo())
      this.getInfo()
      if (!this.noDatadialogVisible) {
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
      let _this = this
      let idCache = this.sizeForm.movieCode;
      getByCode({ code: idCache })
        .then((ret) => {
          if (!!ret.data && !!ret.data.id) {
            //  console.log('1')
            //  _this.$cpmList
            cpmFilmget({ id: ret.data.id })
              .then((retInner) => {
                // console.log('2')
                if (retInner.code === 200) {
                  _this.noDatadialogVisible = true
                }
              })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //日期格式化方法
    getDateFatFun (val) {
      let result
      if (val) {
        result = val.substring(0, 10)
      }
      return result

    },
    getDatas () {
      let self = this;
      console.log('self.$route.params.movieId', this.$route.query.movieId)
      let data = {
        movie_code: self.$route.query.movieId,
      };
      self.$ctmList
        .DownloadmovieScan(data)
        .then(ret => {
          console.log("retsssssssssss", ret.data);
          if (ret.data) {
            let result = ret.data;
            let movieLanguagesArr = []
            if (result.movieLanguages.length > 0) {
              result.movieLanguages.forEach((item, index) => {
                movieLanguagesArr.push(item.languageName)
              })
            }
            self.movieLanguages = movieLanguagesArr.join('、')
            self.sizeForm = result.schBashMovie;
            self.priceList = result.priceList;
            self.rateList = result.rateList;
            self.priceListB = result.priceListB;
            self.priceListC = result.priceListC;

            let arr = result.movieAreaGradeVo.areaGradeListA;
            let str = ""
            arr.forEach((item, index) => {
              if (index != arr.length - 1) {
                str = str + item.areaName + ","
              } else {
                str = str + item.areaName
              }
            })
            result.movieAreaGradeVo.areaAStr = str + "共" + arr.length + "个城市";
            result.movieAreaGradeVo.areaA = str;
            //重置str
            str = "";
            if (arr.length > 4) {
              result.movieAreaGradeVo.areaAStr = arr[0].areaName + "," + arr[1].areaName + "," + arr[2].areaName + "," + arr[3].areaName + "共" + arr.length + "个城市"
            }
            let arr1 = result.movieAreaGradeVo.areaGradeListB;
            arr1.forEach((item, index) => {
              if (index != arr1.length - 1) {
                str = str + item.areaName + ","
              } else {
                str = str + item.areaName
              }
            })
            // str = str + "共" + arr1.length + "个城市";
            result.movieAreaGradeVo.areaBStr = str + "共" + arr1.length + "个城市";
            result.movieAreaGradeVo.areaB = str;
            if (arr1.length > 4) {
              result.movieAreaGradeVo.areaBStr = arr1[0].areaName + "," + arr1[1].areaName + "," + arr1[2].areaName + "," + arr1[3].areaName + "共" + arr1.length + "个城市"
            }
            self.movieAreaGradeVo = result.movieAreaGradeVo;

          }

        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    goEdit () {
      let _this = this
      this.$router.push({
        path: "edit",
        query: {
          movieId: this.$route.query.movieId,
        }
      });
    },
    cancelFun () {
      this.$router.push({
        path: "list",
      });
    },
    //图片动画部分***************************/
    handleCarousel (isLeft) {
      let current = this.$refs.carousel.style.transform.replace(/[^0-9\-,]/g, '')
      let width = this.$refs.carousel.childNodes[0].offsetWidth
      if (isLeft) {
        // 左
        if ((this.$refs.carousel.childNodes.length - 5) * width == -current) {
          this.leftDisabled = true
        }
        if ((this.$refs.carousel.childNodes.length - 4) * width == -current) {
          return
        }
        this.rightDisabled = false
        this.$refs.carousel.style.transform = `translateX(${Number(current) - width}px)`
      } else {
        // 右
        if (-current <= width) {
          this.rightDisabled = true
        }
        if (current >= 0) {
          return
        }
        this.leftDisabled = false
        this.$refs.carousel.style.transform = `translateX(${Number(current) + width}px)`

      }

    }
    // ***************************************/
  },
  created () {
    let self = this;
    self.getDatas()
    // self.movieId = 

  }
};
</script>
<style lang="scss">
.download-film-scan-wrap {
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
  .more-info {
    color: #3b74ff;
    cursor: pointer;
  }
  .el-collapse-item__header::after {
    height: 0px !important;
  }
  .download-film-scan-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    // position: fixed;
    // z-index: 999;
    // bottom: 0;
    // right: 0;
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
  .el-collapse-item__content {
    padding-bottom: 0px;
  }
  .basic-info {
    .el-table th {
      background-color: #e7ebff;
    }
    // width: 884px;
    margin-left: 22px;
    .cinema-stock-scan-table {
      // .el-table--group::after, .el-table--border::after{
      //   width: 0px
      // }
      width: 400px;
    }
    .el-form-item--small.el-form-item {
      // margin-bottom: 18px;
      // display: inline-block;
      width: 420px;
      margin-right: 48px;
    }
    .el-form-item--small.el-form-item.textarea-item {
      width: 840px;
      .el-form-item__content {
        width: 640px;
      }
    }
    .movie-picture {
      .el-form-item--small.el-form-item {
        // margin-bottom: 18px;
        // display: inline-block;
        width: 680px;
        margin-right: 48px;
      }
    }
    .el-form-item--small.el-form-item:nth-of-type(even) {
      margin-right: 0px;
    }
    .el-table {
      .date-css {
        font-size: 12px;
        color: #666;
      }
      &::before {
        height: 0;
      }
      tr:nth-child(1n) {
        background-color: #fff;
        &:hover > td {
          background-color: #fff;
        }
      }
      tr:nth-child(2n) {
        background-color: #f5f5f5;
        &:hover > td {
          background-color: #f5f5f5;
        }
      }
      th,
      td {
        padding: 0;
        height: 38px;
        line-height: 38px;
        box-sizing: border-box;
        border: none;
      }
      th {
        // background-color: rgb(242, 244, 253);
      }
      .el-table__header-wrapper {
        background-color: rgb(242, 244, 253);
      }
      .has-gutter {
        .cell {
          color: #333;
        }
      }
      .cell {
        font-size: 12px;
        color: #666;
      }
    }
    .el-form-item__label {
      font-size: 12px;
      text-align: left;
      color: #666666;
    }
    .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
    }
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-form-item__label {
      font-size: 12px;
    }

    .download-film-scan-text {
      font-size: 12px;
      color: #666666;
      width: 360px;
    }
    //影片剧照list
    .main-container {
      position: relative;
      width: 100%;
      .carousel-container {
        overflow: hidden;
        width: 92%;
        margin: 0 auto;
        .carousel {
          transition: transform 1s;
          list-style: none;
          white-space: nowrap;
          width: 100%;
          .carousel-item {
            display: inline-block;
            padding: 5px;
            width: calc(25% - 10px);
            height: 200px;
            .inner-img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .el-button {
        position: absolute;
        top: 50%;
        z-index: 10;
        transform: translateY(-50%);
      }
      .arrow-left {
        left: 0;
      }
      .arrow-right {
        right: 0;
      }
    }
    // ****************************************
    .separate-accounts-date,
    .separate-accounts-price,
    .separate-accounts-action {
      display: inline-block;
      //   height: 32px;
    }
    .separate-accounts-price {
      width: 83px;
      .el-input--small {
        width: 46px;
      }
      span {
        font-size: 12px;
        color: #666666;
      }
    }
    .separate-accounts-date {
      width: 224px;
      margin-left: -12px;
      span {
        font-size: 12px;
        color: #666666;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 196px;
      }
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
  .account-fenge {
    .el-form-item__label {
      color: #333333;
      font-weight: 600;
    }
  }
  .film-info-save {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .el-collapse {
    border-bottom: none;
    // padding-bottom: 64px;
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
