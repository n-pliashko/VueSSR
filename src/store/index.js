import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import currency from './currency'
import config from '../../config/index'
import * as auth from './authorization'
import vat from './vat'
import calculatePrice from './price'

Vue.use(Vuex)

const state = {
  ...global.initialState,
  apiHost: config.apiHost,
  integrationHost: config.integrationHost,
  formData: {},
  formMeta: {},
  breadcrumbs: [],
  menus: [],
  mobileMenu: [],
  redirects: [],
  backRoute: {
    path: undefined,
    params: {}
  },
  loading: undefined,
  basketLoading: undefined,
  currencyLoading: undefined,
  orderLoading: undefined,
  user: {},
  address: {},
  regData: {},
  basket: {},
  pageMenuDescription: {},
  currency,
  orders: [],
  allCategories: [],
  allDesigners: [],
  authorization: auth.UNAUTHORIZED,
  countries: [],
  countryLoading: undefined,
  geoLoading: undefined,
  geoInfo: {},
  wishlist: [],
  activeWL: [],
  promiseData: null
}
state.vat = vat.bind(state)
state.calculatePrice = calculatePrice.bind(state)

export function createStore () {
  const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
  })

  store.dispatch('loadAllCurrencies')
  store.dispatch('loadCountries')
  store.dispatch('loadGeoIp')
  store.dispatch('checkUser')
  store.dispatch('getBasket')
// store.dispatch('loadCategories', null)
// store.dispatch('loadDesigners', null)
  store.dispatch('loadMenus')
  store.dispatch('loadMobileMenu')
  store.dispatch('loadItemsWishlist')
  return store
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
