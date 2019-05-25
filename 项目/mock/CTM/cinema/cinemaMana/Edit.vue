<template>
    <div class="cinema-edit">
        <div class="cinema-editContent">
            <el-form ref="cinema" :model="cinemaData" :rules="rules" label-width="120px" label-height='60px'>
                <div class="item">
                    <div class="info" >
                        <el-form-item label="影院编码:" prop="code">
                            <el-input v-model="cinemaData.code" disabled></el-input>
                            
                        </el-form-item> 
                    </div>
                    <div style="display:flex">
                        <div>
                           <el-form-item label="影院名称:" prop="name" >
                            <div style="white-space:normal;">
                            <el-input v-model.trim="cinemaData.name"></el-input>
                            </div>
                        </el-form-item> 
                        </div>
                        <div >
                            
                        </div>
                    </div>
                    
                    <el-form-item label="内部管理编号:" prop="mgCode" >
                        <el-input v-model.trim="cinemaData.mgCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开业时间">
                        <el-date-picker
                        v-model="cinemaData.openTime"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                      
                    </el-form-item> 
                    <el-form-item label="公司名称:" prop="company">
                        <el-input v-model="cinemaData.company"></el-input>
                    </el-form-item>
                    <el-form-item label="所属影院:" prop="cinemas">
                        <el-input v-model="cinemaData.cinemas"></el-input>
                    </el-form-item>
                    <el-form-item label="影院联系人:" prop="contactMan">
                        <el-input v-model="cinemaData.contactMan"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" >
                        <el-radio v-model="cinemaData.status" label="1">营业</el-radio>
                        <el-radio v-model="cinemaData.status" label="2">测试</el-radio>
                    </el-form-item>
                    <el-form-item label="影院介绍" prop="intro">
                        <el-input type="textarea" v-model="cinemaData.intro"></el-input>
                    </el-form-item>
                   
                </div>
                <div class="item">
                    <el-form-item label="联系人手机:" prop="mphone">
                        <el-input v-model="cinemaData.mphone"></el-input>
                    </el-form-item> 
                    <el-form-item label="联系人固话:" prop="tphone">
                        <el-input v-model="cinemaData.tphone"></el-input>
                    </el-form-item>
                    <el-form-item label="影院邮编:" prop="postcode">
                        <el-input v-model="cinemaData.postcode"></el-input>
                    </el-form-item> 
                    <el-form-item label="影院传真:" prop="fax">
                        <el-input v-model="cinemaData.fax"></el-input>
                    </el-form-item>
                    <el-form-item label="影院邮箱:" prop="email">
                        <el-input v-model="cinemaData.email"></el-input>
                    </el-form-item>
                    <!--联动选择地区-->
                    <el-form-item label="所属城市:" prop="area">
                        <el-select size="small" style="width: 100px"
                                v-model="cinemaData.area.pcode"
                                placeholder="请选择省份"
                                v-on:change="getProv($event)"
                                >
                            <el-option
                                    v-for="item in provs"
                                    :label="item.areaName"
                                    :value="item.areaCode"
                                    :key = item.value
                                    >
                            </el-option>
                        </el-select>
                        <el-select size="small" style="width: 100px"
                            v-model="cinemaData.area.cname"
                            placeholder="请选择城市"
                            v-on:change="getCity($event)"
                            >
                            <el-option
                                    v-for="item in citys"
                                    :label="item.areaName"
                                    :value="item.areaCode"
                                    :key="item.value"
                                    >
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                        
                    <el-form-item label="影院地址:" prop="address">
                        <el-input v-model="cinemaData.address"></el-input>
                        
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info">重新绑定Usbkey</el-button>
                        <el-button type="info">下载影院信息</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <hr style="width:98%;margin-top:40px;">
        <div class="btn">
            <el-button type="primary" @click="submitForm('cinema')">确定</el-button>
            
            <el-button type="primary" @click="out">取消</el-button>
        </div>
         
    </div>
</template>

