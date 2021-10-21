<template>
    <el-container direction="vertical" style="margin: 1rem;">
        <div v-if="!inDetailMode">
            <el-row type="flex" justify="space-between">
                <el-button icon="el-icon-arrow-left" @click="$router.push({path: '/'})" type="text">
                    {{$t('basic.back')}}
                </el-button>
                <el-button v-if="addTypeData==4" @click="unfavouriteAll" type="primary" size="mini">
                    {{$t('basic.unfav_all')}}
                </el-button>
            </el-row>

            <el-row v-loading="loading" style="flex-wrap: wrap;" type="flex" justify="start">
                <el-col style="margin-top: .5rem" :span="24" v-for="item in items" :key="item.id">
                    <el-card :body-style="{ padding: '0px' }">
                        <img @click="toDetails(item.id)" style="cursor: pointer;" width="100%" height="150"
                             :src="item.images && item.images.length > 0 ? $serverImageUrl + item.images[0] : require('@/assets/no-image-icon.png')"
                             class="image">
                        <div style="padding: 14px; background: #FDEBD0">
                            <span @click="toDetails(item.id)" class="text">{{item.name}}</span>
                            <div style="margin-top: 1rem">
                                <span>{{item.price}} {{item.currency.name}}</span>
                                <el-tooltip v-if="addTypeData==4" :content="$t('basic.take_from_favourites')"
                                            placement="top-start" effect="light">
                                    <i @click="takeFromFavourites(item.id)" style="font-size: 1.5rem; float: right"
                                       class="el-icon-star-on star-icon"></i>
                                </el-tooltip>

                                <el-button @click="seeInDetail(item)" icon="el-icon-array-right" type="primary"
                                           size="mini" style="float: right;">{{$t('basic.in_detail')}}...
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <el-pagination
                    v-if="totalitemsNumber > size"
                    @current-change="onCurrentPageChange"
                    background
                    layout="prev, pager, next"
                    :total="totalitemsNumber">
            </el-pagination>
        </div>

        <div v-else-if="details">
            <el-row>
                <el-button icon="el-icon-arrow-left" style="float: left" @click="backToItems" type="text">
                    {{$t('basic.back')}}
                </el-button>
            </el-row>

            <el-row>
                <span style="font-size: 14px;">{{details.categoriesTitles}}</span>
            </el-row>

            <el-row v-if="details.product.isOwner" :gutter="10" type="flex" justify="center"
                    style="margin: 0.5rem 0.5rem">
                <el-col>
                    <el-button style="width: 100%" size="mini" :disabled="type != 1" v-if="details.product.isTop == 0"
                               @click="openTariffsDialog(scope.row)" type="primary">{{$t('basic.upgrade')}}
                    </el-button>
                    <el-button style="width: 100%" size="small" type="success" v-else disabled>
                        {{$t('basic.upgraded')}}
                    </el-button>
                </el-col>
                <el-col>
                    <el-button style="width: 100%" size="mini" @click="seeDetails(details.product)"
                               icon="el-icon-s-order">
                        <span class="text" style="font-size: 12px">{{$t('basic.see')}}</span>
                    </el-button>
                </el-col>
            </el-row>

            <el-row v-if="details.product.isOwner" :gutter="10" type="flex" justify="center" style="margin: 0.5rem">
                <el-col>
                    <el-button style="width: 100%" size="mini" @click="editItem(details.product)"
                               icon="el-icon-edit-outline">
                        <span class="text" style="font-size: 12px">{{$t('basic.edit')}}</span>
                    </el-button>
                </el-col>
                <el-col>
                    <el-button size="mini" @click="deleteItem(details.product)" style="color: #EC7063; width: 100%"
                               icon="el-icon-delete">
                        <span class="text" style="font-size: 12px; color: #EC7063">{{$t('basic.delete')}}</span>
                    </el-button>
                </el-col>
            </el-row>

            <el-row type="flex" :gutter="10" justify="space-between"
                    style="margin: 0.5rem; border-bottom: 1px solid #729F40; padding-bottom: .3rem">
                <el-col>
                    <span>{{$t('advertise.price')}}</span>
                </el-col>
                <el-col>
                    <div style="float: right">
                        <span>{{details.product.price}}</span>
                        <span> {{$t('advertise.soum')}}</span>
                    </div>
                </el-col>
            </el-row>

            <el-row type="flex" :gutter="10" justify="space-between"
                    style="margin: 0.5rem; border-bottom: 1px solid #729F40; padding-bottom: .3rem">
                <el-col>
                    <span>{{$t('basic.ad_number')}}</span>
                </el-col>
                <el-col>
                    <div style="float: right">
                        <span>{{details.product.id}}</span>
                    </div>
                </el-col>
            </el-row>

            <el-row type="flex" :gutter="10" justify="space-between"
                    style="margin: 0.5rem; border-bottom: 1px solid #729F40; padding-bottom: .3rem">
                <el-col>
                    <span>{{$t('basic.added')}}</span>
                </el-col>
                <el-col>
                    <div style="float: right">
                        <span>{{details.product.date | toTime}}</span>
                    </div>
                </el-col>
            </el-row>

            <el-row type="flex" :gutter="10" justify="space-between"
                    style="margin: 0.5rem; border-bottom: 1px solid #729F40; padding-bottom: .3rem">
                <el-col>
                    <span>{{$t('basic.faved_count')}}</span>
                </el-col>
                <el-col>
                    <div style="float: right">
                        <span>{{details.product.favouriteCount}}</span>
                        <span>{{interestedCount}}</span>
                    </div>
                </el-col>
            </el-row>

            <!-- ordinary -->
            <el-row v-if="extras.ordinary" :gutter="20" type="flex" style="flex-wrap: wrap">
                <el-col :span="24" v-for="extra in extras.ordinary" :key="extra.id">
                    <el-row class="extra" type="flex" justify="space-between"
                            style=" margin: .5rem; border-bottom: 1px solid #729F40; padding-bottom: .3rem">
                        <el-col>
                            <span style="margin-left: .5rem">{{extra.name}}</span>
                        </el-col>
                        <el-col>
                            <div style="float: right; margin-right: 0.5rem">
                                <span class="extra-value">{{extra.value}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <!-- custom -->
            <el-row v-if="extras.custom" :gutter="20" type="flex" style="flex-wrap: wrap;">
                <el-col :span="24" v-for="extra in extras.custom" :key="extra.id">
                    <el-row class="extra" type="flex" justify="space-between"
                            style="margin: .5rem; border-bottom: 1px solid #729F40; padding-bottom: .3rem">
                        <el-col>
                            <span class="extra-name">{{extra.name}}</span>
                        </el-col>
                        <el-col>
                            <div style="float: right; margin-right: 0.5rem">
                                <span class="extra-value">{{extra.custom[extra.value]}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-dialog :visible.sync="upgradeDialogVisible">
                <el-row :gutter="10" :key="updateTariffsKey">
                    <el-col :xs="20" :sm="20" :md="8" :lg="8" style="margin-top: 0rem;" v-for="tariff in tariffs"
                            :key="tariff.id">
                        <div @click="selectTariff(tariff)">
                            <el-card :body-style="{ padding: '0px' }" :shadow="tariff.shadow"
                                     :style="`cursor: pointer; height: 16.5rem;`">
                                <div slot="header" class="clearfix">
                                    <span>{{tariff.title}}</span>
                                </div>

                                <img height="125" width="125" :src="$serverImageUrl + tariff.image" class="image">

                                <div class="text">
                                    <div>
                                        <span>{{$t('advertise.price')}}: </span> {{tariff.price}}
                                        {{$t('advertise.soum')}}
                                    </div>

                                    <div>
                                        <span>{{$t('advertise.day')}}: </span> <span> {{tariff.days}} {{$t('advertise.day')}} </span>
                                    </div>
                                </div>

                                <div style="float: right;  margin-right: 5px">
                                    <transition name="el-zoom-in-center">
                                        <div v-show="tariff.selected">
                                            <el-button circle type="success" icon="el-icon-check"></el-button>
                                        </div>
                                    </transition>
                                </div>
                            </el-card>
                        </div>
                    </el-col>

                    <el-button @click="upgradeAdvertisement" type="primary" size="medium"
                               style="float: right; margin-top: 1rem">upgrade
                    </el-button>
                </el-row>
            </el-dialog>

        </div>
    </el-container>
</template>

<script>
    import {Message} from 'element-ui'
    import Swal from 'sweetalert2'
    import NProgress from 'nprogress' // progress bar
    import 'nprogress/nprogress.css' // progress bar style
    import Cookies from 'js-cookie'

    export default {
        props: {
            /* 1 -> active, 2 -> inactive, 3 -> not confirmed, 4 -> favourites */
            adType: {
                type: String | Number,
                required: false
            },
        },

        data() {
            return {
                addTypeData: 1,
                updateTariffsKey: 0,

                details: null,

                interestedCount: 0,

                extras: {
                    custom: null,
                    ordinary: null
                },

                tariffs: [],
                search: '',

                selectedTariff: {},
                selectedAdvertisement: {},

                upgradeDialogVisible: false,

                inDetailMode: false,

                loading: false,

                totalitemsNumber: 0,
                items: [],

                mode: 0, // 0 -> list, 1 -> gallery

                size: 10,
                offset: 0
            }
        },

        mounted() {
            this.getItems();
        },

        methods: {
            seeDetails(item) {
                this.$router.push({name: 'product', params: {id: item.id}});
            },

            editItem(item) {
                this.$router.push({name: 'makeannouncement', params: {adId: item.id}});
            },

            deleteItem(item) {
                Swal.fire({
                    title: this.$t('basic.are_you_sure'),
                    text: this.$t('basic.no_return'),
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: this.$t('basic.cancel'),
                    confirmButtonText: this.$t('basic.delete')
                }).then((result) => {
                    if (result.value) {
                        const metadata = {
                            url: 'ad',
                            method: 'delete',
                            data: {
                                'id': item.id
                            }
                        }

                        this.$store.dispatch('setData', metadata)
                            .then(response => {
                                Swal.fire(
                                    this.$t('basic.deleted'),
                                    this.$t('basic.item_deleted'),
                                    'success'
                                )

                                this.getAdvertisements(this.type, this.size, this.offset);
                            })
                            .catch(exception => {
                                // console.log('EXCEPTION')
                            })
                    }
                })
            },

            getUserInfo() {
                const metadata = {
                    url: 'user',
                    params: null,
                    token: this.$store.state.userInfo.token
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        // updating only balance since here only a tariff can be selected and cause balance to change
                        const payload = {
                            balance: response.balance
                        }

                        let userInfo = Cookies.getJSON('userInfo');

                        userInfo.balance = response.balance;

                        Cookies.set('userInfo', userInfo);

                        this.$store.commit('SET_USER_INFO', payload);

                    })
            },

            selectTariff(item) {

                for (let index = 0; index < this.tariffs.length; index++) {
                    const tariff = this.tariffs[index];

                    tariff.shadow = 'hover';
                    tariff.selected = false;
                }

                item.selected = !item.selected;
                item.shadow = 'always';

                this.selectedTariff = item;

                this.updateTariffsKey++;
            },

            getTariffs() {
                const metadata = {
                    url: 'rates',
                    params: null,
                    token: this.$store.state.userInfo.token
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.tariffs = response;

                        this.tariffs.forEach(tariff => {
                            tariff.selected = false;
                            tariff.shadow = 'hover';
                        })
                        this.tariffs[0].selected = true;
                        this.tariffs[0].shadow = 'always';

                    })
                    .catch(error => {

                    })
                    .finally(() => {

                    })
            },

            getProduct(id) {
                this.loading = true;

                NProgress.start();
                const metadata = {
                    url: 'product',
                    params: {
                        productId: id,
                        lang: this.$store.state.mainLang
                    }
                }

                const token = Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null;
                // console.log("TOKEN");
                // console.log(token);

                if (token && token.length > 0) {
                    metadata.url += '/token';
                    metadata.token = token
                }


                this.$store.dispatch('getData', metadata)
                    .then(response => {

                        this.details = response;

                        this.details.regionsTitles = response.regions.map(data => {
                            return data.name
                        }).join(' / ');

                        this.details.categoriesTitles = response.categories.map(data => {
                            return data.name
                        }).join(' / ');

                        this.extras.custom = response.extras.filter(data => {
                            return data.type == 3;
                        })

                        this.extras.ordinary = response.extras.filter(data => {
                            return data.type != 3;
                        })
                    })
                    .catch(error => {
                        // console.log(error);
                    })
                    .finally(() => {
                        NProgress.done();
                        this.loading = false;
                    })
            },

            upgradeAdvertisement() {

                if (this.$store.state.userInfo.balance < this.selectedTariff.price) {
                    Message({
                        type: 'warning',
                        message: this.$t('basic.not_enough_money'),
                        duration: 4000
                    })

                    setTimeout(() => {
                        this.$emit('not-enough-money')
                    }, 1500)
                    return;
                }

                this.loading = true;

                const metadata = {
                    url: 'addtop',
                    data: {
                        id: this.selectedAdvertisement.id,
                        rateId: this.selectedTariff.id
                    },
                    method: 'post'
                }

                this.$store.dispatch('setData', metadata)
                    .then(response => {

                        Message({
                            type: 'success',
                            message: this.$t('basic.ad_upgraded'),
                            duration: 4000
                        })

                        this.getUserInfo();

                        this.closeTarrifsDialog();
                        this.getAdvertisements(this.type, this.size, this.offset, this.search);

                    })
                    .catch(error => {

                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },

            seeInDetail(item) {
                this.inDetailMode = true;
                this.interestedCount = item.interestedCount;

                this.getProduct(item.id);
            },

            backToItems() {
                this.getItems();
                this.inDetailMode = false;
            },

            unfavouriteAll() {
                this.loading = true;

                const metadata = {
                    url: 'favourites',
                    data: null,
                    method: 'delete'
                }

                this.$store.dispatch('setData', metadata)
                    .then(response => {

                        Message({
                            type: 'success',
                            message: this.$t('basic.unfaved_all')
                        })

                        this.getItems();

                    })
                    .catch(error => {
                        Message({
                            type: 'error',
                            message: this.$t('basic.server_error')
                        })
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },

            toDetails(id) {
                this.$router.push({name: 'product', params: {id}});
            },

            takeFromFavourites(id) {
                this.loading = true;
                const metadata = {
                    url: 'favourites',
                    data: {
                        productId: id
                    },
                    method: 'post'
                }

                this.$store.dispatch('setData', metadata)
                    .then(response => {
                        Message({
                            type: 'success',
                            message: this.$t('basic.taken_from_favs')
                        })
                        this.getFavourites();
                    })
                    .catch(error => {
                        Message({
                            type: 'error',
                            message: this.$t('basic.server_error'),
                            duration: 4000
                        })
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },

            onCurrentPageChange(page) {
                this.offset = (page - 1) * this.size;

                this.getItems(this.size, this.offset);
            },

            getItems(size = this.size, offset = this.offset) {
                this.loading = true;

                const metadata = {
                    url: 'products/user',
                    params: {
                        size,
                        offset,
                        lang: this.$store.state.mainLang
                    },
                    token: this.$store.state.userInfo.token
                }

                switch (this.addTypeData) {
                    case 1:
                        metadata.params.isActive = 1;
                        break;

                    case 2:
                        metadata.params.isActive = 0;
                        break;

                    case 3:
                        metadata.params.isActive = null;
                        metadata.params.isApproved = 0;
                        break;

                    case 4:
                        metadata.url = 'favourites';
                        break;
                }


                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.totalitemsNumber = response.count;
                        this.items = response.productList;

                        if (this.addTypeData == 4) {
                            this.items.forEach(element => {
                                element.categoriesNames = element.categories.map(data => {
                                    return data.name;
                                }).join(' / ');
                            });
                        }
                    })
                    .catch(error => {
                        // console.log(error)
                        Message({
                            type: 'error',
                            message: this.$t('basic.server_error'),
                            duration: 4000
                        })
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            }
        },

        watch: {
            adType() {
                this.addTypeData = this.adType;
            },
            '$store.state.addAds': function () {
                console.log(' store add ytpe change')
                this.addTypeData = this.$store.state.addAds;
                console.log(this.addTypeData)
                /*this.$router.push({params: {adType: this.$store.state.addAds}})*/
            },
            addTypeData(){
                this.getItems()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../custom.scss';

    .favourites {
        color: $primary-color;
    }

    .star-icon {
        cursor: pointer;
        color: #0098D0;

        &:hover {
            color: #5D6D7E;
        }
    }
</style>