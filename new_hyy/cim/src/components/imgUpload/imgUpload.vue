<template>
  <div id="img-upload">
    <el-upload class="avatar-uploader" ref="upload" :action="uploadHttpConfig" :headers="uploadHeaders" :before-upload="beforeAvatarUpload" :on-success="successAvatarUpload" :file-list="fileList" :data="reqData">
      <div v-if="queryData.imgUrl && isImg">
        <img v-if="isImg" :src="queryData.imgUrl" class="avatar">
      </div>
      <div v-else>
        <i v-if="type == 'img'" class="el-icon-plus  avatar-uploader-icon"></i>
        <i v-else class="el-icon-plus accessory"> 添加附件</i>
      </div>
      <div class="el-upload__tip" slot="tip" v-if="type == 'img'">(请上传500kb以内的JPG/PNG文件，建议图片规格：150*150px)</div>
      <div class="el-upload__tip" slot="tip" v-if="(type == 'accessory') && queryData.imgUrl && queryData.name">
        <a target="_Blank" :href="queryData.imgUrl" :download="queryData.name">
          <span>点击下载: </span>
          <span class="download">{{queryData.name}}</span>
        </a>
        <i class="el-icon-close img-del" @click="handleDel"></i>
      </div>
    </el-upload>
  </div>
</template>
<script>
// import httpConfig from 'cim/http/config.js';

export default {
  props: {
    // 上传类型 img：图片 accessory：附件
    type: {
      type: String,
      default: 'img',
      required: false
    },
    url: {
      type: String,
      default: '',
      required: false
    },
    fileName: {
      type: String,
      default: '',
      required: false
    }
  },
  created () {
    this.isImgFile({ name: this.fileName });
  },
  data () {
    return {
      queryData: {
        imgUrl: '',
        name: ''
      },
      isImg: true,
      fileList: []
    };
  },
  watch: {
    url () {
      this.queryData.imgUrl = this.url;
      console.log(this.queryData.imgUrl, 'ur11l');
      // this.fileList = [{name:this.fileName,url:this.url}]
    },
    fileName () {
      this.queryData.name = this.fileName;
      this.isImgFile({ name: this.queryData.name });
    }
  },
  methods: {
    // 图片上传前回调
    beforeAvatarUpload (file) {
      // console.log()
      if (this.type == 'accessory') {
        if (file.size / 1024 / 1024 >= 10) {
          this.$message.error('文件过大，不能超过10M');
          return false;
        }
      } else {
        if (file.size / 1024 >= 500) {
          this.$message.error('文件过大，不能超过500KB');
          return false;
        }
      }
    },
    // 图片上传成功回调
    successAvatarUpload (response, file, fileList) {
      // console.log(response, file, fileList)
      this.isImgFile(file);
      this.queryData.name = file.name;
      this.$refs.upload.clearFiles();
      if (response.code == 200) {
        this.queryData.imgUrl = response.data;
        this.$emit('on-success', this.queryData.imgUrl);
        this.$emit('on-successUpload', { fileUrl: this.queryData.imgUrl, fileName: this.queryData.name });
      } else {
        this.$message.error(response.data.msg);
      }
    },
    isImgFile (file) {
      if (this.type == 'img') {
        this.isImg = true;
      } else {
        if (file.name.includes('.png') || file.name.includes('.jpg') || file.name.includes('.jpeg')) {
          this.isImg = true;
        } else {
          this.isImg = false;
        }
      }
    },
    handleDel () {
      this.$emit('on-success', '');
      this.$emit('on-successUpload', { fileUrl: '', fileName: '' });
    }
  },
  computed: {
    uploadHttpConfig () {
      return this.$store.state.default.apiConfig.baseURL + `/cim/upload/goodsImg`;
    },
    uploadHeaders () {
      return { 'Cpm-User-Token': window.sessionStorage.getItem('token') };
    },
    reqData () {
      if (this.type == 'accessory') {
        return { module: 'AGREEMENT' };
      } else {
        return { module: 'goods' };
      }
    }
  }
};
</script>
<style lang="scss">
.accessory {
  padding: 0 10px;
}

#img-upload {
  .img-del {
    margin-left: 10px;
    cursor: pointer;
    color: #f56c6c;
    font-weight: 900;
    font-size: 16px;
  }
  .el-upload__tip {
    color: #999;
  }
}
</style>
