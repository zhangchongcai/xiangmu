<template>
    <div class="movie-plan-continuity">
        <div class="basic-info movie-info" v-if="isEditMode && movieData.soldSeatCount == 0">
            <el-form
                label-width="80px">
                <el-form-item label="影厅：">
                    <span class="cinema-stock-edit-text">
                        {{movieData.hallName}}
                    </span>
                </el-form-item>
                <el-form-item label="连场名称：">
                    <span class="cinema-stock-edit-text">
                        <el-input class="normal-input" v-model="movieData.joinMovieName" placeholder="请输入连场名称" :disabled="movieData.saleStatus =='STOP'"></el-input>
                    </span>
                </el-form-item>
                <el-form-item label="开始时间：">
                    <span class="cinema-stock-edit-text">
                        {{showPlanDate}}
                        <el-input class="short-input" v-model="planMinute" @change="timeChange" :disabled="movieData.saleStatus =='STOP'"></el-input>
                        &nbsp;分
                    </span>
                </el-form-item>
                <el-form-item label="影片间隔：">
                    <span class="cinema-stock-edit-text">
                        <el-input class="short-input" @change="timeIntervalChange" v-model="movieData.intervalMinute" :disabled="movieData.saleStatus =='STOP'"></el-input>
                        &nbsp;分钟
                    </span>
                </el-form-item>
                
            </el-form>
        </div>
        <div class="basic-info movie-info" v-else>
            <el-form
                label-width="80px">
                <el-form-item label="影厅：">
                    <span class="cinema-stock-edit-text">
                        {{movieData.hallName}}
                    </span>
                </el-form-item>
                <el-form-item label="连场名称：">
                    <span class="cinema-stock-edit-text">
                        {{movieData.joinMovieName}}
                    </span>
                </el-form-item>
                <el-form-item label="开始时间：">
                    <span class="cinema-stock-edit-text">
                        {{showPlanDate}}
                    </span>
                </el-form-item>
                <el-form-item label="影片间隔：">
                    <span class="cinema-stock-edit-text">
                        {{movieData.intervalMinute}}分钟
                    </span>
                </el-form-item>
                
            </el-form>
        </div>

        <div class="basic-info" v-if="isEditMode && movieData.soldSeatCount == 0">
            <div class="base-info-title" >选择连排影片 <el-button @click="showAddFilmDialog" :disabled="movieData.saleStatus =='STOP'">添加影片</el-button></div>
            <el-table
            :data="movieTable">
                <el-table-column
                    prop="showIndex"
                    label="放映顺序"
                >
                </el-table-column>
                <el-table-column
                    prop="movieName"
                    label="放映影片名称"
                >
                </el-table-column>
                <el-table-column
                    prop="movieLanguage"
                    label="放映影片语言"
                >
                </el-table-column>
                <el-table-column
                    prop="timeLong"
                    label="时长(分钟)"
                >
                </el-table-column>
                <el-table-column
                    label="放映时间"
                >
                <template slot-scope="scope">
                    {{scope.row.startTime}}-{{scope.row.endTime}}
                </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                <template slot-scope="scope" >
                    <el-button style="padding: 0" @click="deleteIndex(scope.$index)" type="text" :disabled="movieData.saleStatus =='STOP'">删除</el-button>
                    <el-button style="padding: 0" v-if="scope.$index && movieTable.length > 1" @click="changeIndex('top', scope.$index)" type="text" icon="el-icon-top" :disabled="movieData.saleStatus =='STOP'">上移</el-button>
                    <el-button style="padding: 0" v-if="scope.$index != movieTable.length - 1 && movieTable.length > 1" @click="changeIndex('down', scope.$index)" type="text" icon="el-icon-bottom" :disabled="movieData.saleStatus =='STOP'">下移</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="basic-info" v-else>
            <div class="base-info-title">连排影片</div>
            <el-table
            :data="movieTable">
                <el-table-column
                    prop="showIndex"
                    label="放映顺序"
                >
                </el-table-column>
                <el-table-column
                    prop="movieName"
                    label="放映影片名称"
                >
                </el-table-column>
                <el-table-column
                    prop="movieLanguage"
                    label="放映影片语言"
                >
                </el-table-column>
                <el-table-column
                    prop="timeLong"
                    label="时长(分钟)"
                >
                </el-table-column>
                <el-table-column
                    label="放映时间"
                >
                <template slot-scope="scope">
                    {{scope.row.startTime}}-{{scope.row.endTime}}
                </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="basic-info" v-show="isEditMode">
            <div class="base-info-title">票价方案设置</div>
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="柜台/自助" name="first">
                    <el-form
                        label-width="80px">
                        <el-form-item label="适用票类：">
                            <div>
                                <el-table
                                    :data="ticketData"
                                    ref="ticketMultipleTable"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    row-key="id"
                                    @selection-change="ticketSelChange">
                                    <el-table-column
                                        type="selection"
                                        :selectable="rowIsDisabled"
                                        width="55">
                                    </el-table-column> 
                                    <el-table-column
                                        prop="name"
                                        label="票类名称"
                                        width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="票类价格">
                                        <template slot-scope="scope">
                                            <span class="input-con"><el-input type="number" maxlength="4" max="1000" @blur="tableFixed(scope)" v-model="scope.row.price"></el-input><i class="rmb-hover">¥</i></span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="线上网售" name="second">
                    <el-form
                        label-width="80px">
                        <el-form-item label="适用渠道：">
                            <div>
                                <el-table
                                    ref="channelMultipleTable"
                                    :data="channelData"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    row-key="uid"
                                    @selection-change="channelSelChange"
                                    class="edit-cichannel-table">
                                    <el-table-column	
                                        type="selection"
                                        width="55">
                                    </el-table-column> 
                                    <el-table-column
                                        prop="name"
                                        label="代理商"
                                        width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="渠道价格">
                                        <template slot-scope="scope">
                                            <span class="input-con"><el-input type="number" maxlength="4" max="1000" @blur="cichannelToFixed(scope)" v-model="scope.row.price"></el-input><i class="rmb-hover">¥</i></span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                            </div>
                        </el-form-item>
                        
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="basic-info" v-show="!isEditMode">
            <div class="base-info-title">票价方案</div>
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="柜台/自助" name="first">
                    <el-form
                        label-width="80px">
                        <el-form-item label="适用票类：">
                            <div>
                                <el-table
                                    :data="ticketData"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    @selection-change="ticketSelChange">
                                    <el-table-column
                                        prop="name"
                                        label="票类名称"
                                        width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="票类价格(元)">
                                        <template slot-scope="scope">
                                            <span class="input-con">{{scope.row.price}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="开售状态">
                                        <template slot-scope="scope">
                                            <span class="input-con">{{scope.row.switchStatus ? '开售' : '停售'}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="线上网售" name="second">
                    <el-form
                        label-width="80px">
                        <el-form-item label="适用渠道：">
                            <div>
                                <el-table
                                    :data="channelData"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    class="edit-cichannel-table">
                                    <el-table-column
                                        prop="name"
                                        label="代理商"
                                        width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="渠道价格(元)">
                                        <template slot-scope="scope">
                                            <span class="input-con">{{scope.row.price}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="开售状态">
                                        <template slot-scope="scope">
                                            <span class="input-con">{{scope.row.switchStatus ? '开售' : '停售'}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                            </div>
                        </el-form-item>
                        
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="basic-info" v-if="isEditMode">
            <div class="base-info-title">分账比例、最低票价、分摊比例设置</div>
            <el-table
                :data="movieTable">
                <el-table-column
                    prop="showIndex"
                    label="序号"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="movieName"
                    label="放映影片名称"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    label="票价分摊比例(%)"
                >
                    <template slot-scope="scope">
                        <span class="input-con"><el-input type="number" maxlength="3" max="100" @blur="percentTableToFixed(scope)" v-model="scope.row.percentPrice"></el-input></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="最低票价(元)"
                >
                    <template slot-scope="scope">
                        <span class="input-con"><el-input type="number" maxlength="4" max="1000" @blur="percentTableToFixed(scope)" v-model="scope.row.minPrice"></el-input></span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="分账比例(%)"
                >
                    <template slot-scope="scope">
                        <span class="input-con"><el-input type="number" maxlength="3" max="100" @blur="percentTableToFixed(scope)" v-model="scope.row.publisherRate"></el-input></span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-bottom-menu">
                <div class="prcie-promise">
                    <el-checkbox v-model="mustRightSeat">对号入座</el-checkbox>
                </div>
                <div class="prcie-promise">
                    <el-checkbox
                        v-model="permitSaleBox"
                    >允许包厢单卖</el-checkbox>
                </div>
                <div class="prcie-promise">
                    <el-checkbox
                        v-model="permitDiscount"
                    >允许营销活动折扣、会员折扣</el-checkbox>
                </div>
                <div class="prcie-promise">审核状态: {{approveStatus}}</div>
            </div>
        </div>
        <div class="basic-info" v-else>
            <div class="base-info-title">分账比例、最低票价、分摊比例</div>
            <el-table
                :data="movieTable">
                <el-table-column
                    prop="showIndex"
                    label="序号"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="movieName"
                    label="放映影片名称"
                    width="100"
                >
                </el-table-column>
                <el-table-column
                    label="票价分摊比例(%)"
                >
                    <template slot-scope="scope">
                        <span class="input-con">{{scope.row.percentPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="最低票价(元)"
                >
                    <template slot-scope="scope">
                        <span class="input-con">{{scope.row.minPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="分账比例(%)"
                >
                    <template slot-scope="scope">
                        <span class="input-con">{{scope.row.publisherRate}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-bottom-menu">
                <div class="prcie-promise">
                    对号入座: <span>{{mustRightSeat ? '是' : '否'}}</span>
                </div>
                <div class="prcie-promise">
                    允许包厢单卖: <span>{{permitSaleBox ? '是' : '否'}}</span>
                </div>
                <div class="prcie-promise">
                    允许营销活动折扣、会员折扣: <span>{{permitDiscount ? '是' : '否'}}</span>
                </div>
                <div class="prcie-promise">审核状态: {{approveStatus}}</div>
            </div>
        </div>

        <div class="basic-info" v-if="isEditMode">
            <div class="base-info-title">开售渠道选择</div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="channelMulData" @change="handleCheckedChannelChange">
                <el-checkbox v-for="channel in mulCheckedData" @change="singleCheckChange(channel.uid)" :label="channel.uid" :key="channel.uid">{{channel.name}}</el-checkbox>
            </el-checkbox-group>
            <div>
            </div>
        </div>
        <!-- <div class="basic-info" v-else>
            <div class="base-info-title">开售渠道</div>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="channelMulData" v-if ="channelData.length">
                <el-checkbox v-for="channel in mulCheckedData" :label="channel" :key="channel.uid" disabled>{{channel.channelName}}</el-checkbox>
            </el-checkbox-group>
            <div v-else class="prcie-promise">暂无开售渠道</div>
            <div>
            </div>
        </div> -->

        <!-- 添加影片dialog -->
        <el-dialog class="add-movie-dialog" title="添加影片" width="60%" :visible.sync="addMovieDialog" @close="closeDialogCb">
            <el-form>
                <el-form-item class="serach-con">
                    <div class="search-wrap">
                        <span>影片名称：</span>
                        <el-input
                            v-model="searchMovieName">
                        </el-input>
                    </div>
                    <el-button type="primary" icon="el-icon-search" @click="getMovieData">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-table
                        ref="multipleTable"
                        :data="addMovieTable"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="movieName"
                        label="影片名称"
                        width="200">
                        
                        </el-table-column>
                         <el-table-column
                        prop="disVersion"
                        label="发行版本"
                        width="70">
                        </el-table-column>
                         <el-table-column
                        prop="moviedesclanguage"
                        label="语言"
                        width="70">
                        </el-table-column>
                        <el-table-column
                        prop="timeLong"
                        label="时长"
                        width="70">
                        </el-table-column>
                        <el-table-column
                        label="有效期">
                        <template slot-scope="scope">{{scope.row.dateShowFirst.split(' ')[0]}} 至 {{scope.row.dateShowOff.split(' ')[0]}}</template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMovieDialog = false">取 消</el-button>
                <el-button type="primary" @click="addMovieData">确 定</el-button>
            </div>
        </el-dialog>

        <div class="bottom-handler-tool" :style="{width: fixedWidth + 'px'}">
			<div class="btn-area" v-if="isEditMode">
				<el-button type="primary" @click="savePlan">保存</el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
			<div class="btn-area" v-else>
				<el-button @click="closePage">关闭</el-button>
			</div>

		</div>

    </div>
</template>

<script>
import {getmoviePlanDetails, getPlanMovieList, initTimeLine, datePlanList, updateMoviePlan} from 'ctm/http/interface'
    export default {
        data() {
            return {
                isEditMode: false,
                planUid: '',
                referer: '',
                movieData: {},
                copyIntervalMin: 0,
                // 当前排片页面日期
                curPlanDate: '',
                // 下一天排片页面日期
                nextPlanDate: '',
                year: '',
                month: '',
                day: '',
                planHour: '',
                planMinute: '',
                copyMinute: '',
                showPlanDate: '',
                activeTab: 'first',
                movieTable: [],
                timeInterval: null,
                hallData: null,
                // 添加影片
                addMovieDialog: false,
                searchMovieName: '',
                addMovieTable: [],
                multipleSelection: [],
                planData: {},
                // 开售渠道 data
                checkAll: false,
                checkedChannel: [],
                isIndeterminate: true,
                ticketData: [],
                channelData: [],
                ticketMulData: [],
                channelMulData: [],
                permitSaleBox: '',
                permitDiscount: '',
                mustRightSeat: '',
                mulCheckedData: [],
                fixedWidth: ''
            }
        },
        mounted() {
            this.fixedWidth = document.querySelector('.content-wrapper').offsetWidth
            this.dataInit()
        },
        methods: {
            // 获取初始数据
            dataInit() {
                
                this.isEditMode = this.$route.query.mode ? this.$route.query.mode == 'edit' ? true : false : false
                this.planUid = this.$route.query.uid ? this.$route.query.uid : ''
                this.referer = this.$route.query.referer ? decodeURIComponent(this.$route.query.referer) : ''
                // 获取导入价格方案里的两个list
                this.getPlanData()
            },
            // 调整排片时间
            timeChange(val) {
                if (!this.timeInterval) {
                    this.planMinute = this.copyMinute
                    return this.error('暂未获取到排片时间间隔,请稍后再试')
                }
                if (!this.hallData) {
                    this.planMinute = this.copyMinute
                    return this.error('暂未获取到当前影厅排片数据,请稍后再试')
                }
                if (val < 0 || val >= 60 || !/^\+?[0-9][0-9]*$/.test(val)) {
                    this.planMinute = this.copyMinute
                    return this.error('必须为0-59之间的整数')
                }
                this.movieData.timeLong = this.movieTable.reduce((data, item) => data += item.timeLong, 0) + (this.movieTable.length - 1) * this.movieData.intervalMinute
                let tmpTimeStart = new Date(`${this.year}-${this.month}-${this.day} ${this.planHour}:${val}`).getTime(),
                tmpTimeEnd = tmpTimeStart + this.movieData.timeLong * 60 * 1000
                
                // 判断调整完成之后的时间是否与同影厅其他场次冲突
                if (this.hallData.some(item => (tmpTimeStart < (new Date(item.showTimeEnd).getTime() + this.timeInterval * 60 * 1000) && tmpTimeEnd > new Date(item.showTimeEnd).getTime()) || (tmpTimeEnd > (new Date(item.showTimeStart).getTime() - this.timeInterval * 60 * 1000) && tmpTimeStart < new Date(item.showTimeStart).getTime()))) {
                    this.planMinute = this.copyMinute
                    return this.error('放映时间区间无法容纳该放映计划，请重新设置放映时间!')
                }
                if (this.curPlanDate != this.formatDateTime(tmpTimeEnd, 1) && 
                        tmpTimeEnd > new Date(this.formatDateTime(`${this.nextPlanDate} 06:00`, 0)).getTime()) {
                    this.planMinute = this.copyMinute
                    return this.error('放映结束时间不能超过次日早上6点!')
                }
                this.movieData.planTime = this.formatDateTime(tmpTimeStart, 0)
                this.movieData.planTimeEnd = this.formatDateTime(tmpTimeEnd, 0)
                this.planMinute = val < 10 ? `0${val}` : `${val}`
                this.copyMinute = this.planMinute
                this.changeMovieTime(JSON.parse(JSON.stringify(this.movieTable)))
            },
            timeIntervalChange(val) {
                if (val  < 1 || val > 99 || !/^\+?[1-9][0-9]*$/.test(val)) {
                    this.movieData.intervalMinute = this.copyIntervalMin
                    return this.error('必须为0-99之间的整数')
                }
                this.changeMovieTime(JSON.parse(JSON.stringify(this.movieTable)))
            },
            // 获取时间间隔
            getTimeLine() {
                initTimeLine({
                    'uidCinema': this.movieData.cinemaUid
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200 && res.data) {
                        this.timeInterval = res.data.timeInterval
                        // this.timeFlag = true
                    }
                })
            },
            getPlanList() {
                datePlanList({
                    planDate: `${this.year}-${this.month}-${this.day}`,
                    cinemaUid: this.movieData.cinemaUid
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    let hallData = res.data.filter(item => item.hallUid == this.movieData.hallUid && item.planUid != this.planUid)
                    hallData.forEach(item => {
                        item.showTimeStart = item.startTime.split(':')[0] < 6 ? `${this.nextPlanDate} ${item.startTime}` : `${this.curPlanDate} ${item.startTime}`
                        item.showTimeEnd = item.endTime.split(':')[0] < 6 ? `${this.nextPlanDate} ${item.endTime}` : `${this.curPlanDate} ${item.endTime}`
                    })
                    this.hallData = res.data.filter(item => item.hallUid == this.movieData.hallUid && item.planUid != this.planUid)
                })
            },
            // 展示添加影片弹框
            showAddFilmDialog() {
                this.addMovieDialog = true
                this.getMovieData()
            },
            // 获取电影数据
            getMovieData() {
                getPlanMovieList({
                    targetDate: this.movieData.planDate,
                    cinemaUid: this.movieData.cinemaUid,
                    current: 1,
                    size: 100,
                    movieName: this.searchMovieName
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    this.addMovieTable = res.data
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            ticketSelChange(val) {
                this.ticketData.forEach(item => {
                    item.switchStatus = !val.every(citem => citem.uid != item.uid)
                })
                this.ticketMulData = val
            },
            channelSelChange(val) {
                this.channelData.forEach(item => {
                    item.switchStatus = !val.every(citem => citem.uid != item.uid)
                })
                let count = this.movieData.isCounter && this.movieData.isSelfServiceTerminals ? 2 : !this.movieData.isCounter && !this.movieData.isSelfServiceTerminals ? 0 : 1

                this.checkAll = val.length + count === this.mulCheckedData.length
                this.isIndeterminate = (!!(val.length + count)) && ((val.length + count) < this.mulCheckedData.length)

                this.channelMulData = this.movieData.isCounter && this.movieData.isSelfServiceTerminals ? ['000000', '111111'].concat(val.map(item => {
                            return item.uid
                        })) : this.movieData.isCounter ? ['000000'].concat(val.map(item => {
                            return item.uid
                        })) : ['111111'].concat(val.map(item => {
                            return item.uid
                        }))
            },
            // 增加影片进入连排
            addMovieData() {
                if ((this.multipleSelection.length + this.movieTable.length) > 9) return this.warning(`连场放映最多添加9部影片, 现在最多还可以再添加${9 - this.movieTable.length}部影片!`)
                // TODO 添加 影片信息进入movieTable
                let selAddData = JSON.parse(JSON.stringify(this.multipleSelection))
                selAddData.forEach((item, i) => {
                    item.showIndex = this.movieTable.length + i + 1
                    item.startTimeC = !i ? this.movieTable.length ? this.formatDateTime((new Date(this.movieTable[this.movieTable.length - 1].endTimeC) + this.movieData.intervalMinute * 60 * 1000), 0) : this.movieData.planTime : this.formatDateTime((new Date(selAddData[i - 1].endTimeC) + this.movieData.intervalMinute * 60 * 1000), 0)
                    item.startTime = item.startTime = this.formatDateTime(new Date(item.startTimeC), 2)
                    item.endTimeC = this.formatDateTime((new Date(item.startTimeC) + item.timeLong * 60 * 1000), 0)
                    item.endTime = this.formatDateTime((new Date(item.startTimeC) + item.timeLong * 60 * 1000), 2)
                    item.minPrice = item.minPrice ? parseFloat(item.minPrice).toFixed(2) : '0.00'
                    item.percentPrice = item.percentPrice ? parseFloat(item.percentPrice).toFixed(2) : '0.00'
                    item.publisherRate = item.rate ? parseFloat(item.rate).toFixed(2) : '0.00'
                    item.movieLanguage = item.moviedesclanguage
                })
                let addData = selAddData.map(item => {
                    let {dateShowFirst, dateShowOff, minPrice, disVersion, movieCode, movieLanguage, percentPrice, publisherRate, showIndex, movieName, timeLong,startTimeC, startTime, endTimeC, endTime, planInfoMovieTimeVoList} = item, movieUid = item.uid
                    return {
                        dateShowFirst,
                        dateShowOff,
                        minPrice,
                        disVersion,
                        movieCode,
                        movieLanguage,
                        movieUid: item.uid,
                        percentPrice,
                        publisherRate,
                        showIndex,
                        movieName,
                        timeLong,
                        startTimeC,
                        startTime,
                        endTimeC,
                        endTime,
                        movieLanguage,
                        planInfoMovieTimeVoList
                    }
                })
                this.movieTable = this.movieTable.concat(addData)
                this.changeMovieTime(this.movieTable)
                this.addMovieDialog = false
                // 需要检查是否关闭之后都会执行
                this.closeDialogCb()
            },
            closeDialogCb() {
                this.searchMovieName = ''
                this.addMovieTable = []
                this.multipleSelection = []
            },
            // 删除 连排中的某一个影片
            deleteIndex(index) {
                let movieTable = JSON.parse(JSON.stringify(this.movieTable)).filter((item, i) => index != i)
                this.changeMovieTime(movieTable)
            },
            // 上移 下移
            changeIndex(type, index) {
                let movieTable = JSON.parse(JSON.stringify(this.movieTable))
                let handlerIndex = type == 'top' ? index - 1 : index + 1
                // 交换表格数据 
                movieTable[index] = this.movieTable[handlerIndex]
                movieTable[handlerIndex] = this.movieTable[index]

                // 判断 是否动了表格数据首项 并修改初始时间为 当前排片开始时间
                // 注释掉这段是因为这段处理 在方法changeMovieTime 里不去判断是否动第一项 统一处理 更好的封装性
                // if (handlerIndex == 0 || index == 0) {
                //     movieTable[index].startTimeC = this.movieData.planTime
                //     movieTable[index].startTime = this.formatDateTime(new Date(movieTable[index].startTimeC), 2)
                // }

                this.changeMovieTime(movieTable)
            },
            // 修改影片表格数据里的开始结束时间
            changeMovieTime(movieTable) {
                // startTimeC 和 startTime 的区别在于前者用于计算后者用于显示 end同理
                movieTable.forEach((item, i) => {
                    item.showIndex = i + 1
                    if (!i) {
                        item.startTimeC = this.movieData.planTime
                        item.startTime = this.formatDateTime(new Date(item.startTimeC).getTime(), 2)
                    } else {
                        item.startTimeC = this.formatDateTime((new Date(movieTable[i - 1].endTimeC).getTime() + this.movieData.intervalMinute * 60 * 1000), 0)
                        item.startTime = this.formatDateTime((new Date(movieTable[i - 1].endTimeC).getTime() + this.movieData.intervalMinute * 60 * 1000), 2)
                    }
                    item.endTimeC = this.formatDateTime((new Date(item.startTimeC).getTime() + item.timeLong * 60 * 1000), 0)
                    item.endTime = this.formatDateTime((new Date(item.startTimeC).getTime() + item.timeLong * 60 * 1000), 2)
                })
                this.movieTable = movieTable
                // 修改排片结束时间
                this.movieData.planTimeEnd = movieTable.length ?  movieTable[movieTable.length - 1].endTimeC : this.movieData.planTime
            },
            // 获取连排详情
            getPlanData() {
                getmoviePlanDetails({
                    id: this.planUid
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    let {approveStatus, cinemaUid, hallName, hallTypeCode, hallUid, joinFlag, joinMovieName, mustRightSeat, permitDiscount, permitSaleBox, intervalMinute, planTime, planTimeEnd, priceProgramName, priceProgramUid, timeLong, isCounter, isSelfServiceTerminals, soldSeatCount, saleStatus} = res.data
                    
                    let planDate = planTime.split(' ')[0]
                    this.year = planTime.includes('T') ? planTime.split('T')[0].split('-')[0] : planTime.split(' ')[0].split('-')[0]
                    this.month = planTime.includes('T') ? planTime.split('T')[0].split('-')[1] : planTime.split(' ')[0].split('-')[1]
                    this.day = planTime.includes('T') ? planTime.split('T')[0].split('-')[2] : planTime.split(' ')[0].split('-')[2]
                    this.planHour = planTime.includes('T') ? planTime.split('T')[1].split(':')[0] : planTime.split(' ')[1].split(':')[0]
                    this.curPlanDate = this.planHour < 6 ? this.formatDateTime(new Date(planTime).getTime() - 1000 * 24 * 60 * 60, 1) : this.formatDateTime(new Date(planTime).getTime(), 1)
                    this.nextPlanDate = this.formatDateTime(new Date(this.curPlanDate).getTime() + 1000 * 24 * 60 * 60, 1)
                    this.planMinute = planTime.includes('T') ? planTime.split('T')[1].split(':')[1] : planTime.split(' ')[1].split(':')[1]
                    this.copyMinute = this.planMinute
                    this.showPlanDate = this.isEditMode ? `${this.year}年${this.month}月${this.day}日${this.planHour}时` : `${this.year}年${this.month}月${this.day}日${this.planHour}时${this.planMinute}分`
                    this.permitSaleBox = !!permitSaleBox
                    this.permitDiscount = !!permitDiscount
                    this.mustRightSeat = !!mustRightSeat
                    this.movieData = {approveStatus, cinemaUid, hallName, hallTypeCode, hallUid, joinFlag, joinMovieName, mustRightSeat, permitDiscount, permitSaleBox, intervalMinute, planTime, planTimeEnd, priceProgramName, priceProgramUid, timeLong, planDate, isCounter, isSelfServiceTerminals, soldSeatCount, saleStatus}
                    this.copyIntervalMin = this.movieData.intervalMinute
                    this.getTimeLine()
                    this.getPlanList()
                    // 连场影片数据
                    let movieTable = JSON.parse(JSON.stringify(res.data.detailVos))
                    movieTable.forEach((item, i) => {
                        item.startTimeC = !i ? this.movieData.planTime : this.formatDateTime((new Date(movieTable[movieTable.length - 1].endTimeC) + this.movieData.intervalMinute * 60 * 1000), 0)
                        item.startTime = item.startTime = this.formatDateTime(new Date(item.startTimeC), 2)
                        item.endTimeC = this.formatDateTime((new Date(item.startTimeC) + item.timeLong * 60 * 1000), 0)
                        item.endTime = this.formatDateTime((new Date(item.startTimeC) + item.timeLong * 60 * 1000), 2)
                    })
                    
                    this.changeMovieTime(movieTable)
                    // 价格方案和渠道
                    // if (this.isEditMode) {
                        let relatedArr = [], concatArr = []
                        res.data.ticketList.forEach(item => {
                            if (res.data.baseTicketList.every(citem => citem.uid != item.uidBaseClass)) {
                                concatArr.push(item)
                            } else {
                                relatedArr.push(item)
                            }
                        })
                        concatArr.forEach(item => {
                            item.baseFlag = 1
                            item.switchStatus = item.saleStatus == 'SALE'
                        })
                        let ticketData = JSON.parse(JSON.stringify(res.data.baseTicketList)).concat(concatArr)
                        ticketData.forEach(item => {
                            relatedArr.some(citem => {
                                if (citem.uidBaseClass == item.uid) {
                                    item.price = citem.price
                                    item.addFee = citem.addFee
                                    item.switchStatus = citem.saleStatus == 'SALE'
                                    return true
                                }
                            })
                            if (!item.addFee) item.addFee = 0
                            if (!item.price) item.price = 0
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.price = parseFloat(item.price).toFixed(2)
                            if (!item.name) item.name = item.ticketName
                            if (!item.switchStatus) {
                                item.switchStatus = item.baseFlag == 0
                            }
                            // 避免 提交的时候 uid 出错  
                            // 原因为 ticketList 里 可能出现 base 里不存在的 票类
                            item.saveUid = item.uid ? item.uid : item.uidBaseClass
                        })
                        if (!this.isEditMode) ticketData = ticketData.filter(item => item.price != 0)
                        this.ticketData = ticketData

                        let relatedChannelArr = [], concatChannelArr = []
                        res.data.channelList.forEach(item => {
                            if (res.data.baseChannelList.every(citem => citem.uid != item.uidChannel)) {
                                concatChannelArr.push(item)
                            } else {
                                relatedChannelArr.push(item)
                            }
                        })
                        let channelData = JSON.parse(JSON.stringify(res.data.baseChannelList)).concat(concatChannelArr.map(item => {
                            item.switchStatus = item.saleStatus == 'SALE'
                            return item
                        }))
                        channelData.forEach(item => {
                            relatedChannelArr.some(citem => {
                                if (citem.uidChannel == item.uid) {
                                    item.price = citem.price
                                    item.cinemaFee = citem.cinemaFee
                                    item.feeFg = citem.feeFg
                                    item.switchStatus = citem.saleStatus == 'SALE'
                                    return true
                                }
                            })
                            if (!item.price) item.price = 0
                            if (!item.addFee) item.addFee = 0
                            if (!item.cinemaFee) item.cinemaFee = 0
                            if (!item.feeFg) item.feeFg = 0
                            if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                            item.price = parseFloat(item.price).toFixed(2)
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                            item.cinemaFee = parseFloat(item.cinemaFee).toFixed(2)
                            if (!item.name) item.name = item.channelName
                            if (!item.switchStatus) {
                                item.switchStatus = false
                            }
                            // 避免 提交的时候 uid 出错  
                            // 原因为 channelList 里 可能出现 base 里不存在的 票类
                            item.saveUid = item.uidChannel ? item.uidChannel : item.uid
                        })
                        if (!this.isEditMode) channelData = channelData.filter(item => item.price != 0)
                        this.channelData = channelData
                        this.mulCheckedData = [{
                            uid: '000000',
                            name: '柜台'
                        }, {
                            uid: '111111',
                            name: '自助终端'
                        }].concat(this.channelData.map(item => {
                            return {
                                uid: item.uid,
                                name: item.name
                            }
                        }))
                        if (this.movieData.isCounter)  this.channelMulData = this.channelMulData.concat(['000000'])
                        if (this.movieData.isSelfServiceTerminals) this.channelMulData = this.channelMulData.concat(['111111'])
                        
                        
                        this.$nextTick(() => {
                            
                            this.ticketData.filter(item => item.switchStatus).forEach(row => {
                                this.$refs.ticketMultipleTable.toggleRowSelection(row, true)
                            })
                            
                            this.channelData.filter(item => item.switchStatus).forEach(row => {
                                this.$refs.channelMultipleTable.toggleRowSelection(row, true)
                            })
                        })
                        
                        this.isIndeterminate = this.channelMulData.length > 0 && this.channelMulData.length < this.mulCheckedData.length
                        this.checkAll = this.channelMulData.length == this.mulCheckedData.length
                        
                    // } else {
                    //     res.data.ticketList.forEach(item => {
                    //         item.addFee = parseFloat(item.addFee).toFixed(2)
                    //         item.price = parseFloat(item.price).toFixed(2)
                    //     })
                    //     this.ticketData = res.data.ticketList
                    //     res.data.channelList.forEach(item => {
                    //         if (!item.price) item.price = 0
                    //         if (!item.addFee) item.addFee = 0
                    //         if (!item.cinemaFee) item.cinemaFee = 0
                    //         if (!item.feeFg) item.feeFg = 0
                    //         if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                    //         item.price = parseFloat(item.price).toFixed(2)
                    //         item.addFee = parseFloat(item.addFee).toFixed(2)
                    //         item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                    //         item.cinemaFee = parseFloat(item.cinemaFee).toFixed(2)
                    //     })
                    //     this.channelData = res.data.channelList
                    //     this.channelMulData = res.data.channelList
                    // }

                })
            },
            // 切换渠道多选 方法
            handleCheckAllChange(val) {
                this.channelMulData = val ? this.mulCheckedData : []
                this.$refs.channelMultipleTable.clearSelection()
                let channelMulData = this.channelData.reduce((data, item) => {
                    return this.channelData.some(item => !this.channelMulData.every(citem => citem.uid != item.uid)) ? data.concat(item) : data
                }, [])
                channelMulData.forEach(row => {
                    this.$refs.channelMultipleTable.toggleRowSelection(row)
                })
                this.isIndeterminate = false
            },
            handleCheckedChannelChange(value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.mulCheckedData.length
                this.isIndeterminate = (checkedCount > 0) && (checkedCount < this.mulCheckedData.length)
                this.movieData.isCounter = value.some(item => item == '000000')
                this.movieData.isSelfServiceTerminals = value.some(item => item == '111111')
            },
            singleCheckChange(val) {
                let channelVal = this.channelData.find(item => val == item.uid)

                channelVal && this.$refs.channelMultipleTable.toggleRowSelection(channelVal)
            },
            tableFixed(scope) {
                let tmp1 = this.ticketData[scope.$index].price, tmp2 = this.ticketData[scope.$index].addFee
                this.ticketData[scope.$index].price = Number(tmp1).toFixed(2)
                this.ticketData[scope.$index].addFee = Number(tmp2).toFixed(2)   
            },
            cichannelToFixed(scope) {
                let tmp1 = this.channelData[scope.$index].price, tmp2 = this.channelData[scope.$index].addFee, tmp3 = this.channelData[scope.$index].netSaleAddPrice
                this.channelData[scope.$index].price = Number(tmp1).toFixed(2)
                this.channelData[scope.$index].addFee = Number(tmp2).toFixed(2)
                this.channelData[scope.$index].netSaleAddPrice = Number(tmp3).toFixed(2)
            },
            percentTableToFixed(scope) {
                let tmp1 = this.movieTable[scope.$index].percentPrice, tmp2 = this.movieTable[scope.$index].minPrice, tmp3 = this.movieTable[scope.$index].publisherRate
                this.movieTable[scope.$index].percentPrice = Number(tmp1).toFixed(2)
                this.movieTable[scope.$index].minPrice = Number(tmp2).toFixed(2)
                this.movieTable[scope.$index].publisherRate = Number(tmp3).toFixed(2)
            },
            savePlan() {
                // 基础验证
                var p1 = new Promise((resolve, reject) => {
                    let errorData = !this.movieData.joinMovieName, errorData3 = this.movieData.intervalMinute  < 1 || this.movieData.intervalMinute > 99 || !/^\+?[1-9][0-9]*$/.test(this.movieData.intervalMinute)
                    let errorData2 
                    errorData2 = this.movieTable.length < 2 ? '连场最少设置两部影片' : this.movieTable.length > 9 ? '连场影片不得超过9部' : false
                    let errorData4
                    this.movieData.timeLong = this.movieTable.reduce((data, item) => data += item.timeLong, 0) + (this.movieTable.length - 1) * this.movieData.intervalMinute
                    let tmpTimeStart = new Date(`${this.year}-${this.month}-${this.day} ${this.planHour}:${this.planMinute}`).getTime(),
                    tmpTimeEnd = tmpTimeStart + this.movieData.timeLong * 60 * 1000
                    // 判断调整完成之后的时间是否与同影厅其他场次冲突
                    if (this.hallData.some(item => (tmpTimeStart < (new Date(item.showTimeEnd).getTime() + this.timeInterval * 60 * 1000) && tmpTimeEnd > new Date(item.showTimeEnd).getTime()) || (tmpTimeEnd > (new Date(item.showTimeStart).getTime() + this.timeInterval * 60 * 1000) && tmpTimeStart < new Date(item.showTimeStart).getTime()))) {
                        errorData4 = '放映时间区间无法容纳该放映计划，请重新设置放映时间!'
                    }
                    // 判断调整完成之后结束时间是否超过早上6点
                    if (this.curPlanDate != this.formatDateTime(tmpTimeEnd, 1) && 
                        tmpTimeEnd > new Date(this.formatDateTime(`${this.nextPlanDate} 06:00`, 0)).getTime()) {
                        errorData4 = '放映结束时间不能超过次日早上6点!'
                    }
                    
                    if (!errorData && !errorData2 && !errorData3 && !errorData4) {
                        resolve()
                    } else if (errorData) {
                        reject(`请输入正确的连场名称`)
                    } else if (errorData2) {
                        reject(errorData2)
                    } else if (errorData3) {
                        reject(`场次间隔栏请输入一个介于1和99之间的整数`)
                    } else if (errorData4) {
                        reject(errorData4)
                    }
                    
                })
                // 校验 上下映时间
                var timeP = new Promise((resolve, reject) => {
                    let errorMovieData = []
                    this.movieTable.forEach(item => {
                        if (new Date(item.startTimeC).getTime() >= new Date(item.dateShowOff).getTime() || new Date(item.startTimeC).getTime() < new Date(item.dateShowFirst).getTime()) {
                            errorMovieData.push(item)
                        }
                    })
                    let errorData = errorMovieData.map(item => item.movieName)
                    if (!errorData.length) {
                        resolve()
                    } else if (errorData) {
                        reject(`电影${errorData.join(',')}的放映时间不在上下映时间范围内, 请修改!`)
                    } 
                    
                })
                var timeInfoP = new Promise((resolve, reject) => {
                    let errorObj = this.checkTimeInfoRight()
                    
                    if (!errorObj.planError) {
                        resolve()
                    } else if (errorObj.planError) {
                        reject(errorObj.errorType)
                    } 
                    
                })
                var p2 = new Promise((resolve, reject) => {
                    let errorData = this.movieTable.find(item => (item.minPrice > 999.99) || (item.minPrice <= 0) || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(item.minPrice))

                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`电影${errorData.movieName}的最低票价必须大于0小于1000的数字，且小数位不能超过2位!`)
                    } 
                    
                })

                var p3 = new Promise((resolve, reject) => {
                    let errorData = this.movieTable.find(item => (item.publisherRate > 100) || (item.publisherRate < 0) || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(item.publisherRate))

                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`电影${errorData.movieName}的分账比例输入范围为0-100,允许2位小数!`)
                    }
                })
                var p4 = new Promise((resolve, reject) => {
                    let errorData = this.movieTable.reduce((data, item) => {
                        return data += Number(item.percentPrice)
                    }, 0) != 100
                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`所有连场的影片分摊比例之和必须为100`)
                    } 
                })
                var p5 = new Promise((resolve, reject) => {
                    let errorData = this.ticketData.filter(item => item.switchStatus).find(item => item.price > 999.99 || item.price <= 0)
                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`票类${errorData.name}的票价必须大于0小于1000的数字，且小数位不能超过2位!`)
                    } 
                })
                var p6 = new Promise((resolve, reject) => {
                    let errorData = this.channelData.filter(item => item.switchStatus).find(item => Number(item.price) > 999.99 || item.price <= 0)
                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`渠道${errorData.name}的票价必须大于0小于1000的数字，且小数位不能超过2位!`)
                    }                
                })

                var p7 = new Promise((resolve, reject) => {
                    let ticket = this.ticketData.filter(item => item.switchStatus).sort((a,b) => { return a.price-b.price })
                    let errorData = ticket.length ? this.movieTable.find(item => item.percentPrice * ticket[0].price / 100 < item.minPrice) : ''
                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`电影${errorData.movieName}在票类${ticket[0].name}的票价小于最低票价，请修改票价分摊比例`)
                    }                
                })

                var p8 = new Promise((resolve, reject) => {
                    let channel = this.channelData.filter(item => item.switchStatus).sort((a,b) => { return a.price-b.price })
                    let errorData = channel.length ? this.movieTable.find(item => item.percentPrice * channel[0].price / 100 < item.minPrice) : ''
                    if (!errorData) {
                        resolve()
                    } else if (errorData) {
                        reject(`电影${errorData.movieName}在渠道${channel[0].name}的票价小于最低票价，请修改票价分摊比例`)
                    }                
                })
                
                Promise.all([p1, timeP, timeInfoP, p2, p3, p4, p5, p6, p7, p8]).then(() => {
                    this.submitPlan()
                }).catch(res => {
                    console.log(res)
                    this.error(res)
                })
            },
            submitPlan() {
                let {cinemaUid, hallUid, joinFlag, planTimeEnd, intervalMinute, isCounter, isSelfServiceTerminals} = this.movieData
                let planDate = `${this.year}-${this.month}-${this.day}`, planTimeStart = this.movieData.planTime, permitSaleBox = this.permitSaleBox ? 1 : 0, mustRightSeat = this.mustRightSeat ? 1 : 0, permitDiscount = this.permitDiscount ? 1 : 0, planUid = this.planUid, priceProgramName =  this.movieData.priceProgramName, priceProgramUid = this.movieData.priceProgramUid, joinMovieName = this.movieData.joinMovieName, movieCode = this.movieTable[0].movieCode, minPrice = this.movieTable[0].minPrice, rate = this.movieTable[0].rate, movieLanguage = this.movieTable[0].movieLanguage,
                schPlanBaseTicketVoList = this.ticketData.filter(item => item.price > 0).map(item => {
                    return {
                        addFee: item.addFee,
                        baseFlag: item.baseFlag,
                        price: item.price,
                        ticketName: item.name,
                        uidBaseClass: item.saveUid,
                        saleStatus: item.switchStatus ? 'SALE' : 'NOT_SALE'
                    }
                }),
                schPlanFavTicketVoList = this.channelData.filter(item => item.price > 0).map(item => {
                    return {
                        addFee: item.addFee,
                        channelName: item.name,
                        cinemaFee: item.cinemaFee,
                        // feeFg: item.feeFg,
                        feeFg: 0,
                        price: item.price,
                        uidChannel: item.saveUid,
                        saleStatus: item.switchStatus ? 'SALE' : 'NOT_SALE'
                    }
                }),
                planTimeVoList = this.movieTable.map(item => {
                    return {
                        minPrice: item.minPrice,
                        movieCode: item.movieCode,	
                        percentPrice: item.percentPrice,
                        rate: item.publisherRate,	
                        showIndex: item.showIndex,
                        movieDescLanguage: item.movieLanguage,
                        planTimeStart: item.startTimeC,
                        planTimeEnd: item.endTimeC
                    }
                })
                let saveData = {cinemaUid, hallUid, joinFlag, mustRightSeat, permitDiscount, joinMovieName, permitSaleBox, planUid, priceProgramName, priceProgramUid, planTimeEnd,planDate, planTimeStart, schPlanBaseTicketVoList, schPlanFavTicketVoList, planTimeVoList, movieCode, minPrice, rate, movieLanguage, intervalMinute, isCounter: isCounter ? 1 : 0, isSelfServiceTerminals: isSelfServiceTerminals ? 1 : 0 }
                updateMoviePlan({
                    list: this.movieData.saleStatus == 'STOP' ? [Object.assign(saveData, {isNeedApprove: 1})] : [Object.assign(saveData, {isNeedApprove: 0})]
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if(res.code == 200 && res.data) {
                        if (res.data.length) {
                            return this.warning('保存不成功, 请修改价格方案')
                        }
                        this.success('保存成功, 即将跳转至排片详情')
                        setTimeout(() => {
                            this.$store.commit("tagNav/removeTagNav", {
                                name: this.$route.name,
                                path: this.$route.path,
                                title: this.$route.meta.title,
                                query: this.$route.query
                            })
                            if (this.referer) {
                                this.$router.push({path: this.referer})
                            } else {
                                this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                            }
                        }, 1000)
                    }
                })
            },  
            cancelHandle() {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                if (this.referer) {
                    this.$router.push({path: this.referer})
                } else {
                    this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                }
            },
            closePage() {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                if (this.referer) {
                    this.$router.push({path: this.referer})
                } else {
                    this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                }
            },
            formatDateTime(timeStamp, type) { // type: 0 全格式 1 仅日 2 仅时间
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
                return type == 0 ? `${y}-${m}-${d} ${h}:${mm}` : type == 1 ? `${y}-${m}-${d}` : type == 2 ? `${h}:${mm}` : `${y}-${m}-${d} ${h}:${mm}`
            },
            rowIsDisabled(row) {
                return row.baseFlag
            },
            // 校验 是否在 上下映时间内
            checkTimeRight() {
                let errorData = []
                this.movieTable.forEach(item => {
                    if (new Date(item.startTimeC).getTime() >= new Date(item.dateShowOff).getTime() || new Date(item.startTimeC).getTime() < new Date(item.dateShowFirst).getTime()) {
                        errorData.push(item)
                    }
                })
                return {
                    planError: errorData.length,
                    errorType: `影片${errorData.map(item => item.movieName).join(',')}的开场时间不在上下映范围内, 不能编排放映计划`
                }
            },
            // 校验 是否 在信息表时间内
            checkTimeInfoRight() {
                let errorData = []
                this.movieTable.forEach(item => {
                    if (item.planInfoMovieTimeVoList.length) {
                        let planDate = this.formatDateTime(new Date(item.startTimeC).getTime(), 1)
                        let isRight = item.planInfoMovieTimeVoList.some(citem => {
                            if (item.startDate && item.endDate && item.endTime && item.startTime) {
                                return (new Date (planDate).getTime() >= new Date(`${citem.startDate}`).getTime() && new Date(planDate).getTime() <= new Date(citem.endDate).getTime()) && (new Date(`${item.planTimeStart}`).getTime() >= new Date(`${planDate} ${citem.startTime}`).getTime() && new Date(`${item.planTimeStart}`).getTime() <= new Date(`${planDate} ${citem.endTime}`).getTime())
                                    
                                
                            } else if (citem.startDate && citem.endDate && (!citem.endTime || !citem.startTime)) {
                                 
                                return new Date (planDate).getTime() >= new Date(`${citem.startDate}`).getTime() && new Date(planDate).getTime() <= new Date(citem.endDate).getTime()
                                
                            } else if ((!citem.startDate || !citem.endDate) && citem.endTime && citem.startTime) {
                                
                                return new Date(`${item.planTimeStart}`).getTime() >= new Date(`${planDate} ${citem.startTime}`).getTime() && new Date(`${item.planTimeStart}`).getTime() <= new Date(`${planDate} ${citem.endTime}`).getTime()
                            }else {
                                return true
                            }
                        }) 
                        if (!isRight) {
                            errorData.push(item)
                        }
                    }
                })

                return {
                    planError: errorData.length,
                    errorType: `影片${errorData.map(item => item.movieName).join(',')}的开场时间不在影片允许的排片时间内, 不能编排放映计划`
                }
                
            }
        },
        computed: {
            approveStatus() {
                return this.movieData.approveStatus == 'NOT_APPROVE' ? '未审核' : this.movieData.approveStatus == 'WAIT_APPROVE' ? '待审核' : this.movieData.approveStatus == 'REJECT' ? '已驳回' :  '已审核'
            }
        }
        
    }
