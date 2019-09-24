<template>
    <div>
        <Navbar/>
        <van-button type="default">默认按钮</van-button>
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
    },
    mounted() {
        console.log(1)
        this.httpService.getBind({
            url: '/'
        }).then(res => {});
    }
};
</script>

<style lang="less">
@import "../../assets/less/reset";
</style>
