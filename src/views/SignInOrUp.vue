<template>
    <el-container direction="vertical">
        <el-row v-if="!$store.state.isMobileVersion" type="flex" justify="center"
                style="border-top: 1px #EAEDED solid; margin-top: .3rem">
            <el-col :span="16">
                <el-row type="flex" justify="center">
                    <el-col :span="12">
                        <el-tabs v-model="activeTab" type="border-card" class="tabs">
                            <el-tab-pane name="login" :label="$t('basic.enter_system')">
                                <Login @repairPassword="handleRepairPassword"/>
                            </el-tab-pane>
                            <el-tab-pane name="signUp"
                                         :label="repairPassword ? $t('basic.repair_password') : $t('basic.sign_up')">
                                <SignUp :repairPasswordMode="repairPassword"/>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row v-else type="flex" justify="center" align="center">
            <div v-if="isMobileLoginActive" style="margin-top: 2rem">
                <el-row type="flex" justify="center" style="margin-top: 1rem; flex-wrap: wrap;">
                    <el-col :span="20">
                        <Login @repairPassword="handleRepairPassword"/>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center">
                    <el-col :span="20">
                        <el-row type="flex" justify="center">
                            <el-link @click="handleRepairPassword" type="primary">{{$t('basic.repair_password')}}
                            </el-link>
                        </el-row>
                    </el-col>
                    <el-col :span="20">
                        <el-row type="flex" justify="center">
                            <el-link @click="signUpClick()"
                                     style="background: rgb(144, 192, 73);">{{$t('basic.sign_up')}}
                            </el-link>
                        </el-row>
                    </el-col>
                </el-row>

                <el-row type="flex" style="margin-top: 1rem" justify="center">
                    <el-col :span="20">
            <span style="font-size: 12px;">
              {{$t('basic.agree_rules_')}} <span style="color: rgb(144, 192, 73);"
                                                 @click="toFullpage()">{{$t('basic.rules')}}</span> {{$t('basic.accept')}}
            </span>
                    </el-col>
                </el-row>
            </div>

            <div v-else>
                <el-row type="flex" justify="center" style="margin-top: 1rem; flex-wrap: wrap;">
                    <el-col :span="20">
                        <el-button type="text" icon="el-icon-arrow-left" @click="isMobileLoginActive=true">
                            {{$t('basic.back')}}
                        </el-button>
                        <SignUp style="margin-top: 2rem;" :repairPasswordMode="repairPassword"/>
                    </el-col>
                </el-row>
            </div>
        </el-row>
    </el-container>
</template>

<script>
    import Login from '@/components/Login.vue'

    export default {
        components: {
            Login,

            SignUp: () => import('@/components/SignUp.vue')
        },

        data() {
            return {
                activeTab: 'login',
                repairPassword: false,

                isMobileLoginActive: true,
            }
        },

        methods: {
            handleRepairPassword() {
                this.isMobileLoginActive = false;

                this.activeTab = 'signUp';
                this.repairPassword = true;
            },

            signUpClick() {
                this.isMobileLoginActive = false;
                this.repairPassword = false;
            },

            toFullpage() {
                if (this.$router.currentRoute.name !== 'fullpage') {
                    this.$router.push({path: '/fullpage', query: {id: '1', lang: this.$store.state.mainLang}})
                } else {
                    this.$router.replace({name: 'fullpage', query: {id: '1', lang: this.$store.state.mainLang}})
                }

                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        },

        watch: {
            activeTab: function (value) {
                if (value == 'login') {
                    this.repairPassword = false;
                }
            }
        }
    }
</script>

<style scoped>
    .tabs {
        margin-top: 2rem;
        -webkit-box-shadow: 0px 0px 20px -6px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 20px -6px rgba(0, 0, 0, 0.75);
        box-shadow: 0px 0px 20px -6px rgba(0, 0, 0, 0.75);
    }
</style>