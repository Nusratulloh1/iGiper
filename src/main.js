import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import VuePaginateScroll from "vue-paginate-scroll";
import VueCarousel from 'vue-carousel';
import VueMeta from 'vue-meta'
Vue.use(VueMeta)
Vue.use(VueSidebarMenu)
Vue.component('vue-paginate-scroll', VuePaginateScroll);
Vue.use(VueCarousel);

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

// Internationalizaion
import { i18n } from './plugins/i18n.js'

import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp31xjkNDJw2y_bE-PcAAckuE1YxJ-O4E",
  authDomain: "igiper-eddc5.firebaseapp.com",
  databaseURL: "https://igiper-eddc5.firebaseio.com",
  projectId: "igiper-eddc5",
  storageBucket: "",
  messagingSenderId: "1065473225806",
  appId: "1:1065473225806:web:1631e9e6bb61bda7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


Vue.config.productionTip = false

Vue.prototype.$serverImageUrl = 'http://igiper.uz/images/';

Vue.prototype.$maxWidth = '1010px';

import moment from 'moment'

Vue.filter('toTime', function (timestamp, isClock=false) {  
  return moment(timestamp).format(isClock ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD');
})

new Vue({  
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')