<template>
    <el-container direction="vertical" id="container">
        <el-row type="flex" justify="center">
            <el-col :span="16" v-if="details">
                <el-row style="margin: 1rem" type="flex">
                    <el-col :span="4">
                        <div @click="$router.push({path: '/'})">
                            <i class="el-icon-arrow-left primary-color-item"></i>
                            <span class="text">Orqaga</span> 
                        </div>                       
                    </el-col>

                    <el-col :span="16">
                        <div style="display: inline-block; margin-right: 0.5rem; font-size: 15px" v-for="category in details.categories" :key="category.id" @click="$router.push({path: '/'})">
                            <span class="text-grey">{{category.name}}</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </el-col>

                    <el-col :span="4">
                        <div style="float: right;" @click="$router.push({path: '/'})">                            
                            <span class="text">Keyingi e`lon</span> 
                            <i class="el-icon-arrow-right primary-color-item"></i>
                        </div>     
                    </el-col>
                </el-row>                

                <el-row type="flex" :gutter="15"> 
                    <el-col :span="16">
                        <el-card shadow="none">
                            <el-row>                                
                                <div style="position: relative;">
                                    
                                    <img style="cursor: zoom-in; z-index: 9999999" id="main-image" @click="seeImages" width="100%" height="460" :src="details.mainImage ? $serverImageUrl + details.mainImage : require('@/assets/no-image-icon.png')" alt="">                                    
                                    
                                    <!-- <div class="to-favourites-box">
                                        <i class="el-icon-star-off"></i>
                                        <span>Saralanganlarga</span>
                                    </div> -->                                    
                                    <!-- <div id="container"></div> -->
                                    <div v-if="$store.state.userInfo.token" id="box" @click="addToFavourites(details.product.id)">
                                        <div v-if="!details.isFavourite">
                                            <i  class="el-icon-star-off"></i>
                                            <span>Saralanganlarga qo`shish</span>
                                        </div>
                                        <div v-else>
                                            <i style="color: #0098D0" class="el-icon-star-on"></i>
                                            <span>Saralanganlardan chiqarish</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </el-row>
                            <el-row>
                                <h3>{{details.product.name}}</h3>                            
                            </el-row>
                            <el-row>
                                <span class="text-grey" style="font-weight: bold">{{details.regionsTitles}}</span>
                                <el-divider direction='vertical'></el-divider>                           
                                <i class="el-icon-phone"></i>
                                <span style="font-size: 14px">Telefondan berildi</span>
                                <span style="font-size: 14px; margin-left: 0.5rem">Qo`shilgan: {{details.product.createdAt | toTime }} </span>                            
                            </el-row>                        
                            <el-row style="margin-top: 0.5rem">
                                <span style="font-size: 14px;">E`lon raqami: {{details.product.id}}</span>
                            </el-row>

                            <el-divider></el-divider>

                            <!-- ordinary -->
                            <el-row :gutter="20" type="flex" style="flew-wrap: wrap">
                                <el-col :span="12" v-for="extra in extras.ordinary" :key="extra.id">
                                    <el-row class="extra" type="flex" justify="space-between">
                                        <el-col>
                                            <span class="extra-name">{{extra.name}}</span>
                                        </el-col>
                                        <el-col>
                                            <span class="extra-value">{{extra.value}}</span>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>

                            <!-- custom -->
                            <el-row :gutter="20" type="flex" style="flew-wrap: wrap; margin-top: 1.5rem">
                                <el-col :span="12" v-for="extra in extras.custom" :key="extra.id">
                                    <el-row class="extra" type="flex" justify="space-between">
                                        <el-col>
                                            <span class="extra-name">{{extra.name}}</span>
                                        </el-col>
                                        <el-col>
                                            <span class="extra-value">{{extra.custom[extra.value]}}</span>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>

                            <el-divider></el-divider>
                            <el-row>
                                <span v-html="details.product.description"></span>
                            </el-row>        

                            <div>
                                <div id="images">
                                    <el-row style="margin-top: 1rem" v-for="(image, index) in details.product.images" :key="image">                                        
                                        <img v-show="index !== 0" class="product-images" width="100%" height="460" :src="$serverImageUrl + image" alt="">
                                    </el-row>
                                </div>         
                            </div>                   

                            <el-row type="flex" >                            
                                <el-col :span="12">
                                    <div style="font-size: 14px; margin-top: 1rem" @click="$router.push({path: '/'})">
                                        <i class="el-icon-arrow-left primary-color-item"></i>
                                        <span class="text">Orqaga</span> 
                                    </div>
                                </el-col>

                                <el-col :span="12">
                                    <div style="font-size: 14px; margin-top: 1rem; float: right" @click="$router.push({path: '/'})">
                                        <i class="el-icon-arrow-right primary-color-item"></i>
                                        <span class="text">Keyingi e`lon</span> 
                                    </div>
                                </el-col>
                            </el-row>
                                                
                            <el-divider></el-divider>           

                            <el-row>
                                <span style="font-size: 14px">Ko`rib chiqishlar: </span>
                                <span style="font-size: 14px; font-weight: bold;">{{details.product.seen}}</span>
                            </el-row>                            
                        </el-card>

                        <el-card v-if="!this.drawer" shadow="none" style="margin-top: 1rem">
                            <el-row>
                                <span style="font-weight: bold">E‘lon muallifi bilan bog‘laning</span>

                                <el-button style="float: right;" icon="el-icon-warning-outline" round type="warning">
                                    Havfsiz harid qiling
                                </el-button>
                            </el-row>

                            <el-row style="margin-top: 1.5rem">
                                <el-button type="primary" circle icon="el-icon-phone-outline"></el-button>                                 
                                
                                <span v-show="!showPhoneNumber" style="margin-left: 0.5rem">xx xxx xx xx</span>
                                <el-link style="margin-left: 0.5rem" v-show="!showPhoneNumber" @click="showPhoneNumber = !showPhoneNumber">ko`rsatish</el-link>                                

                                <span v-show="showPhoneNumber"> {{details.user.phone}} </span>
                            </el-row>

                            <el-form :model="messageForm" ref="messageForm" :rules="messageForm.rules">
                                <el-form-item label="Xabar matni" prop="text">
                                    <el-input @focus="checkIfLogedIn" placeholder="Habar matni" rows="7" type="textarea" v-model="messageForm.text"></el-input>
                                </el-form-item>

                                <el-form-item>
                                                                       
                                    <!-- <i class="el-icon-paperclip primary-color-item"></i>
                                    <span class="text">Fayl biriktirish</span> -->
                                    <el-button @click="sendMessage" style="float: right" type="primary" icon="el-icon-message">Habar yuborish</el-button>                                        
                                
                                </el-form-item>
                            </el-form>
                        </el-card>

                        <span style="font-size: 2rem; font-weight: bold;">Muallifning boshqa e`lonlari</span>
                        <el-row style="margin-top: 1rem; background: #FDEBD0; padding: 5px" type="flex" :gutter="5" justify="space-between" v-for="product in products.items" :key="product.id">
                            <el-col :span="4">
                                <img @click="toDetails(product.id)" style="cursor: pointer;" width="100%" height="77" :src=" product.images && product.images.length > 0 ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" alt="">
                            </el-col>

                            <el-col :span="12" style="position: relative; font-size: 14px;">
                                <span @click="toDetails(product.id)" class="text" style="font-size: 18px; margin: .5rem">{{product.name}}</span> <br> <br>                                                        
                                
                                <div style="position: absolute; bottom: .5rem; display: flex; font-size: 14px;">
                                    <div>
                                        <i style="color: #F0B27A" class="el-icon-location"></i>
                                        <span>{{product.regions[0].name}}</span>
                                    </div>
                                    <div style="margin-left: .5rem">
                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                        <span style="margin-left: .2rem;">{{product.createdAt | toTime}}</span>
                                    </div>                            
                                </div>                                                                        
                            
                            </el-col>

                            <el-col :span="8">
                                <span style="font-size: 18px; float: right;"> {{product.price}} {{product.currency.name}} </span>                                                        
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        
                        <div style="position: position: sticky; top: 0;">
                            <el-row type="flex" justfiy="center">                            
                                <el-card shadow="none" style="width: 100%">
                                    <div style="text-align: center; width: 100%;">
                                        <span style="font-weight: bold; font-size: 20px; color: #707B7C">
                                            {{ details.product.price }}
                                            {{ details.currency.name }}
                                        </span>                                                     
                                    </div>
                                </el-card>                            
                            </el-row>

                            <el-row style="margin-top: 0.7rem;">
                                <el-button style="width: 100%" icon="el-icon-message" type="primary">
                                    Muallifga yozish
                                </el-button>
                            </el-row>

                            <el-row style="margin-top: 0.7rem;">
                                <el-button @click="showPhoneNumber = !showPhoneNumber" style="width: 100%" icon="el-icon-phone-outline" type="primary">
                                    <span v-show="!showPhoneNumber">XXX XX XX</span>
                                    <span v-show="!showPhoneNumber" style="margin-left: .5rem;">Ko`rsatish</span>
                                    <span v-show="showPhoneNumber">{{details.user.phone}}</span>
                                </el-button>
                            </el-row>

                            <el-row style="margin-top: 0.7rem">
                                <el-card shadow="none" :body-style="{ padding: '0px' }">                                
                                    <div style="position:relative;">                                    
                                        <div id="mapid" style="width: 100%; height: 150px; z-index: 0"></div>

                                        <el-card style="position: absolute; top: 15%; left: 50%; transform: translateX(-50%); width: 90%;">
                                            <el-row type="flex" justify="space-between">
                                                <el-col :span="2">
                                                    <i style="color: #F1948A; font-size: 20px" class="el-icon-location-information"></i>
                                                </el-col>
                                                <el-col :span="21">
                                                    <span style="font-size: 13px; width: 100%">{{details.regionsTitles}}</span>
                                                    <br>
                                                    <span @click="showProductMap(details.product, 13)" class="link-text">Xaritadan ko`rish</span>
                                                </el-col>
                                            </el-row>                                        
                                        </el-card>
                                        
                                        <el-avatar slot="reference" style="position: absolute; top: 75%; left: 50%; transform: translateX(-50%);" :size="80" :src="details.user.photo ? $serverImageUrl + details.user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' "></el-avatar>                                
                                    </div>

                                    <div style="padding: 14px; margin-top: 3rem">   
                                        <el-row type="flex" justify="center">                                        
                                            <el-link style="text-align: center; font-size: 20px" type="primary">{{details.user.name}}</el-link>                                        
                                        </el-row>                      
                                        <el-row type="flex" justify="center">
                                            <span style="font-size: 14px; color: #839192;"> {{details.user.createdAt | toTime}} dan beri IGiperda </span>
                                        </el-row>           
                                        <el-row type="flex" justify="center" style="margin-top: 1rem">
                                            <el-col :span="20">
                                                <el-button type="primary" plain class="button">Muallifning barcha e`lonlari</el-button>                                
                                            </el-col>
                                        </el-row>                                    
                                    </div>
                                </el-card>

                                <el-link type="danger">shikoyat</el-link>
                            </el-row>                            
                        </div>

                        <el-dialog :visible.sync="mapVisible">
                            <div id="productLocation" style="width: 100%; height: 400px;"></div>
                        </el-dialog>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        

        <!-- <el-row type="flex" justify="center" v-if="details.user">
            <el-col :span="16">
                <el-row type="flex" :gutter="15" style="margin-top: 1rem">
                    <el-col :span="16">
                        <el-card shadow="none">
                            <span style="font-weight: bold">{{details.user.name}} ning barcha e`lonlari</span>

                            <el-row></el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row> -->

        <el-drawer :show-close="false" size="25%" :wrapperClosable="false" :modal="false" :visible.sync="drawer" direction="btt">
            <el-row type="flex" justify="center">
                <el-col :span="16">
                    <el-row type="flex" justify="space-between">
                        <div style="float: left;">
                            <i class="el-icon-arrow-left"></i>
                            <span class="text" @click="$router.push({ name: 'profile' })">Mening profilimga</span>
                        </div>

                        <div style="float: right;">
                            <span class="text">Keyingi e`lon</span>
                            <i class="el-icon-arrow-right"></i>    
                            <el-divider direction="vertical"></el-divider>
                            <span @click="drawer = false" class="text">Yopish</span>
                            <i class="el-icon-arrow-down"></i>                                                        
                        </div>
                    </el-row>

                    <el-divider></el-divider>                                                        
                </el-col>
            </el-row>
        </el-drawer>

    </el-container>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
import Swal from 'sweetalert2'
import { Message } from 'element-ui'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

export default {

    props: {
        id: {
            type: String | Number,
            required: true
        }
    },

    data () {
        let checkMessageText = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('Ushbu maydonni to`ldirish shart'))
            }else if (value.length <= 7) {
                callback(new Error('Habarning uzunligi 10 belgidan ko`p bo`lishi lozim'))
            }else {
                callback();
            }
        }; 
        return {
            drawer: false,

            productId: '',

            messageForm: {                
                text: '',

                rules: {
                    text: [
                        { validator: checkMessageText, trigger: 'blur' },                        
                    ]
                }
            },            

            products: {
                count: 0,
                items: []
            },

            mapLocation: null,

            mapVisible: false,

            details: null,

            extras: {
                custom: Array,
                ordinary: Array
            },

            showPhoneNumber: false
        }
    },

    mounted () {        
        this.productId = this.id;

        this.getProduct(this.productId);                
    },

    methods: {
        toDetails (id) {
            this.productId = id;
            this.getProduct(this.productId);
        },

        getUsersOtherProducts (userId, productIds) {
            const metadata = {
                url: 'products',
                params: {
                    size: 5, 
                    offset: 0,
                    userId,
                    productIds
                }
            }

            const token = Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null;
            if (token && token.length > 0) {                
                metadata.url += '/token';
                metadata.token = token
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {                    
                    this.products.count = response.count;
                    this.products.items = response.productList;    
                    
                    this.products.items.forEach(element => {
                        element.categoriesNames = element.categories.map(data => {
                            return data.name;
                        }).join(' / ');              
                        
                    });                           
                })
        },

        addToFavourites (id) {
            
            const metadata = {
                url: 'favourites',
                data: {
                    productId: id
                },
                method: 'post'
            }

            this.$store.dispatch('setData', metadata)
                .then(response => {
                    let message = response ? 'Saralanganlarga qo`shildi' : 'Saralanganlardan chiqarildi';
                    Message({ 
                        type: 'success',
                        message
                    })
                    this.getProduct(this.productId);
                })  
                .catch(error => {   
                    Message({
                        type: 'error',
                        message: 'Serverda xatolik, keyinroq urinib ko`ring',
                        duration: 4000
                    })
                })
        },

        deleteItem(id) {
            this.drawer = false;
            Swal.fire({
                title: 'Bы уверены?',
                text: 'Вы не сможете вернуть это!',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Отменить',
                confirmButtonText: 'Удалить'
            }).then((result) => {
                if (result.value) {
                    const metadata = {
                        url: 'ad',
                        method: 'delete',
                        data: {
                            id
                        }
                    }

                this.$store.dispatch('setData', metadata)
                    .then(response => {
                        Swal.fire(
                            'Удалена!',
                            'Pеклама yдалена.',
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

        showProductMap(product, zoom) {
            this.mapVisible = true;

            setTimeout(() => {
                if (!this.mapLocation) {                     
                    this.mapLocation = L.map('productLocation', { zoomControl: true, fullscreenControl: true}).setView([product.location.lat, product.location.lng], zoom);

                    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                        maxZoom: 18,
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        id: 'mapbox.streets'
                    }).addTo(this.mapLocation);

                    // let circle = L.circle([location.lat, location.lng], {
                    //     color: 'red',
                    //     fillColor: '#f03',
                    //     fillOpacity: 0.5,
                    //     radius: 500
                    // }).addTo(this.mapLocation);

                    let marker = L.marker([product.location.lat, product.location.lng]).addTo(this.mapLocation);
                    marker.bindPopup(`<b>${product.name}</b>`).openPopup();
                }                
            }, 500)
        }, 

        checkIfLogedIn () {            
            if (!this.$store.state.userInfo.token) {
                this.$router.push({ name: 'signInOrUp' });
            }
        },
        
        sendMessage () {
            this.$refs.messageForm.validate(valid => {
                if (valid) {
                    NProgress.start();
                    const metadata = {
                        url: 'message',
                        method: 'post',
                        data: {
                            fromId: -1,
                            text: this.messageForm.text,                            
                            productId: this.productId,
                            toId: this.details.id
                        }
                    }

                    this.$store.dispatch('setData', metadata)
                        .then(response => {

                            Message({
                                type: 'success',
                                message: 'Sizning habaringiz jo`natilindi'
                            })
                            document.body.scrollIntoView({behavior: 'smooth', block: 'start'});            
                        })
                        .catch(error => {
                            // console.log(error);
                        })
                        .finally(() => {
                            NProgress.done();
                        })
                }
            })
        },

        getProduct(id) {
            NProgress.configure({ parent: '#container' });

            NProgress.start();
            const metadata = {
                url: 'product',
                params: {
                    productId: id,
                    lang: 'uz'
                }
            }

            const token = Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null;         
            if (token && token.length > 0) {                              
                metadata.url += '/token';
                metadata.token = token
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {                                        
                    this.details = response;

                    this.details.regionsTitles = response.regions.map(data => {
                        return data.name
                    }).join(', ');      
                    
                    //this.details.mainImage = response.product.images.shift();
                    this.details.mainImage = response.product.images[0];

                    this.extras.custom = response.extras.filter(data => {
                        return data.type == 3;
                    })

                    this.extras.ordinary = response.extras.filter(data => {
                        return data.type != 3;
                    })

                    this.drawer = response.product.isOwner == 1 ? true : false;
                                        
                    this.getUsersOtherProducts(this.details.user.id, this.productId);
                    setTimeout(() => {
                        let mymap = L.map('mapid', { zoomControl: false, }).setView([41.5825, 69.7933], 13);

                        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                            maxZoom: 18,
                            
                            id: 'mapbox.streets'
                        }).addTo(mymap);
                    }, 1000)
                })
                .catch(error => {                    
                    // console.log(error);
                })
                .finally(() => {
                    NProgress.done();
                })
        },

        seeImages () {                        
            const gallery = new Viewer(document.getElementById('images'));            

            setTimeout(() => {
                document.getElementsByClassName('product-images')[0].click();
            }, 1000);
        }
    }

}
</script>

<style lang="scss" scoped>
@import '../custom.scss';

.link-text {
    font-size: 13px;
    color: $primary-color;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.extra {
    font-size: 14px;

    .extra-name {
        color: gray;
    }

    .extra-value {
        color: $primary-color;
        cursor: pointer;
        float: right;

        &:hover {
            text-decoration: underline;
        }
    }    
}

.primary-color-item {
    color: $primary-color;
}

// #container {
//     margin-right: 1rem;
//     margin-top: 1rem;
//     opacity: 0.5;
//     background-color: #5D6D7E;
//     position: absolute;
//     top: 0px;
//     right: 0px;
//     height: 17%;
//     width: 18%;
// }
#box {    
    cursor: pointer;
    opacity: 1;    
    position: absolute;
    color: #ffffff;
    top: 0px;
    right: 0px;        
    margin: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
        margin-right: 0.3rem;
        margin-top: 0.3rem;
        cursor: pointer;        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        i{
            font-size: 3rem;
        }

        span {
            text-align: center;
            width: 75%;
            font-size: 12px;
        }

        &:hover i{
            color: $primary-color;            
        }
    }
    
}

.text-grey {
    color: gray;
    cursor: pointer;    
    
    &:hover {
        color: #ffffff;
        background: $primary-color;
    }
}

</style>