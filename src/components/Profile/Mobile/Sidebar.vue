<template>
    <div class="mx-2 my-1 hidden-md-and-up">
        <el-row class="tac">
            <el-col :span="24">
                <h6><b><i class="el-icon-close" @click="$router.push({path: '/'})"></i>{{$t('basic.ordinary_ads')}} Категория</b></h6>
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose">
                    <el-submenu :index="`${number}`"
                                v-for="(category, number) in categories.items"
                                :key="category.id"
                    >
                        <template slot="title">
                            <span @click="handleCategoryClick(category)">{{ category.name }}</span>
                        </template>

                        <el-menu-item index="1-2" v-for="categorys in childCategories">{{categorys.name}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Sidebar",
        props: {
            from: {
                type: String,
                default: 'filter'
            },
        },
        data () {
            return {
                childCategories: [],
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
        components: {

        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
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
                    this.childCategories = this.categories;
                }
            },
        },
        mounted () {
            // console.log(this.from);
            this.getCategories();
        }
    }
</script>

<style lang="scss" scoped>
    el-submenu__title {
        padding: 0 10px !important;
        padding-left: 12px !important;
    }
    .el-menu-item {
        padding: 0 10px;
        padding-left: 25px !important;
    }
</style>