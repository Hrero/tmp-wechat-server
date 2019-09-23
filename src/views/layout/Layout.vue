<template>
    <div>
        <Navbar/>
        <section class="app-main">
            <transition name="fade-transform">
                <router-view/>
            </transition>
        </section>
        <Footer/>
    </div>
</template>

<script>
import Navbar from "./Navbar";
import Footer from "./Footer";

export default {
    name: 'Layout',
    components: {
        Navbar,
        Footer
    }
};
</script>

<style lang="less">
@import "../../assets/less/reset";
</style>
