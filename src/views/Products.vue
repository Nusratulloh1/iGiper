<template>
  <el-container direction="vertical">
    <div class="hidden-sm-and-down" style="background: #F7F7F7; padding: 1.5rem 0; width: 100%">
        <el-row type="flex" justify="center">
            <div style="width: 1200px;">
                <el-row  type="flex" justify="space-between">

                    <el-col :span="14">
                        <el-row type="flex" :gutter="20">
                            <el-col :span="12">
                                <el-input @keypress.native.enter="onSearch" id="selectRegion" style="width: 100%" v-model="searchData" prefix-icon="el-icon-search" :placeholder="`${allProducts} ${$t('basic.with_you')}`"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <el-popover placement="bottom" :offset="53" :width="890">
                                    <el-row>
                                        <span id="changeRegion" @click="onRegionSelected(regions.activeHeader, 0)" class="header-region">{{regions.activeHeader.name2}}</span>

                                        <span v-if="!regions.isRoot" style="float: right" id="parentRegion" @click="onParentRegionSelected(regions.activeHeader)" class="header-region">{{regions.parent.name}}</span>
                                        <hr>
                                    </el-row>

                                    <el-row :gutter="20">
                                        <el-col :span="6" v-for="region in regions.active" :key="region.id">
                                            <div @click="onRegionSelected(region, 1)" class="region">
                                                <el-row type="flex">
                                                    <el-col>
                                                        <span>{{region.name}}</span>
                                                    </el-col>
                                                    <el-col>
                                                        <i v-if="region.sub" class="el-icon-arrow-right"></i>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-input style="width: 100%" slot="reference" v-model="regions.selected.name" prefix-icon="el-icon-location-outline" :placeholder="$t('basic.whole_country')">
                                        <el-button v-if="regions.checkSelected" @click="clearSelectedRegion" slot="append" icon="el-icon-plus"></el-button>
                                    </el-input>
                                </el-popover>
                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col :span="8">
                        <el-cascader :placeholder="$t('basic.choose_category')" id="myCascader" style="width: 100%" :props="{ checkStrictly: true }" clearable v-model="categories.selected" :options="categories.all"></el-cascader>
                    </el-col>
                </el-row>

                <el-row type="flex" :gutter="20" style="margin-top: 1rem; flex-wrap: wrap;">
                    <el-col :span="6">
                        <el-form>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item>
                                        <el-input @keypress.native.enter="onSearch" size="mini" id="minPrice" v-model="filterData.min" :placeholder="$t('basic.price_from')"></el-input>
                                        <el-input @keypress.native.enter="onSearch" size="mini" id="maxPrice" v-model="filterData.max" :placeholder="$t('basic.price_to')"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>

                    <el-col :span="18">
                        <el-form>
                            <el-row :gutter="15" type="flex" style="flex-wrap: wrap;">
                                <el-form-item>
                                    <el-col v-for="extra in extras" :key="extra.id" :span="extras.length < 2 ? 24 : 8">
                                        <el-input @keypress.native.enter="handleExtraClicked(extra)" v-if="extra.type != 3" :id="`num${extra.index}`" size="mini" v-model="extra.dummy" :placeholder="extra.name + (extra.type == 1 ? ` [${extra.min} : ${extra.max}]` : '')"></el-input>

                                        <el-select clearable style="width: 100%" :placeholder="extra.name" @change="handleExtraClicked(extra)" size="mini" v-else v-model="extra.dummy">
                                            <el-option v-for="item in extra.customs" :key="item.id" :value="item.id" :label="item[$store.state.mainLang]"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row type="flex" style="flex-wrap: wrap;" justify="end">
                    <el-button  @click="onSearch" icon="el-icon-search" plain type="primary">{{$t('basic.search')}}</el-button>
                </el-row>
                <el-row type="flex" justify="end" style="margin-top: 1rem; font-size: 14px">
                    <span>{{$t('basic.sort')}}: </span>
                    <el-link @click="onFilter(item.value)" :type="item.selected ? 'info' : 'primary'" v-for="item in filterData.sort.options" :key="item.value" style="margin: 0 0.2rem">{{item.label}}</el-link>
                </el-row>
            </div>
        </el-row>
    </div>

    <el-row type="flex" justify="center" style="padding: 0 10px">
        <div style="max-width: 1200px;">
            <el-row class="hidden-sm-and-down" id="myProgressBar" style="margin-top: 0rem;" type="end" justify="center">
                <!-- <div>
                    <span style="font-size: 20px" class="text"> Transport </span>
                </div> -->

                <div style="margin-top: 1rem; float: right; font-size: 14px">
                    <span>{{mode == 0 ? $t('basic.list') : $t('basic.gallery')}} {{$t('basic.type')}}: </span>
                    <el-link @click="mode = !mode" :disabled="mode == 0" :type="mode == 0 ? 'info' : 'primary'">{{$t('basic.list')}}</el-link>
                    <el-link @click="mode = !mode" style="margin-left: .5rem;" :disabled="mode == 1" :type="mode == 1 ? 'info' : 'primary'">{{$t('basic.gallery')}}</el-link>
                </div>
            </el-row>

            <el-divider></el-divider>

            <el-row class="hidden-sm-and-down" v-if="!userInfo" type="flex" justify="start" style="flex-wrap: wrap">
                <el-col style="margin-bottom: .5rem" :span="6" v-for="subCategory in subCategories" :key="subCategory.id">
                    <span @click="onSubCategoryClick(subCategory)" style="font-size: 14px" class="text">{{subCategory.name}}</span>
                </el-col>
            </el-row>

            <el-row class="hidden-sm-and-down" v-else>
                <div style="display: flex; ">
                    <el-avatar :size="60" :src="userInfo.image ? $serverImageUrl + userInfo.image : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
                    <div style="margin-left: .5rem;">
                        <span style="font-size: 1.5rem; font-weight: bold;">{{ userInfo.name }}</span> <br>
                        <span style="color: gray; font-size: 15px;">Muallifning barcha e‘lonlari</span>
                    </div>
                </div>

                <el-divider></el-divider>
            </el-row>

            <el-row v-if="noResultFound">
                <h1 type="warning"> <span v-if="searchData != ''">"{{noResultFoundData}}":</span>{{$t('basic.requiest_result_not_found')}}</h1>  <br>
                <h2>{{$t('basic.latest_ads')}}</h2>
            </el-row>

            <!-- Gallery mode -->

            <div class="hidden-sm-and-down" style="margin-top: 1.5rem;" v-loading="loading" v-if="mode == 0">
                <h2 v-if="!noResultFound">{{$t('basic.top_announcement')}}</h2>

                <div>
                    <div class="products-block">
                        <div style="position: relative !important; overflow: hidden; margin-top: 1rem; padding-left: 0;"
                                v-for="product in products.items.top" :key="product.id" :xs="24" :sm="6" :lg="6" :xl="6">
                            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                                <div>
                                    <img v-if="!product.isTop" @click="toDetails(product.id)" style="cursor: pointer; height: 180px;" height="150" :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" alt="">
                                    <carousel style="height: 180px; !important;" :perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5 paginationActiveColor="#01BFA5">
                                        <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                            <img @click="toDetails(product.id)" style="cursor: pointer;" height="150px" width="100px" :src="$serverImageUrl + ad">
                                        </slide>
                                    </carousel>
                                    <div style="float: right" class="heart">
                                        <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                        </el-tooltip>

                                        <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                        </el-tooltip>
                                    </div>
                                    <div class="top-product-indicator">
                                        <span style="text-align: center;">{{$t('basic.top')}}</span>
                                    </div>
                                    <Installment v-if="product.type == 2" style="position: absolute; top: 3.5em; right: .2em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                                </div>

                                <div class="p-2" style="height: 168px; display: flex; flex-direction: column; justify-content: space-between;">
                                    <span @click="toDetails(product.id)" class="ad-text1 tt p-0" style="font-size: 18px;">{{product.name}}</span>
                                    <span style="font-size: 18px; float: right; color: #3F4C52"> {{product.price}} {{product.currency.name}} </span>
                                    <span class="categories-names">{{product.categoriesNames}}</span>
                                    <div style="bottom: .5rem; display: flex">
                                        <div>
                                            <i style="color: #F0B27A" class="el-icon-location"></i>
                                            <span style="font-size: 12px;" v-if="product.regions && product.regions.length > 0">{{product.regions[0].name}}</span>
                                        </div>
                                        <div style="margin-left: .5rem">
                                            <i style="color: #F0B27A" class="el-icon-time"></i>
                                            <span style="margin-left: .2rem; font-size: 13px">{{product.createdAt | toTime(true)}}</span>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </div>

                <br>
                <h2 v-if="!noResultFound">{{$t('basic.ordinary_ads')}}</h2>
                <div v-loading="loading" class="products-block">
                    <div style="position: relative !important; overflow: hidden;"
                        v-for="product in products.items.ordinary" :key="product.id" :xs="24" :sm="6" :lg="6" :xl="6">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }" style="height: 350px;">
                            <div>
                                <img v-if="!product.isTop" @click="toDetails(product.id)" style="cursor: pointer;" height="180" :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" alt="">
                                <carousel v-else style="height: 180px; !important;" :perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5 paginationActiveColor="#01BFA5">
                                    <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                        <img @click="toDetails(product.id)" style="cursor: pointer;" height="180px" width="100px" :src="$serverImageUrl + ad">
                                    </slide>
                                </carousel>
                                <div style="float: right" class="heart">
                                    <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start" effect="light">
                                        <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                    </el-tooltip>

                                    <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">
                                        <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                    </el-tooltip>
                                </div>
                                <Installment v-if="product.type == 2" style="position: absolute; top: 1em; left: 1em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                            </div>

                            <div class="p-2" style="height: 168px; display: flex; flex-direction: column; justify-content: space-between;">
                                <span @click="toDetails(product.id)" class="ad-text1 tt p-0" style="font-size: 18px;">{{product.name}}</span>
                                <span style="font-size: 18px; float: right; color: #3F4C52"> {{product.price}} {{product.currency.name}} </span>
                                <span class="categories-names">{{product.categoriesNames}}</span>
                                <div style="bottom: .5rem; display: flex">
                                    <div>
                                        <i style="color: #F0B27A" class="el-icon-location"></i>
                                        <span style="font-size: 12px;" v-if="product.regions && product.regions.length > 0">{{product.regions[0].name}}</span>
                                    </div>
                                    <div style="margin-left: .5rem">
                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                        <span style="margin-left: .2rem; font-size: 13px">{{product.createdAt | toTime(true)}}</span>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>

                <!-- Card mode -->
            <div style="margin-top: 1.5rem;" v-else v-loading="loading">
                <span style="font-size: 1.2rem; font-weight: bold;" v-if="!noResultFound && products.items.top.length > 0">{{$t('basic.top_announcement')}}</span>
                <el-row v-if="!noResultFound" style="flex-wrap: wrap;" type="flex" :gutter="20" justify="start">
                    <el-col :xs="12" :sm="8" :lg="6" :xl="4" style="margin-top: 1rem" v-for="product in products.items.top" :key="product.id">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">

                            <div style="position: relative;">
                                <img @click="toDetails(product.id)" style="cursor: pointer; height: 180px" width="100%" height="180" :src="product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" class="image">
                                <div class="top-product-indicator">
                                    <span style="text-align: center;">TOP</span>
                                </div>

                                <Installment v-if="product.type == 2" style="position: absolute; top: .2em; right: .2em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                                <span @click="toDetails(product.id)" class="ad-text1 tt">{{product.name}}</span>
                                <el-row style="margin: 5px;" type="flex" justify="space-between">
                                    <span class="tt">{{product.price}} {{product.currency.name}}</span>
                                    <div v-if="$store.state.userInfo.token" style="float: right">
                                        <el-tooltip v-if="!product.isFavourite" :content="$t('basic.add_to_favourites')" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                        </el-tooltip>

                                        <el-tooltip v-else :content="$t('basic.take_from_favourites')" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                        </el-tooltip>
                                    </div>
                                </el-row>
                                <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                    <span class="mr-3">15.12.2020</span>
                                    <span>13:27</span>
                                </el-row>
                            </div>

                        </el-card>
                    </el-col>
                </el-row>
                <br>
                <h2 v-if="!noResultFound">{{$t('basic.ordinary_ads')}}</h2>

                <div class="products-block">
                    <div style="position: relative !important; overflow: hidden; margin-top: 1rem; padding-left: 0;" v-for="product in products.items.ordinary" :key="product.id">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">

                            <div style="position: relative;">
                                <img @click="toDetails(product.id)" style="cursor: pointer;" width="100%" height="150" :src="product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" class="image">
                                <Installment v-if="product.type == 2" style="position: absolute; top: .2em; right: .2em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                                <span @click="toDetails(product.id)" class="ad-text1 tt">{{product.name}}</span>
                                <el-row style="margin: 5px;" type="flex" justify="space-between">
                                    <span class="tt">{{product.price}} {{product.currency.name}}</span>
                                    <div v-if="$store.state.userInfo.token" style="float: right">
                                        <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                        </el-tooltip>

                                        <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">
                                            <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                        </el-tooltip>
                                    </div>
                                    <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                        <span class="mr-3">15.12.2020</span>
                                        <span>13:27</span>
                                    </el-row>
                                </el-row>
                                <Installment v-if="product.type == 2" style="position: absolute; top: 1em; left: 1em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                            </div>

                        </el-card>
                    </div>
                </div>
            </div>
        </div>
    </el-row>

    <!-- MOBILE VERSION -->
    <!-- DUPLICATE CODES ARE USED DUE TO LACK OF TIME (SORRY) -->
    <el-row class="hidden-md-and-up">
        <el-row v-if="noResultFound">
            <h2 type="warning"> <span v-if="searchData != ''">"{{noResultFoundData}}":</span>{{$t('basic.requiest_result_not_found')}}</h2>  <br>
            <h3>{{$t('basic.latest_ads')}}</h3>
        </el-row>

        <!-- Gallery mode -->
        <div v-if="mobileMode==0" v-loading="loading">
            <h2 v-if="!noResultFound && products.items.top.length > 0">{{$t('basic.top_announcement')}}</h2>

            <div v-if="!noResultFound">
                <el-card shadow="hover" :body-style="{ padding: '0px', margin: '0px' }" style="height: 125px; margin-bottom: 1rem; border-color: #EAEDED; background: rgba(255,191,61,.06)"  v-for="product in products.items.top" :key="product.id">
                    <div @click="toDetails(product.id)">
                        <el-row type="flex" :gutter="5" justify="space-between">
                            <el-col :span="8">
                                <img v-if="!product.isTop" @click="toDetails(product.id)" style="cursor: pointer;" width="100%" height="125" :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" alt="">

                                <div v-else style="position: relative; overflow: hidden; height: 150px;">
                                    <img @click="toDetails(product.id)" style="cursor: pointer; height: 150px;" width="100%" height="127" :src=" product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" class="image">
                                    <div class="top-product-indicator" style="transform: rotate(-45deg) translateX(-27%) translateY(-50%)">
                                        <span style="text-align: center;">TOP</span>
                                    </div>
                                    <Installment v-if="product.type == 2" style="position: absolute; top: 1em; left: 1em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                                </div>

                            </el-col>

                            <el-col :span="16" style="position: relative; margin: 7px;">
                                <span @click="toDetails(product.id)" class="ad-text2 tt2">{{product.name}}</span> <br>
                                <span style="color: #3F4C52"> {{product.price}} {{product.currency.name}} </span>

                                <div style="position: absolute; bottom: .5rem; display: flex; width: 100%;">
                                    <div>
                                        <i style="color: #F0B27A" class="el-icon-location"></i>
                                        <span style="font-size: 12px;" v-if="product.regions && product.regions.length > 0">{{product.regions[0].name}}</span>
                                    </div>
                                    <div style="margin-left: .5rem">
                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                        <span style="margin-left: .2rem; font-size: 13px">{{product.createdAt | toTime(true)}}</span>
                                    </div>

                                    <div v-if="$store.state.userInfo.token" @click="favouritesAction(product.id)" class="favourites" style="float: right;">
                                        <i :class="`fa${product.isFavourite ? 's' : 'r'} fa-star`"></i>
                                    </div>
                                </div>
                            </el-col>
                            <Installment v-if="product.type == 2" style="position: absolute; top: .5em; right: .5em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                        </el-row>
                    </div>
                </el-card>
            </div>

            <br>
            <h2 v-if="!noResultFound">{{$t('basic.ordinary_ads')}}</h2>
            <el-card shadow="hover" :body-style="{ padding: '0px', margin: '0px' }" :style="`height: 125px; margin-bottom: 1rem; border-color: #EAEDED; ${product.isTop ? 'background: rgba(255,191,61,.06)': ''}`"  v-for="product in products.items.ordinary" :key="product.id">
                <div @click="toDetails(product.id)">
                    <el-row type="flex" :gutter="5" justify="space-between">
                        <el-col :span="8">
                            <img v-if="!product.isTop" @click="toDetails(product.id)" style="cursor: pointer;" width="100%" height="125" :src="product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" alt="">
                            <div v-else style="position: relative; overflow: hidden;">
                                <img @click="toDetails(product.id)" style="cursor: pointer;" width="100%" height="127" :src="product.images && product.images.length > 0 && product.images[0] ? $serverImageUrl + product.images[0] : require('@/assets/no-image-icon.png')" class="image">
                                <div class="top-product-indicator" style="transform: rotate(-45deg) translateX(-27%) translateY(-50%)">
                                    <span style="text-align: center;">TOP</span>
                                </div>
                            </div>
                        </el-col>

                        <el-col :span="16" style="position: relative; margin: 7px;">
                                <span @click="toDetails(product.id)" class="ad-text2 tt2">{{product.name}}</span> <br>
                                <span style="color: #3F4C52"> {{product.price}} {{product.currency.name}} </span>

                                <div style="position: absolute; bottom: .5rem; display: flex; width: 100%;">
                                    <div>
                                        <i style="color: #F0B27A" class="el-icon-location"></i>
                                        <span style="font-size: 12px;" v-if="product.regions && product.regions.length > 0">{{product.regions[0].name}}</span>
                                    </div>
                                    <div style="margin-left: .5rem">
                                        <i style="color: #F0B27A" class="el-icon-time"></i>
                                        <span style="margin-left: .2rem; font-size: 13px">{{product.createdAt | toTime(true)}}</span>
                                    </div>

                                    <div v-if="$store.state.userInfo.token" @click="favouritesAction(product.id)" class="favourites" style="float: right;">
                                        <i :class="`fa${product.isFavourite ? 's' : 'r'} fa-star`"></i>
                                    </div>
                                </div>
                            </el-col>
                            <Installment v-if="product.type == 2" style="position: absolute; top: .5em; right: .5em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                    </el-row>
                </div>
            </el-card>
        </div>

        <!-- List mode -->
        <div v-else v-loading="loading">
            <span style="font-size: 1.2rem; font-weight: bold;" v-if="!noResultFound && products.items.top.length > 0">{{$t('basic.top_announcement')}}</span>
            <el-row v-if="!noResultFound" style="flex-wrap: wrap;" type="flex" :gutter="5" justify="start">
                <el-col :span="12" style="margin-top: 1rem; position: relative; overflow: hidden;" v-for="product in products.items.top" :key="product.id">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                        <div @click="toDetails(product.id)" style="position: relative;">
                            <carousel style="height: 150px !important;" :perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5 paginationActiveColor="#01BFA5">
                                <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                    <img @click="toDetails(product.id)" style="cursor: pointer;" height="180px" width="100px" :src="$serverImageUrl + ad">
                                </slide>
                            </carousel>
                            <div class="top-product-indicator">
                                <span style="text-align: center;">TOP</span>
                            </div>

                            <div style="float: right" class="heart">
                                <el-tooltip v-if="!product.isFavourite" :content="$t('basic.add_to_favourites')" placement="top-start" effect="light">
                                    <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                </el-tooltip>

                                <el-tooltip v-else :content="$t('basic.take_from_favourites')" placement="top-start" effect="light">
                                    <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                </el-tooltip>
                            </div>

                            <Installment v-if="product.type == 2" style="position: absolute; top: 3.5em; right: .2em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                            <span @click="toDetails(product.id)" class="ad-text1 tt">{{product.name}}</span>
                            <el-row style="margin: 5px;" type="flex" justify="space-between">
                                <span class="tt">{{product.price}} {{product.currency.name}}</span>
                            </el-row>
                            <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                <span class="mr-3">15.12.2020</span>
                                <span>13:27</span>
                            </el-row>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <br>

            <h5 v-if="!noResultFound">{{$t('basic.ordinary_ads')}}</h5>
            <el-row  style="flex-wrap: wrap;" type="flex" :gutter="5" justify="start">
                <el-col :span="12" v-for="product in products.items.ordinary" :key="product.id" style="position: relative; overflow: hidden;">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                        <div @click="toDetails(product.id)" style="position: relative;">
                            <carousel style="height: 150px !important;" :perPage=1 paginationPosition="bottom-overlay" :paginationPadding=5 paginationActiveColor="#01BFA5">
                                <slide v-for="ad of product.images" :key="ad.id" class="slide">
                                    <img @click="toDetails(product.id)" style="cursor: pointer;" height="180px" width="100px" :src="$serverImageUrl + ad">
                                </slide>
                            </carousel>
