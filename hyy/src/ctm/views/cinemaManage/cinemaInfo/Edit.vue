<template>
    <div class="cinema-edit">
        <div style="color:#333;font-size:12px"></div>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基础信息" coolapse="1" name="1">
                <div class="cinema-editContent">
                    <el-form ref="cinema"  :model="cinemaData" :rules="rules" label-width="130px" label-height='60px'>
                        <div class="item item-left">
                            <el-form-item label="影院编码：" class="text-indent">
                                <el-input v-model="cinemaData.code" disabled></el-input>          
                            </el-form-item> 
                            <el-form-item label="影院名称：" prop="name" style="">
                                <div style="white-space:normal;">
                                <el-input v-model.trim="cinemaData.name"></el-input>
                                </div>
                            </el-form-item> 
                            <el-form-item label="影院简称：" prop="shortName" style="" class="text-indent">
                                <div style="white-space:normal;">
                                <el-input v-model.trim="cinemaData.shortName"></el-input>
                                </div>
                            </el-form-item> 
                            <el-form-item label="内部管理编号：" prop="mgCode" >
                                <el-input v-model="cinemaData.mgCode" maxlength="6"></el-input>
                            </el-form-item>
                            <el-form-item label="开业时间：" class="text-indent">
                                <el-date-picker
                                v-model="cinemaData.openTime"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd"
                                placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item> 
                            <el-form-item label="公司名称：" prop="company" class="text-indent">
                                <el-input v-model="cinemaData.company"></el-input>
                            </el-form-item>
                            <el-form-item label="所属影线：" prop="cinemas" class="text-indent">
                                <el-input v-model="cinemaData.cinemas"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="状态：" class="text-indent">
                                <el-radio-group v-model="cinemaData.status" @change="statusChange" >
                                    <el-radio  :label="1">营业</el-radio>
                                    <el-radio  :label="2" :disabled="cinemaData.status==1">测试</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="影院介绍：" prop="intro" class="text-indent">
                                <el-input type="textarea" v-model="cinemaData.intro"></el-input>
                            </el-form-item>
                        
                        </div>
                        <div class="item">
                            <el-form-item label="影院联系人：" prop="contactMan">
                                <el-input v-model="cinemaData.contactMan"></el-input>
                            </el-form-item>
                            <el-form-item label="联系人手机：" prop="mphone">
                                <el-input v-model="cinemaData.mphone"></el-input>
                            </el-form-item> 
                            <el-form-item label="联系人固话：" prop="tphone" class="text-indent">
                                <el-input v-model="cinemaData.tphone"></el-input>
                            </el-form-item>
                            <el-form-item label="影院邮编：" prop="postcode" class="text-indent">
                                <el-input v-model="cinemaData.postcode"></el-input>
                            </el-form-item> 
                            <el-form-item label="影院传真：" prop="fax" class="text-indent">
                                <el-input v-model="cinemaData.fax"></el-input>
                            </el-form-item>
                            <el-form-item label="影院邮箱：" prop="email" class="text-indent">
                                <el-input v-model="cinemaData.email"></el-input>
                            </el-form-item>
                            <!--联动选择地区-->
                            <div class="PCA">
                                <el-form-item label="所属城市：" class="text-indent">
                                    <el-select size="small" style="width: 100px;display:inline-block"
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
                                    <el-select size="small" style="width: 100px;display:inline-block"
                                        v-model="cinemaData.area.ccode"
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
                                    <el-select size="small" style="width: 100px;display:inline-block"
                                        v-model="cinemaData.area.acode"
                                        placeholder="请选择区域"
                                        v-on:change="getAreas($event)"
                                        >
                                        <el-option
                                                v-for="item in areas"
                                                :label="item.areaName"
                                                :value="item.areaCode"
                                                :key="item.value"
                                                >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                                
                            <el-form-item label="影院地址：" prop="address">
                                <el-input v-model="cinemaData.address"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="bingUsbkey">{{cinemaData.usbkey?'重新绑定Usbkey':'绑定UsbKey'}}</el-button>
                                <el-button type="primary" @click="download">下载影院信息</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </el-collapse-item>
            <el-collapse-item title="分组信息" coolapse="2" name="2" v-if='cinemaList_options.length>0 || merList_options.length>0 || areaList_option.length>0'>
                <!-- <el-collapse-item title="分组信息" coolapse="2" name="2"> -->
                 <div class="cinema-editContent">
                     <el-form  :model="cinemaData" :rules="rules" label-width="130px" label-height='60px'>
                         <div class="item left">
                             <el-form-item label="影院等级：" prop="fax" class="text-indent">
                                <el-select v-model="cinemaData.gradeCinema" placeholder="请选择" @change="selectGradeFun(0)">
                                    <el-option
                                    v-for="item in cinemaList_options"
                                    :key="item.propertyCode"
                                    :label="item.propertyName"
                                    :value="item.propertyCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="区域：" prop="fax" class="text-indent">
                                <el-select v-model="cinemaData.gradeArea" placeholder="请选择" @change="selectGradeFun(2)">
                                    <el-option
                                    v-for="item in areaList_option"
                                     :key="item.propertyCode"
                                    :label="item.propertyName"
                                    :value="item.propertyCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                         </div>
                         <div class="item">
                             <el-form-item label="卖品等级：" prop="fax" class="text-indent">
                                <el-select v-model="cinemaData.gradeMer" placeholder="请选择" @change="selectGradeFun(1)">
                                    <el-option
                                    v-for="item in merList_options"
                                     :key="item.propertyCode"
                                    :label="item.propertyName"
                                    :value="item.propertyCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                         </div>
                     </el-form>
                 </div>
            </el-collapse-item>
            <el-collapse-item title="影厅信息"  coolapse="3" name="3">
                <HallinfoList :cinemaUid="uid"></HallinfoList>
            </el-collapse-item>
        </el-collapse>

        <div class="btn">
            <el-button type="primary" @click="submitForm('cinema')">确定</el-button>
            <el-button  @click="out" plian>取消</el-button>
        </div>
         <!-- 弹窗 -->
         <usbKeyDialog ref="usbKeyDialog" :usbArray="usbArray" @usbKeyCodeCallBack="usbKeyCodeCallBack"></usbKeyDialog>
    </div>
