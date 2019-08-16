<template>
    <div class="cinema-select-by-geo">
        <el-button @click="selectedCinema" class="select-cinema-btn">请选择影院</el-button>
        <el-dialog
            custom-class="choose-cinema-by-geo"
            title="选择影院" 
            :visible.sync="cinemaSelDialog"
            @closed="closeCb"
            width="890px"
            >
            <div class="filter-tool">
                <div class="filter-options">
                    <span>省市:</span>
                    <el-select v-model="provinceCodeValue" placeholder="请选择" @change="provinceChange" :disabled="showType == 'view'">
                        <el-option
                        v-for="item in provinceData"
                        :key="item.provinceCode"
                        :label="item.provinceName"
                        :value="item.provinceCode">
                        </el-option>
                    </el-select>
                    <el-select v-model="cityCodeValue" placeholder="请选择" :disabled="showType == 'view'">
                        <el-option
                        v-for="item in cityData"
                        :key="item.cityCode"
                        :label="item.cityName"
                        :value="item.cityCode">
                        </el-option>
                    </el-select>
                </div>
                <div class="filter-options hall-option" v-if="mode != 'view' && showType != 'view'">
                    <span class="break-span">厅数</span>
                    <el-input v-model="hallCountLower"></el-input>
                    <span class="break-span">至</span>
                    <el-input v-model="hallCountUpper"></el-input>
                </div>
                <div class="filter-btn" v-if="showType != 'view' && mode != 'view'">
                    <el-checkbox v-model="isSelected" @change="changeCinemaShow">已选影城</el-checkbox>
                    <el-button type="primary" class="w80-btn" @click="searhCinema">查询</el-button>
                </div>
            </div>
            <ul class="city-cinema" v-loading="loading">
                <li v-for="(city, index) in cinemaData" :key="index" class="city-list">
                    <div class="left-city">
                        <el-checkbox :disabled="mode == 'view' || showType == 'view'" :indeterminate="city.isIndeterminate" v-model="city.checkAll" @change="handleCheckAllChange($event, index)">{{city.cityName}}</el-checkbox>
                    </div>
                    <div class="cinema-list">
                        <el-checkbox-group v-model="city.checkedCinema" @change="cinemaCheckChange($event, index)">
                            <el-checkbox :disabled="mode == 'view' || showType == 'view'" v-for="cinema in city.allCinema"  :label="cinema.cinemaUid" :key="cinema.cinemaUid">{{cinema.cinemaName}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    
                </li>
            </ul>
            <div class="el-dialog__footer">
                <div class="select-type" v-if="showType != 'view'">
                    <div class="footer-btn" @click="selectAll">全选</div>
                    <div class="footer-btn cancel" @click="cancelSelectAll">取消全选</div>
                </div>
                <div class="center-button" v-if="showType != 'view'">
                    <el-button type="primary" @click="saveSelectCinemaData" class="w80-btn">确定</el-button>
                    <el-button @click="cinemaSelDialog = false" class="w80-btn">取消</el-button>
                </div>
                <div class="center-button" v-if="showType == 'view'">
                    <el-button @click="cinemaSelDialog = false" class="w80-btn">关闭</el-button>
                </div>
            </div>
        
            
        </el-dialog>
    </div>
</template>

<script>
import { getCinemaAreaList, getAreaInfo } from 'ctm/http/interface'
import areaDataOrigin from 'ctm/assets/data/area'
    export default {
        props: {
            // 已提交的影城数据
            curCheckedCinema: {
                type: Array,
                required: true
            },
            // 页面模式
            mode: {
                type: String,
                required: true,
                default: 'view'
            },
            showType: {
                type: String,
                required: true,
                default: 'new'
            }
        },
        data() {
            return {
                areaData: [],
                provinceData: [],
                isSelected: false,
                cityData: [],
                cinemaSelDialog: false,
                cinemaData: [],
                cityCodeValue: '',
                provinceCodeValue: '',
                hallCountLower: '',
                hallCountUpper: '',
                loading: true,
                curCtrlCinema: []	
            }
        },
        mounted() {
            
        },
        methods: {
            selectedCinema() {
                // if (mode == 'view') this.isSelected = true
                this.cinemaSelDialog = true
                this.dataInit()
            },
            saveSelectCinemaData() {
                console.log(this.curCtrlCinema)
                this.$emit('changeCurCheckedCinema', this.curCtrlCinema)
                this.cinemaSelDialog = false 
            },
            dataInit() {
                this.curCtrlCinema = JSON.parse(JSON.stringify(this.curCheckedCinema))
                // getAreaInfo({}).then(res => {
                //     if (res.code != 200) return this.error(res.msg)
                //     if (res.code == 200) {
                //         this.areaData = res.data
                //         this.provinceData = [{
                //             provinceCode: '',
                //             provinceName: '全部'
                //         }].concat(res.data.map(item => {
                //             return {
                //                 provinceCode: item.provinceCode,
                //                 provinceName: item.provinceName
                //             }
                //         }))
                //         this.cityData =  [{
                //             cityCode: '',
                //             cityName: '全部'
                //         }]
                //         this.getCinemaAreaList()
                //     }
                // })
                this.areaData = areaDataOrigin
                this.provinceData = [{
                    provinceCode: '',
                    provinceName: '全部'
                }].concat(this.areaData.map(item => {
                    return {
                        provinceCode: item.provinceCode,
                        provinceName: item.provinceName
                    }
                }))
                this.cityData =  [{
                    cityCode: '',
                    cityName: '全部'
                }]
                this.getCinemaAreaList()
            },
            provinceChange(val) {
                if (val == '') {
                    this.cityData =  [{
                            cityCode: '',
                            cityName: '全部'
                        }]
                    return
                }
                let cityData
                this.areaData.some(province => {
                    // console.log(province)
                    if (province.provinceCode == val) {
                        cityData = province.cityVoList.map(item => {
                            return {
                                cityCode: item.cityCode,
                                cityName: item.cityName
                            }
                        })
                        return true
                    }
                })
                this.cityData = [{
                    cityCode: '',
                            cityName: '全部'
                        }].concat(cityData)
                this.cityCodeValue = ''
            },
            getCinemaAreaList() {
                if (!this.loading) {
                    this.loading = true
                }
                getCinemaAreaList({
                    cityCode: this.cityCodeValue,
                    provinceCode: this.provinceCodeValue,
                    hallCountLower: this.hallCountLower,
                    hallCountUpper: this.hallCountUpper
                }).then(res => {
                    if (res.code != 200) {
                        setTimeout(() => {
                            this.loading = false
                        }, 200)
                        return this.error(res.msg)
                        }
                    if (res.code == 200) {
                        setTimeout(() => {
                            this.loading = false
                        }, 200)
                        let city = []
                        
                        res.data.forEach(item => {
                            if (!city.find(city => city.cityCode == item.cityCode) && item.cityCode) {
                                city.push({
                                    cityCode: item.cityCode,
                                    cityName: item.cityName,
                                    allCinema: [],
                                    isIndeterminate: false,
                                    checkedCinema: []
                                })
                            }
                        })
                        // 生成二维影城数据
                        city.forEach(city => {
                            res.data.forEach(item => {
                                if (city.cityCode == item.cityCode) {
                                    city.allCinema.push(item)
                                }
                            })
                        })
                        // 更改勾选状态
                        // isIndeterminate: false,
                        // checkedCinema: []
                        city.forEach(city => {
                            city.allCinemaCopy = JSON.parse(JSON.stringify(city.allCinema))
                            this.curCtrlCinema.forEach(cinema => {
                                if (cinema.cityCode == city.cityCode) {
                                    city.checkedCinema.push(cinema.cinemaUid)
                                }
                            })
                            city.isIndeterminate = (!!city.checkedCinema.length && city.allCinema.length > city.checkedCinema.length)
                            city.checkAll = city.allCinema.length == city.checkedCinema.length
                        })
                        this.cinemaData = city
                        this.isSelected = false
                    }
                })
            },
            changeCinemaShow(val) {
                if (val) {
                    this.cinemaData.forEach(city => {
                        city.allCinema = city.allCinema.filter(item => city.checkedCinema.some(citem => citem == item.cinemaUid))
                        city.checkAll = true
                        city.isIndeterminate = false
                    })
                } else {
                    this.cinemaData.forEach(city => {
                        city.allCinema = JSON.parse(JSON.stringify(city.allCinemaCopy))
                        city.checkAll = city.checkedCinema.length === city.allCinema.length
                        city.isIndeterminate = (!!city.checkedCinema.length && city.checkedCinema.length < city.allCinema.length)
                    })
                }
            },
            // 搜索影院
            searhCinema() {
                this.checkedSearch()
            },
            //  group change
            cinemaCheckChange(val, index) {
                let checkedCount = this.cinemaData[index].checkedCinema.length
                this.cinemaData[index].checkAll = checkedCount === this.cinemaData[index].allCinema.length
                this.cinemaData[index].isIndeterminate = (!!this.cinemaData[index].checkedCinema.length && this.cinemaData[index].checkedCinema.length <  this.cinemaData[index].allCinema.length)
                
                
                let cinemaData = []
                this.cinemaData[index].allCinema.forEach(item => {
                    val.some(citem => {
                        if (citem == item.cinemaUid) {
                            cinemaData.push({
                                cinemaUid: item.cinemaUid,
                                cinemaName: item.cinemaName,
                                cityName: item.cityName,
                                cityCode: item.cityCode,
                                hallCount: item.hallCount
                            })
                            return true
                        }
                    })
                })
                this.curCtrlCinema = this.curCtrlCinema.filter(cinema => cinema.cityCode != this.cinemaData[index].cityCode).concat(cinemaData)

            },
            handleCheckAllChange(val, index) {
                this.cinemaData[index].checkedCinema = val ? this.cinemaData[index].allCinema.map(item => {
                    return item.cinemaUid
                }) : []
                this.cinemaData[index].isIndeterminate = false

                let cinemaData = []
                this.cinemaData[index].allCinema.forEach(item => {
                    this.cinemaData[index].checkedCinema.some(citem => {
                        if (citem == item.cinemaUid) {
                            cinemaData.push({
                                cinemaUid: item.cinemaUid,
                                cinemaName: item.cinemaName,
                                cityName: item.cityName,
                                cityCode: item.cityCode,
                                hallCount: item.hallCount
                            })
                            return true
                        }
                    })
                })
                this.curCtrlCinema = this.curCtrlCinema.filter(cinema => cinema.cityCode != this.cinemaData[index].cityCode).concat(cinemaData)
            },
            checkedSearch() {
                var p1 = new Promise((resolve, reject) => {
                    if (this.hallCountLower == '' && this.hallCountUpper == '' ) {
                        resolve()
                    } else {
                        if (!/^([1-9]\d*|[0]{1,1})$/.test(this.hallCountLower) && this.hallCountLower != '') {
                            reject('最小厅数必须为大于等于0的整数!')
                        } else if (!/^([1-9]\d*|[0]{1,1})$/.test(this.hallCountUpper) && this.hallCountUpper != '') {
                            reject('最大厅数必须为大于等于0的整数!')
                        } else if ((this.hallCountLower > this.hallCountUpper) && (this.hallCountLower != '' && this.hallCountUpper != '')) {
                            reject('最小厅数不得大于最大厅数!')
                        } else {
                            resolve()
                        }
                    }
                    
                })
                Promise.all([p1]).then(() => {
                    this.getCinemaAreaList()
                }).catch(res => {
                    this.error(res)
                })
            },
            closeCb() {
                // console.log('clear')
                this.provinceData = []
                this.cityData = []
                this.curCtrlCinema = []
                this.provinceCodeValue = ''
                this.cityCodeValue = ''
                this.isSelected = false
                this.cinemaData = [] 
                this.loading = true 
            },
            selectAll() {
                // let cinemaData = JSON.parse(JSON.stringify(this.cinemaData))
                this.cinemaData.forEach((city, index) => {
                    city.checkedCinema = city.allCinema.map(item => {
                        return item.cinemaUid
                    })
                    this.cinemaCheckChange(city.checkedCinema, index)
                })
                // this.cinemaData = cinemaData
            },
            cancelSelectAll() {
            //    let cinemaData = JSON.parse(JSON.stringify(this.cinemaData))
                this.cinemaData.forEach((city, index) => {
                    city.checkedCinema = []
                    this.cinemaCheckChange(city.checkedCinema, index)
                })
                // this.cinemaData = cinemaData 
            }
        },
    }
</script>

<style lang="scss">
    .cinema-select-by-geo {
        display: inline-block;
        .select-cinema-btn {
            min-width: 80px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            margin-left: 8px;
            box-sizing: border-box;
            padding: 0 16px;
            border-radius: 4px;
            border: 1px solid #3B74FF;
            background-color: #fff;
            color: #3B74FF;
        }
    }
    .choose-cinema-by-geo {
        height: 580px;
        padding: 20px;
        .el-loading-parent-relative {
            height: 380px;
        }
        .el-dialog__header {
            padding: 0px;
            border-bottom: 1px solid #e5e5e5;
        }
        .el-dialog__body {
            padding: 0px;
            position: relative;
            height: 490px;
            box-sizing: border-box;
            .el-dialog__footer {
                padding: 12px 0 0 0;
                border-top: 1px solid #e5e5e5;
                position: absolute;
                bottom: 12px;
                left: 0px;
            }
        }
        
        .filter-tool {
            height: 36px;
            line-height: 36px;
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 44px;
            .filter-options {
                float: left;
                font-size: 12px;
                margin-right: 16px;
                &.hall-option {
                    .el-input {
                        width: 80px;
                        height: 32px;
                    }
                    .break-span {
                        margin: 0 10px;
                    }
                }
                .el-select {
                    width: 128px;
                    height: 32px;
                    margin-left: 8px;
                }
            }
            .filter-btn {
                float: right;
                height: 32px;
                .el-checkbox {
                    float: left;
                    .el-checkbox__label {
                        font-size: 12px;
                    }
                    .el-checkbox__inner {
                        width: 12px;
                        height: 12px;
                    }
                    .el-checkbox__inner::after {
                        left: 3px;
                        top: 0px;
                    } 
                }
                .el-button {
                    display: block;
                    float: left;
                    span {
                        font-size: 12px;
                    }
                }
            }
        }
        .city-cinema {
            margin-bottom: 50px;
            height: 300px;
            overflow-y: scroll;
            .city-list {
                margin-bottom: 35px;
                overflow: hidden;
                .left-city {
                    width: 64px;
                    margin-right: 16px;
                    float: left;
                    .el-checkbox span {
                        vertical-align: top;
                        &.el-checkbox__label {
                            white-space: normal;
                        }
                    }
                }
                .cinema-list {
                    min-height: 32px;
                    float: left;
                    width: 700px;
                    border-bottom: 1px solid #f5f5f5;
                    .el-checkbox {
                        float: left;
                        height: 16px;
                        margin-bottom: 15px;
                        span {
                            vertical-align: top;
                        }
                    } 
                }
                .el-checkbox__label {
                    font-size: 12px;
                }
                .el-checkbox__inner {
                    width: 12px;
                    height: 12px;
                }
                
                .el-checkbox__inner::after {
                    left: 3px;
                    top: 0px;
                }
            }
        }
        .w80-btn {
            width: 80px;
            height: 32px;
            box-sizing: border-box;
        }
        .el-dialog__footer {
            width: 100%;
            padding: 0;
            box-sizing: border-box;
            position: absolute;
            bottom: 0px;
            left: 0;
            .select-type {
                position: absolute;
                width: 170px;
                left: 20px;
                bottom: 0;
                height: 40px;
                padding-top: 4px;
                box-sizing: border-box;
                .footer-btn {
                    font-size: 12px;
                    float: left;
                    min-width: 64px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    cursor: pointer;
                    margin-right: 8px;
                    box-sizing: border-box;
                    padding: 0 12px;
                    border-radius: 4px;
                    border: 1px solid #3B74FF;
                    background-color: #fff;
                    color: #3B74FF;
                    &.cancel {
                        background: #FFFFFF;
                        border: 1px solid #BCBCBC;
                        color: #666666;
                    }
                }
                
            }
            
        }
    }
    
</style>