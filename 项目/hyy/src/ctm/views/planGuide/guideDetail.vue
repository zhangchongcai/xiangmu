<template>
    <div class="edit-plan-guide">
        <div class="view-ctrl-container" :style="{'margin-bottom': approveRecordData.length > 0 ? '0px' : '200px'}">
            <div class="guide-info">
                <div class="info-options"><span>期数:</span>{{issuesNo}}</div>
                <div class="info-options"><span>版本:</span>{{versionNoShow}}</div>
                <div class="info-options"><span>适用日期:</span>
                    <el-date-picker
                        :disabled="mode == 'view'"
                        v-model="timeValue"
                        type="daterange"
                        :clearable="false"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="guide-explain">
                <span>说明:</span>
                <el-input
                    :disabled="mode == 'view'"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入"
                    resize="none"
                    v-model="guideData.remark">
                </el-input>
            </div>
            <div class="plan-guide-container" :class="showList[0].type">
                <div class="title" >
                    <div class="title-container" @click="changeShow(0)">
                        <i class="el-icon-arrow-down"></i><span>强制型影片指导</span>
                    </div>
                </div>
                <div>
                   <div class="table-top-menu-con">
                        <div class="btn-tool">
                            <div v-if="mode != 'view'" class="table-top-menu" @click="addGuide('force')">新建</div>
                            
                        </div>
                    </div>
                    <el-table
                    class="force-guide-table"
                    :data="forceGuide">
                        <el-table-column
                            width="60"
                            label="序号"
                        >
                           <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="200"
                            label="影片名称"
                            prop="movieName"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.movieName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="级别"
                            prop="movieLevel"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.movieLevel}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="制式"
                            width="180"
                            prop="disVersions"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.disVersions}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="时长(分钟)"
                            prop="timeLong"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.timeLong}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="180"
                            label="首映/落幕"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.dateShowFirst}} 至 {{item.dateShowOff}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="180"
                            label="适用日期"
                        >
                            <template slot-scope="scope">
                                {{scope.row.startDate}} 至 {{scope.row.endDate}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="适用影城"
                        >
                            <template slot-scope="scope">
                                已选{{scope.row.guidanceMovieCinemaVoList.length}}家
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-for="(item, index) in forceHallList"
                            :key="index"
                            :label="item == 'h' ? '黄金场' : item + '个厅'"
                        >
                            <template slot-scope="scope" v-if="scope.row.movieDetailVoList.find(hall => hall.detailType == item)">
                                {{scope.row.movieDetailVoList.find(hall => hall.detailType == item).numberOrRatio == 1 ? scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumLower == scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumUpper ? scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumLower + '场' : scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumLower + '-' + scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumUpper + '场' : scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeRatioLower + '-' + scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeRatioUpper + '%' }}
                            </template>
                            <template slot-scope="scope" v-else>
                                {{''}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            fixed="right"
                            width="200"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click="viewGuide('force', scope)">查看</el-button>
                                <el-button type="text" v-if="mode == 'add' || mode == 'edit'" @click="editGuide('force', scope)">编辑</el-button>
                                <el-button type="text" v-if="mode == 'add' || mode == 'edit'" @click="delGuide('force', scope)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="plan-guide-container" :class="showList[1].type">
                <div class="title" >
                    <div class="title-container" @click="changeShow(1)">
                        <i class="el-icon-arrow-down"></i><span>指导型影片指导</span>
                    </div>
                </div>
                <div>
                    <div class="table-top-menu-con">
                        <div class="btn-tool">
                            <div v-if="mode != 'view'" class="table-top-menu" @click="addGuide('advise')">新建</div>
                            
                        </div>
                    </div>
                    <el-table
                    class="advise-guide-table"
                        :data="adviseGuide">
                        <el-table-column
                            width="60"
                            label="序号"
                        >
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="200"
                            label="影片名称"
                            prop="movieName"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.movieName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="级别"
                            prop="movieLevel"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.movieLevel}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="180"
                            label="制式"
                            prop="disVersions"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.disVersions}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="时长(分钟)"
                            prop="timeLong"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.timeLong}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="180"
                            label="首映/落幕"
                        >
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.movieInfoVoList" class="single-movie-table-row" :key="index">{{item.dateShowFirst}} 至 {{item.dateShowOff}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="180"
                            label="适用日期" 
                        >
                            <template slot-scope="scope">
                                {{scope.row.startDate}} 至 {{scope.row.endDate}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="适用影城"
                        >
                            <template slot-scope="scope">
                                已选{{scope.row.guidanceMovieCinemaVoList.length}}家影城
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-for="(item, index) in adviseHallList"
                            :key="index"
                            :label="item == 'h' ? '黄金场' : item + '个厅'"
                        >
                           <template slot-scope="scope" v-if="scope.row.movieDetailVoList.find(hall => hall.detailType == item)">
                                {{scope.row.movieDetailVoList.find(hall => hall.detailType == item).numberOrRatio == 1 ? scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumLower == scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumUpper ? scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumLower + '场' : scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumLower + '-' + scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeNumUpper + '场' : scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeRatioLower + '-' + scope.row.movieDetailVoList.find(hall => hall.detailType == item).timeRatioUpper + '%' }}
                            </template>
                            <template slot-scope="scope" v-else>
                                {{''}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            fixed="right"
                            width="200"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click="viewGuide('advise', scope)">查看</el-button>
                                <el-button type="text" v-if="mode == 'add' || mode == 'edit'" @click="editGuide('advise', scope)">编辑</el-button>
                                <el-button type="text" v-if="mode == 'add' || mode == 'edit'" @click="delGuide('advise', scope)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
                <!-- :header-cell-style="{'background': '#F2F4FD'}" -->
                <!-- stripe -->
        <el-table
                v-show="approveRecordData.length > 0"
                :data="approveRecordData"
                style="width: 100%; margin-bottom: 10px">
            <el-table-column
                    prop="action"
                    label="审批记录"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.action === 'PASS'">通过</span>
                    <span v-if="scope.row.action === 'REJECT'">驳回</span>
                    <span v-if="scope.row.action === 'SUBMIT'">提交</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="审批意见"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveUserName"
                    label="审批人"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveTime"
                    label="审批时间"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <el-form class="approve-form" v-show="showApprove" :model="approveForm" :rules="rules" ref="approveForm" label-width="100px">
            <el-form-item label="审批结果：" prop="isPass">
                <el-radio v-model="approveForm.isPass" :label="1">通过</el-radio>
                <el-radio v-model="approveForm.isPass" :label="0">驳回</el-radio>
            </el-form-item>
            <el-form-item label="审批意见：" prop="approveRemark">
                <el-input
                        style="width: 360px"
                        type="textarea"
                        :rows="3"
                        resize="none"
                        placeholder="请输入"
                        show-word-limit
                        v-model="approveForm.approveRemark"
                        maxlength="500">
                </el-input>
                <!-- <span style="position: absolute; bottom: 0; line-height: 12px; font-size: 12px; margin-left: 10px;">{{approveForm.approveRemark.length}}/500</span> -->
            </el-form-item>
        </el-form>
        <div class="save-tool" v-show="showSaveTool">
            <el-button class="w80-btn" v-if="mode != 'view' && (guideStatus == '0' || guideStatus == '-1' || guideStatus == '4' || guideStatus == '3')" type="primary" @click="submitCheck(submitApprove)">提交审核</el-button>
            <el-button class="w80-btn" v-if="mode != 'view'" type="primary" @click="submitCheck(savePlanGuide)">保存</el-button>
            <el-button class="w80-btn" v-if="mode != 'view' " @click="cancelEdit">取消</el-button>
            <el-button class="w80-btn" v-if="mode == 'view' && showApprove" type="primary" @click="approveAllow">确定</el-button>
            <el-button class="w80-btn" v-if="mode == 'view' && !showApprove" @click="cancelEdit">关闭</el-button>
            <el-button class="w80-btn" v-if="mode == 'view' && showApprove" @click="cancelEdit">返回</el-button>
            
        </div>
        <component ref="planGuide" :is="curComponentType ? 'newPlanGuide' : ''" :add-type="curComponentType" @cancelAddGuide="cancelAddGuide" :show-type="curComponentShowType" :force-guide="forceGuide" :advise-guide="adviseGuide" :time-value="timeValue" :mode="mode" :editData="editData" @confirmGuide="confirmGuide" @changeGuideData="changeGuideData" :curCtrlGuideIndex="curCtrlGuideIndex"></component>
        <!-- <component :is="addObj.second ? 'newPlanGuide' : ''" :add-type="addObj.second" @cancelAddGuide="cancelAddGuide"></component> -->
        <!-- <el-dialog :visible.sync="timeSetErrorDialog">
            <div class="">
                <h2><i class="el-icon-warning"></i>“黄金场”输入不符合规范</h2>
                <div>示例:</div>
                <div>
                    <div class="input-rule">
                        固定场：3场、3-5场；3场&lt;=排片场次&lt;=5场
                    </div>
                    <div class="input-rule">
                        排片比率：10-20%；10%&lt;=排片场次/总场次<br/>&lt;=20%
                    </div>
                    <div class="input-rule">
                        周转率：10%-20%；影院总排片数下限*10%&lt;=排片<br/>场次&lt;=影院总排片数上限*20%
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="timeSetErrorDialog = false">关闭</el-button>
            </div>
        </el-dialog> -->

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            @closed="handleClose">
            <div v-if="errorObj.data && errorObj.data.forceErrorData.length" style="font-size: 14px; color: #666; text-align: center; margin-bottom: 5px;">强制型: {{errorObj.data.forceErrorData.join(',') + errorObj.msg}}</div>
            <div v-if="errorObj.data && errorObj.data.adviseErrorData.length" style="font-size: 14px; color: #666; text-align: center; margin-bottom: 5px;">指导型: {{errorObj.data.adviseErrorData.join(',') + errorObj.msg}}</div>
            
            
            <span slot="footer" class="dialog-footer">
                <el-button class="w80-btn" @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import newPlanGuide from './newPlanGuide'
import {getPlanGuiideDetail, savePlanGuide, updatePlanGuiideDetail, subPlanGuideApprove, approvePlanGuide, getIssuesNo} from 'ctm/http/interface'
    export default {
        data() {
            let approveRemarkValidator = (rule, value, callback) => {
                if (!value && !this.approveForm.isPass) {
                    callback(new Error('请输入审批意见'))
                } else {
                    callback()
                }
            }
            return {
                mode: 'view',
                issuesNo: '',
                versionNo: '',
                versionNoShow: '',
                guideUid: '',
                approveRemark: '',
                guideData: {},
                guideStatus: '-1',
                timeValue: '',
                textareaValue: '',
                showList: [
                    {type: 'show'},
                    {type: 'show'}
                ],
                timeSetErrorDialog: false,
                addList: [],
                // addObj: {
                //     first: '',
                //     second: ''
                // },
                curComponentType: '',
                curComponentShowType: '',
                forceGuide: [],
                adviseGuide: [],
                forceHallList: [],
                adviseHallList: [],
                editData: {},
                curCtrlGuideIndex: 0,
                errorObj: {},
                dialogVisible: false,
                // 审批记录
                approveRecordData: [],
                showApprove: false,
                rules: {
                    isPass: [
                        { required: true, message: '请选择审批结果', trigger: 'change' }
                    ],
                    approveRemark: [
                        { validator: approveRemarkValidator, trigger: 'submit' }
                    ],
                },
                approveForm: {
                    isPass: 1,
                    approveRemark: ''
                },
                showSaveTool: false,
                pickerOptions: {
 
                }
            }
        },
        created() {
            this.mode = this.$route.path.includes('add') ? 'add' : this.$route.path.includes('view') ? 'view' : 'edit'
            // 不是新建
            if (this.mode != 'add') {
                this.versionNo = this.$route.query ? this.$route.query.versionNo : ''
                this.versionNoShow = this.versionNo
                this.issuesNo = this.$route.query ? this.$route.query.issuesNo : ''
                this.showApprove = this.$route.query ? !!this.$route.query.isAppprove : false
                this.dataInit()
            } else {
                getIssuesNo({}).then(res => {
                    // this.issuesNo = (new Date().getMonth() + 1) >= 10 ? new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString() :
                    //                 new Date().getFullYear().toString() + '0' + (new Date().getMonth() + 1).toString()
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200) {
                        this.issuesNo = res.data
                        this.versionNo = 1
                        this.versionNoShow = this.versionNo
                        this.showSaveTool = true
                    }
                })

            }
        },
        mounted() {
            this.pickerOptions = {
                disabledDate(time) {
                    return (time.getTime() < (new Date().getTime() - 24 * 60 * 60 * 1000))
                }
            }
        },
        methods: {
            dataInit() {
                // TODO 获取 guide 数据
                getPlanGuiideDetail({
                    versionNo: this.versionNo,
                    issuesNo: this.issuesNo
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200) {
                        let forceGuide = res.data.guidanceMovieList ? res.data.guidanceMovieList.filter(guide => guide.guideType == 1) : []
                        let adviseGuide = res.data.guidanceMovieList ? res.data.guidanceMovieList.filter(guide => guide.guideType == 2) : []
                        let forceHallList = [], adviseHallList = []
                        forceGuide.forEach((guide, index) => {
                            guide.showNum = index + 1
                            guide.movieDetailVoList.forEach((item) => {
                                if (!forceHallList.includes(item.detailType) && item.detailType != 'h') {
                                    forceHallList.push(item.detailType)
                                }
                            })
                        })
                        forceHallList.sort((a, b) => a-b)
                        forceHallList.unshift('h')
                        
                        adviseGuide.forEach((guide, index) => {
                            guide.showNum = index + 1
                            guide.movieDetailVoList.forEach((item) => {
                                if (!adviseHallList.includes(item.detailType) && item.detailType != 'h') {
                                    adviseHallList.push(item.detailType)
                                }
                            })
                        })
                        adviseHallList.sort((a, b) => a-b)
                        adviseHallList.unshift('h')

                        this.forceHallList = forceHallList
                        this.adviseHallList = adviseHallList
                        this.forceGuide = forceGuide
                        this.adviseGuide = adviseGuide
                        this.guideData = res.data
                        this.timeValue = [this.guideData.startDate, this.guideData.endDate]
                        this.guideStatus = res.data.status
                        if (this.guideStatus == '3' && this.mode != 'view' && res.data.isMaxVersion) {
                            this.versionNoShow = Number(this.versionNo) + 1 || 1
                        }
                        this.guideUid = res.data.uid

                        this.approveRecordData = res.data.approveHistoryVoList
                        this.showSaveTool = true
                        // if (this.showApprove) {
                        // }
                    }
                })
                

            },
            changeShow(index) {
                let showList = JSON.parse(JSON.stringify(this.showList))
                showList[index].type = this.showList[index].type == 'show' ? '' : 'show'
                this.showList = showList
            },
            addGuide(type) {
                if (!this.timeValue || !this.timeValue.length) return this.warning('请先选择适用日期！') 
                if (this.curComponentShowType == 'new' && type == this.curComponentType) {
                    // TODO scrollTo new
                    this.$nextTick(() => {
                        document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                    })
                    return 
                }
                if (this.curComponentType && (this.curComponentShowType == 'new' || this.curComponentShowType == 'edit')) {
                    this.$confirm('存在尚未保存的影片指导，确定要离开吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.editData = {}
                            this.curComponentType = type
                            this.curComponentShowType = 'new'
                            this.$nextTick(() => {
                                document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                            })
                        }).catch(() => {
                               console.log('取消操作')     
                        })
                } else {
                    this.curComponentType = type
                    this.curComponentShowType = 'new'
                    this.$nextTick(() => {
                        document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                    })
                }
                
                
            },
            editGuide(type, scope) {
                if (this.curComponentType && (this.curComponentShowType == 'new' || this.curComponentShowType == 'edit')) {
                    this.$confirm('存在尚未保存的影片指导，确定要离开吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$refs.planGuide.resetData()
                            this.curComponentType = type
                            this.curComponentShowType = 'edit'
                            this.editData = scope.row
                            this.curCtrlGuideIndex = scope.$index
                            this.$nextTick(() => {
                                document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                            })
                        }).catch(() => {
                            console.log('取消操作')    
                        })
                } else {
                    this.curComponentType = type
                    this.curComponentShowType = 'edit'
                    this.editData = scope.row
                    this.curCtrlGuideIndex = scope.$index
                    this.$nextTick(() => {
                        document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                    })
                }
            },
            delGuide(type, scope) {
                let guideType = type == 'force' ? 'forceGuide' : 'adviseGuide'
                this[guideType] = this[guideType].filter((guide, index) => index != scope.$index)
            },
            viewGuide(type, scope) {
                if (this.curComponentType && (this.curComponentShowType == 'new' || this.curComponentShowType == 'edit')) {
                    this.$confirm('存在尚未保存的影片指导，确定要离开吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$refs.planGuide.resetData()
                            this.curComponentType = type
                            this.curComponentShowType = 'view'
                            this.editData = scope.row
                            this.curCtrlGuideIndex = scope.$index
                            this.$nextTick(() => {
                                document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                            })
                        }).catch(() => {
                                console.log('取消操作')    
                        })
                } else {
                    this.curComponentType = type
                    this.curComponentShowType = 'view'
                    this.editData = scope.row
                    this.curCtrlGuideIndex = scope.$index
                    this.$nextTick(() => {
                        document.querySelector('.content-wrapper').scrollTop = document.querySelector('.create-new-guide').offsetTop
                    })
                }
            },
            
            cancelAddGuide(type) {
                // let addObj = JSON.parse(JSON.stringify(this.addObj))
                // for (var k in addObj) {
                //     if (addObj[k] == type) {
                //         addObj[k] = ''
                //     }
                // }
                // this.addObj = addObj
                this.curComponentType = ''
                this.curComponentShowType = ''
            },
            confirmGuide(data) {
                let type = data.guideType == 'force' ? 'forceGuide' : 'adviseGuide'
                let guideData = JSON.parse(JSON.stringify(this[type]))
                guideData.push(data)
                this[type] = guideData
                let hallListType = data.guideType == 'force' ? 'forceHallList' : 'adviseHallList'
                let hallList = JSON.parse(JSON.stringify(this[hallListType])).filter(item => item != 'h')
                
                this[type].forEach((guide, index) => {
                    guide.showNum = index + 1
                    guide.movieDetailVoList.forEach((item) => {
                        if (!hallList.includes(item.detailType) && item.detailType != 'h') {
                            hallList.push(item.detailType)
                        }
                    })
                })
                hallList.sort((a, b) => a-b)
                hallList.unshift('h')

                
                this[hallListType] = hallList
                this.curComponentType = ''
                this.curComponentShowType = ''
            },
            changeGuideData(data) {
                let type = data.guideType == 'force' ? 'forceGuide' : 'adviseGuide'
                let guideData = JSON.parse(JSON.stringify(this[type]))
                guideData[this.curCtrlGuideIndex] = data
                this[type] = guideData
                let hallListType = data.guideType == 'force' ? 'forceHallList' : 'adviseHallList'
                let hallList = JSON.parse(JSON.stringify(this[hallListType])).filter(item => item != 'h')
                
                this[type].forEach((guide, index) => {
                    guide.showNum = index + 1
                    guide.movieDetailVoList.forEach((item) => {
                        if (!hallList.includes(item.detailType) && item.detailType != 'h') {
                            hallList.push(item.detailType)
                        }
                    })
                })
                hallList.sort((a, b) => a-b)
                hallList.unshift('h')

                
                this[hallListType] = hallList
                this.curComponentType = ''
                this.curComponentShowType = ''
            },
            submitCheck(cb) {
                // 两条个指导类型中至少存在任意一条指导数据
                var p1 = new Promise((resolve, reject) => {
                    let isResolve = true
                    if (!this.forceGuide.length && !this.adviseGuide.length) {
                        isResolve = false
                    }
                    if (!isResolve) {
                        reject({
                            type: 'p1',
                            data: {
                                forceErrorData: [],
                                adviseErrorData: [] 
                            },
                            msg: '请添加影片'
                        })
                    } else {
                        resolve()
                    }
                    
                })
                // 判断影片上下映日期 是否在全局适用日期内
                var p2 = new Promise((resolve, reject) => {
                    let isResolve = true, forceErrorData = [], adviseErrorData = []
                    this.forceGuide.forEach((item, index) => {
                    // TODO 筛选出影片上下映日期不在全局日期范围内的guide    
                        if (item.movieInfoVoList.some(citem => new Date(citem.dateShowFirst).getTime() > new Date (this.timeValue[1]).getTime() || new Date(citem.dateShowOff).getTime() < new Date(this.timeValue[0]).getTime())) {
                            isResolve = false
                        }
                        forceErrorData.push(`No${index + 1}`)
                    })
                    this.adviseGuide.forEach((item, index) => {
                        if (item.movieInfoVoList.some(citem => new Date(citem.dateShowFirst).getTime() > new Date (this.timeValue[1]).getTime() || new Date(citem.dateShowOff).getTime() < new Date(this.timeValue[0]).getTime())) {
                            isResolve = false
                        }
                        adviseErrorData.push(`No${index + 1}`)
                    })
                    if (!isResolve) {
                        reject({
                            type: 'p2',
                            data: {
                                forceErrorData,
                                adviseErrorData 
                            },
                            msg: '影片上下映日期不在全局适用日期范围内'
                        })
                    } else {
                        resolve()
                    }
                    
                })
                // 判断影片适用日期 是否在全局适用日期内
                var p3 = new Promise((resolve, reject) => {
                    let isResolve = true, forceErrorData = [], adviseErrorData = []
                    this.forceGuide.forEach((item, index) => {
                    // TODO 筛选出影片适用日期不在全局日期范围内的guide    
                        if (new Date(item.startDate).getTime() < new Date (this.timeValue[0]).getTime() || new Date(item.endDate).getTime() > new Date(this.timeValue[1]).getTime()) {
                            isResolve = false
                            forceErrorData.push(`No${index + 1}`)
                        }
                    })
                    this.adviseGuide.forEach((item, index) => {
                        // console.log(new Date (this.timeValue[0]).getTime(), this.timeValue[0])
                        // console.log(new Date(item.startDate).getTime(), new Date (this.timeValue[0]).getTime())
                        if (new Date(item.startDate).getTime() < new Date (this.timeValue[0]).getTime() || new Date(item.endDate).getTime() > new Date(this.timeValue[1]).getTime()) {
                            isResolve = false
                            adviseErrorData.push(`No${index + 1}`)
                        }
                    })
                    
                    if (!isResolve) {
                        reject({
                            type: 'p3',
                            data: {
                                forceErrorData,
                                adviseErrorData 
                            },
                            msg: '影片适用日期不在全局适用日期范围内'
                        })
                    } else {
                        resolve()
                    }
               
                })

                Promise.all([p1, p2, p3]).then(() => {
                    cb && cb()
                }).catch(res => {
                    // console.log(res)
                    this.errorObj = res
                    let type = res.type
                    if (type == 'p1') {
                        this.error(this.errorObj.msg)
                    } else {
                        this.dialogVisible = true
                    }
                    console.log(this.errorObj)
                    // this.error(res)
                    
                })
            },
            handleClose() {
                this.errorObj = {}
            },
            // 保存排片指导
            savePlanGuide() {
                let guideData = this.forceGuide.map(item => {
                    return {
                        endDate: item.endDate,
                        startDate: item.startDate,
                        guidanceMovieCinemaVoList: item.guidanceMovieCinemaVoList.map(citem => {
                            return {
                                cinemaUid: citem.cinemaUid
                            }
                        }),
                        movieDetailVoList: item.movieDetailVoList,
                        
                        movieInfoVoList: item.movieInfoVoList.map(citem => {
                            return {
                                cmcBaseMovieId: citem.cmcBaseMovieId
                            }
                        }),
                        guideType: 1
                    }
                }).concat(this.adviseGuide.map(item => {
                    return {
                        endDate: item.endDate,
                        startDate: item.startDate,
                        guidanceMovieCinemaVoList: item.guidanceMovieCinemaVoList.map(citem => {
                            return {
                                cinemaUid: citem.cinemaUid
                            }
                        }),
                        movieDetailVoList: item.movieDetailVoList,
                        movieInfoVoList: item.movieInfoVoList.map(citem => {
                            return {
                                cmcBaseMovieId: citem.cmcBaseMovieId
                            }
                        }),
                        guideType: 2
                    }
                }))
                let saveData = {
                    startDate: this.timeValue[0],
                    endDate: this.timeValue[1],
                    issuesNo: this.issuesNo,
                    remark: this.guideData.remark,
                    guidanceMovieList: guideData
                }
                if (this.mode != 'add') {
                    saveData.versionNo = this.versionNo
                }
                if (this.mode == 'add') {
                    savePlanGuide(saveData).then(res => {
                        if (res.code != 200) return this.error(res.msg)
                        if (res.code == 200) {
                            this.success('保存成功')
                            // TODO 关闭页签
                            this.$store.commit("tagNav/removeTagNav", {
                                name: this.$route.name,
                                path: this.$route.path,
                                title: this.$route.meta.title,
                                query: this.$route.query
                            })
                            this.$router.push({path: 'list'})
                        }
                    })
                } else {
                    updatePlanGuiideDetail(saveData).then(res => {
                        if (res.code != 200) return this.error(res.msg)
                        if (res.code == 200) {
                            this.success('保存成功')
                            // TODO 关闭页签
                            this.$store.commit("tagNav/removeTagNav", {
                                name: this.$route.name,
                                path: this.$route.path,
                                title: this.$route.meta.title,
                                query: this.$route.query
                            })
                            this.$router.push({path: 'list'})
                        }
                    })
                }
                
            },
            submitApprove() {
                let guideData = this.forceGuide.map(item => {
                    return {
                        endDate: item.endDate,
                        startDate: item.startDate,
                        guidanceMovieCinemaVoList: item.guidanceMovieCinemaVoList.map(citem => {
                            return {
                                cinemaUid: citem.cinemaUid
                            }
                        }),
                        movieDetailVoList: item.movieDetailVoList,
                        
                        movieInfoVoList: item.movieInfoVoList.map(citem => {
                            return {
                                cmcBaseMovieId: citem.cmcBaseMovieId
                            }
                        }),
                        guideType: 1
                    }
                }).concat(this.adviseGuide.map(item => {
                    return {
                        endDate: item.endDate,
                        startDate: item.startDate,
                        guidanceMovieCinemaVoList: item.guidanceMovieCinemaVoList.map(citem => {
                            return {
                                cinemaUid: citem.cinemaUid
                            }
                        }),
                        movieDetailVoList: item.movieDetailVoList,
                        movieInfoVoList: item.movieInfoVoList.map(citem => {
                            return {
                                cmcBaseMovieId: citem.cmcBaseMovieId
                            }
                        }),
                        guideType: 2
                    }
                }))
                let saveData = {
                    startDate: this.timeValue[0],
                    endDate: this.timeValue[1],
                    issuesNo: this.issuesNo,
                    remark: this.guideData.remark,
                    guidanceMovieList: guideData
                }
                if (this.mode != 'add') {
                    saveData.versionNo = this.versionNo
                    if (this.guideStatus == 0 || this.guideStatus == 4) {
                        saveData = Object.assign(saveData, {
                            uid: this.guideUid
                        })
                    }
                }
                subPlanGuideApprove(saveData).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200) {
                        this.success('提交审核成功')
                        // TODO 关闭页签
                        this.$store.commit("tagNav/removeTagNav", {
                            name: this.$route.name,
                            path: this.$route.path,
                            title: this.$route.meta.title,
                            query: this.$route.query
                        })
                        this.$router.push({path: 'list'})
                    }
                })
                
            },
            cancelEdit() {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                this.$router.push({path: 'list'})
            },
            // 通过审核
            approveAllow() {
                let action = this.approveForm.isPass == 1 ? 'PASS' : 'REJECT'
                approvePlanGuide({
                    action: action,
                    remark: this.approveRemark,
                    uid: this.guideUid
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200) {
                        let msg = action == 'PASS' ? '审核通过' : '已驳回'
                        this.success(msg)
                        this.$store.commit("tagNav/removeTagNav", {
                            name: this.$route.name,
                            path: this.$route.path,
                            title: this.$route.meta.title,
                            query: this.$route.query
                        })
                        this.$router.push({path: 'list'})
                    }
                })
            }
        },
        components: {
           newPlanGuide 
        }
    }
