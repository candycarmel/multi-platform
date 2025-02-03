import geckos from '@geckos.io/server'  


const io = geckos({iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    { urls: "stun:stun1.l.google.com:5349" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349" },
    { urls: "stun:stun3.l.google.com:3478" },
    { urls: "stun:stun3.l.google.com:5349" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349" }
]});

io.listen(9208) // default port is 9208

io.onConnection(channel => {
    channel.onDisconnect(() => {
        console.log(`${channel.id} got disconnected`)
    });

    channel.on("join-time", (data) => {  
        channel.join(data);
        
        io.room(channel.roomId).emit("go-game");
    });

    channel.on("player-join", (data) => {
        channel.broadcast.emit("player-join", data);
    });

    channel.on("join-response", (data) => {
        channel.broadcast.emit("join-response", data);
    });

    channel.on("input-frame", (data) => {
        channel.broadcast.emit("input-frame", data);
    });
});