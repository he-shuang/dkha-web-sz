import store from '@/store'
import Vue from 'vue'

function checkPermission(el, binding) {
    const { value } = binding
    const roles = store.getters && store.getters.roles

    if (value && value instanceof Array) {
        if (value.length > 0) {
            const permissionRoles = value

            const hasPermission = roles.some(role => {
                return permissionRoles.includes(role)
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    } else {
        throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
}

/* 
  @title 全局 双击 复制
  @des   使用  v-copy 绑定元素  双击元素  复制元素文本内容
*/

Vue.directive('permission', {
    inserted(el, binding) {
        checkPermission(el, binding)
    },
    update(el, binding) {
        checkPermission(el, binding)
    }
})