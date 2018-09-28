//引入依赖
var ws = require('nodejs-websocket');


//创建websocket服务
  var server = ws.createServer(function(conn) {
  //提示接入一条新连接
    console.log('New conn');
  //接收发送来的消息
    conn.on('text',function(str) {  
        var data = JSON.parse(str);
        switch (data.type) {
          case 'setname':
            conn.nickname = data.name;
            boardcast(JSON.stringify({
              name: 'Server',
              text: conn.nickname + '加入了房间'
            }));
            break;
          case 'chat':
            boardcast(JSON.stringify({
              name: conn.nickname,
              text: data.text
            }));
            break;
          default:
            break;
        }
    })
  // 连接关闭时触发
    conn.on('close',function(){
      boardcast(JSON.stringify({
        name: 'Server',
        text: conn.nickname + '离开了房间'
      }));
    })
  // 错误处理
    conn.on('error',function(err) {
      console.log(err);
    })
  }).listen(2333);

  /**
   * 服务器广播
   */
  function boardcast(str) {
    server.connections.forEach(conn => {
      conn.sendText(str);
    });
  }