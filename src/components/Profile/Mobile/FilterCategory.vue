<template>
    <div>
        <el-row type="flex" justify="space-between" style="margin: .5rem">
            <el-button @click="cancel" v-if="categories.isRoot" type="text">{{$t('basic.cancel')}}</el-button>
            <el-button @click="handleBackClick" type="text" icon="el-icon-arrow-left" v-else>{{$t('basic.back')}}</el-button>
        </el-row>

        <div v-if="!categories.isRoot" @click="toProdcts(categories.extraItem, true)" style="display: flex; justify-content: space-between; border-bottom: 1px #ABABAB solid; padding: 1rem 0; maring-top: .5rem">
            <div style="display: flex; align-items: center; margin-left: .5rem">
                <span>{{categories.extraItem.name}}</span>
            </div>

            <div v-if="false">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; border-bottom: 1px #ABABAB solid; padding: 1rem 0" v-for="category in categories.items" :key="category.id" @click="handleCategoryClick(category)">
            <div style="display: flex; align-items: center; margin-left: .5rem">
                <div v-if="categories.isRoot" style="width: 2.2rem">
                    <i :style="`color: ${category.iconColor}; font-size: 22px; margin-right: .5rem`" :class="category.iconClass"></i>
                </div>
                <span>{{category.name}}</span>
            </div>
            <div v-if="!category.isLast">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FilterCategory",
        props: {
            from: {
                type: String,
                default: 'filter'
            },
        },
        data () {
            return {
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
                this.$router.push({name: this.from});
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
                console.log(this.categories.breadcrumb)

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

<style>

</style>