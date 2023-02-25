<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { apiSync } from "../js/request";
    import io from "socket.io-client";

    const socket = io("http://localhost:3000", {
        transports: ["websocket", "polling", "flashcosket"],
    });

    let message = "";
    let messages = [];

    export let user, room;
    let dispatch = createEventDispatcher();

    let userID = user.ID;
    let roomID = room.ID;
    let apiURL = "http://sveltedbapi.local/realchat.php";

    onMount(async () => {
        messages = await apiSync(apiURL, {
            action: "getMessages",
            roomID,
        });

        socket.emit("client_updateMessages", { room, messages });
    });

    socket.on("server_updateMessages", (data) => {
        if (data.room.ID == roomID) {
            messages = data.messages;
        }
        scrollIntoView();
    });
    socket.on("server_newMessage", (data) => {
        if (data.roomID == roomID) {
            messages = [...messages, data];
        }
        scrollIntoView();
    });

    const handleSubmit = async () => {
        let newmessage = {
            action: "addMessage",
            ID: Math.random(),
            message,
            userID,
            roomID,
        };

        if (message) {
            message = "";
            await apiSync(apiURL, newmessage);

            socket.emit("client_newMessage", newmessage);
        }
    };

    const goBack = () => {
        dispatch("goBack");
    };

    const scrollIntoView = () => {
        document.querySelector("#bottom").scrollIntoView({
            behavior: "smooth",
        });
    };
</script>

<div class="container">
    <div class="title">
        <span>{room.title} (user{userID} - room{roomID})</span>
        <button on:click={goBack}>Geri Dön</button>
    </div>
    <div class="contents">
        {#each messages as item (item.ID)}
            <div class="item" class:me={userID == item.userID}>
                <span>{item.message}</span>
            </div>
        {/each}
        <div id="bottom" />
    </div>
    <div class="send">
        <form on:submit|preventDefault={handleSubmit}>
            <input type="text" bind:value={message} />
            <button />
        </form>
    </div>
</div>

<style lang="scss">
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
        background-color: #f5f5f5;
    }
    ::-webkit-scrollbar {
        width: 6px;
        background-color: #f5f5f5;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #555;
    }
    .container {
        width: 600px;
        height: auto;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
    }
    .title {
        width: 100%;
        height: 50px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        line-height: 24px;
        font-weight: 700;
        border-bottom: 1px solid #ccc;
        button {
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 5px;
            background-color: #333;
            color: #fff;
        }
    }
    .contents {
        width: 100%;
        padding: 25px;
        height: 450px;
        overflow-y: auto;
        padding-bottom: 50px;
        * {
            overflow-anchor: none;
        }
        #bottom {
            overflow-anchor: auto;
            height: 1px;
        }
        .item {
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            margin-bottom: 10px;
            &.me {
                justify-content: flex-end;
                span {
                    background: #c1f7cd;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 0;
                    &::before {
                        left: auto;
                        right: -10px;
                        border-color: #c1f7cd transparent transparent
                            transparent;
                        border-width: 8px 12px 0px 12px;
                    }
                }
            }
            span {
                display: inline-block;
                padding: 7px 15px;
                background: #eee;
                border-radius: 5px;
                border-top-left-radius: 0;
                position: relative;
                &::before {
                    content: "";
                    border-color: #eee transparent transparent transparent;
                    border-style: solid;
                    border-width: 8px 12px 0px 12px;
                    width: 0px;
                    height: 0px;
                    position: absolute;
                    left: -10px;
                    top: 0;
                }
            }
        }
    }
    .send {
        width: 100%;
        form {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            align-items: flex-start;
            justify-content: space-between;
        }
        input {
            width: 100%;
            height: 40px;
            border: 0;
            border-top: 1px solid #eee;
            padding: 0 20px;
            font-size: 16px;
            color: #333;
            letter-spacing: 0.5px;
            &:focus {
                background: #fafafa;
            }
        }
        button {
            width: 50px;
            height: 40px;
            border: 0;
            border-top: 1px solid #eee;
            background: url(/images/send.svg) #fff no-repeat center;
            background-size: 20px;
            &:hover {
                background-color: #eee;
                cursor: pointer;
            }
        }
    }
</style>
