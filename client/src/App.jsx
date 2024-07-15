import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
const App = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [roomName, setRoomName] = useState("");

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("received-message", (data) => {
      setReceivedMessage((receivedMessage) => [...receivedMessage, data]);
      // console.log("received-message=>", data);
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
      <Box sx={{ height: 100 }} />
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to Socket.IO
      </Typography>
      <Typography variant="h5" component="div" gutterBottom>
        {socketId}
      </Typography>
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
