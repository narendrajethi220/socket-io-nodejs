What is Socket.IO ⇒ library for WebSocket.
**Bidirectional and low-latency communication for every platform.**
WebSocket - communication protocols like HTTP/FTP/SMTP.

**HTTP** →          Client  Half-Duplex Communication(only one party can communicate at a time, and the server's message is always in response to a request from a client)          Req/Res         Server

**WebSocket** → Client  ↔ Duplex Communication(A duplex communication system is a point-to-point system composed of two or more connected parties or devices that can communicate with one another in both directions simultaneously) ↔  Server

npm install --save express socket.io
when IO ⇒ then its about whole circuit (which contains sockets),
when socket ⇒ it means individual (users) inside circuit, who have their own socket Id

**Some function in Socket.IO**
Emit → This Event(Sending Data) 
ON → (listens Event)This Event(Receiving Data)
Broadcast → except triggering socket to all other socket
To → **to trigger event for particular room i.e.,** user can talk to each other (socket.to(**RoomID(**every socket(user)is in individual room**)**).emit())
Join → To join people (**socket.join(room)**)

**Client**                                          ↔                            **Server
S**ocket.on(Event1,(m)⇒{           |        io.Emit(Event1,”Hi”);  //event in whole circuit , all the user will get 
console.log(m)                           |                                               “Hi” message.
})                                                    |
                                                      |
socket.emit(btn,4)                    |        socket.on(btn,()) //only the targeted or a particular user will 
                                                      |                                            get notified.
                                                      |         socket.broadcast.emit() //except one user who trigger the event
                                                      |                                                       and send to others.
   

**Client:**

```
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, TextField, Typography, Button } from "@mui/material";
const App = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("received-message", (data) => {
      console.log("received-message", data);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("broadcast", (m) => {
      console.log(m);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.IO
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
};

export default App;

```

**Server:**

```
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const app = express();
const cors = require("cors");

const server = createServer(app);
const io = new Server(server, {
  //here io refers to the circuit
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.get("/", (req, res) => {
  res.send("Server is live");
});
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("received-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnect", socket.id);
  });
});

server.listen(8080, (req, res) => {
  console.log("🚀 started on 8080");
});

```

**Sending Message To Individuals :-**
Client:

```

  const [socketId, setSocketId] = useState("");
  const [receivedMessage, setReceivedMessage] = useState([]);

    socket.on("received-message", (data) => {
      setReceivedMessage((receivedMessage) => [...receivedMessage, data]);
      // console.log("received-message=>", data);
    });

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          id="outlined-basic"
          label="Message"
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
        />

        <TextField
          value={room}
          id="outlined-basic"
          label="Room"
          variant="outlined"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {receivedMessage.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;

```

Server:

```

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  socket.on("message", ({ room, message }) => {
    console.log("Data", { room, message });
   io.to(room).emit("received-message", message);
  });

```

**Joining Room :**
**Client:**

```jsx
 const [roomName, setRoomName] = useState("");

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  
  <form onSubmit={joinRoomHandler}>
       <TextField
         value={roomName}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
  
```

**Server:**
