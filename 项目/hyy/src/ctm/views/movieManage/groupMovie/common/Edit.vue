<template>
  <div class="film-edit-wrap">
    <!-- <div class="film-edit-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">影片管理</el-breadcrumb-item>
        <el-breadcrumb-item>影片库</el-breadcrumb-item>
        <el-breadcrumb-item>编辑影片信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="film-edit-content">
      <el-collapse
        v-model="activeNames"
      >
       <el-form
              :rules="rules" 
              ref="ruleForm" 
              :model="sizeForm"
              label-width="85px"
              size="small"
              inline
            >
        <el-collapse-item
          title="基础信息"
          name="1"
        >
          <div class="basic-info">
            <div>
               <el-form-item label="影片名称：" prop="movieName">
                <span class="download-film-scan-text">
                  {{sizeForm.movieName}}
                </span>
              </el-form-item>

              <el-form-item label="影片编码："  prop="movieCode">
                 <span class="download-film-scan-text">
                    {{sizeForm.movieCode}}
                  </span>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="影片英文：" prop="movieenglishname">
                <el-input v-model="sizeForm.movieenglishname"></el-input>
              </el-form-item>

              <el-form-item label="影片别名："  prop="movieothername">
                <el-input v-model="sizeForm.movieothername"></el-input>
              </el-form-item>

            </div>
            <div>
              <el-form-item label="影片语言：" prop="moviedesclanguage">
                <!-- <span class="download-film-scan-text">
                  {{sizeForm.moviedesclanguage}}
                </span> -->
                <el-select
                  v-model="sizeForm.moviedesclanguage"
                  placeholder="请选择"
                >
                  <el-option
                    label="原声"
                    value="原声"
                  ></el-option>
                  <el-option
                    label="国语"
                    value="国语"
                  ></el-option>
                  <el-option
                    label="英语"
                    value="英语"
                  ></el-option>
                  <el-option
                    label="粤语"
                    value="粤语"
                  ></el-option>
                  <el-option
                    label="日语"
                    value="日语"
                  ></el-option>
                  <el-option
                    label="韩语"
                    value="韩语"
                  ></el-option>
                  <el-option
                    label="法语"
                    value="法语"
                  ></el-option>
                  <el-option
                    label="其他"
                    value="其他"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="影片产地：" prop="movieArea">
                 <span class="download-film-scan-text">
                    {{sizeForm.movieArea}}
                  </span>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="发行版本：" prop="disVersion">
                  <span class="download-film-scan-text">
                    {{sizeForm.disVersion}}
                  </span>
              </el-form-item>
              
              <el-form-item label="影片级别：" prop="movieLevel">
                <el-select
                  v-model="sizeForm.movieLevel"
                  placeholder="请选择"
                >
                  <el-option
                    label="A"
                    value="A"
                  ></el-option>
                  <el-option
                    label="B"
                    value="B"
                  ></el-option>
                  <el-option
                    label="C"
                    value="C"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="影片分类：" prop="movieClass">
                <span class="download-film-scan-text">
                    {{sizeForm.movieClass}}
                  </span>
              </el-form-item>
                 
              <el-form-item label="影片时长：" prop="timeLong">
                 <div class="input-edit-wrap">
                    <el-input  v-model="sizeForm.timeLong"></el-input>
                 </div><span style="font-size:12px;color:#808080;margin-left:5px">分钟</span>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="影片字幕：" prop="filmCaption">
                <el-select
                  v-model="sizeForm.filmCaption"
                  placeholder="请选择活动区域"
                >
                  <el-option
                    label="国语"
                    value="国语"
                  ></el-option>
                  <el-option
                    label="粤语"
                    value="粤语"
                  ></el-option>
                  <el-option
                    label="英语"
                    value="英语"
                  ></el-option>
                  <el-option
                    label="日语"
                    value="日语"
                  ></el-option>
                  <el-option
                    label="韩语"
                    value="韩语"
                  ></el-option>
                  <el-option
                    label="法语"
                    value="法语"
                  ></el-option>
                  <el-option
                    label="俄语"
                    value="俄语"
                  ></el-option>
                  <el-option
                    label="德语"
                    value="德语"
                  ></el-option>
                  <el-option
                    label="意大利语"
                    value="意大利语"
                  ></el-option>
                  <el-option
                    label="西班牙语"
                    value="西班牙语"
                  ></el-option>
                  <el-option
                    label="印度语"
                    value="印度语"
                  ></el-option>
                  <el-option
                    label="其他"
                    value="其他"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公映日期：" prop="datePublicShow">
                 <span class="download-film-scan-text" v-if='sizeForm.datePublicShow'>
                    {{sizeForm.datePublicShow.substring(0,10)}}
                  </span>
                <!-- <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="sizeForm.datePublicShow"
                  style="width: 100%;"
                ></el-date-picker> -->
              </el-form-item>
            </div>
            <div>
              <el-form-item label="首映日期：" prop="dateShowFirst">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="sizeForm.dateShowFirst"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="下映日期：" prop="dateShowOff">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  v-model="sizeForm.dateShowOff"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </div>
            
           <el-form-item label="帧数："  prop="frameNumber">
                <el-select
                  v-model="sizeForm.frameNumber"
                  placeholder="请选择帧数"
                >
                  <el-option
                    label="24"
                    value="24"
                  ></el-option>
                  <el-option
                    label="48"
                    value="48"
                  ></el-option>
                   <el-option
                    label="120"
                    value="120"
                  ></el-option>
                </el-select>
              </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="分账信息"
          name="3"
        >
          <div class="basic-info">
            <div class="separate-accounts-wrap">
               <el-form-item label="最低票价：">
                <div v-for="(item,index) in priceList" style="margin-top:8px;" :key="index">
                  <div class="separate-accounts-price">
                  <el-input
                   size="small"
                    v-model="item.minPrice"
                  ></el-input>
                  <span>元 ，</span>
                </div>
               
                <div class="separate-accounts-date">
                    <span>日期</span>
                   <el-date-picker
                    v-model="item.dateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                  <el-date-picker
                      v-model="item.dateEnd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </div>
                <span class="delete" @click="deleMinPrice(index)">删除</span>
                </div>
                <div class="no-info" v-if="priceList.length==0">
                  暂无
                </div>
                <span class="add" @click="addMinPrice()"><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
              </el-form-item>

              <el-form-item label="院方分账：">
                
                <div v-for="(item,index) in rateList" style="margin-top:8px;" :key='index'>
                  <div class="separate-accounts-price">
                  <el-input
                   size="small"
                    v-model="item.rate"
                   
                  ></el-input>
                  <span>% ，</span>
                </div>
               
                <div class="separate-accounts-date">
                    <span>日期</span>
                <el-date-picker
                  v-model="item.dateStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
                <el-date-picker
                    v-model="item.dateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
                </div>  
                <span class="delete" @click="deleAccounts(index)">删除</span>
                </div>
                <div class="no-info" v-if="rateList.length==0">
                  暂无
                </div>
                <span class="add" @click="addAccount()"><i class="iconfont icon-neiye-tianjia-" ></i>添加</span>
              </el-form-item>
            </div>

             

           
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item
          title="详细信息"
          name="2"
        >
          <div class="basic-info">
            <div>
              <el-form-item label="发行商：" prop="publisher">
                <el-select
                  v-model="sizeForm.publisher"
                  placeholder="请选择"
                >
                  <el-option
                    label="华夏电影发行有限公司"
                    value="华夏电影发行有限公司"
                  ></el-option>
                  <el-option
                    label="中影数字电影发展有限公司"
                    value="中影数字电影发展有限公司"
                  ></el-option>
                  <el-option
                    label="五洲电影发行有限公司"
                    value="五洲电影发行有限公司"
                  ></el-option>
                  <el-option
                    label="中国电影股份有限公司"
                    value="中国电影股份有限公司"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主演：" prop="movieActor">
                <el-input
                  v-model="sizeForm.movieActor"
                  placeholder="请选择"
                ></el-input>
              </el-form-item>
            </div>  
            <div>
              <el-form-item label="导演：" prop="movieDirect">
                <el-input
                  v-model="sizeForm.movieDirect"
                  placeholder="请选择"
                ></el-input>
              </el-form-item>
              <el-form-item label="其他演员：" prop="movieOtherActor">
                <el-input
                  v-model="sizeForm.movieOtherActor"
                  placeholder="请选择"
                ></el-input>
              </el-form-item>
            </div>  
                
              <el-form-item
                label="简介："
                prop="desc"
              >
                <el-input
                  type="textarea"
                  v-model="sizeForm.movieDesc"
                ></el-input>
              </el-form-item>
          </div>
        </el-collapse-item> -->
       </el-form>
      </el-collapse>
      <div class="bottom-handler-tool">
			<div class="btn-area" >
				<el-button type="primary" @click="onSubmit('ruleForm')">保存</el-button>
				<el-button @click="cancelFun">返回</el-button>
			</div>
		
		</div>

      <!-- <div class="film-info-save">
        <el-button type="primary" @click="cancelFun" >取消</el-button>

        <el-button type="primary" @click="onSubmit('ruleForm')">保存</el-button>
      </div> -->
    </div>
     <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>
