<template>
    <el-container v-loading="loading" style="min-height: 300px;" direction="vertical" id="container">
        <el-row v-if="!isMobileVersion && details" type="flex" justify="center">
            <el-col style="max-width: 1200px;" v-if="details">
                <el-row style="margin: 1rem" type="flex">
                    <el-col :span="4">
                        <div @click="$store.commit('SET_FROM_ITEM_DETAILS', false), $router.push({path: '/'})">
                            <i class="el-icon-arrow-left primary-color-item"></i>
                            <span class="text">{{$t('basic.back')}}</span> 
                        </div>                       
                    </el-col>

                    <el-col :span="16">
                        <div style="display: inline-block; margin-right: 0.5rem; font-size: 15px" @click="onCategoryClick(category)" v-for="category in details.categories" :key="category.id">
                            <span class="text-grey">{{category.name}}</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </el-col>

                    <!-- <el-col :span="4">
                        <div style="float: right;" @click="$router.push({path: '/'})">                            
                            <span class="text">Keyingi e`lon</span> 
                            <i class="el-icon-arrow-right primary-color-item"></i>
                        </div>     
                    </el-col> -->
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
                                            <i class="far fa-heart"></i>
                                            <span>{{$t('basic.add_to_favourites')}}</span>
                                        </div>
                                        <div v-else>
                                            <i style="color: #0098D0" class="fas fa-heart"></i>
                                            <span>{{$t('basic.take_from_favourites')}}</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </el-row>
                            <el-row>
                                <h3>{{details.product.name}}</h3>                            
                            </el-row>
                            <el-row>
                                <span @click="handleRegionClick" class="text-grey" style="font-weight: bold">{{details.regionsTitles}}</span>
                                <el-divider direction='vertical'></el-divider>                           
                                <i :class="details.product.isMobile ? 'el-icon-phone' : 'el-icon-s-platform'"></i>
                                <span style="font-size: 14px">{{ details.product.isMobile ? $t('basic.from_phone') :  $t('basic.from_desktop')}}</span>
                                <span style="font-size: 14px; margin-left: 0.5rem">{{$t('basic.added')}}: {{details.product.createdAt | toTime }} </span>                            
                            </el-row>                        
                            <el-row style="margin-top: 0.5rem">
                                <span style="font-size: 14px;">{{$t('basic.ad_num')}}: {{details.product.id}}</span>
                            </el-row>
                            
                            <div v-if="extras.ordinary.length > 0 || extras.custom.length > 0">
                                <el-divider></el-divider>

                                <!-- ordinary -->
                                <!-- <el-row :gutter="20" type="flex" style="flex-wrap: wrap">
                                    <el-col :span="12" style="margin-top: 1.5rem" v-for="extra in extras.ordinary" :key="extra.id"> -->
                                    <div v-if="extras.ordinary.length > 0">
                                        <el-row  class="extra" type="flex" v-for="extra in extras.ordinary" :key="extra.id" justify="space-between" style="margin-top: 0.5em">
                                            <el-col :span="12">
                                                <span class="extra-name">{{extra.name}}</span>
                                            </el-col>
                                            <el-col :span="12">
                                                <span class="extra-value" style="margin-left: 0.5em">{{extra.value}}</span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <!-- </el-col>
                                </el-row> -->

                                <!-- custom -->  
                                <div v-if="extras.custom.length > 0">
                                    <el-row v-for="extra in extras.custom" :key="extra.id" class="extra" type="flex" justify="space-between" style="margin-top: 0.5em" >
                                        <el-col :span="12">
                                            <span class="extra-name">{{extra.name}}</span>
                                        </el-col>
                                        <el-col :span="12" v-if="extra.customs.find(data => data.id == extra.value)">
                                            <span class="extra-value" style="margin-left: 0.5em">{{extra.customs.find(data => data.id == extra.value)[$store.state.mainLang]}}</span>
                                        </el-col>
                                    </el-row>  
                                </div>                                                                                                  
                                
                            </div>

                            <el-divider></el-divider>

                            <div v-if="details.product.type == 2">
                                <div style="display: flex; justify-content: center;">
                                    <strong style="text-align: center"> {{$t('advertise.product_type')}} </strong>
                                </div>
                                <el-row class="extra" type="flex" justify="space-between">
                                    <el-col :span="12">
                                        <span class="extra-name">{{$t('advertise.month')}}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="extra-value" style="margin-left: 0.5em">{{details.product.month}}</span>
                                    </el-col>
                                </el-row>

                                <el-row class="extra" type="flex" justify="space-between" style="margin-top: .5em">
                                    <el-col :span="12">
                                        <span class="extra-name">{{$t('advertise.prepay')}}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="extra-value" style="margin-left: 0.5em">{{details.product.prepay}}</span>
                                    </el-col>
                                </el-row>

                                <el-row class="extra" type="flex" justify="space-between" style="margin-top: .5em">
                                    <el-col :span="12">
                                        <span class="extra-name">{{$t('advertise.monthly_payment')}}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="extra-value" style="margin-left: 0.5em">{{details.product.monthly_payment}}</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-row style="margin-top: 1em">
                                <span v-html="details.product.description"></span>                                
                            </el-row>        

                            <div>
                                <div id="images">
                                    <el-row style="margin-top: 1rem" v-for="(image, index) in details.product.images" :key="image">                                        
                                        <img v-show="index!=0" class="product-images" width="100%" height="460" :src="$serverImageUrl + image" alt="">
                                    </el-row>
                                </div>         
                            </div>                   

                            <el-row type="flex" >                            
                                <el-col :span="12">
                                    <div style="font-size: 14px; margin-top: 1rem" @click="$router.push({path: '/'})">
                                        <i class="el-icon-arrow-left primary-color-item"></i>
                                        <span class="text">{{$t('basic.back')}}</span> 
                                    </div>
                                </el-col>

                                <!-- <el-col :span="12">
                                    <div style="font-size: 14px; margin-top: 1rem; float: right" @click="$router.push({path: '/'})">
                                        <i class="el-icon-arrow-right primary-color-item"></i>
                                        <span class="text">Keyingi e`lon</span> 
                                    </div>
                                </el-col> -->
                            </el-row>
                                                
                            <el-divider></el-divider>           

                            <el-row >
                                <span style="font-size: 14px">{{$t('basic.seen_num')}}: </span>
                                <span style="font-size: 14px; font-weight: bold;">{{details.product.seen}}</span>
                            </el-row>                            
                        </el-card>
                        <el-row style="margin-left: 17px; margin-top: 5px; display: flex; align-items: center;">
                            <span style="font-size: 14px; margin-right: 5px">
                                {{$t('basic.share')}}:
                            </span>
                        <telegram-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                       <facebook-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                        <instagram-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                        <odnoklassniki-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                        </el-row>

                        <el-card id="messageForm" v-if="!details.product.isOwner" shadow="none" style="margin-top: 1rem">
                            <el-row>
                                <span style="font-weight: bold">{{$t('basic.contact_auth')}}</span>

                                <el-button style="float: right;" icon="el-icon-warning-outline" round type="warning">
                                    {{$t('basic.buy_safe')}}
                                </el-button>
                            </el-row>

                            <el-row style="margin-top: 1.5rem">
                                <el-button type="primary" circle icon="el-icon-phone-outline"></el-button>                                 
                                
                                <span v-show="!showPhoneNumber" style="margin-left: 0.5rem">xx xxx xx xx</span>
                                <el-link style="margin-left: 0.5rem" v-show="!showPhoneNumber" @click="showPhoneNumber = !showPhoneNumber">{{$t('basic.show')}}</el-link>                                

                                <span v-show="showPhoneNumber"> {{details.user.phone}} </span>
                            </el-row>

                            <el-form :model="messageForm" ref="messageForm" :rules="messageForm.rules">
                                <el-form-item :label="$t('basic.message_text')" prop="text">
                                    <el-input @focus="checkIfLogedIn" :placeholder="$t('basic.message_text')" rows="7" type="textarea" v-model="messageForm.text"></el-input>
                                </el-form-item>

                                <el-form-item>
                                    <!-- <i class="el-icon-paperclip primary-color-item"></i>
                                    <span class="text">Fayl biriktirish</span> -->
                                    <el-button @click="sendMessage" style="float: right" type="primary" icon="el-icon-message">{{$t('basic.send')}}</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        
                        <el-row v-if="products.items.length > 0" style="margin-top: 1rem">
                            <span style="font-size: 1.2rem; font-weight: bold;">{{$t('basic.auth_other_ads')}}</span>
                        </el-row>

                        <el-row  style="margin-top: 1rem; background: #FDEBD0; padding: 5px" type="flex" :gutter="5" justify="space-between" v-for="product in products.items" :key="product.id">                            
                            <el-col :span="4">
                                <img @click="toDetails(product.id)" style="cursor: pointer;" width="100%" height="77" :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" alt="">
                            </el-col>
                            
                            <Installment v-if="product.type == 2" style="position: absolute; bottom: .5em; right: .5em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>

                            <el-col :span="12" style="position: relative; font-size: 14px;">
                                <span @click="toDetails(product.id)" class="item-title tt" style="font-size: 18px; margin: .5rem; background: #FDEBD0">{{product.name}}</span> <br>
                                
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
                                <el-button @click="writeToAuthor" style="width: 100%" icon="el-icon-message" type="primary">
                                    {{$t('basic.write_to_author')}}
                                </el-button>
                            </el-row>

                            <el-row style="margin-top: 0.7rem;">
                                <el-button @click="showPhoneNumber = !showPhoneNumber" style="width: 100%" icon="el-icon-phone-outline" type="primary">
                                    <span v-show="!showPhoneNumber">XXX XX XX</span>
                                    <span v-show="!showPhoneNumber" style="margin-left: .5rem;">{{$t('basic.show')}}</span>
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
                                                    <span @click="showProductMap(details.product, 13)" class="link-text">{{$t('basic.see_in_map')}}</span>
                                                </el-col>
                                            </el-row>                                        
                                        </el-card>
                                        
                                        <el-avatar slot="reference" style="position: absolute; top: 75%; left: 50%; transform: translateX(-50%);" :size="80" :src="details.user.photo ? $serverImageUrl + details.user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' "></el-avatar>                                
                                    </div>

                                    <div style="padding: 14px; margin-top: 3rem">   
                                        <el-row type="flex" justify="center">                                        
                                            <el-link style="text-align: center; font-size: 20px" @click="seeUsersAllProducts" type="primary">{{details.user.name || details.user.phone}}</el-link>                                        
                                        </el-row>                      
                                        <el-row type="flex" justify="center">
                                            <span v-if="$store.state.mainLang=='uz'" style="font-size: 14px; color: #839192;"> {{details.user.createdAt | toTime(false)}} {{$t('basic.since')}} </span>
                                            <span v-else style="font-size: 14px; color: #839192;">{{$t('basic.since')}} {{details.user.createdAt | toTime(false)}}</span>
                                        </el-row>           
                                        <el-row type="flex" justify="center" style="margin-top: 1rem">                                            
                                            <el-button @click="seeUsersAllProducts" type="primary" plain class="button">{{$t('basic.auth_all_ads')}}</el-button>                                                                            
                                        </el-row>                                    
                                    </div>
                                </el-card>

                                <!-- <el-link type="danger">{{$t('basic.complain')}}</el-link> -->
                            </el-row>                            
                        </div>                        
                    </el-col>
                </el-row>
            </el-col>
        </el-row>                

        <div v-else-if="details" id="mobileScreen" style="margin-bottom: 1rem; padding: 0 10px">
            <el-button type="text" icon="el-icon-arrow-left" @click="back">{{$t('basic.back')}} </el-button>

            <el-row style="margin-top: 1rem" v-if="details">
