"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8000 });
let allSockets = [];
wss.on("connection", (socket) => {
    //will work when someone send the message
    socket.on("message", (message) => {
        // allSockets.push(socket)
        // for(let i=0; i < allSockets.length; i++) {
        //     const s:any = allSockets[i];
        //     s.send(message.toString() + "sent from the server")
        // }
        // Here parse is used to convert the string into an object
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            console.log("user joined the room");
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            console.log("user want to chat");
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i]?.socket == socket) {
                    currentUserRoom = allSockets[i]?.room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i]?.room == currentUserRoom) {
                    allSockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    socket.on("disconnect", () => {
        allSockets = allSockets.filter((x) => x != socket);
    });
});
//# sourceMappingURL=index.js.map