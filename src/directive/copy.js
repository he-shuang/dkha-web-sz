import ClipboardJS from 'clipboard';
import { Message } from 'element-ui'
import Vue from 'vue'

/* 
  @title 全局 双击 复制
  @des   使用  v-copy 绑定元素  双击元素  复制元素文本内容
*/

Vue.directive('copy',{
    bind: (el, binding, vnode, oldVnode) => {
        //ondblclick 事件会在对象被双击时发生。
        el.ondblclick=(event)=>{
            let clipboard = new ClipboardJS(el,{
                text:(trigger)=>{
                  return el.innerText
                }
              });
            //触发 复制事件
            clipboard.onClick(event);
            Message.success('复制成功');
            //销毁 释放内存
            clipboard.destroy();
        }
    }
})