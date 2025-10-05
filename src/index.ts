import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

interface User {
    socket: WebSocket;
    room: string;
}
let allSockets: User[] = [];

wss.on("connection", (socket) => {

    //will work when someone send the message
    socket.on("message", (message) => {
        // allSockets.push(socket)

        // for(let i=0; i < allSockets.length; i++) {
        //     const s:any = allSockets[i];
        //     s.send(message.toString() + "sent from the server")
        // }

        // Here parse is used to convert the string into an object
        const parsedMessage = JSON.parse(message as any);
        if(parsedMessage.type == "join"){
            console.log("user joined the room")
             allSockets.push({
                 socket,
                 room: parsedMessage.payload.roomId
             })
        } 

        if(parsedMessage.type == "chat") {
            console.log("user want to chat")
            let currentUserRoom = null;
            
            for(let i=0; i<allSockets.length; i++) {
                 if(allSockets[i]?.socket == socket) {
                     currentUserRoom = allSockets[i]?.room
                 }
            }

            for(let i=0; i<allSockets.length; i++) {
                if(allSockets[i]?.room == currentUserRoom) {
                     allSockets[i]?.socket.send(parsedMessage.payload.message)
                }
            }
        }
    })

    socket.on("disconnect", () => {
         allSockets = allSockets.filter((x:any) => x != socket)
    })
})