<template>
    <el-container direction="vertical">
        <div>

        </div>
        <div class="hidden-md-and-up">

            <el-row v-if="$route.path!='/filter' && $route.path!='/categories'" style="margin-top: .5rem">
                <div style="padding: 0 3px; margin: 0 5px;">
                    <el-row :class="dynamicClass">
                        <el-col :span="24">
                            <el-input style="background: white !important; border: none !important;"
                                @input="searchProduct(false)" v-model="searchData" prefix-icon="el-icon-search"
                                :placeholder="`${allProducts} ${$t('basic.with_you')}`">
                                <el-button slot="prepend" style="height: 24px;">
                                    <Slide closeOnNavigation>
                                        <div class="d-flex flex-column justify-content-between"
                                            style="height: 8rem; background: #01bfa5;">
                                            <img src="@/assets/logo3.png" style="width: 10rem;"
                                                @click="$router.push({path: '/'})">
                                            <div 
                                            style="display: flex; justify-content: space-between;">
                                                <h5 class="text-white text-left">iGiper</h5>
                                                <div>
                                                    <el-link style="font-size: 1.2rem; font-weight: 500;"
                                                        @click="changeLang(1)"
                                                        :class="mainLang == 1 ? 'active-lang' : 'default'">
                                                       <span style="display: flex; flex-direction: column">
                                                    <img src="../assets/uz.png" height="30px" alt="ru">
                                                        <span
                                                        style="margin-top: 2px; font-size: 14px;"
                                                        >UZB</span>
                                                       </span>
                                                        </el-link>
                                                    <el-divider direction="vertical"></el-divider>
                                                    <el-link style="font-size: 1.2rem; font-weight: 500;"
                                                        @click="changeLang(2)"
                                                        :class="mainLang == 2 ? 'active-lang' : 'default'">
                                                       <span style="display: flex; flex-direction: column">
                                                    <img src="../assets/ru.png" height="30px" alt="ru">
                                                        <span
                                                        style="margin-top: 2px; font-size: 14px;"
                                                        >RUS</span>
                                                       </span>
                                                        </el-link>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="home">
                                            <i class="fas fa-search mr-2"></i> <span
                                                class="text-dark">{{$t('basic.searcheAds')}}</span>
                                        </div>
                                        <div id="home1" @click="$router.push({name: 'favourite-courses'})">
                                            <i class="far fa-heart mr-2 text-black-50"></i> <span
                                                class="text-dark">{{$t('basic.favourites')}}</span>
                                        </div>
                                        <div id="home2" @click="$router.push({name: 'profile'})">
                                            <i class="fas fa-newspaper mr-2"></i> <span
                                                class="text-dark">{{$t('basic.myAds')}}</span>
                                        </div>
                                        <div id="home3" @click="$router.push({name: 'messages'})">
                                            <i class="far fa-comments mr-2"></i> <span
                                                class="text-dark">{{$t('basic.myMessage')}}</span>
                                        </div>
                                        <div id="home6" @click="$router.push({name: 'transactions'})">
                                            <i class="fas fa-money-check-alt mr-2"></i> <span
                                                class="text-dark">{{$t('basic.payment')}}</span>
                                        </div>
                                        <div id="home4" @click="$router.push({name: 'makeannouncement'})">
                                            <i class="far fa-plus-square mr-2"></i> <span
                                                class="text-dark">{{$t('latter_header.make_announcement')}}</span>
                                        </div>
                                        <div id="home5" v-if="!$store.state.userInfo.token"
                                            @click="$router.push({ name: 'signInOrUp' })">
                                            <i class="fas fa-cog mr-2"></i> <span
                                                class="text-dark">{{$t('basic.settings')}}</span>
                                        </div>
                                        <div v-else @click="$router.push({ name: 'settings' })">
                                            <i class="fas fa-cog mr-2"></i> <span
                                                class="text-dark">{{$t('basic.settings')}}</span>
                                        </div>
                                    </Slide>
                                </el-button>

                                <template style="border: none !important;" v-if="searchData.length > 0" slot="append">
                                    <i @click="searchProduct(true)" class="el-icon-plus"></i>
                                </template>
                                <el-button
                                    style="background: white; border: none !important; font-size: 1.2rem; box-sizing: border-box; overflow: hidden"
                                    @click="$router.push({name: 'filter'})" slot="append" icon="el-icon-camera">
                                </el-button>
                                <el-button
                                    style="background: white; border: none !important; font-size: 1.2rem; box-sizing: border-box; overflow: hidden"
                                    @click="$router.push({name: 'filter'})" slot="append" icon="el-icon-s-operation">
                                </el-button>
                                <el-button
                                @click="onSocialMediaClick('https://t.me/iGiperuz')"
                                    style="background: white; border: none !important;
                                     font-size: 1.2rem; box-sizing: border-box; overflow: hidden;"
                                     slot="append" icon="el-paper-plane">
                                     <img style="width: 20px; margin-top: -4px;" src="@/assets/tgg.png"/>
                                </el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-row>
        </div>
    </el-container>
