import { hasPermission } from '@/utils'
export default {
    data() {
        return {
            visitorWebsocketCount: 0
        }
    },
    created() {
        this.visitorWebsocketCount = 0;
        // 访客信息录入权限  
        if (this.$store.state.user.name != 'admin' && hasPermission('sys:visitor:webscoket')) {
            this.iinitVisitorWebsocket()
        }
    },
    methods: {
        iinitVisitorWebsocket() {
            let _this = this;
            // let currentId = '';
            // let currentTime = new Date().getTime() - 1000 * 30;
            // 尝试建立websocket连接
            try {
                let visitor_websockt = new WebSocket(window.GLOBAL_CONFIG['VISITOR_SOCKET_URL']);
                // 监听socket连接
                visitor_websockt.onopen = () => {
                    console.log("websocket连接成功");
                };
                visitor_websockt.onclose = () => {
                    console.log("websocket连接已关闭");
                };
                visitor_websockt.onerror = () => {
                    console.log("websocket连接失败");
                };
                visitor_websockt.onmessage = res => {
                    let data = JSON.parse(res.data);
                    // let timeEnd = new Date().getTime();
                    _this.$store.commit('visitor/UPDATE_VISITOR', data.msg)
                        // if (data.msg != currentId) {
                        //     currentId = data.msg;
                        //     currentTime = new Date().getTime();
                        //     _this.$store.commit('visitor/UPDATE_VISITOR', data.msg)
                        // } else if (timeEnd - currentTime > 1000 * 30) {
                        //     currentId = data.msg;
                        //     currentTime = new Date().getTime();
                        //     _this.$store.commit('visitor/UPDATE_VISITOR', data.msg)
                        // }
                };

                // 关闭webscoket连接
                _this.$once("hook:beforeDestroy", () => {
                    visitor_websockt.close();
                });
                // 关闭或刷新浏览器 结束websocket连接
                window.addEventListener("beforeunload", () => {
                    visitor_websockt.close();
                });
            } catch (error) {
                console.error('链接websocket失败：', error);
                _this.visitorWebsocketCount++;
                // 失败建立连接 五次内失败  尝试重新连接
                if (_this.visitorWebsocketCount < 5) {
                    _this.iinitVisitorWebsocket();
                } else {
                    _this.$confirm('建立websocket连接失败，访客信息无法直接录入！是否重试?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.visitorWebsocketCount = 0;
                        _this.iinitVisitorWebsocket();
                    }).catch(() => {

                    })
                }
            }
        }
    },
}