<!--                            v-if="$store.state.userInfo.token"-->
                            <div style="float: right" class="heart">
                                <el-tooltip v-if="!product.isFavourite" content="Saralanganlarga" placement="top-start" effect="light">
                                    <i @click="favouritesAction(product.id)" class="far fa-heart"></i>
                                </el-tooltip>

                                <el-tooltip v-else content="Saralanganlardan chiqarish" placement="top-start" effect="light">
                                    <i @click="favouritesAction(product.id)" class="fas fa-heart"></i>
                                </el-tooltip>
                            </div>

                            <Installment v-if="product.type == 2" style="position: absolute; top: 1em; left: 1em" :monthlyPayment="product.monthly_payment" :currency="product.currency.name"/>
                            <span @click="toDetails(product.id)" class="ad-text1 tt">{{product.name}}</span>
                            <el-row style="margin: 5px;" type="flex" justify="space-between">
                                <span class="tt">{{product.price}} {{product.currency.name}}</span>
                            </el-row>
                            <el-row style="width: 90%; font-size: .8rem; color: rgba(0,0,0,0.4); margin: 0 5px 5px 5px;">
                                <span class="mr-3">15.12.2020</span>
                                <span>13:27</span>
                            </el-row>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </el-row>

<!--    <el-row type="flex" justify="center">        -->
<!--        <el-pagination-->
<!--            :current-page="this.$store.state.paginationLastPage"-->
<!--            style="margin-top: 1rem"-->
<!--            v-if="products.count > size"-->
<!--            :page-size="size"-->
<!--            @current-change="onCurrentPageChange"-->
<!--            background            -->
<!--            layout="prev, pager, next"-->
<!--            :total="products.count">-->
<!--        </el-pagination> -->
<!--    </el-row>           -->

  </el-container>
