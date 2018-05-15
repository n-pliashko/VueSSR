/* eslint-disable no-unused-vars */
/* eslint no-eval: 0 */
import Vue from 'vue'
import Router from 'vue-router'
import VueHead from 'vue-head'
import axios from 'axios'

import { createStore } from '../store'

import Login from '@/components/scripts/Login/index.vue'
import Logout from '@/components/scripts/Logout/index.vue'
import Profile from '@/components/scripts/Profile/index.vue'
import Settings from '@/components/scripts/Settings/index.vue'
import Account from '@/components/scripts/Account/index.vue'
import Orders from '@/components/scripts/Orders/index.vue'
import Order from '@/components/scripts/Order/index.vue'
import Products from '@/components/scripts/Products/index.vue'
import Prescription from '@/components/scripts/Prescription/index.vue'
import SavedPrescriptions from '@/components/scripts/SavedPrescriptions/index.vue'
import Basket from '@/components/scripts/Basket/index.vue'
// import Checkout from '@/components/scripts/Checkout/index.vue'
// import Thank from '@/components/scripts/Checkout/Thank/index.vue'
// import Fail from '@/components/scripts/Checkout/Fail/index.vue'
import Register from '@/components/scripts/Register/index.vue'
import PageItem from '@/components/scripts/PageItem/index.vue'
import PageNotFound from '@/components/scripts/PageNotFound/index.vue'
import Payments from '@/components/scripts/PaymentFrame/index.vue'
import Main from '@/components/scripts/Main/index.vue'
import Wishlist from '@/components/scripts/Wishlist/index.vue'
import Review from '@/components/scripts/Review/index.vue'
import ReviewsList from '@/components/scripts/ReviewsList/index.vue'
import Goggles from '@/components/scripts/Goggles/index.vue'
import ContactLenses from '@/components/scripts/ContactLenses/index.vue'
import Glasses from '@/components/scripts/Glasses/index.vue'
import Sunglasses from '@/components/scripts/Sunglasses/index.vue'
import BrandList from '@/components/scripts/BrandList/index.vue'
import SalePage from '@/components/scripts/SalePage/index.vue'
import AboutUsPage from '@/components/scripts/AboutUsPage/index.vue'
import Reglaze from '@/components/scripts/Reglaze/index.vue'
// import Amazon from '@/components/scripts/Checkout/Amazon/index.vue'
import InfoPage from '@/components/scripts/InfoPage/index.vue'
import ChooseByFaceShapePage from '@/components/scripts/ChooseByFaceShapePage/index.vue'
import ProductionDeliveryPage from '@/components/scripts/ProductionDeliveryPage/index.vue'
import KidsGlasses from '@/components/scripts/KidsGlasses/index.vue'
import BuyingGuides from '@/components/scripts/HelpPages/BuyingGuides/index.vue'
import EyeHealth from '@/components/scripts/HelpPages/EyeHealth/index.vue'
import HowToGuides from '@/components/scripts/HelpPages/HowToGuides/index.vue'
import GuideToLenses from '@/components/scripts/HelpPages/GuideToLenses/index.vue'
import LensPrices from '@/components/scripts/HelpPages/LensPrices/index.vue'
import Store from '@/components/scripts/HelpPages/Store/index.vue'

const components = {
  Products,
  Login,
  Logout,
  Profile,
  Settings,
  Account,
  Orders,
  Order,
  Prescription,
  SavedPrescriptions,
  Basket,
// Checkout,
// Thank,
// Fail,
  Register,
  PageItem,
  PageNotFound,
  Payments,
  Main,
  Wishlist,
  Review,
  ReviewsList,
  Goggles,
  ContactLenses,
  Glasses,
  Sunglasses,
  BrandList,
  SalePage,
  AboutUsPage,
  Reglaze,
// Amazon,
  InfoPage,
  ChooseByFaceShapePage,
  ProductionDeliveryPage,
  KidsGlasses,
  BuyingGuides,
  EyeHealth,
  HowToGuides,
  GuideToLenses,
  LensPrices,
  Store
}
import config from '@/../config'

