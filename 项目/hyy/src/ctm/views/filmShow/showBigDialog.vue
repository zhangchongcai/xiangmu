<template>
  <div class="my_dialog">
    <el-dialog :visible.sync="dialogTableVisible" title="预览">
      <div class="contain">
        <div class="content-show">
          <ul class="out-carousel">
            <li class="big-carousel">
              <div class="single-carousel" :class="classObject">
                <swiper :options="swiperOption" v-if="planMovieList.length">
                  <swiper-slide v-for="(item,index) in planMovieList" :key="index">
                    <div style="height:238px">
                      <img :src="item.moviePicUrl" alt="">
                    </div>
                    <p class="tip-white">{{item.movieName}}</p>
                    <div class="swiperOption_v">
                      <swiper :options="swiperOptionv">
                        <swiper-slide v-for="(item2,index2) in item.timeList" :key="index2">
                          <div class="flim-Info">
                            <p class="flim-time">{{item2.showTimeStart.slice(-8).slice(0,5)}}</p>
                            <p class="flim-price" v-show="infoShow.seatNum">
                              <span class="price-vip"  v-show="infoShow.seatNum">会员120¥</span>
                              <span class="price-normal"  v-show="infoShow.nonMemberTicket">240¥</span>
                            </p>
                            <p class="fime-type">
                              <span class="type-language">{{item.movieLanguage}}</span>
                              <span class="type-type">{{item. disVersion}}</span>
                              <span class="type-position"  v-show="infoShow.hallName">{{item2.hallName}}</span>
                              <span class="type-price">{{item2.leftSeatNum}} / {{item2.seatNum}}</span>
                            </p>
                          </div>
                        </swiper-slide>
                      </swiper>
                    </div>
                  </swiper-slide>
                </swiper>
              </div>
              <!-- <p class="address-p">地址： www.oristarclound.com/mvs/t1.jsp</p> -->
              <!-- <p class="tip-p">模板编号{{}}</p> -->
            </li>
          </ul>
        </div>
      </div>

    </el-dialog>
  </div>

