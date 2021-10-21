<template>
    <div>
        <div class="hidden-sm-and-down">

            <el-row class="hidden-sm-and-down mx-5 mt-3" type="flex">
                <el-col :span="5" style="display: flex; align-items: center;">
                    <div
                        style="display: flex; justify-content: center; align-items: center; font-size: 20px; font-weight: 500; margin-left: 10px;">
                        <el-link @click="changeLang(1)" :type="mainLang===1 ? 'primary' : 'default'"
                            style="font-size: 18px !important;">
                            <span style="display: flex; flex-direction: column">
                                <img src="../assets/uz.png" height="30px" alt="ru">
                                <span style="margin-top: 2px; font-size: 14px;">UZB</span>
                            </span>
                        </el-link>
                        <span style="margin: 0 .3rem"></span>
                        <el-link :type="mainLang===2 ? 'primary' : 'default'" @click="changeLang(2)"
                            style="font-size: 18px !important;">
                            <span style="display: flex; flex-direction: column">
                                <img src="../assets/ru.png" height="30px" alt="ru">
                                <span style="margin-top: 2px; font-size: 14px;">RUS</span>
                            </span>
                        </el-link>
                    </div>
                </el-col>
                <el-col :span="13" style="display: flex; justify-content: center;">
                    <div style="display: flex; align-items: center; margin-left: 15px" id="home1"
                        v-if="$store.state.userInfo.token">
                        <i class="far fa-heart"
                            style="font-size: 27px; cursor:pointer; margin-right: 10px; color: rgb(144, 192, 73);"
                            @click="$router.push({name: 'favourite-courses'})"></i>
                        <span>Избранное</span>
                    </div>
                </el-col>
                <el-col :span="6" style="display: flex; align-items: center; justify-content: flex-end;">

                    <div v-if="!$store.state.userInfo.token" @click="$router.push({ name: 'signInOrUp' })"
                        style="display: flex; justify-content: space-between; align-items: center;">

                        <div style="display: flex; align-items: center;">
                            <el-avatar size="small"
                                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                            <span
                                style="margin-left: 5px; color: #90C049; cursor:pointer;">{{$t('basic.sign_up')}}</span>
                        </div>

                        <div style="margin-right: 10px;">
                            <span style="margin: 0 .7rem; color: #90C049; cursor:pointer;">{{$t('login.enter')}} <i
                                    style="color: #CACFD2" class="fas fa-sign-out-alt"></i></span>
                        </div>
                    </div>

                    <!--                     <el-badge :value="200" :max="99" style="margin-right: 1.5rem">-->
                    <!--                      <el-button icon="el-icon-star-off" circle></el-button>-->
                    <!--                    </el-badge>-->
                    <el-dropdown v-else @command="handleCommand" class="mr-2">
                        <div class="el-dropdown-link" style="display: flex; align-items: center">
                            <el-avatar
                                :src="$store.state.userInfo.imageUrl ? $serverImageUrl + $store.state.userInfo.imageUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
                            </el-avatar>
                            <div style="margin-left: .5rem">
                                <span>{{$store.state.userInfo.phone}}</span><br>
                                <span>{{$store.state.userInfo.name}}</span>
                            </div>
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-set-up" disabled>{{$t('basic.data')}}</el-dropdown-item>
                            <el-dropdown-item command="0" divided><span
                                    class="dropdown-element">{{$t('basic.ads')}}</span></el-dropdown-item>
                            <el-dropdown-item command="1"><span class="dropdown-element">{{$t('basic.messages')}}</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="2"><span
                                    class="dropdown-element">{{$t('basic.transactions')}}</span></el-dropdown-item>
                            <el-dropdown-item command="3">
                                <el-badge :value="$store.state.userInfo.favouritesCount"
                                    :hidden="$store.state.userInfo.favouritesCount == 0" :max="99">
                                    <span class="dropdown-element">{{$t('basic.favourites')}}</span>
                                </el-badge>
                            </el-dropdown-item>
                            <el-dropdown-item command="4"><span class="dropdown-element">{{$t('basic.settings')}}</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided command="5">

                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>


                    <div v-if="$store.state.userInfo.token"
                        style="display: flex; align-items: center; cursor:pointer; margin-right: 24px;"
                        @click="handleCommand(5)">
                        <span divided command="5">
                            <i style="color: #CACFD2" class="fas fa-sign-out-alt"></i>
                            <span style="margin-left: 0px" class="dropdown-element">{{$t('basic.logout')}}</span>
                        </span>
                    </div>
                </el-col>
            </el-row>

            <el-row class="mt-2 mx-5" style="display: flex; align-items: center;">
                <el-col :span="4">
                    <div @click="$router.push({path: '/'})"
                        style="cursor: pointer; display: flex; justify-content: start; align-items: center; height: 100%; width: 180px;">
                        <img src="@/assets/logo3.png" width="100%" height="100%" alt="">
                    </div>
                </el-col>
                <el-col :span="16" style="display: flex; align-items: center;">

                    <el-input @keypress.native.enter="searchProduct" id="selectRegion"
                        style="width: 40%; margin-right: 5px; border-right: solid 1px #d5d5d5; border-left: solid 1px #d5d5d5; border-radius: 5px;"
                        v-model="searchData" prefix-icon="el-icon-search"
                        :placeholder="`${allProducts} ${$t('basic.with_you')}`"></el-input>
                    <el-popover placement="bottom-end" style="width: 45%" :offset="170" :width="890">
                        <el-row>
                            <span id="changeRegion" @click="onRegionSelected(regions.activeHeader, 0)"
                                class="header-region">{{regions.activeHeader.name2}}</span>

                            <span v-if="!regions.isRoot" style="float: right" id="parentRegion"
                                @click="onParentRegionSelected(regions.activeHeader)"
                                class="header-region">{{regions.parent.name}}</span>
                            <hr>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="6" v-for="region in regions.active" :key="region.id">
                                <div @click="onRegionSelected(region, 1)" class="region">
                                    <el-row type="flex">
                                        <el-col>
                                            <span>{{region.name}}</span>
                                        </el-col>
                                        <el-col>
                                            <i v-if="region.sub" class="el-icon-arrow-right"></i>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-col>
                        </el-row>
                        <el-input style="width: 100%; border-left: solid 1px #d5d5d5; border-radius: 5px;"
                            slot="reference" v-model="regions.selected.name" prefix-icon="el-icon-location-outline"
                            :placeholder="$t('basic.whole_country')">
                            <el-button v-if="regions.checkSelected" @click="clearSelectedRegion" slot="append"
                                icon="el-icon-plus"></el-button>
                        </el-input>
                    </el-popover>

                    <el-button @click="searchProduct" icon="el-icon-search"
                        style="background: #90C049; color: white; padding: 12px 10px;">{{$t('basic.search')}}
                    </el-button>
                </el-col>
                <el-col :span="4" style="display: flex; justify-content: flex-end;">
                    <el-button size="medium" style="margin-right: 1.5rem; background: rgb(99,175,249); color: white;"
                        @click="$router.push({ name: 'makeannouncement' })" icon="el-icon-plus">
                        {{$t('advertise.title')}}
                    </el-button>
                </el-col>
            </el-row>
            <div v-if="!$route.path.includes('/fullpage')">
                <el-row type="flex" justify="center">
                    <el-row style="width: 1200px; height: 500px;">
                        <el-carousel :interval="5000" arrow="always" style="margin-top: 1.3em; width: 100%;">
                            <el-carousel-item v-for="ad of ads" :key="ad.id" class="slide">
                                <a :href="ad.url">
                                    <img width="100%" height="100%" style="object-fit: cover; border-radius: 10px;"
                                        :src="$serverImageUrl + ad.image" alt="">
                                </a>
                            </el-carousel-item>
                        </el-carousel>
                    </el-row>
                </el-row>

                <el-row type="flex" justify="center">
                    <el-row style="max-width: 1200px;">
                        <h1 style="font-weight: bold;">{{$t('basic.choose_category')}}</h1>
                    </el-row>
                </el-row>

                <el-row type="flex" justify="center" style="margin-bottom: 1.2rem;">
                    <el-row style="max-width: 1200px;" type="flex" :gutter="20">
                        <swiper :options="swiperOption" style="margin-top: 1rem;">
                            <swiper-slide v-for="(item,index) in this.categories.all" :key="item.id"
                                style="display: flex; width: auto !important; justify-content: center; border-radius: 100px; box-shadow: 0 0 5px rgba(109,131,142,0.51); cursor:pointer;">
                                <div @click="wholeCategorySelected2(item)"
                                    style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px">
                                    <div
                                        style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                        <!--                                <div v-if="categories.isRoot" style="display: flex; justify-content: center;">-->
                                        <!--                                    <i :style="`color: ${category.iconColor}; font-size: 20px;`" :class="category.iconClass"></i>-->
                                        <!--                                </div>-->

                                        <div
                                            style="font-size: 1.1rem; font-weight: 700; text-align: center; color: #19b97d;">
                                            {{item.name}}
                                        </div>
                                    </div>
                                </div>
                                <!--                            <div class="category-box">-->
                                <!--                                <div :id="'category' + index" @click="wholeCategorySelected2(item)" style="display: flex; flex-direction: column">-->
                                <!--                                    <div :id="'image' + index" class="category-image">-->
                                <!--                                        <img width="90" height="90" :src="item.image ? ($serverImageUrl + item.image) : 'https://api.youla.io/files/icons/icon-cat-pc-rotator.png'" alt="">-->
                                <!--                                    </div>-->
                                <!--                                    <div style="display: flex; justify-content: center; align-items: center; width: 93px">-->
                                <!--                                        <span class="category-title">{{item.name}}</span>-->
                                <!--                                    </div>-->
                                <!--                                </div>-->
                                <!--                            </div>-->
                            </swiper-slide>
                            <!-- <div class="swiper-pagination" slot="pagination"></div> -->
                            <div class="swiper-button-prev" slot="button-prev"></div>
                            <div class="swiper-button-next" slot="button-next"></div>
                        </swiper>
                    </el-row>
                </el-row>
            </div>
        </div>

        <div v-if="$route.path=='/' || $route.path=='/products'" class="hidden-md-and-up">
            <el-row type="flex" justify="center">
                <el-row :style="'width:' + $maxWidth">
                    <el-carousel :interval="5000" height="170px !important;" arrow="always" indicator-position="inside"
                        style="margin-top: 1.3em;">
                        <el-carousel-item v-for="ad of ads" :key="ad.id" class="slide">
                            <a :href="ad.url">
                                <img width="100%" height="100%" style="object-fit: cover; border-radius: 8px;"
                                    :src="$serverImageUrl + ad.image" alt="">
                            </a>
                        </el-carousel-item>
                    </el-carousel>
                </el-row>
            </el-row>

            <div v-if="$route.path=='/' || $route.path=='/products'" class="hidden-md-and-up">
                <!--                <el-row :gutter="5" type="flex" justify="space-between" style="margin-top: .5rem; padding: 5px">-->
                <!--                    <el-col :span="18">-->
                <!--                        <div @click="$router.push({name: 'regions', params: {from: 'home'}})" style="display: flex; justify-content: space-between; cursor: pointer; padding: .5rem 0; border-bottom: 1px solid #ABABAB;">-->
                <!--                            <div style="display: flex">-->
                <!--                                <i class="el-icon-location-outline"></i>-->
                <!--                                <span v-if="!$store.state.mobileFilterForm.regions.length > 0" style="margin-left: .3rem">{{$t('advertise.region')}}</span>-->
                <!--                                <div v-else style="display: flex; flex-direction: column; margin-left: .3rem">-->
                <!--                                    <span style="font-size: 11px; color: gray"> {{makeBreadcrumb($store.state.mobileFilterForm.regions)}} </span>-->
                <!--                                    <span style="font-size: 12px"> {{[...$store.state.mobileFilterForm.regions].pop().name
                }} </span>-->
                <!--                                </div>-->
                <!--                            </div>-->
                <!--                            <div>-->
                <!--                                <i class="el-icon-arrow-right"></i>-->
                <!--                            </div>-->
                <!--                        </div>-->
                <!--                    </el-col>-->
                <!--                    <el-col :span="4">-->
                <!--                        <el-button style="width: 100%" size="medium" @click="$router.push({name: 'filter'})" icon="el-icon-s-grid"></el-button>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->

                <categories></categories>
            </div>
        </div>
    </div>