<script>
import axios from 'axios';
import config from '../../../../http/config'
// import {provs,allCity} from './cityData.js';
    export default {
        data(){
            let ciName=(rule,value,callback)=> {
                if(!value){callback(new Error('不能为空'))
                }else{
                    callback();
                }
            };
            let maxlenght_4=(rule,value,callback)=> {
                if(value && value.length>4){callback(new Error('字符不能超出4位'))
                }else{
                    callback();
                }
            };
            let maxlenght_6=(rule,value,callback)=> {
                if(value && value.length>6){callback(new Error('字符不能超出6位'))
                }else{
                    callback();
                }
            };
            let maxlenght_8=(rule,value,callback)=> {
                if(value && value.length>8){callback(new Error('字符不能超出8位'))
                }else{
                    callback();
                }
            };
            let maxlenght_32=(rule,value,callback)=> {
                if(value && value.length>32){callback(new Error('字符不能超出32位'))
                }else{
                    callback();
                }
            };
            
            let maxlenght_40=(rule,value,callback)=> {
                if(value && value.length>40){callback(new Error('字符不能超出40位'))
                }else{
                    callback();
                }
            };
            let maxlenght_50=(rule,value,callback)=> {
                if(value && value.length>50){callback(new Error('字符不能超出50位'))
                }else{
                    callback();
                }
            };
            let maxlenght_64=(rule,value,callback)=> {
                if(value && value.length>64){callback(new Error('字符不能超出64位'))
                }else{
                    callback();
                }
            };
            let maxlenght_100=(rule,value,callback)=> {
                if(value && value.length>100){callback(new Error('字符不能超出100位'))
                }else{
                    callback();
                }
            };
            // let Regphone=(rule,value,callback)=>{
            //     var reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
            //     if(!value.test(reg)){callback(new Error('手机号格式不正确'))
            //     }else{
            //         callback();
            //     }
            // };
            return{
                provs:[],
                citys: [],
                selectProv: '',
                selectCity: '',
                cinemaData:{
                    address:'', //地址  *
                    area:{      //地区  *
                        ccode:'',
                        cname:'',
                        pcode:'',
                        pname:'',
                    },
                    cinemas:'',     //所属影线
                    code:'',        //影院编码
                    company:'',     //公司名称
                    contactMan:'', //影院联系人
                    email:'',       //影院邮箱
                    fax:'',         //影院传真
                    intro:'',       //影院介绍
                    mgCode:'',      //内部管理编码 *
                    mphone:'',      //联系人手机号码 *
                    name:'',        //影院名称  *
                    openTime:'',    //开业时间
                    orgCode:'',     //所属组织编号  *
                    postcode:'',    //影院编码
                    status:'1',      //影院状态，1营业，2测试
                    tphone:'',      //联系人固定电话  

                },
                rules: {
                    name: [
                        { required: true, message: '请输入影院名称', trigger: 'blur' },
                        { validator:maxlenght_32,trigger: 'blur'}
                    ],
                    code: [
                        {required: true ,message:'请输入影院编码', trigger: 'blur'},
                        { validator:maxlenght_8,trigger: 'blur'}
                    ],
                    contactMan: [
                        {required: true, message:'请填写联系人', trigger:'blur'},
                        { validator:maxlenght_32,trigger: 'blur'}
                    ],
                    mphone: [
                        {required: true, message:'请填写手机号码', trigger:'blur'},
                        { validator:maxlenght_32,trigger: 'blur'}
                    ],
                    tphone: [
                        { validator:maxlenght_32,trigger: 'blur'}
                    ],
                    postcode: [
                        { validator:maxlenght_6,trigger: 'blur'}
                    ],
                    fax: [
                        { validator:maxlenght_32,trigger: 'blur'}
                    ],
                    email: [
                        { validator:maxlenght_40,trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '请填写地址', trigger: 'blur' },
                        { validator:maxlenght_50,trigger: 'blur'}
                    ],
                    company: [
                        { validator:maxlenght_64,trigger: 'blur'}
                    ],
                    area: [
                        {required: true, message:'请填写省份或城市', trigger:'change'},
                    ],
                    cinemas: [
                        { validator:maxlenght_64,trigger: 'blur'}
                    ],
                    mgCode : [
                        { validator:maxlenght_4,trigger: 'blur'}
                    ],
                    intro : [
                        { validator:maxlenght_100,trigger: 'blur'}
                    ],
                    
                },
            }
        },
        created(){
        },
        methods:{
            //获取城市数据
            getProv: function (prov) {
                var item = this.provs.filter(item=>{
                    return item.areaCode==prov
                })
                // console.log(item)
                this.cinemaData.area.pcode=item[0].areaCode;
                this.cinemaData.area.pname=item[0].areaName;
                this.cinemaData.area.cname=""
                this.getname(prov)
            },
            //保存城市数据
            getCity: function (city) {
                var item = this.citys.filter(item=>{
                    return item.areaCode==city
                })
                this.cinemaData.area.ccode=item[0].areaCode;
                this.cinemaData.area.cname=item[0].areaName;
            },
            //修改保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.cinemaData)
                        let cinemaData = this.cinemaData;
                        this.$api.cinemaSave(cinemaData)
                        .then( data => {
                            console.log(data)
                            if (data && data.code === 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
                                        this.$router.go(-1)
                                    }
                                })
                            } else {
                                this.$message({
                                    message: '操作失败！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
                                    }
                                })
                            }
                        }).catch( err => {
                            console.log(err)
                        })
                    } else {
                        return false;
                    }
                });
            },
            //获取影院数据
				getInfo(){
                    let uid = this.$route.query.uid;
                    var getname = this.getname;
                this.$api.cinemaGetInfo(uid)
                .then((response)=> {
                    //城市名字分割
                    let data = response.data;//获得数据
                    var code = data.areaCode;
                    code = code.split(':')
                    var erea = data.areaName;
                    erea = erea.split(':')
                    data.area = data.area || {}
                    data.area.pcode = code[0];
                    data.area.ccode = code[1];
                    data.area.pname = erea[0];
                    data.area.cname = erea[1];
                    this.cinemaData = data;
                    getname(code[0]);

                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //获取联动城市方法
            getname(code){
                var parentCode=code?code:"000000";
                this.$api.getPname(parentCode)
                    .then( data => {
                        if (data && data.code === 200) {
                            if(!code){
                                this.provs = data.data
                            }else{
                                this.citys = data.data
                            }
                        } else {}
                    }).catch( err => {
                        console.log(err)
                    })
            },
            //取消退出
            out(){
                this.$router.push("/CTM/cinema/list")
            },
        },
        created(){
                this.getInfo();
                this.getname();
            }
    }
</script>

<style  lang='scss'>
    .cinema-edit .cinema-editContent{
        min-width: 980px;
        overflow: hidden;
        .el-form{width: 100%;display: flex;}
        .item{flex: 1}
    }
    .cinema-edit{
        .el-form-item__label{font-size: 12px}
        .el-radio__label{font-size: 12px;}
    }
    .cinema-edit .el-breadcrumb  {
            margin: 30px 0 20px 30px;
        }
    .cinema-edit .form_left{
        float: left;
    }
    .cinema-edit .el-form-item {
        //input的
        margin: 5px
    }
    .cinema-edit .el-form-item__content {
        width: 300px
    }
    .cinema-edit .btn{
        text-align: center;
    }
    .cinema-edit .el-form-item__error{
        width: 100px;
        top: 10px;
        left: 316px;
    }
</style>