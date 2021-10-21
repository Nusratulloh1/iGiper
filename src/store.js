import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import Cookies from 'js-cookie'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        addAds: 2,
        paginationLastPage: 1,
        fromItemDetails: false,
        phoneVersion: {
            categories: ''
        },

        isMobileVersion: false,

        userInfo: {
            activeProductCount: 0,
            inactiveProductCount: 0,
            unconfirmedProductCount: 0,
            name: null,
            balance: 0,
            token: null,
            phone: null,
            imageUrl: '',
            regionId: undefined,
            favouritesCount: 0
        },

        mobileFilterForm: {
            extras: [],
            regions: [],
            categories: [],
            searchData: '',
            currencyId: '',
            sort: '',
            priceMin: '',
            priceMax: '',

            itemCount: 0,
            mode: '1'
        },

        seeAllTop: false,

        mainLang: 'uz',

        profileActiveTab: '',

        tags: '',

        product: {
            regionName: '',
            search: '',
            regionId: 0,
            categoryId: undefined
        }
    },
    mutations: {
        commitAddAds(state, val) {
            state.addAds = val;
        },
        SET_PAGINATION_LAST_PAGE(state, page) {
            state.paginationLastPage = page;
        },

        SET_FROM_ITEM_DETAILS(state, payload) {
            state.fromItemDetails = payload;
        },

        SET_MOBILE_FILTER_FORM(state, payload) {
            for (const key in payload) {
                if (payload.hasOwnProperty(key) && state.mobileFilterForm.hasOwnProperty(key)) {
                    state.mobileFilterForm[key] = payload[key];
                }
            }
        },

        SET_DEVICE_VERSION(state, value) {
            state.isMobileVersion = value;
        },

        SET_MOBILE_CATEGORIES(state, payload) {
            state.phoneVersion.categories = payload;
        },

        SET_SEE_ALL_TOP(state, value) {
            state.seeAllTop = value;
        },

        SET_MAIN_LANG(state, lang) {
            state.mainLang = lang;
        },

        SET_TAGS(state, payload) {
            state.tags = payload;
        },

        SET_PRODUCT_DATA(state, payload) {

            for (const key in payload) {
                if (payload.hasOwnProperty(key) && state.product.hasOwnProperty(key)) {
                    state.product[key] = payload[key];
                }
            }
        },

        SET_USER_INFO(state, payload) {
            for (const key in payload) {
                if (payload.hasOwnProperty(key) && state.userInfo.hasOwnProperty(key)) {
                    state.userInfo[key] = payload[key];
                }
            }
        },

        CLEAR_USER_INFO(state) {
            state.userInfo.name = null;
            state.userInfo.balance = 0;
            state.userInfo.token = null;
            state.userInfo.phone = null;
            state.userInfo.imageUrl = '';
            state.userInfo.regionId = undefined;
            state.userInfo.favouritesCount = 0;
        },

        SET_PROFILE_ACTIVE_TAB(state, activeTab) {
            state.profileActiveTab = activeTab;
        }
    },
    actions: {
        // url, params ----------> metadata
        getData({commit, state}, metadata) {
            return new Promise((resolve, reject) => {
                axios.get(metadata.url, {
                    baseURL: 'https://igiper.uz:8890/api/',
                    // baseURL: 'http://localhost:8890/api/',
                    params: metadata.params,
                    headers: {
                        'Authorization': 'Bearer ' + metadata.token
                    }
                }).then(response => {
                    resolve(response.data.result)
                })
                    .catch(exception => {
                        if (exception.response.status == 401) {
                            Cookies.remove('userInfo');
                            commit('CLEAR_USER_INFO')
                            router.push({path: '/'});
                        }
                    })
            })
        },

        // url, method, data, params ----------> metadata, methods could be post, put, delete
        setData({commit, state}, metadata) {
            return new Promise((resolve, reject) => {
                axios({
                    baseURL: 'https://igiper.uz:8890/api/',
                    // baseURL: 'http://localhost:8890/api/',
                    method: metadata.method,
                    url: metadata.url,
                    data: metadata.data,
                    params: metadata.params,
                    headers: {
                        'Authorization': 'Bearer ' + (Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null)
                    }
                }).then(response => {
                    resolve(response.data.result)
                })
                    .catch(error => {
                        // if (error.response.status === 403) {
                        //   reject("UserNotFound")
                        // }else if (error.response.status === 409) {
                        //   reject("Phone number already exists")
                        // }

                        if (error.response.status == 401) {
                            Cookies.remove('userInfo');
                            commit('CLEAR_USER_INFO')
                            router.push({path: '/'});
                        }

                        reject();
                    })
            })
        },

        uploadImage({commit, state}, metadata) {
            return new Promise((resolve, reject) => {
                const file = new FormData()

                file.append(metadata.type, metadata.file)

                axios({
                    method: 'post',
                    url: metadata.url,
                    data: file
                }).then(response => {
                    // check some exception or error cases
                    resolve(response.data.result)
                }).catch(exception => {

                })
            })
        }
    }
})
