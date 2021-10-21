<template>
    <div class="hidden-sm-and-down" v-loading="loading"
         style="padding: 30px; min-height:400px; display: flex; justify-content: center;"
         v-if="!$store.state.isMobileVersion">
        <div style="max-width: 1200px;" v-if="this.$store.state.mainLang === 'uz'">
            <p><span v-html="body" style="text-align: start"></span></p>
        </div>
        <div style="max-width: 1200px;" v-else>
            <p><span v-html="bodyRu" style="text-align: start"></span></p
            ></div>
    </div>
    <div v-loading="loading" v-else>
        <div style="padding: 16px">
            <p v-if="this.$store.state.mainLang === 'uz'"><span v-html="body" style="text-align: start"></span></p>
<!--            <p v-if="this.$route.query.lang === 'uz'"><span v-html="body" style="text-align: start"></span></p>-->
            <p v-else><span v-html="bodyRu" style="text-align: start"></span></p>
        </div>
    </div>
</template>
<script>

    import Cookies from "js-cookie";

    export default {
        data() {
            return {
                body: "",
                bodyUz: "",
                bodyRu: "",
                title: "",
                titleUz: "",
                titleRu: "",
                loading: true
            }
        },

        beforeCreate() {
            const mainLang = this.$route.query.lang;
            let defaultLang = Cookies.get('lang');
            if (mainLang !== defaultLang) {
                this.$store.commit('SET_MAIN_LANG', mainLang);
                Cookies.set('lang', mainLang);
                document.location.reload();
            }
        },

        created() {
            this.getTermsAndCondition();
        },

        beforeRouteUpdate(to, from, next) {
            next()
            this.getTermsAndCondition()
        },

        methods: {
            getTermsAndCondition() {
                this.loading = true
                const metadata = {
                    url: 'footer',
                    params: {
                        id: this.$route.query.id,
                        // id: this.$route.params.id,
                        // id: 2,
                        lang: this.$store.state.mainLang
                    }
                }

                this.$store.dispatch('getData', metadata)
                    .then(response => {
                        this.title = response.title;
                        this.titleRu = response.titleRu;
                        this.body = response.body;
                        this.bodyRu = response.bodyRu
                    })
                    .catch(error => {
                        // console.log(error);
                    }).finally(() => {
                    this.loading = false
                })
            },
        }
    }
</script>