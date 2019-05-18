<template>
    <div class="cinema-edit">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item style="12px">影院管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑影院</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="color:#333;font-size:14px">基础信息</div>
        <div class="cinema-editContent">
            <el-form ref="cinema" :model="cinemaData" :rules="rules" label-width="100px" label-height='60px'>
                <div class="item item-left">
                    <el-form-item label="影院编码：" prop="code">
                        <el-input v-model="cinemaData.code" disabled></el-input>          
                    </el-form-item> 
                    <el-form-item label="影院名称：" prop="name" >
                        <div style="white-space:normal;">
                        <el-input v-model.trim="cinemaData.name"></el-input>
                        </div>
                    </el-form-item> 
                    <el-form-item label="内部管理编号：" prop="mgCode" >
                        <el-input v-model.trim="cinemaData.mgCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开业时间：">
                        <el-date-picker
                        v-model="cinemaData.openTime"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item> 
                    <el-form-item label="公司名称：" prop="company">
                        <el-input v-model="cinemaData.company"></el-input>
                    </el-form-item>
                    <el-form-item label="所属影院：" prop="cinemas">
                        <el-input v-model="cinemaData.cinemas"></el-input>
                    </el-form-item>
                    <el-form-item label="影院联系人：" prop="contactMan">
                        <el-input v-model="cinemaData.contactMan"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-radio-group
                        v-model="cinemaData.status"
                        @change="statusChange"
                        >
                            <el-radio  :label=1>营业</el-radio>
                            <el-radio  :label=2>测试</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="影院介绍：" prop="intro">
                        <el-input type="textarea" v-model="cinemaData.intro"></el-input>
                    </el-form-item>
                   
                </div>
                <div class="item">
                    <el-form-item label="联系人手机：" prop="mphone">
                        <el-input v-model="cinemaData.mphone"></el-input>
                    </el-form-item> 
                    <el-form-item label="联系人固话：" prop="tphone">
                        <el-input v-model="cinemaData.tphone"></el-input>
                    </el-form-item>
                    <el-form-item label="影院邮编：" prop="postcode">
                        <el-input v-model="cinemaData.postcode"></el-input>
                    </el-form-item> 
                    <el-form-item label="影院传真：" prop="fax">
                        <el-input v-model="cinemaData.fax"></el-input>
                    </el-form-item>
                    <el-form-item label="影院邮箱：" prop="email">
                        <el-input v-model="cinemaData.email"></el-input>
                    </el-form-item>
                    <!--联动选择地区-->
                    <el-form-item label="所属城市：" prop="area">
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
                        
                    <el-form-item label="影院地址：" prop="address">
                        <el-input v-model="cinemaData.address"></el-input>
                        
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="bingUsbkey(0)">重新绑定Usbkey</el-button>
                        <el-button type="primary" @click="download" :disabled="status">下载影院信息</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        
        <HallinfoList :cinemaUid="uid"></HallinfoList>

        <div class="btn">
            <el-button type="primary" @click="submitForm('cinema')">确定</el-button>
            
            <el-button  @click="out" plian>取消</el-button>
        </div>
        <el-dialog
            title="选择要绑定的usbKey"
            :visible.sync="showUsbDialog"
            width="30%"
            :close-on-click-modal=false
            >
            <!-- <el-tree
            :data="usbArray"
            show-checkbox
            node-key="codeid"  
            :props="defualtUsbcode"
            check-strictly
            @check-change="handerUsbkeyItem" 
            ref="treeForm">           
            </el-tree> -->
            <el-radio-group v-model="defualtUsbcode">
            <div v-for="(item , ind) in usbArray" :key="ind" class="radiosGroup">
                <el-radio :label="item.usbKeyCode" @change="handerUsbkeyItem">{{item.usbKeyCode}}</el-radio>
            </div>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hangderUsbkey" type="primary">确定</el-button>
                <el-button @click="showUsbDialog = false" type="plain"> 返回</el-button>
            </span>
        </el-dialog>
         
    </div>
</template>