</template>

<script>
    // require styles
    import 'swiper/dist/css/swiper.css'
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper'
    import Categories from './Profile/Mobile/Categories'
    import Cookies from "js-cookie";

    export default {
        props: {
            from: {
                type: String,
                default: 'filter'
            },
        },

        components: {
            swiper,
            swiperSlide,
            Categories
        },

        data() {
            return {
                mainLang: 2,
                ads: null,
                innerWidth: 0,
                categoryColors: ['#d7f0f7', '#d7f0f0', '#d0eafa', '#d7ebf0', '#f0d7f0', '#f0e1d7', '#d0d8fa', '#f0e6d7',
                    '#d7f5f0', '#doe4fa'
                ],
                swiperOption: {
                    autoplay: {
                        delay: 20000,
                        disableOnInteraction: false
                    },
                    slidesPerView: 4,
                    spaceBetween: 8,
                    loop: true,
                    loopFillGroupWithBlank: true,

                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },

                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                },
                allProducts: 0,
                searchData: '',

                allCategories: [],
                // categorys: {
                //     itemParent: '',
                //     isRoot: true,
                //     items: [],
                //     breadcrumb: [],
                //
                //     extraItem: {
                //         name: '',
                //         iconClass: 'el-icon-plus',
                //         iconColor: '#63A053'
                //     },
                //
                //     extraProperties: {
                //         iconColor: ['#0098D0', '#22B8CF', '#58b86a', '#b54cac', '#ad4742', '#c99d3c', '#dae329', '#89e329', '#283b13', '#349459', '#23386b', '#6b3f8f'],
                //         iconClass: ['fas fa-car', 'fas fa-suitcase-rolling', 'fas fa-suitcase-rolling', 'fas fa-hammer', 'fas fa-campground', 'fas fa-campground', 'fas fa-desktop', 'fas fa-football-ball', 'fas fa-paw', 'fas fa-campground', 'fas fa-campground', 'fas fa-campground'],
                //     }
                // },

                categories: {
                    showTopSubCategories: false,
                    showMiddleSubCategories: false,
                    showBottomSubCategories: false,

                    all: [],

                    top: [],
                    middle: [],
                    bottom: [],

                    selected: '',

                    activeSubCategory: {
                        rowNumber: 0,
                        parentCategoryTitle: '',
                        items: []
                    },
                    //fas fa-mobile
                    extraProperties: {
                        iconColor: ['#e46179', '#22B8CF', '#58b86a', '#b54cac', '#ad4742', '#c99d3c', '#34495E',
                            '#89e329', '#283b13', '#349459', '#23386b', '#6b3f8f'
                        ],
                        iconClass: ['fas fa-baby-carriage', 'fas fa-home', 'fas fa-car', 'fas fa-briefcase',
                            'fas fa-paw', 'fas fa-couch', 'fas fa-desktop', 'fas fa-wrench', 'fas fa-tshirt',
                            'fas fa-bicycle', 'fas fa-tag', 'fas fa-handshake'
                        ],
                    }
                },

                regions: {
                    isRoot: true,

                    checkSelected: false,

                    parent: '',

                    all: [],
                    root: [],
                    sub: [],

                    active: [],

                    activeHeader: {
                        name: 'Butun O`zbekiston',
                        name2: 'Butun O`zbekiston',
                        id: null,
                        parentId: null,
                    },

                    selected: {
                        name: 'Butun O`zbekiston',
                        id: null,
                        parentId: null
                    }
                }
            }
        },

        created() {
            if (this.$store.state.isMobileVersion) {
                this.swiperOption.slidesPerView = 4;
                this.swiperOption.slidesPerGroup = 4;
                this.swiperOption.spaceBetween = 1;
                this.swiperOption.loop = true;
            } else {
                this.swiperOption.slidesPerView = 7;
                this.swiperOption.slidesPerGroup = 7;
                this.swiperOption.spaceBetween = 7;
                this.swiperOption.loop = false;
            }

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
            this.oldAllCategories();

            this.getCategories();
            this.getRegions();
            this.getAllProducts();
            this.getAds();

            // this.innerWidth = document.getElementById('innerWidth').offsetWidth;

            this.$emit('innerWidthDefined', this.innerWidth);
        },

        methods: {
            changeLang(lang) {
                this.mainLang = lang;
                const mainLang = lang == 1 ? 'uz' : 'ru';

                this.$store.commit('SET_MAIN_LANG', mainLang);
                Cookies.set('lang', mainLang);
                document.location.reload();
            },

            handleCommand(command) {
                this.$store.commit('SET_PROFILE_ACTIVE_TAB', command);

                if (command == 5) {
                    Cookies.remove('userInfo');
                    this.$store.commit('CLEAR_USER_INFO');
                    this.$notify({
                        type: 'success',
                        title: this.$t('basic.success'),
                        message: this.$t('basic.loged_out'),
                        duration: 3000
                    })

                    this.$router.push({
                        path: '/'
                    });
                    return;
                }

                if (this.$route.path != '/profile') {
                    this.$router.push({
                        name: 'profile'
                    });
                }
            },

            oldAllCategories() {
                const items = localStorage.getItem('allCategories');

                this.categories.all = items ? JSON.parse(items) : [];
            },

            getCategories() {
                const metadata = {
                    url: 'categories',
                    params: {
                        lang: this.$store.state.mainLang
                    },
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        let tags = [];
                        let rootCategories = response.filter(data => {
                            return data.parentId === null;
                        });

                        rootCategories.forEach(category => { // set every category`s sub category

                            category.subCategory = response.filter(data => {
                                return data.parentId === category.id;
                            });
                        })

                        for (let index = 0; index < this.categories.extraProperties.iconColor.length; index++) {
                            const iconColor = this.categories.extraProperties.iconColor[index];
                            const iconClass = this.categories.extraProperties.iconClass[index];

                            rootCategories[index].iconColor = iconColor;
                            rootCategories[index].iconClass = iconClass;
                        }

                        for (let index = 0; index < rootCategories.length; index++) {
                            const element = rootCategories[index];

                            tags.push(element.name);
                        }

                        this.categories.all = rootCategories;

                        localStorage.setItem('allCategories', JSON.stringify(this.categories.all));

                        this.categories.top = rootCategories.slice(0, 4);
                        this.categories.middle = rootCategories.slice(4, 8);
                        this.categories.bottom = rootCategories.slice(8);


                        this.$store.commit('SET_MOBILE_CATEGORIES', this.categories);
                        this.$store.commit('SET_TAGS', tags);

                        setTimeout(() => {
                            for (let index = 0; index < this.categories.all.length; index++) {
                                document.getElementById('category' + index).addEventListener('mouseenter',
                                () => {
                                    document.getElementById('image' + index).style = 'background:' +
                                        this.categoryColors[Math.floor(Math.random() * this
                                            .categoryColors.length)];;
                                });

                                document.getElementById('category' + index).addEventListener('mouseleave',
                                () => {
                                    document.getElementById('image' + index).style =
                                        'background: #F2F4F4';
                                });
                            }
                        }, 1000);
                    })
            },

            adClick() {
                // window.open(item.url);
                this.$router.push({
                    path: 'categories'
                });
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

            makeBreadcrumb(items) {

                let names = '';

                for (let index = 0; index < items.length - 1; index++) {
                    const element = items[index];

                    names += element.justName ? element.justName : element.name;

                    if (index != items.length - 1) {
                        names += ' / ';
                    }
                }
                return names;
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

            wholeCategorySelected(item) {

                let tags = [];

                if (item.tags) {
                    tags = item.parentCategoryTags.split(',')
                }
                this.$store.commit('SET_TAGS', tags);
                this.$router.push({
                    name: 'products'
                });

                this.searchProduct();
                this.$store.commit('SET_PRODUCT_DATA', {
                    categoryId: [item.parentCategoryId]
                });
            },

            wholeCategorySelected2(item) {
                let tags = [];

                if (item.parentCategoryTags) {
                    tags = item.parentCategoryTags.split(',')
                }
                this.$store.commit('SET_TAGS', tags);


                this.searchProduct();
                this.$store.commit('SET_PRODUCT_DATA', {
                    categoryId: [item.id]
                });

                if (this.$route.name != 'products') {
                    this.$router.push({
                        name: 'products'
                    });
                } else {
                    this.$router.push({
                        name: 'home'
                    });
                    setTimeout(() => {
                        this.$router.push({
                            name: 'products'
                        });
                    }, 100)
                }
            },

            wholeCategorySelected3(item) {

                let tags = [];

                if (item.parentCategoryTags) {
                    tags = item.parentCategoryTags.split(',')
                }
                this.$store.commit('SET_TAGS', tags);
                this.$router.push({
                    name: 'products'
                });

                this.searchProduct();
                //this.$store.commit('SET_MOBILE_FILTER_FORM', {categories: [...this.categories.breadcrumb]});
                this.$store.commit('SET_MOBILE_FILTER_FORM', {
                    categories: [item]
                });
            },

            searchProduct() {
                if (this.$route.path != '/products') {
                    this.$router.push({
                        name: 'products'
                    });
                } else {
                    this.$router.push({
                        name: 'home'
                    });
                    setTimeout(() => {
                        this.$router.push({
                            name: 'products'
                        });
                    }, 100)
                }

                let regionIds = [];
                if (this.regions.selected.id) {
                    regionIds.push(this.regions.selected.id);

                    if (this.regions.selected.parent.id) {
                        regionIds.push(this.regions.selected.parent.id);
                    }
                }

                const payload = {
                    regionName: this.regions.selected.name,
                    search: this.searchData,
                    regionId: regionIds.length > 0 ? regionIds : null,
                }

                this.$store.commit('SET_PRODUCT_DATA', {
                    categoryId: 0
                });

                this.$store.commit('SET_PRODUCT_DATA', payload);
            },

            categorySelected(item) {
                ;
                this.$router.push({
                    name: 'products'
                });

                let tags = [];

                if (item.tags) {
                    tags = item.tags.split(',')
                }
                this.$store.commit('SET_TAGS', tags);

                this.searchProduct();
                setTimeout(() => {
                    this.$store.commit('SET_PRODUCT_DATA', {
                        categoryId: [item.parentId, item.id]
                    });
                }, 500);
            },

            clearSelectedRegion() {
                this.regions.checkSelected = false;

                this.regions.activeHeader.name = 'Butun O`zbekiston';
                this.regions.activeHeader.name2 = 'Butun O`zbekiston';
                this.regions.activeHeader.id = null;
                this.regions.activeHeader.parentId = null;

                this.regions.selected.name = 'Butun O`zbekiston';
                this.regions.selected.id = null;
                this.regions.selected.parentId = null;

                this.regions.active = this.regions.all.filter(data => {
                    return !data.parentId || data.parentId == 0
                })
            },

            openSubCategories(category, target) {

                if (this.categories.activeSubCategory.parentCategoryTitle === category.name) {
                    this.categories.showTopSubCategories = false;
                    this.categories.showMiddleSubCategories = false;
                    this.categories.showBottomSubCategories = false;

                    this.categories.activeSubCategory.rowNumber = 0;
                    this.categories.activeSubCategory.parentCategoryTitle = '';
                    this.categories.activeSubCategory.items = [];

                    return;
                }

                this.categories.activeSubCategory.parentCategoryId = category.id;
                this.categories.activeSubCategory.parentCategoryTitle = category.name;
                this.categories.activeSubCategory.parentCategoryTags = category.tags;
                this.categories.activeSubCategory.items = category.subCategory;

                if (target === this.categories.activeSubCategory.rowNumber) {
                    return;
                }

                this.categories.activeSubCategory.rowNumber = target;

                if (target == 1) {
                    this.categories.showTopSubCategories = !this.categories.showTopSubCategories;
                    this.categories.showMiddleSubCategories = false;
                    this.categories.showBottomSubCategories = false;
                } else if (target == 2) {
                    this.categories.showMiddleSubCategories = !this.categories.showMiddleSubCategories;
                    this.categories.showTopSubCategories = false;
                    this.categories.showBottomSubCategories = false;
                } else {
                    this.categories.showBottomSubCategories = !this.categories.showBottomSubCategories;
                    this.categories.showTopSubCategories = false;
                    this.categories.showMiddleSubCategories = false;
                }

            },

            getRegions() {
                const metadata = {
                    url: 'regions',
                    params: {
                        lang: this.$store.state.mainLang
                    }
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {

                        this.regions.all = response;

                        this.regions.active = response.filter(data => {
                            return !data.parentId || data.parentId == 0
                        })

                        this.regions.active.forEach(element => {
                            element.sub = this.regions.all.filter(data => {
                                return data.parentId === element.id
                            })
                        });

                        this.regions.activeHeader.name = this.$t('basic.whole_country');
                        this.regions.activeHeader.id = null;
                        this.regions.activeHeader.parentId = null;

                        this.regions.selected.name = this.$t('basic.whole_country');
                        this.regions.selected.id = null;
                        this.regions.selected.parentId = null;

                        this.regions.isRoot = true;
                    })
            },

            onParentRegionSelected(item) {
                this.regions.selected = {
                    id: item.id,
                    parentId: item.parentId,
                    name: item.name,

                    parent: {
                        id: '',
                        parentId: '',
                        name: ''
                    }
                }

                document.getElementById('selectRegion').click();
                this.regions.checkSelected = true;
            },

            onRegionSelected(item, direction) {
                if (item.id === null) { // the whole country
                    document.getElementById('selectRegion').click();
                    this.regions.checkSelected = true;
                    this.clearSelectedRegion();
                    this.regions.isRoot = true;
                }

                if (direction === 1) {
                    if (item.sub) {

                        this.regions.isRoot = false;
                        this.regions.active = item.sub;

                        this.regions.activeHeader = {
                            id: item.id,
                            parentId: item.parentId,
                            name: item.name,
                            name2: 'Viloyatni o`zgartirsh'
                        }

                        this.regions.parent = item;

                        if (!item.sub.length > 0) {
                            setTimeout(() => {
                                document.getElementById('parentRegion').click();

                                document.getElementById('changeRegion').click();
                            }, 500)
                        }
                    } else {
                        this.regions.isRoot = true;
                        this.regions.selected = {
                            id: item.id,
                            parentId: item.parentId,
                            name: item.name + ', ' + this.regions.activeHeader.name,

                            parent: {
                                id: this.regions.activeHeader.id,
                                parentId: this.regions.activeHeader.id,
                                name: this.regions.activeHeader.name
                            }
                        }

                        //document.getElementById('selectRegion').focus();
                        document.getElementById('selectRegion').click();
                        this.regions.checkSelected = true;

                        return;
                    }
                } else {
                    this.regions.isRoot = true;
                    this.regions.active = this.regions.all.filter(data => {
                        return !data.parentId || data.parentId == 0
                    })

                    this.regions.activeHeader = {
                        id: null,
                        parentId: null,
                        name: 'Butun O`zbekiston',
                        name2: 'Butun O`zbekiston'
                    };
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '../custom.scss';
    .el-input__icon {
    height: 100%;
    width: 25px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
    line-height: 40px;
    font-family: 'element-icons' !important;
    speak: none;
    color: #23d59a;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
}

    .el-carousel__container {
        height: 100% !important;
    }

    .slide {
        cursor: pointer;
        /*height: 175px;*/
        background: #2c3e50;
        border-radius: 20px;
    }

    .prev-btn1 {
        left: 20%;
        right: auto;
    }

    .next-btn1 {
        right: 20%;
        left: auto;
    }

    .swiper-container {
        margin: .5rem !important;
        padding: 5px 0;
    }

    .swiper-wrapper {
        display: flex !important;
        align-items: center !important;
    }

    .swiper-button-prev,
    .swiper-button-next {
        /*top: 60%;*/
        top: 60% !important;
        width: 27px;
        height: 24px;
    }

    .swiper-button-prev {
        left: -1%;
    }

    .swiper-button-next {
        right: -1%;
    }

    .swiper-slide {
        margin-right: 10px !important;
    }

    .category-box {
        display: flex;
        justify-content: center;
        cursor: pointer;

        .category-image {
            border-radius: 50%;
            background: #ebebeb;
            width: 93px;
            height: 93px;
            display: flex;
            align-items: center;
            jusify-content: center;
            transition: background .5s;
        }

        .category-title {
            text-align: center;
            width: 100%;
            z-index: 9;
            background: #ffffff;
            position: relative;


            color: #394B4C;
            transition: color .5s;
        }

        &:hover .category-title {
            color: #121313;
        }
    }

    @media screen and (max-width: 992px) {
        .category-box {
            display: flex;
            justify-content: center;

            .category-image {
                display: flex;
                width: 65px;
                height: 65px;
            }

            .category-title {
                top: -0.4rem;
                padding-top: 0.3rem;
                font-size: 10px;
            }
        }
    }


    .header-region {
        cursor: pointer;
    }

    .header-region:hover {
        text-decoration: underline;
    }

    .region {
        cursor: pointer;
        padding: 0.5rem 0;

        i {
            color: $primary-color;
            float: right;
        }

        &:hover {
            background: $primary-color;
            color: #ffffff;

            i {
                color: #ffffff;
            }
        }
    }

    .category-header {
        cursor: pointer;
        display: flex;

        span.see-all {
            color: $primary-color;
        }

        span:last-child {
            margin-left: .1rem;
            color: gray;

            margin-left: .5rem;
        }

        &:hover i {
            color: #ffffff;
        }

        &:hover span.see-all {
            color: #ffffff;
            background: $primary-color;
        }
    }

    .category-item {
        color: $primary-color;
        cursor: pointer;

        margin-bottom: 1rem;

        span {
            margin-left: .1rem;
        }

        &:hover span {
            color: #ffffff;
            background: $primary-color;
        }
    }

    .category {
        cursor: pointer;
        margin-top: 1rem;

        div:first-child {
            border-radius: 50%;
            background: #ffffff;
            padding: 13px;
        }

        div:last-child {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: .5rem;

            span {
                color: $primary-color;
            }
        }
    }

    .category:hover {
        div:last-child {
            span {
                color: #ffffff;
                background: $primary-color;
            }
        }
    }

    .el-carousel__container {
        height: 470px !important;
    }

    @media screen and (max-width: 992px) {
        .el-carousel__container {
            height: 170px !important;
        }
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>