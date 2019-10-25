import Print from './printarea.js';
/**
 * @file 打印
 * 指令`v-print`,默认打印整个窗口
 * 传入参数`v-print="'#id'"` , 参数为需要打印局部的盒子标识.
 */
let closeBtn = true;
let options = {
  endCallback () {
    closeBtn = true;
  }
};
const validateType = (expectedTypes, gotType) => {
  console.error(
    '[Print warn]: Invalid prop: type check failed for prop "print".Expected ' +
      expectedTypes.join(', ') +
      ', got ' +
      gotType +
      '.'
  );
  return false;
};
const print = (el, binding, vnode) => {
  let gotType = Object.prototype.toString.call(binding.value).slice(8, -1);
  switch (binding.rawName) {
    case 'v-print:onStart':
      if (gotType === 'Function') {
        options.startCallback = binding.value;
      } else {
        return validateType(['Function'], gotType);
      }
      break;

    case 'v-print:onEnd':
      if (gotType === 'Function') {
        options.endCallback = () => {
          closeBtn = true;
          binding.value.endCallback();
        };
      } else {
        return validateType(['Function'], gotType);
      }
      break;

    default:
      if (gotType === 'String') {
        options.el = binding.value;
      } else {
        return validateType(['String'], gotType);
      }
      break;
  }
};

export default {
  directiveName: 'print',
  bind (el, binding, vnode) {
    let vue = vnode.context;
    let reval = print(el, binding, vnode);
    if (binding.rawName === 'v-print') {
      el.addEventListener('click', event => {
        if (options.el) {
          localPrint();
        } else {
          window.print();
        }
      });
    }
    const localPrint = () => {
      vue.$nextTick(() => {
        if (closeBtn) {
          closeBtn = false;
          let print = new Print(options);
        }
      });
    };
  },

  update (el, binding, vnode) {
    print(el, binding, vnode);
    closeBtn = true;
  },

  unbind (el) {}
};
