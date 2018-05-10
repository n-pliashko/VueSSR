/* eslint-disable no-unused-vars */
import * as types from './types'

export default {
  [types.CHANGE_FORM_DATA] (state, {key, value, formName}) {
    let data = {
      ...state.formData
    }
    data[formName] = {
      ...data[formName],
      [key]: value
    }
    state.formData = data
  },

  [types.CHANGE_FORM_ERROR] (state, {data, formName}) {
    const {...error} = state.formMeta[formName] && state.formMeta[formName].formError
    const {...formSuccess} = state.formMeta[formName] && state.formMeta[formName].formSuccess
    state.formMeta[formName] = {
      formError: {
        ...error,
        ...data
      },
      formSuccess
    }
  },

  [types.CHANGE_FORM_DATA_MULTI] (state, {data, formName}) {
    const {...old} = state.formData[formName]
    state.formData[formName] = {
      ...old,
      ...data
    }
  },

  [types.LOGIN_SUBMIT] (state) {

  },

  [types.REQUEST_START] (state) {
    state.loading = true
  },

  [types.REQUEST_END] (state) {
    state.loading = false
  },

  [types.REQUEST_BASKET_START] (state) {
    state.basketLoading = true
  },

  [types.REQUEST_BASKET_FINISHED] (state) {
    state.basketLoading = false
  },

  [types.REQUEST_CURRENCY_START] (state) {
    state.currencyLoading = true
  },

  [types.REQUEST_CURRENCY_FINISHED] (state) {
    state.currencyLoading = false
  },

  [types.FORM_ERROR] (state, {msg, formName}) {
    let meta = {
      ...state.formMeta
    }
    meta[formName] = {
      ...meta[formName],
      formSuccess: undefined,
      formError: msg
    }
    state.formMeta = meta
  },

  [types.FORM_SUCCESS] (state, {msg, formName}) {
    let meta = {
      ...state.formMeta
    }
    meta[formName] = {
      ...meta[formName],
      formError: undefined,
      formSuccess: msg
    }
    state.formMeta = meta
  },

  [types.USER_SIGNED] (state, {data, router}) {
    state.user = data
    state.currency.selected = data.profile.currency_id

    if (router) {
      if (['/login', '/'].indexOf(state.route.from.fullPath) >= 0) {
        router.push('/account/profile')
        return
      }
      router.back()
    }
  },

  [types.USER_SIGNED_POPUP] (state, {data, router}) {
    state.user = data
    state.currency.selected = data.profile.currency_id
  },

  [types.INPUT_ADDRESS] (state, address) {
    state.regData['address_' + address.address_type] = address
  },

  [types.SSV4_USER_DATA] (state, data) {
    state.ssv4User = data
  },

  [types.NEW_USER_DATA] (state, data) {
    state.regData['profile'] = data
  },

  [types.SHIPPING_ID] (state, data) {
    state.regData['shipping_id'] = data
  },

  [types.BASKET_LOADED] (state, basket) {
    state.basket = {
      ...basket
    }
  },

  [types.CLEAR_BASKET] (state) {
    state.basket = {}
  },

  [types.SET_SAVE_FOR_LATER] (state, basket) {
    state.basket = {
      ...basket
    }
  },

  [types.DEL_SAVE_FOR_LATER] (state, basket) {
    state.basket = {
      ...basket
    }
  },

  // WISHLIST
  [types.WISHLIST_LOADED] (state, wishlist) {
    state.wishlist = [
      ...wishlist
    ]
    localStorage.setItem('wishlist', JSON.stringify([...wishlist]))
  },
  [types.SWITCH_WISHLIST] (state, data) {
    if (data.item.length === 0) {
      let index = ''
      if (data.params.type === 'basket') {
        index = (state.wishlist).findIndex((obj) => obj.id === data.params.id && obj.params.params.created_at === data.params.params.created_at)
      } else {
        index = (state.wishlist).findIndex((obj) => obj.id === data.params.id && obj.params.params.option === data.params.params.option)
      }
      state.wishlist.splice(index, 1)
    } else {
      state.wishlist.push(...data.item)
    }
    localStorage.setItem('wishlist', JSON.stringify([...state.wishlist]))
  },
  [types.CLEAN_WISHLIST] (state) {
    // Remove only pageitems
    let index = 1
    while (index !== -1) {
      index = (state.wishlist).findIndex((obj) => obj.params.type === 'pageitem')
      if (index !== -1) {
        state.wishlist.splice(index, 1)
      }
    }
    localStorage.setItem('wishlist', JSON.stringify([...state.wishlist]))
    // state.wishlist = []
    // localStorage.setItem('wishlist', '[]')
  },
  [types.ACTIVE_WL] (state, data) {
    state.activeWL = data
  },

  [types.ADD_ADDITIONAL_PRICE] (state, addPrice) {
  },

  [types.LOAD_CURRENCIES] (state, {currencies, selected}) {
    state.currency = {
      ...state.currency,
      allCurrency: currencies,
      selected: selected
    }
    state.currency.exchange = state.currency.exchangeFunc.bind(state.currency)
    state.currency.exchangeBack = state.currency.exchangeBackFunc.bind(state.currency)
  },

  [types.CHANGE_CURRENCY] (state, currency) {
    state.currency = {
      ...state.currency,
      selected: currency
    }
    state.currency.exchange = state.currency.exchangeFunc.bind(state.currency)
    state.currency.exchangeBack = state.currency.exchangeBackFunc.bind(state.currency)

    if (state.user.user_number) {
      const {user: {profile}} = state
      state.user = {
        ...state.user,
        profile: {
          ...profile,
          currency_id: currency
        }
      }
    }
  },

  [types.USER_SIGNOUT] (state, $router) {
    state.user = {}
    state.formData['login'] = {}
    state.formMeta['login'] = {}
    state.wishlist = []
    $router.push({
      name: 'Main'
    })
  },

  [types.SET_BREADCRUMBS] (state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  },
  [types.ADD_BREADCRUMB] (state, breadcrumb) {
    let breadcrumbs = state.breadcrumbs
    breadcrumb.map(one => {
      if (Object.values(breadcrumbs).findIndex((obj) => obj.title === one.title && one.path === obj.path) === -1) {
        breadcrumbs = breadcrumbs.concat([one])
      }
    })
    state.breadcrumbs = breadcrumbs
  },

  [types.SET_PAGE_DESCRIPTION] (state, description) {
    state.pageMenuDescription = description
  },

  [types.LOAD_MENUS] (state, menus) {
    state.menus = menus
  },
  [types.LOAD_MOBILE_MENU] (state, menu) {
    state.mobileMenu = menu
  },
  [types.FETCH_ORDERS] (state, orders) {
    state.orders = orders
  },
  [types.SET_REDIRECTS] (state, redirects) {
    state.redirects = redirects
  },

  [types.SET_ROUTER_BACK] (state, {path, params}) {
    state.backRoute = {
      path,
      params
    }
  },

  [types.LOAD_CATEGORIES] (state, categories) {
    state.allCategories = categories
  },
  [types.LOAD_DESIGNERS] (state, designers) {
    state.allDesigners = designers
  },
  [types.ORDER_LOADING] (state, current) {
    state.orderLoading = current
  },

  [types.SET_AUTHORIZATION] (state, status) {
    if (!status) {
      return
    }
    state.authorization = status.toLowerCase()
  },

  [types.COUNTRY_LOAD_START] (state) {
    state.countryLoading = true
  },

  [types.COUNTRY_LOAD_END] (state) {
    state.countryLoading = false
  },

  [types.SET_COUNTRIES] (state, data) {
    if (!data) {
      return
    }
    const cntrs = []
    data.map(item => (cntrs[item.number] = item))
    state.countries = cntrs
  },

  [types.GEO_IP_REQUEST] (state, loading) {
    state.geoLoading = loading
  },

  [types.SET_GEO_IP_INFO] (state, info) {
    state.geoInfo = info
  },

  [types.LOAD_PROMISE_DATA] (state, data) {
    state.promiseData = data
  },

  [types.CLEAR_PROMISE_DATA] (state) {
    state.promiseData = null
  }
}
