<template>
    <div>
        <div class="hidden-sm-and-down" style="color: black;">
            <el-row style="max-width: 1200px;" type="flex" justify="center">
                <el-col>

                    <el-divider v-if="$route.path=='/' || $route.path=='/products'"></el-divider>

                    <!--                    <div v-if="$route.path=='/' || $route.path=='/products'">-->
                    <!--                        <h3 v-if="$route.path=='/'" style="font-size: 14px;">{{$t('basic.services')}}</h3>-->
                    <!--                        <div v-for="(tag, index) in $store.state.tags" :key="index" style="display: inline-block; margin-right: .4rem; margin-top: .4rem; font-size: 14px; color: rgb(121,163,68); padding: 3px 6px; border-radius: 2px;">-->
                    <!--                            {{tag}}-->
                    <!--                        </div>-->
                    <!--                    </div>    -->

                    <!--                    <el-divider></el-divider>-->
                    <el-row type="flex" justify="space-between" align="center"
                            style="font-size: 13px; margin-bottom: 2rem">
                        <!-- <img  src="/img/logo3.62d40edf.png" width="150" height="50" alt="">  -->
                        <div style="width: 30%">
                            <div @click="$router.push({path: '/'})"
                                 style="font-size: 24px; font-weight: bold; margin-bottom: .3em; cursor:pointer;">
                                 <div class="d-flex">
                            <img  src="/img/logo3.62d40edf.png " style="width: 130px;margin-top: -10px;" width="150" height="50" alt=""> 
                                <div> {{ $t('footer.title') }}</div>
                                 </div>
                                <div> {{ $t('footer.title2') }}</div>
                            </div>

                            <span v-if="$store.state.mainLang == 'uz'"> {{ count }} {{ $t('footer.description') }} </span>
                            <div v-else>
                                <span> {{ $t('footer.description') }} </span> {{ count }} <span> {{ $t('footer.description2') }} </span>
                            </div>

                            <div style="margin-top: .5rem; border-radius: 5px;">
                                <el-popover
                                        placement="top"
                                        trigger="hover">
                                    <span>{{$t('basic.for_phone')}} <el-link @click="getItOnGooglePLay" type="primary">GooglePlay</el-link>{{$t('basic.install')}}</span>
                                    <img @click="getItOnGooglePLay" slot="reference" src="@/assets/googleplay2.png"
                                         style="cursor: pointer; background: white" width="100%" height="100%" alt="">
                                </el-popover>
                            </div>

                        </div>

                        <div style="font-size: 2.3em; text-align: center; margin-right: 1em">
                            <div><strong>{{$t('footer.call_center')}}</strong></div>
                            <div style="margin-top: .3em">{{callCenterPhone}}</div>
                        </div>

                        <div style="display: flex; flex-direction: column; justify-content: space-between; width: 20%;">
                            <strong>{{$t('basic.we_on_social_media')}}</strong>
                            <div style="display: flex; flex-direction: column; margin-top: 1rem">
                                <!-- <div @click="onSocialMediaClick('https://www.instagram.com/igiper.uz/')" class="social" style="display: flex;  align-items: center; cursor: pointer;">
                                    <img  src="@/assets/instagram2.webp" width="35" height="35" alt="">
                                    <span style="margin-left: 1em">Instagram</span>
                                </div> -->

                                <div @click="onSocialMediaClick('https://www.instagram.com/igiper.uz/')"
                                     class="social social-extra"
                                     style="background: #DD2A7B;  color: white; padding: 3px; border-radius: 5px">
                                    <i style="font-size: 32px; margin-left: 5px" class="ri-instagram-line"></i>
                                    <span style="margin-left: 1em">Instagram</span>
                                </div>
                                <div @click="onSocialMediaClick('http://www.facebook.com/IGiperuz ')"
                                     class="social social-extra"
                                     style="background: #3B5998;  color: white; padding: 3px; margin: .5em 0; border-radius: 5px">
                                    <i style="font-size: 32px; margin-left: 5px" class="ri-facebook-fill"></i>
                                    <span style="margin-left: 1em">Facebook</span>
                                </div>
                                <div @click="onSocialMediaClick('https://t.me/iGiperuz')" class="social social-extra"
                                     style="background: #0088cc;  color: white; padding: 3px; border-radius: 5px">
                                    <i style="font-size: 32px; margin-left: 5px" class="ri-telegram-fill"></i>
                                    <span style="margin-left: 1em">Telegram</span>
                                </div>
                                <div @click="onSocialMediaClick('https://www.youtube.com/channel/UCaKsvVIDu6yWx-XVwOeUGYg')"
                                     class="social social-extra mt-2"
                                     style="background: #cc0e25;  color: white; padding: 3px; border-radius: 5px">
                                    <!--                                    <i style="font-size: 32px; margin-left: 5px" class="ri-telegram-fill"></i>-->
                                    <img class="market" style="margin-left: 5px; display: inline; width: 3rem;"
                                         @click="onSocialMediaClick('https://www.instagram.com/igiper.uz/')"
                                         src="@/assets/youtube.png">
                                    <span style="display: block;">YouTube</span>
                                </div>

                                <!-- <div @click="onSocialMediaClick('https://t.me/iGiperuz')" class="social" style="display: flex; align-items: center; cursor: pointer;">
                                    <img   style="margin-top: .5em;" src="@/assets/telegram2.png" width="35" height="35" alt="">
                                    <span style="margin-left: 1em">Telegram</span>
                                </div>    -->
                            </div>
                        </div>
                    </el-row>
                </el-col>
            </el-row>

            <div style="position: relative; bottom: 1em">
                <el-row type="flex" justify="space-between" style="flex-wrap: wrap;">
                    <el-col :xl="4" :lg="4" :sm="4" :xs="12" v-for="item in items" :key="item.id">
                        <el-link :underline="false" class="list-item" style="font-size: 15px; text-align: center"
                                 @click="toFullpage(item)">
                            <span class="dot"></span> {{item.title}}
                        </el-link>
                    </el-col>
                </el-row>

                <!--                <el-row type="flex" justify="space-between" style="flex-wrap: wrap;">-->
                <!--                    <el-col :xl="4" :lg="4" :sm="4" :xs="12"  v-for="item in items2" :key="item.id">-->
                <!--                        <el-link :underline="false" class="list-item" style="font-size: 15px;  text-align: center" @click="toFullpage(item)"> <span class="dot"></span> {{item.title}}</el-link>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->
            </div>
        </div>

        <div class="hidden-md-and-up" style="display: flex; justify-content: center; flex-direction: column">
            <el-row class="mb-1">
                <el-col :span="24" style="font-size: 1rem; font-weight: bold;">{{$t('basic.tech_help')}} :</el-col>
            </el-row>
            <el-row style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <el-col :span="24">
                    <i class="el-icon-phone-outline" style="font-size: 1.6rem;"></i>
                    <a :href="'tel:' + callCenterPhone"
                       style="margin-left: .3rem; font-size: 18px; text-decoration: none; color: #729F40">{{callCenterPhone}}</a>
                </el-col>
            </el-row>

            <el-row style="width: 10rem;">
                <el-col :span="24">
                    <img style="width: 100%;"
                         @click="onSocialMediaClick('https://play.google.com/store/apps/details?id=uz.igiper')"
                         src="@/assets/google_play.png">
                </el-col>
            </el-row>

            <el-row type="flex" justify="space-between" style="flex-wrap: wrap; margin-bottom: 1rem;">
                <el-col v-for="item in items" :key="item.id" :span="24" style="margin-top: .5em">
                    <el-link :underline="false" class="list-item" style="font-size: 15px; text-align: center"
                             @click="toFullpage(item)">
                        <span class="dot"></span> {{item.title}}
                    </el-link>
                </el-col>

                <!--                <el-col v-for="item in items2" :key="item.id" :span="24" style="margin-top: .5em">-->
                <!--                    <el-link :underline="false" class="list-item" style="font-size: 14px; display: inline" @click="toFullpage(item)"> <span class="dot"></span> {{item.title}}</el-link>-->
                <!--                </el-col>-->
            </el-row>
            <div style="display: flex; flex-direction: column; margin-bottom: 1rem;">
                <span style="font-size: 1rem; font-weight: bold; margin-bottom: 10px;">{{$t('basic.we_on_social_media')}} :</span>
                <div class="footer-social-block">
                    <div class="footer-social">
                        <img class="market" @click="onSocialMediaClick('https://t.me/iGiperuz')"
                             src="@/assets/telegram.png">
                    </div>
                    <div class="footer-social">
                        <img class="market" @click="onSocialMediaClick('http://www.facebook.com/IGiperuz ')"
                             src="@/assets/facebook.png">
                    </div>
                    <div class="footer-social">
                        <img class="market" @click="onSocialMediaClick('https://www.instagram.com/igiper.uz/')"
                             src="@/assets/instagram.png">
                    </div>
                    <div class="footer-social">
                        <img class="market"
                             @click="onSocialMediaClick('https://www.youtube.com/channel/UCaKsvVIDu6yWx-XVwOeUGYg')"
                             src="@/assets/youtube.png">
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                callCenterPhone: '',
                items: [],

                items2: [],

                count: 0
            }
        },

        mounted() {
            this.getItems();

            this.getCallCenterPhone();

            this.getCounts();
        },

        methods: {

            getCounts() {
                const metadata = {
                    url: 'products/count'
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.count = response;
                    })
            },

            getCallCenterPhone() {
                const metadata = {
                    url: 'settings',
                    params: null
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.callCenterPhone = response.phone;
                    })
            },

            onSocialMediaClick(link) {
                window.open(link);
            },

            getItOnGooglePLay() {
                window.open('https://play.google.com/store/apps/details?id=uz.igiper');
            },

            getItems() {
                const metadata = {
                    url: 'footers',
                    params: {
                        lang: this.$store.state.mainLang
                    }
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.items = response.slice(0, 4);
                        this.items2 = response.slice(4);
                    })
            },

            toFullpage(item) {
                if (this.$router.currentRoute.name !== 'fullpage') {
                    this.$router.push({path: '/fullpage', query: {id: item.id, lang: this.$store.state.mainLang}})
                } else {
                    this.$router.replace({name: 'fullpage', query: {id: item.id, lang: this.$store.state.mainLang}})
                }

                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../custom.scss';

    .footer-social-block {
        display: flex;
        justify-content: space-between;

    }

    .footer-social {
        width: 3.2rem;

        & img {
            width: 100% !important;
            height: 100% !important;
        }
    }

    .social-extra {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .social {
        opacity: .85;

        &:hover {
            opacity: 1;
        }
    }

    .dot {
        height: 10px;
        width: 10px;
        background-color: #729F40;
        border-radius: 50%;
        display: inline-block;
        margin-right: 10px;
    }

    .market {
        /*opacity: 0.7;*/
        cursor: pointer;
        /*-webkit-filter: grayscale(100%); !* Safari 6.0 - 9.0 *!*/
        /*filter: grayscale(100%);    */
        transition: .37s;

        &:hover {
            opacity: 1;
            -webkit-filter: grayscale(0%); /* Safari 6.0 - 9.0 */
            filter: grayscale(0%);
        }
    }

    .footer-image {
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
    }

    .list-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-bottom: 10px;

        &:hover {
            color: $primary-color;
        }
    }
</style>