<template>
  <div>
      <el-row v-if="!$store.state.userInfo.token">
          <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">{{$t('basic.back')}}</el-button>
      </el-row>
      <el-container direction="vertical" class="hidden-sm-and-down mx-5">
          <el-row type="flex" justify="space-between">
              <div>
                  <span style="font-size: 18px">{{mode == 0 ? this.$t('basic.list') : this.$t('basic.gallery')}} {{$t('basic.type')}}: </span>
                  <el-link @click="mode = !mode" style="font-size: 18px" :disabled="mode == 0" :type="mode == 0 ? 'info' : 'primary'">{{$t('basic.list')}}</el-link>
                  <el-link @click="mode = !mode" style="margin-left: .5rem; font-size: 18px" :disabled="mode == 1" :type="mode == 1 ? 'info' : 'primary'">{{$t('basic.gallery')}}</el-link>
              </div>

              <div>
                  <span @click="unfavouriteAll" class="text" style="font-size: 14px;">{{$t('basic.unfav_all')}}</span>
              </div>
          </el-row>

          <div v-if="mode == 0" v-loading="loading">
              <div v-loading="loading" class="products-block">
                  <div style="position: relative !important; overflow: hidden; padding-left: 0;"
                          v-for="favourite in favourites" :key="favourite.id" :xs="24" :sm="6" :lg="6" :xl="6">
                      <el-card shadow="hover" :body-style="{ padding: '0px' }">
                          <div>
                              <img v-if="!favourite.isTop" @click="toDetails(favourite.id)" style="cursor: pointer;" height="150" :src=" favourite.images && favourite.images.length > 0 && favourite.images[0] ? $serverImageUrl + favourite.images[0] : require('@/assets/no-image-icon.png')" alt="">
                              <carousel v-else height="180px" :perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5 paginationActiveColor="#01BFA5">
                                  <slide v-for="ad of favourite.images" :key="ad.id" class="slide">
                                      <img @click="toDetails(favourite.id)" style="cursor: pointer;" height="150px" width="100px" :src="$serverImageUrl + ad">
                                  </slide>
                              </carousel>
                              <div style="float: right" class="heart">
                                  <div v-if="$store.state.userInfo.token" @click="takeFromFavourites(favourite.id)" class="favourites" style="margin: 7px;">
                                      <span>{{$t('basic.take_from_favourites')}}</span>
                                      <i :class="`fas fa-heart`"></i>
                                  </div>
                              </div>
                              <div class="top-product-indicator">
                                  <span style="text-align: center;">{{$t('basic.top')}}</span>
                              </div>
                          </div>

                          <div class="p-2" style="height: 168px; display: flex; flex-direction: column; justify-content: space-between;">
                              <span @click="toDetails(favourite.id)" class="ad-text1 tt p-0" style="font-size: 18px;">{{favourite.name}}</span>
                              <span style="font-size: 18px; float: right; color: #3F4C52"> {{favourite.price}} {{favourite.currency.name}} </span>
                              <span class="categories-names">{{favourite.categoriesNames}}</span>
                              <div style="bottom: .5rem; display: flex">
                                  <div>
                                      <i style="color: #F0B27A" class="el-icon-location"></i>
                                      <span style="font-size: 12px;" v-if="favourite.regions && favourite.regions.length > 0">{{favourite.regions[0].name}}</span>
                                  </div>
                                  <div style="margin-left: .5rem">
                                      <i style="color: #F0B27A" class="el-icon-time"></i>
                                      <span style="margin-left: .2rem; font-size: 13px">{{favourite.createdAt | toTime(true)}}</span>
                                  </div>
                              </div>
                          </div>
                      </el-card>
                  </div>
              </div>
          </div>

          <el-row v-else v-loading="loading" style="margin-top: 1rem; flex-wrap: wrap" type="flex" :gutter="20" justify="start">
              <el-col :span="6" v-for="favourite in favourites" :key="favourite.id">
                  <el-card shadow="hover" :body-style="{ padding: '0px' }">
                      <img @click="toDetails(favourite.id)" style="cursor: pointer;" width="100%" height="150" :src="favourite.images && favourite.images.length > 0 ? $serverImageUrl + favourite.images[0] : require('@/assets/no-image-icon.png')" class="image">
                      <div style="padding: 14px; background: #FDEBD0">
                          <span @click="toDetails(favourite.id)" style="font-size: 16px" class="ad-text1 tt">{{favourite.name}}</span>
                          <div style="margin-top: 1rem">
                              <span>{{favourite.price}} {{favourite.currency.name}}</span>
                              <el-tooltip :content="$t('basic.take_from_favourites')" placement="top-start" effect="light">
                                  <i @click="takeFromFavourites(favourite.id)" style="font-size: 1.5rem; float: right" class="fas fa-heart"></i>
                              </el-tooltip>
                          </div>
                      </div>
