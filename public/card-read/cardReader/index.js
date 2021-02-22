let SerialPort = require('serialport');
let Readline = require('@serialport/parser-readline');
let sp;
var timer;
// 建立webscoket连接
var ws = require('nodejs-websocket');
var server = ws.createServer(function(socket) {
    socket.on('text', function(str) {　　 // 在控制台输出前端传来的消息　　
        console.log(str);
    });
}).listen(3001);
// 打开串口服务
function opensp(oldsp, path, baudRate = 115200) {
    if (typeof oldsp != 'undefined') {
        if (oldsp.isOpen) {
            oldsp.close(function(err) {
                if (err) throw err;
                else {
                    console.log('串口已经关闭');
                    opensp(oldsp, path, (baudRate = 115200));
                }
            });
            return null;
        }
    }

    // 打开串口
    sp = new SerialPort(
        path, {
            baudRate: baudRate,
            autoOpen: false,
        },
        false
    );
    sp.open(function(err) {
        if (err) {
            console.log('串口打开失败: ' + err);
            return null;
        }
        // 清除定时器
        if (timer) {
            console.log('clear in timer')
            clearInterval(timer);
            timer = null;
        }
        const parser = sp.pipe(new Readline());
        parser.on('data', data => {
            // let matchRes = data.match(/UID:(\d*),ZID/);
            // if (matchRes) {
            //     // logger.info('当前读取ID：' + matchRes[1]);
            //     if (!timer) {
            //         timer = setTimeout(() => {
            //             mySocket.sendText(matchRes[1])
            //             console.log(matchRes[1])
            //             timer = null;
            //         }, 1000)
            //     }
            //     return
            // }
            // 匹配信息字段
            if (!data.startsWith("#V10")) {
                return
            }
            let matchRes = data.match(/ID:(\d*)/);
            console.log(matchRes[1])
                // 建立webscoket连接情况下  发送消息
            if (server) {
                server.connections.forEach(socket => {
                    socket.sendText(JSON.stringify({
                        msg: Number(matchRes[1])
                    }))
                })
            }
        });
        console.log('串口打开成功');

    });

    //错误监听
    sp.on('error', function(err) {
        console.log('error: ' + err);
    });
    // 串口连接关闭后的回调   拔插读卡器
    sp.on('close', info => {
        // 每隔1s 尝试重新建立串口连接服务
        timer = setInterval(() => {
            opensp(sp, 'COM3');
        }, 1000);
    })
}

opensp(sp, 'COM3');