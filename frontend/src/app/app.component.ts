import { Component, OnInit } from '@angular/core';

interface ChatMessage {
  text: string;
  sender: 'me' | 'other';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ws!: WebSocket;
  messages: ChatMessage[] = [];
  messageInput: string = '';
  roomId: string = '';
  joined = false;
  clientId = Math.random().toString(36).substring(2, 8); // unique ID for each user

  ngOnInit() {
  this.ws = new WebSocket('ws://localhost:8000');

  this.ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.clientId !== this.clientId) {
        this.messages.push({ text: data.message, sender: 'other' });
      }
    } catch (e) {
      console.warn('⚠️ Non-JSON message received:', event.data);
      // Optional: show it as a system message if you like
      this.messages.push({ text: event.data, sender: 'other' });
    }
  };
}


  joinRoom() {
    if (this.roomId.trim()) {
      this.ws.send(
        JSON.stringify({
          type: 'join',
          payload: { roomId: this.roomId },
        })
      );
      this.joined = true;
    }
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      // Push locally as "me"
      this.messages.push({ text: this.messageInput, sender: 'me' });

      // Send to WebSocket server
      this.ws.send(
        JSON.stringify({
          type: 'chat',
          payload: {
            message: this.messageInput,
            clientId: this.clientId,
          },
        })
      );

      this.messageInput = '';
    }
  }
}
