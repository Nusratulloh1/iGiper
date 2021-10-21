<template>
    <div>
        <el-row type="flex" justify="space-between" >
            <el-button @click="handleBackClick" v-if="!categories.isRoot"  type="text" icon="el-icon-arrow-left" style="padding: 8px 0;">{{$t('basic.back')}}</el-button>
        </el-row>

        <div v-if="!categories.isRoot"
             @click="toProdcts(categories.extraItem, true)"
             style="display: flex; justify-content: space-between; border-bottom: 1px #ABABAB solid; padding-bottom: 6px; font-size: 1rem;"
        >
            <div style="display: flex; align-items: center; margin-left: .5rem">
                <span>{{categories.extraItem.name}}</span>
            </div>

            <div v-if="false">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

<!--        <div style="display: flex; justify-content: space-between; border-bottom: 1px #ABABAB solid; padding: 1rem 0" v-for="category in categories.items" :key="category.id" @click="handleCategoryClick(category)">-->
<!--            <div style="display: flex; align-items: center; margin-left: .5rem">-->
<!--                <div v-if="categories.isRoot" style="width: 2.2rem">-->
<!--                    <i :style="`color: ${category.iconColor}; font-size: 22px; margin-right: .5rem`" :class="category.iconClass"></i>-->
<!--                </div>-->
<!--                <span>{{category.name}}</span>-->
<!--            </div>-->
<!--            <div v-if="!category.isLast">-->
<!--                <i class="el-icon-arrow-right"></i>-->
<!--            </div>-->
<!--        </div>-->
        <el-row style="display: flex; justify-content: center; align-items: center;">
            <el-col :span="3" style="display: flex; justify-content: center; align-items: center;">
                <el-button circle style="width: 2.2rem; height: 2.2rem; padding: 6.8px; font-size: 1rem; background: #01BFA5; color: white;" @click="$router.push({name: 'sidebar'})" icon="el-icon-s-grid"></el-button>
            </el-col>
            <el-col :span="21">
                <swiper :options="swiperOptions" style="margin: 0 1rem; position: relative; z-index: 1;">
                    <swiper-slide v-for="category in categories.items"
                                  :key="category.id"
                                  style="display: flex; justify-content: center; border-radius: 100px; box-shadow: 0 0 5px rgba(109,131,142,0.51);"
                    >
                        <div @click="handleCategoryClick(category)"
                         style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px 8px 14px">
                            <div 
                            style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
<!--                                <div v-if="categories.isRoot" style="display: flex; justify-content: center;">-->
<!--                                    <i :style="`color: ${category.iconColor}; font-size: 20px;`" :class="category.iconClass"></i>-->
<!--                                </div>-->

                                <div style="font-size: 1.1rem; font-weight: 700; text-align: center; color: #19b97d;">{{category.name}}</div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'

    export default {
        name: 'categories',
        props: {
            from: {
                type: String,
                default: 'filter'
            },
        },
        components: {
            swiper,
            swiperSlide,
        },
        data () {
            return {
                swiperOptions: {
                    autoplay: {
                        delay: 20000,
                        disableOnInteraction: false
                    },
                    slidesPerView: 2.14,
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
                categories: {
                    itemParent: '',
                    isRoot: true,
                    items: [],
                    breadcrumb: [],

                    extraItem: {
                        name: '',
                        iconClass: 'el-icon-plus',
                        iconColor: '#63A053'
                    },

                    extraProperties: {
                        iconColor: ['#0098D0', '#22B8CF', '#58b86a', '#b54cac', '#ad4742', '#c99d3c', '#dae329', '#89e329', '#283b13', '#349459', '#23386b', '#6b3f8f'],
                        iconClass: ['fas fa-car', 'fas fa-suitcase-rolling', 'fas fa-suitcase-rolling', 'fas fa-hammer', 'fas fa-campground', 'fas fa-campground', 'fas fa-desktop', 'fas fa-football-ball', 'fas fa-paw', 'fas fa-campground', 'fas fa-campground', 'fas fa-campground'],
                    }
                },
            }
        },

        mounted () {
            // console.log(this.from);
            this.getCategories();
        },

        methods: {
            cancel () {
                this.$store.commit('SET_MOBILE_FILTER_FORM', {categories: []});
                this.$router.push({name: 'this.from'});
            },

            handleBackClick (toProducts=false) {
                if (this.$route.path!=='/categories') {
                    const item = this.categories.breadcrumb.pop();

                    this.getCategories(item.parentId ? item.parentId : 0);

                    if (this.categories.breadcrumb.length > 0) {
                        const itemParent = [...this.categories.breadcrumb].pop();

                        this.categories.extraItem = itemParent;
                        this.categories.extraItem.justName = itemParent.name;

                        this.categories.extraItem.name = this.mainLang == 1 ? (itemParent.name + ' ruknidagi barcha e`lonlar') : ('Bсё в рубрике ' + itemParent.name);
                    }
                }else {

                    this.$store.commit('SET_MOBILE_FILTER_FORM', {categories: []});
                    this.$router.push({name: 'filter'});
                }
            },

            toProdcts(category, isExtraItem=false) {

                this.categories.breadcrumb.forEach(data => {
                    if (data.justName) {
                        data.name= data.justName;
                    }
                })

                this.$store.commit('SET_MOBILE_FILTER_FORM', {categories: [...this.categories.breadcrumb]});
                this.$router.push({name: this.from});
            },

            getCategories (id=0) {
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
                        console.log(this.categories.items)

                        if (id == 0) {
                            this.categories.isRoot = true;
                            for (let index = 0; index < 12; index++) {
                                this.categories.items[index].iconColor = this.categories.extraProperties.iconColor[index];
                                this.categories.items[index].iconClass = this.categories.extraProperties.iconClass[index];
                            }
                        }
                    })
            },

            handleCategoryClick(category) {
                this.categories.breadcrumb.push(category);

                if (!category.isLast){
                    this.getCategories(category.id);
                    this.categories.extraItem = category;
                    this.categories.extraItem.justName = category.name;
                    this.categories.extraItem.name = this.$store.state.mainLang == 'uz' ? (category.name + ' ruknidagi barcha e`lonlar') : ('Bсё в рубрике ' + category.name);
                }else {
                    this.$store.commit('SET_MOBILE_FILTER_FORM', {categories: [...this.categories.breadcrumb]});
                    this.$router.push({name: this.from});
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .swiper-container {
        margin: .3rem !important;
        padding: 5px 4px;
    }

    .swiper-wrapper {
        display: flex !important;
        align-items: center !important;
    }

    .swiper-slide {
        width: auto !important;
        min-width: 130px;
    }
</style>