<script>
    import NavBar from "$lib/components/NavBar.svelte";
</script>

<NavBar />

<main>
    <slot />
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: "Geist", sans-serif;
        background-color: #f5f5f5;
    }

    main {
        max-width: 1500px;
        margin: 0 auto;
        padding: 80px 2rem 2rem 2rem;
    }

    @font-face {
        font-family: "Geist";
        src: url("/fonts/Geist-VariableFont_wght.ttf") format("truetype");
        font-weight: 100 900;
        font-style: normal;
    }
</style>