<!--                      <Installment v-if="favourite.type == 2" style="position: absolute; top: .2em; right: .2em" :monthlyPayment="favourite.monthly_payment" :currency="favourite.currency.name"/>-->
                  </el-card>
              </el-col>
          </el-row>

<!--          <el-pagination-->
<!--                  v-if="totalFavouritesNumber > size"-->
<!--                  @current-change="onCurrentPageChange"-->
<!--                  background-->
<!--                  layout="prev, pager, next"-->
<!--                  :total="totalFavouritesNumber">-->
<!--          </el-pagination>-->
      </el-container>

      <el-container direction="vertical" class="hidden-md-and-up m-2">

          <el-row type="flex" justify="space-between">
<!--              <div>-->
<!--                  <span style="font-size: 14px">{{mode == 0 ? this.$t('basic.list') : this.$t('basic.gallery')}} {{$t('basic.type')}}: </span>-->
<!--                  <el-link @click="mode = !mode" :disabled="mode == 0" :type="mode == 0 ? 'info' : 'primary'">{{$t('basic.list')}}</el-link>-->
<!--                  <el-link @click="mode = !mode" style="margin-left: .5rem" :disabled="mode == 1" :type="mode == 1 ? 'info' : 'primary'">{{$t('basic.gallery')}}</el-link>-->
<!--              </div>-->

              <div>
                  <span @click="unfavouriteAll" class="text" style="font-size: 14px;">{{$t('basic.unfav_all')}}</span>
              </div>
          </el-row>

          <div v-if="mode == 0" style="margin-top: 1rem" v-loading="loading">

              <el-card shadow="hover" :body-style="{ padding: '0px', margin: '0px' }" style=" margin-bottom: 1rem; border-color: #EAEDED; background: rgba(255,191,61,.06)"  v-for="favourite in favourites" :key="favourite.id">
                  <el-row type="flex" :gutter="5" justify="space-between">
                      <el-col :span="10">
                          <img v-if="!favourite.isTop" @click="toDetails(favourite.id)" style="cursor: pointer;" width="100%" height="100%" :src=" favourite.images && favourite.images.length > 0 && favourite.images[0] ? $serverImageUrl + favourite.images[0] : require('@/assets/no-image-icon.png')" alt="">
                          <div v-else style="position: relative; overflow: hidden;">
                              <img @click="toDetails(favourite.id)" style="cursor: pointer;" width="100%" height="127" :src=" favourite.images && favourite.images.length > 0 && favourite.images[0] ? $serverImageUrl + favourite.images[0] : require('@/assets/no-image-icon.png')" class="image">
                              <div class="top-product-indicator" style="transform: rotate(-45deg) translateX(-27%) translateY(-50%); font-size: 12px;">
                                  <span style="text-align: center;">TOP</span>
                              </div>
                          </div>
                          <Installment v-if="favourite.type == 2" style="position: absolute; bottom: .5em; right: 4em" :monthlyPayment="favourite.monthly_payment" :currency="favourite.currency.name"/>
                      </el-col>

                      <el-col :span="14" style="margin-top: 7px;">
                          <div @click="toDetails(favourite.id)" class="ad-text1 tt" style="font-size: 14px;">{{favourite.name}}</div>
                          <div class="categories-names" style="font-size: 12px;">{{favourite.categoriesNames}}</div>

                          <div>
                              <i style="color: #F0B27A" class="el-icon-time"></i>
                              <span style="margin-left: .2rem; font-size: 13px">{{favourite.createdAt | toTime(true)}}</span>
                          </div>

                          <div class="d-flex justify-content-between align-items-center">
                              <span style="font-size: 16px; color: #3F4C52"> {{favourite.price}} {{favourite.currency.name}} </span>
                              <div v-if="$store.state.userInfo.token" @click="takeFromFavourites(favourite.id)" class="favourites" style="margin: 7px;">
                                  <span>{{$t('basic.take_from_favourites')}}</span>
                                  <i :class="`fas fa-heart`"></i>
                              </div>
                          </div>
                      </el-col>

                  </el-row>
              </el-card>

          </div>

          <div v-else v-loading="loading" class="products-block">
              <div v-for="favourite in favourites" :key="favourite.id">
                  <el-card shadow="hover" :body-style="{ padding: '0px' }">
                      <img @click="toDetails(favourite.id)" style="cursor: pointer;" width="100%" height="150" :src="favourite.images && favourite.images.length > 0 ? $serverImageUrl + favourite.images[0] : require('@/assets/no-image-icon.png')" class="image">
                      <div style="padding: 14px; background: #FDEBD0">
                          <span @click="toDetails(favourite.id)" style="font-size: 16px" class="ad-text1 tt">{{favourite.name}}</span>
                          <div style="margin-top: 1rem">
                              <span>{{favourite.price}} {{favourite.currency.name}}</span>
                              <el-tooltip :content="$t('basic.take_from_favourites')" placement="top-start" effect="light">
                                  <i @click="takeFromFavourites(favourite.id)" style="font-size: 1.5rem; float: right" class="fas fa-heart"></i>
                              </el-tooltip>
                          </div>
                      </div>
                      <Installment v-if="favourite.type == 2" style="position: absolute; top: .2em; right: .2em" :monthlyPayment="favourite.monthly_payment" :currency="favourite.currency.name"/>
                  </el-card>
              </div>
          </div v-else>

