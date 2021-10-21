<template>
    <div>
        <el-container direction="vertical" class="hidden-sm-and-down" v-if="!$store.state.isMobileVersion">
            <el-row type="flex" justify="center" style="margin-top: 2rem">
                <el-col :span="20">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="10">
                            <span style="font-weight: bold; font-size: 17px">{{tabsDescriptions[activeTabIndex].title}}</span><br>
                            <span class="gray-text">{{tabsDescriptions[activeTabIndex].description}}</span>
                        </el-col>
                        <el-col :span="14">
                            <el-row type="flex" justify="space-between" style="float:right;">
                                <el-col :span="15" style="margin-right: 0.5rem">
                                    <span class="gray-text" style="font-weight: bold; font-size: 17px;">{{$t('basic.your_account')}}: </span> <span style="font-weight: bold"> {{$store.state.userInfo.balance}} {{$t('advertise.soum')}}</span> <br>
                                </el-col>
                                <el-col :span="9">
                                    <el-button @click="openPaymendDialog" type="primary" plain>{{$t('basic.fill_balance')}}</el-button>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>

                    <el-row style="margin-top: 2rem;">
                        <el-tabs v-model="activeTabIndex" @tab-click="onTabClick">
                            <el-tab-pane name="0" :label="$t('former_header.announcements')">
                                <Advertisements @not-enough-money="openPaymendDialog" />
                            </el-tab-pane>
                            <el-tab-pane name="1" :label="$t('basic.messages')">
                                <Messages />
                            </el-tab-pane>
                            <el-tab-pane name="2" :label="$t('basic.transactions')">
                                <Transactions />
                            </el-tab-pane>
                            <el-tab-pane name="3" :label="$t('basic.favourites')">
                                <Favourites @updateUserInfo="getUserInfo" />
                            </el-tab-pane>
                            <el-tab-pane name="4" :label="$t('basic.settings')">
                                <Settings :key="updateSettings" @update="updateSettings++" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-row>
                </el-col>

                <el-dialog center :title="$t('basic.fill_balance')" :visible.sync="payDialogVisible" :width="`${size}%`">
                    <!-- <el-row type="flex" justify="center" align="center" style="margin-bottom: 0.5rem;">
                        <h2>Hisobni to`ldirish</h2>
                    </el-row> -->

                    <el-row style="margin: 0.5rem 0;">
                        <el-form :model="paymentForm" ref="paymentForm">
                            <el-form-item prop="dummy" :rules="paymentRules">
                                <el-input id="currency-mask" placeholder="Summa" v-model="paymentForm.dummy"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-row>

                    <el-row type="flex" justify="center" :gutter="20">
                        <el-col>
                            <div @click="selectPaymentService(1)">
                                <el-card :shadow="clickServiceSelected ? 'always' : 'hover'" :body-style="{ padding: '5px' }">
                                    <div slot="header" style="padding: 0 14px; float: right; margin-bottom: 0.5rem; height: 2rem">
                                        <transition name="el-zoom-in-center">
                                            <div v-show="clickServiceSelected">
                                                <el-button size="small" circle type="primary" icon="el-icon-check"></el-button>
                                            </div>
                                        </transition>
                                    </div>
                                    <img src="@/assets/img_click.png" class="image">
                                </el-card>
                            </div>
                        </el-col>
                        <el-col>
                            <div @click="selectPaymentService(2)">
                                <el-card :shadow="paymeServiceSelected ? 'always' : 'hover'" :body-style="{ padding: '5px' }">
                                    <div slot="header" style="padding: 0 14px; float: right; margin-bottom: 0.5rem; height: 2rem">
                                        <transition name="el-zoom-in-center">
                                            <div v-show="paymeServiceSelected">
                                                <el-button size="small" circle type="primary" icon="el-icon-check"></el-button>
                                            </div>
                                        </transition>
                                    </div>
                                    <img src="@/assets/img_pay_me.png" class="image">
                                </el-card>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-around" style="margin-top: 0.5rem">
                        <el-button type="danger" @click="closePaymentDialog">{{$t('basic.cancel')}}</el-button>
                        <el-button type="primary" @click="redirectPayemntService">{{$t('basic.fill')}}</el-button>
                    </el-row>
                </el-dialog>
            </el-row>
        </el-container>

        <div v-else class="hidden-md-and-up">
            <el-row style="margin: 0 1rem">
                <el-col :span="24">
                    <el-row>
                        <el-row>
                            <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">{{$t('basic.back')}}</el-button>
                        </el-row>
                        <el-tabs @tab-click="onTabClick">
                            <el-tab-pane name="0" :label="$t('former_header.announcements')">
                                <Advertisements @not-enough-money="openPaymendDialog" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-row>
                </el-col>
                <!--            <el-button @click="logout" style="margin-top: 1rem" type="warning" size="mini">{{$t('basic.logout')}}</el-button>-->
            </el-row>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import IMask from 'imask'
import Advertisements from '@/components/Profile/Advertisements.vue'
import Cookies from 'js-cookie'

export default {    

    components: {
        Advertisements,
        Messages: () => import('@/components/Profile/Messages.vue'),
        Transactions: () => import('@/components/Profile/Transactions.vue'),
        Settings: () => import('@/components/Profile/Settings.vue'),
        Favourites: () => import('@/components/Profile/Favourites.vue')
    },

    data () {
        return {
            ads: [],

            activeNames: [],
            
            updateSettings: 0,
            paymentRules: [
                { required: true, message: this.$t('rules.required'), trigger: 'blur' }                
            ],

            size: 30,
            payDialogVisible: false,

            paymentForm: {
                paymentSoum: '',
                dummy: 0
            },       

            paymentLoading: false,

            clickServiceSelected: true, //selected by default
            paymeServiceSelected: false,            

            activeTabIndex: 0,
            tabsDescriptions: []
        }
    },

    created () {       
        this.ads = [
            { name: this.$t('basic.active'), index: 1, count: 0, iconColor: '#58D68D', iconClass: 'el-icon-document-checked' },
            { name: this.$t('basic.inactive'), index: 2, count: 0, iconColor: '#2E86C1', iconClass: 'el-icon-document-remove' },
            { name: this.$t('basic.not_confirmed'), index: 3, count: 0, iconColor: '#EB984E', iconClass: 'el-icon-document-delete' }
        ];        

        this.tabsDescriptions = [{ title: this.$t('basic.ads'), description: this.$t('basic.ads_description') },
            { title: this.$t('basic.messages'), description: this.$t('basic.messages_description') },
            { title: this.$t('basic.transactions'), description: this.$t('basic.transactions_description') },
            { title: this.$t('basic.favourites'), description: this.$t('basic.favourites_description') },                
            { title: this.$t('basic.settings'), description: this.$t('basic.settings_description') }]
        
        this.getUserInfo();
    },

    mounted () {            
        this.activeTabIndex = this.$store.state.profileActiveTab;                    
    },

    destroyed () {
        this.activeTabIndex = 0;
    },

    methods: {
        logout () {
            Cookies.remove('userInfo');
            this.$store.commit('CLEAR_USER_INFO');
            this.$notify({
                type: 'success',
                title: this.$t('basic.success'),
                message: this.$t('basic.loged_out'),   
                duration: 3000                             
            })

            this.$router.push({path: '/'});            
        },

        handleChange (value) {                        
            if (value == 4) {
                this.$router.push({name: 'ads', params: {adType: 4}})
            }else if (value == 3) {
                this.$router.push({name: 'transactions'})
            }
        },        

        handleAds (val) {
            this.$router.push({name: 'ads', params: {adType: val}})
        },

        getUserInfo () {                       
            const metadata = {
                url: 'user',
                params: null,
                token: this.$store.state.userInfo.token
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {                                                                                                         
                    let payload = this.$store.state.userInfo;

                    payload.favouritesCount = response.favouritesCount;
                    payload.balance = response.balance,
                    payload.activeProductCount = response.activeProductCount,
                    payload.inactiveProductCount = response.inactiveProductCount,
                    payload.unconfirmedProductCount = response.unconfirmedProductCount,
                    
                    this.ads[0].count = response.activeProductCount;
                    this.ads[1].count = response.inactiveProductCount;
                    this.ads[2].count = response.unconfirmedProductCount;

                    Cookies.set('userInfo', payload);  
                    
                    this.$store.commit('SET_USER_INFO', payload);                    
                })
        },

        selectPaymentService (value) {            
            // value 1 -> Click
            // value 2 -> Payme

            if (value == 1) {
                this.paymeServiceSelected = false;
                this.clickServiceSelected = true;
            }else {
                this.clickServiceSelected = false;
                this.paymeServiceSelected = true;
            }
        }, 

        openPaymendDialog () {                    

            this.payDialogVisible = true;

            setTimeout(() => {
                this.paymentForm.paymentSoum = IMask(
                document.getElementById('currency-mask'),
                {
                    mask: Number,
                    min: 1000,
                    max: 10000000,
                    thousandsSeparator: ' '
                }
            )
            }, 1000)
        },

        closePaymentDialog () {
            this.paymentForm.dummy = 0;
            this.payDialogVisible = false;
        },

        redirectPayemntService () {            
            this.$refs.paymentForm.validate(valid => {
                if (valid) {
                    // if (this.clickServiceSelected) {
                    //     Message({
                    //         type: 'info',
                    //         message: this.$t('profile.info.coming_soon'),
                    //         duration: 5000
                    //     })

                    //     return;
                    // }

                    this.paymentLoading = true;
                    const metadata = {
                        url: 'checkout',                        
                        params: {
                            amount: this.paymentForm.paymentSoum.unmaskedValue * 100, // the server need every single amount of money
                            method: this.clickServiceSelected ? 1 : 0 // click is 1 payme is 0
                        },
                        token: this.$store.state.userInfo.token
                    }

                    this.$store.dispatch('getData', metadata)
                        .then(response => {                                                               
                            window.location = response;
                        })
                        .catch(error => {

                        })
                        .finally(() => {
                            this.paymentLoading = true;
                        })
                }
            })
        },

        onTabClick (item) {                  
            const token = Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null;
            if (!token) {
                this.$store.commit("CLEAR_USER_INFO");
                this.$router.push({path: '/'});                
            }            

            this.activeTabIndex = item.index;
        }
    },

    watch: {
        '$store.state.profileActiveTab': function(newValue, oldValue) {
            this.activeTabIndex = newValue;
        }
    }
}
</script>

<style lang="scss" scoped>
    .gray-text {
        color: gray;
        font-size: 14px;        
    }
</style>