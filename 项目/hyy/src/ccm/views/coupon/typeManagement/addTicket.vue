<template>
<div>
    <!-- 面包屑 -->
    <curmbs :address="address"></curmbs>
    <!-- 填写栏 -->
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-collapse v-model="activeNames">
            <!-- <el-collapse-item title="票券基本信息" name="baseConfig"> -->
                <el-form-item label="类型:" prop="couponType">
                    <el-select class="input-type-166" v-model="form.couponType" :disabled="isChangeType" placeholder="请选择">
                        <el-option v-for="item in baseConfig.ticketType.options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称:" prop="couponName">
                    <el-row class="flex-base">
                        <el-input class="input-type-166" v-model="form.couponName"></el-input>
                        <div class="tips-info">（名称需唯一）</div>
                    </el-row>
                </el-form-item>
                <el-form-item v-if="isChangeType" label="状态:" prop="couponTypeStatus">
                    <el-radio v-for="item in baseConfig.couponTypeStatus.options" v-model="form.couponTypeStatus" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                </el-form-item>
            <!-- </el-collapse-item> -->
        </el-collapse>
        <section class="flex-base flex-center">
            <el-row>
                <el-button type="primary" @click="confirm('form')">确定</el-button>
                <el-button @click="returnPage(true)">取消</el-button>
            </el-row>
        </section>
    </el-form>
</div>
</template>

<script>
import curmbs from "../../../components/crumbs/index.vue";
export default {
    components: {
        curmbs
    },
    created() {
        console.log(this.$route.query);
        let isQueryNull = JSON.stringify(this.$route.query) == '{}' ? true : false;
        let param;
        let _address = {
                name: "新建票券分类设置",
                path: "",
                active: true
            }
        if (!isQueryNull) {
            _address = {
                    name: "修改票券分类设置",
                    path: "",
                    active: true
                }
            param = this.$route.query;
            let isChangeType = param.isChangeType ? param.isChangeType : false;
            if (isChangeType) {
                this.isChangeType = true;
                this.form = param.data;
            }
        }
            
        this.address.push(_address)

    },
    data() {
        let pointer = this;
        return {
            isChangeType: false,
            time: null,
            returnTime: null,
            activeNames: ['baseConfig'],
            address: [{
                    name: "票券",
                    path: ""
                },
                {
                    name: "票券分类设置",
                    path: ""
                },
                
            ],
            baseConfig: {
                /* 类型 */
                ticketType: {
                    options: [{
                            value: "0",
                            label: "兑换券"
                        },
                        {
                            value: "1",
                            label: "代金券"
                        },
                        {
                            value: "2",
                            label: "优惠券"
                        }
                    ]
                },
                couponTypeStatus: {
                    options: [{
                            value: '0',
                            label: '有效'
                        },
                        {
                            value: '1',
                            label: '无效'
                        }
                    ]
                }
            },
            form: {
                couponType: '',
                couponName: '',
                couponTypeStatus: '0'
            },
            rules: {
                couponType: [{
                    required: true,
                    message: '请输入票券类型',
                    trigger: 'change'
                }],
                couponName: [{
                    required: true,
                    validator: function (rule, value, callback) {
                        console.log(value);
                        clearTimeout(pointer.time);
                        if (value == '') {
                            callback(new Error('请输入分类名称'));
                        } else {
                            let param = {
                                couponName: value,
                                id: pointer.isChangeType ? pointer.form.id : '0'
                            }
                            pointer.time = setTimeout(function () {
                                pointer.$ccmList.findCouponTypeName(param).then(data => {
                                    if (data.flag == 1) {
                                        callback();
                                    } else {
                                        callback(new Error('分类名称已存在,请重新输入'));
                                    }
                                }).catch(msg => {
                                    console.log('查询票券分类名称唯一性错误:', msg);
                                });
                            }, 500);
                        }
                    },
                    trigger: 'change'
                }]
            }
        };
    },
    methods: {
        /**
         * @function confirm - 提交表单
         * @param {String} formName - 表单名
         */
        confirm(formName) {
            let pointer = this;
            pointer.$refs[formName].validate((valid) => {
                if (valid) {
                    let param;
                    let type = '';
                    if (pointer.isChangeType) {
                        // 修改模式
                        param = JSON.parse(JSON.stringify(pointer.form));
                        delete param.couponType;
                        type = 'updateCouponType';
                    } else {
                        // 新增模式
                        delete pointer.form.couponTypeStatus0;
                        param = pointer.form;
                        type = 'insertCouponType';
                    }

                    pointer.$ccmList[`${type}`](param).then(data => {
                        let flag = data.flag;
                        let _type = '';
                        if (pointer.isChangeType) {

                            if (flag == 0) {
                                _type = 'error';
                            } else if (flag == 1) {
                                _type = 'warning';
                            } else if (flag == 2) {
                                _type = 'success';
                            }

                        } else {
                            if (data.flag != 4) {
                                _type = 'error';
                            } else if (flag == 4) {
                                _type = 'success';
                            }
                        }

                        if(type =='updateCouponType' && _type == 'success'){
                            data.msg = '修改成功';
                        }else if(type =='insertCouponType' && _type == 'success'){
                            data.msg = '新增成功';
                        }else if(type =='updateCouponType' && _type == 'error'){
                            data.msg = '修改失败';
                        }else if(type =='insertCouponType' && _type == 'error'){
                            data.msg = '新增失败';
                        }

                        pointer.$message({
                            message: data.msg,
                            type: _type
                        });

                        if (_type == 'success') {
                            clearTimeout(pointer.returnTime);
                            pointer.returnTime = setTimeout(function () {
                                pointer.returnPage();
                            }, 1000)
                        }

                    }).catch(msg => {
                        console.log(msg);
                    })
                } else {
                    return false;
                }
            });
        },
        /**
         * @function returnPage - 返回之前的页面
         */
        returnPage(isShowConfirm) {
            let pointer = this;
            if (isShowConfirm) {
                pointer.$confirm('确认不添加,就关闭？').then(_ => {
                        pointer.$router.push('typeManagement');
                    })
                    .catch(msg => {

                    });
            } else {
                pointer.$router.push('typeManagement');
            }
            console.log(pointer.$router)

        }
    },
    destroyed() {
        let pointer = this;
        let timeArray = ['time', 'returnTime'];
        for (let i = 0; i < timeArray.length; i++) {
            clearTimeout(pointer[`${timeArray[i]}`]);
        }
    }
};
</script>

<style lang="scss">
.ticket-inner {
    li {
        margin-bottom: 15px;
    }
}

.tips-info {
    color: grey;
    font-size: 12px;
}
</style>
