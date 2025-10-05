// import { WebSocketServer,WebSocket } from "ws";

// const wss = new WebSocketServer({ port: 8080 });

// interface User {
//     socket: WebSocket;
//     room: string;
//     clientId: string;
// }
// let allSockets: User[] = [];

// wss.on("connection", (socket) => {

//     //will work when someone send the message
//     socket.on("message", (message) => {
//         // allSockets.push(socket)

//         // for(let i=0; i < allSockets.length; i++) {
//         //     const s:any = allSockets[i];
//         //     s.send(message.toString() + "sent from the server")
//         // }

//         // Here parse is used to convert the string into an object
//         const parsedMessage = JSON.parse(message as any);
//         if(parsedMessage.type == "join"){
//             console.log("user joined the room")
//              allSockets.push({
//                  socket,
//                  room: parsedMessage.payload.roomId,
//                  clientId: parsedMessage.payload.clientId
//              })
//         } 

//        if (parsedMessage.type == "chat") {
//   let currentUserRoom = null;

//   for (let i = 0; i < allSockets.length; i++) {
//     if (allSockets[i]?.socket == socket) {
//       currentUserRoom = allSockets[i]?.room;
//     }
//   }

//   for (let i = 0; i < allSockets.length; i++) {
//     if (allSockets[i]?.room == currentUserRoom) {
//       allSockets[i]?.socket.send(
//         JSON.stringify({
//           message: parsedMessage.payload.message,
//           clientId: parsedMessage.payload.clientId,
//         })
//       );
//     }
//   }
// }
//     })

//     socket.on("disconnect", () => {
//          allSockets = allSockets.filter((x:any) => x != socket)
//     })

//     socket.on('message', (msg) => {
//   if (msg.senderId !== currentUser.id) {
//     messages.push({ text: msg.text, sender: 'other' });
//   }
// });
// })

import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  clientId: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    // Handle user joining a room
    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
        clientId: parsedMessage.payload.clientId,
      });
      console.log("User joined the room", parsedMessage.payload.clientId);
    }

    // Handle chat messages
    if (parsedMessage.type === "chat") {
      const senderId = parsedMessage.payload.clientId;

      // Find sender's room
      const senderUser = allSockets.find((u) => u.socket === socket);
      if (!senderUser) return;

      const currentRoom = senderUser.room;

      // Send to all users in the same room
      allSockets.forEach((u) => {
        u.socket.send(
          JSON.stringify({
            message: parsedMessage.payload.message,
            clientId: senderId,
          })
        );
      });
    }
  });

  socket.on("close", () => {
    // Remove disconnected socket
    allSockets = allSockets.filter((u) => u.socket !== socket);
  });
});
