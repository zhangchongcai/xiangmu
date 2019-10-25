(function () {
  /**
   * @function distributeMessage - 此方法挂载在window上，用于发消息存储和分发
   */
  function distributeMessage () {
    /**
     *  @member {Object} value - 用于消息存储
     */
    this.value = {};
  }

  /**
   * @fires distributeMessage#addMessage - 往value上存储消息
   * @param {object} messageObj - 入参对象参数介绍  name: 消息名称；fn: 对应执行方法；
   * @param {string} messageObj.name - 消息名称，用于配对对应的fn执行方法
   * @param {function} messageObj.fn - 执行方法
   */
  distributeMessage.prototype.addMessage = function (messageObj) {
    let value = this.value;
    let name = messageObj.name;
    let fn = messageObj.fn;

    // 校验是否存在
    let isExist = false;
    if (value[`${name}`]) {
      isExist = true;
    }

    if (!isExist) {
      value[`${name}`] = fn;
    } else {
      console.log('已经在distributeMessage注册事件：', messageObj.name);
    }
  };

  /**
   * @fires distributeMessage#removeMessage - 移除value上已存储的消息
   * @param {String} messageName - 移除消息对应的名称
   */
  distributeMessage.prototype.removeMessage = function (messageName) {
    let value = this.value;
    // 校验该消息是否存在
    let isExist = false;
    if (value[`${messageName}`]) {
      isExist = true;
    }

    if (isExist) {
      try {
        delete value[`${messageName}`];
      } catch (err) {
        console.log(messageName + '在distributeMessage无法删除！');
      }
    } else {
      console.log(messageName + '在distributeMessage中不存在，无需删除！');
    }
  };

  /**
   * @fires distributeMessage#emitMessageFn - 调用存储在value数组上传入消息名称的方法
   * @param {string} messageName - 消息名称
   */
  distributeMessage.prototype.emitMessageFn = function (messageName, param) {
    let value = this.value;
    // 校验是否存在
    let isExist = false;
    if (value[`${messageName}`]) {
      isExist = true;
    }

    if (isExist) {
      try {
        value[`${messageName}`](param);
      } catch (err) {
        console.log('distributeMessage在emitMessageFn中发生错误：' + err);
      }
    } else {
      console.log('该事件不存在:', messageName);
    }
  };

  /**
   * @fires distributeMessage#callBackFn - 触发回调链
   * @param {object} data - 回传消息返回内容
   * @param {true} data.isAlertCallBack  - 用于校验是否为弹窗回调，必填，true
   * @param {string} data.callFnName - 用于配对value上的消息明，执行对应的fn
   * @param {object} data.data - 此为弹窗返回的数据
   */
  distributeMessage.prototype.callBackFn = function (data) {
    let param = data.data;

    // 确定是否为弹窗回调方法
    if (!param.isAlertCallBack) return;

    let msgName = param.callFnName;

    window.distributeMessage.emitMessageFn(msgName, param);
  };

  window.distributeMessage = new distributeMessage();

  window.addEventListener('message', window.distributeMessage.callBackFn);
})();
