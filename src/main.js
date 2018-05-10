import Vue from 'vue'
import VueHead from 'vue-head'
import VueResource from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import { createRouter } from './router/router'
import { createStore } from './store'
import { mapState } from 'vuex'
import axios from 'axios'
import storeVue from './store/storeVue'

// Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VueHead)
Vue.use(VueAwesomeSwiper)
Vue.mixin({
  computed: {
    ...mapState({
      auth: (state) => state.authorization,
      calculatePrice: (state) => state.calculatePrice
    })
  }
})

Vue.prototype.$axios = axios

// Global Vue events. Use: window.globalEvents.$emit('event', 'eventParams') and window.globalEvents.$on('event',() => {// Do something}))
window.globalEvents = new Vue()

const router = createRouter()
const store = createStore()

router.beforeEach((to, from, next) => {
  const {path} = to
  let menuData = {
    link: path
  }

  console.log('to:::', path)
  if (from.path !== path) {
    store.dispatch('getMenuDescription', [menuData, to])
  }
  // document.body.scrollTo(0, 0)
  next()
})

sync(store, router)

export function createApp () {
  // create router instance

  const app = new Vue({
    ...storeVue,
    router,
    store,
    // the root instance simply renders the App component.
    render: h => h(App)
  })

  return {app, store, router}
}
