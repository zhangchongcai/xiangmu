<template>
    <div class="cinemaInfo">
        <el-collapse v-model="activeNames" >
            <el-collapse-item title="基础信息" name="1" margi>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6" class="name">影院编码：</el-col>
                        <el-col :span="10">{{cinemaData.code}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">联系人手机：</el-col>
                        <el-col :span="16">{{cinemaData.mphone}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">影院名称：</el-col>
                        <el-col :span="10">{{cinemaData.name}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">联系人固话：</el-col>
                        <el-col :span="10">{{cinemaData.tphone}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">内部管理编号：</el-col>
                        <el-col :span="10">{{cinemaData.mgCode}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">影院邮编：</el-col>
                        <el-col :span="16">{{cinemaData.postcode}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">开业时间：</el-col>
                        <el-col :span="10">{{cinemaData.openTime}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">影院传真：</el-col>
                        <el-col :span="16">{{cinemaData.fax}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">公司名称：</el-col>
                        <el-col :span="16">{{cinemaData.company}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">影院邮箱：</el-col>
                        <el-col :span="16">{{cinemaData.email}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">所属影院：</el-col>
                        <el-col :span="10">{{cinemaData.cinemas}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">所属城市：</el-col>
                        <el-col :span="16">{{cinemaData.areaName}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">影院联系人：</el-col>
                        <el-col :span="16">{{cinemaData.contactMan}}</el-col>
                    </el-col>
                    <el-col :span="9"><div class="row-item">
                        <el-col :span="6">影院地址：</el-col>
                        <el-col :span="16">{{cinemaData.address}}</el-col></div>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">状态：</el-col>
                        <el-col :span="16">{{cinemaData==1?'营业':'测试'}}</el-col>
                    </el-col>
                    
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="9">
                        <el-col :span="6">影院介绍：</el-col>
                        <el-col :span="16">{{cinemaData.intro}}</el-col>
                    </el-col>
                    
                </el-row>
            </el-collapse-item>
            <div class="line" v-if="activeNames != 1"></div>
        </el-collapse>
        <div class="footer">
            <el-button type="primary" plain @click="goBack">返回</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
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
             activeNames: ['1'],//折叠框
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
        }
    },
    methods:{
        getInfo() {
                var getname = this.getname;
                this.$ctmList.cinemaGetInfo(this.$route.query.uid).then((response)=> {
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
            goBack() {
                this.$router.go(-1)
            }
    },
    created() {
        this.getInfo();
    },
    

}
</script>
<style lang="scss">
    .footer{
        text-align: center;
        // margin-top: -52px
    }
    .cinemaInfo{
        .el-col{
            font-size: 12px;
            height: 51px;
        }
        .el-col-6{
            color: #333;
        }
        .el-col-10,.el-col-16{
            color: #666;
        }
        .el-collapse-item__header::after{
            display: none
        }
        .line{
            background: #ebeef5;
            height: 1px;
            width: 100%;
            margin-bottom: 10px;
        }
        .el-collapse-item__wrap{
            padding: 0;
        }
        .el-collapse{
            padding: 0;
        }
    }
</style>