</template>

<script>
import HallinfoList from '../hallInfo/List.vue'
import usbKeyDialog from './usbKeyDialog'
    export default {
        components:{HallinfoList,usbKeyDialog},
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
            let mgcode_limit=(rule,value,callback)=> {
                console.log(value.length)
                this.cinemaData.mgCode = this.cinemaData.mgCode.replace(/[^\w]/g, '')
                if(this.cinemaData.mgCode.length<6){callback(new Error('请输入六位数字'))
                }else{
                    callback();
                }
            };
            return{
                cinemaList_options: [],
                merList_options:[],
                areaList_option:[],
                value: '',
                /* 折叠版参数 */
                activeNames:['1','2','3'],
                status:false,
                provs:[],
                citys: [],
                areas:[],
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
                        acode:'',
                        aname:''
                    },
                    shortName:'',
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
                    postcode:'',    //影院邮政
                    status:'1',      //影院状态，1营业，2测试
                    tphone:'',      //联系人固定电话 
                    //分组信息字段
                    gradeCinema:'',
                    gradeMer:'',
                    gradeArea:'',
                    cinemaGradeList:[
                        {uid:'' ,
                        tenantId:'',
                        cinemaUid:'',
                        gradeTypeCode:'',
                        gradeTypeName:'',
                        gradeCode:'',
                        gradeName:'',
                        flag:'',},
                         {uid:'' ,
                        tenantId:'',
                        cinemaUid:'',
                        gradeTypeCode:'',
                        gradeTypeName:'',
                        gradeCode:'',
                        gradeName:'',
                        flag:'',},
                         {uid:'' ,
                        tenantId:'',
                        cinemaUid:'',
                        gradeTypeCode:'',
                        gradeTypeName:'',
                        gradeCode:'',
                        gradeName:'',
                        flag:'',},
                       
                    ]

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
                    intro : [
                        { validator:maxlenght_100,trigger: 'blur'}
                    ],
                    mgCode : [
                        {required: true, message:'请输入内部管理编号', trigger:'blur'},
                        {validator:mgcode_limit,trigger:'blur'}
                    ]
                    
                },
            }
        },
        methods:{
            //分组信息方法
            selectGradeFun(index){
                let arrItem = {}
                if(index == 0){
                    this.cinemaData.cinemaGradeList[index].gradeTypeName = '影院等级'
                    this.cinemaList_options.forEach((item,index2)=>{
                        if(item.propertyCode == this.cinemaData.gradeCinema){
                            arrItem = item
                        }
                    })
                }
                if(index == 1){
                    this.cinemaData.cinemaGradeList[index].gradeTypeName = '卖品等级'
                     this.merList_options.forEach((item,index2)=>{
                        if(item.propertyCode == this.cinemaData.gradeMer){
                            arrItem = item
                        }
                    })
                }
                if(index == 2){
                     this.cinemaData.cinemaGradeList[index].gradeTypeName = '区域'
                     this.areaList_option.forEach((item,index2)=>{
                        if(item.propertyCode == this.cinemaData.gradeArea){
                            arrItem = item
                        }
                    })
                }
                this.cinemaData.cinemaGradeList[index].uid = this.cinemaData.cinemaGradeList[index].uid?this.cinemaData.cinemaGradeList[index].uid : '';
                this.cinemaData.cinemaGradeList[index].cinemaUid = this.cinemaData.uid
                this.cinemaData.cinemaGradeList[index].tenantId = this.cinemaData.tenantId
                this.cinemaData.cinemaGradeList[index].gradeTypeCode = arrItem.dictCode
                this.cinemaData.cinemaGradeList[index].gradeCode = arrItem.propertyCode
                this.cinemaData.cinemaGradeList[index].gradeName = arrItem.propertyName
                this.cinemaData.cinemaGradeList[index].flag = 1
            },
            //保存省 获取城市数据
            getProv(prov) {
                var item = this.provs.filter(item=>{
                    return item.areaCode==prov
                })
                // console.log(item)
                this.cinemaData.area.pcode=item[0].areaCode
                this.cinemaData.area.pname=item[0].areaName
                this.cinemaData.area.ccode=""
                this.cinemaData.area.acode=""
                this.getname(prov)
            },
            //保存城市 获取区域数据
            getCity(code) {
                console.log(code)
                var item = this.citys.filter(item=> {
                    return item.areaCode==code
                });
                this.cinemaData.area.ccode=item[0].areaCode
                this.cinemaData.area.cname=item[0].areaName
                this.cinemaData.area.acode=""
                this.$ctmList.getPname(code).then( res => {
                    this.areas = res.data
                })
            },
            //保存区域数据
            getAreas(city) {
                var item = this.areas.filter(item=> {
                    return item.areaCode==city
                });
                this.cinemaData.area.acode=item[0].areaCode
                this.cinemaData.area.aname=item[0].areaName
            },
            //修改保存
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //分组信息清除未选择
                        let obj = JSON.parse(JSON.stringify(this.cinemaData.cinemaGradeList))
                        this.cinemaData.cinemaGradeList = obj.filter((item,index)=>{
                            return item.cinemaUid
                        })
                        let cinemaData = this.cinemaData;
                        this.$ctmList.cinemaSave(cinemaData).then( data => {
                            console.log(data)
                            if (data && data.code === 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
                                        this.$store.commit("tagNav/removeTagNav", {
                                            name: this.$route.name,
                                            path: this.$route.path,
                                            title: this.$route.meta.title,
                                            query: this.$route.query
                                        })
                                        this.$router.push({path:'/ticket/cinema/list'})
                                    }
                                })
                            } else {
                                this.$message({
                                    message: '操作失败！',
                                    type: 'error',
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
                this.$ctmList.cinemaGetInfo(this.uid).then((response)=> {
                    //城市名字分割
                    let data = response.data.cinemaInfo//获得数据
                    data.cinemaGradeList = response.data.cinemaGradeList
                    var code = data.areaCode || "000000:000000:000000"
                    code = code.split(':')
                    var erea = data.areaName ||  "北京:北京:北京"
                    erea = erea.split(':') 
                    data.area = data.area || {}
                    data.area.pcode = code[0]
                    data.area.ccode = code[1]
                    data.area.acode = code[2]
                    data.area.pname = erea[0]
                    data.area.cname = erea[1]
                    data.area.aname = erea[2]
                    //有省级获取城市数据
                    if(data.area.pcode){
                        this.getname(data.area.pcode)
                    }
                    //有城市获取区域数据
                    if(data.area.ccode){
                        this.$ctmList.getPname(data.area.ccode).then( res => {
                            this.areas = res.data
                        })
                    }
                    let obj = JSON.parse(JSON.stringify(this.cinemaData.cinemaGradeList))
                    Object.assign(this.cinemaData, data);
                    this.cinemaData.cinemaGradeList = obj
                    data.cinemaGradeList.forEach( (item,index) => {
                        if(item.gradeTypeName == '影院等级'){
                            this.cinemaData.cinemaGradeList[0] = item
                            this.cinemaData.gradeCinema = item.gradeCode
                        }
                         if(item.gradeTypeName == '卖品等级'){
                            this.cinemaData.cinemaGradeList[1] = item
                            this.cinemaData.gradeMer = item.gradeCode
                        }
                         if(item.gradeTypeName == '区域'){
                            this.cinemaData.cinemaGradeList[2] = item
                            this.cinemaData.gradeArea = item.gradeCode
                        }
                    })

                    this.cinemaData.usbkey = data.usbkey? data.usbkey : ''
                    this.status = data.status==1?true : false
                    this.cinemaData.status= Number(data.status)
                    this.getDictionary('ci_cinema_grade_info_cinema')
                    this.getDictionary('ci_cinema_grade_info_mer')
                    this.getDictionary('ci_cinema_grade_info_area')

                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //获取联动城市方法
            getname(code){
                var parentCode=code?code:"000000";
                this.$ctmList.getPname(parentCode).then( res => {
                        if (res && res.code === 200) {
                            if(!code){
                                this.provs = res.data
                            }else{
                                this.citys = res.data
                            }
                        } else {}
                    }).catch( err => {
                        console.log(err)
                    })
            },
            //取消退出
            out(){
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                this.$router.push("/ticket/cinema/list")
            },
            statusChange(val) {
                this.status = val==1? true : false
            },
            //重新绑定usbKey
            hangderUsbkey(usbKeyCode) {
                console.log('绑定的ubs值',this.cinemaData.usbkey)
                this.cinemaData.usbkey = usbKeyCode   //cinemaData的usbKey获取最新的usbKey
                let data = {
                    cinemaUid:this.uid,
                    pageType:'update',
                    usbKeyCode: usbKeyCode
                }
                if(!this.cinemaData.usbkey){    //如果影院没有usbkey,则pageType为null
                    data.pageType = null
                }
                this.$ctmList.cinemaBindUSBKey(data)
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
            //usbkey回调
            usbKeyCodeCallBack(usbKeyCode) {
                this.hangderUsbkey(usbKeyCode)

            },
            //获取usbKeycode列表 
            bingUsbkey() {
                let data = {
                    cinemaUid:this.uid,
                    pageType:'update',  
                    usbKeyCode: ""
                }
                if(!this.cinemaData.usbkey){    //如果影院没有usbkey,则pageType为null
                    data.pageType = null
                }
                this.$ctmList.cinemaBindUSBKey(data).then(res => {
                        if(res.code==200){
                            let array = res.data
                            console.log(array)
                            this.usbArray = res.data
                            if(array.length>=1){
                                this.$refs.usbKeyDialog.openDialog()
                            }else{
                                this.$message({
                                    type:'error',
                                    message:'没有获取有效的USBKEY！',
                                    duration:1000
                                })
                            }
                    }
                })
            },
            /**
             * Func- 下载影院信息
             * 
             */
            download() {
                let params = {
                    cinemaUid:this.uid,
                    status:this.cinemaData.status,
                    usbkey:this.cinemaData.usbkey?this.cinemaData.usbkey:'',
                }
                this.$ctmList.cinemaDownload(params).then(res => {
                    if(res.code==200){
                        let {data}  = res
                        let cinemaData = this.cinemaData
                        cinemaData.cinemas = data.cinemas?data.cinemas:cinemaData.cinemas
                        cinemaData.code = data.code?data.code:cinemaData.code
                        cinemaData.contactMan = data.contact?data.contact:cinemaData.contactMan 
                        cinemaData.company = data.corporation?data.corporation:cinemaData.company
                        cinemaData.fax = data.fax?data.fax:cinemaData.fax
                        cinemaData.name = data.name?data.name:cinemaData.name
                        cinemaData.status = data.status?data.status:cinemaData.status
                        cinemaData.mphone = data.telephone? data.telephone:cinemaData.mphone
                        this.$message({
                            type:'success',
                            message:'下载影院信息成功！',
                            duration:1000
                        })
                    }else{
                        this.$message({
                            type:'success',
                            message:'下载影院信息失败！',
                            duration:1000
                        })
                    }
                    this.status = res.data.status==1?true : false
                })

            },
            //获取影片字典
            getDictionary (val) {
            let _this = this
            let params = {
                dicCode: val,
                uidCinema:this.cinemaData.uid,
                tenantId:this.cinemaData.tenantId,
            }
            _this.$ctmList
                .getCenameDictionary(params)
                .then(ret => {
                if (ret.data) {
                    let result = ret.data.cpmDictList;
                    if (val == 'ci_cinema_grade_info_cinema') {
                    //影院等级
                    _this.cinemaList_options = [...result]
                    }
                    if (val == 'ci_cinema_grade_info_mer') {
                    //卖品等级
                    _this.merList_options = [...result]
                    }
                    if (val == 'ci_cinema_grade_info_area') {
                    //区域
                    _this.areaList_option = [...result]
                    }
                   
                }
                })
            },
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
    overflow: hidden;
    .el-form{
        width: 100%;
        display: flex;
        padding: 10px 0;
        .el-input,
        .el-select{
            width:100%;
        }
    }
    .item{flex: 1}
}
.cinema-edit{
    position: relative;
    .el-collapse-item__header {
        padding-left: 2px;
        color: #333;
    }
    .el-form-item__label{font-size: 12px}
    .el-radio__label{font-size: 12px;}
    .text-indent{
        .el-form-item__label{text-indent: 9px;}
    }
    .form_left{
        float: left;
    }
    .el-collapse-item__wrap{padding-top: 0px;}
    .el-collapse-item__header::after{
        height: 0;
        width: 0;
    }
    //表格样式
    .el-form-item {
        margin: 16px;
        .el-form-item__label{
            text-align:left;
            color:#666
        }
        .is-disabled{
            input{
                background: #f5f5f5;
            }
        }
    }
    .el-form-item__content {
        width: 300px;
        .el-radio{
            color:#666
        }
    }
    .PCA{
        .el-form-item__content{
            width: 350px
        }
    }
    .el-textarea__inner{
        color: #666;
    }
    .el-button{
        font-size: 12px;
    }
    .btn{
        position: fixed;
        left: 146px;
        right: 0;
        bottom: 0px;
        height: 50px;
        line-height: 50px;
        background: #fff;
        // width: calc(100vw - 200px);
        text-align: center;
        .el-button{
            width: 80px;
            height: 32px;
            margin-left: 25px;
        }
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
    .el-collapse-item__header{
        display: flex;
        justify-content:flex-end;
        flex-direction: row-reverse;
    }
    .el-collapse-item__header::after{
        display: none
    }
    .el-collapse-item__arrow{
        margin: 0 8px 0px 0;
    }
}

</style>