let WebSocketServer = new require('ws').Server;
let webSocketServer = new WebSocketServer({port: 5002});  //Используем сущность которую создали на основании библиоткеи
var clients = {};

let rooms = [ {roomName: 'default', users: [], offlineUsers: []}];


webSocketServer.on('connection', function (ws) {
    var id = Math.random();
        clients[id] = ws;


    ws.on('message', function (message) {

        message = JSON.parse(message);

        if (message.type === 'newUser') {
            rooms[0].users.push(message.name);
            message.usersInRoom = rooms[0].users;

        }else if (message.type === 'сreateRoom') {
            let temp = {roomName: message.nameRoom, users: [message.users]};
                rooms.push(temp);

        } else if (message.type === 'changeRoom') {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].roomName === message.roomName) {
                        message.room = rooms[i];
                }
            }
        }

        for (var key in clients) {
            clients[key].send(JSON.stringify(message));
            clients[key].name = message.name;//евое
        }



        ws.on('close', function q() {
            for (var key in clients) {


                    for(let j = 0; j < rooms.length; j++){
                        for(let i = 0; i < rooms[j].users.length; i++){
                           if(rooms[j].users[i] === clients[key].name){
                               //console.log('ВОТ ОН БЛ' + rooms[j].users[i]);
                               rooms[j].users.splice(i, 1);
                               console.log(rooms[j].users);
                               clients[key].send(JSON.stringify({type: 'leaveUser', usersInRoom: rooms[j].users}));
                           }
                    }}


            }
        });//


    });
});
