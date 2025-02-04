
import kaplay from "kaplay";
import "kaplay/global"
import geckos from '@geckos.io/client'
// import startClient from "./client.js";

// startServer();

const SPEED = 500;

const channel = geckos() // default port is 9208

kaplay();

loadBean();

let inGame = false;
channel.onConnect(() => {
    debug.log("connect");


    channel.on("go-game", () => {
        if (!inGame)
        {
            go("game");
            inGame = true;
        }
    });
});

scene("start", () => {


    onUpdate(() => {
        setCursor("default");
    });

    let back = add([
        rect(200, 50),
        pos(center()),
        anchor("center")
    ])


    let curRoom = add([
        text("current room: none"),
        pos(0),
        color(BLACK)
    ]);



    let roomID = back.add([
        text("terr"),
        textInput(true, 6),
        pos(0),
        anchor("center"),
        color(BLACK)
    ]);


    let butin = add([
        rect(120, 60),
        pos(center().add(0, 80)),
        area(),
        outline(10, BLACK),
        anchor("center"),
        {
            update()
            {
                if (this.isHovering())
                    setCursor("pointer");
            },

            add()
            {
                this.onClick(() => {
                    curRoom.text = "current room: " + roomID.text;
                        
                    channel.emit("join-time", roomID.text);
                });
            }
        }
    ]);

    butin.add([
        text("submit"),
        anchor("center"),
        color(BLACK),
        scale(0.75)
    ])
});

scene("game", () => {
    setCursor("default");
    setGravity(1000);

    add([
        sprite("bean"),
        pos(center()),
        anchor("center"),
        area(),
        body(),
        "bean",
        {

            update()
            {
                // debug.log("hi");
                let keys = [channel.id];

                if (isKeyPressed("up") && this.isGrounded())
                {
                    keys.push("jump");
                    this.jump();
                }

                if (isKeyDown("left"))
                {
                    keys.push("left");
                    this.pos.x -= SPEED * dt();
                }

                if (isKeyDown("right"))
                {
                    keys.push("right");
                    this.pos.x += SPEED * dt(); 
                }

                channel.emit("input-frame", keys);
            }
        }
    ]);

    add([
        rect(width(), 100),
        pos(0, height() - 100),
        area(),
        body({isStatic: true})
    ]);

    channel.emit("player-join", channel.id);

    channel.on("player-join", (data) => {
        add([
            sprite("bean"),
            pos(center()),
            anchor("center"),
            area(),
            body(),
            "bean",
            {
                playerID: data
            }
        ]);

        channel.emit("join-response", channel.id);
    });

    channel.on("player-left", (data) => {
        let allPlayers = get("bean");

        for (let i = 0; i < allPlayers.length; i++)
        {
            if (allPlayers[i].playerID == data)
            {
                destroy(allPlayers[i]);
                debug.log("player " + data + " left");
                return;
            }
        }
    });

    channel.on("input-frame", (data) => {
        // debug.log(data);
        let newData = data as string[]

        let inputID = newData[0];

        let allPlayers = get("bean");

        for (let i = 0; i < allPlayers.length; i++)
        {
            if (allPlayers[i].playerID != inputID)
                continue;

            newData.forEach((key) => {
                if (key == "left")
                    allPlayers[i].pos.x -= SPEED * dt();

                if (key == "right")
                    allPlayers[i].pos.x += SPEED * dt();

                if (key == "jump" && allPlayers[i].isGrounded())
                    allPlayers[i].jump();
            });

            return;
        }
    });

    channel.on("join-response", (data) => {
        let allPlayers = get("bean");

        if (!allPlayers.some((player) => {return player.playerID == data}))
            add([
                sprite("bean"),
                pos(center()),
                anchor("center"),
                area(),
                body(),
                "bean",
                {
                    playerID: data
                }
            ]);
    });
});

go("start");