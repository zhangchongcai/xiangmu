import css from './css/index.css'
// import less from './css/less.less'
import scss from './css/index.scss'
document.getElementById('title').innerHTML = 'hello world123'
let adjust = 123;
console.log(adjust)
var font = document.getElementById('font')
font.innerHTML = '<div class="iconfont icon-add_bookmark"></div>heres------<i class="iconfont icon-act_left"></i>"'

/**
 * HMR热模块替换使用方式
 * import number from './numer'
 */
// if(module.hot) {
//     module.hot.accept('./numbr', ()=> {
//         document.body.removeChild(document.getElementById('div'))
//         number()
//     })
// }