<template>
    <section class="set-region-plan">

        <el-dialog title="新建分区方案" width="500px" :visible.sync="dialogVisible">
            <el-form :model="regionPlanForm" :rules="rules" ref="regionPlanForm" label-width="120px">
                <el-form-item label="分区类型：" prop="regionTypeUid">
                    <el-select v-model="regionPlanForm.regionTypeUid" placeholder="请选择">
                        <el-option
                                v-for="item in regionTypeList"
                                :key="item.uid"
                                :label="item.name"
                                :value="item.uid">
                        </el-option>
                    </el-select>
                    <el-button @click="toRegionTypeManage">管理分区类型</el-button>
                </el-form-item>
                <el-form-item label="分区方案名称：" prop="name">
                    <el-input style="width: 193px" v-model="regionPlanForm.name" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>

        <i v-if="regionInfoList.length > 0" class="add-icon el-icon-plus" @click="dialogVisible = true"></i>

        <el-tabs v-if="regionInfoList.length > 0" v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
                    v-for="(item, index) in regionInfoList"
                    :key="item.regionTypeUid"
                    :label="item.name"
                    :name="index.toString()">
                <el-form size="mini">
                    <el-form-item label="分区名称：" :label-width="formLabelWidth">
                        <span style="font-size: 12px">{{item.name}}</span>
                    </el-form-item>
                    <el-form-item label="分区类型：" :label-width="formLabelWidth">
                        <span style="font-size: 12px">{{item.regionTypeName}}</span>
                    </el-form-item>
                    <el-form-item label="总座位数：" :label-width="formLabelWidth">
                        <span style="font-size: 12px">{{item.regionSeatList.length}}</span>
                    </el-form-item>
                    <el-form-item size="large">
                        <el-button type="primary" @click="">清除关联座位</el-button>
                        <el-button type="primary" @click="">添加选中座位</el-button>
                    </el-form-item>
                </el-form>

            </el-tab-pane>
        </el-tabs>
        <div v-else class="add-region">
            <el-button type="text" icon="el-icon-plus" @click="dialogVisible = true">新建</el-button>
        </div>

    </section>
</template>

<script>
    export default {
        name: "SetRegionPlan",
        data() {
            return {
                rules: {
                    regionTypeUid: [
                        { required: true, message: '请选择分区类型', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入分区方案名称', trigger: 'blur' },
                    ],
                },
                regionPlanForm: {
                    name: '',
                    regionTypeUid: '',
                },
                dialogVisible: false,
                formLabelWidth: '100px',
                activeName: '0',
                // 分区方案list
                regionInfoList: [],

                // 分区类型list
                regionTypeList: [],
                hallUid: '',


            }
        },
        methods: {
            toRegionTypeManage() {
                this.$router.push({ path: '/ticket/regionTypeManage' })

            },

            confirm() {
                this.$refs.regionPlanForm.validate( valid => {
                    if (valid) {
                        let data = this.regionTypeList.find( item => {
                            return item.uid === this.regionPlanForm.regionTypeUid
                        })
                        this.regionInfoList.push({
                            color: data.color,
                            regionTypeName: data.name,
                            hallUid: this.hallUid,
                            name: this.regionPlanForm.name,
                            regionSeatList: [],
                            regionTypeUid: this.regionPlanForm.regionTypeUid

                        })
                        this.dialogVisible = false
                        this.$refs.regionPlanForm.resetFields()

                    }
                })

            },

            handleClick(tab, event) {
                console.log(tab, event)
            },

            getRegionTypeList() {
                this.$ctmList.getRegionTypeList().then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.regionTypeList = res.data

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            getRegionInfoList() {
                this.$ctmList.getRegionInfoList({ hallUid: this.hallUid }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.regionInfoList = res.data.regionInfoList

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

        },
        mounted() {
            this.hallUid = this.$route.query.hallUid
            this.getRegionInfoList()
            this.getRegionTypeList()

        }
    }
</script>

<style lang="scss">
    .set-region-plan {
        color: #333;
        border-radius: 0 0 2px 2px;
        /*background: #F2F4FD;*/
        position: relative;
        .add-icon {
            background: #F2F4FD;
            position: absolute;
            right: 0;
            top: 0;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            cursor: pointer;
        }
        .el-tabs {
            .el-tabs__header {
                border: none;
                /*background: #F2F4FD;*/
                width: 210px;
                height: 24px;
                margin-bottom: 0;
                .el-tabs__nav-prev, .el-tabs__nav-next {
                    line-height: 24px;
                    background: #F2F4FD;
                }
                .el-tabs__nav {
                    border: none;
                }
                .el-tabs__item {
                    height: 24px;
                    line-height: 24px;
                    border: none;
                    background: rgba(126,211,33,0.2);
                    color: #999;
                    font-size: 12px;
                    margin-right: 2px;
                }
                .el-tabs__item.is-active {
                    background: #FF6E3C;
                    /*border: 1px solid #FF9301;*/
                    color: #fff;
                }
            }
            .el-tabs__content {
                background: #F2F4FD;
                padding: 10px 0;
                .el-form {
                    .el-form-item {
                        margin-bottom: 0;
                        .el-form-item__label {
                            font-size: 12px;
                        }

                    }

                }
            }

        }
        .add-region {
            background: #F2F4FD;
            height: 80px;
            .el-button {
                width: 100%;
                height: 100%;
            }

        }

    }
</style>