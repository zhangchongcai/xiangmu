<template>
    <section class="import-plan">
        <el-dialog
                title="导入排期"
                :visible.sync="dialogVisible"
                width="892px"
                @close="dialogClose">
            <singleCinema
                    ref="frameSingleCinema"
                    :framedialogVisible.sync="singleCinemaVisible"
                    :type="singleCinemaType"
                    :innerData="innerData"
                    append-to-body
                    @callBackSingle="callBackSingle">
                <div slot="footerId">
                    <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确 定</el-button>
                    <el-button @click="singleCinemaVisible = false">取 消</el-button>
                </div>
            </singleCinema>

            <h4 class="title">选择影院和日期</h4>
            <el-form :inline="true" ref="ruleForm" :rules="rules" :model="formInline" class="form-inline">
                <el-form-item label="放映日期：" prop="sourceMakeDate">
                    <el-date-picker
                            v-model="formInline.sourceMakeDate"
                            type="date"
                            placeholder="请选择放映日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="源影院：" prop="sourceCinemaName" style="margin-left: 60px">
                    <el-input style="width: 212px" readonly v-model="formInline.sourceCinemaName"></el-input>
                    <el-button @click="$refs.frameSingleCinema.listAuthCommCinemas(), singleCinemaVisible = true">选 择</el-button>
                </el-form-item>
            </el-form>

            <h4 class="title">选择对应的影厅</h4>

            <div style="margin-top: 16px">
                目标影院：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{ $store.state.planCinema.cinemaName }}
                <div v-if="mateHallVoList.length" style="margin: 16px 85px 0">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全部影厅</el-checkbox>
                    <div v-for="item in mateHallVoList" style="margin-top: 24px">
                        <el-checkbox style="margin-right: 8px" v-model="item.checked" @change="handleCheckedChange"></el-checkbox>
                        <el-select style="width: 300px" v-model="item.sourceHallUid" placeholder="请选择">
                            <el-option
                                    v-for="item in sourceHallUidOptions"
                                    :key="item.uid"
                                    :label="item.name"
                                    :value="item.uid">
                            </el-option>
                        </el-select>
                        <el-input style="width: 300px; margin-left: 16px" readonly v-model="item.targetHallName"></el-input>

                    </div>
                    <p style="margin-top: 16px; width: 650px">
                        1、如果源影院比目标影院影厅数量少时，则按照顺序进行排序，排序在从1号厅去对应目标影院的5号厅；如果源影院比目标影院多，则排序最面前序号源影院来对应目标影院，源影院是下拉可选择的<br>
                        2、点击确定则把源影院对应放映日期场次导入到目标影院的当前选择的日期
                    </p>

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmImport">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </section>
</template>

