import * as types from './types'
import $ from 'jquery'
import * as auth from './authorization'
import Vue from 'vue'
import axios from 'axios'
import VueResource from 'vue-resource'
import config from '@/../config'
import { reverseRouteName } from '../../config/helper'

Vue.use(VueResource)

Vue.http.options.xhr = {withCredentials: true}

let http = axios.create({
  baseURL: config.apiHost + config.prefix
})

export default {
  onChangeForm: ({commit}, el) => {
    const formName = el.target.form.name || 'default'
    let value = !el.target.checked ? el.target.type === 'checkbox' ? false : el.target.value : parseInt(el.target.value)

    commit(types.CHANGE_FORM_DATA, {
      key: el.target.name,
      value,
      formName
    })
  },

  onSubmitPopupLogin: ({commit, state, dispatch}, router) => {
    const {formData: {popupLogin = {}}} = state
    const {email, password} = popupLogin

    commit(types.REQUEST_START)
    let url = new URL(window.location.href)
    let sspay = url.searchParams.get('sspay')
    http.post((sspay ? (config.integrationHost + config.integrationPrefix + config.users.loginSsv4 + '/') : config.users.login), {
      LoginForm: {
        username: email,
        password,
        rememberMe: true
      },
      csrf: state.csrf
    }, {
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(result => {
        dispatch('getBasket')
        dispatch('loadItemsWishlist')
        commit(types.FORM_SUCCESS, {msg: 'Logged successfully', formName: 'popupLogin'})
        commit(types.USER_SIGNED_POPUP, {data: result.data, router})
      })
      .catch(res => commit(types.FORM_ERROR, {msg: res.response.data.error, formName: 'popupLogin'}))
      .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END))
  },

  onSubmitLogin: ({commit, state, dispatch}, router) => {
    const {formData: {login = {}}} = state
    const {email, password, account, home} = login

    if (!account) {
      commit(types.FORM_ERROR, {msg: null, formName: 'login'})
      router.push('register')
      return
    }

    commit(types.REQUEST_START)
    let url = new URL(window.location.href)
    let sspay = url.searchParams.get('sspay')
    http.post((sspay ? (config.integrationHost + config.integrationPrefix + config.users.loginSsv4 + '/') : config.users.login), {
      LoginForm: {
        username: email,
        password,
        rememberMe: true
      },
      csrf: state.csrf
    }, {
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(result => {
        dispatch('getBasket')
        dispatch('loadItemsWishlist')
        commit(types.FORM_SUCCESS, {msg: 'Logged successfully', formName: 'login'})
        if (home) {
          commit(types.USER_SIGNED, {data: result.data})
          router.push({name: 'Main'})
          return
        }
        commit(types.USER_SIGNED, {data: result.data, router})
      })
      .catch(res => commit(types.FORM_ERROR, {msg: res.response.data.error, formName: 'login'}))
      .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END))
  },

  checkLogin: ({commit, state, dispatch}, email) => {
    commit(types.REQUEST_START)
    return http.get(config.users.get, {
      params: {
        email
      }
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(res => {
        const {items: data} = res.data
        const {formData: {login: {account}}} = state
        commit(types.CHANGE_FORM_DATA, {key: 'familiarEmail', value: !account && !!data.length, formName: 'login'})
        commit(types.CHANGE_FORM_DATA, {key: 'account', value: account || (data.length ? 1 : 0), formName: 'login'})
        commit(types.REQUEST_END)
        return data
      })
      .catch(res => {
        commit(types.CHANGE_FORM_DATA, {key: 'familiarEmail', value: false, formName: 'login'})
        commit(types.REQUEST_END)
        return res
      })
  },

  onSubmitProfile: ({commit, state, dispatch}, data) => {
    const {user, apiHost} = state
    commit(types.REQUEST_START)

    Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(user.hashedPassword + ':')

    Vue.http.put(apiHost + config.prefix + config.users.get + '/' + user.user_number, data)
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then((data) => {
        commit(types.USER_SIGNED, {data: data.body})
        if (data.newPassword) {
          commit(types.FORM_SUCCESS, {
            msg: 'Profile saved. We send confirmation link to your registered email',
            formName: 'profile'
          })
        } else {
          commit(types.FORM_SUCCESS, {msg: 'Profile saved.', formName: 'profile'})
        }
        commit(types.REQUEST_END)
      }, res => {
        const error = [
          ...(state.formMeta.profile && state.formMeta.profile.formError || []),
          {
            field: 'profile',
            message: res.body
          }
        ]
        commit(types.REQUEST_END)
        commit(types.FORM_ERROR, {msg: error, formName: 'profile'})
      })
  },

  onSubmitAddress: ({commit, state, dispatch}, {e, address = {}}) => {
    e.preventDefault()
    const {user: {hashedPassword, profile}, apiHost} = state
    const {address_type: formName} = address
    let promise

    commit(types.REQUEST_START)

    Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(hashedPassword + ':')
    if (address.id) {
      promise = Vue.http.put(apiHost + config.prefix + config.profiles.addresses + '/' + address.id, address)
    } else {
      address.profile_id = profile.profile_number
      promise = Vue.http.post(apiHost + config.prefix + config.profiles.addresses, address)
    }

    return promise
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then((data) => {
          const {body: address} = data
          let addresses = [
            ...profile.addresses
          ]
          const index = addresses.findIndex((item) => item.address_type === address.address_type)
          if (index >= 0) {
            addresses[index] = address
          } else {
            addresses.push(address)
          }

          const user = {
            ...state.user,
            profile: {
              ...profile,
              addresses
            }
          }

          commit(types.USER_SIGNED, {data: user})
          commit(types.FORM_SUCCESS, {msg: 'address saved', formName})
          commit(types.REQUEST_END)

          let {...errors} = state.formMeta.profile && state.formMeta.profile.formError || []
          const filter = Array.prototype.filter.bind(errors)
          errors = filter(item => (item.field !== (address.address_type + 'Address')))
          commit(types.FORM_ERROR, {msg: errors, formName: 'profile'})
          return address
        },
        (result) => {
          const data = {}
          result.body.map(item => (data[item.field] = item.message))
          const error = [
            ...(state.formMeta.profile && state.formMeta.profile.formError || []),
            {
              field: address.address_type + 'Address',
              message: data
            }
          ]
          commit(types.REQUEST_END)
          commit(types.FORM_ERROR, {msg: error, formName: 'profile'})
        })
  },

  updateAddress: ({commit, state}, address) => {
    commit(types.INPUT_ADDRESS, address)
  },

  userSsv4LogIn: ({commit, state}, userData) => {
    commit(types.SSV4_USER_DATA, userData)
  },

  updateRegdata: ({commit, state}, address) => {
    commit(types.NEW_USER_DATA, address)
  },
  updateShipping: ({commit, state}, shipId) => {
    commit(types.SHIPPING_ID, shipId)
  },

// BASKET
  removeItemFromBasket: ({commit, dispatch}, itemID) => {
    commit(types.REQUEST_START)

    return dispatch('checkSession').then(() =>
      http.post(config.basket.itemDelete, {'ordered_item_number': itemID}, {
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(result => {
          commit(types.BASKET_LOADED, result.data)
        })
        .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END)))
  },
  clearBasket: ({commit, dispatch}) => {
    commit(types.REQUEST_START)

    return dispatch('checkSession').then(() =>
      http.post(config.basket.clear, {}, {
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(() => {
          commit(types.CLEAR_BASKET)
        })
        .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END)))
  },
  addToSave: ({commit, state, dispatch}, itemID) => {
    commit(types.REQUEST_START)

    Vue.http.post(state.apiHost + config.prefix + config.basket.addToSave, {'ordered_item_number': itemID})
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(data => {
        commit(types.SET_SAVE_FOR_LATER, data.body)
      })
      .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END))
  },
  delFromSave: ({commit, state, dispatch}, itemID) => {
    commit(types.REQUEST_START)

    Vue.http.post(state.apiHost + config.prefix + config.basket.delFromSave, {'ordered_item_number': itemID})
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(data => {
        commit(types.DEL_SAVE_FOR_LATER, data.body)
      })
      .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END))
  },
  switchWishlist: ({commit, state}, itemData) => {
    return http.post(state.apiHost + config.prefix + config.wishlist.switchWishlist, {params: itemData})
      .then(data => {
        commit(types.SWITCH_WISHLIST, data.data)
      })
      .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END))
  },
  loadItemsWishlist: ({commit, state}, silence = false) => {
    commit(types.REQUEST_START)

    return http.get(state.apiHost + config.prefix + config.wishlist.itemReadylist)
      .then(result => {
        commit(types.WISHLIST_LOADED, result.data)
        commit(types.REQUEST_END)
      })
      .catch(() => {
        commit(types.REQUEST_END)
      })
  },
  cleanWishlist: ({commit, state}, silence = false) => {
    commit(types.REQUEST_START)

    return http.delete(state.apiHost + config.prefix + config.wishlist.cleanWishlist, {})
      .then(data => {
        commit(types.CLEAN_WISHLIST)
      })
      .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END))
  },
  setActiveWishlist: ({commit, state}, itemData) => {
    commit(types.ACTIVE_WL, itemData)
  },
  setQtyItem: ({commit, dispatch}, item) => {
    commit(types.REQUEST_START)

    return dispatch('checkSession').then(() =>
      http.post(config.basket.changeQuantity, item, {
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(result => {
          commit(types.BASKET_LOADED, result.data)
          commit(types.REQUEST_END)
        })
        .catch(() => commit(types.REQUEST_END)))
  },
  putAdditionalPrice: ({commit, state}, addPrice) => {
    commit(types.ADD_ADDITIONAL_PRICE, addPrice)
  },
  // end BASKET

  // CURRENCIES
  loadAllCurrencies: ({commit, state, dispatch}) => {
    const {integrationHost, apiHost, currency} = state

    commit(types.REQUEST_START)
    commit(types.REQUEST_CURRENCY_START)
    let url = new URL(window.location.href)
    let sspay = url.searchParams.get('sspay')
    http.get((sspay === 'true' ? integrationHost : apiHost) + (sspay === 'true' ? config.integrationPrefix : config.prefix) + config.currencies.allCurrencies + (sspay === 'true' ? '/' : ''), {
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(result => commit(types.LOAD_CURRENCIES, {
        currencies: result.data,
        selected: currency.selected
      }), (err) => console.log('err::', err))
      .then(() => {
        commit(types.REQUEST_END)
        commit(types.REQUEST_CURRENCY_FINISHED)
      }, () => {
        commit(types.REQUEST_END)
        commit(types.REQUEST_CURRENCY_FINISHED)
      })
  },
  loadGeoIp: ({commit}) => {
    commit(types.GEO_IP_REQUEST, true)
    commit(types.REQUEST_START)

    http.get(config.countries.ip, {
      withCredentials: true
    })
      .then(result => {
        commit(types.SET_GEO_IP_INFO, result.data)
        commit(types.REQUEST_END)
        commit(types.GEO_IP_REQUEST, false)
      })
      .catch(() => {
        commit(types.REQUEST_END)
        commit(types.GEO_IP_REQUEST, false)
      })
  },
  loadCountries: ({commit}) => {
    commit(types.COUNTRY_LOAD_START)
    commit(types.REQUEST_START)

    http.get(config.countries.get, {
      withCredentials: true
    })
      .then(result => {
        commit(types.SET_COUNTRIES, result.data.items)
        commit(types.REQUEST_END)
        commit(types.COUNTRY_LOAD_END)
      })
      .catch(() => {
        commit(types.REQUEST_END)
        commit(types.COUNTRY_LOAD_END)
      })
  },
  setCurrency: ({commit, dispatch}, id) => {
    commit(types.REQUEST_START)
    commit(types.REQUEST_CURRENCY_START)

    return dispatch('checkSession').then(() =>
      http.post(config.basket.setCurrency, {id}, {
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(res => {
          commit(types.BASKET_LOADED, res.data)
          commit(types.CHANGE_CURRENCY, id)
          commit(types.REQUEST_END)
          commit(types.REQUEST_CURRENCY_FINISHED)
        })
        .catch(() => {
          commit(types.REQUEST_END)
          commit(types.REQUEST_CURRENCY_FINISHED)
        }))
  },
// end CURRRENCIES

  checkUser: ({commit, dispatch}) => {
    commit(types.REQUEST_START)
    let url = new URL(window.location.href)
    let sspay = url.searchParams.get('sspay')
    return http.get((sspay ? (config.integrationHost + config.integrationPrefix + config.users.loginSsv4 + '/') : config.users.login), {
      'params': {
        'checkStatus': true
      },
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(result => {
        commit(types.USER_SIGNED, {data: result.data})
        commit(types.REQUEST_END)
      })
      .catch((res) => {
        commit(types.REQUEST_END)
        return res
      })
  },

  checkSession: ({dispatch, commit, state}) => {
    let url = new URL(window.location.href)
    let sspay = url.searchParams.get('sspay')

    function getUserPromise () {
      return http.get((sspay ? (config.integrationHost + config.integrationPrefix + config.users.loginSsv4 + '/') : config.users.login), {
        'params': {
          'checkStatus': true
        },
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
    }

    function getBasketPromise () {
      const {currency} = state
      let currencyId = localStorage.getItem('currency') ? localStorage.getItem('currency') : currency.selected

      return http.get(config.orders.myBasket, {
        params: {
          currency_id: currencyId
        },
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(result => {
          const {basket = {}} = state
          if (basket.number !== result.data.number) {
            commit(types.BASKET_LOADED, result.data)
            commit(types.CHANGE_CURRENCY, result.data.order.currency_id)
          }
        })
    }

    return getUserPromise()
      .catch(() => {
        const {user = {}} = state
        if (user.user_number) {
          return dispatch('onLogout')
        }
      })
      .then(() => getBasketPromise(), () => getBasketPromise())
  },

  getBasket: ({dispatch, state, commit}, silence = false) => {
    commit(types.REQUEST_BASKET_START)
    commit(types.REQUEST_START)

    const {currency} = state
    let currencyId = localStorage.getItem('currency') ? localStorage.getItem('currency') : currency.selected

    return http.get(config.orders.myBasket, {
      params: {
        currency_id: currencyId
      },
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(result => {
        commit(types.BASKET_LOADED, result.data)
        commit(types.CHANGE_CURRENCY, result.data.order.currency_id)
        commit(types.REQUEST_BASKET_FINISHED)
        commit(types.REQUEST_END)
      })
      .catch(() => {
        commit(types.REQUEST_BASKET_FINISHED)
        commit(types.REQUEST_END)
      })
  },

  addItemToBasket: ({commit, dispatch}, item) => {
    commit(types.REQUEST_START)

    return dispatch('checkSession').then(() =>
      http.post(config.basket.add, item, {
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(result => {
          commit(types.BASKET_LOADED, result.data)
          commit(types.REQUEST_END)
        })
        .catch(() => commit(types.REQUEST_END)))
  },

  createNewUser: ({commit, dispatch}, {data, router}) => {
    commit(types.REQUEST_START)

    return http.post(config.users.get, data, {
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(result => {
        commit(types.CHANGE_FORM_DATA_MULTI, {
          data: {
            email: result.data.email,
            account: 1,
            password: result.data.password,
            home: true
          },
          formName: 'login'
        })

        commit(types.REQUEST_END)
        return dispatch('onSubmitLogin', router)
      })
      .catch(err => {
        commit(types.FORM_ERROR, {msg: err.response.data, formName: 'login'})
        commit(types.REQUEST_END)
      })
  },

  onSubmitPromoCode: ({commit, dispatch, state}, promoCode) => {
    const formName = 'basket'
    commit(types.REQUEST_START)

    return dispatch('checkSession').then(() =>
      http.post(config.orders.promoCode, {
        promoCode
      }, {
        withCredentials: true
      })
        .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
        .then(result => {
          commit(types.BASKET_LOADED, result.data)
          commit(types.FORM_SUCCESS, {msg: 'Promo Code Applied', formName})
        }, (err) => commit(types.FORM_ERROR, {msg: err.data.message, formName}))
        .then(() => commit(types.REQUEST_END), () => commit(types.REQUEST_END)))
  },

  onLogout: ({commit, state, dispatch}, $router) => {
    commit(types.REQUEST_START)

    return http.post(config.users.logout, {
      '_csrf': state.csrf
    }, {
      withCredentials: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(() => {
        commit(types.USER_SIGNOUT, $router)
        commit(types.REQUEST_END)
        return dispatch('getBasket')
      })
      .catch(() => {
        commit(types.USER_SIGNOUT, $router)
        commit(types.REQUEST_END)
        return dispatch('getBasket')
      })
  },

  loadMenus: ({commit, state, dispatch}) => {
    http.get(config.menu.getMenus, {}, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(response => response.data)
      .then((data) => {
        commit(types.LOAD_MENUS, data.items)
      })
  },
  loadMobileMenu: ({commit, state, dispatch}) => {
    http.get(config.menu.getMenus, {params: {desktop: 0}}, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(response => response.data)
      .then((data) => {
        commit(types.LOAD_MOBILE_MENU, data.items)
      })
  },
  setRedirects: ({commit}, redirects) => {
    commit(types.SET_REDIRECTS, redirects)
  },
  getMenuDescription: ({commit, dispatch}, [menuData, router]) => {
    return http.post(config.routes.search, menuData, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(response => response.data)
      .then(json => {
        let breadcrumbs = [{title: 'HOME', path: '/'}]

        if (json.page && json.page.translations && json.page.translations['en'] && json.page.translations['en'].breadcrumb && json.page.translations['en'].breadcrumb.length > 0) {
          breadcrumbs = breadcrumbs.concat([{
            title: json.page.translations['en'].breadcrumb,
            path: '#'
          }])
        } else {
          if (json.category && json.category.category_name) {
            breadcrumbs = breadcrumbs.concat({
              title: json.category.category_name,
              path: '#'
            })
          }
          breadcrumbs.concat([{
            title: (router.props && router.props.default && router.props.default.breadcrumb ? router.props.default.breadcrumb : router.name),
            path: router.path
          }])
        }

        if (router.props && router.props.default && router.props.default.breadcrumb) {
          if (breadcrumbs.length > 1) {
            breadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1)
          }
          breadcrumbs.push({title: router.props.default.breadcrumb, path: router.path})
        }
        commit(types.SET_BREADCRUMBS, breadcrumbs)
        commit(types.SET_PAGE_DESCRIPTION, json)
      }).then(() => dispatch('setRouteCategoryUrl'))
  },

  addBreadcrumb: ({commit}, breadcrumb) => {
    commit(types.ADD_BREADCRUMB, breadcrumb)
  },

  setBreadcrumbs: ({commit}, breadcrumb) => {
    commit(types.SET_BREADCRUMBS, breadcrumb)
  },

  changeFormData: ({commit}, {data, formName}) => {
    commit(types.CHANGE_FORM_DATA_MULTI, {data, formName})
  },

  changeFormError: ({commit}, {data, formName}) => {
    commit(types.CHANGE_FORM_ERROR, {data, formName})
  },

  fetchOrders: ({commit}, {user, time}) => {
    commit(types.REQUEST_START)
    commit(types.ORDER_LOADING, true)
    return http.get(config.orders.get, {
      params: {
        profile_number: user.profile.profile_number,
        created_at: {
          comparator: '>',
          value: time
        }
      },
      headers: {
        'Authorization': 'Basic ' + btoa(user.hashedPassword + ':')
      },
      withCredentials: true
    })
      .then(result => {
        commit(types.FETCH_ORDERS, result.data.items)
        commit(types.REQUEST_END)
        commit(types.ORDER_LOADING, false)
      })
      .catch(() => {
        commit(types.REQUEST_END)
        commit(types.ORDER_LOADING, false)
      })
  },

  deleteOrder: ({commit}, {id, user}) => {
    commit(types.REQUEST_START)
    commit(types.ORDER_LOADING, true)
    return http.delete(config.orders.get + '/' + id, {
      headers: {
        'Authorization': 'Basic ' + btoa(user.hashedPassword + ':')
      },
      withCredentials: true
    })
      .then(result => {
        commit(types.REQUEST_END)
        commit(types.ORDER_LOADING, false)
        return result.body
      })
      .catch(() => {
        commit(types.REQUEST_END)
        commit(types.ORDER_LOADING, false)
      })
  },

  setRouterBack: ({commit}, {path, params}) => {
    commit(types.SET_ROUTER_BACK, {path, params})
  },

  loadDesigners: ({commit}, lang) => {
    http.get(config.designers.allDesigners, {params: {lang: lang}}, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true
    }).then(response => response.data)
      .then(json => {
        commit(types.LOAD_DESIGNERS, json)
      })
  },

  loadCategories: ({commit}, lang) => {
    http.get(config.categories.allCategories, {params: {lang: lang}}, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true
    }).then(response => response.data)
      .then(json => {
        commit(types.LOAD_CATEGORIES, json)
      })
  },

  // Sidebar
  openSidebar: () => {
    $('#pageWrapper').addClass('sidebar-open')
  },
  closeSidebar: () => {
    $('#pageWrapper').removeClass('sidebar-open')
  },

  [auth.AUTH_ACTION_SUCCESS]: ({commit}, xhrResponse) => {
    const raw = xhrResponse.headers.map || xhrResponse.headers
    let headers = {}
    Object.keys(raw).map(key => (headers[key.toLowerCase()] = (raw[key] instanceof Array && raw[key][0]) || raw[key]))
    commit(types.SET_AUTHORIZATION, headers[auth.AUTH_HEADER])
    return xhrResponse
  },
  [auth.AUTH_ACTION_ERROR]: ({commit}, xhrErr) => {
    const raw = (xhrErr.headers && xhrErr.headers.map) || xhrErr.response.headers
    let headers = {}
    Object.keys(raw).map(key => (headers[key.toLowerCase()] = (raw[key] instanceof Array && raw[key][0]) || raw[key]))
    commit(types.SET_AUTHORIZATION, headers[auth.AUTH_HEADER])
    throw xhrErr
  },

  setPromiseData: ({commit}, data) => {
    commit(types.LOAD_PROMISE_DATA, data)
  },

  clearPromiseData: ({commit}) => {
    commit(types.CLEAR_PROMISE_DATA)
  },

  loadBrandsList: ({commit}) => {
    console.log('loadBrandsList')
    return http.get(config.designers.allDesignersByLetter, {}, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true,
      credentials: true
    }).then(data => {
      commit(types.LOAD_PROMISE_DATA, {
        brands: data.data
      })
    }, (err) => console.log('err::', err))
  },

  setRouteCategoryUrl: ({state, commit}) => {
    let category = null
    let routerObj = state.pageMenuDescription
    if (routerObj.catalogue && routerObj.catalogue.main_category && routerObj.catalogue.main_category.category_number) {
      category = routerObj.catalogue.main_category.category_number
    }

    if (routerObj.category && routerObj.category.category_number) {
      category = routerObj.category.category_number
    }
    if (category) {
      return http.get(config.routes.findByCategory + '/' + category).then(response => response.data)
        .then(json => {
          if (json.url) {
            routerObj.categoryPath = '/' + json.url
            commit(types.SET_PAGE_DESCRIPTION, routerObj)
          }
        })
    }
  },

  loadCatalogue: ({commit, state, dispatch}, body, append) => {
    let promiseData = state.promiseData
    return http.post(config.products.searchProducts, body, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      emulateJSON: true
    })
      .then(r => dispatch(auth.AUTH_ACTION_SUCCESS, r), e => dispatch(auth.AUTH_ACTION_ERROR, e))
      .then(response => response.data)
      .then(json => {
        if (json.filters) {
          json.filters.map(key => {
            if (Object.keys(promiseData.catalogue.filters).indexOf(key) === -1) {
              promiseData.$set(promiseData.catalogue.filters, key, [])
            }
          })
        }
        if (json.categories) {
          promiseData.catalogue.filtersList = json.categories
        }

        if (json.items) {
          if (append) {
            promiseData.catalogue.items.data = promiseData.catalogue.items.data.concat(json.items.items)
          } else {
            promiseData.catalogue.items.data = json.items.items
          }
          promiseData.catalogue.items.total = json.items.total
          if (json.items.aggregate) {
            let aggregate = json.items.aggregate
            promiseData.catalogue.items.priceFrom = aggregate.min_price >= 0 ? aggregate.min_price : ''
            promiseData.catalogue.items.priceTo = aggregate.max_price >= 0 ? aggregate.max_price : ''

            promiseData.catalogue.items.armFrom = aggregate.min_arm >= 0 ? parseInt(aggregate.min_arm) : ''
            promiseData.catalogue.items.armTo = aggregate.max_arm >= 0 ? parseInt(aggregate.max_arm) : ''

            promiseData.catalogue.items.bridgeFrom = aggregate.min_bridge >= 0 ? parseInt(aggregate.min_bridge) : ''
            promiseData.catalogue.items.bridgeTo = aggregate.max_bridge >= 0 ? parseInt(aggregate.max_bridge) : ''

            promiseData.catalogue.items.lensFrom = aggregate.min_lens >= 0 ? parseInt(aggregate.min_lens) : ''
            promiseData.catalogue.items.lensTo = aggregate.max_lens >= 0 ? parseInt(aggregate.max_lens) : ''
          }
        }
        commit(types.LOAD_PROMISE_DATA, promiseData)
      })
  }
}
