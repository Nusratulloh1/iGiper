<template>
    <el-container direction="vertical">        
        <el-form @submit.native.prevent v-show="step === 1" v-loading="sendCodeFormData.loading" 
        :model="sendCodeFormData" 
        :rules="sendCodeFormData.rules" 
        ref="sendCodeForm">
            <el-form-item prop="phone">
                <VuePhoneNumberInput 
                color="#ccc"
                id="signUpPhone"
                required
                @keypress.native.enter="sendCode" 
                @focus="$emit('phone-number-focused')"
                @blur="$emit('phone-number-blur')"
                @update="onUpdate"
                :placeholder="$t('basic.phone')" 
                v-model="sendCodeFormData.phone">
                </VuePhoneNumberInput>
            </el-form-item>            

            <el-form-item v-show="!repairPasswordMode" prop="acceptTermsOfRules" >                    
                <el-checkbox v-model="sendCodeFormData.acceptTermsOfRules">
                    <span style="font-size: 12px"> {{$t('basic.rules_agree')}} </span>
                    <el-link class="hidden-sm-and-down" style="font-size: 12px; color: rgb(144, 192, 73);">{{$t('basic.rules')}}</el-link>.
                </el-checkbox>
                <el-link class="hidden-md-and-up" style="font-size: 12px; color: rgb(144, 192, 73);" @click="toFullPage()">{{$t('basic.rules')}}</el-link>
            </el-form-item>            

            <el-form-item>
                <el-button id="send-code-btn" @click="sendCode" style="width: 100%; background: rgb(144, 192, 73); color: white">{{$t('basic.confirm')}}</el-button>
            </el-form-item>
        </el-form>

        <el-form @submit.native.prevent v-show="step === 2" v-loading="verifyCodeFormData.loading" 
        :model="verifyCodeFormData" :rules="verifyCodeFormData.rules" ref="verifyCodeForm">
            <el-form-item>
                <span>{{$t('sign_up.verify_code')}}</span> 
            </el-form-item>
            <el-form-item prop="code">
                <span>{{$t('sign_up.enter_code')}}:</span>
                <el-link style="color: rgb(144, 192, 73);">{{ sendCodeFormData.phone }}</el-link>

                <el-input @keypress.native.enter="verifyCode" :placeholder="$t('basic.6nums')" v-model="verifyCodeFormData.code" id="code"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="verifyCode" style="width: 100%; background: rgb(144, 192, 73);">{{$t('sign_up.verify_code')}}</el-button>
            </el-form-item>
        </el-form>
        
        <el-form @submit.native.prevent v-show="step === 3" label-position="top" v-loading="signUpFormData.loading" :model="signUpFormData" :rules="signUpFormData.rules" ref="signUpForm">
            <el-form-item prop="password" :label="$t('basic.password')">
                <el-input :placeholder="$t('basic.password')" v-model="signUpFormData.password"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('basic.confirm_password')">
                <el-input @keypress.native.enter="signUp" :placeholder="$t('basic.confirm_password')" v-model="signUpFormData.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="signUp" style="width: 100%; background: rgb(144, 192, 73);">{{!repairPasswordMode ? $t('basic.sign_up') : $t('basic.confirm')}}</el-button>
            </el-form-item>
        </el-form>
    </el-container>
</template>

<script>
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import VuePhoneNumberInput from 'vue-phone-number-input';
// import IMask from 'imask' 
import firebase from 'firebase'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'

// import Inputmask from "inputmask";

