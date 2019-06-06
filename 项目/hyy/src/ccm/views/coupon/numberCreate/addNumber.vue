<template>
<div>
    <!-- 面包屑 -->
    <curmbs :address="address"></curmbs>
    <!-- 基本信息 -->
    <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="基础信息" name="baseConfig">
            <ul class="baseConfig">
                <li class="flex-base">
                    <span><i class="zoom-keep-font">占位</i>票券编号：</span>
                    <div>
                        <el-radio v-model="baseConfig.couponNumber" label='0'>系统生成</el-radio>
                        <el-radio v-model="baseConfig.couponNumber" label="1">外部导入</el-radio>
                    </div>
                </li>
                <li class="flex-base" v-if="baseConfig.couponNumber == '0'">
                    <span>票券编号数量：</span>
                    <div class="flex-base">
                        <el-form  ref="validateForm" :model="baseConfig" :rules="formRules">
                            <el-form-item prop="couponCount">
                                <el-input class="table-search-inner-width"  v-model="baseConfig.couponCount" placeholder="请输入内容"></el-input>
                            </el-form-item>
                        </el-form>
                        <span class="tips-info">（&lt;=50000张）</span>
                    </div>
                </li>
                <li class="flex-base" v-if="baseConfig.couponNumber == '1'">
                    <span>导入票券数据：</span>
                    <div class="flex-base">
                        <el-upload class="upload-demo" :auto-upload="false" action="" :limit="1" :before-upload="beforeUpload" ref="newupload" :on-change="onUploadChange">
                            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                        </el-upload>
                        <div>
                            <el-button type="text" @click="downLoadTem">下载模板</el-button>
                        </div>
                    </div>
                </li>
                <li class="flex-base">
                    <span><i class="zoom-keep-font">占位</i>票纸颜色：</span>
                    <div>
                        <el-select class="table-search-inner-width" v-model="baseConfig.couponColor.value" placeholder="请选择">
                            <el-option v-for="item in baseConfig.couponColor.show" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
        </el-collapse-item>
    </el-collapse>
    <!-- 按钮组 -->
    <section class="flex-base flex-center">
        <el-row>
            <el-button type="primary" @click="addNumber">确定123</el-button>
            <el-button @click="cancle">取消</el-button>
        </el-row>
    </section>
</div>
</template>

<script>
import curmbs from "../../../components/crumbs/index.vue";
import config from '../../../http/config.js';
import axios from 'axios'
export default {
    components: {
        curmbs
    },
    data() {
        var counts = (rule, value, callback) => {
            if (value === '' || value!="0") {
                callback(new Error('请输入大于零的编号数量'));
            } else {
                if (value>50000) {
                    callback(new Error('请输入小于50000的数字'));
                }
                callback()
            }
        };
        return {
            activeNames: ['baseConfig'],
            baseUrl: config.baseURL,
            returnTime: null, //定时器
            returnTime2: null, //定时器
            address: [{
                    name: "票券",
                    path: ""
                },
                {
                    name: "票券编号预生成",
                    path: ""
                },
                {
                    name: "新建预生成批次",
                    path: "",
                    active: true
                }
            ],
            baseConfig: {
                /* 票券编号 */
                couponNumber: '0',
                /* 票券编号数量 */
                couponCount: null,
                /* 导入票券 */
                uploadSrc: '#',
                uploadFileList: [],
                /* 票纸颜色 */
                couponColor: {
                    value: '不设',
                    show: [{
                        label: '不设',
                        value: '不设'
                    }, {
                        label: '红色',
                        value: '红色'
                    }, {
                        label: '绿色',
                        value: '绿色'
                    }, {
                        label: '蓝色',
                        value: '蓝色'
                    }, {
                        label: '紫色',
                        value: '紫色'
                    }, {
                        label: '黄色',
                        value: '黄色'
                    }, {
                        label: '3D',
                        value: '3D'
                    }, ]
                },
                
            },
            formRules:{
                couponCount:[
                    { validator: counts, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        /**
         * @function handleChange - 操作折叠面板
         */
        handleChange() {},

        /**
         * @function downLoadTem - 下载模板
         */
        downLoadTem() {
            let url = this.baseUrl + "/coupon/prebuild/exportTemplate";
            axios(url, {
                method: "get",
                responseType: "blob"
            }).then(data => {
                console.log(data)
                let flag = data.headers.flag;
                let message = '下载模板错误，请稍后再试！';
                let type = 'warning';

                if (flag == '1') {
                    type = 'success';
                    message = "下载成功"
                }

                    this.$message({
                        type,
                        message
                    });

                const blob = new Blob([data.data]);
                const fileName = data.headers.filename;
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
            });
        },
        addNumber() {
            let mark = this.baseConfig.couponNumber;
            this.$refs.validateForm.validate((valid) => {
                console.log(valid)
                if(valid){
                    if (mark == '0') {
                        this.createCouponSys();
                    } else if (mark == '1') {
                        this.createCouponImport();
                    }
                }
            })
            
        },
        //系统生成
        createCouponSys() {
            let _this = this;
            let params = {
                couponColor: this.baseConfig.couponColor.value,
                couponCount: this.baseConfig.couponCount
            };
            _this.$ccmList.createCouponBatch(params).then((data) => {
                let flag = data.flag;
                let message = data.msg;
                let type = "warning";
                if (data.flag == 3) {
                    type = "success";

                    clearTimeout(_this.returnTime);
                    _this.returnTime = setTimeout(function () {
                        _this.$router.push('numberCreate');
                    }, 1000)
                }
                this.$message({
                    type,
                    message
                });
            });
        },

        /**
         * @function onloadChange - 改变文件
         */
        onUploadChange(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = function (e) {
                console.log("图片的base64数据 " + this.result) //图片的base64数据
            }
        },

        beforeUpload(file) {
            let _this = this;
            let params = new FormData();
            params.append('file', file); //传文件
            params.append('couponColor', this.baseConfig.couponColor.value);

            _this.$ccmList.importExcel(params).then((data) => {
                let flag = data.flag;
                let message = data.msg;
                let type = "warning";
                if (data.flag == 4) {
                    type = "success";
                    clearTimeout(_this.returnTime2);
                    _this.returnTime2 = setTimeout(function () {
                        _this.$router.push('numberCreate');
                    }, 1000)
                }
                _this.$message({
                    type,
                    message
                });
            });
        },
        //外部导入 确定请求
        createCouponImport() {
            this.$refs.newupload.submit();
        },
        cancle() {
            this.$router.push({
                path: 'numberCreate'
            })
        }
    },
    destroyed() {
        clearTimeout(this.returnTime);
        clearTimeout(this.returnTime2);
    },
}
</script>

<style lang="scss" scoped>
.baseConfig {
    li {
        margin-bottom: 10px;
    }
}

.tips-info {
    color: grey;
    font-size: 12px;
}
</style>
