<template>
    <el-form v-loading="loading" ref="loginForm" :rules="loginFormData.rules" :model="loginFormData">
        <el-form-item prop="phone">   
            <VuePhoneNumberInput 
                color="#ccc"
                required
                @focus="$emit('phone-number-focused')"
                @blur="$emit('phone-number-blur')"
                @update="onUpdate"
                :placeholder="$t('basic.phone')" 
                v-model="loginFormData.phone">
                </VuePhoneNumberInput>                    
        </el-form-item>
        <el-form-item prop="password">
            <el-input @keypress.native.enter="login" type="password" show-password :placeholder="$t('basic.password')" v-model="loginFormData.password"></el-input>
        </el-form-item>

        <div class="form-action">
            <el-link class="hidden-sm-and-down" @click="repairPassword" style="float: right; color: red;">{{$t('basic.repair_password')}}</el-link>
            <el-button @click="login" style="width: 100%; margin: 1rem 0; background: rgb(144, 192, 73); color: white">{{$t('basic.enter_system')}}</el-button>
            <!-- <el-row type="flex" justify="center">
                <span style="font-size: 13px; text-align: center;">Mening profilimga bo‘limiga kirib, <el-link type="primary">Foydalanish shartlari</el-link> ni qabul qilasiz</span>
            </el-row> -->
        </div>
        
    </el-form>    
</template>

<script>
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import VuePhoneNumberInput from 'vue-phone-number-input';
import IMask from 'imask' 
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Inputmask from "inputmask";

export default {        
   components:{
       VuePhoneNumberInput
   },
    data () {
        // let checkPhone = (rule, value, callback) => {    
        //     let phone = document.getElementById('loginPhone')                   
        //     if (phone === '') {   // here we use IMaskJS       
        //         callback(new Error(this.$t('rules.phone')))
        //     }else if (phone.length < 9) { // ( xx ) xxx - xx - xx -> xxxxxxxxx            
        //         callback(new Error(this.$t('rules.correct_phone')))
        //     }else {                
        //         callback();
        //     }            
        // };

        let checkPhone = (rule, value, callback) => {   
            
            let phone = this.results.formattedNumber;            
            if (phone == null) {   // here we use IMaskJS       
                callback(new Error(this.$t('rules.phone')))
            }else {                
                callback();
            }            
        };
        let checkPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('rules.password')))
            }else if (value.length < 6) {
                callback(new Error(this.$t('rules.number6')))
            }else {
                callback();
            }
        };

        return {
            loading: false,
            results: null,
            loginFormData: {
                phone: '',
                password: '',

                rules: {
                    phone: [
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    password: [
                        { validator: checkPassword, trigger: 'blur' }
                    ]
                }
            }
        }
    },

    mounted () {        
        // this.loginFormData.phone = new Inputmask("+\\9\\98 (99) 999 99 99").mask(document.getElementById("loginPhone"));  
        this.loginFormData.phone = this.results.formattedNumber                                    
    },

    methods: {
        onUpdate(payload){
            this.results = payload
        } ,
        repairPassword () {
            this.$emit('repairPassword');
        },

        resetLoginFormData () {
            this.loginFormData.password = '';
            this.loginFormData.phone = null;

            this.$refs.loginForm.resetFields();
        },

        login () {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;                    
                    const metadata = {
                        url: 'users/auth',
                        method: 'post',
                        data: {
                            phone: this.results.formattedNumber,
                            password: this.loginFormData.password
                        }
                    }

                    this.$store.dispatch('setData', metadata)
                        .then(response => {                                                        
                            if (response) { // user found  
                                let regionId = (response.regionId && Array.isArray(response.regionId))? response.regionId.split(',').map(data => { return parseInt(data)}) : null;                            
                                const payload = {                                    
                                    name: response.name,
                                    balance: parseInt(response.balance),                                    
                                    phone: response.phone,
                                    imageUrl: response.photo,
                                    regionId: response.regionId,
                                    token: response.token,     
                                    favouritesCount: response.favouritesCount             
                                }                                                            

                                this.$store.commit('SET_USER_INFO', payload);
                                Cookies.set('userInfo', payload);                                
                                                                
                                this.resetLoginFormData();
                                this.$notify({
                                    type: 'success',
                                    title: this.$t('basic.success'),
                                    message: this.$t('basic.entered_system'),   
                                    duration: 3000                             
                                })                                
                                
                                this.$router.push({name: 'home'});
                                
                            }else { // user not found
                                Message({
                                    type: 'error',
                                    message: this.$t('basic.login_error')
                                })
                            }
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
                }
            })
        }
    }
}
</script>

<style>

</style>