<script>
import FixStepTool from "ctm/components/fix-step-tool/fix-step-tool"
import fixStepMixin from "ctm/mixins/fixStepTool"

export default {
  data() {
    return {
      activeNames:['1','2','3'], 
      sizeForm: {
        movieName: "",
        disVersion: "",
        movieCode: "",
        movieArea: "",
        movieClass: "",
        frameNumber: "",
        timeLong: "",
        dateShowFirst: '',
        dateShowOff: "",
        filmCaption: "",
        movieLevel:'',
        publisher:'',
        movieActor:"",
        movieDirect:'',
        movieDesc:'',
        //自己定义字段
        movieDescLanguage:'',
        movieEnglishName:"",
        movieOtherName:'',
        movieOtherActor:'',
        //交互部分
        
        activeNames: ["3"],
        dialogImageUrl: "",
        dialogVisible: false
      },
      priceList:[],
      rateList:[],
        stepData: {
                stepEl: ".el-collapse-item",
                stepList: [
                    {
                        name: "基础信息",
                        isactive: false
                    },
                     {
                        name: "分账信息",
                        isactive: false
                    },
                    // {
                    //     name: "详细信息",
                    //     isactive: false
                    // },
                ]
            },
       rules: {
         
          frameNumber: [
            { required: true, message: '请输入电影帧数', trigger: 'blur' },
          ],
           timeLong: [
            { required: true, message: '请输入电影时长', trigger: 'blur' },
          ],
           dateShowFirst: [
            { required: true, message: '请输入首映日期', trigger: 'blur' },
          ],
           dateShowOff: [
            { required: true, message: '请输入下映日期', trigger: 'blur' },
          ],
          

          // movieActor: [
          //   { required: true, message: '请输入主演', trigger: 'blur' },
          //   { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
          // ],
          // movieDirect: [
          //   { required: true, message: '请输入影片导演', trigger: 'blur' },
          //   { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
          // ],

           movieothername: [
            { required: true, message: '请输入影片别名', trigger: 'blur' },
            { max:12, message: '长度不超过 12个字符', trigger: 'blur' }
          ],
         
           movieenglishname: [
            { required: true, message: '请输入影片英文名', trigger: 'blur' },
            { max:50, message: '长度不超过 50 个字符', trigger: 'blur' }
          ],
          
          // movieOtherActor: [
          //   { required: true, message: '请输入其他演员', trigger: 'blur' },
          //   { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
          // ],
          },
    };
  },
  mixins: [fixStepMixin],
  components: {
        fixStepTool: FixStepTool
    },
  methods: {
    //新增最低票价和分账比列
    addMinPrice(){
      
      let item={
          dateEnd: "",
          dateStart: "",
          // delFlag: 0,
          // grade: "",
          // id: 200,
          // minPlanCount: null,
          // minPlanPercent: null,
          minPrice: '',
          // minSalePrice: null,
          // movieUid: "122333",
          // tenantId: "",
          // uidCinema: "00000000",
          // updateTime: "2019-03-14 16:11:57",
      }
      if(this.priceList.length>2){

        return
      }
      this.priceList.push(item)
      console.log('this.addMinPrice',this.priceList)
    },
    deleMinPrice(index){
       if( this.priceList.length<=1){
        return
      }
       this.priceList.splice(index,1)
    },
    addAccount(){
      let item = {
        dateEnd: '',
        dateStart: '',
        // delFlag: 0,
        // id: 275,
        // movieUid: "122333",
        rate: '',
        // tenantId: null,
        // uidCinema: "00000000",
        // updateTime: "2019-03-14 16:17:41",
      }
       if(this.rateList.length>2){
        return
      }
      this.rateList.push(item)
      console.log('this.addAccount',this.rateList)
    },
    deleAccounts(index){
      if( this.rateList.length<=1){
        return
      }
      this.rateList.splice(index,1)
    },
    //提交form表单
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        console.log('valid',valid)
          if (valid) {
            let self = this;
             if(new Date(self.sizeForm.dateShowFirst).getTime() > new Date(self.sizeForm.dateShowOff).getTime()){
               this.$message({
                  message: '上映日期大于下映日期',
                  type: 'warning'
                });
                return
            }
             if(self.sizeForm.datePublicShow.length<=10){
              self.sizeForm.datePublicShow = self.sizeForm.datePublicShow+' '+'00:00:00'
            }
             if(self.sizeForm.dateShowOff.length<=10){
              self.sizeForm.dateShowOff = self.sizeForm.dateShowOff+' '+'00:00:00'
            }
             if(self.sizeForm.dateShowFirst.length<=10){
              self.sizeForm.dateShowFirst = self.sizeForm.dateShowFirst+' '+'00:00:00'
            }
           

            self.priceList.forEach((item,index)=>{
              if(!(item.dateEnd && item.dateStart && item.minPrice)){
                 this.$message({
                  message: '请补全新增的最低票价',
                  type: 'warning'
                });
                return
              }
              if(item.dateEnd.length<=10){
                item.dateEnd = item.dateEnd+" "+"00:00:00"
              }
              if(item.dateStart.length<=10){
                 item.dateStart = item.dateStart+" "+"00:00:00"
              }
            })
            
            self.rateList.forEach((item,index)=>{
              if(!(item.dateEnd && item.dateStart && item.rate)){
                 this.$message({
                  message: '新增的分账比例未成功',
                  type: 'warning'
                });
                return
              }
               if(item.dateEnd.length<=10){
                item.dateEnd = item.dateEnd+" "+"00:00:00"
              }
              if(item.dateStart.length<=10){
                 item.dateStart = item.dateStart+" "+"00:00:00"
              }
            })
            
                let data = 
                {
                  //分账比列
                schBashMovie:self.sizeForm,
                priceList: self.priceList,
                rateList:self.rateList,

                };
                console.log('data------------------',data)
            self.$ctmList
              .DownloadmovieEdit(data)
              .then(ret => {
                console.log("retsssssssssss", ret.data);
                if(ret.data){
                  self.$message({
                  message: '修改成功',
                  type: 'success'
                });
                  self.$router.push({
                  path: "list",
                });
                }else{
                  self.$message({
                  message: '上传失败',
                  type: 'warning'
                });
                }
                
              })
              .catch(() => {
                console.log("哪里出错了，检擦一下哥哥");
                self.$message({
                  message: '网络出错，稍后重试！',
                  type: 'warning'
                });
              });
                } 
                else {
                  console.log('error submit!!');
                  return false;
                }

                          });

      
    },
    getDatas() {
      let self = this;
      console.log('self.$route.params.movieIdsssssssssssssssssssssss',this.$route.query.movieId)
      let data = {
        movie_code: this.$route.query.movieId
      };
      self.$ctmList
        .DownloadmovieScan(data)
        .then(ret => {
          console.log("retsssssssssss", ret.data);
          if(ret.data){
            let result = ret.data;
            self.sizeForm = result.schBashMovie;
            self.priceList = result.priceList;
            self.rateList = result.rateList;
          }
          
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    cancelFun(){
         this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '留下',
                cancelButtonText: '放弃修改'
                })
                .then(() => {
                  //  this.onSubmit()
                })
                .catch(action => {
                  console.log('action',action)
                    if (action != 'cancel') return
                    this.$router.push({
                      path: "list",
                    });
                    
                });  
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  created(){
    this.getDatas()
  }
};
</script>
<style  lang='scss' type="text/css" >
.film-edit-wrap {
  width: 100%;
  .el-collapse-item__header::after{
            height: 0px !important;
  }
  position: relative;
  .film-edit-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .basic-info {
    // width: 420px;
    margin-left: 30px;
    .el-form-item--small.el-form-item {
      margin-bottom: 18px;
      // display: inline-block;
      width: 480px;
      margin-right:48px;
    }
    .el-form-item--small.el-form-item:nth-of-type(even){
      margin-right:0px;
    }

    .el-form-item__label {
      font-size: 12px;
      text-align: left;
    }
     .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
    }
    .input-edit-wrap{
      display: inline-block;
      .el-input__inner{
        width: 325px ;
      }
    }
    .el-form-item__label {
      font-size: 12px;
    }
    .download-film-scan-text {
      font-size: 12px;
      color: #808080;
      width: 360px;
    }
   
    .film-edit-text {
      font-size: 12px;
      color: #808080;
    }
    //添加or删除
    .separate-accounts-wrap{
      .add{
        color:#3B74FF;
         font-size: 12px;
         cursor:pointer;
        .icon-neiye-tianjia-{
          font-size: 12px;
          margin-right: 4px
          
        }
      }
      .no-info{
        font-size: 12px;
        color: #808080;
        width: 360px;
      }
    }
    //分账信息and最低票价
.separate-accounts-date,
    .separate-accounts-price,
    .separate-accounts-action {
      display: inline-block;
    //   height: 32px;
    }
    .separate-accounts-price {
      width: 83px;
      .el-input--small{
          width:46px;
          .el-input__inner {
             width: 46px;
          }
      }
      span{
          font-size: 12px;
          color: #666666 ;
      }
    }
    .separate-accounts-date {
      width: 297px;
      margin-left: -12px;
       span{
              font-size: 12px;
              color: #666666 ;
          }
      .el-date-editor--daterange.el-input__inner{
          width: 196px;
         
      }
      .el-date-editor{
        width: 120px;
        margin-right:8px;
        .el-input__inner{
          width: 107%;
        }
      }
    }
    .delete{
      color: #3B74FF;
      font-size: 12px;
      cursor:pointer
      
    }
     .no-info{
        font-size: 12px;
        color: #808080;
        width: 360px;
      }
    .separate-accounts-action{
        margin-left: 6px;
        .el-button{
            border: 1px solid #3B74FF;
            color: #3B74FF;
            span{
                font-size: 12px;
            }
        }
        .el-button--mini{
            padding: 10px 5px 8px;
        }
    }
  }
  
  .film-info-save {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  //新button样式
  .bottom-handler-tool {
		height: 64px;
		width: 100%;
		position: fixed;
		z-index: 999;
		bottom: 0;
		right: 0;
		// background-color: #f5f5f5;
		.btn-area {
			width: 500px;
			margin: 0 auto;
			height: 64px;
			text-align: center;
			padding-top: 16px;
			box-sizing: border-box;
		}
	}
  	.el-collapse {
		border-bottom: none;
		padding-bottom: 64px;
	}
    //设置折叠框箭头和位置
    .el-collapse-item__arrow {
        margin: 0 8px 0;
    }
    .el-collapse-item__header {
		display: inline-block;
		border-bottom: none;
		position: relative;
		padding: 7px 0;
    font-size: 14px;
		color: #333;
		&::after {
			left: 0;
			bottom: 0;
			// width: 968px;
			height: 1px;
			content: '';
			position: absolute;
			background-color: #ebeef5;
			z-index: 1
		}
    }
    .el-collapse-item__wrap {
		border: none;
		padding-top: 24px;
	}
}
</style>
