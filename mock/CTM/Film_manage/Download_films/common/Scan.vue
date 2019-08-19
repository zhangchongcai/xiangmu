<template>
  <div class="download-film-scan-wrap">
    <div class="download-film-scan-content">
      <el-collapse
        v-model="activeNames"
      >
        <el-collapse-item
          title="基础信息"
          name="1"
        >
          <div class="basic-info">
            <el-form
              ref="form"
              :model="sizeForm"
              label-width="85px"
              size="small"
            >
              <el-form-item label="影片名称：">
                <span class="download-film-scan-text">
                  {{sizeForm.movieName}}
                </span>
              </el-form-item>
              <el-form-item label="影片语言：">
                <span class="download-film-scan-text">
                  {{sizeForm.movieDescLanguage}}
                </span>
              </el-form-item>
              <el-form-item label="发行版本：">
                <span class="download-film-scan-text">
                  {{sizeForm.disVersion}}
                </span>

              </el-form-item>
              <el-form-item label="影片编码：">
                <span class="download-film-scan-text">
                  {{sizeForm.movieCode}}
                </span>

              </el-form-item>
              <el-form-item label="影片产地：">
                <span class="download-film-scan-text">
                 {{sizeForm.movieArea}}
                </span>

              </el-form-item>
              <el-form-item label="影片分类：">
                <span class="download-film-scan-text">
                  {{sizeForm.movieClass}}
                </span>
              </el-form-item>
              <el-form-item label="影片英文名：">
               <span class="download-film-scan-text">
                  {{sizeForm.movieEnglishName}}
                </span>
              </el-form-item>
              <el-form-item label="点影信息：">
                <span class="download-film-scan-text">
                  {{sizeForm.pointInformation}}
                </span>
              </el-form-item>
              <el-form-item label="影片时长：">
                <span class="download-film-scan-text">
                  {{sizeForm.timeLong}}
                </span>
              </el-form-item>
              <el-form-item label="影片别名：">
               <span class="download-film-scan-text">
                 {{sizeForm.movieOtherName}}
                </span>
              </el-form-item>
              <el-form-item label="首映日期：">
               <span class="download-film-scan-text">
                {{sizeForm.dateShowFirst}}
                </span>
              </el-form-item>
              <el-form-item label="下映日期：">
               <span class="download-film-scan-text">
                 {{sizeForm.dateShowOff}}
                </span>
              </el-form-item>
               <el-form-item label="帧数：">
               <span class="download-film-scan-text">
                  {{sizeForm.frameNumber}}
                </span>
              </el-form-item>
              <el-form-item label="影片字幕：">
                <span class="download-film-scan-text">
                  {{sizeForm.filmCaption}}
                </span>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
        <!-- ********************************************************************************************* -->
        <el-collapse-item
          title="详细信息"
          name="2"
        >
          <div class="basic-info">
            <el-form
              ref="form"
              :model="sizeForm"
              label-width="85px"
              size="small"
            >
             
              <el-form-item label="发行商：">
                <span class="download-film-scan-text">
                  {{sizeForm.publisher}}
                </span>
              </el-form-item>
              <el-form-item label="主演：">
                 <span class="download-film-scan-text">
                  {{sizeForm.movieActor}}
                </span>
              </el-form-item>
              <el-form-item label="评分：">
                 <span class="download-film-scan-text">
                  {{sizeForm.score}}
                </span>
              </el-form-item>
              <el-form-item label="影片级别：">
                 <span class="download-film-scan-text">
                  {{sizeForm.movieLevel}}
                </span>
              </el-form-item>
              <el-form-item label="导演：">
                <span class="download-film-scan-text">
                 {{sizeForm.movieDirect}} 
                </span>
              </el-form-item>
              <el-form-item label="其他导演：">
                 <span class="download-film-scan-text">
                  {{sizeForm.movieOtherActor}}
                </span>
              </el-form-item>
              <el-form-item label="一句话点评：">
                 <span class="download-film-scan-text">
                  {{sizeForm.comment}}
                </span>
              </el-form-item>
              <el-form-item
                label="简介："
                prop="desc"
              >
                <span class="download-film-scan-text">
                 {{sizeForm.movieDesc}}
                </span>
              </el-form-item>
              <el-form-item label="影片图片：">
                  <!-- <div class="download-film-scan-imgList">
                      <img src="http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png" >
                  </div> -->
                  <div class="main-container">

                <el-button circle :disabled="leftDisabled" class="arrow-left" icon="el-icon-arrow-left" @click="handleCarousel(true)"></el-button>
                <el-button circle :disabled="rightDisabled" class="arrow-right" icon="el-icon-arrow-right" @click="handleCarousel(false)"></el-button>

                <div class="carousel-container">
                    <ul class="carousel" ref="carousel">
                        <li class="carousel-item" v-for="innerItem in movieFileList" :key="innerItem.index">
                            <el-popover  :visible-arrow='false' placement="top">
                                <img :src="innerItem.relativePath" :alt="innerItem.name">
                                <img class="inner-img" slot="reference" :src="innerItem.relativePath" :alt="innerItem.name">
                            </el-popover>
                        </li>
                    </ul>
                </div>

            </div>
              </el-form-item>
              
            </el-form>
          </div>
          </el-collapse-item>
        
      </el-collapse>
    </div>
     <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>
