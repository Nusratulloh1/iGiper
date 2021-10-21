import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import Cookies from 'js-cookie'
import store from './store';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },    
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    
    {
      path: '/product/:id',
      name: 'product',

      props: true,
      component: () => import(/* webpackChunkName: "product" */ './views/Product')
    },

    {
      path: '/profile',
      name: 'profile',

      props: true,

      beforeEnter: (to, from, next) => {
        // ...
        const userInfo = Cookies.getJSON('userInfo');        
        if (userInfo && userInfo.token) {          
          next();
        }else{
          next('/signInOrUp');
        }
      },
      
      component: () => import(/* webpackChunkName: "profile" */ './views/Profile')
    },

    {
      path: '/profile/transactions',
      name: 'transactions',

      props: true,

      beforeEnter: (to, from, next) => {
        // ...
        const userInfo = Cookies.getJSON('userInfo');        
        if (userInfo && userInfo.token) {          
          next();
        }else{
          next('/signInOrUp');
        }
      },
      
      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/Transactions')
    },

    {
      path: '/profile/ads',
      name: 'ads',

      props: true,

      beforeEnter: (to, from, next) => {
        // ...
        const userInfo = Cookies.getJSON('userInfo');        
        if (userInfo && userInfo.token) {          
          next();
        }else{
          next('/signInOrUp');
        }
      },
      
      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/Ads')
    },

    {
      path: '/messages',
      name: 'messages',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Messages')
    },

    {
      path: '/favourite-courses',
      name: 'favourite-courses',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Favourites')
    },

    {
      path: '/settings',
      name: 'settings',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Settings')
    },

    {
      path: '/announcement-block',
      name: 'announcement-block',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Announcement/AnnouncementBlock')
    },

    {
      path: '/filter',
      name: 'filter',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/Filter')
    },

    {
      path: '/sidebar',
      name: 'sidebar',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/Sidebar')
    },

    {
      path: '/filter-category',
      name: 'filter-category',

      props: true,      
      
      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/FilterCategory')
    },

    {
      path: '/categories',
      name: 'categories',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/Categories')
    },

    {
      path: '/regions',
      name: 'regions',

      props: true,      
      
      component: () => import(/* webpackChunkName: "profile" */ './components/Profile/Mobile/Regions')
    },

    {
      path: '/login',
      name: 'login',

      props: true,

      component: () => import(/* webpackChunkName: "profile" */ './components/Login')
    },

    {
      path: '/products/create',
      name: 'makeannouncement',

      props: true,
      
      component: () => import(/* webpackChunkName: "makeannouncement" */ './views/MakeAnnouncement.vue'),

      beforeEnter: (to, from, next) => {
        // ...
        const userInfo = Cookies.getJSON('userInfo');        
        if (userInfo && userInfo.token) {          
          next();
        }else{
          next('/signInOrUp');
        }
      }
    },    

    {
      path: '/signInOrUp',
      name: 'signInOrUp',

      props: true,
      component: () => import(/* webpackChunkName: "signInOrUp" */ './views/SignInOrUp')
    },

    {
      path: '/products',
      name: 'products',

      props: true,
      component: () => import(/* webpackChunkName: "signInOrUp" */ './views/Products')
    },

    {
      path: '/fullpage',
      name: 'fullpage',

      props: true,

      component: () => import(/* webpackChunkName: "FullPage" */ './views/TermsAndCondition')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const userInfo = Cookies.getJSON('userInfo');
  if (!userInfo && store.state.userInfo.token) {
    store.commit('CLEAR_USER_INFO');        
    if (from == '/profile') {
      next('/');
    }
  }  

  next();
})

export default router;