export default {
        components:{
        VuePhoneNumberInput 
    },
    props: {
        repairPasswordMode: {
            type: Boolean,
            default: false
        }
    },
    data () {

        let checkPhone = (rule, value, callback) => {   
            
            let phone = this.results.formattedNumber;            
            if (phone == null) {   // here we use IMaskJS       
                callback(new Error(this.$t('rules.phone')))
            }else {                
                callback();
            }            
        };

        let checkAcceptTermsOfRules = (rule, value, callback) => {
            if (!value) {
                callback(new Error(this.$t('rules.confirm_you_are_agree')))
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

        let checkConfirmPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('rules.confirm_password')))
            }else if (value !== this.signUpFormData.password) {
                callback(new Error(this.$t('rules.password_must_match')))
            }else {
                callback();
            }
        };

        let checkCode = (rule, value, callback) => {            
            if (value.unmaskedValue === '') {
                callback(new Error(this.$t('rules.code')))
            }else if (value.length < 6) {
                callback(new Error(this.$t('rules.code6')))
            }else {
                callback();
            }
        };
        
        return {
            step: 1,
            results: null,

            sendCodeFormData: {
                loading: false,
                phone: null,
                acceptTermsOfRules: false,

                rules: {
                    phone: [
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    acceptTermsOfRules: [
                        { validator: checkAcceptTermsOfRules, trigger: 'change' }
                    ]
                }
            },

            verifyCodeFormData: {
                loading: false,
                code: '',

                rules: {
                    code: [
                        { required: true, validator: checkCode, trigger: 'blur' }
                    ]
                }
            },

            signUpFormData: {
                loading: false,

                password: '',
                confirmPassword: '',

                rules: {
                    password: [                        
                        {required: true, validator: checkPassword, trigger: 'blur'},
                    ],
                    confirmPassword: [
                        {required: true, validator: checkConfirmPassword, trigger: 'blur'},
                    ]
                }
            }
        }
    },
    methods: {   
        onUpdate(payload){
            this.results = payload
        } ,
        toLogin () {
            this.$emit('toLogin');
        },

        toFullPage() {
            if (this.$router.currentRoute.name !== 'fullpage') {
                this.$router.push({path: '/fullpage', query: {id: '1', lang: this.$store.state.mainLang}})
            } else {
                this.$router.replace({name: 'fullpage', query: {id: '1', lang: this.$store.state.mainLang}})
            }

            window.scroll({
                top: 0,
                behavior: 'smooth'
            })
        },

        // initialiseMasks () {            
        //     this.sendCodeFormData.phone = new Inputmask("+\\9\\98 (99) 999 99 99").mask(document.getElementById("signUpPhone"));                              

        //     this.verifyCodeFormData.code = new Inputmask("999999").mask(document.getElementById("code"));              
        // },
        
        sendCode () {                               
            if (this.repairPasswordMode) {
                this.sendCodeFormData.acceptTermsOfRules = true;
            }
            this.$refs.sendCodeForm.validate(valid => {
                if (valid) {                    
                    this.sendCodeFormData.phone = this.results.formattedNumber
                    this.sendCodeFormData.loading = true;            
                    const appVerifier = window.recaptchaVerifier;
                    const phoneNumber =  this.sendCodeFormData.phone;

                    //first check if the input phone number exists in the database
                    const metadata = {
                        url: 'users/check',
                        method: 'post',
                        data: {
                            phone: phoneNumber
                        }
                    }                            

                    this.$store.dispatch('setData', metadata)
                        .then(response => {                                        
                            
                            let nextStep = false;
                            
                            if (this.repairPasswordMode == true && response === true) {
                                nextStep = true;
                            }else if (response === false && this.repairPasswordMode == false) {                                
                                nextStep = true;
                            }

                            if (nextStep) { // if the phone number does not exist in the database
                                firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                                    .then(confirmationResult => {
                                        // SMS sent. Prompt user to type the code from the message, then sign the
                                        // user in with confirmationResult.confirm(code).                                
                                        window.confirmationResult = confirmationResult;                                                                                                                                    

                                            Message({
                                                message: this.$t(this.repairPasswordMode ? 'sign_up.restore_password_success' : 'sign_up.sms_sent'),
                                                center: true,
                                                type: 'info',
                                                duration: 4000
                                            })

                                            this.step++;
                                            
                                            // this.expired = false;
                                            // let fiveMinutes = 60 * 2,
                                            // display = document.querySelector('#time');
                                            // this.startTimer(fiveMinutes, display);                    
                                    })
                                    .catch(error => {

                                    })
                                    .finally(() => {
                                        this.sendCodeFormData.loading = false;
                                    })
                            }else {
                                this.sendCodeFormData.loading = false;
                                Message({
                                    type: "error",
                                    message: this.$t(this.repairPasswordMode ? 'sign_up.user_not_registered_yet' : 'sign_up.phone_exists'),
                                    duration: 5000
                                })
                            }

                        })
                }
            })            
        },

        clearSendCodeFormData () {            
            this.sendCodeFormData.loading = false;
            this.sendCodeFormData.phone = null;
            this.sendCodeFormData.acceptTermsOfRules = false;

            this.$refs.sendCodeForm.resetFields();
        },

        verifyCode () {
            this.verifyCodeFormData.loading = true;
            this.verifyCodeFormData.code = document.getElementById('code')
            let code = this.verifyCodeFormData.code
                        
            window.confirmationResult.confirm(code).then(result => {
                // User signed in successfully.
                //this.sendCodeLoading = false;
                var user = result.user;
                Message({
                    message: this.$t('sign_up.success_verification'),                    
                    center: false,
                    type: 'success',
                    duration: 4000
                })

                this.step++;
                // ...

                //this.phoneVerificationStep = false;
            }).catch(error => {
                // User couldn't sign in (bad verification code?)
                // ...
                Message({
                    message: this.$t('sign_up.fail_verification'),
                    center: true,
                    type: 'error',
                    duration: 4000
                })
                //this.verificationCode.unmaskedValue = ''
            })
            .finally(() => {
                this.verifyCodeFormData.loading = false;
            })
        },

        clearVerifyCodeFormData () {            
            this.verifyCodeFormData.loading = false;
            this.verifyCodeFormData.code = null;

            this.$refs.verifyCodeForm.resetFields();
        },

        signUp () {
            this.$refs.signUpForm.validate(valid => {
                if (valid) {
                    this.signUpFormData.loading = true;
                    const metadata = {
                        url: 'users/registration',
                        method: 'post',
                        data: {
                            password: this.signUpFormData.password,
                            phone: this.sendCodeFormData.phone
                        }
                    }

                    if (this.repairPasswordMode) {
                        metadata.url = 'users/password';
                        metadata.method = 'put';
                    }

                    this.$store.dispatch('setData', metadata)
                        .then(response => {
                            const payload = {                                    
                                name: '',
                                balance: 0,                                
                                phone: '+998' + this.sendCodeFormData.phone,
                                token: response,
                            }

                            this.$store.commit('SET_USER_INFO', payload);
                            
                            let message = this.repairPasswordMode ? this.$t("sign_up.restore_password_success") : this.$t('basic.signed_up')

                            this.$notify({
                                type: 'success',
                                title: this.$t('basic.success'),
                                message,   
                                duration: 3000                             
                            });

                            Cookies.set('userInfo', payload);
                            this.$router.push({name: 'home'});

                            this.clearSendCodeFormData();
                            this.clearVerifyCodeFormData();
                            this.clearSignUpFormData();                                                        
                        })
                        .catch(error => {
                            Message({
                                    type: "error",
                                    message: this.$t('basic.server_error'),
                                    duration: 5000
                                })
                        })
                        .finally(() => {
                            this.signUpFormData.loading = false;
                        })
                }
            })        
        },

        clearSignUpFormData () {            
            this.signUpFormData.loading = false;
            this.signUpFormData.password = '';
            this.signUpFormData.confirmPassword = '';

            this.$refs.signUpForm.resetFields();
        }
    },
        mounted () {    
        console.log(this.results)         
        // this.initialiseMasks();        
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('send-code-btn', {
            'size': 'invisible',
            'callback': function(response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    //this.sendCode();
                }
            });    
    },
}
</script>
<style scoped>
.country-selector.has-hint .country-selector__label[data-v-46e105de], .country-selector.has-value .country-selector__label[data-v-46e105de] {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
    font-size: 11px;
    display: none !important;
}
</style>
