<template>
    <div class="cwf_checkApprovalSetting">
        <div class="checkApprovalSetting-header">
            <div class="header-item">
                <div class="header-item-name">审批流程名称：</div>
                <div class="header-item-content">{{formData.name}}</div>
            </div>
            <div class="header-item">
                <div class="header-item-name">审批节点数：</div>
                <div class="header-item-content">{{formData.noteNum}}</div>
            </div>
        </div>
        <el-collapse v-model="activeNames" class="collapse-style">
            <!-- 节点审批设置 -->
            <el-collapse-item title="节点审批设置" name="1">
                <div class="checkApprovalSetting-item-left">
                    <div class="items"><span class="circle"></span><span class="words">开始</span></div>
                    <div class="line"></div>
                    <!-- 开始节点 -->
                    <template v-for="(item,index) in formData.processList">
                        <div :key="index">
                            <div class="items"  style="margin:3px 0;">
                                <span class="round">
                                    <span class="round-number">{{index+1}}</span>
                                </span>
                                <span class="words">审批人：</span>
                            </div>
                            <div class="line"></div>
                        </div>
                    </template>
                    <!-- 结束节点 -->
                    <div class="items"><span class="circle"></span><span class="words">结束</span></div>
                </div>
                <div class="checkApprovalSetting-item-right">
                    <div class="content-first"></div>
                    <template v-for="(item,index) in formData.processList">
                        <div class="content" :key="index">
                           {{item.assigneeName}}
                        </div>
                    </template>
                    <div class="content-last"></div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="footer">
            <el-button @click="closeBack" >返 回</el-button>
        </div>
    </div>
</template>


<script>
export default {
    data () {
        return {
            type:this.$route.query.type||"",//页面状态
            spId:this.$route.query.spId||"",//id
            activeNames:['1'],
            formData:{
                name:"",
                noteNum:1,
                processList:[{
                    assigneeId:"",
                    assigneeName:"",
                    assigneeType:0,
                    nextNoteNum:null,
                    noteNum:1,
                    tenantId:JSON.parse(localStorage.getItem('user')).consumerId
                }],
                status:0,
                tenantId:JSON.parse(localStorage.getItem('user')).consumerId, //商户id
            },
            tenantId:JSON.parse(localStorage.getItem('user')).consumerId, //商户id
        }
    },
    created(){
        this.findSpById()
    },
    methods:{
        //根据id获取审批流程详情
        findSpById(){
            let params={
                spId:this.spId
            }
            this.$cwfList.findSpById(params).then(data => {
                if (data && data.code === 200 &&data.flag==1) {
                    let reviewData=data.data
                    //编辑时的回显
                    this.formData.noteNum = reviewData.noteNum
                    this.formData.name = reviewData.name
                    this.formData.status =reviewData.status
                    this.formData.processList=[]
                    reviewData.processList.forEach(element => {
                        this.formData.processList.push({
                            assigneeId:element.assigneeId,
                            assigneeName:element.assigneeName,
                            assigneeType:element.assigneeType,
                            nextNoteNum:element.nextNoteNum,
                            noteNum:element.noteNum,
                            tenantId:this.tenantId
                        })
                    });
                } else {
                    this.$message({
                        message: data.msg,
                        type: "warning",
                        duration: 1000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //返回列表
        closeBack(){
            this.$router.push({
                path:"/workflow/approvalSetting"
            })
        },
    },
 
  
}
</script>

<style lang="scss" scoped>
.cwf_checkApprovalSetting{
    .collapse-style{
        width: 100%;
        border: 0;
        position: relative;;
    }
    .checkApprovalSetting-header{
        width: 100%;
        overflow: hidden;
        margin: 20px 0;
        padding-left: 20px;
        font-size: 12px;
        .header-item{
            float: left;
            margin-right: 64px;
            .header-item-name{
                display: inline-block;
                float: left;
                height: 32px;
                line-height: 32px;
                color: #666666;
            }
            .header-item-content{
                min-width: 300px;
                display: inline-block;
                float: left;
                width: 100px;
                height: 32px;
                line-height: 32px;
                color: #666666;
            }
        }
    }
    .checkApprovalSetting-item-left{
        position:absolute;
        width:95px;       
        float: left;
        overflow: hidden;
        min-height: 611px;
        padding: 15px 0px 15px 20px;
        box-sizing: border-box;
        .items{
            width: 80px;
            overflow: hidden;
            height: 20px;
            line-height: 20px;
            box-sizing: border-box;
            .circle{
                float: left;
                display: block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid #BCBCBC;
                vertical-align: middle;
                margin: 4px 0;
                margin-right: 14px;
                margin-left:4px;
            }
            .words{
                float: left;
                display: block;
                color: #666666;
            }
            .round{
                border-radius: 50%;
                height: 20px;
                width: 20px;
                display: inline-block;
                vertical-align: top;
                border: 2px solid #BCBCBC;
                float: left;
                margin-right: 10px;
                .round-number{
                    display: block;
                    color: #BCBCBC;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                    margin-top: -1px;
                    margin-left: -1px;
                }
            }
        }
        .line{
            width: 80px; 
            height: 72px;
            border-left: 1px solid #BCBCBC;
            margin-left: 10px;
        }
       
    }
    .checkApprovalSetting-item-right{
        float: left;
        overflow: hidden;
        min-height: 611px;
        padding: 15px 100px 15px 100px;
        box-sizing: border-box;
        .content-first{
            height: 94px;
        }
        .content-last{
            height: 95px;
        }
        .content{
            overflow: hidden;
            box-sizing: border-box;

            height: 86px;
            line-height: 22px;
            color: #666666;
           
            margin-bottom: 12px;
            padding-left: 50px;
          
            text-overflow:ellipsis;/* 超出部分显示省略号 */
            white-space:normal;/*规定段落中的文本不进行换行 */
            word-break:break-all;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;

        }
    }
    .footer{
        text-align: center;
        margin: 24px 0;
    }
}

</style>
