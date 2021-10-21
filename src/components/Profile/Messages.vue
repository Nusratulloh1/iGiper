<template>
    <el-container direction="vertical">
        <el-row>
            <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">{{$t('basic.back')}}</el-button>
        </el-row>
        <div v-if="!activeMessage">
            <el-table v-if="!$store.state.isMobileVersion" :cell-style="{cursor: 'pointer'}" v-loading="loading" :data="messages" @row-click="onRowClick">            
                <el-table-column :label="$t('basic.user')">
                    <template slot-scope="scope">                        
                        <span v-if="scope.row.user['name']">{{scope.row.user['name']}}</span>                
                        <span v-else-if="scope.row.user['phone']">{{scope.row.user['phone']}}</span>
                        <i :style="`color: ${scope.row.fromId > 0 ? '#5499C7' : '#5499C7'}`" :class="`el-icon-${scope.row.fromId > 0 ? 'bottom' : 'top'}`"></i>                            
                    </template>
                </el-table-column>

                <el-table-column :label="$t('basic.ad')">
                    <template slot-scope="scope">
                        <span style="font-size: 15px; color: #717D7E; font-weight: bold;"> {{scope.row.product.name}} </span> <br>
                        <span style="font-size: 13px; color: #717D7E;">{{ scope.row.text }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('basic.date')" width="100" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.date | toTime }}
                    </template>
                </el-table-column>
            </el-table>

            <div v-else style="margin: 0 1rem">
                <div @click="onMessageClick(message)" v-for="message in messages" :key="message.id">
                    <el-row type="flex" justify="space-between">
                        <el-col>
                            <span v-if="message.user['name']">{{message.user['name']}}</span>                
                            <span v-else-if="message.user['phone']">{{message.user['phone']}}</span>
                            <i :style="`color: ${message.fromId > 0 ? '#5499C7' : '#5499C7'}`" :class="`el-icon-${message.fromId > 0 ? 'bottom' : 'top'}`"></i>                            
                        </el-col>

                        <el-col>
                            <span style="float: right">{{ message.date | toTime }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <span style="font-size: 12px; color: #717D7E; font-weight: bold;"> {{message.product.name}} </span> <br>
                        <span style="font-size: 10px; color: #717D7E;">{{ message.text }}</span>
                    </el-row>
                    <hr>
                </div>
            </div>
        </div>        

        <dialogs @closeDialog="activeMessage = null" v-else :messagePiece="activeMessage" />
    </el-container>
</template>

<script>

export default {
    components: {
        Dialogs: () => import('./Dialogs.vue')
    },

    data () {
        return {            

            loading: false,

            totalMessagesNumber: 0,
            messages: [],

            activeMessage: null
        }
    },

    mounted () {        
        this.getMessages();
    },

    methods: {        
        onRowClick (row, column, event) {            
            this.activeMessage = row;
        },

        onMessageClick (message) {
            this.activeMessage = message;
        },

        getMessages () {
            this.loading = true;

            const metadata = {
                url: 'messages/dialogs',
                params: null,
                token: this.$store.state.userInfo.token,
            }

            this.$store.dispatch('getData', metadata)
                .then(response => {                    
                    this.messages = response;                                           
                })  
                .catch(error => {

                })  
                .finally(() => {
                    this.loading = false;
                })        
        }
    }
}
</script>

<style scoped>
.every-cell {
    cursor: pointer;
}
</style>