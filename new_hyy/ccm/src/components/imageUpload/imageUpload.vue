<template>
  <div>
    <div class="imageUploadWarpArea">
      <div class="imageUploadContent">
        <div class="uploadBtnClick" v-show="imgUrl==''">
          <input type="file" accept="image/png,image/gif,image/jpg,image/jpge" @change="uploadImageInfor($event)" />
          <i class="el-icon-plus"></i>
          <p>GIF、PNG、JPG格式，2MB以内</p>
        </div>
        <div class="hasUploadedImg" v-show="imgUrl != ''">
          <img :src="imgUrl" width="100%" />
          <div class="uploadedMask"></div>
          <div class="uploadedOpear">
            <i class="el-icon-search" @click="dialogVisible=!dialogVisible"></i>
            <i class="el-icon-delete" @click="deleteUploadedImg"></i>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <div>
        <img :src="imgUrl" style="display:block;margin:0px auto;" />
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    value: {
      type: String,
      default: '',
      required: false  // 验证是否从父组件传递值过来
    }
  },
  watch: {
    'value': function () {
      this.imgUrl = this.value;
    }
  },
  data () {
    return {
      dialogVisible: false,
      imgUrl: this.value
    };
  },
  created () {

  },
  methods: {
    keybordEnterClick () { // 回车
      this.$emit('input', this.modelValue);
      this.$emit('enterClick');
    },
    searchIconClick () {	// 点击搜索
      this.$emit('input', this.modelValue);
      this.$emit('click');
    },
    keyupInputEvent () {
      this.$emit('input', this.modelValue);
    },
    uploadImageInfor (e) {
      console.log(e.target.files[0]);
      if (e.target.files[0]) {
        let _this = this;
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('module', 'images');
        _this.$ccmList.fileUplaodDoc(formData).then(ret => {
          _this.imgUrl = ret.path;
          _this.$emit('input', _this.imgUrl);
        }).catch(() => { });
      }
    },
    deleteUploadedImg () {
      this.imgUrl = '';
      this.$emit('input', '');
    }
  }
};
</script>
<style lang="scss" scoped>
div.imageUploadWarpArea {
  width: 278px;
  height: 178px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding: 10px;
  div.imageUploadContent {
    width: 278px;
    height: 178px;
    border: 1px dashed #dcdfe6;
    overflow: hidden;
    div.uploadBtnClick {
      width: 278px;
      height: 178px;
      text-align: center;
      //    line-height: 178px;
      position: relative;
      input[type="file"] {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      i.el-icon-plus {
        font-size: 50px;
        color: #ccc;
        font-weight: normal;
        padding-top: 40px;
      }
      p {
        margin-top: 15px;
        color: #666;
      }
    }
    div.hasUploadedImg {
      width: 100%;
      height: 100%;
      position: relative;
      > img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
      > div.uploadedOpear {
        display: none;
        width: 100%;
        height: 100%;
        position: absolute;
        justify-content: center;
        align-items: center;
        left: 0px;
        top: 0px;
        z-index: 100;
        text-align: center;
        i {
          font-size: 30px;
          color: #fff;
        }
        i.el-icon-search {
          margin-right: 20px;
        }
      }
      > div.uploadedMask {
        display: none;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        background: #000;
        opacity: 0.5;
        z-index: 40;
      }
    }
    div.hasUploadedImg:hover {
      > div.uploadedOpear {
        display: flex;
        cursor: pointer;
      }
      > div.uploadedMask {
        display: block;
      }
    }
  }
}
</style>