<script>
import FixStepTool from "../../../../../components/fix-step-tool/fix-step-tool"
import fixStepMixin from "../../../../../mixins/CTM/fixStepTool.js"
export default {
  data() {
    return {
      //业务部分
      priceList:[],
      rateList:[],
      sizeForm: {
          },
           //交互部分
     stepData: {
                stepEl: ".el-collapse-item",
                stepList: [
                    {
                        name: "基础信息",
                        isactive: false
                    },
                    {
                        name: "详细信息",
                        isactive: false
                    },
                ]
            },
      // ***/
      activeNames:'1',
      leftDisabled: false,
      rightDisabled: true,
     
      //影片剧照list
      movieFileList:[{
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'
      },
      {
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      },
      {
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      }
      ,{
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      },
      {
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      },
       {
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      },
       {
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      },
       {
          relativePath:'http://5b0988e595225.cdn.sohucs.com/images/20171205/221f8e0cc59c49a8922d1afcf2401e2f.png',
          name:'大嘴巴子'

      }]
    };
  },
  mixins: [fixStepMixin],
  components: {
        fixStepTool: FixStepTool
    },
  methods:{
     getDatas() {
      let self = this;
      console.log('self.$route.params.movieId',this.$route.query.movieId)
      let data = {
        movie_code: self.$route.query.movieId,
      };
      self.$api
        .DownloadmovieScan(data)
        .then(ret => {
          console.log("retsssssssssss", ret.data);
          if(ret.data){
            let result = ret.data;
            self.sizeForm = result.schBashMovie;
            self.priceList = result.priceList;
            self.rateList = result.rateList;
          }
          
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //图片动画部分***************************/
       handleCarousel(isLeft) {
                let current = this.$refs.carousel.style.transform.replace(/[^0-9\-,]/g, '')
                let width = this.$refs.carousel.childNodes[0].offsetWidth
                if(isLeft) {
                    // 左
                    if((this.$refs.carousel.childNodes.length - 5) * width == -current) {
                        this.leftDisabled = true
                    }
                    if((this.$refs.carousel.childNodes.length - 4) * width == -current) {
                        return
                    }
                    this.rightDisabled = false
                    this.$refs.carousel.style.transform = `translateX(${Number(current) - width}px)`
                }else {
                    // 右
                    if(-current <= width) {
                        this.rightDisabled = true
                    }
                    if(current >= 0) {
                        return
                    }
                    this.leftDisabled = false
                    this.$refs.carousel.style.transform = `translateX(${Number(current) + width}px)`

                }

            }
            // ***************************************/
  },
  created(){
    let self = this;
    self.getDatas()
    // self.movieId = 
    
  }
};
</script>
<style lang="scss">
.download-film-scan-wrap {
  width: 100%;
  .download-film-scan-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .basic-info {
    width: 884px;
    margin-left: 30px;
    .el-form-item__label {
      font-size: 12px;
      text-align: left;
    }
     .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
    }
    .download-film-scan-table{
        width: 680px;
    }
    .el-form-item__label {
      font-size: 12px;
    }
   
    .download-film-scan-text {
      font-size: 12px;
      color: #808080;
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
  .film-info-save {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    margin: 0 8px 0;
    transform: rotate(-90deg);
  }
  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
  }
  .el-collapse-item__wrap {
    border: 1px solid #ffffff;
  }
}
</style>