<!--          <el-pagination-->
<!--                  v-if="totalFavouritesNumber > size"-->
<!--                  @current-change="onCurrentPageChange"-->
<!--                  background-->
<!--                  layout="prev, pager, next"-->
<!--                  :total="totalFavouritesNumber">-->
<!--          </el-pagination>-->
      </el-container>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Installment from '@/components/Installment/index.vue';
export default {
    data () {
        return {
            loading: false,

            totalFavouritesNumber: 0,
            favourites: [],

            mode: 0, // 0 -> list, 1 -> gallery

            size: 100,
            offset: 0
        }
    },

    components: {
        Installment
    },

    mounted () {
        this.getFavourites();
    },

    methods: {            
        
        unfavouriteAll () {            
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

                    this.$emit('updateUserInfo');
                    this.getFavourites();                    
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

        toDetails (id) {
            this.$router.push({name: 'product', params: {id}});
        },

        takeFromFavourites (id) {                 
            
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

                    this.$emit('updateUserInfo');
                    this.getFavourites();
                    
                })  
                .catch(error => {   
                    console.log(error)
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

        onCurrentPageChange (page) {
            this.offset = (page - 1) * this.size;
      
            this.getFavourites(this.size, this.offset);
        },

        getFavourites(size=this.size, offset=this.offset) {
            this.loading = true;

            const metadata = {
                url: 'favourites',
                params: {                    
                    size,
                    offset,
                    lang: this.$store.state.mainLang
                },
                token: this.$store.state.userInfo.token
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {                                       
                    this.totalFavouritesNumber = response.count;
                    this.favourites = response.productList;
                    
                    this.favourites.forEach(element => {
                        element.categoriesNames = element.categories.map(data => {
                            return data.name;
                        }).join(' / ');                        
                        
                    });                    
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
    }
}
</script>

<style lang="scss" scoped>
    @import '../../custom.scss';    

    .header-region {
        cursor: pointer;
    }

    .header-region:hover {
        text-decoration: underline;
    }

    .region {
        cursor: pointer;
        padding: 0.5rem 0;

        i {
            color: $primary-color;
            float: right;
        }

        &:hover {
            background: $primary-color;
            color: #ffffff;

            i {
                color: #ffffff;
            }
        }
    }

    .categories-names {
        margin-top: 0;        
        font-size: 14px; 
        color: $gray-color;
    }
    
    .star-icon {        
        cursor: pointer;

        color: $primary-color;
    }        

    .top-product-indicator {        
        background: #f03dbb;
        color: #ffffff;
        position: absolute; 
        top: 0; 
        padding: 5px 0; 
        left: 0; 
        text-align: center;
        transform: rotate(-45deg) translateX(-30%) translateY(-85%);
        width: 80%;
    }

    .favourites {
        cursor: pointer; 
        display: flex; 
        align-items: center;

        span {
            font-size: 13px;
            color: white;
            display: none;
        }

        i {
            font-size: 24px;
            color: white;
        }

        &:hover {
            span {
                display: inline;
            }

            i {
                color: white;
            }
        }
    }

    .ad-text1 {
        font-size: 15px;
        color: $primary-color;
        cursor: pointer;        
    }  

    .tt{               
        line-clamp: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }

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
    .slide {
        cursor: pointer;
        /*height: 175px;*/
        background: #2c3e50;
        border-radius: 20px;
    }
</style>