</template>

<script>
    import 'element-ui/lib/theme-chalk/display.css';
    import Cookies from 'js-cookie'
    import {
        EventBus
    } from '@/plugins/EventBus.js'
    import {
        Slide
    } from 'vue-burger-menu'

    export default {
        components: {
            Slide
        },
        data() {
            return {
                mainLang: 1,
                closeSide: 300,
                dynamicClass: null,
                ads: null,
                allProducts: 0,
                searchData: '',
                categories: {
                    isRoot: true,
                    items: [],
                    breadcrumb: [],

                    extraItem: {
                        name: '',
                        iconClass: 'el-icon-plus',
                        iconColor: '#63A053'
                    },

                    extraProperties: {
                        iconColor: ['#0098D0', '#22B8CF', '#58b86a', '#b54cac', '#ad4742', '#c99d3c', '#dae329',
                            '#89e329', '#283b13', '#349459', '#23386b', '#6b3f8f'
                        ],
                        iconClass: ['fas fa-car', 'fas fa-suitcase-rolling', 'fas fa-suitcase-rolling', 'fas fa-hammer',
                            'fas fa-campground', 'fas fa-campground', 'fas fa-desktop', 'fas fa-football-ball',
                            'fas fa-paw', 'fas fa-campground', 'fas fa-campground', 'fas fa-campground'
                        ],
                    }
                },
                mainLang: 1,

                isOpen: {
                    type: true,
                    required: true
                },
                right: {
                    type: Boolean,
                    required: false
                },
                disableEsc: {
                    type: Boolean,
                    required: false
                },
                noOverlay: {
                    type: Boolean,
                    required: false
                },
                onStateChange: {
                    type: Function,
                    required: false
                },
                burgerIcon: {
                    type: Boolean,
                    required: false,
                    default: true
                },
                crossIcon: {
                    type: Boolean,
                    required: false,
                    default: true
                },
                disableOutsideClick: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                closeOnNavigation: {
                    type: Boolean,
                    required: false,
                    default: false
                },
            }
        },

        created() {

    let mainLang = Cookies.get('lang');

    if (mainLang === 'ru' || !mainLang) {
      mainLang = 'ru';
      this.mainLang = 2;
    } else {
      mainLang = 'uz';
      this.mainLang = 1;
    }

    this.$store.commit('SET_MAIN_LANG', mainLang);
    Cookies.set('lang', mainLang);
        },

        mounted() {
            this.dynamicClass = 'something';
            this.getCategories();
            this.getAllProducts();
        },

        methods: {
            onSocialMediaClick(link) {
                window.open(link);
            },
                changeLang(lang) {
      this.mainLang = lang;
      const mainLang = lang == 1 ? 'uz' : 'ru';

      this.$store.commit('SET_MAIN_LANG', mainLang);
      Cookies.set('lang', mainLang);
      document.location.reload();
      document.getElementById('image-box').style.cursor = 'default';
    },
            getAllProducts() {
                const metadata = {
                    url: 'products/count'
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.allProducts = response;
                    })
            },

            makeBreadcrumb(items) {

                let names = '';

                for (let index = 0; index < items.length - 1; index++) {
                    const element = items[index];

                    names += element.name;

                    if (index != items.length - 1) {
                        names += ' / ';
                    }
                }
                return names;
            },

            clearCategory() {
                this.categories.isRoot = true;
                this.categories.items = [];
                this.categories.breadcrumb = [];
            },

            searchProduct(clear = false) {
                if (clear) {
                    this.searchData = '';
                }

                if (this.$route.path != '/products') {
                    this.$router.push({
                        name: 'products'
                    });
                }
                this.$store.commit('SET_MOBILE_FILTER_FORM', {
                    searchData: this.searchData
                })
            },

            handleBackClick(toProducts = false) {
                if (this.$route.path == '/') {
                    const item = this.categories.breadcrumb.pop();

                    this.getCategories(item.parentId ? item.parentId : 0);

                    if (this.categories.breadcrumb.length > 0) {
                        const itemParent = [...this.categories.breadcrumb].pop();

                        this.categories.extraItem.name = this.mainLang == 1 ? (itemParent.name +
                            ' ruknidagi barcha e`lonlar') : ('Bсё в рубрике ' + itemParent.name);
                    }
                } else {
                    this.getCategories();
                    this.$router.push({
                        path: '/'
                    });
                }
            },

            handleCategoryClick(category, root = false) {
                if (!category.isLast || root) {
                    this.categories.breadcrumb.push(category);
                    this.getCategories(category.id);

                    this.categories.extraItem.id = category.id;
                    this.categories.extraItem.name = this.mainLang == 1 ? (category.name +
                        ' ruknidagi barcha e`lonlar') : ('Bсё в рубрике ' + category.name);
                } else {
                    this.toProdcts(category);
                }
            },

            toProdcts(category, isExtraItem = false) {

                if (isExtraItem && !category.id) { // this means that make announcement button is clicked
                    this.$router.push({
                        name: 'makeannouncement'
                    });
                    return;
                }

                this.categories.extraItem.id = null;

                this.$router.push({
                    name: 'products'
                });

                let tags = [];

                if (category.tags) {
                    tags = category.tags.split(',')
                }
                this.$store.commit('SET_TAGS', tags);

                let params = [category.parentId]

                if (!isExtraItem) {
                    params.push(category.id)
                }

                this.$store.commit('SET_PRODUCT_DATA', {
                    categoryId: params
                });
            },

            getCategories(id = 0) {
                const metadata = {
                    url: 'categories',
                    params: {
                        lang: this.$store.state.mainLang,
                        pId: id
                    },
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {

                        this.categories.isRoot = false;
                        this.categories.items = response;

                        if (id == 0) {

                            this.categories.extraItem.name = this.$t('advertise.title');

                            this.categories.isRoot = true;
                            for (let index = 0; index < 12; index++) {
                                this.categories.items[index].iconColor = this.categories.extraProperties.iconColor[
                                    index];
                                this.categories.items[index].iconClass = this.categories.extraProperties.iconClass[
                                    index];
                            }
                        }
                    })
            },
        },

        watch: {
            $route(to, from) {
                if (to.path == '/') {
                    this.getCategories();
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '../custom.scss';
        .active-lang {
      color: #729F40 !important;
    }
    .close-sidebar {
        width: 0 !important;
    }

    .el-input-group__append {
        background: white !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .el-input-group__prepend {
        background: white !important;
    }

    .dropdown-element {
        color: #90C049;
        margin-left: 1.2rem;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #90C049;
    }

    .active-lang {
        color: $primary-color;
    }

    .el-button:focus,
    .el-button--default:focus {
        border: none !important;
        outline: none !important;
    }

    .el-input__inner {
        border: solid 1px rgb(220, 223, 230) !important;
        border-left: none !important;
        border-right: none !important;
        height: 4px;
    }

    .bm-menu {
        background: white !important;
        padding-top: 0 !important;
    }

    .bm-burger-button {
        height: 16px !important;
        width: 20px !important;
        left: 8px !important;
        top: 10px !important;
        z-index: 10 !important;
    }

    .bm-item-list {
        margin: 0 !important;
    }
</style>