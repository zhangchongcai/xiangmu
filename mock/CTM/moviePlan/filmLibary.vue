<template>
<section class="flex-base" v-bind:style="{width:width + 'px'}">
    <div class="library-to-left flex-base" v-on:click="scroll" data-control="left">
        <i class="iconfont icon-neiye-qiehuanzuojiantou" v-bind:style="{color: btn.l_btn_color}" data-control="left"></i>
    </div>
    <div class="film-libary" v-bind:style="{width: width - (2*config.btn_width + config.margin_left +config.margin_right) + 'px'}">
        <ul class="content flex-base" v-bind:style="{left: config.left + 'px'}">
            <el-tooltip placement="bottom" v-for="(film,film_index) in films" v-bind:key="film_index">
                <div slot="content" class="tool-tips">
                    <div>{{film.movieName}} ({{film.disversion}}/{{film.language}}) {{film.timeLong}}分钟</div>
                    <div>
                        <div>大盘数据：</div>
                        <div>全国累积票房：<span>{{film.boxOffice}}</span></div>
                        <div>全国排片率：<span>{{film.countrySeatRate}}</span></div>
                        <div>周围影城排片率：<span>{{film.hallSeatRate}}</span></div>
                    </div>
                </div>
                    <li class="flex-base film-item" v-bind:class="{isSelect: film.select}" v-bind:data-baseMovieUid="film.baseMovieUid" v-on:click="selectMovie">
                        <div class="line" v-bind:style="{background:film.color}"></div>
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
    <div class="library-to-right flex-base" v-on:click="scroll" data-control="right">
        <i class="iconfont icon-neiye-qiehuanyoujiantou" v-bind:style="{color: btn.r_btn_color}" data-control="right"></i>
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
        }
    },
    data() {
        return {
            config: {
                btn_width: 50,
                margin_right: 8,
                margin_left: 8,
                left: 0,
                moveWidth: 161,
            },
            btn: {
                l_btn_color: '#b7cbfd',
                r_btn_color: '#b7cbfd',
                canUse: '#5f8dfe',
                deault: '#b7cbfd'
            }
        };
    },
    watch: {
        films: function (newVal, oldVal) {
            // 电影内容宽度
            let filmsWidth = newVal.length * this.config.moveWidth;
            // 显示框宽度
            let width = this.width - (2 * this.config.btn_width + this.config.margin_left + this.config.margin_right);
            if (filmsWidth > width) {
                this.btn.r_btn_color = this.btn.canUse;
            }
        }
    },
    mounted() {},
    methods: {
        selectMovie(e) {
            let element, isHasFilmItem, movieUid;
            if (e) {
                element = e.target;
                isHasFilmItem = element.classList.value.indexOf('film-item');
                movieUid = element.dataset.basemovieuid;
                while (isHasFilmItem == -1) {
                    element = element.parentElement;
                    movieUid = element.dataset.basemovieuid;
                    isHasFilmItem = element.classList.value.indexOf('film-item');
                }
            }

            let films = this.films;
            let selectMoive = {};
            let isSelect = false;
            for (let i = 0; i < films.length; i++) {
                if (films[i].baseMovieUid == movieUid && movieUid) {
                    if (films[i].select) {
                        films[i].select = false;
                    } else {
                        films[i].select = true;
                        isSelect = true;
                        selectMoive = films[i];
                    }
                } else {
                    films[i].select = false;
                }
            }
            this.films = films;

            this.$forceUpdate();
            this.$emit("selectMovie", {
                isSelect,
                selectMoive
            });
        },
        scroll(e) {
            if (e.button == 0) {
                let control = e.target.dataset.control;
                let left = this.config.left;
                let moveWidth = this.config.moveWidth;

                // 电影内容宽度
                let filmsWidth = this.films.length * this.config.moveWidth;
                // 显示框宽度
                let width = this.width - (2 * this.config.btn_width + this.config.margin_left + this.config.margin_right);

                // 显示框能显示完整显示几个电影
                let howFilmNum = Math.floor(width / moveWidth);
                // 显示框显示出来的个数
                let moreItemWidth = Math.ceil(width / moveWidth);

                if (control == "left") {
                    left = left + howFilmNum * moveWidth;
                } else if (control == "right") {
                    left = left - howFilmNum * moveWidth;
                }

                // 超出最小限制
                if (left > 0) {
                    left = 0;
                }
                // 超出最大限制
                let round = Math.floor(filmsWidth / width);
                let max_left = -round * howFilmNum * moveWidth;
                if (left < max_left) {
                    left = max_left;
                }

                // 修改左右切换按钮颜色
                if (left < 0) {
                    this.btn.l_btn_color = this.btn.canUse;
                    if (left > max_left) {
                        this.btn.r_btn_color = this.btn.canUse;
                    } else if (left == max_left) {
                        this.btn.r_btn_color = this.btn.deault;
                    }
                } else if (left == 0) {
                    if (filmsWidth > width) {
                        this.btn.l_btn_color = this.btn.deault;
                        this.btn.r_btn_color = this.btn.canUse;
                    } else {
                        this.btn.l_btn_color = this.btn.deault;
                        this.btn.r_btn_color = this.btn.deault;
                    }

                }

                this.config.left = left;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
section {
    height: 54px;
    min-width: 1043px;
    justify-content: flex-start;
    align-items: center;
}

.library-to-left,
.library-to-right {
    width: 50px;
    height: 54px;
    background: #edf1fd;
    text-align: center;
}

.film-libary {
    margin-left: 8px;
    margin-right: 8px;
    min-width: 1044px;
    height: 46px;
    overflow: hidden;
    position: relative;

    ul {
        position: absolute;
        height: 100%;
        justify-content: flex-start;

        li {
            width: 154px;
            height: 100%;
            align-items: flex-start;
            background: #edf1fd;
            margin-right: 7px;

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
            }
        }
    }
}
</style>
