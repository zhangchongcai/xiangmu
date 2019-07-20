<template>
    <div class="rep-params">
        <div class="component">
            <el-form
                :rules="rules" 
                :model="data"
                size="small"
                inline
                ref="formData"
                label-width="150px"
            >
                <div class="title"> 统计上报设置 </div>
                <div>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="上报接口地址："  prop="statisticalReportParamVo.reportUploadUrl">
                                <el-input v-model="data.statisticalReportParamVo.reportUploadUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="端口号："  prop="statisticalReportParamVo.reportPoint">
                                <el-input v-model="data.statisticalReportParamVo.reportPoint"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="上报接口备用地址："  prop="statisticalReportParamVo.reportBackupUploadUrl">
                                <el-input v-model="data.statisticalReportParamVo.reportBackupUploadUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="端口号："  prop="statisticalReportParamVo.reportBackupPoint">
                                <el-input v-model="data.statisticalReportParamVo.reportBackupPoint"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="用户名："  prop="statisticalReportParamVo.userName">
                                <el-input v-model="data.statisticalReportParamVo.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="密码："  prop="statisticalReportParamVo.password2">
                                <el-input v-model="data.statisticalReportParamVo.password2" type="password"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="上报方式："  prop="statisticalReportParamVo.autoReportType" >
                                <el-radio-group v-model="data.statisticalReportParamVo.autoReportType">
                                    <el-radio :label="0">自动上报</el-radio>
                                    <el-radio :label="1">手动上报</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="自动上报时间："  prop="statisticalReportParamVo.autoReportTime">
                                <el-time-select
                                v-model="data.statisticalReportParamVo.autoReportTime"
                                :picker-options="{
                                    start: '06:30',
                                    step: '00:30',
                                    end: '11:30'
                                }"
                                placeholder="选择时间">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="title">  信息接口设置</div>
            
                <div >
                    <el-radio v-model="radio" label=-1   @change="messageRadio">启用</el-radio>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="对接平台："  prop="movieName">
                                <el-input v-model="dockInterface"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="通讯接口IP地址："  prop="messageInterfaceSetParamVo.messageUrl">
                                <el-input v-model="data.messageInterfaceSetParamVo.messageUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="端口号："  prop="messageInterfaceSetParamVo.messagePoint">
                                <el-input v-model="data.messageInterfaceSetParamVo.messagePoint"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="通讯接口备用地址："  prop="messageInterfaceSetParamVo.messageBackupUrl">
                                <el-input v-model="data.messageInterfaceSetParamVo.messageBackupUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="端口号："  prop="messageInterfaceSetParamVo.messageBackupPoint">
                                <el-input v-model="data.messageInterfaceSetParamVo.messageBackupPoint"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="用户名："  prop="messageInterfaceSetParamVo.userName">
                                <el-input v-model="data.messageInterfaceSetParamVo.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="密码："  prop="messageInterfaceSetParamVo.password2">
                                <el-input v-model="data.messageInterfaceSetParamVo.password2" type="password"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div v-for="(item,ind) in data.platAddressInfoList" :key="ind" class="platAddressInfoList">
                        <el-radio v-model="radio" :label="ind"  @change="platRadio">启用</el-radio>
                        <i class="el-icon-close" @click="cutPlatAdd(ind)"></i>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="对接平台："  
                                :prop="'platAddressInfoList.'+ind+'.platName'"
                                :rules="[{ required: true, message: '名字不能为空',trigger: 'blur'}]"
                                >
                                    <el-input v-model="item.platName"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="通讯接口IP地址："  
                                :prop="'platAddressInfoList.'+ind+'.platIpAddress'"
                                :rules="[{required:true, message:'ip地址不能为空',trigger:'blur'}]"
                                >
                                    <el-input v-model="item.platIpAddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="端口号："  
                                :prop="'platAddressInfoList.'+ind+'.platPort'"
                                :rules="[{required:true, message:'端口号不能为空',trigger:'blur'}]"
                                >
                                    <el-input v-model="item.platPort"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="通讯接口备用地址："  
                                :prop="'platAddressInfoList.'+ind+'.platSpareIpAddress'"
                                :rules="[{required:true, message:'备用地址不能为空',trigger:'blur'}]"
                                >
                                    <el-input v-model="item.platSpareIpAddress"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="端口号："  
                                :prop="'platAddressInfoList.'+ind+'.platSparePort'"
                                :rules="[{required:true,message:'备用端口号不能空',trigger:'blur'}]"
                                >
                                    <el-input v-model="item.platSparePort"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="用户名："  
                                :prop="'platAddressInfoList.'+ind+'.platUserName'"
                                :rules="[{required:true,message:'用户名不能空',trigger:'blur'}]"
                                >
                                    <el-input v-model="item.platUserName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="密码："  
                                :prop="'platAddressInfoList.'+ind+'.platPassword2'"
                                :rules="[{required:true,message:'密码不能空',trigger:'blur'}]"
                                >
                                    <el-input v-model="item.platPassword2" type="password"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="授权接口：">
                                <div class="interface">
                                    <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange($event,item)">全选</el-checkbox>
                                    <div style="margin: 15px 0;"></div>
                                    <el-checkbox-group 
                                        v-model="item.interfaceCodes" 
                                        @change="handleCheckedCitiesChange(...arguments,item)"
                                    >
                                        <el-checkbox  v-for="_item in interfaceParamList" :label="_item.interfaceCode" :key="_item.interfaceCode">{{_item.interfaceName}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </el-form-item>
                        </el-row>
                </div>
            </el-form>
            
            <el-button type="primary" style="margin-top:5px" @click="addplatAddressInfo">添加</el-button>
        </div>
        <div class="footer">
            <el-row style="text-align:center;margin-top:5px">
                <el-button type="primary" @click="saveParams" style="width:80px;height:32px">修改</el-button>
            </el-row>
        </div>
    </div>
</template>
<script>
import md5 from 'js-md5'
export default {
    props:{
        applicableObj:{default:"111111"}
    },
    data() {
        return {
            sizeForm:{},
            rules:{},
            dockInterface:'广电平台',
            radio:1,
            checkAll:false,
            isIndeterminate:true,
            interfaceParamList:[],
            data:{
                //统计数据
                statisticalReportParamVo:{
                    autoReportTime:'06:30',
                    autoReportType:0,
                    password2:'',
                    reportBackupPoint:'',//备用
                    reportBackupUploadUrl:'',//备用地址
                    reportPoint:'',//端口号
                    reportUploadUrl:'',
                    userName:''
                },
                //上报数据
                messageInterfaceSetParamVo:{
                    messageBackupPoint:'',
                    messageBackupUrl:'',
                    messagePoint:'',
                    messageUrl:'',
                    password2:'',
                    userName:'',
                },
                //平台数据
                platAddressInfoList:[]
            },
            rules:{
                'statisticalReportParamVo.reportUploadUrl': [
                    {required: true,message: '填写上报接口地址',trigger: 'blur' }
                ],
                'statisticalReportParamVo.reportBackupUploadUrl': [
                    { required: true, message: '填写备用地址', trigger: 'blur' },
                ],
                'statisticalReportParamVo.reportPoint': [
                    { required: true, message: '填写端口号', trigger: 'blur' },
                ],
                'statisticalReportParamVo.reportBackupPoint': [
                    { required: true, message: '填写备用端口号', trigger: 'blur' },
                ],
                'statisticalReportParamVo.userName': [
                    { required: true, message: '填写户名', trigger: 'blur' },
                ],
                'statisticalReportParamVo.password2': [
                    { required: true, message: '填写密码', trigger: 'blur' },
                ],
                'statisticalReportParamVo.autoReportType':[
                    { required: true, message: '选择上报方式', trigger: 'change' },
                ],
                'messageInterfaceSetParamVo.messageUrl':[
                    { required: true, message: '填写通讯接口IP地址', trigger: 'blur' },
                ],
                'messageInterfaceSetParamVo.messagePoint':[
                    { required: true, message: '填写端口号', trigger: 'blur' },
                ],
                'messageInterfaceSetParamVo.messageBackupUrl':[
                    { required: true, message: '填写备用通讯接口备用地址', trigger: 'blur' },
                ],
                'messageInterfaceSetParamVo.messageBackupPoint':[
                    { required: true, message: '填写备用端口号', trigger: 'blur' },
                ],
                'messageInterfaceSetParamVo.userName': [
                    { required: true, message: '填写户名', trigger: 'blur' },
                ],
                'messageInterfaceSetParamVo.password2': [
                    { required: true, message: '填写密码', trigger: 'blur' },
                ],
            }
        }
    },
    watch:{
        applicableObj(news,olds){
            this.initData()
        },
    },
    methods: {
        handleCheckAllChange(val,item) { //授权接口全选
            if(val){
                let codes =[]
                this.interfaceParamList.forEach(item => {
                    codes.push(item.interfaceCode)
                })
                item.interfaceCodes = codes
            }else{
                item.interfaceCodes = []
            }
            item.isIndeterminate = false;
        },

        handleCheckedCitiesChange(value,item) { //授权接口单选 
            // console.log("单选数据:",value)
         
            item.interfaceCodes = value //返回接口的interfaceCodes
            let checkedCount = value.length
            item.checkAll = checkedCount === this.interfaceParamList.length
            item.isIndeterminate = checkedCount > 0 && checkedCount < this.interfaceParamList.length
        },
        //保存修改
        saveParams(){
            let pointer = this
            pointer.data.applicableObj = pointer.applicableObj
            pointer.data.paramType = 0
            pointer.$refs["formData"].validate((valid) => {
                let data = pointer.data
                /**
                 * md5 转换
                 */
                if(valid){
                    if(data.statisticalReportParamVo.password!=data.statisticalReportParamVo.password2) {
                        data.statisticalReportParamVo.password =  md5(data.statisticalReportParamVo.password2)
                    }
                    if(data.messageInterfaceSetParamVo.password!=data.messageInterfaceSetParamVo.password2) {
                        data.messageInterfaceSetParamVo.password = md5(data.messageInterfaceSetParamVo.password2)
                    }
                    if(data.platAddressInfoList.length) {
                        data.platAddressInfoList.forEach(item => {
                            if(item.platPassword!=item.platPassword2){
                                item.platPassword = md5(item.platPassword2)
                            }
                        })
                    }
                    console.log(pointer.data)
                    this.$ctmList.systemParamSavePlat(this.data).then(res => {
                        if(res.code === 200 ){
                            this.$message({
                                message: '修改成功',
                                type: 'success',
                                duration:1000,
                                onClose:()=>{
                                    this.initData()
                                }
                            });
                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'error',
                                duration:1000
                            });
                        }
                    })
                }
            })
        },
        //添加平台地址
        addplatAddressInfo() {
            this.data.platAddressInfoList.forEach(item => {
                item.isUsered = 0
            })
            let data = {
                interfaceCodes:[],
                isUsered:1,
                platIpAddress:'',
                platPassword:'',
                platPassword2:'',
                platPort:'',
                platSpareIpAddress:'',
                platSparePort:'',
                platUsername:'',
                checkAll : true,
                isIndeterminate : false
            }

            this.radio = this.data.platAddressInfoList.length
            this.data.platAddressInfoList.push(data)
            
                
        },
        //信息接口设置启用
        messageRadio(val){
            // console.log(this.radio)
            this.data.platAddressInfoList.forEach(item => {
                item.isUsered = 0
            })
        },
        platRadio(val){
            console.log(val)
            this.data.platAddressInfoList.forEach(_item => {
                _item.isUsered=0
            })
            this.data.platAddressInfoList[val]['isUsered'] = 1
        },
        //删除平台接口
        cutPlatAdd(ind) {
            this.data.platAddressInfoList.splice(ind,1)
        },
        //初始化查询数据
        initData() {
            let data = {
                "paramType":2,
                "applicableObj":this.applicableObj,
                "settingType":0
            }
            this.$ctmList.systemParamLoad(data).then(res => {
                let type = "success"
                let message = "查询成功！"
                if(res.code == 200 ){
                    let pointer = this
                    let {data} = res
                    if(data.platAddressInfoList.length) {
                        data.platAddressInfoList.forEach((item,ind) => {
                            console.log(item)
                            let _list = item.interfaceCodes
                            let checkedCount = _list.length
                            item.platPassword2 =item.platPassword //取俩次密码 后做md5 
                            item.checkAll = checkedCount=== data.interfaceParamList.length
                            item.isIndeterminate = checkedCount > 0 && checkedCount < data.interfaceParamList.length
                            this.radio = ind
                        })
                    }
                    /**
                     * js-md5 
                     * password 返回的密码
                     * password2  页面绑定的密码
                     * 
                    */
                    data.statisticalReportParamVo.password2 = data.statisticalReportParamVo.password || ''
                    data.messageInterfaceSetParamVo.password2 = data.messageInterfaceSetParamVo.password || ''
                    data.statisticalReportParamVo.autoReportType = data.statisticalReportParamVo.autoReportType || 0
                    pointer.interfaceParamList = data.interfaceParamList
                    pointer.data = data
                    // console.log("初始化值完成",res)
                }else{
                    type = "error"
                    message = res.msg
                }
                this.$message({
                    type,
                    message,
                    duration:1000
                })
            })
        }
    },
    created() {
        this.initData()
    },
    
}
</script>
<style lang="scss">
    .rep-params{
        display: flex;
        height: 100%;
        flex-direction: column;
        .component{
            flex: 1;
            overflow: auto;
        }
        .footer{
            height: 40px;
        }
        .el-form-item--small .el-form-item__label{
            text-align: left;
        }
        .el-form-item--small.el-form-item{
            margin-bottom: 15px;
        }

        .platAddressInfoList{
            border: 1px solid #b6c5d9;
            margin-top: 10px;
            .el-icon-close{
                float: right;
                font-size: 20px;
                color: red;
                cursor: pointer;
            }
        }
        .interface{
            width: 700px;
        }
        
    }
</style>

