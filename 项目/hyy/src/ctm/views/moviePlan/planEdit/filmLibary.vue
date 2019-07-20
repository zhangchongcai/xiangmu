<template>
    <section class="film-container">
        <div class="library-to-left flex-base" @click="scroll" data-control="left" :class="this.clickable.left ? '' : 'disable'">
            <i class="iconfont icon-neiye-qiehuanzuojiantou" data-control="left"></i>
        </div>
        <div class="film-libary" ref="filmLibary">
            <ul class="content flex-base" :style="{left: config.left + 'px', width: config.filmsWidth + 'px'}" ref="filmsContent">
                <el-tooltip placement="bottom" v-for="(film,film_index) in filmsData" :key="film_index">
                    <div slot="content" class="plan-tool-tips">
                        <div>{{film.movieName}} ({{film.disversion}}/{{film.language}}) {{film.timeLong}}分钟</div>
                        <!-- <div>
                            <div>大盘数据：</div>
                            <div>全国累积票房：<span class="font-bold">{{film.boxOffice}}</span></div>
                            <div>全国排片率：<span class="font-bold">{{film.countrySeatRate}}</span></div>
                            <div>周围影城排片率：<span class="font-bold">{{film.hallSeatRate}}</span></div>
                        </div> -->
                    </div>
                    <li class="flex-base film-item" :class="{isSelect: film.select}" @click="selectMovie(film.id)">
                        <div class="line" :style="{background:film.color}"></div>
                        <div class="film-content flex-base">
                            <div :title="film.movieName" class="text-hide">{{film.movieName}}</div>
                            <div class="flex-base">
                                <div :title="film.disversion +'/'+ film.language" class="text-hide">({{film.disversion}}/{{film.language}})</div>
                                <div :title="film.timeLong+'分钟'">{{film.timeLong}}分钟</div>
                            </div>
                        </div>
                    </li>
                </el-tooltip>
            </ul>
        </div>
        <div class="library-to-right flex-base" @click="scroll" data-control="right" :class="this.clickable.right ? '' : 'disable'">
            <!-- <i class="iconfont icon-neiye-qiehuanyoujiantou" :style="{color: btn.r_btn_color}" data-control="right"></i> -->
            <i class="iconfont icon-neiye-qiehuanyoujiantou" data-control="right"></i>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        films: {
            type: Array,
            required: true,
            default: []
        },
        width: {
            type: Number,
            required: true,
            default: null
        },
        mode: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            config: {
                left: 0,
                movieWidth: 162, // (154 + 8)
                filmsWidth: 0   // 电影总区域
            },
            btn: {
                l_btn_color: '#b7cbfd',
                r_btn_color: '#b7cbfd',
                canUse: '#5f8dfe',
                deault: '#b7cbfd'
            },
            // 控制左右点击次数
            clickable: {
                left: 0,
                right: 0
            },
            filmsData: []
        }
    },
    watch: {
        films: function (newVal, oldVal) {
            this.filmsData = newVal
            this.checkBtnStatus()
        }
    },
    mounted() {
        window.onresize = () => {
            this.checkBtnStatus()
        }
    },
    updated() {
        
    },
    methods: {
        checkBtnStatus() {
            let allWidth = this.$refs.filmLibary.offsetWidth, filmsWidth = this.films.length * this.config.movieWidth, showMovieNum = Math.floor(allWidth / this.config.movieWidth)
            this.config.left = 0
            this.config.filmsWidth = filmsWidth
            if (filmsWidth < allWidth) {
                this.clickable = {
                    left: 0,
                    right: 0
                }
            } else {
                this.clickable = {
                    left: 0,
                    right: Math.floor(filmsWidth / (showMovieNum * this.config.movieWidth))
                }
            }
        },
        selectMovie(id) {
            if (!this.mode) return
            let films = JSON.parse(JSON.stringify(this.filmsData)), selectMoive = {}, isSelect = false
            films.forEach(film => {
                
                if (film.id == id) {
                    isSelect = !film.select
                    film.select = !film.select
                    selectMoive = film
                } else {
                    film.select = false
                }
            })
            this.filmsData = films

            this.$forceUpdate()
            console.log(selectMoive)
            this.$emit('selectMovie', {
                isSelect,
                selectMoive
            })
        },
        scroll(e) {
            if (e.button == 0) {
                // debugger
                let control = e.target.dataset.control, left = this.config.left, movieWidth = this.config.movieWidth

                // 电影内容总宽度
                let filmsWidth = this.films.length * this.config.movieWidth
                // 显示框宽度
                let width = this.$refs.filmLibary.offsetWidth
                
                // 显示框能显示完整显示几个电影
                let showMovieNum = Math.floor(width / movieWidth)

                if (control == "left") {
                    if (!this.clickable.left) return
                    left += showMovieNum * movieWidth
                    this.clickable.left -= 1
                    this.clickable.right += 1
                } else if (control == "right") {
                    if (!this.clickable.right) return
                    left -= showMovieNum * movieWidth
                    this.clickable.right -= 1
                    this.clickable.left += 1
                }
                // 超出最小限制
                left = left > 0 ? 0 : left
                // 超出最大限制
                let round = Math.floor(filmsWidth / (showMovieNum * movieWidth))
                let max_left = -round * showMovieNum * movieWidth
                if (left < max_left) {
                    left = max_left
                }

                this.config.left = left
            }
        }
    },
    beforeDestroy() {
        window.onresize = null
    }
};
</script>

