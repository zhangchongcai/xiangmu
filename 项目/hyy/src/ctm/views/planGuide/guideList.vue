<template>
    <div class="plan-guide-list">
        <div class="header-filter-container">
            <div class="filter-option filter-pick-time"><span>适用日期:</span>
             <el-date-picker
                @change="timeValueChange"
                v-model="timeValue"
                type="daterange"
                value-format="yyyy-MM-dd"
                clearable
                :editable="false"
                unlink-panelsclearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            </div>
            <div class="filter-option filter-pick-status"><span>状态:</span>
                <el-select v-model="statusValue" placeholder="请选择" @change="statusValueChange">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.keyCode"
                        :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </div>
            <div class="filter-btn-con">
                <el-button class="dialog-btn-w80" type="primary" @click="getTableData(1)">查询</el-button>
            </div>
        </div>
        <div class="table-top-menu-con">
            <div class="btn-tool">
                <div class="table-top-menu" @click="addGuide">新建</div>
                <div class="table-top-menu" @click="rateSet">周转率配置</div>
                <div class="table-top-menu">排片报警日志</div>
                <div class="table-top-menu" @click="showMonthStatistics">报警次数月度统计</div>
            </div>
        </div>
        <div>
           <el-table
                :data="planGuideData">
                
                <el-table-column
                    label="期数"
                    prop="issuesNo"
                >
                </el-table-column>
                <el-table-column
                    label="版本"
                    prop="versionNo"
                >
                </el-table-column>
                <el-table-column
                    label="开始日期"
                    prop="startDate"
                >
                </el-table-column>
                <el-table-column
                    label="结束日期"
                    prop="endDate"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                >
                    <template slot-scope="scope">
                        <span :class="scope.row.className">{{scope.row.statusText}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作人"
                    prop="updateUserName"
                >
                </el-table-column>
                <el-table-column
                    label="操作时间"
                    prop="updateTime"
                    >
                </el-table-column>
                <el-table-column
                    label="审核人"
                    prop="approveUesrName"
                >
                </el-table-column>
                <el-table-column
                    label="审核时间"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed="right"
                    width="200"
                >
                    <template slot-scope="scope">
                        <el-button type="text" @click="viewGuide(scope.row)">查看</el-button>
                        <el-button v-if="scope.row.status == 0" type="text" @click="editGuide(scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.status == 0"  type="text" @click="delGuide(scope.row)">删除</el-button>
                        <el-button v-if="scope.row.status == 1" type="text" @click="recallGuide">撤回</el-button>
                    </template>
                </el-table-column>
            </el-table> 
        </div>
         <div class="page-wrap">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[10, 20, 40, 80]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
        </div>
        <el-dialog title="报警次数月度统计" :visible.sync="monthStatistics" >
            <el-table :data="gridData">
                <el-table-column prop="shunxu" label="序号" width="50"></el-table-column>
                <el-table-column prop="province" label="省"></el-table-column>
                <el-table-column prop="city" label="市"></el-table-column>
                <el-table-column prop="cinemaName" label="影院"></el-table-column>
                <el-table-column v-for="(item, index) in month" :key="index" :label="item.name">
                    <template slot-scope="scope">
                        
                    </template>
                </el-table-column>
                
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button class="w80-btn" @click="monthStatistics = false">取 消</el-button>
                <el-button class="w80-btn" type="primary" @click="monthStatistics = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="影院周转率设置" :visible.sync="turnoverRateSet" width="892px" custom-class="turnover-set-dialog" @closed="rateSetclosed">
            <div style="padding-bottom: 14px; border-bottom: 1px solid #e5e5e5; margin-bottom: 14px;">
                <div class="filter-tool">
                    <div class="filter-options">
                        <span>省市:</span>
                        <el-select v-model="provinceCodeValue" placeholder="请选择" @change="provinceChange">
                            <el-option
                            v-for="item in provinceData"
                            :key="item.provinceCode"
                            :label="item.provinceName"
                            :value="item.provinceCode">
                            </el-option>
                        </el-select>
                        <el-select v-model="cityCodeValue" placeholder="请选择" @change="cityChange">
                            <el-option
                            v-for="item in cityData"
                            :key="item.cityCode"
                            :label="item.cityName"
                            :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="filter-options hall-option" >
                        <el-select v-model="cinemaCodeValue" placeholder="请选择">
                            <el-option
                            v-for="item in cinemaData"
                            :key="item.cinemaUid"
                            :label="item.cinemaName"
                            :value="item.cinemaUid">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="filter-options hall-option" >
                        <span class="break-span">厅数</span>
                        <el-input v-model="hallCountLower"></el-input>
                        <span class="break-span">至</span>
                        <el-input v-model="hallCountUpper"></el-input>
                    </div>
                
                </div>
                <div>
                    <div class="filter-btn">
                        <el-checkbox v-model="isSelected">未配置影城</el-checkbox>
                        <el-button type="primary" class="w80-btn" @click="searhCinema">查询</el-button>
                    </div>
                </div>
                
            </div>
            <div v-loading="cinemaLoading">
                <div class="rate-table-set-top">
                    <div>共<span class="cinema-num-span">{{rateData.reduce((data, city) => data + city.children.length, 0)}}</span>家影院, <span class="cinema-num-span">{{setNum}}</span>家已配置, <span class="cinema-num-span">{{noSetNum}}</span>家未配置</div>
                    <div class="batch-set">
                        <span>周转率设置</span>
                        <el-tooltip content="周转率请按*7-9格式输入*！" placement="top">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <el-input v-model="batchRate"></el-input>
                        <span class="batch-set-rate" @click="batchSetRate">批量设置</span>
                    </div>
                </div>
                <el-table
                    ref="treeTable"
                    :data="turnoverRateData"
                    row-key="cinemaUid"
                    height="277">
                    <el-table-column
                            fixed
                            width="150">
                        <template slot="header" slot-scope="scope">
                            <el-checkbox
                                    :indeterminate="isIndeterminate"
                                    v-model="checkAll"
                                    @change="handleCheckAllChange"
                            >城市</el-checkbox>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox
                                    v-if="scope.row.children"
                                    :indeterminate="scope.row.isIndeterminate"
                                    v-model="scope.row.checked"
                                    @change="handleCheckCityChange($event, scope.row.cityCode)"
                            >{{scope.row.cityName}}</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="影院"
                            min-width="200"
                            fixed
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-checkbox
                                    v-if="scope.row.cinemaName"
                                    v-model="scope.row.checked"
                                    @change="handleCheckCinemaChange($event, scope.row.cinemaUid)"
                            >{{scope.row.cinemaName}}</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="hallCount"
                        label="厅数"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="rate"
                        label="周转率">
                        <template slot-scope="scope">
                            <el-input v-if="!scope.row.children" v-model="scope.row.rate" @change="singleRateChange($event, scope.row.cinemaUid)"></el-input>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="w80-btn" @click="turnoverRateSet = false">取 消</el-button>
                <el-button class="w80-btn" type="primary" @click="saveRateData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getPlanGuiideList, delPlanGuiideDetail, getTurnoverRate, getAreaInfo, getCinemaAreaList, setTurnoverRate } from 'ctm/http/interface'
    export default {
        data() {
            return {
                statusOptions: [{
                    keyCode: '-1',
                    keyName: '全部'
                },
                {
                    keyCode: '0',
                    keyName: '已保存'
                },
                {
                    keyCode: '1',
                    keyName: '待审批'
                },
                {
                    keyCode: '2',
                    keyName: '审批中'
                }, {
                    keyCode: '3',
                    keyName: '审批通过'
                }, {
                    keyCode: '4',
                    keyName: '审批驳回'
                }],
                statusValue: '-1',
                timeValue: '',
                planGuideData: [],
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                // 报警次数月度统计
                gridData: [],
                //报警次数月度统计
                monthStatistics: false,
                month: [],
                turnoverRateSet: false,
                checkAll: false,
                isIndeterminate: false,
                provinceCodeValue: '',
                cityCodeValue: '',
                cinemaCodeValue: '',
                hallCountLower: '',
                hallCountUpper: '',
                provinceData: [],
                areaData: [],
                cityData: [],
                cinemaData: [],
                cinemaOData: [],
                // 周转率数据
                rateData: [],
                // 周转率数据展示
                turnoverRateData: [],
                isSelected: false,
                cinemaLoading: false,
                batchRate: ''
            }
        },
        mounted() {
            this.getTableData()
        },
        methods: {
            addGuide() {
                this.$router.push('/ticket/planGuide/add')
            },
            handleSizeChange(val) {
                this.page.size = val
                this.getTableData()
            },
            handleCurrentChange(val) {
                this.page.current = val
                this.getTableData()
            },
            statusValueChange() {
                // this.page.current = 1
                // this.getTableData()
            },
            timeValueChange() {
                // this.page.current = 1
                // this.getTableData()
            },
            getTableData(current) {
                if (current) {
                    this.current = current
                }
                getPlanGuiideList({
                    current: this.page.current,
                    endTime: this.timeValue && this.timeValue.length ? this.timeValue[1] : '' ,
                    startTime: this.timeValue && this.timeValue.length ? this.timeValue[0] : '',
                    size: this.page.size,
                    status: this.statusValue    
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200) {
                        this.page.total = res.data.total || 0
                        res.data.list.forEach(item => {
                            item.className = 'guide-status' + this.statusOptions.find(option => option.keyCode == item.status).keyCode
                            item.statusText = this.statusOptions.find(option => option.keyCode == item.status).keyName
                        })
                        this.planGuideData = res.data.list || []

                    }
                })
            },
            editGuide(data) {
                this.$router.push({path: 'edit', query: {
                    issuesNo: data.issuesNo,
                    versionNo: data.versionNo
                }})
            },
            viewGuide(data) {
                this.$router.push({path: 'view', query: {
                    issuesNo: data.issuesNo,
                    versionNo: data.versionNo
                }})
            },
            delGuide(data) {
                delPlanGuiideDetail({
                    issuesNo: data.issuesNo,
                    versionNo: data.versionNo
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200) {
                        this.success('删除成功')
                        this.getTableData()
                    }
                }) 
            },
            recallGuide() {
                
            },
            // 月度警告统计
            showMonthStatistics() {
                this.monthStatistics = true
            },
            // 周转率
            provinceChange(val) {
                if (val == '') {
                    this.cityData =  [{
                        cityCode: '',
                        cityName: '全部'
                    }]
                    this.cityCodeValue = ''
                    this.cinemaCodeValue = ''
                    this.cinemaData = [{
                        cinemaUid: '',
                        cinemaName: '全部'
                    }].concat(this.cinemaOData)
                    return
                }
                let cityData
                this.areaData.some(province => {
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
                this.cityCodeValue = ''
                this.cityData = [{
                        cityCode: '',
                        cityName: '全部'
                    }].concat(cityData)

                let cinemaData = []
                cinemaData = this.cinemaOData.filter(item => val == item.provinceCode)
                this.cinemaCodeValue = ''
                this.cinemaData = [{
                    cinemaUid: '',
                    cinemaName: '全部'
                }].concat(cinemaData)
            },
            cityChange(val) {
                if (val == '') {
                    this.cinemaCodeValue = ''
                    let cinemaData = []
                    cinemaData = this.cinemaOData.filter(item => this.provinceCodeValue == item.provinceCode)
                    this.cinemaData = [{
                        cinemaUid: '',
                        cinemaName: '全部'
                    }].concat(cinemaData)
                } else {
                    let cinemaData = []
                    cinemaData = this.cinemaOData.filter(item => val == item.cityCode)
                    this.cinemaCodeValue = ''
                    this.cinemaData = [{
                        cinemaUid: '',
                        cinemaName: '全部'
                    }].concat(cinemaData)
                }
            },
            getTurnoverRate() {
                // getTurnoverRate({
                //     cinemaUid: cinemaCodeValue,
                //     cityCode: cityCodeValue,
                //     current: 1,
                //     hallCountLower: hallCountLower,
                //     hallCountUpper: hallCountUpper,
                //     isNotSet: 0,
                //     provinceCode: provinceCodeValue,
                //     size: 1000
                // }).then(res => {
                //     if (res.code != 200) return this.error(res.msg)
                //     if (res.code == 200) {
                //         console.log(res)
                //     }
                // })
            },
            rateSet() {
                this.turnoverRateSet = true
                this.cinemaLoading = true
                getAreaInfo({}).then(res => {
                    if (res.code != 200) {
                        this.cinemaLoading = false
                        return this.error(res.msg)
                    }

                    if (res.code == 200) {
                        this.areaData = res.data
                        this.provinceData = [{
                            provinceCode: '',
                            provinceName: '全部'
                        }].concat(res.data.map(item => {
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
                    }
                })
            },
            // 搜索影院
            searhCinema() {
                this.checkedSearch()
            },
            // changeCinemaShow() {

            // },
            checkedSearch() {
                var p1 = new Promise((resolve, reject) => {
                    if (this.hallCountLower == '' && this.hallCountUpper == '' ) {
                        resolve()
                    } else {
                        if (!/^([1-9]\d*|[0]{1,1})$/.test(this.hallCountLower) && this.hallCountLower != '') {
                            reject('最小厅数必须为大于等于0的整数!')
                        } else if (!/^([1-9]\d*|[0]{1,1})$/.test(this.hallCountUpper) && this.hallCountUpper != '' && this.hallCountUpper != 0) {
                            reject('最大厅数必须为大于0的整数!')
                        } else if ((this.hallCountLower > this.hallCountUpper) && (this.hallCountLower != '' && this.hallCountUpper != '')) {
                            reject('最小厅数不得大于最大厅数!')
                        } else {
                            resolve()
                        }
                    }
                    
                })
                Promise.all([p1]).then(() => {
                    this.turnoverRateData = this.filterRate(this.rateData)
                    this.$nextTick(() => {
                        setTimeout(() => {
                            // 展开表格折叠行
                            this.expandAll()
                        }, 50)
                    })
                    }).catch(res => {
                    this.error(res)
                })
            },
            getCinemaAreaList() {
                if (!this.cinemaLoading) {
                    this.cinemaLoading = true
                }
                getCinemaAreaList({
                    cityCode: this.cityCodeValue,
                    provinceCode: this.provinceCodeValue,
                    hallCountLower: this.hallCountLower,
                    hallCountUpper: this.hallCountUpper
                }).then(res => {
                    if (res.code != 200) {
                        setTimeout(() => {
                            this.cinemaLoading = false
                        }, 200)
                        return this.error(res.msg)
                    }
                    if (res.code == 200) {
                        console.log(res.data)
                        this.cinemaData = [{
                            cinemaUid: '',
                            cinemaName: '全部'
                        }].concat(res.data)
                        this.cinemaOData = res.data
                        setTimeout(() => {
                            this.cinemaLoading = false
                        }, 200)
                        
                        
                        // 重置全选
                        this.checkAll = false
                        this.isIndeterminate = false

                        let dataArr = []
                        // let expandRowKeys = []

                        res.data.forEach( item => {

                            // 判断dataArr里有没有当前城市 没有就push 有就不push
                            let hasFlag = dataArr.find( innerItem => {
                                return innerItem.cityCode === item.cityCode
                            })
                            if(!hasFlag) {
                                // 没有当前城市 需要push
                                let dataObj = {
                                    provinceCode: item.provinceCode,
                                    provinceName: item.provinceName,
                                    cityName: item.cityName,
                                    cityCode: item.cityCode,
                                    checked: false,
                                    isIndeterminate: false,
                                    children: []
                                }
                                dataArr.push(dataObj)
                            }
                        })

                        // 折叠表格 需要添加children
                        dataArr.forEach( (item, index) => {
                            // cinemaUid 唯一标识
                            item.cinemaUid = 'cinemaUid' + index
                            // expandRowKeys.push('cinemaUid' + index)
                            res.data.forEach( innerItem => {
                                if(item.cityCode === innerItem.cityCode) {
                                    innerItem.checked = false
                                    innerItem.rate = ''

                                    item.children.push(innerItem)
                                }
                            })
                        })

                        getTurnoverRate({size: 2000, current: 1}).then(ret => {
                            if (ret.code != 200) {
                                this.cinemaLoading = false
                                return this.error(ret.msg)
                            }
                            if (ret.code == 200) {
                                let rData = JSON.parse(JSON.stringify(dataArr))
                                rData.forEach((city) => {
                                    city.children.forEach(cinema => {
                                        ret.data.planWorkingListVoList.list.some(item => {
                                            if (cinema.cinemaUid == item.cinemaUid) {
                                                console.log(item.planNumLower + '-' + item.planNumUpper)
                                                cinema.rate = item.planNumLower || item.planNumUpper ? (item.planNumLower + '-' + item.planNumUpper).toString() : ''
                                                console.log(cinema.rate)
                                                return true
                                            }
                                        })
                                    })
                                })
                                // 所有表格总数据
                                this.rateData = JSON.parse(JSON.stringify(rData))
                                // 表格展示数据
                                this.turnoverRateData = this.filterRate(this.rateData)
                                this.$nextTick(() => {
                                    setTimeout(() => {
                                        // 展开表格折叠行
                                        this.expandAll()
                                    }, 50)
                                })
                            }
                        })
                        console.log(dataArr, 'dataArr')
                        


                        
                        // this.isSelected = false
                        
                    }
                })
            },
            filterRate(data) {
                let newData = []
                // 判断当前是否选中影院
                if (this.cinemaCodeValue) {
                    data.forEach(city => {
                        city.children.some(cinema => {
                            if (cinema.cinemaUid == this.cinemaCodeValue) {
                                // 是否配置了厅数查询条件
                                if (this.hallCountLower || this.hallCountUpper) {
                                    if (cinema.hallCount >= this.hallCountLower && cinema.hallCount <= this.hallCountUpper) {
                                        if (!cinema.rate && this.isSelected || !this.isSelected) {
                                            newData.push({
                                                provinceCode: city.provinceCode,
                                                provinceName: city.provinceName,
                                                checked: city.checked,
                                                cinemaUid: city.cinemaUid,
                                                cityCode: city.cityCode,
                                                cityName: city.cityName,
                                                isIndeterminate: city.isIndeterminate,
                                                children: [
                                                    JSON.parse(JSON.stringify(cinema))
                                                ]
                                            })
                                            return true
                                        }
                                    }
                                    
                                } else {
                                    if (!cinema.rate && this.isSelected || !this.isSelected) {
                                        newData.push({
                                                provinceCode: city.provinceCode,
                                                provinceName: city.provinceName,
                                                checked: city.checked,
                                                cinemaUid: city.cinemaUid,
                                                cityCode: city.cityCode,
                                                cityName: city.cityName,
                                                isIndeterminate: city.isIndeterminate,
                                                children: [
                                                    JSON.parse(JSON.stringify(cinema))
                                                ]
                                        })
                                        return true
                                    }
                                }
                                
                            }
                        })
                    })
                } else {
                    // 符合省份条件的数据
                    let pFilterData = data.filter(city => !this.provinceCodeValue || this.provinceCodeValue == city.provinceCode)
                    let cFilterData = this.cityCodeValue ? pFilterData.filter(city => city.cityCode == this.cityCodeValue) : JSON.parse(JSON.stringify(pFilterData))
                    
                    cFilterData.forEach(city => {
                        city.children.forEach(cinema => {
                            // 
                            if (this.hallCountLower || this.hallCountUpper) {
                                if (cinema.hallCount >= this.hallCountLower && cinema.hallCount <= this.hallCountUpper) {
                                    if (!cinema.rate && this.isSelected || !this.isSelected) {
                                        let index = newData.findIndex(item => city.cityCode == item.cityCode)
                                        if ( index != -1) {
                                            newData[index].children.push({
                                                checked: cinema.checked,
                                                cinemaName: cinema.cinemaName,
                                                cinemaUid: cinema.cinemaUid,
                                                cityCode: cinema.cityCode,
                                                cityName: cinema.cityName,
                                                hallCount: cinema.hallCount,
                                                provinceCode: cinema.provinceCode,
                                                provinceName: cinema.provinceName,
                                                rate: cinema.rate
                                            })
                                        } else {
                                            newData.push({
                                                provinceCode: city.provinceCode,
                                                provinceName: city.provinceName,
                                                checked: city.checked,
                                                cinemaUid: city.cinemaUid,
                                                cityCode: city.cityCode,
                                                cityName: city.cityName,
                                                isIndeterminate: city.isIndeterminate,
                                                children: [
                                                    JSON.parse(JSON.stringify(cinema))
                                                ]
                                            })
                                        }
                                    }
                                }
                            } else {
                                if (!cinema.rate && this.isSelected || !this.isSelected) {
                                    let index = newData.findIndex(item => city.cityCode == item.cityCode)
                                    if ( index != -1) {
                                        newData[index].children.push({
                                            checked: cinema.checked,
                                            cinemaName: cinema.cinemaName,
                                            cinemaUid: cinema.cinemaUid,
                                            cityCode: cinema.cityCode,
                                            cityName: cinema.cityName,
                                            hallCount: cinema.hallCount,
                                            provinceCode: cinema.provinceCode,
                                            provinceName: cinema.provinceName,
                                            rate: cinema.rate
                                        })
                                    } else {
                                        newData.push({
                                            provinceCode: city.provinceCode,
                                            provinceName: city.provinceName,
                                            checked: city.checked,
                                            cinemaUid: city.cinemaUid,
                                            cityCode: city.cityCode,
                                            cityName: city.cityName,
                                            isIndeterminate: city.isIndeterminate,
                                            children: [
                                                JSON.parse(JSON.stringify(cinema))
                                            ]
                                        })
                                    }
                                }
                            }
                        })
                    })
                }
                // TODO 更改生成当前展示数据的城市勾选状态
                let turnoverRateData = this.changeCityChecked(newData)
                // 返回数据
                return JSON.parse(JSON.stringify(turnoverRateData))
                
            },
            changeCityChecked(data) {
                data.forEach(city => {
                    city.checked = city.children.every(cinema => cinema.checked)
                    city.isIndeterminate = city.children.filter(cinema => cinema.checked).length != 0 && city.children.filter(cinema => cinema.checked).length != city.children.length
                })
                this.checkAll = data.every(city => city.checked)
                console.log(data)
                this.isIndeterminate = data.filter(city => city.checked).length != 0 && data.filter(city => city.checked).length != data.length
                return data
            },
            // 默认展开所有行
            expandAll () {
                const els = this.$el.querySelectorAll('.el-table__fixed .el-table__expand-icon')
                for (let i = 0; i < els.length; i++) {
                    els[i].click()
                }
            },
            batchSetRate() {

                if (this.batchRate) {
                    if (!/^([0-9][0-9]?)-([0-9][0-9]?)$/.test(this.batchRate)) {
                        this.error('周转率请按*7-9格式输入*！')
                        return
                    }
                } else {
                    return this.error('请输入周转率!')
                }
                
                let data = JSON.parse(JSON.stringify(this.turnoverRateData))
                let cinemaUids = []
                
                data.forEach(city => {
                    city.children.forEach(cinema => {
                        if (cinema.checked) {
                            cinema.rate = this.batchRate
                            cinemaUids.push(cinema.cinemaUid)
                        }
                    })
                })
                if (!cinemaUids.length) {
                    return this.error('请至少勾选一个影院')
                }
                this.turnoverRateData = data
                this.success('批量设置周转率成功')
                this.$nextTick(() => {
                    setTimeout(() => {
                        // 展开表格折叠行
                        this.expandAll()
                    }, 50)
                })
                // 同步 rate
                let rateData = JSON.parse(JSON.stringify(this.rateData))
                rateData.forEach(city => {
                    city.children.forEach(cinema => {
                        cinemaUids.some(uid => {
                            if (uid == cinema.cinemaUid) {
                                cinema.rate = this.batchRate
                                return true
                            }
                        })
                    })
                })
                this.rateData = rateData

                this.batchRate = ''


                
            },
            handleCheckAllChange(val) {
                // 
                this.turnoverRateData.forEach( item => {
                    item.isIndeterminate = false
                    item.checked = val
                    item.children.forEach( innerItem => {
                        innerItem.checked = val
                    })
                })

                this.isIndeterminate = false
                // 同步 rateData
                let changeUids = this.turnoverRateData.reduce((data, city) => {
                    return data.concat(city.children.map(item => item.cinemaUid))
                }, [])
                let rateData = JSON.parse(JSON.stringify(this.rateData))
                rateData.forEach(city => {
                    city.children.forEach(cinema => {
                        if (changeUids.find(uid => uid == cinema.cinemaUid)) {
                            cinema.checked = val
                        }
                    })
                })
                this.rateData = rateData
            },

            handleCheckCityChange(val, cityCode) {
                console.log(val, cityCode)
                this.turnoverRateData.some( item => {
                    if(item.cityCode === cityCode) {
                        item.children.forEach( innerItem => {
                            innerItem.checked = val
                        })
                        item.isIndeterminate = false
                        return true
                    }
                })
                this.syncCheckAll()
                // 同步 rate
                let changeUids = this.turnoverRateData.find(city => city.cityCode == cityCode).children.map(item => item.cinemaUid)
                let rateData = JSON.parse(JSON.stringify(this.rateData))
                rateData.some(city => {
                    if (city.cityCode == cityCode) {
                        city.children.forEach(cinema => {
                            if (changeUids.find(uid => uid == cinema.cinemaUid)) {
                                cinema.checked = val
                            }
                        })
                        return true
                    }
                    
                })
                this.rateData = rateData
            },

            handleCheckCinemaChange(val, cinemaUid) {
                this.turnoverRateData.some( item => {
                    let data = item.children.find( innerItem => {
                        return innerItem.cinemaUid === cinemaUid
                    })
                    if(data) {
                        if(val) {
                            let flag = item.children.some( innerItem => {
                                return !innerItem.checked
                            })
                            if(flag) {
                                item.checked = false
                                item.isIndeterminate = true
                            }else {
                                item.checked = true
                                item.isIndeterminate = false
                            }
                        }else {
                            let flag = item.children.some( innerItem => {
                                return innerItem.checked
                            })
                            if(flag) {
                                item.checked = false
                                item.isIndeterminate = true
                            }else {
                                item.checked = false
                                item.isIndeterminate = false

                            }
                        }
                        return true
                    }

                })

                this.syncCheckAll()

                // 同步 rate
                
                let rateData = JSON.parse(JSON.stringify(this.rateData))
                rateData.some(city => {
                    if (city.children.find(cinema => cinema.cinemaUid == cinemaUid)) {
                        city.children.some(cinema => {
                            if (cinema.cinemaUid == cinemaUid) {
                                cinema.checked = val
                                return true
                            }
                        })
                        return true
                    }
                    
                })
                this.rateData = rateData
            },
            syncCheckAll() {
                let checkAllFlag = this.turnoverRateData.every( item => {
                    return item.checked
                })

                if(checkAllFlag) {
                    this.checkAll = true
                    this.isIndeterminate = false

                }else {
                    let noCheckFlag = this.turnoverRateData.every( item => {
                        return !item.checked && !item.isIndeterminate
                    })
                    if(noCheckFlag) {
                        this.checkAll = false
                        this.isIndeterminate = false
                    }else {
                        this.checkAll = false
                        this.isIndeterminate = true
                    }
                }


            },
            // 单个影院周转率修改
            singleRateChange(val, cinemaUid) {
                // 同步 rate
                let rateData = JSON.parse(JSON.stringify(this.rateData))
                rateData.some(city => {
                    if (city.children.find(cinema => cinema.cinemaUid == cinemaUid)) {
                        city.children.some(cinema => {
                            if (cinema.cinemaUid == cinemaUid) {
                                cinema.rate = val
                                return true
                            }
                        })
                        return true
                    }
                    
                })
                this.rateData = rateData
            },
            // save
            saveRateData() {
                let checkData = this.rateData.reduce((data, city) => {
                    return data.concat(city.children)
                }, [])
                let errorData = [], saveData = []
                checkData.forEach(item => {
                    if (item.rate) {
                        if (/^([0-9][0-9]?)-([0-9][0-9]?)$/.test(item.rate)) {
                            if (item.rate.split('-')[0] > item.rate.split('-')[1] || !item.rate.split('-')[1]) {
                                errorData.push(item.cityName + '' + item.cinemaName)
                            } else {
                                saveData.push({
                                    cinemaUid: item.cinemaUid,
                                    planNumLower: item.rate.split('-')[0],
                                    planNumUpper: item.rate.split('-')[1]
                                })
                            }
                        } else {
                            errorData.push(item.cityName + '' + item.cinemaName)
                        }
                    }     
                })
                if (errorData.length) {
                    return this.$message({
                        showClose: true,
                        dangerouslyUseHTMLString: true,
                        message: `以下城市影院周转率设置格式有误<br/><br/>${errorData.join('</br>')}`
                    })
                     
                }
                if (!saveData.length) return this.error('没有需要保存的配置')
                setTurnoverRate({
                    list: saveData
                }).then(res => {
                    if (res.code != 200) {
                        return this.error(res.msg)
                    }
                    if (res.code == 200) {
                        this.success('周转率设置成功')
                    }
                })
                this.turnoverRateSet = false
            },
            rateSetclosed() {
                this.cityCodeValue = ''
                this.provinceCodeValue = ''
                this.cinemaCodeValue = ''
                this.cityData = []
                this.provinceData = []
                this.cinemaData = []
                this.hallCountLower = ''
                this.hallCountUpper = ''
                this.isSelected = false
                this.turnoverRateData = []
                this.rateData = []
            }
        },
        computed: {
            setNum() {
                return this.rateData.reduce((data, city) => {
                    return data + city.children.reduce((cdata, cinema) => {
                        return cinema.rate ? cdata + 1 : cdata
                    }, 0)
                }, 0)
            },
            noSetNum() {
                return this.rateData.reduce((data, city) => {
                    return data + city.children.reduce((cdata, cinema) => {
                        return !cinema.rate ? cdata + 1 : cdata
                    }, 0)
                }, 0)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .plan-guide-list {
        .dialog-btn-w80 {
            width: 80px;
            box-sizing: border-box;
        }
        .header-filter-container {
            height: 80px;
            box-sizing: border-box;
            padding: 24px;
            background-color: #f5f5f5;
            .filter-option {
                float: left;
                margin-right: 32px;
                // line-height: 32px;
                span {
                    display: inline-block;
                    height: 32px;
                    line-height: 32px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                /deep/ .el-date-editor {
                    vertical-align: middle;
                    width: 256px;
                    .el-range-separator {
                        position: relative;
                        top: -4px;
                        width: 10%;
                    }
                    .el-range__icon, .el-range__close-icon {
                        position: relative;
                        top: -4px;
                    }
                }
                
                .el-select {
                    width: 192px;
                }
            }
            .filter-btn-con {
                float: right;

            }
            .filter-pick-time {
                // .el-icon-date:before, .el-input__icon:after, 
            }
        }
        .table-top-menu-con {
            height: 48px;
            padding-top: 8px;
            box-sizing: border-box;
            .btn-tool {
                float: right;
                .table-top-menu {
                    float: left;
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
        }
        .guide-status1 {
            color: rgb(126, 162, 253)
        }
        .guide-status3 {
            color: rgb(82, 200, 82)
        }
        .guide-status3 {
            color: rgb(243, 65, 61)
        }
    }
    .turnover-set-dialog {
        .filter-tool {
            height: 36px;
            line-height: 36px;
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 8px;
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
            
        }
        .filter-btn {
            text-align: right;
            height: 32px;
            .el-checkbox {
                // float: left;
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
                // display: block;
                // float: left;
                span {
                    font-size: 12px;
                }
            }
        }
        .rate-table-set-top {
            position: relative;
            height: 40px;
            line-height: 40px;
            .batch-set {
                position: absolute;
                width: 300px;
                text-align: left;
                right: 0px;
                top: 0;
                .el-input {
                    width: 128px;
                    height: 32px;
                }
                .batch-set-rate {
                    cursor: pointer;
                    margin-left: 4px;
                    color: #3874ff;
                }
            }
        }
        .cinema-num-span {
            color: rgb(244, 68, 64);
        }
    }
    
</style>