<script>
    import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"

    export default {
        name: "importPlan",
        components: {
            singleCinema
        },
        props: {
            baseParam: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                singleCinemaVisible: false,
                singleCinemaType: 2,
                innerData: {
                    id: '',
                },

                checkAll: true,
                isIndeterminate: false,
                formInline: {
                    sourceMakeDate: '',
                    sourceCinemaUid: '',
                    sourceCinemaName: '',

                },
                rules: {
                    sourceMakeDate: [
                        { required: true, message: '请选择放映日期', trigger: 'change' }
                    ],
                    sourceCinemaName: [
                        { required: true, message: '请选择源影院', trigger: 'change' }
                    ],
                },
                mateHallVoList: [],
                sourceHallUidOptions: [],
                dialogVisible: false
            }
        },
        methods: {
            dialogClose() {
                console.log('嘤嘤嘤~')
                // 重置数据
                this.innerData.id = ''
                this.checkAll = true
                this.formInline.sourceMakeDate = ''
                this.formInline.sourceCinemaUid = ''
                this.formInline.sourceCinemaName = ''
                this.mateHallVoList = []
                this.sourceHallUidOptions = []

                this.$refs.ruleForm.clearValidate()

            },

            handleCheckedChange() {
                let checkedCount = 0
                this.mateHallVoList.forEach( item => {
                    if(item.checked) {
                        checkedCount++
                    }
                })
                this.checkAll = checkedCount === this.mateHallVoList.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.mateHallVoList.length
            },

            handleCheckAllChange(val) {
                this.mateHallVoList.forEach( item => {
                    item.checked = val
                })
                this.isIndeterminate = false

            },

            callBackSingle(data) {
                this.singleCinemaVisible = data.framedialogVisible
                if(data.isCloseWindow) return

                this.formInline.sourceCinemaName = data.data.name
                this.formInline.sourceCinemaUid = data.data.id.toString()
                this.innerData.id = data.data.id
                console.log(this.baseParam, 'baseParam')

                this.getCinemaPlanHallList()
            },

            confirmImport() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let checkData = this.mateHallVoList.filter( item => {
                            return item.checked
                        })

                        if(checkData.length === 0) {
                            this.error('请至少选择一个影厅！')
                            return
                        }

                        let validFlag = checkData.some( item => {
                            return item.sourceHallUid === ''
                        })

                        if(validFlag) {
                            this.error('请选择影厅！')
                            return
                        }

                        let data = {
                            mateHallVoList: checkData,
                            sourceCinemaUid: this.formInline.sourceCinemaUid,
                            sourceMakeDate: this.formInline.sourceMakeDate,
                            targetCinemaUid: this.baseParam.uidCinema,
                            targetMakeDate: this.baseParam.planDate,
                        }

                        this.copyCinemaPlan(data)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            handleDialogVisible(val) {
                // this.dialogVisible = val
            },

            getCinemaPlanHallList() {
                this.$ctmList.getCinemaPlanHallList({
                    sourceCinemaUid: this.formInline.sourceCinemaUid,
                    targetCinemaUid: this.baseParam.uidCinema
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        let data = []
                        let targetHallList = []
                        let sourceHallList = []
                        res.data.forEach( item => {
                            if(item.cinemaUid === this.baseParam.uidCinema) {
                                targetHallList = JSON.parse(JSON.stringify(item.hallVoList))
                            }
                            if(item.cinemaUid === this.formInline.sourceCinemaUid) {
                                this.sourceHallUidOptions = JSON.parse(JSON.stringify(item.hallVoList))
                                sourceHallList = JSON.parse(JSON.stringify(item.hallVoList))
                            }
                        })
                        if(targetHallList.length === 0) {
                            this.error('目标影院下暂无影厅！')

                        }

                        if(sourceHallList.length > 0) {
                            let count = parseInt(targetHallList.length/sourceHallList.length)
                            let copyData = JSON.parse(JSON.stringify(sourceHallList))
                            new Array(count).fill(0).forEach( item => {
                                sourceHallList = sourceHallList.concat(copyData)
                            })

                        }else {
                            this.error('源影院下暂无影厅！')
                        }

                        targetHallList.forEach( (item, index) => {
                            data.push({
                                checked: true,
                                sourceHallUid: sourceHallList.length ? sourceHallList[index].uid : '',
                                targetHallUid: item.uid,
                                targetHallName: item.name,

                            })

                        })
                        this.mateHallVoList = data

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            copyCinemaPlan(data) {
                this.$ctmList.copyCinemaPlan(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success(res.msg)
                        this.dialogVisible = false
                        this.$emit('initMoviePlan', {
                            type: null
                        })

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

        }
    }
</script>

<style lang="scss">
    .import-plan {
        .el-dialog__header {
            padding: 16px 0 8px 0;
            margin: 0 20px;
            border-bottom: 1px solid #E5E5E5;
            .el-dialog__title {
                color: #333;
                font-weight: normal;
            }
        }
        .el-dialog__body {
            padding: 16px 20px;
            height: 475px;
            overflow-y: auto;
            .title {
                color: #333;
                font-size: 14px;

            }
            .form-inline {
                margin-top: 10px;
                .el-date-editor {
                    font-size: 12px;
                }
                .el-button {
                    width: 80px;
                    height: 32px;
                    border: 1px solid #3B74FF;
                    border-radius: 4px;
                    padding: 8px;
                    span {
                        font-size: 12px;
                        color: #3B74FF;
                    }
                }
            }


        }
        .el-dialog__footer {
            padding: 12px;
            border-top: 1px solid #E5E5E5;

        }

    }

</style>