<script>
import HallinfoList from '../hallInfo/List.vue'
    export default {
        components:{HallinfoList},
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
            return{
                status:false,
                provs:[],
                citys: [],
                selectProv: '',
                selectCity: '',
                uid:'', //  影院id
                showUsbDialog:false,
                usbArray:[],
                defualtUsbcode:{
                    label: 'usbKeyCode',
                    children: 'children'
                },
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
        methods:{
            //获取城市数据
            getProv(prov) {
                var item = this.provs.filter(item=>{
                    return item.areaCode==prov
                })
                // console.log(item)
                this.cinemaData.area.pcode=item[0].areaCode
                this.cinemaData.area.pname=item[0].areaName
                this.cinemaData.area.cname=""
                this.getname(prov)
            },
            //保存城市数据
            getCity(city) {
                var item = this.citys.filter(item=> {
                    return item.areaCode==city
                });
                this.cinemaData.area.ccode=item[0].areaCode
                this.cinemaData.area.cname=item[0].areaName
            },
            //修改保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.cinemaData)
                        let cinemaData = this.cinemaData;
                        this.$api.cinemaSave(cinemaData).then( data => {
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
                var getname = this.getname;
                this.$api.cinemaGetInfo(this.uid).then((response)=> {
                    //城市名字分割
                    let data = response.data//获得数据
                    var code = data.areaCode
                    code = code.split(':')
                    var erea = data.areaName;
                    erea = erea.split(':')
                    data.area = data.area || {}
                    data.area.pcode = code[0]
                    data.area.ccode = code[1]
                    data.area.pname = erea[0]
                    data.area.cname = erea[1]
                    this.cinemaData = data
                    this.cinemaData.usbkey = data.usbkey? data.usbkey : ''
                    this.status = data.status==1?true : false
                    this.cinemaData.status= Number(data.status)
                    getname(code[0]);

                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //获取联动城市方法
            getname(code){
                var parentCode=code?code:"000000";
                this.$api.getPname(parentCode).then( data => {
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
                this.$router.push("/ctm/cinema/list")
            },
            statusChange(val) {
                this.status = val==1? true : false
            },
            //重新绑定usbKey
            hangderUsbkey() {
                let data = {
                    cinemaUid:this.uid,
                    pageType:'updata',
                    usbKeyCode: this.defualtUsbcode
                }
                this.$api.cinemaBindUSBKey(data)
                .then(res => {
                    if(res.code==200){
                        this.showUsbDialog = false
                        this.$message({
                            type:'success',
                            message:'绑定成功！',
                            duration:1000
                        })
                    }
                    
                })
            },
            //点击usbkey
            handerUsbkeyItem(usbKeyCode) {
                let data = {
                    cinemaUid:this.uid,
                    pageType:'updata',
                    usbKeyCode:usbKeyCode,
                }
                console.log(this.defualtUsbcode)
            },
            //获取usbKeycode参数
            bingUsbkey() {
                let data = {
                    cinemaUid:this.uid,
                    pageType:'updata',
                    usbKeyCode: this.cinemaData.usbkey
                }
                this.$api.cinemaBindUSBKey(data)
                .then(res => {
                    let array = res.data
                    this.usbArray = res.data
                    if(array.length>1){
                        this.showUsbDialog = true

                    }else if (array.length==1){
                        this.handerUsbkeyItem(res.data[0].usbKeyCode)
                    }
                })
            },
            download() {
                let data = {
                    cinemaUid:this.uid,
                    status:this.cinemaData.status,
                    usbkey:this.cinemaData.usbkey?this.cinemaData.usbkey:'',
                }
                this.$api.cinemaDownload(data).then(res => {
                    this.cinemaData = Object.assign(this.cinemaData,res.data)
                    console.log(this.cinemaData)
                    this.status = res.data.status==1?true : false
                })

            }
        },
        created() {
            this.uid = this.$route.query.uid
            this.getInfo()
            this.getname()
        }
    }
</script>

<style  lang='scss'>
.cinema-edit .cinema-editContent{
    // min-width: 980px;
    overflow: hidden;
    .el-form{
        width: 100%;
        display: flex;
        padding: 10px 0;
    }
    .item{flex: 1}
}
.cinema-edit{
    .el-form-item__label{font-size: 12px}
    .el-radio__label{font-size: 12px;}
    .form_left{
        float: left;
    }
    .el-breadcrumb  {
        margin: 0px 0 20px 0px;
    }
    //表格样式
    .el-form-item {
        margin: 0px;
        .el-form-item__label{
            text-align:left;
            color:#333
        }
    }
    .el-form-item__content {
        width: 300px;
        .el-radio{
            color:#666
        }
    }
    .el-textarea__inner{
        color: #666;
    }
    .btn{
        margin-top: 20px;
        text-align: center;
    }
    .el-form-item__error{
        width: 100px;
        top: 10px;
        left: 316px;
    }
    //弹出框样式
    .el-dialog__header{
        margin-left: 20px;
        margin-right: 20px;
        padding-left: 0;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #E5E5E5;
    }
    .el-dialog__body{
        max-height: 20vh;
        overflow: auto;
        .keyItem{
            padding: 10px;
            cursor: pointer;
            &:hover{
                background: #3b74ff;
                color: white;
            }
        }
    }
    .radiosGroup{
        margin-top: 10px;
    }
}

</style>