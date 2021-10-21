<template>
    <div> 
        <el-row type="flex" justify="space-between" style="margin: .5rem">            
            <el-button @click="cancel" v-if="regions.isRoot" type="text">{{$t('basic.cancel')}}</el-button>            
            <el-button @click="handleBackClick" type="text" icon="el-icon-arrow-left" v-else>{{$t('basic.back')}}</el-button>            
        </el-row>        

        <div style="display: flex; justify-content: space-between; border-bottom: 1px #ABABAB solid; padding: 1rem 0" @click="handleRegionClick(regions.extraItem, true)">
            <div style="display: flex; align-items: center; margin-left: .5rem">                          
                <span> {{$t('basic.whole')}} {{regions.extraItem.name}}</span>
            </div>            
        </div>                 

        <div style="display: flex; justify-content: space-between; border-bottom: 1px #ABABAB solid; padding: 1rem 0;" v-for="region in regions.items" :key="region.id" @click="handleRegionClick(region)">
            <div style="display: flex; align-items: center; margin-left: .5rem">                          
                <span>{{region.name}}</span>
            </div>
            <div v-if="regions.isRoot">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>                      
    </div>     
</template>

<script>
export default {
    props: {
        from: {
            type: String,
            default: 'filter'
        },
    },
    data () {
        return {            
            regions: {        
                all: [],
                breadcrumb: [],        
                isRoot: true,
                items: [],
                extraItem: ''
            }
        }
    },

    created () {
        this.regions.extraItem = {
            id: '',
            parentId: '',
            name: this.$t('basic.uzb')
        }
    },

    mounted () {        
        this.getRegions();        
    },

    methods: {
        cancel () {
            // console.log("ALO")
            this.$store.commit('SET_MOBILE_FILTER_FORM', {regions: []});                
            this.$router.push({name: this.from});
        },

        getRegions (pid=null) {
            const metadata = {
                url: 'regions',
                params: {
                    lang: this.$store.state.mainLang,
                    pid
                }
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {

                    if (response.length == 0) {                                        
                        this.$store.commit('SET_MOBILE_FILTER_FORM', {regions: [this.regions.extraItem]});                
                        this.$router.push({name: this.from});
                    }

                    if (!pid) {
                        this.regions.isRoot = true;
                        this.regions.items = response.filter(data => !data.parentId || data.parentId==0);
                        this.regions.all = response;
                    }else {
                        this.regions.isRoot = false;
                        this.regions.items = response;
                    }                                              
                    
                })
        },        

        handleBackClick (toProducts=false) {      

            this.regions.extraItem = {
                id: '',
                parentId: '',
                name: this.$t('basic.uz')
            }                  
            this.getRegions();
        },

        handleRegionClick(region, isTop=false) {     
            
            if (isTop) {
                this.$store.commit('SET_MOBILE_FILTER_FORM', {regions: [region]});                
                this.$router.push({name: this.from});

                return;
            }

            if (this.regions.isRoot) {                
                this.getRegions(region.id);

                this.regions.extraItem = region;
                this.regions.extraItem.name = region.name;            
            }else {
                let regions = [this.regions.extraItem, region];                                

                this.$store.commit('SET_MOBILE_FILTER_FORM', {regions});                
                this.$router.push({name: this.from});
            }
        },    
    }
}
</script>

<style>

</style>