</template>

<script>
import { Message } from 'element-ui'
import IMask from 'imask'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Cookies from 'js-cookie'
import Inputmask from "inputmask";

import { EventBus } from '@/plugins/EventBus.js';
import Installment from '@/components/Installment/index.vue';

export default {
    components: {
        Installment
    },
    props: {
        userInfo: {
            type: Object,
            default: null
        }
    },

    data () {
        return {
            mobileMode: 1, // 0 -> gallery, 1 -> list
            options: [],
            initial: true,

            regions: {
                isRoot: true,

                checkSelected: false,

                parent: '',

                all: [],
                root: [],
                sub: [],

                active: [],

                activeHeader: {
                    name: 'Butun O`zbekiston',
                    name2: 'Butun O`zbekiston',
                    id: null,
                    parentId: null,
                },

                selected: {
                    name: 'Butun O`zbekiston',
                    id: null,
                    parentId: null
                }
            },

            regionIds: [],

            extras: [],
            filterExtra: [],

            noResultFound: false,
            noResultFoundData: '',
            step: 0,

            searchData: '',

            filterData: {
                min: '',
                max: '',
                sort: {
                    options: [
                        {value: 0, label: this.$t('basic.latest'), selected: true},
                        {value: 1, label: this.$t('basic.most_expensive'), selected: false},
                        {value: 2, label: this.$t('basic.cheapest'), selected: false},
                    ],
                    selected: 0
                }
            },

            allProducts: 0,

            what: false,

            size: 300,
            offset: 0,

            loading: false,

            mode: 0, // 0 -> list, 1 -> gallery

            products: {
                items: {
                    top: [],
                    ordinary: []
                },
                count: 0
            },

            categories: {
                all: [],
                selected: []
            },

            subCategories: []
        }
    },

    computed: {

    },

    mounted () {
        // console.log(this.$store.state.fromItemDetails);
        // if (this.$store.state.fromItemDetails) {
        //     this.onCurrentPageChange(this.$store.state.paginationLastPage);
        //     this.$store.commit('SET_FROM_ITEM_DETAILS', false);
        //     this.$store.commit('SET_PAGINATION_LAST_PAGE', 1);
        // }else {
        //     this.getAllProducts();
        // }

        this.getAllProducts();

        this.getRegions();

        this.getCategories();

        setTimeout(() => {
            if (this.$store.state.isMobileVersion) {
                this.initSmall();
            }else {
                this.initBig();
            }
        }, 1000)
    },

    methods: {
        handleGetProducts (seeAll=true) {
            let params = [
                this.size,
                this.offset,
                1,
                this.searchData,
                this.categories.selected,
                this.regionIds,
                this.filterData.min ? this.filterData.min : null,
                this.filterData.max ? this.filterData.max : null,
                this.filterData.sort.selected,
                this.filterExtra
            ];

            this.noResultFound = false;

            this.$store.commit('SET_SEE_ALL_TOP', false);

            //Top
            this.getProducts(...params);

            params[2] = null;
            //Ordinary
            this.getProducts(...params);
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

        onParentRegionSelected (item) {
            this.regions.selected = {
                id: item.id,
                parentId: item.parentId,
                name: item.name,

                parent: {
                    id: '',
                    parentId: '',
                    name: ''
                }
            }

            document.getElementById('selectRegion').click();
            this.regions.checkSelected = true;
        },

        initBig () {
            this.searchData = this.$store.state.product.search;

            let min = new Inputmask({ regex: '[0-9]+', placeholder: ' ' }).mask(document.getElementById('minPrice'));
            let max = new Inputmask({ regex: '[0-9]+', placeholder: ' ' }).mask(document.getElementById('maxPrice'));

            this.categories.selected = [];
            let attributeIds = '';

            if (Array.isArray(this.$store.state.product.categoryId)) {
                this.categories.selected = this.$store.state.product.categoryId;
                attributeIds = this.$store.state.product.categoryId.join(',');
            }else {
                attributeIds = this.$store.state.product.categoryId;
                this.categories.selected.push(this.$store.state.product.categoryId);
            }

            this.getAttributes(attributeIds)

            let regionsId = [];

            if (Array.isArray(this.$store.state.product.regionId)) {
                regionsId = this.$store.state.product.regionId;
            }else {
                regionsId.push(this.$store.state.product.regionId);
            }

            this.handleGetProducts();

            let categoryId = '';
            if (Array.isArray(this.$store.state.product.categoryId)) {
                categoryId = [...this.$store.state.product.categoryId].pop();
            }else {
                categoryId = this.$store.state.product.categoryId;
            }

            this.getSubCategories(categoryId ? categoryId : 0);
            //document.getElementById('myCascader').click();
            this.initial = false;
        },

        initSmall () {
            this.regions.selected = this.$store.state.mobileFilterForm.regions.map(data => data.id);

            this.searchData = this.$store.state.mobileFilterForm.searchData;

            this.categories.selected = this.$store.state.mobileFilterForm.categories.map(data => data.id);

            this.filterData.sort.selected = this.$store.state.mobileFilterForm.sort;

            this.noResultFound = false;

            let extras = [];

            const attributes = this.$store.state.mobileFilterForm.extras;

            for (const iterator of attributes) {
                if (iterator.dummy) {
                    extras.push({
                        attributeId: iterator.id,
                        value: iterator.dummy
                    })
                }
            }

            this.filterExtra = extras;

            this.handleGetProducts();

            this.initial = false;
            this.mobileMode = this.$store.state.mobileFilterForm.mode;
        },

        getAllProducts () {
            const metadata = {
                url: 'products/count'
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {
                    this.allProducts = response;
                })
        },

        onFilter(item) {
            this.filterData.sort.options[0].selected = false;
            this.filterData.sort.options[1].selected = false;
            this.filterData.sort.options[2].selected = false;

            this.filterData.sort.options[item].selected = true;


            this.filterData.sort.selected = item;


            this.onSearch();
        },

        onSubCategoryClick (item) {

            let categoryTree = [item.id];

            let temp = item;

            while(temp.parentId) {

                for (let index = 0; index < this.categories.allNotNested.length; index++) {
                    const element = this.categories.allNotNested[index];

                    if (element.id == temp.parentId) {
                        temp = element;
                        break;
                    }
                }

                categoryTree.push(temp.id);
            }

            this.categories.selected = categoryTree.reverse();

            //document.getElementById('myCascader').click();
            let tags = [];

            if (item.tags) {
                tags = item.tags.split(',')
            }

            this.$store.commit('SET_TAGS', tags);
            this.onSearch();

        },

        getAttributes (ids) {
            const metadata = {
                url: 'attributes',
                params: {
                    id: ids
                }
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {

                    this.extras = [];

                    for (let index = 0; index < response.length; index++) {
                        const element = response[index];
                        element.value = undefined;
                        element.index = index;
                        element.dummy = '';
                        this.extras.push(element);
                        element.filtered = false;
                    }

                    // console.log("ALO");
                    // console.log(this.extras);

                    setTimeout(() => {

                        for (let index = 0; index < this.extras.length; index++) {
                            const element = this.extras[index];

                            if (element.type == 1) {
                                element.value = IMask(
                                    document.getElementById('num' + element.index),
                                    {
                                        mask: 'num',
                                        blocks: {
                                            num: {
                                                // nested masks are available!
                                                mask: Number,
                                                thousandsSeparator: ' ',
                                                min: element.min,
                                                max: element.max
                                            }
                                        }
                                });
                            }
                        }
                    }, 1000)
                })
        },

        onSearch () {
            let regionIds = [];

            if (this.regions.selected.id) {
                regionIds.push(this.regions.selected.id);

                if (this.regions.selected.parent.id) {
                    regionIds.push(this.regions.selected.parent.id);
                }
            }


            this.regionIds = regionIds;

            this.handleGetProducts();
        },

        getRegions () {
            const metadata = {
                url: 'regions',
                params: {
                    lang: this.$store.state.mainLang
                }
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {

                    this.regions.all = response;

                    this.regions.active = response.filter(data => {
                        return !data.parentId || data.parentId == 0
                    })

                    this.regions.active.forEach(element => {
                        element.sub = this.regions.all.filter(data => {
                            return data.parentId === element.id
                        })
                    });

                    this.regions.activeHeader.name = this.$store.state.product.regionName;
                    this.regions.activeHeader.id = null;
                    this.regions.activeHeader.parentId = null;


                    this.regions.selected.name = this.$store.state.product.regionName;
                    this.regions.selected.id = null;
                    this.regions.selected.parentId = null;

                })
        },

        onRegionSelected (item, direction) {
            if (item.id === null) { // the whole country
                document.getElementById('selectRegion').click();
                this.regions.checkSelected = true;
                this.clearSelectedRegion();
                this.regions.isRoot = true;
            }

            if (direction === 1) {
                if (item.sub) {

                    this.regions.isRoot = false;
                    this.regions.active = item.sub;

                    this.regions.activeHeader = {
                        id: item.id,
                        parentId: item.parentId,
                        name: item.name,
                        name2: 'Viloyatni o`zgartirsh'
                    }

                    this.regions.parent = item;

                    if (!item.sub.length > 0) {
                        setTimeout(() => {
                            document.getElementById('parentRegion').click();

                            document.getElementById('changeRegion').click();
                        }, 500)
                    }
                }else {
                    this.regions.isRoot = true;
                    this.regions.selected = {
                        id: item.id,
                        parentId: item.parentId,
                        name: item.name + ', ' + this.regions.activeHeader.name,

                        parent: {
                            id: this.regions.activeHeader.id,
                            parentId: this.regions.activeHeader.id,
                            name: this.regions.activeHeader.name
                        }
                    }

                    //document.getElementById('selectRegion').focus();
                    document.getElementById('selectRegion').click();
                    this.regions.checkSelected = true;

                    return;
                }
            } else {
                this.regions.isRoot = true;
                this.regions.active = this.regions.all.filter(data => {
                    return !data.parentId || data.parentId == 0
                })

                this.regions.activeHeader = {
                    id: null,
                    parentId: null,
                    name: 'Butun O`zbekiston',
                    name2: 'Butun O`zbekiston'
                };
            }
        },

        getSubCategories (id) {
            const metadata = {
                url: 'categories',
                params: {
                    lang: this.$store.state.mainLang,
                    pId: id
                },
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {
                    this.subCategories = response;
                })
                .catch(error => {
                    // console.log(error)
                })
        },

        toDetails (id) {
            this.$router.push({name: 'product', params: {id}});
        },

        favouritesAction (id) {
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
                    Message({
                        type: 'success',
                        message
                    })

                    this.handleGetProducts();
                    this.getUserInfo();
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

        clearSelectedRegion () {
            this.regions.checkSelected = false;

            this.regions.activeHeader.name = this.$t('basic.whole_country');
            this.regions.activeHeader.name2 = this.$t('basic.whole_country');
            this.regions.activeHeader.id = null;
            this.regions.activeHeader.parentId = null;

            this.regions.selected.name = this.$t('basic.whole_country');
            this.regions.selected.id = null;
            this.regions.selected.parentId = null;

            this.regions.active = this.regions.all.filter(data => {
                return !data.parentId || data.parentId == 0
            })

            this.handleGetProducts();
        },

        onCurrentPageChange (page) {
            this.$store.commit("SET_PAGINATION_LAST_PAGE", page);
            this.offset = (page - 1) * this.size;

            this.handleGetProducts();
        },

        handleExtraClicked (item) {
            // console.log("ALO")
            // console.log(item)
            let extra = [];

            if (item.type == 1) {
                item.filtered = !!item.value.unmaskedValue;
            }else {
                item.filtered = !!item.dummy;
            }

            let regionIds = [];

            for (let index = 0; index < this.extras.length; index++) {
                const element = this.extras[index];
                if (element.filtered) {
                    extra.push({
                        attributeId: element.id,
                        value: element.value ? element.value.unmaskedValue : element.dummy
                    })
                }
            }

            if (this.regions.selected.id) {
                regionIds.push(this.regions.selected.id);

                if (this.regions.selected.parent.id) {
                    regionIds.push(this.regions.selected.parent.id);
                }
            }

            this.regionIds = regionIds;
            this.filterExtra = extra;

            this.handleGetProducts();
        },

        getProducts (size=this.size, offset=this.offset, isTop=null, search="", categoryId=[], regionId=[], priceMin=null, priceMax=null, sort, extra=null) {
            NProgress.configure({showSpinner: false, parent: '#myProgressBar' });

            // console.log("SALOMLAR7")

            this.loading = true;
            NProgress.start();

            let objectified = { extras: extra };

            const metadata = {
                url: 'products',
                params: {
                    size,
                    offset,
                    categoryId: categoryId.length > 0 && categoryId[0] !== 0 ? [...categoryId].pop() : null,
                    regionId: regionId.length > 0 ? [...regionId].pop() : null,
                    priceMin,
                    priceMax,
                    isTop,
                    search,
                    sort,
                    attributes: extra && extra.length > 0 ? JSON.stringify(objectified) : null
                }
            }

            if (this.userInfo && this.userInfo.id) {
                metadata.params.userId = this.userInfo.id;
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
                    this.products.items[isTop ? 'top' : 'ordinary'] = response.productList;

                    if (!isTop) {
                        this.products.count = response.count;
                    }

                    this.products.items[isTop ? 'top' : 'ordinary'].forEach(element => {
                        element.categoriesNames = element.categories.map(data => {
                            return data.name;
                        }).join(' / ');

                    });
                    if (!isTop && response.count == 0 && !this.noResultFound) { //being searched data not found
                        this.noResultFoundData = this.searchData;
                        this.noResultFound = true;
                        this.getProducts(this.size, this.offset, null);
                    }else {
                        NProgress.done();
                    }
                })
                .catch(error => {
                    Message({
                        type: 'error',
                        message: this.$t('basic.server_error'),
                        duration: 4000
                    })
                    NProgress.done();
                })
                .finally(() => {
                    this.loading = false;
                })
        },

        getNestedChildren(arr, parent) {
            let out = [];
            for(let i in arr) {
                if(arr[i].parentId == parent) {
                    let children = this.getNestedChildren(arr, arr[i].value);

                    if(children.length) {
                        arr[i].children = children;
                    }
                    out.push(arr[i]);
                }
            }
            return out
        },

        getCategories () {
            const metadata = {
                url: 'categories',
                params: {
                    lang: this.$store.state.mainLang
                },
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {
                    this.categories.allNotNested = response;

                    response = response.map(data => {
                        return {
                            id: data.id,
                            value: data.id,
                            label: data.name,
                            parentId: data.parentId
                        }
                    });

                    this.categories.all = this.getNestedChildren(response, null);
                    this.categories.selected = this.$store.state.product.categoryId;
                })
        },
    },

    watch: {
        'categories.selected': function(newValue, oldValue) {
            if (this.$store.state.isMobileVersion) {
                return;
            }

            if (this.initial && newValue == 0) {
                return;
            }

            if (newValue == 0) {
                this.extras = [];
            }

            this.$store.commit('SET_PRODUCT_DATA', {categoryId: newValue});

            if (Array.isArray(newValue)) {
                this.getSubCategories([...newValue].pop() ? [...newValue].pop() : 0);

                if ([...newValue].pop()) {
                    this.getAttributes(newValue.join(','));
                }
            }else {
                this.getSubCategories(newValue);
            }

            let regionIds = [];

            if (this.regions.selected && this.regions.selected.id) {
                regionIds.push(this.regions.selected.id);

                if (this.regions.selected.parent.id) {
                    regionIds.push(this.regions.selected.parent.id);
                }
            }
            // console.log("FROM WATCH1")

            this.noResultFound = false

            //Top
            this.getProducts(this.size, this.offset, 1, this.searchData, this.categories.selected, regionIds);

            //Ordinary
            if (!this.$store.state.seeAllTop) {
                this.getProducts(this.size, this.offset, null, this.searchData, this.categories.selected, regionIds);
            }
        },

        '$store.state.mobileFilterForm.searchData': function(value) {
            if (this.initial) {
                return;
            }

            this.searchData = value;

            // console.log("FROM WATCH2");

            this.noResultFound = false

            //Top
            this.getProducts(this.size, this.offset, 1, this.searchData, this.categories.selected, this.regions.selected);

            //Ordinary
            if (!this.$store.state.seeAllTop) {
                this.getProducts(this.size, this.offset, null, this.searchData, this.categories.selected, this.regions.selected);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../custom.scss';

    .heart {
        position: absolute;
        right: 1rem;
        top: .5rem;
        font-size: 1.6rem;
    }

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
        line-clamp: 2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .star-icon {
        cursor: pointer;

        color: $primary-color;
    }

    .top-product-indicator {
        background: #f00812;
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
        float: right;
        position: absolute;
        bottom: 0;
        right: 0;

        span {
            font-size: 13px;
            color: $gray-color;
            display: none;
        }

        i {
            font-size: 22px; color: $primary-color;
        }

        &:hover {
            span {
                display: inline;
            }

            i {
                color: $primary-color;
            }
        }
    }

    .ad-text1 {
        font-size: 15px;
        color: $primary-color;
        cursor: pointer;
        margin: 5px;
    }

    .ad-text2 {
        font-size: 15px;
        color: $primary-color;
        cursor: pointer;

    }

    .tt{
        line-clamp: 1;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .tt2{
        line-clamp: 1;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
