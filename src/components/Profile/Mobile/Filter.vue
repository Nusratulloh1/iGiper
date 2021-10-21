<template>
    <el-container direction="vertical" style="margin: .5rem">
        <el-row>
            <el-input @keypress.native.enter="searchProduct" v-model="searchData" prefix-icon="el-icon-search" :placeholder="$t('basic.search')">
                <template v-if="searchData.length > 0" slot="append"><i @click="searchData = ''" class="el-icon-plus"></i></template>
            </el-input> 
        </el-row>
        <el-row>
            <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">{{$t('basic.back')}}</el-button>
        </el-row>
        <el-row style="margin-top: .5rem">
            <div  @click="$router.push({name: 'regions'})" style="display: flex; justify-content: space-between; cursor: pointer; padding: .5rem 0; border-bottom: 1px solid #ABABAB;">
                <div style="display: flex; align-items: center;">
                    <i class="el-icon-location-outline"></i>
                    <span v-if="!$store.state.mobileFilterForm.regions.length > 0" style="margin-left: .3rem">{{$t('advertise.region')}}</span>
                    <div v-else style="display: flex; flex-direction: column; margin-left: .3rem">
                        <span style="font-size: 11px; color: gray"> {{makeBreadcrumb($store.state.mobileFilterForm.regions)}} </span>
                        <span style="font-size: 12px"> {{[...$store.state.mobileFilterForm.regions].pop().name}} </span>
                    </div>
                </div>
                <div>
                    <i class="el-icon-arrow-right"></i>
                </div>            
            </div>            
        </el-row>

        <el-row style="margin-top: .5rem">
            <div @click="$router.push({name: 'filter-category'})" style="display: flex; justify-content: space-between; cursor: pointer; padding: .5rem 0; border-bottom: 1px solid #ABABAB;">
                <div style="display: flex; align-items: center;">
                    <i :class="$store.state.mobileFilterForm.categories.length > 0 ? $store.state.mobileFilterForm.categories[0].iconClass : 'el-icon-s-grid'"></i>
                    <span v-if="!$store.state.mobileFilterForm.categories.length > 0" style="margin-left: .3rem">{{$t('advertise.category')}}</span>
                    <div v-else style="display: flex; flex-direction: column; margin-left: .3rem">
                        <span style="font-size: 11px; color: gray"> {{makeBreadcrumb($store.state.mobileFilterForm.categories)}} </span>
                        <span style="font-size: 12px"> {{[...$store.state.mobileFilterForm.categories].pop().name}} </span>
                    </div>
                </div>
                <div>
                    <i class="el-icon-arrow-right"></i>
                </div>            
            </div>            
        </el-row>

        <el-row :gutter="10" type="flex" style="flex-wrap: wrap;">
            <el-col v-for="extra in extras" :key="extra.id" :span="12" style="margin-top: .5rem">
                <el-input v-if="extra.type != 3" :id="`num${extra.index}`" size="mini" v-model="extra.dummy" :placeholder="extra.name"></el-input>
                <el-select :placeholder="extra.name" size="mini" v-else v-model="extra.dummy">
                    <el-option v-for="item in extra.customs" :key="item.id" :value="item.id" :label="item[$store.state.mainLang]"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row style="margin-top: 10px; display: flex">
            <el-col>
                <span>
                    Тип валюты
                </span>
            </el-col>
            <el-col>
                <el-select size="mini" v-model="currency.selected" placeholder="Select">
                    <el-option
                    v-for="item in currency.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row style="margin-top: .5rem" type="flex" justify="space-between" :gutter="5">
            <el-col :span="24">
                <el-input size="mini" id="minPriceFilter" v-model="minPrice" :placeholder="$t('basic.price_from')"></el-input>                                                   
            </el-col>
        </el-row>
        <row style="margin-top: .5rem" type="flex" justify="space-between" :gutter="5">
            <el-col :span="24">
                <el-input size="mini" id="maxPriceFilter" v-model="maxPrice" :placeholder="$t('basic.price_to')"></el-input>
            </el-col>
        </row>

        <el-row>
            <el-col :span="24" class="text-center mt-2 mb-1">Сортировать</el-col>
        </el-row>
        <el-row type="flex" :gutter="10" style="margin-top: .5rem;">
            <!-- <el-col>
                <el-select size="mini" v-model="currency.selected" placeholder="Select">
                    <el-option
                    v-for="item in currency.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col> -->
            <el-col :span="12" style="border-right: solid 1px rgba(156,156,156,0.99); margin-right: 5px;">
