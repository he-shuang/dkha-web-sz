window.GLOBAL_CONFIG = {
	DEV_BASE_URL: "http://127.0.0.1:8080", // 开发环境
	PROD_SIT_BASE_URL: window.location.protocol + '//' + window.location.hostname + ":9080", // 集成测试环境
	PROD_UAT_BASE_URL: window.location.protocol + '//' + window.location.hostname + ":9080", // 验收测试环境
	PROD_BASE_URL: window.location.protocol + '//' + window.location.hostname + ":9080", // 生产环境

	loginUrl: "http://192.168.8.8:8080", //星网云联登录接口地址
	BASE_URL_NGINX: "/sys", //星网云联系统 部署前缀地址
	UWB_WEBSOCKET: "ws://192.168.8.9:9008/position", // 星网云联推送实时楼层人员数量

	socketURL: 'ws://' + window.location.hostname + ':9080/system/ws', // 报警数据（PM2.5）
	VISITOR_SOCKET_URL: "ws://127.0.0.1:3001", //访客登记webscoket地址(Node服务，目前部署在教学楼一楼访客接待大厅前台)

	IMG_SERVER_URL: 'http://192.168.8.3:9000/school/', // 图片前缀（全局使用）

	TEMPERATURE_URL: "http://192.168.10.88:8102/fence/application/school/temperaturePage", // 测温平台地址
}
