<template>
  <el-container style="margin: 0 .5rem; font-size: .7rem" direction="vertical">
    <el-row>
      <el-button icon="el-icon-arrow-left" style="float: left" @click="$router.push({path: '/'})" type="text">{{$t('basic.back')}}</el-button>
    </el-row>
    <el-row type="flex" justify="space-between">
      <div>
        <span class="gray-text" style="font-weight: bold;">{{$t('basic.your_account')}}: </span>
        <span style="font-weight: bold"> {{$store.state.userInfo.balance}} {{$t('advertise.soum')}}</span>                          
      </div>
            
      <el-button style="position: relative; bottom: .5rem" size="mini" @click="openPaymendDialog" type="primary" plain>{{$t('basic.fill_balance')}}</el-button>            
    </el-row>

    <el-row>
      <el-card v-for="transaction in transactions.items" :key="transaction.id">
        <el-row type="flex" justify="space-between" style="border-bottom: 1px solid #729F40; padding-bottom: .3rem">          
          <span>{{transaction.date | toTime}}</span>
          <span style="float: right">{{$t('basic.operation_id')}} {{transaction.id}}</span>          
        </el-row>

        <el-row>
          <span style="font-weight: bold; font-size: .9rem;">{{transaction.fromUser}}</span> <br>
          <span>{{transaction.amount}} {{$t('advertise.soum')}}</span>          
        </el-row>

      </el-card>
    </el-row>

    <el-dialog center :title="$t('basic.fill_balance')" :visible.sync="payDialogVisible" fullscreen>
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

    <el-pagination v-if="transactions.total > size" 
      background layout="prev, pager, next" :page-size="size" 
      :total="transactions.total" @current-change="onCurrentPageChange">
    </el-pagination>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      transactions: {
        items: [],
        total: 0
      },     

      paymentRules: [
          { required: true, message: this.$t('rules.required'), trigger: 'blur' }                
      ],
      size: 15,
      offset: 0,

      loading: true,

      payDialogVisible: false,

      paymentForm: {
          paymentSoum: '',
          dummy: 0
      },       

      paymentLoading: false,

      clickServiceSelected: true, //selected by default
      paymeServiceSelected: false,            

    }
  },

  mounted () {
    this.getTransactions();
  },

  methods: {
    onCurrentPageChange (page) {
      this.offset = (page - 1) * this.size;
      this.getTransactions(this.size, this.offset);
    },

    getTransactions (size, offset) {
      this.loading = true;

      const metadata = {
        url: 'transaction',
        params: {
          size, 
          offset
        },
        token: this.$store.state.userInfo.token
      }

      this.$store.dispatch('getData', metadata)
        .then(response => {                    
          this.transactions.total = response.count;          
          this.transactions.items = response.transactions;            
        })
        .catch(error => {

        })
        .finally(() => {
          this.loading = false;
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

  }
}
</script>

<style>

</style>