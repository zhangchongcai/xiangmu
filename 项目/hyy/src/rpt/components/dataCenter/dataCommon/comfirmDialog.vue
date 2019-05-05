<template>
  <div class="comfirm-dialog">
    <slot name="comfirm-content"></slot>
    <button class="comfirm-button">确定</button>
    <button class="cancel-button">取消</button>
  </div>
</template>

<script>
export default {
  name: "ComfirmDialog"
};
</script>

<style scoped>
.app-container {
  position: relative;
}
.comfirm-dialog {
  position: absolute;
  left: 50%;
  left: 50%;
  margin-top: -160px;
  margin-left: -100px;
  width: 320px;
  height: 200px;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.25);
  border-radius: 4px;
  z-index: 100px;
}
.comfirm-dialog button {
  width: 80px;
  height: 32px;
  font-size: 12px;
  border-radius: 4px;
}
.comfirm-dialog .comfirm-button {
  margin-right: 32px;
  color: white;
  background: #3b74ff;
  border: none;
}

.comfirm-dialog .comfirm-button:hover {
  cursor: pointer;
  background: #0f55ff;
}

.comfirm-dialog .cancel-button {
  color: #666666;
  background: #ffffff;
  border: 1px solid #bcbcbc;
}

.comfirm-dialog .cancel-button:hover {
  cursor: pointer;
  background: #f5f5f5;
}
</style>
