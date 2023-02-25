<script>
    import Login from "./components/Login.svelte";
    import Room from "./components/Room.svelte";
    import Chat from "./components/Chat.svelte";

    let user;
    let room;

    const updateUser = (e) => {
        user = e.detail;
    };

    const selectRoom = (e) => {
        room = e.detail;
    };

    const goBack = () => {
        room = "";
    };

    const logoutApp = () => {
        user = "";
        room = "";
    };
</script>

<main>
    {#if user}
        {#if room}
            <Chat {user} {room} on:goBack={goBack} />
        {:else}
            <Room {user} on:selectRoom={selectRoom} on:logoutApp={logoutApp} />
        {/if}
    {:else}
        <Login on:updateUser={updateUser} />
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
