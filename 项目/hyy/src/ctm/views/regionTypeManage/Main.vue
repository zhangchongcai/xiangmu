<template>
    <section class="regionType">

        <el-dialog :title="type === 'add' ? '新建分区类型' : '编辑分区类型'" :visible.sync="dialogVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
                <el-form-item label="分区类型名称" prop="name">
                    <el-input
                            style="width: 200px"
                            v-model="ruleForm.name"
                            placeholder="请输入"
                    ></el-input>
                </el-form-item>
                <el-form-item label="可选代表颜色" prop="color">
                    <div :class="[{'color-picker-border': item.isSelected}, 'color-picker']"
                         v-for="(item, index) in colorBoxData"
                         :key="item.color"
                         @click="handleColorPicker(index)">
                        <div :style="{
                                position: 'relative',
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                background: item.color,
                            }">
                            <i v-show="item.isSelected" class="el-icon-check"></i>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <div class="regionTypeList" v-for='(item, index) in regionTypeList' :key="index">
            <div :style="{width: '200px', height: '100px', background: item.color}"></div>
            <div style="width: 180px; height: 50px; line-height: 50px; padding: 0 10px">
                <span>{{item.name}}</span>
                <span style="float: right">
                    <span class="deleteButton" @click="deleteRegionType(item.uid)">删除</span>
                    <i class="el-icon-edit" @click="editRegionType(index)"></i>
                </span>
            </div>
        </div>

        <i class="el-icon-plus add-icon" :class="{ disabled: regionTypeList.length > 9 }" @click="addManageType"></i>

    </section>
</template>

<script>
    export default {
        name: "Main",
        data() {
            return {
                type: 'add',
                rules: {
                    name: [
                        { required: true, message: '请输入分区类型名称', trigger: 'blur' },
                    ],
                    color: [
                        { required: true, message: '请选择颜色', trigger: 'change' },
                    ],
                },
                formLabelWidth: '120px',
                dialogVisible: false,
                ruleForm: {
                    name: '',
                    color: '',
                },
                uid: '',

                /* 色值范围 */
                colorBox: [
                    '#FF6E3C',
                    '#15B3EA',
                    '#FFA72F',
                    '#7ED321',
                    '#FF8D12',
                    '#EB28CA',
                    '#8B4DFF',
                    '#1BDA5C',
                    '#FC5294',
                    '#00DFEF'
                ],
                regionTypeList: [],
                colorBoxData: [],

            }
        },
        methods: {

            submitForm() {
                this.$refs.ruleForm.validate( valid => {
                    if (valid) {
                        if(this.type === 'add') {
                            this.saveRegionType()
                        }else if(this.type === 'edit') {
                            this.updateRegionType({
                                color: this.ruleForm.color,
                                name: this.ruleForm.name,
                                uid: this.uid
                            })
                        }
                    }
                })
            },

            editRegionType(idx) {
                this.type = 'edit'

                let data = this.regionTypeList.filter( (item, index) => {
                    return index !== idx
                })

                let colorData = this.colorBox.filter( item => {
                    let flag = true
                    data.some( innerItem => {
                        if(item === innerItem.color) {
                            flag = false
                            return true
                        }
                    })
                    return flag
                })

                this.colorBoxData = colorData.map( item => {
                    return {
                        color: item,
                        isSelected: item === this.regionTypeList[idx].color
                    }
                })
                this.ruleForm.name = this.regionTypeList[idx].name
                this.ruleForm.color = this.regionTypeList[idx].color
                this.uid = this.regionTypeList[idx].uid

                this.dialogVisible = true
                if(this.$refs.ruleForm) {
                    this.$refs.ruleForm.clearValidate()

                }

            },

            deleteRegionType(regionTypeUid) {
                this.$confirm('是否确认删除该类型？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.delRegionType(regionTypeUid)

                }).catch( err => {
                    console.log(err)

                })

            },

            delRegionType(regionTypeUid) {
                this.$ctmList.delRegionType({ regionTypeUid }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('删除成功！')
                        this.getRegionTypeList()

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            handleColorPicker(index) {
                this.colorBoxData.forEach( item => {
                    item.isSelected = false
                })
                this.colorBoxData[index].isSelected = true
                this.ruleForm.color = this.colorBoxData[index].color
                console.log(this.ruleForm, 'this.ruleForm')
            },
            addManageType() {
                if(this.regionTypeList.length > 9) {
                    return
                }
                this.type = 'add'

                let colorData = this.colorBox.filter( item => {
                    let flag = true
                    this.regionTypeList.some( innerItem => {
                        if(item === innerItem.color) {
                            flag = false
                            return true
                        }
                    })
                    return flag
                })

                this.colorBoxData = colorData.map( item => {
                    return {
                        color: item,
                        isSelected: false
                    }
                })
                this.ruleForm.name = ''
                this.ruleForm.color = ''

                this.dialogVisible = true
                if(this.$refs.ruleForm) {
                    this.$refs.ruleForm.clearValidate()

                }

            },
            saveRegionType() {
                this.$ctmList.saveRegionType(this.ruleForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.$refs.ruleForm.resetFields()
                        this.dialogVisible = false
                        this.success('保存成功！')
                        this.getRegionTypeList()

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })

            },

            updateRegionType(data) {
                this.$ctmList.updateRegionType(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.$refs.ruleForm.resetFields()
                        this.dialogVisible = false
                        this.success('保存成功！')
                        this.getRegionTypeList()

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })

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
        },
        mounted() {
            this.getRegionTypeList()
        }
    }
</script>

<style lang="scss">
    .regionType {
        width: 1000px;
        .regionTypeList {
            float: left;
            margin: 0 100px 50px 0;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            overflow: hidden;
            .el-icon-edit {
                cursor: pointer;
            }
            .deleteButton {
                display: none;
            }

        }
        .regionTypeList:hover {
            .deleteButton {
                display: inline;
                color: #3B74FF;
                cursor: pointer;
            }
        }
        .add-icon {
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 150px;
            line-height: 150px;
            text-align: center;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .el-dialog {
            .color-picker {
                float: left;
                padding: 10px;
                margin-right: 10px;
                border-radius: 4px;
                border: 1px solid transparent;
                cursor: pointer;
                .el-icon-check {
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate3d(-50%,-50%,0);
                }
            }
            .color-picker-border {
                border: 1px solid #3B74FF;
            }

        }
        .disabled {
            color: #c0c4cc;
            cursor: not-allowed;
            background-color: #fff;
            border-color: #ebeef5;
        }
    }

</style>