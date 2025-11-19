require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const placesRouter = require('./routes/places');
const tripsRouter = require('./routes/trips');
const uploadRouter = require('./routes/upload');
const remindersRouter = require('./routes/reminders');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());
app.use('/api/places', placesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/reminders', remindersRouter);
app.use('/uploads', express.static(__dirname + '/uploads'));

// Simple socket broadcast for collaboration
io.on('connection', socket => {
  console.log('Socket connected', socket.id);
  socket.on('trip-update', data => socket.broadcast.emit('trip-update', data));
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
