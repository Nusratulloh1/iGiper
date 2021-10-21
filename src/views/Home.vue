<template>
    <div style="display: flex; justify-content: center">
        <div style="max-width: 1200px;">

            <el-row type="flex" justify="space-between">
                <el-col>
          <span class="hidden-sm-and-down" style="font-size: 20px; font-weight: bold;">
              {{ $t('basic.aksiya') }}
          </span>

                    <div class="hidden-sm-and-down products-block" v-loading="loading" style="grid-gap: 30px">
                        <div style="position: relative !important; overflow: hidden;" v-for="aksiya of productAksiya"
                             :key="aksiya.id">
                            <el-card class="hidden-sm-and-down" shadow="hover" :body-style="{ padding: '0px' }">
                                <div>
                                    <div class="top-product-indicator-aksiya">
                                        <span style="text-align: center;">{{ $t('basic.aksiya') }}</span>
                                    </div>
                                    <div class="top-product-indicator-skidka">
                                        <div class="d-flex">
                                            {{ aksiya.percent }}%
                                        </div>
                                    </div>
                                    <a :href="aksiya.url" style="height: 180px; display: block;">
                                        <img style="cursor: pointer;" height="180px" width="100px"
                                             :src="$serverImageUrl + aksiya.image">
                                    </a>
                                    <!--                                    <div style="float: right" class="heart">-->
                                    <!--&lt;!&ndash;                                        <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start" effect="light">&ndash;&gt;-->
                                    <!--&lt;!&ndash;                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>&ndash;&gt;-->
                                    <!--&lt;!&ndash;                                        </el-tooltip>&ndash;&gt;-->
                                    <!--                                        <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">-->
                                    <!--                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>-->
                                    <!--                                        </el-tooltip>-->
                                    <!--                                    </div>-->
                                    <span class="ad-text1 tt">{{ $t('basic.aksiya') }}</span>
                                    <el-row style="margin: 5px; display: flex; align-items: center">
                                        <del><span class="tt"
                                                   style="color: #939393; font-size: 15px; margin-right: 8px;">{{ aksiya.oldPrice }} USD</span>
                                        </del>
                                        <span class="tt" style="font-size: 18px;">{{ aksiya.actionPrice }} USD</span>
                                    </el-row>
                                    <el-row style="width: 100%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                        <span>
                                            <i style="color: #F0B27A" class="el-icon-time"></i>
                                            <span
                                                    style="margin-left: .2rem; font-size: 13px">{{ aksiya.fromDate }}</span> -
                                        </span>
                                        <span>
                                            <i style="color: #F0B27A" class="el-icon-time"></i>
                                            <span style="margin-left: .2rem; font-size: 13px">{{ aksiya.toDate }}</span>
                                        </span>
                                    </el-row>
                                </div>
                            </el-card>
                        </div>
                    </div>

                    <!--          <div class="hidden-sm-and-down" style="font-size: 20px; font-weight: bold; margin-top: 1rem;">
                                {{ $t('basic.top_announcement') }}
                              </div>

                              <div class="hidden-sm-and-down" v-loading="loading" type="flex" justify="center"
                                   style="margin-bottom: 1.2rem; position: relative;">
                                <swiper :options="swiperOption2" style="margin-top: 1rem;">
                                  <swiper-slide v-for="product of products" :key="product.id" style="position: relative; overflow: hidden;">
                                    <el-card shadow="hover" :body-style="{ padding: '0px' }" style="margin-right: 5px !important;">
                                      <div>
                                        <img v-if="!product.isTop" @click="toDetails(product.id)" style="cursor: pointer;" height="180"
                                             :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')"
                                             alt="">
                                        <carousel height="180px" perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5
                                                  paginationActiveColor="#01BFA5">
                                          <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                            <img @click="toDetails(product.id)" style="cursor: pointer;" height="150px" width="100px"
                                                 :src="$serverImageUrl + ad">
                                          </slide>
                                        </carousel>
                                        <div class="top-product-indicator">
                                          <span style="text-align: center;">{{ $t('basic.top') }}</span>
                                        </div>
                                        <div style="float: right" class="heart">
                                          <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start"
                                                      effect="light">
                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                          </el-tooltip>

                                          <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                          </el-tooltip>
                                        </div>
                                        <span @click="toDetails(product.id)" class="ad-text1 tt">{{ product.name }}</span>
                                        <el-row style="margin: 5px;" type="flex" justify="space-between">
                                          <span class="tt">{{ product.price }} {{ product.currency.name }}</span>
                                        </el-row>
                                        <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                          <i style="color: #F0B27A" class="el-icon-time"></i>
                                          <span style="margin-left: .2rem; font-size: 13px">{{ product.createdAt | toTime(true) }}</span>
                                        </el-row>
                                        <Installment v-if="product.type == 2" style="position: absolute; top: 3.5em; right: .2em"
                                                     :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                                      </div>
                                    </el-card>
                                  </swiper-slide>
                                  &lt;!&ndash; <div class="swiper-pagination" slot="pagination"></div> &ndash;&gt;
                                  <div class="swiper-button-prev" slot="button-prev"></div>
                                  <div class="swiper-button-next" slot="button-next"></div>
                                </swiper>
                              </div>-->

                    <div class="hidden-sm-and-down" style="font-size: 20px; font-weight: bold; margin-top: 1rem;">
                        {{ $t('basic.allAds') }}
                    </div>

                    <div class="hidden-sm-and-down products-block"
                         style="margin-bottom: 1.2rem; position: relative; grid-gap: 30px;">
                        <div style="position: relative; overflow: hidden;" v-for="product in products"
                             :key="product.id">
                            <el-card shadow="hover" :body-style="{ padding: '0px' }"
                                     style="margin-right: 5px !important;">
                                <div>
                                    <img v-if="!product.isTop" @click="toDetails(product.id)"
                                         style="cursor: pointer; height: 180px;"
                                         :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')"
                                         alt="">
                                    <carousel v-else style="height: 180px;" :perPage=1
                                              paginationPosition="bottom-overlay" :paginationPadding=5
                                              paginationActiveColor="#01BFA5">
                                        <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                            <img @click="toDetails(product.id)" style="cursor: pointer;" 
                                                 height="180px"
                                                 width="100px"
                                                 :src="$serverImageUrl + ad">
                                        </slide>
                                    </carousel>
                                    <div class="top-product-indicator">
                                        <span style="text-align: center;">{{ $t('basic.top') }}</span>
                                    </div>
                                    <div style="float: right" class="heart">
                                        <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga"
                                                    placement="top-start"
                                                    effect="light">
                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                        </el-tooltip>

                                        <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start"
                                                    effect="light">
                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                        </el-tooltip>
                                    </div>
                                    <span @click="toDetails(product.id)" class="ad-text1 tt">{{ product.name }}</span>
                                    <el-row style="margin: 5px;" type="flex" justify="space-between">
                                        <span class="tt">{{ product.price }} {{ product.currency.name }}</span>
                                    </el-row>
                                    <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                        <span style="margin-left: .2rem; font-size: 13px">{{ product.createdAt | toTime(true) }}</span>
                                    </el-row>
                                    <Installment v-if="product.type == 2"
                                                 style="position: absolute; top: 3.5em; right: .2em"
                                                 :monthlyPayment="product.monthly_payment"
                                                 :currency="product.currency.name"/>
                                </div>
                            </el-card>
                        </div>
                        <div style="position: relative; overflow: hidden;" v-for="product in allMassiv"
                             :key="product.id">
                            <el-card shadow="hover" :body-style="{ padding: '0px' }">

                                <div @click="toDetails(product.id)">
                                    <!-- <div v-if="!product.isTop" style="height: 180px;">
                                        <img v-if="!product.isTop" @click="toDetails(product.id)"
                                             style="cursor: pointer; height: 180px;"
                                             :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')"
                                             alt="">
                                    </div> -->
                                    <carousel style="height: 180px;" :perPage=1
                                              paginationPosition="bottom-overlay" :loop=true :autoplay=true :paginationPadding=5
                                              paginationActiveColor="#01BFA5">
                                        <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                            <img @click="toDetails(product.id)" style="cursor: pointer;" height="180px"
                                                 width="100px"
                                                 :src="$serverImageUrl + ad">
                                        </slide>
                                    </carousel>
                                    <span @click="toDetails(product.id)" class="ad-text1 tt">{{ product.name }}</span>
                                    <div style="float: right" class="heart">
                                        <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga"
                                                    placement="top-start"
                                                    effect="light">
                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                        </el-tooltip>

                                        <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start"
                                                    effect="light">
                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                        </el-tooltip>
                                    </div>
                                    <el-row style="margin: 5px;" type="flex" justify="space-between">
                                        <span class="tt">{{ product.price }} {{ product.currency.name }}</span>
                                    </el-row>
                                    <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                        <span style="margin-left: .2rem; font-size: 13px">{{ product.createdAt | toTime(true) }}</span>
                                    </el-row>
                                    <Installment v-if="product.type == 2"
                                                 style="position: absolute; top: 1em; left: 1em"
                                                 :monthlyPayment="product.monthly_payment"
                                                 :currency="product.currency.name"/>
                                </div>
                            </el-card>
                        </div>
                    </div>


                    <!--                    Mobile version top products -->

                    <div id="mobileVersion" class="hidden-md-and-up" style="padding: 0 3px" v-loading="loading">
                        <div v-if="products && products.length > 0" style="position: relative; width: 98vw">
                            <div style="font-size: 20px; font-weight: bold;">
                                {{ $t('basic.aksiya') }}
                            </div>
                            <el-row style="flex-wrap: wrap;" :gutter="5" type="flex" justify="start">
                                <el-col :span="12"
                                        style="margin-top: 1rem; position: relative !important; overflow: hidden;"
                                        v-for="aksiya of productAksiya" :key="aksiya.id">
                                    <el-card shadow="hover" :body-style="{ padding: '0px'}"
                                             style="position: relative !important; overflow: hidden;">
                                        <div @click="toDetails(aksiya.id)">
                                            <div>
                                                <div class="top-product-indicator-aksiya">
                                                    <span style="text-align: center;">{{ $t('basic.aksiya') }}</span>
                                                </div>
                                                <div class="top-product-indicator-skidka2">
                                                    <div class="d-flex">
                                                        {{ aksiya.percent }}%
                                                    </div>
                                                </div>
                                                <a :href="aksiya.url" style="height: 150px;">
                                                    <img style="cursor: pointer;" height="150px"
                                                         :src="$serverImageUrl + aksiya.image">
                                                </a>

                                                <!--                                    <div style="float: right" class="heart">-->
                                                <!--&lt;!&ndash;                                        <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start" effect="light">&ndash;&gt;-->
                                                <!--&lt;!&ndash;                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>&ndash;&gt;-->
                                                <!--&lt;!&ndash;                                        </el-tooltip>&ndash;&gt;-->

                                                <!--                                        <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">-->
                                                <!--                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>-->
                                                <!--                                        </el-tooltip>-->
                                                <!--                                    </div>-->
                                                <span @click="toDetails(aksiya.id)" class="ad-text1 tt">{{ $t('basic.aksiya') }}</span>
                                                <el-row style="margin: 5px; display: flex; align-items: center">
                                                    <del><span class="tt"
                                                               style="color: #939393; font-size: 15px; margin-right: 8px;">{{ aksiya.oldPrice }} USD</span>
                                                    </del>
                                                    <span class="tt" style="font-size: 18px;">{{ aksiya.actionPrice }} USD</span>
                                                </el-row>
                                                <el-row style="width: 100%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                                    <div>
                                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                                        <span style="margin-left: .2rem; font-size: 13px">{{ aksiya.fromDate }}</span>
                                                    </div>
                                                    <div>
                                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                                        <span style="margin-left: .2rem; font-size: 13px">{{ aksiya.toDate }}</span>
                                                    </div>
                                                </el-row>
                                            </div>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </div>

                        <!--            <div v-if="products && products.length > 0" style="position: relative; width: 98vw">
                                      <div style="font-size: 20px; font-weight: bold; margin-bottom: 1rem; margin-top: 1rem;">
                                        {{ $t('basic.top_announcement') }}
                                      </div>
                                      <swiper :options="swiperOption" style="margin: 0 1.4rem; position: relative; z-index: 1;">
                                        <swiper-slide v-for="product of products" :key="product.id"
                                                      style="position: relative; overflow: hidden;">
                                          <el-card shadow="hover" :body-style="{ padding: '0px'}" style="position: relative; overflow: hidden;">
                                            <div @click="toDetails(product.id)">
                                              <img v-if="!product.isTop" @click="toDetails(product.id)" style="cursor: pointer;" height="150"
                                                   :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')"
                                                   alt="">
                                              <carousel v-else height="180px" perPage=1 paginationPosition="bottom-overlay"
                                                        :paginationPadding=5 paginationActiveColor="#01BFA5">
                                                <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                                  <img @click="toDetails(product.id)" style="cursor: pointer;" height="150px" width="100%"
                                                       :src="$serverImageUrl + ad">
                                                </slide>
                                              </carousel>
                                              <div class="top-product-indicator">
                                                <span style="text-align: center;">TOP</span>
                                              </div>
                                              &lt;!&ndash;                                            v-if="$store.state.userInfo.token&ndash;&gt;
                                              <div style="float: right" class="heart">
                                                <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start"
                                                            effect="light">
                                                  <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                                </el-tooltip>

                                                <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">
                                                  <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                                </el-tooltip>
                                              </div>

                                              <Installment v-if="product.type == 2" style="position: absolute; top: 3.5em; right: .2em"
                                                           :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                                              <span @click="toDetails(product.id)" class="ad-text1 tt">{{ product.name }}</span>
                                              <el-row style="margin: 5px;" type="flex" justify="space-between">
                                                <span class="tt">{{ product.price }} {{ product.currency.name }}</span>
                                              </el-row>
                                              <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                                <i style="color: #F0B27A" class="el-icon-time"></i>
                                                <span style="margin-left: .2rem; font-size: 13px">{{ product.createdAt | toTime(true) }}</span>
                                              </el-row>
                                            </div>
                                          </el-card>
                                        </swiper-slide>
                                        <div id="sw-prev" hidden class="swiper-button-prev" slot="button-prev"></div>
                                        <div id="sw-next" hidden class="swiper-button-next" slot="button-next"></div>
                                      </swiper>
                                      <div>
                                        <div @click="onSwipeClick('sw-prev')" class="swiper-button-prev"
                                             style="position: absolute; left: 0; margin-left: .25rem"></div>
                                        <div @click="onSwipeClick('sw-next')" class="swiper-button-next"
                                             style="position: absolute; right: 0; margin-right: .25rem"></div>
                                      </div>
                                    </div>-->

                        <br>

                        <div v-if="ordinaryProducts && ordinaryProducts.length > 0"
                             style="font-size: 20px; font-weight: bold;">
                            {{ $t('basic.allAds') }}
                        </div>

                        <el-row style="flex-wrap: wrap;" :gutter="5" type="flex" justify="start">
                            <el-col :span="12" style="margin-top: 1rem; position: relative" v-for="product in products"
                                    :key="product.id">
                                <el-card shadow="hover" :body-style="{ padding: '0px'}"
                                         style="position: relative; overflow: hidden;">
                                    <div @click="toDetails(product.id)">
             
                                        <carousel style="height: 150px; !important;" :perPage=1
                                                  paginationPosition="bottom-overlay"
                                                  :paginationPadding=5 paginationActiveColor="#01BFA5">
                                            <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                                <img @click="toDetails(product.id)" style="cursor: pointer;"
                                                     height="150px" width="100%"
                                                     :src="$serverImageUrl + ad">
                                            </slide>
                                        </carousel>
                                        <div class="top-product-indicator">
                                            <span style="text-align: center;">TOP</span>
                                        </div>
                                        <!--                                            v-if="$store.state.userInfo.token-->
                                        <div style="float: right" class="heart">
                                            <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga"
                                                        placement="top-start"
                                                        effect="light">
                                                <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                            </el-tooltip>

                                            <el-tooltip v-else content="Saralanganlardan chiqarish"
                                                        placement="top-start" effect="light">
                                                <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                            </el-tooltip>
                                        </div>

                                        <Installment v-if="product.type == 2"
                                                     style="position: absolute; top: 3.5em; right: .2em"
                                                     :monthlyPayment="product.monthly_payment"
                                                     :currency="product.currency.name"/>
                                        <span @click="toDetails(product.id)"
                                              class="ad-text1 tt">{{ product.name }}</span>
                                        <el-row style="margin: 5px;" type="flex" justify="space-between">
                                            <span class="tt">{{ product.price }} {{ product.currency.name }}</span>
                                        </el-row>
                                        <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                            <i style="color: #F0B27A" class="el-icon-time"></i>
                                            <span style="margin-left: .2rem; font-size: 13px">{{ product.createdAt | toTime(true) }}</span>
                                        </el-row>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="12" style="margin-top: 1rem; position: relative" v-for="product in allMassiv"
                                    :key="product.id">
                                <el-card shadow="hover" :body-style="{ padding: '0px'}">

                                    <div @click="toDetails(product.id)">
                                        <!-- <img v-if="!product.isTop" @click="toDetails(product.id)"
                                             style="cursor: pointer; height: 150px;" height="150"
                                             :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')"
                                             alt=""> -->
                                        <carousel style="height: 150px !important;" :perPage = 1
                                                  paginationPosition="bottom-overlay" :loop="true" :autoplay="true"
                                                  :paginationPadding=5 paginationActiveColor="#01BFA5">
                                            <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                                <img @click="toDetails(product.id)"
                                                     style="cursor: pointer; height: 150px;" height="150" width="100px"
                                                     :src="$serverImageUrl + ad">
                                            </slide>
                                        </carousel>
                                        <div style="float: right" class="heart">
                                            <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga"
                                                        placement="top-start"
                                                        effect="light">
                                                <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                            </el-tooltip>

                                            <el-tooltip v-else content="Saralanganlardan chiqarish"
                                                        placement="top-start" effect="light">
                                                <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                            </el-tooltip>
                                        </div>
                                        <!--                                        <div v-else style="position: relative;">-->
                                        <!--                                            <carousel v-if="!product.isTop" height="180px">-->
                                        <!--                                                <slide v-for="ad of product.images" :key="ad.id" class="slide">-->
                                        <!--                                                    <img @click="toDetails(product.id)" style="cursor: pointer;" height="180px" width="100px" :src="$serverImageUrl + ad">-->
                                        <!--                                                </slide>-->
                                        <!--                                            </carousel>-->
                                        <!--                                        </div>-->
                                        <Installment v-if="product.type == 2"
                                                     style="position: absolute; top: 1em; left: 1em"
                                                     :monthlyPayment="product.monthly_payment"
                                                     :currency="product.currency.name"/>
                                        <span @click="toDetails(product.id)"
                                              class="ad-text1 tt">{{ product.name }}</span>
                                        <el-row style="margin: 5px;" type="flex" justify="space-between">
                                            <span class="tt">{{ product.price }} {{ product.currency.name }}</span>
                                        </el-row>
                                        <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                            <i style="color: #F0B27A" class="el-icon-time"></i>
                                            <span style="margin-left: .2rem; font-size: 13px">{{ product.createdAt | toTime(true) }}</span>
                                        </el-row>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>

                    <el-row>
                        <el-button v-if="productsCount > 16" @click="seeAll" style="float: right" type="text"><span
                                class="see-all-text">{{ $t('basic.see_all') }}</span> <i
                                class="el-icon-arrow-right"></i></el-button>
                    </el-row>
                </el-col>
            </el-row>

            <el-row type="flex" justify="center" style="z-index: 1;">
                <el-button class="hidden-md-and-up border-0" id="advertiseBtn" size="large"
                           style="border-radius: 25px; width: 60%; position: fixed; bottom: 2.5rem; background-color: #01BFA5; color: white;"
                           @click="$router.push({ name: 'makeannouncement' })" icon="el-icon-plus">
                    {{ $t('advertise.title') }}
                </el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Cookies from 'js-cookie'
    // require styles
    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {Hooper} from 'hooper';
    import 'hooper/dist/hooper.css';
    import {Carousel, Slide} from 'vue-carousel';

    import Installment from '@/components/Installment/index.vue';

    export default {
        name: 'home',
        components: {
            Installment,
            swiper,
            swiperSlide,
            Hooper,
            Slide,
            Carousel
        },

        data() {
            return {
                swiperOption: {
                    autoplay: {
                        delay: 85000,
                        disableOnInteraction: false
                    },
                    slidesPerView: 2,
                    spaceBetween: 2,
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
                swiperOption2: {
                    autoplay: {
                        delay: 8500,
                        disableOnInteraction: false
                    },
                    slidesPerView: 5,
                    spaceBetween: 1,
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

                size: 20,
                offset: 0,

                showNavbar: true,
                lastScrollPosition: 1100,
                currentScrollPosition: null,

                loading: false,
                products: [],
                productsCount: 0,
                productAksiya: [],
                ordinaryProducts: [],
                ordinaryProductsCount: 0,
                productMassiv: [],
                allMassiv: [],
            }
        },
        beforeDestroy() {
            // window.removeEventListener('scroll', this.onScroll)
        },

        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        },

        mounted() {
            // console.log(document.getElementById('mobileVersion').offsetHeight);
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('scroll', this.onScroll)
            this.getProducts();
            // console.log(this.$store.state.fromItemDetails)
            // if (this.$store.state.fromItemDetails) {
            //     this.onCurrentPageChange(this.$store.state.paginationLastPage);
            //     this.$store.commit('SET_FROM_ITEM_DETAILS', false);
            //     this.$store.commit('SET_PAGINATION_LAST_PAGE', this.$store.state.paginationLastPage);
            //   }else {
            //     this.getOrdinaryProducts();
            //     this.$store.commit('SET_PAGINATION_LAST_PAGE', 1);
            //   }
            this.getOrdinaryProducts();
            this.getAksiya();
        },
        methods: {
            onScroll() {
                this.currentScrollPosition = window.scrollY;
                if (this.currentScrollPosition >= this.lastScrollPosition) {
                    this.lastScrollPosition += 1100;
                    this.size = 20;
                    this.offset += 20;
                    this.getOrdinaryProducts()
                }
            },
            handleScroll() {
                if (window.scrollY > 200 && (document.getElementById('mobileScreen') && window.scrollY < document.getElementById('mobileVersion').offsetHeight - 100)) {
                    document.getElementById('advertiseBtn').style.opacity = '1';
                } else {
                    document.getElementById('advertiseBtn').style.opacity = '0';
                }
            },
            // onCurrentPageChange (page) {
            //     this.$store.commit("SET_PAGINATION_LAST_PAGE", page);
            //     this.offset = (page - 1) * this.size;
            //
            //     this.getOrdinaryProducts();
            // },

            onSwipeClick(target) {
                document.getElementById(target).click();
            },

            favouritesAction(id) {
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
                        let message = response ? this.$t('basic.added_to_favs') : this.$t('basic.taken_from_favs');
                        this.$notify({
                            type: 'success',
                            message
                        })

                        this.getProducts();
                    })
                    .catch(error => {
                        this.$notify({
                            type: 'error',
                            message: this.$t('basic.server_error'),
                            duration: 4000
                        })
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },

            seeAll() {
                this.$store.commit("SET_SEE_ALL_TOP", true);
                this.$router.push({name: 'products'});
            },

            getAksiya() {
                this.loading = true;
                const metadata = {
                    url: 'actions',
                    data: ''
                }
                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.productAksiya = response;
                    }).finally(() => {
                    this.loading = false;
                })
            },

            getProducts() {
                this.loading = true;
                const metadata = {
                    url: 'products',
                    params: {
                        isTop: 1,
                        size: 10,
                        offset: 0,
                        regionId: this.$store.state.mobileFilterForm.regions.length > 0 ? this.$store.state.mobileFilterForm.regions[this.$store.state.mobileFilterForm.regions.length - 1].id : null,
                        categoryId: this.$store.state.mobileFilterForm.categories.length > 0 ? this.$store.state.mobileFilterForm.categories[this.$store.state.mobileFilterForm.categories.length - 1].id : null
                    }
                }

                const token = Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null;
                if (token && token.length > 0) {
                    metadata.url += '/token';
                    metadata.token = token
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.productsCount = response.count;

                        this.products = response.productList;
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },

            getOrdinaryProducts() {
                const metadata = {
                    url: 'products',
                    params: {
                        isTop: 0,
                        size: this.size,
                        offset: this.offset,
                        categoryId: this.$store.state.mobileFilterForm.categories.length > 0 ? this.$store.state.mobileFilterForm.categories[this.$store.state.mobileFilterForm.categories.length - 1].id : null,
                        regionId: this.$store.state.mobileFilterForm.regions.length > 0 ? this.$store.state.mobileFilterForm.regions[this.$store.state.mobileFilterForm.regions.length - 1].id : null
                    }
                }

                const token = Cookies.getJSON('userInfo') ? Cookies.getJSON('userInfo').token : null;

                if (token && token.length > 0) {
                    metadata.url += '/token';
                    metadata.token = token
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.ordinaryProductsCount = response.count;
                        this.ordinaryProducts = response.productList;
                        this.productMassiv.push(response.productList)

                    }).then(() => {
                    for (let i = 0; i < this.productMassiv.length; i++) {
                        for (let j = 0; j < this.productMassiv[i].length; j++) {
                            this.allMassiv.push(this.productMassiv[i][j]);
                        }
                    }
                })
            },

            toDetails(id) {
                this.$router.push({name: 'product', params: {id}})
            }
        }
    }