const store = createStore()

Vue.use(Router)
Vue.use(VueHead)

export function createRouter () {

  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/logout',
        name: 'Logout',
        component: Logout
      },
      {
        path: '/register',
        name: 'Register',
        component: Register,
        props: {
          breadcrumb: 'Register'
        }
      },
      {
        path: '/account/update',
        name: 'Account/update',
        component: Profile,
        props: {
          title: 'Profile'
        }
      },
      {
        path: '/account/password/',
        name: 'Account/password/',
        component: Settings,
        props: {
          title: 'Settings'
        }
      },
      {
        path: '/account/profile',
        name: 'Account',
        component: Account,
        props: {
          title: 'My Account'
        }
      },
      {
        path: '/account/orders',
        name: 'Account/orders',
        component: Orders,
        props: {
          title: 'Orders'
        }
      },
      {
        path: '/account/reviews',
        name: 'Account/reviews',
        component: ReviewsList,
        props: {
          title: 'Product Reviews'
        }
      },
      {
        path: '/reviews/write/:item_id',
        name: 'Reviews',
        component: Review,
        props: {
          title: 'Add or EditProduct Review'
        }
      },
      {
        path: '/account/prescriptions',
        name: 'Account/prescriptions',
        component: SavedPrescriptions,
        props: {
          title: 'Prescriptions'
        }
      },
      {
        path: '/account/view_order/:id(\\d+)/',
        name: 'Account/order/view',
        component: Order,
        props: true
      },
      {
        path: '/catalogue/index/term/:search_term',
        name: 'ProductListSearch',
        component: Products,
        props: true
      },
      {
        path: '/:menu(.+)?/prescription/select_use',
        name: 'SelectUse',
        component: Prescription,
        props: {stage: 'SelectUse'}
      },
      {
        path: '/:menu(.+)?/prescription/prescriptions',
        name: 'Prescriptions',
        component: Prescription,
        props: {stage: 'Prescriptions'}
      },
      {
        path: '/:menu(.+)?/prescription/lens_type',
        name: 'LensType',
        component: Prescription,
        props: {stage: 'LensType'}
      },
      {
        path: '/:menu(.+)?/prescription/lens_options',
        name: 'LensOptions',
        component: Prescription,
        props: {stage: 'LensOptions'}
      },
      {
        path: '/payments/:order_id',
        name: 'Payments',
        component: Payments
      },
      {
        path: '/accessories',
        name: 'ProductListAccessories',
        component: Products,
        props: true
      },
      {
        path: '/:category?/:designer?/:model?/(.+)?/ss:item(\\d+\\.?\\d+).html',
        name: 'ItemPage',
        component: PageItem
      },
    ]
  })

  let http = axios.create({
    baseURL: config.apiHost + config.prefix
  })

  http.get(config.routes.getPagesRoutes, {}, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    emulateJSON: true
  }).then(response => response.data)
    .then((data) => {
      let routes = []
      Object.values(data).map(page => {
        let filtered = routes.filter(obj => obj.name === page.name)
        routes.push({
          name: page.name
        })

        router.addRoutes([{
          path: '/' + page.path.replace(/^\//, ''),
          name: filtered.length > 0 ? page.name + filtered.length : page.name,
          component: components[page.component]
        }])
      })
      router.addRoutes([{
        path: '*',
        name: 'PageNotFound',
        component: PageNotFound
      }])
    })

  http.get(config.routes.getRedirects, {}, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    emulateJSON: true
  }).then(response => response.data)
    .then((data) => {
      let redirects = []
      Object.values(data).map(obj => {
        let redirect = '/' + obj.path.replace(/(\/){2,}/, '/').replace(/(^\/)|(\/$)/, '')
        let path = '/' + obj.redirect.replace(/(\/){2,}/, '/').replace(/(^\/)|(\/$)/, '')
        if (redirect && path !== redirect) {
          let route = [{
            path: path,
            redirect: redirect
          }]
          redirects = redirects.concat(route)
          router.addRoutes(route)
        }
      })
      store.dispatch('setRedirects', redirects)
    })

  return router
}

