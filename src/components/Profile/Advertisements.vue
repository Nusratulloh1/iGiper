<template>
    <div>
        <el-container direction="vertical" class="hidden-sm-and-down">
            <el-row type="flex" justify="space-between">
                <el-col>
                    <el-radio-group size="medium" v-model="type">
                        <el-radio-button :label="1">{{$t('basic.active')}}</el-radio-button>
                        <el-radio-button :label="0">{{$t('basic.inactive')}}</el-radio-button>
                        <el-radio-button :label="2">{{$t('basic.not_confirmed')}}</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-divider></el-divider>

            <el-row>
                <el-table :empty-text="$t('basic.no_data')" v-loading="loading" :data="advertisements">
                    <el-table-column :label="$t('basic.date')" width="100" sortable>
                        <template slot-scope="scope">
                            <span>{{scope.createdAt | toTime}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="name" :label="$t('basic.title')" align="start">
                        <template slot-scope="scope">
                            <el-row type="flex">
                                <el-col :span="6">
                                    <img height="67" width="77"
                                        :src="scope.row.images && scope.row.images.length > 0 ? $serverImageUrl + scope.row.images[0] : require('@/assets/no-image-icon.png')"
                                        alt="">
                                </el-col>
                                <el-col :span="18" style="margin-left: 0rem">
                                    <span style="font-size: 13px; font-weight: bold;">{{scope.row.name}}</span><br>

                                    <el-row type="flex">
                                        <el-col>
                                            <i class="el-icon-s-order"></i>
                                            <span @click="seeDetails(scope.row)" class="text"
                                                style="font-size: 12px">{{$t('basic.see')}}</span>
                                        </el-col>
                                        <el-col>
                                            <i class="el-icon-edit-outline"></i>
                                            <span @click="editItem(scope.row)" class="text"
                                                style="font-size: 12px">{{$t('basic.edit')}}</span>
                                        </el-col>
                                        <el-col>
                                            <i style="color: #EC7063" class="el-icon-delete"></i>
                                            <span @click="deleteItem(scope.row)" class="text"
                                                style="font-size: 12px">{{$t('basic.delete')}}</span>
                                        </el-col>
                                    </el-row>

                                    <el-row type="flex" justify="start">
                                        <!-- <el-col>
                                           <i class="el-icon-s-marketing"></i>
                                           <el-tooltip class="item" effect="dark" :content="`Ko'rilganlar soni: ${scope.row.seen}`" placement="top-start">
                                               <span class="text" style="font-size: 12px">statistika</span>
                                           </el-tooltip>
                                       </el-col> -->
                                        <el-col :span="8">
                                            <i class="el-icon-view"></i>
                                            <el-tooltip class="item" effect="dark"
                                                :content="`Ko'rilganlar soni: ${scope.row.seen}`" placement="top-start">
                                                <span class="text" style="font-size: 12px">{{$t('basic.seen')}}</span>
                                            </el-tooltip>
                                        </el-col>
                                        <el-col :span="8">
                                            <i class="el-icon-star-off"></i>
                                            <el-tooltip class="item" effect="dark"
                                                :content="`${$t('basic.faved_count')}: ${scope.row.favouriteCount}`"
                                                placement="top-start">
                                                <span class="text" style="font-size: 12px">{{$t('basic.loved')}}</span>
                                            </el-tooltip>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('advertise.price')" width="111">
                        <template slot-scope="scope">
                            <span v-if="scope.row.price > 0">{{scope.row.price}} {{scope.row.currency.name}}</span>
                        </template>
                    </el-table-column>


                    <el-table-column width="188">
                        <template slot="header" slot-scope="scope">
                            <el-input style="width: 100%"
                                @keypress.native.enter="getAdvertisements(type, size, offset, search)" v-model="search"
                                :placeholder="`${ $t('basic.search') }...`"></el-input>
                        </template>
                        <template slot-scope="scope">
                            <el-button :disabled="type != 1" v-if="scope.row.isTop == 0"
                                @click="openTariffsDialog(scope.row)" style="float: right" size="small" type="primary">
                                {{$t('basic.advertise')}}</el-button>
                            <el-button style="float: right" size="small" type="success" v-else disabled>
                                {{$t('basic.upgraded')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination v-if="totalAdvertisementsNumber > size" @current-change="onCurrentPageChange" background
                    layout="prev, pager, next" :total="totalAdvertisementsNumber">
                </el-pagination>
            </el-row>
            <el-dialog :visible.sync="upgradeDialogVisible">
                <el-row :gutter="10" :key="updateTariffsKey">
                    <el-col :xs="20" :sm="20" :md="8" :lg="8" style="margin-top: 0rem;" v-for="tariff in tariffs"
                        :key="tariff.id">
                        <div @click="selectTariff(tariff)">
                            <el-card :body-style="{ padding: '0px' }" :shadow="tariff.shadow"
                                :style="`cursor: pointer; height: 23.5rem;`">
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
                                        <span>{{$t('advertise.day')}}: </span> <span> {{tariff.days}}
                                            {{$t('advertise.day')}} </span>
                                    </div>
                                    <div>
                                        <span>{{$t('advertise.tgand')}} </span>
                                    </div>
                                    <div @click.stop.once="makeInstagram(tariff.id)" style="display: flex; align-items: center">
                                        <el-col>
                                            <el-checkbox style="background: #67C23A; color: white" v-model="tariff.instagram" :label="$t('advertise.isInstagram')"
                                                border>
                                            </el-checkbox>
                                        </el-col>
                                        <el-col>
                                            <span style="margin-left: 5px">
                                                {{ tariff.instagramPrice }} {{ $t('advertise.soum') }}
                                            </span>
                                        </el-col>
                                    </div>
                                <div class="text">
                                    <div>
                                        <span>{{ $t('advertise.generalPrice') }}: </span> {{ tariff.generalPrice }}
                                        {{ $t('advertise.soum') }}
                                    </div>
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
                        style="float: right; margin-top: 1rem">{{$t('basic.advertise')}}</el-button>
                </el-row>
            </el-dialog>
        </el-container>
        <el-container direction="vertical" class="hidden-md-and-up">
            <el-row>
                <el-col style="display: flex; justify-content: center;">
                    <el-radio-group size="medium" v-model="type">
                        <el-radio-button class="mb-0" :label="1">{{$t('basic.active')}}</el-radio-button>
                        <el-radio-button class="mb-0" :label="0">{{$t('basic.inactive')}}</el-radio-button>
                        <el-radio-button class="mb-0" :label="2">{{$t('basic.not_confirmed')}}</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row>
                <el-table v-loading="loading" :data="advertisements" class="table-header-hidden">
                    <el-table-column align="start">
                        <template slot-scope="scope">
                            <el-row type="flex" class="mt-2">
                                <el-col :span="8" class="mr-2">
                                    <img height="80" width="90"
                                        :src="scope.row.images && scope.row.images.length > 0 ? $serverImageUrl + scope.row.images[0] : require('@/assets/no-image-icon.png')"
                                        alt="">
                                </el-col>
                                <el-col :span="16" style="margin-left: 0rem">
                                    <span style="font-size: 13px; font-weight: bold;">{{scope.row.name}}</span><br>
                                    <span v-if="scope.row.price > 0">{{$t('advertise.price')}}: {{scope.row.price}}
                                        {{scope.row.currency.name}}</span>
                                    <el-row class="d-flex justify-content-between">
                                        <el-col :span="10">
                                            <i class="el-icon-s-order"></i>
                                            <span @click="seeDetails(scope.row)" class="text"
                                                style="font-size: 12px">{{$t('basic.see')}}</span>
                                        </el-col>
                                        <el-col :span="14">
                                            <i class="el-icon-edit-outline"></i>
                                            <span @click="editItem(scope.row)" class="text"
                                                style="font-size: 12px">{{$t('basic.edit')}}</span>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="between" class="mt-1">
                                <el-col>
                                    <i class="el-icon-view"></i>
                                    <el-tooltip class="item" effect="dark"
                                        :content="`Ko'rilganlar soni: ${scope.row.seen}`" placement="top-start">
                                        <span class="text" style="font-size: 12px">{{$t('basic.seen')}}</span>
                                    </el-tooltip>
                                </el-col>
                                <el-col>
                                    <i class="el-icon-star-off"></i>
                                    <el-tooltip class="item" effect="dark"
                                        :content="`${$t('basic.faved_count')}: ${scope.row.favouriteCount}`"
                                        placement="top-start">
                                        <span class="text" style="font-size: 12px">{{$t('basic.loved')}}</span>
                                    </el-tooltip>
                                </el-col>
                                <el-col>
                                    <i style="color: #EC7063" class="el-icon-delete"></i>
                                    <span @click="deleteItem(scope.row)" class="text"
                                        style="font-size: 12px">{{$t('basic.delete')}}</span>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column width="80">
                        <template slot="header" slot-scope="scope">
                            <el-input style="width: 100%"
                                @keypress.native.enter="getAdvertisements(type, size, offset, search)" v-model="search"
                                :placeholder="`${ $t('basic.search') }...`"></el-input>
                        </template>
                        <template slot-scope="scope">
                            <el-button :disabled="type != 1" v-if="scope.row.isTop == 0"
                                @click="openTariffsDialog(scope.row)" style="float: right" size="small" type="primary">
                                {{$t('basic.advertise')}}</el-button>
                            <el-button style="float: right" size="small" type="success" v-else disabled>
                                {{$t('basic.upgraded')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="totalAdvertisementsNumber > size" @current-change="onCurrentPageChange" background
                    layout="prev, pager, next" :total="totalAdvertisementsNumber">
                </el-pagination>
            </el-row>

            <el-dialog :visible.sync="upgradeDialogVisible">
                <el-row :gutter="10" :key="updateTariffsKey">
                    <el-col :xs="20" :sm="20" :md="8" :lg="8" style="margin-top: 0rem;" v-for="tariff in tariffs"
                        :key="tariff.id">
                        <div @click="selectTariff(tariff)">
                            <el-card :body-style="{ padding: '0px' }" :shadow="tariff.shadow"
                                :style="`cursor: pointer; height: 21.5rem;`">
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
                                        <span>{{$t('advertise.day')}}: </span>
                                        <span> {{tariff.days}}
                                            {{$t('advertise.day')}} </span>
                                    </div>
                                    <div>
                                        <span>{{$t('advertise.tgand')}} </span>
                                    </div>
                                </div>
                                <div @click.stop.once="makeInstagram(tariff.id)" style="display: flex">
                                    <el-col>
                                        <el-checkbox style="background: #67C23A; color: white" 
                                        v-model="tariff.instagram" :label="$t('advertise.isInstagram')"
                                            border>
                                        </el-checkbox>
                                    </el-col>
                                    {{ tariff.instagramPrice }} {{ $t('advertise.soum') }}
                                </div>
                                <div class="text">
                                    <div>
                                        <span>{{ $t('advertise.generalPrice') }}: </span> {{ tariff.generalPrice }}
                                        {{ $t('advertise.soum') }}
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
                        style="float: right; margin-top: 1rem">{{$t('basic.advertise')}}</el-button>
                </el-row>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
    import {
        Message
    } from 'element-ui'
    import Swal from 'sweetalert2'
    import Cookies from "js-cookie";

    export default {
        data() {
            return {
                size: 100,
                offset: 0,
                activeName: 'first',

                advertisements: [],
                totalAdvertisementsNumber: 0,
                type: 1, // 0 -> inactive 1 -> active 2 -> not approved advertisements

                loading: false,

                updateTariffsKey: 0,

                tariffs: [],
                search: '',

                selectedTariff: {},
                selectedAdvertisement: {},

                upgradeDialogVisible: false,
            }
        },

        mounted() {
            this.getUserInfo();

            this.getAdvertisements(this.type, this.size, this.offset);
            this.getTariffs();
        },

        methods: {
            makeInstagram(id) {
                let tariff = this.tariffs.find(t => t.id === id);
                if (tariff) {
                    this.tariffs.forEach(t => {
                        if (t.id !== id) {
                            t.selected = false;
                            t.telegram = false;
                            t.instagram = false;
                        }
                    })
                    tariff.instagram = !tariff.instagram;
                    tariff.selected = true;

                    if (tariff.instagram) {
                        tariff.generalPrice = tariff.generalPrice + tariff.instagramPrice;
                    } else {
                        tariff.generalPrice = tariff.price;
                    }
                }
            },
            openTariffsDialog(item) {
                this.selectedAdvertisement = item;
                this.selectedTariff = this.tariffs[0];
                this.upgradeDialogVisible = true;
            },

            closeTarrifsDialog() {
                this.selectedAdvertisement = {};
                this.selectedTariff = {};
                this.upgradeDialogVisible = false;
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

            seeDetails(item) {
                this.$router.push({
                    name: 'product',
                    params: {
                        id: item.id
                    }
                });
            },

            editItem(item) {
                this.$router.push({
                    name: 'makeannouncement',
                    params: {
                        adId: item.id
                    }
                });
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
                            url: 'product',
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

            onCurrentPageChange(page) {
                this.offset = (page - 1) * this.size;

                this.getAdvertisements(this.type, this.size, this.offset);
            },

            getAdvertisements(type = 1, size = 15, offset = 0, search = '') {
                this.loading = true;

                const metadata = {
                    url: 'products/user',
                    params: {
                        size,
                        offset,
                        search
                    },
                    token: this.$store.state.userInfo.token
                }

                if (type == 0) {
                    metadata.params.isActive = 0;
                } else if (type == 1) {
                    metadata.params.isActive = 1;
                } else {
                    metadata.params.isActive = null;
                    metadata.params.isApproved = 0;
                }


                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.totalAdvertisementsNumber = response.count;
                        this.advertisements = response.productList;
                        console.log(response)
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
            }
        },

        watch: {
            type: function (newValue, oldValue) {
                this.getAdvertisements(newValue, this.size, this.offset)
            }
        }
    }
</script>

<style lang="scss">
    @import '../../custom.scss';

    .el-radio-button__inner {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .table-header-hidden .el-table__header-wrapper {
        display: none !important;
    }

    .el-card {
        cursor: pointer;

        .text {
            display: flex;
            flex-direction: column;
            padding: 10px;
            background-color: none !important;
        }
    }

    .image-size-note {
        background: $primary-color;
        padding: 25px;
        border-radius: 5px;
    }

    @media(max-width: 992px) {
        .el-button--small {
            padding: 9px 2px;
            font-size: 9px;
            border-radius: 3px;
        }

        .el-card__header {
            padding: 0px !important;
        }
    }

    .el-dialog {
        position: relative;
        margin: 0 auto 50px;
        background: #FFFFFF;
        border-radius: 2px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 80%;
    }
</style>