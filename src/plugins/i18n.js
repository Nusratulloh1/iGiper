import Vue from 'vue'
import Vue18n from 'vue-i18n'

import uz from './langs/uz.json'

Vue.use(Vue18n);

export const i18n = new Vue18n({
    locale: 'uz',
    fallbackLocale: 'ru',

    messages: {
        uz
    }
})