<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { apiSync } from "../js/request";
    import io from "socket.io-client";

    const socket = io("http://localhost:3000", {
        transports: ["websocket", "polling", "flashcosket"],
    });

    export let user;
    let dispatch = createEventDispatcher();

    let userID = user.ID;
    let rooms = [];
    let apiURL = "http://sveltedbapi.local/realchat.php";

    onMount(async () => {
        rooms = await apiSync(apiURL, {
            action: "getRooms",
            userID,
        });

        socket.emit("client_updateRooms", rooms);
    });

    socket.on("server_updateRooms", (data) => {
        rooms = data;
    });

    const handleClick = (room) => {
        dispatch("selectRoom", room);
    };

    const logoutApp = () => {
        dispatch("logoutApp");
    };

    const dateformat = (date, delimiter = ".") => {
        let d = new Date(date);
        let day = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();

        let newdate = `${day}${delimiter}${month}${delimiter}${year}`;

        return newdate;
    };
</script>

<div class="container">
    <div class="title">
        <span>{user.name} {user.surname}</span>
        <button on:click={logoutApp}>Çıkış Yap</button>
    </div>
    <div class="contents">
        {#each rooms as item (item.ID)}
            <div class="item" on:click={() => handleClick(item)}>
                <span class="date">{dateformat(item.createdate)}</span>
                <span class="name">{item.title}</span>
                <span class="desc">{item.description}</span>
            </div>
        {/each}
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
            background-color: #b00;
            color: #fff;
        }
    }
    .contents {
        width: 100%;
        padding: 25px;
        height: 450px;
        overflow-y: auto;
        padding-bottom: 50px;
        .item {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: flex-start;
            margin-bottom: 15px;
            color: #000;
            position: relative;
            border: 1px solid #eee;
            padding: 10px 15px;
            border-radius: 5px;
            transition: all 0.2s;
            cursor: pointer;
            &:hover {
                background: #fafafa;
                border-color: #eaeaea;
                box-shadow: 0 0 0 2px rgba(31, 78, 233, 0.3);
            }
            span {
                width: 100%;
                display: block;
                &.date {
                    width: auto;
                    font-size: 12px;
                    color: #666;
                    position: absolute;
                    right: 15px;
                    top: 10px;
                    font-style: italic;
                }
                &.name {
                    font-size: 15px;
                    line-height: 20px;
                    font-weight: 700;
                }
                &.desc {
                    font-size: 14px;
                    line-height: 20px;
                    margin-top: 10px;
                }
            }
        }
    }
</style>
