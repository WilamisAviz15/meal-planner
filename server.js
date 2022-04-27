// server.js
const app = require("./backend/app").default;
const http = require("http");

const port = process.env.LOCAL_PORT;
console.log("App now running on port", port);
app.express.set("port", port);

const server = http.createServer(app.express);
server.listen(port);

const io = require("socket.io")(server, {
  path: "/api/socket.io",
  transports: ["websocket"],
});

const dbWatcher$ = app.db.watch();

io.on("connection", (socket) => {
  dbWatcher$.on("change", (data) => {
    socket.emit("dbchange", data);
  });
});