<!--                <el-carousel :height="carouselHeight+'px'">                -->
<!--                    <el-carousel-item v-for="(image, index) in details.product.images" :key="index">                        -->
<!--                        <img @click="seeImages" style="z-index: 0;" class="product-images" height="auto" width="100%" :src="$serverImageUrl + image" alt="" srcset="">                                            -->
<!--                    </el-carousel-item>            -->
<!--                </el-carousel>-->
                <carousel :height="carouselHeight+'px'" :perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5 paginationActiveColor="#01BFA5">
                    <slide v-for="(image, index) in details.product.images" :key="index">
                        <img @click="seeImages" style="z-index: 0;" class="product-images" height="100%" width="100%" :src="$serverImageUrl + image" alt="" srcset="">
                    </slide>
                </carousel>
                <vue-picture-swipe id="myswiper" style="opacity: 0; position: absolute;" :items="items"></vue-picture-swipe>        
            </el-row>

            <div style="display: flex; flex-direction: column; margin-left: 1rem; margin-top: .5rem">
                <span style="font-weight: bold; font-size: 16px; color: #707B7C">
                    {{ details.product.price }}
                    {{ details.currency.name }}
                </span>          

                <el-row type="flex" justify="space-between">
                    <span>{{details.product.name}}</span>   
                    <div v-if="$store.state.userInfo.token" @click="addToFavourites(details.product.id)" style="margin-right: .5rem">
                        <div v-if="!details.isFavourite">
                            <i style="font-size: 39px; margin-top: -21px;color: #01BFA5;" class="far fa-heart"></i>
                        </div>
                        <div v-else>
                            <i style="color: #0098D0;font-size: 39px; margin-top: -21px;" class="fas fa-heart"></i>
                        </div>
                    </div>
                </el-row>                                         
            </div>
                        
            <el-row style="margin-top: .7rem">  
                <el-card shadow="none" :body-style="{ padding: '0px' }">                                
                    <div style="position:relative;">                                    
                        <div id="mapid" style="width: 100%; height: 90px; z-index: 0"></div>

                        <el-card style="position: absolute; top: 5%; left: 50%; transform: translateX(-50%); width: 90%;">
                            <el-row type="flex" justify="space-between">
                                <el-col :span="2">
                                    <i style="color: #F1948A; font-size: 20px" class="el-icon-location-information"></i>
                                </el-col>
                                <el-col :span="21">
                                    <span style="font-size: 13px; width: 100%">{{details.regionsTitles}}</span>
                                    <br>
                                    <span @click="showProductMap(details.product, 13)" class="link-text">{{$t('basic.see_in_map')}}</span>
                                </el-col>
                            </el-row>                                        
                        </el-card>                                                
                    </div>                    
                </el-card>                
            </el-row>                   
            
            <!-- ordinary -->
            <el-row :gutter="20" type="flex" style="flex-wrap: wrap; margin: 1rem .5rem">
                <el-col :span="24" v-for="extra in extras.ordinary" :key="extra.id">
                    <el-row class="extra" type="flex" justify="space-between"  style="margin: 0 .5rem;">
                        <el-col>
                            <span class="extra-name">{{extra.name}}</span>
                        </el-col>
                        <el-col>
                            <span class="extra-value">{{extra.value}}</span>
                        </el-col>
                    </el-row> 
                    <hr>                   
                </el-col>                
            </el-row>

            <!-- custom -->            
            <el-row :gutter="20" type="flex" style="flex-wrap: wrap; margin: 0 .5rem">
                <el-col :span="24" v-for="extra in extras.custom" :key="extra.id">
                    
                    <el-row class="extra" type="flex" justify="space-between" style="margin: 0 .5rem">
                        <el-col>
                            <span class="extra-name">{{extra.name}}</span>
                        </el-col>
                        <el-col v-if="extra.customs.find(data => data.id == extra.value)">
                            <span class="extra-value">{{extra.customs.find(data => data.id == extra.value)[$store.state.mainLang]}}</span>
                        </el-col>
                    </el-row>
                    <hr>                   
                </el-col>
            </el-row>

            <div v-if="details.product.type == 2" style="margin: 0 1.2em">
                <div style="display: flex; justify-content: center;">
                    <strong style="text-align: center"> {{$t('advertise.product_type')}} </strong>
                </div>
                <el-row class="extra" type="flex" justify="space-between" style="margin: 0 .5rem">
                    <el-col>
                        <span class="extra-name">{{$t('advertise.month')}}</span>
                    </el-col>
                    <el-col>
                        <span class="extra-value" style="margin-left: 0.5em">{{details.product.month}}</span>
                    </el-col>
                </el-row>     
                <hr>                     

                <el-row class="extra" type="flex" justify="space-between" style="margin: 0 .5rem">
                    <el-col>
                        <span class="extra-name">{{$t('advertise.prepay')}}</span>
                    </el-col>
                    <el-col>
                        <span class="extra-value" style="margin-left: 0.5em">{{details.product.prepay}}</span>
                    </el-col>
                </el-row>
                <hr>          

                <el-row class="extra" type="flex" justify="space-between" style="margin: 0 .5em">
                    <el-col >
                        <span class="extra-name">{{$t('advertise.monthly_payment')}}</span>
                    </el-col>
                    <el-col>
                        <span class="extra-value" style="margin-left: 0.5em">{{details.product.monthly_payment}}</span>
                    </el-col>
                </el-row>  
            </div>
               <el-row style="margin: 0.5em; margin-left: 25px">
                    <span style="font-size: 14px">{{$t('basic.seen_num')}}: </span>
                    <span style="font-size: 14px; font-weight: bold;">{{details.product.seen}}</span>
                </el-row>    
                  <hr>
                                          <el-row style="margin-left: 17px; margin-top: 5px; display: flex; align-items: center;">
                            <span style="font-size: 14px; margin-right: 5px">
                                {{$t('basic.share')}}:
                            </span>
                        <telegram-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                       <facebook-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                        <instagram-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                        <odnoklassniki-button
                              class="share-button--circle share-button--outline" btnText
                              shareUrl="https://igiper.uz"/>
                        </el-row>
                        <hr>
            
            <el-row style="margin: 1.5em 1rem">
                <span v-html="details.product.description"></span>
            </el-row>

            <div style="padding: 14px; margin-top: 1rem"> 
                <el-row type="flex" justify="center">
                    <el-avatar :size="80" :src="details.user.photo ? $serverImageUrl + details.user.photo : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' "></el-avatar>                                                                 
                </el-row>                          
                
                <el-row type="flex" justify="center">                                   
                    <el-link style="text-align: center; font-size: 20px" @click="seeUsersAllProducts" type="primary">{{details.user.name}}</el-link>                                        
                </el-row>    

                <el-row type="flex" justify="center">
                    <span v-if="$store.state.mainLang=='uz'" style="font-size: 14px; color: #839192;"> {{details.user.createdAt | toTime(false)}} {{$t('basic.since')}} </span>
                    <span v-else style="font-size: 14px; color: #839192;">{{$t('basic.since')}} {{details.user.createdAt | toTime(false)}}</span>
                </el-row>

                <el-row type="flex" justify="center" style="margin-top: 1rem">                            
                    <el-button @click="seeUsersAllProducts" type="text" plain class="button">{{$t('basic.auth_all_ads')}}</el-button>                                                        
                </el-row>
            </div>          

            <el-row type="flex" v-if="!details.product.isOwner">
                <el-col>
                    <el-button @click="callAuthor" style="width: 100%" icon="el-icon-phone-outline" type="success">{{$t('basic.call')}}</el-button>
                </el-col>
                <el-col>
                    <el-button @click="sendMessageDialogOpen" style="width: 100%" icon="el-icon-message" type="info">{{$t('basic.message')}}</el-button>
                </el-col>                
            </el-row>            
        </div>  

        <el-dialog :visible.sync="sendMessageDialogVisible" :fullscreen="true">            

            <el-form :model="messageForm" ref="messageForm" :rules="messageForm.rules">
                <el-form-item :label="$t('basic.message_text')" prop="text">
                    <el-input @focus="checkIfLogedIn" :placeholder="$t('basic.message_text')" rows="7" type="textarea" v-model="messageForm.text"></el-input>
                </el-form-item>

                <el-form-item>
                                                        
                    <!-- <i class="el-icon-paperclip primary-color-item"></i>
                    <span class="text">Fayl biriktirish</span> -->
                    <el-button @click="sendMessage" style="float: right" type="primary" icon="el-icon-message">{{$t('basic.send')}}</el-button>                                        
                
                </el-form-item>
            </el-form>

        </el-dialog>

        <el-dialog :fullscreen="isMobileVersion" :visible.sync="mapVisible">
            <div id="productLocation" style="width: 100%; height: 400px;"></div>
        </el-dialog>   

        <el-dialog :fullscreen="isMobileVersion" :visible.sync="upgradeDialogVisible">
            <el-row :gutter="10" justify="center" style="flex-wrap: wrap;" :key="updateTariffsKey">
                <el-col :span="8"  style="margin-top: 0rem;" v-for="tariff in tariffs" :key="tariff.id">
                    <div @click="selectTariff(tariff)" >
                        <el-card :body-style="{ padding: '0px' }" :shadow="tariff.shadow" :style="`cursor: pointer; height: 16.5rem;`">
                            <div slot="header" class="clearfix">
                                <span>{{tariff.title}}</span>                                        
                            </div>
                            
                            <img height="125" width="125" :src="$serverImageUrl + tariff.image" class="image">
                            
                            <div class="text">                                                                                                                                    
                                <div>
                                    <span>{{$t('advertise.price')}}: </span> {{tariff.price}} {{$t('advertise.soum')}}
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

                <el-button @click="upgradeAdvertisement" type="primary" size="medium" style="float: right; margin-top: 1rem">{{$t('basic.advertise')}}</el-button>                      
            </el-row>            
        </el-dialog>        

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

        <el-drawer :show-close="false" size="30%" :wrapperClosable="false" :modal="false" :visible.sync="drawer" direction="btt">
            <el-row type="flex" justify="center">
                <el-col :span="16">
                    <el-row type="flex" justify="space-between">
                        <div style="float: left;">
                            <i class="el-icon-arrow-left"></i>
                            <span class="text" @click="$router.push({ name: 'profile' })">{{$t('basic.to_my_profile')}}</span>
                        </div>

                        <div style="float: right;">
                            <!-- <span class="text">Keyingi e`lon</span>
                            <i class="el-icon-arrow-right"></i>     -->
                            <el-divider direction="vertical"></el-divider>
                            <span @click="drawer = false" class="text">{{$t('basic.close')}}</span>
                            <i class="el-icon-arrow-down"></i>
                        </div>
                    </el-row>

                    <el-divider></el-divider>
                    <el-row type="flex" justify="space-between" style="margin-bottom: .5rem;" align="center">
                        <div style="display: flex; float: left; align-items: center;">
                            <div>
                                <i style="color: #1F618D" class="el-icon-edit"></i> <br>
                                <span @click="$router.push({name: 'makeannouncement', params: {adId: id}})" class="text" style="margin-left: .3rem">{{$t('basic.change')}}</span>
                            </div>
                            <!-- <div style="margin: 0 1rem;">
                                <i style="color: #2980B9" class="el-icon-document"></i>
                                <span class="text" style="margin-left: .3rem">{{$t('basic.to_pdf')}}</span>
                            </div> -->
                            <div style="margin-left: .5rem">
                                <i style="color: #F1948A" class="el-icon-delete-solid"></i> <br>
                                <span @click="deleteItem(id)" class="text" style="margin-left: .3rem">{{$t('basic.delete')}}</span>
                            </div>
                        </div>

                        <div style="float: right; margin-right: .5rem;">
                            <i v-if="$store.state.isMobileVersion" style="color: #52BE80" class="el-icon-check"></i> <br>
                            <span v-if="$store.state.isMobileVersion" @click="advertise" class="text" style="margin-left: .3rem">{{$t('basic.advertise')}}</span>

                            <el-button v-else @click="advertise" size="small" type="success">{{$t('basic.advertise')}}</el-button>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </el-drawer>

        <el-row type="flex" justify="center" style="z-index: 1;">
            <el-button class="hidden-md-and-up" id="advertiseBtn" size="large" style="border-radius: 25px; width: 60%; position: fixed; bottom: 2.5rem; background-color: #01BFA5; color: white;" @click="$router.push({ name: 'makeannouncement' })" icon="el-icon-plus">
                {{$t('advertise.title')}}
            </el-button>
        </el-row>
        

    </el-container>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import FacebookButton from "vue-share-buttons/src/components/FacebookButton.vue";
import TelegramButton from "vue-share-buttons/src/components/TelegramButton.vue";
import OdnoklassnikiButton from "vue-share-buttons/src/components/OdnoklassnikiButton.vue";
// import OdnoklassnikiButton from "vue-share-buttons/src/components/";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// <meta property="og:title" content="European Travel Destinations">
// <meta property="og:description" content="Offering tour packages for individuals or groups.">
// <meta property="og:image" content="http://euro-travel-example.com/thumbnail.jpg">
// <meta property="og:url" content="http://euro-travel-example.com/index.htm">

import VuePictureSwipe from 'vue-picture-swipe';
import Installment from '@/components/Installment/index.vue';

export default {
    // metaInfo () {
    //     return {            
    //         meta: [
    //             { property: 'og:title', content: this.details ? this.details.product.name : 'loading' },
    //             { property: 'og:description', content: this.details ? this.details.product.description : 'loading' },
    //             { property: 'og:image', content: this.details ? (this.details.product.images.length > 0 ? this.$serverImageUrl + this.details.product.images[0] : require('@/assets/no-image-icon.png') ) : 'loading' },
    //             { property: 'og:url', content: this.details ? ('http://igiper.uz/product/' + this.details.product.id) : 'loading' },
    //             { property: 'fb:app_id', content: '420980361937431'},
    //             { property: 'og:type', content: 'website' },
    //             { property: 'og:site_name', content: 'Сайт бесплатных объявлений iGiper.uz'},
    //             { property: 'og:locale', content: 'ru_RU' }
    //         ]
    //     }
    // },            

    props: {
        id: {
            type: String | Number,
            required: true
        }
    },

    data () {
        let checkMessageText = (rule, value, callback) => {
            if (value == '') {
                callback(new Error(this.$t('rules.required')))
            }else if (value.length <= 7) {
                callback(new Error(this.$t('rules.message6')))
            }else {
                callback();
            }
        }; 

        return {       
            swiperVisible: true,
            items: [],     
            gallery: '',
            carouselHeight: 250, //default
            tagName: 'salomlar',
            from: '',

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

            sendMessageDialogVisible: false,

            isMobileVersion: false,

            drawer: false,

            productId: '',

            loading: false,

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

            updateTariffsKey: 0,

            tariffs: [],

            selectedTariff: {},
            selectedAdvertisement: {},

            upgradeDialogVisible: false,

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

    created () {        
        this.checkDeviceScreen();
    },

    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },

    mounted () {                    
        this.productId = this.id;

        this.getProduct(this.productId); 
                        
        if (this.$store.state.userInfo.token) {
            this.getTariffs();               
        }             

        this.setCarouselHeight();       
        
        window.addEventListener('scroll', this.handleScroll);
    },

    components: {
        FacebookButton,
        TelegramButton,
        OdnoklassnikiButton,
        VuePictureSwipe,
        Installment
    },

    methods: {        
        handleScroll () {            
            if (window.scrollY > this.carouselHeight && (document.getElementById('mobileScreen') && window.scrollY < document.getElementById('mobileScreen').offsetHeight)) {
                document.getElementById('advertiseBtn').style.opacity = '1';
            }else {
                document.getElementById('advertiseBtn').style.opacity = '0';
            }
        },
        //since images can be of dirrenet height sizes, we need to define the highest image to set image height for all images
        setCarouselHeight () {
            const images = document.getElementsByClassName('product-images');

            let maxHeight = 0;
            for (let index = 0; index < images.length; index++) {
                const element = images[index];
                
                if (element.height > maxHeight) {
                    maxHeight = element.height;
                }
            }

            this.carouselHeight = maxHeight ? maxHeight : this.carouselHeight;            
        },

        back () {                        
            this.$router.go(-1);
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

        upgradeAdvertisement () {            

            if (this.$store.state.userInfo.balance < this.selectedTariff.price) {
                Message({
                    type: 'warning',
                    message: this.$t('basic.not_enough_money'),
                    duration: 4000
                })

                this.openPaymendDialog();
                return;                
            }            

            this.loading = true;

            const metadata = {
                url: 'addtop',
                data: {
                    id: this.id,
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

                })
                .catch(error => {

                })
                .finally(() => {
                    this.loading = false;
                })
        },

        getUserInfo () {
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

        selectTariff (item) {                                                   

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

        getTariffs () {
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

        openTariffsDialog () {            
            this.selectedAdvertisement = this.details;
            this.selectedTariff = this.tariffs[0];
            this.upgradeDialogVisible = true;
        },

        closeTarrifsDialog() {
            this.selectedAdvertisement = {};
            this.selectedTariff = {};
            this.upgradeDialogVisible = false;
        },

        callAuthor () {            
            location.href = 'tel:' + '+' + this.details.user.phone;
        },

        sendMessageDialogOpen () {
            this.sendMessageDialogVisible = true;
            this.checkIfLogedIn();
        },
        
        sendMessageDialogClose () {
            this.sendMessageDialogVisible = false;
        },

        checkDeviceScreen () {
            //getting screen`s current height and width for cross browser
            let width = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth
            
            let height = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight                    

            this.isMobileVersion = width < 768;
        },

        writeToAuthor () {
            document.getElementById('messageForm').scrollIntoView();
        },

        handleRegionClick () {            
        },

        onCategoryClick (item) {

            let categoryTree = [];
            for(let index = 0; this.details.categories; index++) {
                const element = this.details.categories[index];
                categoryTree.push(element.id);

                if (element.id == item.id) {
                    break;
                }
            }

            this.$store.commit('SET_PRODUCT_DATA', {categoryId: categoryTree});            
            this.$router.push({name: 'products'});
        },

        seeUsersAllProducts () {       
            this.$store.commit('SET_PRODUCT_DATA', {search: ''});

            const userInfo = {
                image: this.details.user.photo,
                name: this.details.user.name ? this.details.user.name : this.details.user.phone,
                id: this.details.user.id                
            }
            
            this.$router.push({name: 'products', params: {userInfo: userInfo}});
        },

        toDetails (id) {                        
            this.productId = id;
            this.getProduct(this.productId);
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
                    let message = response ? this.$t('basic.added_to_favs') : this.$t('basic.taken_from_favs');
                    this.$notify({ 
                        type: 'success',
                        message
                    })
                    this.getProduct(this.productId);
                    this.getUserInfo();
                })  
                .catch(error => {   
                    this.$notify({
                        type: 'error',
                        message: this.$t('basic.server_error'),
                        duration: 4000
                    })
                })
        },

        deleteItem(id) {
            this.drawer = false;
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
                            id
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

        advertise () {
            // console.log(this.id)
            this.openTariffsDialog();
        },

        showProductMap(product, zoom) {
            this.mapVisible = true;

            setTimeout(() => {
                if (!this.mapLocation) {                                       
                    this.mapLocation = L.map('productLocation', { zoomControl: true, fullscreenControl: !this.isMobileVersion}).setView([product.location.lat, product.location.lng], zoom);

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
                    //NProgress.start();
                    // console.log(this.details)
                    const metadata = {
                        url: 'message',
                        method: 'post',
                        data: {
                            fromId: -1,
                            text: this.messageForm.text,
                            productId: this.details.product.id,
                            toId: this.details.user.id
                        }
                    }

                    this.$store.dispatch('setData', metadata)
                        .then(response => {

                            this.$notify({
                                type: 'success',
                                message: this.$t('basic.message_sent')
                            })
                            if (this.isMobileVersion) {
                                this.sendMessageDialogClose();
                            }
                            
                            this.messageForm.text = ''
                            document.body.scrollIntoView({behavior: 'smooth', block: 'start'});            
                        })
                        .catch(error => {
                            // console.log(error);
                        })
                        .finally(() => {
                            //NProgress.done();
                        })
                }
            })
        },

        getProduct(id) {             
            document.body.scrollIntoView({behavior: 'smooth', block: 'start'});           

            this.loading = true;
            //NProgress.configure({ parent: '#container1' });
            

            //NProgress.start();
            const metadata = {
                url: 'product',
                params: {
                    productId: id,
                    lang: this.$store.state.mainLang
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
                    this.details.mainImage = response.product.images && response.product.images[0] ? response.product.images[0] : '';

                    if (response.product.images) {
                        for (const image of response.product.images) {                        
                            this.items.push({
                                src: this.$serverImageUrl + image,
                                w: 1200,
                                h: 1200,                
                            })
                        }
                    }                                                                                 

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
                    this.loading = false;
                    //NProgress.done();                    
                })
        },

        seeImages () {                         
            if (this.isMobileVersion) {
                document.getElementById('myswiper').style.opacity = '1';
                document.getElementsByTagName('figure')[0].click();
                
                document.getElementsByClassName('pswp__button--close')[0].addEventListener('click', function() {
                    document.getElementById('myswiper').style.opacity = '0';
                })
                
            }else {
                this.gallery = new Viewer(document.getElementById('images'));            
                setTimeout(() => {
                    document.getElementsByClassName('product-images')[0].click();                
                }, 1000);
            }                        
        }
    }    
}
</script>

<style lang="scss" scoped>
@import '../custom.scss';
// img {
//     object-fit: contain; 
//     object-position: 100% 100%;
// }

.item-title {
    cursor: pointer;
    color: $primary-color;
}

.tt{                   
    width: 100%;      
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
}

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