<!--                <el-select size="mini" v-model="type.selected" placeholder="Select">-->
<!--                    <el-option-->
<!--                    v-for="item in type.options"-->
<!--                    :key="item.value"-->
<!--                    :label="item.label"-->
<!--                    :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->

                <el-radio-group v-model="type.selected">
                    <el-radio :label="item.value" :key="item" v-for="item in type.options">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-col>
            <el-col :span="12">
<!--                <el-select size="mini" v-model="sort.selected" placeholder="Select">-->
<!--                    <el-option-->
<!--                        v-for="item in sort.options"-->
<!--                        :key="item.value"-->
<!--                        :label="item.label"-->
<!--                        :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
                <el-radio-group v-model="sort.selected">
                    <el-radio :label="item.value" :key="item" v-for="item in sort.options">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-col>
        </el-row>

        <el-row type="flex" justify="center" style="margin-top: .5rem">
            <el-button @click="searchProduct" type="primary">
                {{$t('basic.show_results')}}
            </el-button>
        </el-row>
    </el-container>
</template>

<script>
import Inputmask from "inputmask";
import { EventBus } from '@/plugins/EventBus.js';
import IMask from 'imask';


export default {
    data () {
        return {
            searchData: '',
            minPrice: '',
            maxPrice: '',

            extras: [],

            currency: {
                options: [
                    {
                        label: this.$t('advertise.soum'),
                        value: '1'
                    },
                    {
                        label: this.$t('advertise.dollar'),
                        value: '2'
                    },
                    {
                        label: "Rubl",
                        value: '3'
                    },
                ],
                selected: '1'
            },

            type: {
                selected: '1',
                options: [
                    {
                        value: '1',
                        label: this.$t('basic.list')
                    },
                    {
                        label: this.$t('basic.gallery'),
                        value: '0'
                    }
                ]
            },
            
            sort: {
                options: [
                    {value: '0', label: this.$t('basic.latest'), selected: true},
                    {value: '1', label: this.$t('basic.most_expensive'), selected: false},
                    {value: '2', label: this.$t('basic.cheapest'), selected: false},
                ],
                selected: '0'
            }     
        }
    },

    mounted () {        
        // setTimeout(() => {
        //     this.searchData = this.$store.state.mobileFilterForm.searchData;
        // }, 1500);
        this.initialize();

        if (this.$store.state.mobileFilterForm.categories.length > 0) {
            this.getAttributes(this.$store.state.mobileFilterForm.categories.map(data => data.id).join(','));
        }else {
            this.extras = [];
        }
    },

    destroyed () {
        //this.clearData();
    },

    methods: {        
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

        clearData () {
            const payload = {
                regions: '',
                categories: '',
                searchData: '',
                currencyId: '',
                sort: '',
                priceMin: '',
                priceMax: '',     
            }
            this.$store.commit('SET_MOBILE_FILTER_FORM', payload);
        },

        makeBreadcrumb (items) {      
            // console.log("ITEMS")                           
            // console.log(items)
            let names = '';

            for (let index = 0; index < items.length-1; index++) {
                const element = items[index];
                
                names += element.name;

                if (index != items.length-1) {
                    names += ' / ';
                }
            }
            return names;
        },

        initialize() {
            let min = new Inputmask({regex: '[-0-9]+', placeholder: ''}).mask(document.getElementById("minPriceFilter"));                                                        
            let max = new Inputmask({regex: '[-0-9]+', placeholder: ''}).mask(document.getElementById("maxPriceFilter"));                                                        

            this.type.selected = this.$store.state.mobileFilterForm.mode ? this.$store.state.mobileFilterForm.mode : '0';
            this.sort.selected = this.$store.state.mobileFilterForm.sort ? this.$store.state.mobileFilterForm.sort : '0';
            this.searchData = this.$store.state.mobileFilterForm.searchData;
        },

        searchProduct () {  
            // console.log("ASSALOM78");         
            // console.log(this.extras);
            
            const payload = {                
                searchData: this.searchData,
                //currencyId: '',
                sort: this.sort.selected,
                priceMin: this.minPrice,
                priceMax: this.maxPrice,
                extras: this.extras,
                mode: this.type.selected
            }            

            EventBus.$emit('searchDataChange', this.searchData);

            this.$store.commit("SET_MOBILE_FILTER_FORM", payload);

            this.$router.push({name: 'products'});            
        }
    }
}
</script>