</template>
<script>
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'
  export default {
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        classObject: {
          balckBgc: false,
          blueBgc: false,
          greenBgc: false,
          redBgc: false
        },
        dialogTableVisible: false,
        templateStyle: {},
        swiperOption: {
          observer: true, //修改swiper自己或子元素时，自动初始化swiper 
          observeParents: true, //修改swiper的父元素时，自动初始化swiper 
          slidesPerView: 5,
          spaceBetween: 15,
          speed: 300,
          // autoplay: { // 自动切换
          //   delay: 2500,
          //   disableOnInteraction: false
          // },
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          // breakpoints: { // 响应布局
          //   1024: {
          //     slidesPerView: 6,
          //     spaceBetween: 40
          //   },
          //   768: {
          //     slidesPerView: 6,
          //     spaceBetween: 30
          //   },
          //   640: {
          //     slidesPerView: 6,
          //     spaceBetween: 20
          //   },
          //   320: {
          //     slidesPerView: 1,
          //     spaceBetween: 10
          //   }
          // }
        },
        swiperOptionv: {
          observer: true, //修改swiper自己或子元素时，自动初始化swiper 
          observeParents: true, //修改swiper的父元素时，自动初始化swiper 
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 10,
            stretch: -10,
            depth: 10,
            modifier: 2,
            slideShadows: true
          },
          speed: 300,
          // autoplay: { // 自动切换
          //   delay: 1000,
          //   stopOnLastSlide: false,
          //   disableOnInteraction: true,
          // },
          loop: true,
          direction: 'vertical',
          // spaceBetween: 20,
        },
        planMovieList: [], // 影片信息
        showList: [], // 显示信息
        infoShow:{
          nonMemberTicket:false, //票价
          memberTicket:false,  //会员价
          hallName:false,  // 影厅名称
          seatNum:false,  // 总座位数
          leftSeatNum:false,  // 剩余座位数
          // movieName:false,  
        }
      }
    },
    methods: {
      getKey(httpObj) { // 获取凭证详情
        this.$ctmList.templatecinemaUid(httpObj).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.planMovieList = res.data.planMovieList;
            this.templateStyle = res.data.template;
            this.classObject[res.data.template.backgroundColor] = true;
            this.showList = res.data.template.columnList
            this.showList.length &&  this.showList.forEach(item =>{
              console.log(item)
              this.infoShow[item] = true
            })
          } else {
            this.error(res.msg)
          }
        })
      }
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .balckBgc {
    // 高端黑
    background-image: linear-gradient(0deg, #1D222D 0%, #51586C 99%);
  }

  .blueBgc {
    // TV蓝
    background-image: linear-gradient(-179deg, #16599F 0%, #1B082D 100%);
  }

  .greenBgc {
    // TV绿
    background-image: linear-gradient(-180deg, #074755 0%, #0A1E39 100%);
  }

  .redBgc {
    // TV红
    background-image: linear-gradient(0deg, #26001B 0%, #961340 99%);
  }

  .my_dialog {
    /deep/ .el-dialog {
      // width: 918px;
      width: 945px;

      .el-dialog__header {
        // display: none;
        padding: 8px 20px;

        .el-dialog__headerbtn {
          top: 10px;
        }
      }

      .el-dialog__body {
        padding: 0;

      }

      img {
        width: 161px;
        height: 238px;
      }

      .contain {
        .header-title {
          display: flex;
          justify-content: center;
          height: 36px;
          line-height: 36px;
          position: relative;

          &::after {
            display: block;
            content: "";
            width: 100%;
            position: absolute;
            height: 1px;
            top: 40px;
          }
        }

        .content-show {
          display: flex;
          justify-content: space-between;

          .out-carousel {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;

            .big-carousel {
              width: 100%;
              // margin: 1em;

              .single-carousel {
                height: 535px;
                overflow: hidden;
                border: 1px solid #333;

                .swiper-slide {
                  padding: 1em;

                  .tip-white {
                    width: 161px;
                    font-family: PingFangSC-Semibold;
                    font-size: 14px;
                    color: #FFFFFF;
                    text-align: center;
                    line-height: 57px;
                    overflow: hidden;
                    /*内容超出宽度时隐藏超出部分的内容 */
                    text-overflow: ellipsis;
                    /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
                    white-space: nowrap;
                    /*不换行 */
                  }
                }

                .swiperOption_v {
                  width: 161px;
                  .swiper-slide {
                    width: 100%;
                    
                    padding: 0;

                    // height: 40px;
                    // background-color: red;
                    .flim-Info {
                      height: 81px;
                      margin-bottom: 20px;
                      border: 2px solid white;
                      position: relative;
                      // padding: 8px;
                      border-radius: 3px;

                      .flim-time {
                        font-size: 24px;
                        font-family: DINAlternate-Bold;
                        color: white;
                        padding: 0.5em;
                      }

                      .flim-price {
                        position: absolute;
                        right: 0;
                        top: 0;

                        .price-vip {
                          display: block;
                          color: #333;
                          font-size: 12px;
                          padding: 2px 4px 2px 8px;
                          background-image: url("./filmShow.png")
                        }

                        .price-normal {
                          display: block;
                          color: white;
                          text-align: right;
                          padding:  2px 4px;
                        }
                      }

                      .fime-type {
                        display: flex;

                        .type-language {
                          background: #FDFF82;
                          border-radius: 4px;
                          color: #000;
                          padding: 0 2px;
                          height: 16px;
                          line-height: 16px;
                          // height: 24px;
                          white-space: nowrap;
                          // line-height: 24px;
                          margin:0 2px;
                        }

                        .type-type {
                          padding: 0 2px;
                          line-height: 16px;
                          background: #181A21;
                          // background: #3F0021;
                          opacity: 0.8;
                          border-radius: 4px;
                          // color: white;
                          white-space: nowrap;
                         height: 16px;
                          line-height: 16px;
                        }

                        .type-position {
                          font-family: PingFangSC-Semibold;
                          font-size: 13px;
                          color: #FFBAC9;
                          padding: 2px;
                          color: #A9B1CE;
                          white-space: nowrap;
                          margin-top: -3px;
                        }

                        .type-price {
                          margin-top: -3px;
                          font-family: DINAlternate-Bold;
                          font-size: 12px;
                          line-height: 24px;
                          color: #FFBAC9;
                          font-size: 12px;
                          color: rgb(100, 106, 118);
                          padding: 0px 0 0 4px;
                        }
                      }

                      // width: 200px;
                      // height: 100px;
                    }
                  }
                }
              }

              .address-p {
                text-align: center;
                height: 24px;
                line-height: 24px;
              }

              .tip-p {
                text-align: center;
                font-weight: 600;
                color: #333;
                font-size: 16px;
                height: 32px;
                line-height: 32px;
              }
            }
          }

        }
      }




    }
  }
</style>