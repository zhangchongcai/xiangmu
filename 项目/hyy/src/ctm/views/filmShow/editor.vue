  <template>
    <div class="cinemaList">
      <div class="searchAdition">
        <p class="div_title"><i class="el-icon-arrow-down">基础设置</i></p>
        <el-form size="small" label-width="100px" v-model="displayTemplateVo">
          <el-form-item label="模板风格:">
            <el-radio v-model="displayTemplateVo.backgroundColor" label="balckBgc">TV黑</el-radio>
            <el-radio v-model="displayTemplateVo.backgroundColor" label="redBgc">TV红</el-radio>
            <el-radio v-model="displayTemplateVo.backgroundColor" label="blueBgc">TV蓝</el-radio>
            <el-radio v-model="displayTemplateVo.backgroundColor" label="greenBgc">TV绿</el-radio>
          </el-form-item>
          <el-form-item label="字体大小:">
            <el-radio-group v-model="displayTemplateVo.noticeTextSize">
              <el-radio label="2">小号</el-radio>
              <el-radio label="6">中号</el-radio>
              <el-radio label="9">大号</el-radio>
              <el-radio label="12">超大号</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row style="height:48px;">
            <el-col :span="16">
              <el-form-item label="页面轮播速度:">
                <el-input v-model="displayTemplateVo.playSpeed" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="height:48px;">
            <el-col :span="16">
              <el-form-item label="每页显示行数:">
                <el-input v-model="displayTemplateVo.pageSize" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="要显示的字段:">
            <el-checkbox-group v-model="displayTemplateVo.columnList">
              <el-checkbox v-for="item in cities" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-row style="height:40px;">
            <el-col :span="8">
              <el-form-item label="票价使用:">
                <el-select v-model="displayTemplateVo.memberTicket" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="会员价使用:">
                <el-select v-model="displayTemplateVo.nonMemberTicket" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
      <!-- 图片管理 -->
      <div class="table_div" v-if="false">
        <p class="div_title">
          <i class="el-icon-arrow-down">图片管理（轮播图片）</i>
        </p>
        <!-- <p>轮播图片</p> -->
        <p class="p_photo">
          <el-upload class="upload-demo" :http-request="ossUpdata" action list-type="text" :file-list="fileList"
            :before-upload="beforeAvatarUpload">
            <el-button plain type="primary">添加</el-button>
          </el-upload>
          <el-button plain class="title_btn" type="primary" @click.stop="deleteThat()">删除</el-button>
        </p>
        <el-table :data="fileList" style="width: 100%" @select="selectPhoto">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="缩略图">
            <template slot-scope="{row}">
              <div style="padding:20px;">
                <img :src="row.url" alt="" style="height:220px;width:95%">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="picName" label="图片名称">
          </el-table-column>
          <el-table-column prop="updateTime" label="保存时间">
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="row">
              <el-button type="text" size="small" @click.stop="upThis(row.row,row.$index)" v-if="row.$index!=0">上移
              </el-button>
              <el-button type="text" size="small" @click.stop="downThis(row.row,row.$index)" v-if="row.$index!=fileList.length-1">
                下移
              </el-button>
              <el-button type="text" size="small" @click.stop="deleteThis(row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
       
      </div>

      <!-- 文字公共 -->
      <div>
         <!-- <p class="div_title"><i class="el-icon-arrow-down">基础设置</i></p> -->
         <p class="div_title">
          <i class="el-icon-arrow-down">文字公告</i>
        </p>
        <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="displayTemplateVo.notice">
        </el-input>
      </div>
      <!-- 底部 -->
      <div style="height:80px;background:transparent;"></div>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="$router.push('manageList')">取消</el-button>
        </div>
      </div>
    </div>
  </template>
  <script type="text/javascript">
    const columnList = [{
        label: '票价',
        value: 'nonMemberTicket'
      }, {
        label: '会员价',
        value: 'memberTicket'
      },
      {
        label: '影厅名称',
        value: 'hallName'
      }, {
        label: ' 总座位数',
        value: 'seatNum'
      },
      {
        label: '剩余座位数',
        value: 'leftSeatNum'
      }, {
        label: '影片名称',
        value: 'movieName'
      },
      {
        label: '时长',
        value: 'timeLong'
      }
    ]
    export default {
      data() {
        return {
          displayTemplateVo: { // 模板属性参数
            backgroundColor: '', //模板背景颜色
            noticeTextSize: '',
            columnList: [],
          },
          checkedCities: ['上海', '北京'],
          cities: columnList,
          options: [{
            value: 'qwewqew',
            label: '成人票'
          }, {
            value: 'qweq',
            label: '团体票'
          }, {
            value: '选项3',
            label: '学生票'
          }],
          value: '',
          url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          fileList: [], // 照片列表
          chooseList: [], // 选择的照片列表
          // loading: false
        }
      },
      methods: {
        ossUpdata(content) { // 图片上传
          console.log(content)
          const loading = this.$loading({
            lock: true,
            text: '图片上传中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let paramsImg = new FormData();
          paramsImg.append('file', content.file); //传文件
          paramsImg.append('moduleName', "plan_display");
          console.log(paramsImg)
          this.$ctmList.ossUpdata(paramsImg).then(res => {
            if (res.code === 200 && res.data) {
              this.fileList.unshift({
                cinemaUid: this.$route.query.cinemaUid,
                url: res.data,
                picName: content.file.name,
                picType: 1,
                seq: 1,
                tCode: this.$route.query.templateCode,
                tcode: this.$route.query.templateCode,
              })
              this.savePhoto(res.data, content.file.name)
              setTimeout(() => {
                loading.close();
                this.$message('图片上传成功')
              }, 1000);
              // this.getPhoto()
              console.log(this.fileList)
            } else {
              this.error(res.msg);
            }
          })
        },
        beforeAvatarUpload(file) { // oss上传图片的限制
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error('上传影院LOGO大小不能超过 2MB!');
          }
          return isLt2M;
        },
        save() { // 保存设置
          const loading = this.$loading({
            lock: true,
            text: '保存中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.fileList.forEach((item, index) => {
            item.seq = index + 1
          })
          this.$ctmList.saveSwiperSet(Object.assign({}, {
            displayTemplateVo: this.displayTemplateVo
          }, {
            advertisePicList: this.fileList
          })).then(res => {
            console.log(res)
            if (res.code === 200 && res.msg) {
              this.getList()
              this.getPhoto()
              setTimeout(() => {
                loading.close();
                this.$message('保存成功')
              }, 1000);
            } else {
              this.error(res.msg);
            }
          })
        },
        savePhoto(url, picName) { // 保存图片信息到数据库
          let httpObj = {
            cinemaUid: this.$route.query.cinemaUid,
            picType: 1,
            tCode: this.$route.query.templateCode,
            url,
            picName
          }
          this.$ctmList.savePhoto(Object.assign({}, httpObj)).then(res => {
            console.log(res)
            if (res.code === 200 && res.data) {
              this.getPhoto()
            } else {
              this.error(res.msg);
            }
          })
        },
        getList() { // 初始设置
          let httpObj = {
            templateCode: this.$route.query.templateCode,
            cinemaUid: this.$route.query.cinemaUid
          }
          this.$ctmList.getSwiperSet(Object.assign({}, httpObj)).then(res => {
            console.log(res)
            if (res.code === 200 && res.data) {
              this.displayTemplateVo = res.data.displayTemplates
              console.log(this.displayTemplateVo)
            } else {
              this.error(res.msg);
            }
          })
        },
        getPhoto() { // 图片初始设置
          let httpObj = {
            templateCode: this.$route.query.templateCode,
            cinemaUid: this.$route.query.cinemaUid
          }
          this.$ctmList.getPhotoList(Object.assign({}, httpObj)).then(res => {
            console.log(res)
            if (res.code === 200 && res.data) {
              this.fileList = res.data
            } else {
              this.error(res.msg);
            }
          })
        },
        selectPhoto(selection) { // 选择图片
          console.log(selection)
          selection.forEach(item => {
            if (item.id) {
              this.chooseList.unshift(item.id)
            } else {

            }
          })
        },
        deletePhoto(httpObj) { // 删除图片
          console.log(httpObj)
          if (!httpObj.length) {
            this.$message('请先选择要删除的图片')
            return;
          }
          this.$ctmList.deletePhoto(httpObj).then(res => {
            if (res.code === 200 && res.data) {
              this.$message(res.msg)
              this.getPhoto()
            } else {
              this.error(res.msg);
            }
          })
        },
        deleteThat() { // 删除多张图片
          // console.log(this.chooseList)
          // if()
          this.deletePhoto(this.chooseList)
        },
        deleteThis(row) { // 删除该图片
          console.log(row)
          if (row.id) {
            this.deletePhoto([row.id])
          } else {
            this.$message("操作成功")
            this.fileList.splice(row.$index, 1)
          }
        },
        upThis(row, index) { // 上移
          console.log(row, index)
          if (index > 0) {
            let upDate = this.fileList[index - 1];
            this.fileList.splice(index - 1, 1);
            this.fileList.splice(index, 0, upDate);
          }
        },
        downThis(row, index) { // 下移
          if ((index + 1) === this.fileList.length) {
            alert('已经是最后一条，不可下移');
          } else {
            let downDate = this.fileList[index + 1];
            this.fileList.splice(index + 1, 1);
            this.fileList.splice(index, 0, downDate);
          }
        }
      },
      created() {
        this.getList();
        this.getPhoto()
      },
      watch: {
        '$route.query.saleBillFlowUid': function () {
          this.getDetail()
        }
      }
    };
  </script>
  <style lang="scss" scoped>
    //  提示信息
    .el-button--primary {
      width: 80px;
      padding: 8px;
    }

    /deep/ .el-upload-list {
      display: none;
    }

    .el-form {
      box-sizing: border-box;
      overflow: hidden;

      .el-row {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }

    /deep/ cell img {
      width: 100%;
      height: 220px;
    }

    .messageWord {
      word-break: break-all;
    }

    .can_click {
      margin-right: 10px;
      cursor: pointer;
      color: #3b74ff;
    }

    // title 
    .table_div,
    .searchAdition {
      margin-bottom: 20px;
    }

    .title_btn {
      padding: 8px 12px;
      float: right;
      margin-left: 12px;
      // width: 88px;
      height: 32px;

      span {
        font-size: 12px;
      }
    }

    .div_title {
      padding: 1em;
      line-height: 32px;

      &::after {
        content: '';
        display: block;
        clear: both;
      }

      &::before {
        // content: '';
        display: inline-block;
        width: 2px;
        height: 10px;
        background-color: rgb(25, 40, 80);
        margin-right: 10px;
      }

      // border-left: 2px rgb(25, 40, 80) solid;
      .el-icon-arrow-down:before {
        margin-right: 5px;
      }
    }

    // 基础信息
    .el-form-item__label,
    .el-form-item__content span {
      font-size: 12px;
    }

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }

    // 设置表单增删的长度
    .content {
      .like_ul {
        padding: 8px 8px 0;
      }

      .el-form-item {
        margin: 0;
      }
    }

    //设置折叠框箭头和位置
    .el-collapse-item__arrow {
      margin: 0 8px 0;
      // transform: rotate(-90deg);
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
        width: 968px;
        height: 1px;
        content: "";
        position: absolute;
        background-color: #ebeef5;
        z-index: 1;
      }
    }

    // 清除.el-form-item的长度限制
    .el-form-item {
      width: auto;
    }

    //时间选择器样式
    .el-date-editor .el-range-separator {
      line-height: 24px;
    }

    .el-date-editor .el-range__icon {
      line-height: 24px;
    }

    .el-date-editor--daterange.el-input__inner {
      width: 256px;
    }

    .el-date-table td span {
      border-radius: 0;
    }

    .like-lable {
      color: #606266;
      padding: 0 12px 0 0;
      width: 100px;
      box-sizing: border-box;
      white-space: nowrap;
      text-align: right;
    }

    .search-time {
      display: flex;
    }

    .el-input--suffix {
      width: 177px;
    }

    .search-btn {
      margin-left: 30px;
    }

    .div_photo {
      // 图片上传提示语
      display: flex;
      align-items: flex-start;
      padding: 1em;

      .photo_name {
        font-size: 16px;
        line-height: 24px;
        margin: 0 12px;
      }

      img {
        margin: 0 12px;
      }
    }

    .p_photo {
      display: flex;
      justify-content: flex-end;
    }

    .bottom-handler-tool {
      // 底部
      height: 64px;
      width: 100%;
      // position: fixed;
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
  </style>