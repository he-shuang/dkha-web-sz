const Service = require('node-windows').Service;
// 配置windows自启动
let svc = new Service({
    name: 'node_com_application',
    description: '工牌信息读取服务',
    script: './index.js',
    wait: '1',
    grow: '0.25',
    maxRestarts: '40'
});
svc.on("install", () => {
    svc.start();
    console.log('读卡服务，安装成功！')
})
svc.on("uninstall", () => {
    console.log('读卡服务，卸载成功！')
    console.log('The service exists:', svc.exists)
        // 卸载后 重新安装
    svc.install();
})
svc.on("alreadyinstalled", () => {
    console.log('读卡服务，正在运行!')
})
if (svc.exists) {
    return svc.uninstall();
}
svc.install();