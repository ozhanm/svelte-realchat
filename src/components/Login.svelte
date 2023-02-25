<script>
    import { createEventDispatcher } from "svelte";
    import { apiSync } from "../js/request";

    let email, pass;
    let inactivebtn = true;
    let errors = { email: "", pass: "", message: "" };
    let apiURL = "http://sveltedbapi.local/realchat.php";
    let dispatch = createEventDispatcher();

    $: {
        if (email && pass) inactivebtn = false;
        else inactivebtn = true;
    }

    const handleSubmit = async () => {
        let valid = true;
        errors = { email: "", pass: "", message: "" };

        if (!email || email == "") {
            valid = false;
            errors.email = "Email adresinizi yazınız!";
        }
        if (!pass || pass == "") {
            valid = false;
            errors.pass = "Şifrenizi yazınız!";
        }

        if (valid == true) {
            let sonuc = await apiSync(apiURL, {
                action: "login",
                email,
                pass,
            });

            errors.message = sonuc.mesaj;

            if (sonuc.result == true) {
                setTimeout(() => {
                    dispatch("updateUser", sonuc.user);
                }, 1500);
            }
        }
    };
</script>

<div class="container">
    <div class="title">Login</div>
    <div class="contents">
        <form on:submit|preventDefault={handleSubmit}>
            <span class="error top">{errors.message}</span>
            <div class="row">
                <label for="email">Email Adresi:</label>
                <input type="email" id="email" bind:value={email} />
                <span class="error">{errors.email}</span>
            </div>
            <div class="row">
                <label for="pass">Şifre:</label>
                <input type="password" id="pass" bind:value={pass} />
                <span class="error">{errors.pass}</span>
            </div>
            <div class="row">
                <button class:inactive={inactivebtn == true}>Sign In</button>
            </div>
        </form>
    </div>
</div>

<style lang="scss">
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
    }
    .contents {
        width: 100%;
        padding: 35px;
        height: 450px;
        overflow-y: auto;
        padding-bottom: 50px;
    }
    .row {
        width: 100%;
        &:not(:last-child) {
            margin-bottom: 25px;
        }
    }
    label {
        width: 100%;
        margin-bottom: 10px;
        display: block;
    }
    input {
        width: 100%;
        height: 40px;
        padding: 0 15px;
        line-height: 38px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    button {
        color: #fff;
        padding: 10px 25px;
        background: #0b0;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background: #0d0;
        }
        &.inactive {
            opacity: 0.6;
            pointer-events: none;
        }
    }
    .error {
        color: #b00;
        font-size: 12px;
        font-style: italic;
        margin-top: 7px;
        display: block;
        font-weight: 600;
        letter-spacing: 0.3px;
        &.top {
            color: #333;
            margin: 0 0 20px;
            font-style: normal;
            font-size: 13px;
        }
    }
</style>
