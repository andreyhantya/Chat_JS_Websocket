var name = prompt("Как тебя зовут?");
//var log = document.getElementById('log');
var socket = new WebSocket("ws://localhost:5002");
let createRoom = document.getElementById('createNewRoom');
let button = document.getElementById('send');
let input = document.getElementById('text');
let chat = 'default';

socket.onopen = function () {
    console.log('Подключился ');

    socket.send(JSON.stringify({
        type: 'newUser',
        name: name,
    }));


    socket.onmessage = function (event) {
        var json = JSON.parse(event.data);

        if (json.type === 'newUser') {
            showOnlineUsers(json.usersInRoom);
        } else if (json.type === 'sendMessage') {
            showMessage(json.userName, json.text);

        }else if (json.type === 'changeRoom') {
            showOnlineUsers(json.room.users);
        } else if (json.type === 'leaveUser') {
            console.log(json.usersInRoom);
            showOnlineUsers(json.usersInRoom);
        }
    };


    button.onclick = sendMessage = () => {
        socket.send(JSON.stringify({
            type: 'sendMessage',
            userName: name,
            room: chat,
            text: input.value
        }))
    };

    const showMessage = (userName, message) => {
        let p = document.createElement('p');
        let span = document.createElement('span');
        let div = document.querySelector('.activeChat');

        span.appendChild(document.createTextNode(userName + ": "));
        p.appendChild(span);
        p.appendChild(document.createTextNode(message));
        div.appendChild(p);
    };

    //Создание новой комнаты
    createRoom.onclick = createNewRoom = () => {
        let roomName = prompt('Введите название комнаты:');
            let li = document.createElement('li');
            let ul = document.querySelector('.rooms__button');
            let messengerChats = document.querySelector('.messenger__chats');
            let div = document.createElement('div');
            div.classList.add('activeChat', roomName);

            messengerChats.appendChild(div);
            li.classList.add('activeRoom', roomName);
            li.appendChild(document.createTextNode(roomName));
            ul.appendChild(li);
            blockedOldRoom(roomName);
            clickRoom();
            openNewRoom(name);
            chat = roomName;

            socket.send(JSON.stringify({
                type: 'сreateRoom',
                nameRoom: roomName,
                users: name,
            }));
    };

    const clickRoom = () => {
        let rooms = document.querySelectorAll('.rooms__button li');

        for (let i = 0; i < rooms.length; i++) {
            rooms[i].addEventListener('click', (event) => {
                event.target.classList.add('activeRoom');
                blockedOldRoom(event.target.innerText);

                socket.send(JSON.stringify({
                    type: 'changeRoom',
                    roomName: event.target.innerText,
                    userName: name,
                    oldRoom: chat,
                }));

                chat = event.target.innerText;
            })
        }
    };
//Переключение между чатами
    const blockedOldRoom = (roomName) => {
        let li = document.querySelectorAll('.activeRoom');
        let activeChat = document.querySelectorAll('.messenger__chats div');

        for (let i = 0; i < li.length; i++) {
            if (li[i].innerText !== roomName) {
                li[i].classList.remove('activeRoom');
            } else {
                li[i].classList.add('activeRoom', roomName);
            }
        }
//Отключение неактивного чата
        for (let i = 0; i < activeChat.length; i++) {
            if (activeChat[i].classList.contains(roomName)) {
                activeChat[i].classList.remove('noActiveChat');
                activeChat[i].classList.add('activeChat');
            } else {
                activeChat[i].classList.remove('activeChat');
                activeChat[i].classList.add('noActiveChat')
            }
        }
    };

    const showOnlineUsers = (userName) => {
        let div = document.querySelector('.online-users');
        let oldUser = document.querySelectorAll('.online-users p');

        for (let i = 0; i < oldUser.length; i++) {
            oldUser[i].remove();
        }

        for (let i = 0; i < userName.length; i++) {
            let p = document.createElement('p');
                p.appendChild(document.createTextNode(userName[i]));
                p.classList.add('isOnline');
                div.appendChild(p);
        }
    };

//будет заходить массив с именами пользователей и выводиться на страницу
    const showOfflineUsers = (userName) => {
        let isOnline = document.querySelectorAll('.isOnline');

        for (let i = 0; i < userName.length; i++) {
            if (isOnline[i].innerText === userName[i]) {
                isOnline[i].classList.remove('isOnline');
                isOnline[i].classList.add('isOffline');
            }
        }
    };

    const openNewRoom = (nameOwner) => {
        let p = document.querySelectorAll('.online-users p');

        for (let i = 0; i < p.length; i++) {
            if (p[i].innerText !== nameOwner) {
                p[i].remove();
            }
        }
    };
};


