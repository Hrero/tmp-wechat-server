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
        }).then(res => {
        });
        let info = {
            title: '助力循环经济 让世界更美好',
            desc: '租葛亮0押金数码设备租赁平台 累计服务上百万家企业和个人用户',
            link: "https://lmyear.com",
            imgUrl: 'https://static2.zugeliang01.com/20190404/e18ba3e0-56c2-11e9-b483-a5e866e0063a.png',
            iconUrl: 'https://static2.zugeliang01.com/20190404/e18ba3e0-56c2-11e9-b483-a5e866e0063a.png',
            type: 99
        };
        this.$share(info, () => {
            console.log(1)
        });
    }
};
</script>

<style lang="less">
@import "../../assets/less/reset";
</style>