</script>

<style lang="scss" scoped>
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
    .edit-plan-guide {
        .view-ctrl-container {
            overflow: hidden;
            // margin-bottom: 200px;
        }
        .guide-info {
            margin-bottom: 24px;
            height: 32px;
            color: #666;
            .info-options {
                height: 32px;
                line-height: 32px;
                float: left;
                margin-right: 54px;
                color: #666;
                span {
                    color: #666;
                    margin-right: 10px;
                    display: inline-block;
                    height: 32px;
                    line-height: 32px;
                }
                
            }
        }
        .guide-explain {
            color: #666;
            margin-bottom: 32px;
            span {
                color: #666;
                margin-right: 10px;
                display: inline-block;
                height: 32px;
                line-height: 32px;
            }
            .el-textarea {
                width: 550px;
                height: 64px;
                vertical-align: top;
            }
        }
        .plan-guide-container {
            height: 20px;
            margin-bottom: 50px;
            transition: all 0.2s;
            overflow: hidden;
            &.show {
                height: auto;
                .title {
                    .el-icon-arrow-down {
                        transform: rotate(0deg);
                    }
                }
                
            }
            .title {
                display: block;
                color: #333;
                font-size: 14px;
                height: 20px;
                line-height: 20px;
                text-align: left;
                .title-container {
                    cursor: pointer;
                    display: inline-block;
                }
                .el-icon-arrow-down {
                    margin-right: 8px;
                    color: #333;
                }
                .el-icon-arrow-down {
                    transition: all 0.2s;
                    transform: rotate(-90deg);
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
        }
        .save-tool {
            height: 32px;
            padding: 16px 0;
            text-align: center;
            margin-bottom: 40px;
            .el-button {
                display: inline-block;
                margin-right: 32px;
            }
        }
        /deep/ .w80-btn {
            width: 80px;
            height: 32px;
            box-sizing: border-box;
            padding: 8px 14px;
            span {
                font-size: 12px;
            }
        }
        /deep/ .force-guide-table.el-table {
            th {
                background-color: rgb(255, 128, 125);    
            }
            .el-button + .el-button {
                margin-left: 0;
            }
            .single-movie-table-row {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-bottom: 1px solid #ebebeb;
                height: 24px;
                box-sizing: border-box;
                &:last-child {
                    border-bottom: none;
                }
            }
        }
        /deep/ .advise-guide-table.el-table {
            th {
                background-color: rgb(255, 187, 109); 
                }
            .el-button + .el-button {
                margin-left: 0;
            }
            .single-movie-table-row {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-bottom: 1px solid #ebebeb;
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
</style>