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
               class="demo-ruleForm"
            >
        <el-collapse-item
          title="基础信息"
          name="1"
        >
          <div class="basic-info">
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
              <el-form-item label="影片语言：" prop="movieDescLanguage">
                <span class="download-film-scan-text">
                  {{sizeForm.movieDescLanguage}}
                </span>
                 <!-- <el-select
                  v-model="sizeForm.movieDescLanguage"
                  placeholder="请选择语言"
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
                </el-select> -->
              </el-form-item>
              <el-form-item label="发行版本：" prop="disVersion">
                  <span class="download-film-scan-text">
                    {{sizeForm.disVersion}}
                  </span>
              </el-form-item>
              
              <el-form-item label="影片产地：" prop="movieArea">
                 <span class="download-film-scan-text">
                    {{sizeForm.movieArea}}
                  </span>
              </el-form-item>
              <el-form-item label="影片分类：" prop="movieClass">
                <span class="download-film-scan-text">
                    {{sizeForm.movieClass}}
                  </span>
                  <!-- <el-select
                  v-model="sizeForm.movieClass"
                  placeholder="影片分类："
                >
                  <el-option
                    label="故事片"
                    value="故事片"
                  ></el-option>
                  <el-option
                    label="喜剧片"
                    value="喜剧片"
                  ></el-option>
                   <el-option
                    label="爱情片"
                    value="爱情片"
                  ></el-option>

                   <el-option
                    label="动作片"
                    value="动作片"
                  ></el-option>
                   <el-option
                    label="动画片"
                    value="动画片"
                  ></el-option>
                   <el-option
                    label="恐怖片"
                    value="恐怖片"
                  ></el-option>
                   <el-option
                    label="冒险片"
                    value="冒险片"
                  ></el-option>
                   <el-option
                    label="科幻片"
                    value="科幻片"
                  ></el-option>
                   <el-option
                    label="历史片"
                    value="历史片"
                  ></el-option>

                  <el-option
                    label="纪录片"
                    value="纪录片"
                  ></el-option>
                  <el-option
                    label="伦理片"
                    value="伦理片"
                  ></el-option>
                  <el-option
                    label="战争片"
                    value="战争片"
                  ></el-option>
                  <el-option
                    label="惊悚片"
                    value="惊悚片"
                  ></el-option>
                  <el-option
                    label="犯罪片"
                    value="犯罪片"
                  ></el-option>
                  <el-option
                    label="灾难片"
                    value="灾难片"
                  ></el-option>
                  <el-option
                    label="其他"
                    value="其他"
                  ></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="影片英文名：" prop="movieEnglishName">
                <el-input v-model="sizeForm.movieEnglishName"></el-input>
              </el-form-item>
              <el-form-item label="影片别名："  prop="movieOtherName">
                <el-input v-model="sizeForm.movieOtherName"></el-input>
              </el-form-item>
             
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
              <el-form-item label="影片时长：" prop="timeLong">
               <el-input  v-model="sizeForm.timeLong"></el-input>
              </el-form-item>
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
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="详细信息"
          name="2"
        >
          <div class="basic-info">
          
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
              <el-form-item
                label="简介："
                prop="desc"
              >
                <el-input
                  type="textarea"
                  v-model="sizeForm.movieDesc"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="影片图片：">
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img
                    width="100%"
                    :src="dialogImageUrl"
                    alt=""
                  >
                </el-dialog>
              </el-form-item> -->
          </div>
        </el-collapse-item>
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
import FixStepTool from "../../../../../components/fix-step-tool/fix-step-tool"
import fixStepMixin from "../../../../../mixins/CTM/fixStepTool.js"
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
                        name: "详细信息",
                        isactive: false
                    },
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

           movieDesc: [
            { required: true, message: '请输入简介', trigger: 'blur' },
            { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
          ],
         
           movieEnglishName: [
            { required: true, message: '请输入影片英文名', trigger: 'blur' },
            { max:15, message: '长度不超过 15 个字符', trigger: 'blur' }
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
    
    //提交form表单
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        console.log('valid',valid)
          if (valid) {
            let self = this;
            
            // let params = {
            //   movieId:self.sizeForm.movieId,
            //   movieName:self.sizeForm.movieName,
            //   disVersion:self.sizeForm.disVersion,
            //   movieCode:self.sizeForm.movieCode,
            //   movieArea:self.sizeForm.movieArea,
            //   movieClass:self.sizeForm.movieClass,
            //   frameNumber:self.sizeForm.frameNumber,
            //   timeLong:self.sizeForm.timeLong,
            //   dateShowFirst:self.sizeForm.dateShowFirst,
            //   dateShowOff: self.sizeForm.dateShowOff,
            //   filmCaption: self.sizeForm.filmCaption,
            //   movieLevel:self.sizeForm.movieLevel,
            //   publisher:self.sizeForm.publisher,
            //   movieActor:self.sizeForm.movieActor,
            //   movieDirect:self.sizeForm.movieDirect,
            //   movieDesc:self.sizeForm.movieDesc,
            //   movieDescLanguage:self.sizeForm.movieDescLanguage,
            //   movieEnglishName:self.sizeForm.movieEnglishName,
            //   movieOtherName:self.sizeForm.movieOtherName,
            //   movieOtherActor:self.sizeForm.movieOtherActor,
            //   // ********
            //   uid:self.sizeForm.uid,
            //   tenantId:self.sizeForm.tenantId,
            //   delFlag:self.sizeForm.delFlag,
            //   updateTime:self.sizeForm.updateTime,
            //   updateUserName:self.sizeForm.updateUserName,
            //   updateUserUid:self.sizeForm.updateUserUid,
            //   createTime:self.sizeForm.createTime,
            //   createUserName:self.sizeForm.createUserName,
            //   createUserUid:self.sizeForm.createUserUid,
            //   pictureName:self.sizeForm.pictureName,
            //   comment:self.sizeForm.comment,
            //   score:self.sizeForm.score,
            //   pointInformation:self.sizeForm.pointInformation,
            //   movieMaker:self.sizeForm.movieMaker,
            //   datePublicShow:self.sizeForm.datePublicShow,
            // };
                let data = 
                {
                  //分账比列
                schBashMovie:self.sizeForm,
                priceList: self.priceList,
                rateList:self.rateList,

                };
                console.log('data------------------',data)
            self.$api
              .DownloadmovieEdit({jsonData: JSON.stringify(data)})
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
      self.$api
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
  position: relative;
  .film-edit-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .basic-info {
    width: 420px;
    margin-left: 30px;
    .el-form-item__label {
      font-size: 12px;
      text-align: left;
    }
     .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
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
		background-color: #f5f5f5;
		.btn-area {
			width: 500px;
			margin: 0 auto;
			height: 64px;
			text-align: center;
			padding-top: 16px;
			box-sizing: border-box;
		}
	}
  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    margin: 0 8px 0;
    transform: rotate(-90deg);
  }
  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
  }
  .el-collapse-item__wrap {
    border: 1px solid #ffffff;
  }
}
</style>