</script>

<style lang="scss">
    .movie-plan-continuity {
        padding-bottom: 64px;
        .basic-info {
            margin-left: 30px;
            margin-bottom: 30px;
            .base-info-title {
                margin-bottom: 16px;
                font-size: 14px;
                color: #333;
            }
            // form css reset
            .el-form-item {
                margin-bottom: 14px;
            }
            .el-form-item__label {
                font-size: 12px;
                text-align: left;
            }
            .el-select,
            .el-textarea,
            .el-input__inner {
                width: 360px;
            }
            .cinema-stock-edit-text {
                font-size: 12px;
                color: #666;
            }
            .separate-accounts-date,
            .separate-accounts-price,
            .separate-accounts-action {
                display: inline-block;
                //   height: 32px;
            }
            .canal-pirce-input {
                .el-input {
                    width: 48px;
                    height: 20px;
                    .el-input__inner {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        padding: 0 0 0 10px;
                    }
                }
            }
            .el-form-item__content {
                font-size: 12px;
                color: #666;
            }
            //  基本信息
            &.movie-info {
                .el-form {
                    width: 1000px;
                    overflow: hidden;
                }
                .short-input {
                    width:40px;
                    font-size: 12px;
                    color: #666;
                    .el-input__inner {
                        width: 40px;
                        padding: 0 5px;
                        height: 20px;
                        line-height: 20px; 
                    }
                }
                .normal-input {
                    width: 152px;
                    font-size: 12px;
                    color: #666;
                    .el-input__inner {
                        width: 152px;
                        padding: 0 5px;
                        height: 32px;
                        line-height: 32px;
                        font-size: 12px; 
                    }
                }
                .movie-lang {
                    .el-select {
                        position: relative;
                        top: -2px;
                        width: 200px;
                        height: 30px;
                        .el-input__inner {
                            width: 200px;
                            height: 30px;
                        }
                        .el-input {
                            width: 200px;
                            height: 30px;
                            line-height: 30px;
                        }
                    }
                }
                .el-form-item {
                    // float: left;
                    // width: 50%;
                    height: 34px;
                }
                .el-date-editor {
                    width: 120px;
                    .el-input__inner {
                        width: 120px;
                    }
                }
            }
            .table-rule {
				color: #3f3f3f;
				font-size: 12px;
				height: 20px;
				line-height: 20px;
			}
            .table-bottom-menu {
                width: 360px;
				position: relative;
				margin-top: 10px;
            }
            .prcie-promise {
                font-size: 12px;
                margin-bottom: 8px;
				color: #666;
				height: 20px;
				line-height: 20px;
                span {
                    font-size: 12px;
                }
			}
            // 修改 内部 tab 样式
            .el-tabs__header.is-top {
                border-bottom: none;
            }
            .el-tabs--card > .el-tabs__header {
                .el-tabs__nav {
                    border: 1px solid #3b74ff;
                    border-radius: 4px;
                    .el-tabs__item {
                        transition: none;
                        min-width: 80px;
                        box-sizing: border-box;
                        padding: 0 16px;
                        height: 32px;
                        line-height: 32px;
                        font-size: 12px;
                        vertical-align: middle;
                        color: #3b74ff;
                        text-align: center;
                        &.is-active {
                            background-color: #3b74ff;
                            border-color: #3b74ff;
                            color: #fff;
                        }
                    }
                }
            }
            .el-table {
                max-width: 1200px;
                .input-con {
                    position: relative;
                    display: inline-block;
                    font-size: 12px;
                    .rmb-hover {
                        position: absolute;
                        left: 10px;
                        top: 2px;
                        font-size: 12px;
                        font-style: normal;
                    }
                    .el-input__inner {
                        width: 150px;
                        height: 20px;
                        padding-left: 20px;
                        padding-right: 0px;
                    }
                    .el-input {
                        width: 80px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                    }
                }
            }

        }

        .bottom-handler-tool {
            height: 64px;
            // width: 100%;
            position: fixed;
            z-index: 999;
            bottom: 0;
            right: 0;
            background-color: #f5f5f5;
            .btn-area {
                width: 500px;
                margin: 0 auto;
                height: 64px;
                text-align: center;
                padding-top: 16px;
                box-sizing: border-box;
            }
        }
    }
    // 导入价格方案
    .add-movie-dialog {
        .el-form-item {
            .search-wrap {
                display: inline-block; 
                margin-right: 10px;
                span {
                    color: #666;
                    font-size: 12px;
                }
            }
            .el-input {
                width: 120px;
                height: 32px;
                .el-input__inner {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 0 0 0 10px;
                }
            }
            .el-select {
                margin-right: 10px;
                width: 120px;
                height: 32px;
                .el-input__suffix {
                    right: 0;
                }
                .el-select__caret {
                    font-size: 12px;
                }
                .el-input__inner {
                    width: 120px;
                    height: 32px;
                    padding-right: 32px;
                }
                .el-input {
                    width: 120px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                }
                .el-input__icon {
                    line-height: 20px;
                }
            }
        }
    }
</style>