<style lang="scss" scoped>
section {
    height: 54px;
    // min-width: 1043px;
    width: 100%;
    background-color: #EDF1FD;
    box-sizing: border-box;
    padding: 0 50px;
    position: relative;
    .library-to-left,
    .library-to-right {
        width: 50px;
        height: 54px;
        background: #edf1fd;
        text-align: center;
        position: absolute;
        top: 0;
        cursor: pointer;
        .icon-neiye-qiehuanzuojiantou, .icon-neiye-qiehuanyoujiantou {
            color: #5f8dfe;
        }
        &.disable {
            cursor: default;
            .icon-neiye-qiehuanzuojiantou, .icon-neiye-qiehuanyoujiantou {
                color: #b7cbfd; 
            }
        }
    }
    .library-to-left {
        left: 0;
        
    }
    .library-to-right {
        right: 0;
        // box-shadow: -4px 0 5px 0 rgba(0,0,0,0.11);
        box-shadow: -4px 0px 10px -4px rgba(0, 0, 0, 0.11);
    }
}




.film-libary {
    width: 100%;
    height: 54px;
    padding-top: 4px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    ul {
        position: absolute;
        height: 46px;
        justify-content: flex-start;
        transition: left .5s;
        min-width: 100%;
        li {
            width: 154px;
            height: 100%;
            align-items: flex-start;
            background: #edf1fd;
            margin-right: 8px;

            .line {
                width: 3px;
                height: 100%;
            }

            .film-content {
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                height: 100%;
                width: 151px;
                background-color: #fff;
                &>div {
                    margin-left: 10px;
                }

                &>div:nth-of-type(1) {
                    font-size: 12px;
                    color: #333333;
                    font-weight: bold;
                    margin-bottom: 6px;
                    max-width: 80%;
                }

                &>div:nth-of-type(2) {
                    div {
                        font-size: 12px;
                        color: #333333;
                    }

                    div:nth-of-type(1) {
                        max-width: 50%;
                    }

                    div:nth-of-type(2) {
                        margin-left: 20px;
                    }
                }
            }
        }

        .isSelect {
            background: #3B74FF;

            .line {
                background: #3B74FF !important;
            }

            div {
                color: #ffffff !important;
                background-color: #3B74FF;
            }
        }
    }
}

</style>
