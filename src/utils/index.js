import Cookies from 'js-cookie'
import store from '@/store'
import http from '@/utils/request'

/**
 * 权限
 * @param {*} key
 */
export function hasPermission(key) {
    return window.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false
}

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export function getDictDataList(dictType) {
    const type = store.state.dictType.find((element) => (element.dictType === dictType))
    if (type) {
        return type.dataList
    } else {
        return []
    }
}

export function getDictDataListAll() {
    http.get('/sys/dict/type/all').then(({ data: res }) => {
        if (res.code !== 0) {
            return
        }
        window.SITE_CONFIG['dictList'] = res.data
        store.commit("setDictList", res.data)
    })

}

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export function getDictLabel(dictType, dictValue) {
    const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
    if (type) {
        const val = type.dataList.find((element) => (element.dictValue === dictValue + ''))
        if (val) {
            return val.dictLabel
        } else {
            return dictValue
        }
    } else {
        return dictValue
    }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
    store.commit('resetStore')
    Cookies.remove('access_token')
    Cookies.remove('token')
    window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false
}

/**
 * 获取uuid
 */
export function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList() {
    var res = []
    document.querySelectorAll('svg symbol').forEach(item => {
        res.push(item.id)
    })
    return res
}

/**
 * 树形数据转换 temp[data[k][pid]]['disabled']=true
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslateDis(data, id = 'id', pid = 'pid') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
            res.push(data[k])
            continue
        }
        if (!temp[data[k][pid]]['children']) {
            temp[data[k][pid]]['children'] = [];
            temp[data[k][pid]]['disabled'] = true
        }
        temp[data[k][pid]]['children'].push(data[k])
        data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1;
    }
    return res
}

/**
 * 树形数据转换 
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'pid') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
            res.push(data[k])
            continue
        }
        if (!temp[data[k][pid]]['children']) {
            temp[data[k][pid]]['children'] = [];

        }
        temp[data[k][pid]]['children'].push(data[k])
        data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1;
    }
    return res
}

/**
 * 双击复制 文本
 * 表格头部 @cell-dblclick="$cellDbclick"
 * 列  column-key="copy"
 */
import ClipboardJS from 'clipboard';
import { Message } from 'element-ui';
export function cellDbclick(row, column, cell, event) {
    if (column.columnKey == 'copy') {
        let clipboard = new ClipboardJS(cell, {
            text: (trigger) => {
                return cell.innerText
            }
        });
        //触发 复制事件
        clipboard.onClick(event);
        Message.success('复制成功');
        //销毁 释放内存
        clipboard.destroy();
    }
}

/**
 * 
 * 获取行政区域数据(带人员权限)
 * value:'id',label:'name'
 */
export function getPersonRegion() {
    http.get('/sys/region/tree').then(({
        data: res
    }) => {
        if (res.code !== 0) {
            return this.$message.error(res.msg)
        }
        let dataOp = treeDataTranslate(res.data);
        window.SITE_CONFIG['personRegionList'] = dataOp
        store.commit("setPersonRegionList", dataOp)
    }).catch(() => {})
}