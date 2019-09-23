<template>
    <section class="body-container">
        <Tabs value="user">
            <TabPane label="用户" name="user">
                <Users />
            </TabPane>
            <TabPane label="商品" name="product">
                <ProductList />
            </TabPane>
        </Tabs>
    </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Users from './Users.vue';
import ProductList from './ProductList.vue';

export default {
    name: "home",
    components: { ProductList, Users }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/main";
.body-container {
    .body-navbar {
        .size(100%, 60px);
        .box-shadow();
        ul {
            .size(1200px, 100%);
            margin: 0 auto;
            display: flex;
            li {
                .size(auto, 100%);
                .center(flex);
                .fz(@fontSize12);
                color: @colorFont666;
                padding: 0 18px;
            }
        }
    }
    .body-Carousel {
        .size(100%, 400px);
    }
    section {
        padding: 80px 0;
        .center(flex);
        flex-direction: column;
    }
}
</style>
