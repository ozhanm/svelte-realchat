const port = 3000;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send('İstek geldi.');
});

io.on("connection", (socket) => {
    // Update Room Liste
    socket.on("client_updateRooms", (data) => {
        socket.broadcast.emit("client_updateRooms", data);
        socket.emit("client_updateRooms", data);
        console.log('Oda listesi güncellendi.');
    });

    // Update Message List
    socket.on("client_updateMessages", (data) => {
        socket.broadcast.emit("server_updateMessages", data);
        socket.emit("server_updateMessages", data);
        console.log('Mesaj listesi güncellendi.');
    });

    // Add new massage
    socket.on("client_newMessage", (data) => {
        socket.broadcast.emit("server_newMessage", data);
        socket.emit("server_newMessage", data);
        console.log('Yeni mesaj geldi.');
    });
});

http.listen(port, () => {
    console.log('Server çalışmaya başladı.');
});