</script>

<style lang="scss">
    @import '../custom.scss';

    .products-block {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
    }

    .heart {
        position: absolute;
        right: 1rem;
        top: .5rem;
        font-size: 1.6rem;
    }

    .fa-heart {
        color: #ffffff;
    }

    .el-carousel__button {
        width: 10px !important;
        height: 10px !important;
        border-radius: 50% !important;

        &:focus {
            outline: none !important;
        }
    }

    .el-carousel__arrow {
        outline: none !important;
    }

    .el-carousel__indicator--horizontal {
        padding: 2px 3px !important;
    }

    .prev-btn1 {
        left: 50%;
        right: auto;
    }

    .next-btn1 {
        right: 50%;
        left: auto;
    }

    .swiper-button-prev, .swiper-button-next {
        top: 60% !important;
        width: 27px;
        height: 24px;
    }

    .swiper-button-prev {
        left: -3%;
    }

    .swiper-button-next {
        right: -3%;
    }

    .swiper-slide {

        @media screen and (max-width: 992px) {
            margin-right: 8px !important;
        }
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
            top: -0.6rem;
            padding-top: .4rem;
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

    .top-product-indicator {
        background: #f0001e;
        color: #ffffff;
        position: absolute;
        top: 10px;
        padding: 4px 0;
        left: 10px;
        text-align: center;
        transform: rotate(-45deg) translateX(-30%) translateY(-85%);
        width: 80%;
    }

    .top-product-indicator2 {
        background: #f03dbb;
        color: #ffffff;
        position: absolute;
        top: 0;
        padding: 5px 0;
        left: 0;
        text-align: center;
        transform: rotate(-45deg) translateX(-30%) translateY(-50%);
        width: 80%;
    }

    .top-product-indicator-aksiya {
        background: #f03dbb;
        color: #ffffff;
        position: absolute;
        top: 10px;
        padding: 4px 0;
        left: 10px;
        text-align: center;
        transform: rotate(-45deg) translateX(-28%) translateY(-115%);
        width: 80%;
        z-index: 100;
    }

    .top-product-indicator-skidka {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        line-height: 18px;
        background: #f03dbb;
        color: #ffffff;
        position: absolute;
        border-radius: 6px;
        bottom: 95px;
        padding: 5px 12px;
        width: 50px;
        right: 8px;
        text-align: center;
        z-index: 1;
        font-size: 16px;
        font-weight: 500;
    }

    .top-product-indicator-skidka2 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        line-height: 18px;
        background: #f03dbb;
        color: #ffffff;
        position: absolute;
        border-radius: 6px;
        bottom: 112px;
        padding: 3px 12px;
        right: 8px;
        text-align: center;
        z-index: 1;
        font-size: 12px;
        font-weight: 500;
        width: 45px;
    }

    .ad-text {
        font-size: 15px;
        color: $primary-color;
        cursor: pointer;
        margin-bottom: 5px;
    }

    .see-all-text:hover {
        background: $primary-color;
        color: #ffffff;
    }

    .star-icon {
        cursor: pointer;

        &:hover {
            color: $primary-color;
        }
    }

    .ad-text1 {
        font-size: 15px;
        color: $primary-color;
        cursor: pointer;
        margin: 5px;
    }

    .tt {
        line-clamp: 1;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

</style>
