<template>
    <div id="app">

        <el-row type="flex" justify="center">
            <main-header style="max-width: 1200px;"/>
        </el-row>

        <el-backtop></el-backtop>

        <second-header style="padding: 0 3px;" @innerWidthDefined="onInnerWidthDefined"
                       v-if="$route.path!='/products/create' && $route.path!='/signInOrUp' && $route.name!='product' && $route.path!='/profile'"/>

        <router-view id="router-view"></router-view>

        <el-row type="flex" justify="center" style="background: #e8e8e8; opacity: .8; margin-top: .5em">
            <main-footer v-if="$route.path!='/filter'" style="margin-top: 1rem; padding: 0 24px; max-width: 1200px;"/>
        </el-row>

    </div>
</template>

<script>
    import MainHeader from '@/components/MainHeader.vue'
    import SecondHeader from '@/components/SecondHeader.vue'
    import MainFooter from '@/components/MainFooter.vue'
    import Home from '@/views/Home.vue'

    import Cookies from 'js-cookie'

    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    export default {
        name: 'app',

        components: {
            swiper,
            swiperSlide,
            MainHeader,
            SecondHeader,
            MainFooter,
            Home
        },

        data() {
            return {
                // swiperOption: {
                //   slidesPerView: 3.3,
                //   spaceBetween: 20,
                //   centeredSlides: true,
                //   loop: true,
                //   loopFillGroupWithBlank: false,
                //   pagination: {
                //     el: '.swiper-pagination',
                //     clickable: true
                //   },
                //   breakpoints: {
                //       1024: {
                //         loop: true,
                //         loopFillGroupWithBlank: false,
                //         slidesPerView: 4,
                //         spaceBetween: 40
                //       },
                //       768: {
                //         loop: true,
                //         loopFillGroupWithBlank: false,
                //         slidesPerView: 3,
                //         spaceBetween: 30
                //       },
                //       640: {
                //         loop: true,
                //         loopFillGroupWithBlank: false,
                //         slidesPerView: 2,
                //         spaceBetween: 20
                //       },
                //       370: {
                //         loop: true,
                //         loopFillGroupWithBlank: false,
                //         slidesPerView: 1.1,
                //         spaceBetween: 30
                //       }
                //     },
                //   navigation: {
                //       nextEl: '.swiper-button-next',
                //       prevEl: '.swiper-button-prev'
                //     }
                // },
                width: 0,
                innerWidth: 0,
                height: 0,
                ads: [],
                adImageWidth: 110 // default in pixels
            }
        },

        created() {
            document.getElementById('app').addEventListener('resize', this.checkDeviceScreen);
            const userInfo = Cookies.getJSON('userInfo');
            if (userInfo) {
                this.$store.commit('SET_USER_INFO', userInfo);
            }

            const lang = Cookies.get("lang") ? Cookies.get('lang') : 'ru';

            import(`@/plugins/langs/${lang}.json`)
                .then(data => {
                    this.$i18n.setLocaleMessage(lang, data);
                    this.$i18n.locale = lang;
                })

            this.getAds();
        },

        methods: {
            onInnerWidthDefined(innerWidth) {
                this.innerWidth = innerWidth;
            },

            adClick(item) {
                window.open(item.url);
            },

            getAds() {
                const metadata = {
                    url: 'ads',
                    data: ''
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.ads = response;
                    })
                    .catch(error => {
                        // console.log(error);
                    })
            },

            handleImageResize() {
                let width = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth

                let height = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight


                this.adImageWidth = width / 6.17;
            },

            checkDeviceScreen() {
                //getting screen`s current height and width for cross browser
                let width = window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth

                let height = window.innerHeight
                    || document.documentElement.clientHeight
                    || document.body.clientHeight

                const isMobileVersion = width < 768;

                //this.adImageWidth = (width - document.getElementById('router-view').offsetWidth) / 2;

                if (isMobileVersion) {
                    this.$maxWidth = width + 'px';
                }

                this.$store.commit('SET_DEVICE_VERSION', isMobileVersion);
                this.width = width;
                this.height = height;

                if (this.innerWidth > 0) {
                    this.adImageWidth = (((this.width - this.innerWidth) / 2) - 15);
                }
            }
        },

        mounted() {
            window.onresize = this.handleImageResize;
            //window.onresize = this.checkDeviceScreen
            this.checkDeviceScreen();
        }
    }
</script>


<style>
    .image {
        width: 100%;
        display: block;
    }

    img {
        width: 100%;
        object-fit: cover;
        object-position: center;
    }

    #app {
        font-family: Lato, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        background: white;
    }

    body {
        margin: 0;
        padding: 0;
    }

</style>