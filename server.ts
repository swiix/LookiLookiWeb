import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    });

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        socket.on("join-room", (roomId, userId) => {
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", userId);

            socket.on("disconnect", () => {
                socket.to(roomId).emit("user-disconnected", userId);
            });
        });

        // Signaling for WebRTC
        socket.on("signal", (data) => {
            io.to(data.target).emit("signal", {
                signal: data.signal,
                caller: data.caller
            });
        });

        socket.on("send-message", (data) => {
            io.to(data.roomId).emit("receive-message", data.message);
        });

        socket.on("start-timer", (data) => {
            io.to(data.roomId).emit("timer-started", data.duration);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, hostname, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
