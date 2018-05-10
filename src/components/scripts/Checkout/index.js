import { mapState } from 'vuex'
import $ from 'jquery'
import Vue from 'vue'
import VueRes from 'vue-resource'
// import Slick from 'vue-slick'
// import CheckoutRates from '@/components/scripts/Checkout/CheckoutRates/index.vue'
import PageHeader from '@/components/scripts/PageHeader/index.vue'
import Step from '@/components/scripts/Step/index.vue'
import CheckoutLogin from '@/components/scripts/Checkout/CheckoutLogin/index.vue'
import CheckoutAddressZip from '@/components/scripts/Checkout/CheckoutAddressZip/index.vue'
import CheckoutDelivery from '@/components/scripts/Checkout/CheckoutDelivery/index.vue'
import CheckoutCart from '@/components/scripts/Checkout/CheckoutCart/index.vue'
import CheckoutCartMobile from '@/components/scripts/Checkout/CheckoutCartMobile/index.vue'
import CheckoutItemDetails from '@/components/scripts/Checkout/CheckoutItemDetails/index.vue'
import PaymentFrame from '@/components/scripts/PaymentFrame/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
import config from '@/../config'
import axios from 'axios'

Vue.use(VueRes)

export default {
  name: 'Checkout',
  components: {
    // Slick,
    PageHeader,
    Step,
    CheckoutLogin,
    CheckoutAddressZip,
    CheckoutDelivery,
    PaymentFrame,
    TrustpilotWidget,
    PageFooter,
    ScrollToTop,
    CheckoutCart,
    CheckoutCartMobile,
    CheckoutItemDetails
  },
  data () {
    return {
      errors: {
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        reg_country: true,
        password: null
      },
      stepArrow: {
        stepArrowUp1: true,
        stepArrow2: false,
        stepArrow3: false,
        stepArrow4: false
      },
      disabledNextButton: false,
      msg: 'M169EA',
      order: {
        reg_country: 'GB',
        reg_country_id: 223
      },
      regdata: {},
      step: 0,
      show_delivery: true,
      postcode: [],
      activePostCodeId: 'nan',
      activeShippingId: null,
      activePaymentId: null,
      countryList: [],
      deliveryMethods: [],
      currencies: null,
      paymentSystems: [],
      showDeliveryForm: 1,
      showRegistration: false,
      showOrderUrl: '',
      disableFields: false,
      allowGetPaymentUrl: false,
      selectedCountryName: null,
      showLoader: false,
      loggedInFromSsv4: false,
      canLoadFromProfile: false,
      checkEmailStatus: false,
      userLoggedIn: false,
      disableCreateProfile: false,
      orderLoaded: false,
      errorInAddress: '',
      ssv4: {
        user: null,
        profile: null
      },
      lockers: {
        canDoStep2: true,
        showMiniCart: true,
        ssv4login: true
      },
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true,
        withCredentials: true
      },
      temp: {
        billingAddress: {}
      },
      inProgress: 'in-progress',
      finished: 'finished',
      showPassword: 'Show',
      showAdditionalInfo: false,
      showCartMobile: false,
      showCartDesktop: false,
      debugMode: false,
      sspayMode: false,
      moreInfo: null
    }
  },
  computed: {
    ...mapState({
      basket: (state) => ({...state.basket}),
      apiHost: (state) => state.apiHost,
      loading: (state) => state.loading,
      geoInfo: (state) => state.geoInfo,
      currencyLoading: (state) => state.currencyLoading,
      integrationHost: (state) => state.integrationHost,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      user: (state) => ({
        ...state.user
      }),
      meta: (state) => ({
        ...state.formMeta['popupLogin']
      }),
      data (state) {
        const {formData: {popupLogin: {...data} = {}}} = state
        this.email = data.email
        this.password = data.password

        return data
      }
    }),
    httpClient: function () {
      return axios.create({
        // baseURL: config.apiHost + config.prefix
      })
    }
  },
  methods: {
    setMoreInfoData: function (data) {
      this.moreInfo = data
    },
    getPrice: function (price) {
      return parseFloat(this.exchange(parseFloat(price))).toFixed(2)
    },
    getSubtPrice: function (a, b, calcCurr) {
      calcCurr = calcCurr || false
      a = a || 0
      b = b || 0
      let prec = 100
      a = parseFloat(a) * prec
      b = parseFloat(b) * prec
      let currA = null
      let currB = null
      if (calcCurr) {
        currA = a == 0 ? 0 : parseInt(this.exchange(a))
        currB = b == 0 ? 0 : parseInt(this.exchange(b))
      } else {
        currA = parseInt(a)
        currB = parseInt(b)
      }
      return (currA - currB) / prec
    },
    getAddPrice: function (a, b, calcCurr) {
      if (isNaN(a) || isNaN(b)) {
        return 0
      }
      let newFloatA = parseFloat(this.exchange(a).replace(/\./g, ''))
      let newFloatB = parseFloat(this.exchange(b).replace(/\./g, ''))
      let prec = 100
      // calcCurr = calcCurr || false
      // a = a || 0
      // b = b || 0
      // a = parseFloat(a) * prec
      // b = parseFloat(b) * prec
      // let currA = null
      // let currB = null
      // if (calcCurr) {
      //   currA = a == 0 ? 0 : parseInt(this.exchange(a))
      //   currB = b == 0 ? 0 : parseInt(this.exchange(b))
      // } else {
      //   currA = parseInt(a)
      //   currB = parseInt(b)
      // }
      // return (currA + currB) / prec
      return ((newFloatA + newFloatB) / prec).toFixed(2)
    },
    showLoginBlock: function () {
      if (Object.keys(this.user).length === 0 && this.sspayMode) {
        return (!this.user.user_number || this.user.user_number === 3)
      } else if (Object.keys(this.user).length === 0) {
        return (!this.user.user_number || this.user.user_number === 1) && (this.order.profile_id == null || this.order.profile_id === undefined)
      }
      return false
    },
    showRegistrationBlock: function () {
      if (Object.keys(this.user).length === 0 && this.sspayMode) {
        return (!this.user.user_number || this.user.user_number === 3)
      } else if (Object.keys(this.user).length === 0) {
        return (!this.user.user_number || this.user.user_number === 1) && (this.order.profile_id == null || this.order.profile_id === undefined)
      }
      return false
    },
    searchCountryById: function (id) {
      for (let k in this.countryList) {
        if (parseInt(this.countryList[k]['number']) === parseInt(id)) {
          return this.countryList[k]
        }
      }
      return null
    },
    onSubmitForm: function () {
      if (this.regdata.password !== '' && this.regdata.password !== undefined) {
        this.order.user = {}
        this.order.user.password = this.regdata
        this.order.user.email = this.order.profile.email
      }
      this.$store.dispatch('updateRegdata', this.order)

      Vue.http.post(this.apiHost + config.prefix + config.checkout.setOrder + (this.$route.query.sspay ? '-sspay' : ''), this.$store.state.regData, this.requestOptions).then((resp) => (this.submitFormResponseParce(resp.data)), (err) => (console.log(err)))
    },
    submitFormResponseParce: function (resp) {
      // this.showLoader = true
      if (resp.status) {
        this.next_tick(4)
        if (this.order.user.password) {
          this.$store.dispatch('changeFormData', {
            'data': {'email': this.order.user.email, 'password': this.order.user.password.password},
            'formName': 'popupLogin'
          })
          this.$store.dispatch('onSubmitPopupLogin', this.$router)
        }
      } else {
        alert(resp.error)
      }
      // this.showLoader = false
    },
    fetchOrder: function (orderId, woShippingCost) {
      this.showMiniCart = false
      let url = config.checkout.fetchOrderUrl
      this.send_get(url, {
        params: {
          'order_id': orderId
        }
      }, this.sspayMode ? this.integrationHost : false)
        .then((resp) => {
          if (resp.data === null) {
            console.clear()
            console.groupCollapsed('%c ------------------------ Module Error ------------------------', 'background: red; color: #bada55')
            console.log('%c Error:', 'background: red; color: #bada55', 'compleate:', resp.ok, 'status:', resp.status, 'body: %o', resp.bodyText)
            console.groupEnd()
            this.showLoader = false
            return
          }
          // this.debugLog('Modue', [this.$route.query.sspay])
          this.parceOrder(resp.data, woShippingCost)
        }, (err) => (console.log(err)))
    },
    debugLog: function (module, vars) {
      if (this.debugMode) {
        console.groupCollapsed('%c Debug: --------------------------------' + module + '-------------------------------- ', 'background: yellow; color: black')
        for (let el in vars) {
          console.log(el, '=', '"', vars[el], '"', '(Type:', typeof vars[el], ')')
        }
        console.log('%c --------------------------------------------------------------------------------------------', 'background: yellow; color: black')
        console.groupEnd()
      }
    },
    debugLogv: function (module, vars) {
      if (this.debugMode) {
        console.groupCollapsed('%c Debug: --------------------------------' + module + '-------------------------------- ', 'background: yellow; color: black')
        // console.log(eval.apply(eval, vars))
        for (let el in vars) {
          let modules = vars[el].split('.')
          let currMod = ''
          for (let mod in modules) {
            currMod = currMod + modules[mod] + '.'
            if (currMod.indexOf('(') !== -1 && currMod.indexOf(')') === -1) {
              continue
            }
            try {
              if (eval(currMod.substring(0, currMod.length - 1)) === undefined || eval(currMod.substring(0, currMod.length - 1)) === null) {
                break
              }
            } catch (e) {
              console.log(variable, '=', '"', e.name)
            }
          }
          let variable = currMod.substring(0, currMod.length - 1)
          console.log(variable, '=', '"', eval(variable), '(Type:', typeof eval(variable), ')')
        }
        console.log('%c --------------------------------------------------------------------------------------------', 'background: yellow; color: black')
        console.groupEnd()
      }
    },
    getAddressFromProfileSspay: function () {
      this.debugLogv('getAddressFromProfileSspay', ['this.order.billingAddress.line1', 'this.user.profile.addresses', 'this.chkEmpty(this.user) && this.chkEmpty(this.user)'])

      if (this.sspayMode && !this.chkEmpty(this.user) && this.user.profile.addresses && !this.chkEmpty(this.order) && (this.order.billingAddress === null || this.chkEmpty(this.order.billingAddress.line1))) {
        for (let addr in this.user.profile.addresses) {
          if (this.user.profile.addresses[addr]['address_type'] == 'billing') {
            this.order.billingAddress = this.user.profile.addresses[addr]
            this.order.billingAddress['profile_id'] = this.user.profile.profile_number
          } else if (this.user.profile.addresses[addr]['address_type'] == 'delivery') {
            this.order.deliveryAddress = this.user.profile.addresses[addr]
            this.order.deliveryAddress['profile_id'] = this.user.profile.profile_number
          }
        }
      }
      this.debugLogv('getAddressFromProfileSspay', ['this.order.billingAddress', 'this.order.deliveryAddress'])
    },
    addressParser: function () {
      let profileDeliveryAddress = {}
      let profileBillingAddress = {}
      for (let addr in this.order.profile[this.$route.query.sspay ? 'address' : 'addresses']) {
        if (this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]['address_type'] === 'billing') {
          profileBillingAddress = this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]
        } else if (this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]['address_type'] === 'delivery') {
          profileDeliveryAddress = this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]
        }
      }
      if (!this.order.deliveryAddress || ((this.order.deliveryAddress.line1 === null || this.order.deliveryAddress.line1 === undefined) && (this.order.deliveryAddress.zip === null || this.order.deliveryAddress.zip === undefined))) {
        this.order.deliveryAddress = profileDeliveryAddress
      }
      if (!this.order.billingAddress || ((this.order.billingAddress.line1 === null || this.order.billingAddress.line1 === undefined) && (this.order.billingAddress.zip === null || this.order.billingAddress.zip === undefined))) {
        this.order.billingAddress = profileBillingAddress
      }
    },
    addressParserSsv4: function () {
      let profileDeliveryAddress = {}
      let profileBillingAddress = {}
      this.getAddressFromProfileSspay()
      for (let addr in this.order.profile[this.$route.query.sspay ? 'address' : 'addresses']) {
        if (this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]['address_type'] === 'billing') {
          profileBillingAddress = this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]
        } else if (this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]['address_type'] === 'delivery') {
          profileDeliveryAddress = this.order.profile[this.$route.query.sspay ? 'address' : 'addresses'][addr]
        }
      }
      if (!this.order.deliveryAddress || ((this.order.deliveryAddress.line1 === null || this.order.deliveryAddress.line1 === undefined) && (this.order.deliveryAddress.zip === null || this.order.deliveryAddress.zip === undefined))) {
        this.order.deliveryAddress = profileDeliveryAddress
      }
      if (!this.order.billingAddress || ((this.order.billingAddress.line1 === null || this.order.billingAddress.line1 === undefined) && (this.order.billingAddress.zip === null || this.order.billingAddress.zip === undefined))) {
        this.order.billingAddress = profileBillingAddress
      }
    },
    sspayParser: function () {
      this.order.info = ''
      this.errors.email = true
      this.order.order_amount = parseFloat(this.order.order_amount) / parseFloat(this.order.rate)
      this.order.final_total = parseFloat(this.order.order_amount) / parseFloat(this.order.rate)
      this.order.shipping_cost = parseFloat(this.order.shipping_cost) / parseFloat(this.order.rate)
      this.order.two4one = this.order.two4one ? (parseFloat(this.order.two4one) / parseFloat(this.order.rate)) : 0
      // this.order.hash = this.order.code
      this.order.sspayUrl = {
        host: this.integrationHost,
        confirmation_url: this.integrationHost + '/thankyou/ssworldpay/ok/?orderKey=' + this.order.id,
        confirmation_url_check: this.integrationHost + '/thankyou/payment/' + this.order.id + '/',
        decline_url: this.integrationHost + '/thankyou/ssworldpay/fail/?orderKey=' + this.order.id
      }
      this.order.orderItems = this.order.items
      this.addressParserSsv4()
      this.$store.dispatch('setCurrency', this.order.currency_id)
      this.loggedInFromSsv4 = true
      this.order.integrationHost = this.integrationHost
      // this.$store.dispatch('userSsv4LogIn', this.order.profile)
      window.globalEvents.$emit('setUser', this.order.profile)
      // console.log('Profile', this.$store.dispatch('userSsv4LogIn', this.order.profile))
      if (this.chkEmpty(this.order.deliveryAddress) && this.chkEmpty(this.order.deliveryAddress.country_id)) {
        this.order.reg_country = 'GB'
        this.order.reg_country_id = 223
        this.order.deliveryAddress = {
          'address_type': null,
          'country_id': 223,
          'line1': null,
          'line2': '',
          'number': null,
          'profile_id': null,
          'state': null,
          'town': null,
          'zip': null
        }
        this.selectedCountryName = this.searchCountryByCode2(this.order.reg_country)
        this.selectCountry()
      } else {
        this.order.deliveryAddress.country_id = parseInt(this.order.deliveryAddress.country_id)
        this.order.billingAddress.country_id = parseInt(this.order.billingAddress.country_id)
        this.order.reg_country_id = this.order.deliveryAddress.country_id
        this.order.reg_country = this.searchCountryById(this.order.deliveryAddress.country_id)['country_code_2']
        if (this.order.profile.phone === '' && this.order.profile.first_name !== '') {
          this.order.profile.phone = '+0000000000'
        }

        this.debugLog('sspayParser', {'this.order.deliveryAddress.country_id': this.order.deliveryAddress.country_id})

        this.selectCountry()
        // setTimeout(() => {
        //   window.globalEvents.$emit('commitParams')
        //   $('#section-2-collapse').slideDown()
        //   $('#section-1-collapse').slideDown()
        //   // this.next_tick(2)
        // }, 500)
        // window.globalEvents.$emit('commitParams')
        // this.next_tick(2)
      }
      // console.log('User:', this.user.profile)
      if (this.user && this.user.profile) {
        this.order.profile = this.user.profile
      }
      // for (let addr in this.user.profile.addresses) {
      //   if (this.user.profile.addresses[addr].address_type === 'billing') {
      //     this.order.billingAddress = this.user.profile.addresses[addr]
      //   }
      //   console.log(addr)
      //   if (this.user.profile.addresses[addr].address_type === 'delivery') {
      //     this.order.deliveryAddress = this.user.profile.addresses[addr]
      //   }
      // }
      // userSsv4LogIn
    },
    parceOrder: function (order, woShippingCost) {
      woShippingCost = woShippingCost || false
      this.showLoader = false
      if (woShippingCost) {
        let cost = this.order.shipping_cost
        this.order = order
        this.order.shipping_cost = cost
      } else {
        this.order = order
      }

      if (this.sspayMode) {
        this.sspayParser()
      }
      this.showOrderUrl = '/account/view_order/' + order.order_number
      this.order.profile.subscribed = this.order.profile.profile_number ? this.order.profile.subscribed : true
      // this.order.some_billship_addr = this.show_delivery
      if (this.canLoadFromProfile && !this.order.profile.profile_number && !this.chkEmpty(this.user) && this.user.profile.profile_number) {
        this.order.profile = this.user.profile
        this.order.profile_number = this.user.profile.profile_number
        this.addressParser()
      }
      if (this.order.deliveryAddress.country_id !== undefined && this.order.deliveryAddress.country_id != null && !this.loggedInFromSsv4) {
        if (this.order.deliveryAddress.line1 !== '' && this.order.deliveryAddress.line1 !== undefined) {
          this.order.reg_country = this.countryList[this.order.deliveryAddress.country_id]['country_code_2']
          this.order.reg_country_id = this.order.deliveryAddress.country_id
        } else {
          this.order.reg_country = this.geoInfo.countryCode || this.countryList[this.order.deliveryAddress.country_id]['country_code_2']
          this.order.reg_country_id = this.geoInfo.countryCode ? this.searchCountryByCode2(this.geoInfo.countryCode)['number'] : this.order.deliveryAddress.country_id
        }
        if (this.order.billingAddress.line1 !== '' && this.order.billingAddress.line1 !== undefined) {
          this.order.billingAddress.country_id = this.order.billingAddress.country_id
        } else {
          this.order.billingAddress.country_id = this.geoInfo.countryCode ? this.searchCountryByCode2(this.geoInfo.countryCode)['number'] : this.order.billingAddress.country_id
        }

        this.order.deliveryAddress.country_id = this.order.reg_country_id
        this.selectCountry()
        if ((this.order.deliveryAddress.country_id === undefined || this.order.deliveryAddress.country_id === null) && this.order.reg_country === 'GB') {
          this.showDeliveryForm = 2
        }
      }
      if (this.order.profile_number && !this.orderLoaded && !this.chkEmpty(order.profile.first_name) && !this.chkEmpty(order.profile.last_name)) {
        this.orderLoaded = true
        this.disableCreateProfile = true
        this.next_tick(1)
      }
      if (this.order.deliveryAddress.country_id !== '' && this.order.deliveryAddress.country_id !== undefined &&
        this.order.deliveryAddress.line1 !== '' && this.order.deliveryAddress.line1 !== undefined &&
        this.order.deliveryAddress.town !== '' && this.order.deliveryAddress.town !== undefined) {
        setTimeout(() => {
          if (this.step > 0) {
            this.disableCreateProfile = false
            window.globalEvents.$emit('commitParams')
          } else {
            this.disableCreateProfile = false
          }
        }, 1000)
      } else {
        console.log('Enable')
        window.globalEvents.$emit('enableShipping')
        window.globalEvents.$emit('enableFields')
      }
      this.debugLog('parceOrder', {
        'this.order.shipping_cost': this.order.shipping_cost,
        'woShippingCost': woShippingCost,
        'this.order.deliveryAddress': this.order.deliveryAddress,
        'this.order.billingAddress': this.order.billingAddress
      })
    },
    fetchCountry: function (orderId) {
      this.send_get(config.checkout.getCountryListUrl, {'params': {}}, this.sspayMode ? this.integrationHost : false)
        .then((resp) => (this.countryList = resp.data), (err) => (console.log(err)))
        .then(() => this.fetchOrder(this.$route.params.order_id))
    },
    searchCountryByCode2: function (code) {
      for (let k in this.countryList) {
        // console.log('cc', this.countryList[k]['country_name'])
        if (this.countryList[k]['country_code_2'] === code) {
          this.selectedCountryName = this.countryList[k]['country_name']
          return this.countryList[k]
        }
      }
    },
    validatePhoneOnKeyDown (e) {
      return true
      var phoneRegex = /[0-9+ ()]/
      if (!phoneRegex.test(e.key)) {
        e.preventDefault()
      }
      return false
    },
    getShipping: function () {
      this.send_get(config.checkout.getShippingMethodUrl, {
        'params': {
          'country': this.order.reg_country,
          'order_id': this.order.order_number,
          'weight': this.order.weight
        }
      }, this.sspayMode ? this.integrationHost : false)
        .then((resp) => (this.parseDelivery(resp.data)), (err) => (console.log(err)))
    },
    parseDelivery: function (resp) {
      this.deliveryMethods = resp
    },
    chkEmpty: function (param) {
      if (typeof param === 'object') {
        return Object.keys(param).length === 0
      }
      return (param === undefined || param === null || param === '')
    },
    selectDefaultDelivery: function () {
      var price = null
      let debugShippingCost = this.order.shipping_cost
      if (Object.keys(this.deliveryMethods).length === 0) {
        this.activeShippingId = null
        return
      }
      if (this.order.delivery_method_id !== null && this.order.delivery_method_id !== undefined &&
        this.deliveryMethods[this.order.delivery_method_id] !== undefined && this.deliveryMethods[this.order.delivery_method_id]['delivery_method_number'] !== undefined) {
        this.activeShippingId = this.order.delivery_method_id
        this.debugLog('selectDefaultDelivery if state', {
          'this.order.delivery_method_id': this.order.delivery_method_id,
          'this.deliveryMethods[this.order.delivery_method_id] !== undefined': this.deliveryMethods[this.order.delivery_method_id] !== undefined,
          'this.deliveryMethods[this.order.delivery_method_id]["delivery_method_number"] !== undefined': this.deliveryMethods[this.order.delivery_method_id]['delivery_method_number'] !== undefined
        })
        return
      }
      for (var method in this.deliveryMethods) {
        if (!this.deliveryMethods[method] || !this.deliveryMethods[method]['total']) {
          console.log('BREAK')
          continue
        }
        if (price === null) {
          price = parseFloat(this.deliveryMethods[method]['total'])
          this.activeShippingId = method
          this.order.delivery_method_id = method
        } else if (price > this.deliveryMethods[method]['total']) {
          price = parseFloat(this.deliveryMethods[method]['total'])
          this.activeShippingId = method
          this.order.delivery_method_id = method
        }
      }
      this.debugLog('selectDefaultDelivery', {
        'debugShippingCost': debugShippingCost,
        'this.deliveryMethods': this.deliveryMethods,
        'this.activeShippingId': this.activeShippingId,
        'this.order.shipping_cost': price
      })
      this.order.shipping_cost = price
    },
    // getPaymentSystems: function () {
    //   this.send_get(config.checkout.getPaySystemForCountryUrl, {'params': {'country_code': this.order.reg_country}})
    //     .then((resp) => (this.paymentSystems = resp.data), (err) => (console.log(err)))
    // },
    getCurrencies: function () {
      this.send_get(config.checkout.getCurrenciesUrl, {'params': {}}, this.sspayMode ? this.integrationHost : false)
        .then((resp) => (this.currencies = resp.data), (err) => (console.log(err)))
    },
    selectCountry: function (name) {
      this.order.reg_country = this.searchCountryById(this.order.reg_country_id)['country_code_2']
      this.getShipping()
      // this.getPaymentSystems()
      this.showDeliveryForm = 1
      if (this.order.reg_country !== null) {
        this.searchCountryByCode2(this.order.reg_country)
      }

      this.showLoader = true
      this.selectDefaultDelivery()
      let self = this
      if (!this.sspayMode) {
        this.send_get(config.checkout.setOrderUser, {
          params: {
            order_id: self.order.order_number,
            shipping_id: this.order.delivery_method_id
          }
        })
      }
      setTimeout(() => (self.showMiniCart = 1), 4000)
      this.recalculateOrder().then(() => {
        setTimeout(() => {
          this.showLoader = false
        }, 2000)
        self.showMiniCart = true
      })
    },
    recalculateOrder: function () {
      let self = this
      return this.send_get(config.checkout.recalculateOrder, {
        params: {
          id: self.order.order_number,
          country_id: self.order.reg_country_id
        }
      }, this.$route.query.sspay ? this.integrationHost : false).then((resp) => {
        if (this.sspayMode) {
          self.order.final_total = parseFloat(resp.data.order_amount) / parseFloat(resp.data.rate)
        } else {
          self.order.final_total = resp.data.final_total
        }
        this.debugLog('recalculateOrder', {
          'this.sspayMode': this.sspayMode,
          'self.order.final_total': self.order.final_total,
          'resp.data.final_total': resp.data.final_total,
          'this.order.rate': this.order.rate,
          'shipping_cost': this.order.shipping_cost
        })
        self.order.orderItems = resp.data.orderItems
        self.order.lockDelivery = resp.data.lockDelivery
        return resp
      })
    },
    deleteItemSsv4Request: function (index, itemId) {
      let self = this
      this.send_post(config.checkout.deleteItemSsv4Url, {'ordered_item_number': itemId}, this.sspayMode ? this.integrationHost : false)
        .then((resp) => {
          if (this.sspayMode) {
            self.order.final_total = parseFloat(resp.data.order_amount) / parseFloat(resp.data.rate)
          } else {
            self.order.final_total = resp.data.final_total
          }
          this.debugLog('recalculateOrder', {
            'this.sspayMode': this.sspayMode,
            'self.order.final_total': self.order.final_total,
            'resp.data.final_total': resp.data.final_total,
            'this.order.rate': this.order.rate,
            'shipping_cost': this.order.shipping_cost
          })
          self.order.orderItems = resp.data.orderItems
          self.order.lockDelivery = resp.data.lockDelivery
          return resp
        }, (err) => {
          console.log(err.data)
        })
      console.log('delete item=>', index, itemId)
    },
    // changePaymentMethod: function (index) {
    //   this.order.paymentMethodId = this.paymentSystems[index]['payment_system_number']
    //   this.activePaymentId = index
    // },
    setShippingId: function (id) {
      this.activeShippingId = id
      this.order.delivery_method_id = id
    },
    // changeVisibl: function (someBillshipAddr) {
    //   this.show_delivery = someBillshipAddr
    // },
    changePasswordVisibility () {
      let pass = $('#checkoutPassword')
      if (this.showPassword === 'Hide') {
        pass.attr('type', 'password')
        this.showPassword = 'Show'
      } else {
        pass.attr('type', 'text')
        this.showPassword = 'Hide'
      }
    },
    toggleCurrentCollapse: function (section) {
      if ($(window).width() <= '640') {
        console.log('this will toggle the chevron in the header of / and the active tab')
        $('#section-' + section + '-collapse').slideToggle()
        $('#section-' + section + '-expand').find('i').toggleClass('fa-chevron-up fa-chevron-down')
      }
    },
    toggleNextCollapse: function (section) {
      if ($(window).width() <= '640') {
        for (var arrow in this.stepArrow) {
          this.stepArrow[arrow] = false
        }
        // console.log('this will toggle the ' + section + ' and the next tab')
        this.stepArrow['stepArrowUp' + (section + 1)] = true
        $('#section-' + (section) + '-collapse').slideUp()
        $('#section-' + (section + 1) + '-collapse').slideDown()
        if (section === 4 && this.stepArrow['stepArrowUp4'] !== true) {
          $('#section-3-collapse').slideUp()
          $('#section-4-collapse').slideDown()
          this.stepArrow['stepArrowUp4'] = true
        }
      } else {
        // console.log('#section-' + (section + 1) + '-collapse')
        $('#section-' + (section + 1) + '-collapse').slideDown()
        if (section === 4) {
          $('#section-4-collapse').slideDown()
        }

        for (var sect = section + 2; sect < 5; sect++) {
          $('#section-' + (sect) + '-collapse').slideUp()
        }
      }
    },
    send_post: function (module, data, apiHost) {
      apiHost = apiHost || false
      let prefix = apiHost ? config.integrationPrefix : config.prefix
      let host = apiHost ? apiHost : this.apiHost
      this.debugLog('send_post: ' + module, {'host': host, 'module': module, 'data': data})
      return Vue.http.post(host + prefix + module + (apiHost ? '/' : ''), data, this.requestOptions)
    },
    send_get: function (module, data, apiHost) {
      apiHost = apiHost || false
      let prefix = apiHost ? config.integrationPrefix : config.prefix
      let host = apiHost || this.apiHost
      this.debugLog('send_get: ' + module, {'host': host, 'module': module, 'data': data})
      return this.httpClient.get(host + prefix + module + (apiHost ? '/' : ''), {
        ...data,
        withCredentials: true
      })
      // return Vue.http.get(host + prefix + module + (apiHost ? '/' : ''), data)
    },
    getUserData: function () {
      return {
        // newPassword: this.regdata.password,
        password: this.regdata.password,
        email: this.order.profile.email,
        profile: {
          title: this.order.profile.title || 'Mr.',
          first_name: this.order.profile.first_name,
          last_name: this.order.profile.last_name,
          subscribed: this.order.profile.subscribed === true ? 1 : 0,
          phone: this.order.profile.phone,
          email: this.order.profile.email,
          currency_id: this.currency.number
        }
      }
    },
    getProfileCred: function (userNumber) {
      userNumber = userNumber || false
      let $obj = {
        title: this.order.profile.title || 'Mr.',
        first_name: this.order.profile.first_name,
        last_name: this.order.profile.last_name,
        subscribed: this.order.profile.subscribed === true ? 1 : 0,
        phone: this.order.profile.phone,
        email: this.order.profile.email,
        currency_id: this.currency.number
      }
      if (userNumber) {
        $obj['user_number'] = userNumber
      }
      if (this.sspayMode && this.order.user_number) {
        $obj['user_number'] = this.order.user_number
      } else if (this.sspayMode) {
        $obj['user_number'] = 3
      }
      // $obj['addresses'] = []
      if (this.order.deliveryAddress &&
        !this.chkEmpty(this.order.deliveryAddress.line1) &&
        !this.chkEmpty(this.order.deliveryAddress.zip) &&
        !this.chkEmpty(this.order.deliveryAddress.town) &&
        !this.chkEmpty(this.order.deliveryAddress.state)) {
        $obj['addresses'] = [this.order.deliveryAddress]
        // $obj.addresses.push(this.order.deliveryAddress)
      }
      if (this.order.billingAddress &&
        !this.chkEmpty(this.order.billingAddress.line1) &&
        !this.chkEmpty(this.order.billingAddress.zip) &&
        !this.chkEmpty(this.order.billingAddress.town) &&
        !this.chkEmpty(this.order.billingAddress.state)) {
        if ($obj['addresses'] !== undefined) {
          $obj.addresses.push(this.order.billingAddress)
        } else {
          $obj['addresses'] = [this.order.billingAddress]
        }
      } else if (this.order.some_billship_addr &&
        !this.chkEmpty(this.order.deliveryAddress.line1) &&
        !this.chkEmpty(this.order.deliveryAddress.zip) &&
        !this.chkEmpty(this.order.deliveryAddress.town) &&
        !this.chkEmpty(this.order.deliveryAddress.state)) {
        // this.temp.billingAddress = this.order.deliveryAddress
        for (var key in this.order.deliveryAddress) {
          this.temp.billingAddress[key] = this.order.deliveryAddress[key]
        }
        this.temp.billingAddress.address_type = 'billing'
        $obj.addresses.push(this.temp.billingAddress)
      }
      return $obj
    },
    getNewUserCred: function () {
      return {
        // newPassword: this.regdata.password,
        password: this.regdata.password,
        email: this.order.profile.email,
        profile: this.getProfileCred()
      }
    },
    saveAddress: function () {
      this.order.deliveryAddress.address_type = 'delivery'
      this.order.billingAddress.address_type = 'billing'
      return this.send_post(config.checkout.saveAddress, {
        order_id: this.order.order_number,
        delivery_address: this.order.deliveryAddress,
        billing_address: this.order.billingAddress,
        some_address: this.order.some_billship_addr || 0
      }, this.$route.query.sspay ? this.integrationHost : false)
    },
    setOrderUser: function (resp) {
      let self = this
      if (!resp.data.profile_number && !resp.data.profile.profile_number && resp.data.id) {
        resp.data.profile_number = resp.data.id
      }
      this.debugLog('setOrderUser', {
        'self.order.order_number': self.order.order_number,
        'profile_id': resp.data.profile_number !== undefined ? resp.data.profile_number : resp.data.profile.profile_number,
        'user_id': resp.data.user_number || null
      })
      return this.send_get(config.checkout.setOrderUser, {
        params: {
          order_id: self.order.order_number,
          profile_id: resp.data.profile_number !== undefined ? resp.data.profile_number : resp.data.profile.profile_number,
          user_id: resp.data.user_number || null
        }
      }, this.sspayMode ? this.integrationHost : false)
    },
    setOrderUserSspay: function (resp) {
      let self = this
      if (resp.data.id && resp.data.profile_id === undefined) {
        resp.data.profile_number = resp.data.id
      }
      this.debugLog('setOrderUserSspay', {
        'self.order.order_number': self.order.order_number,
        'resp.data.profile_number': resp.data.profile_number,
        'resp.data.profile.profile_number': resp.data.profile !== undefined && resp.data.profile.profile_number !== undefined ? resp.data.profile.profile_number : undefined,
        'profile_id': resp.data.profile_id,
        'user_id': resp.data.user_id || null
      })
      return this.send_get(config.checkout.setOrderUser, {
        params: {
          order_id: self.order.order_number,
          profile_id: resp.data.profile_id !== undefined ? resp.data.profile_id : resp.data.profile_number,
          user_id: resp.data.user_id || resp.data.user_number
        }
      }, this.sspayMode ? this.integrationHost : false)
    },
    authorizationLogin: function (email, password) {
      email = email || false
      password = password || false
      this.$store.dispatch('changeFormData', {
        'data': {
          'email': (email ? email : this.order.profile.email),
          'password': (password ? password : this.regdata.password)
        },
        'formName': 'popupLogin'
      })
      this.$store.dispatch('onSubmitPopupLogin', this.$router)
    },
    transferAddress: function () {
      for (let addr in this.order.deliveryAddress) {
        this.order.billingAddress[addr] = this.order.deliveryAddress[addr]
      }
      this.order.billingAddress['address_type'] = 'billing'
      delete this.order.billingAddress['id']
      delete this.order.billingAddress['number']
    },
    next_tick: function (step, stepBack, skipCreation) {
      // if (this.order.lockDelivery) {
      //   alert('Please remove restricted items from you\'r basket')
      //   return
      // }
      let self = this
      stepBack = stepBack || false
      skipCreation = skipCreation || false

      if (!stepBack && !this.validate()) {
        return false
      }

      if (step === 0) {
        window.globalEvents.$emit('deleteFields')
        this.show_delivery = true
        if (stepBack) {
          this.disableCreateProfile = false
          this.doStep(step)
        }
      }

      if (step === 1) {
        if (stepBack) {
          window.globalEvents.$emit('enableFields')
          this.doStep(step)
          return
        }
        if (!this.user.user_number && !stepBack && !this.disableCreateProfile) {
          this.checkEmail()
            .then((resp) => {
              if (resp.email_exist) {
                return Promise.reject({data: [{message: 'Email already registered.', field: 'email'}]})
              }
              return this.send_post(this.showRegistration ? '/users' : '/profiles', this.showRegistration ? this.getNewUserCred() : this.getProfileCred(1), (this.$route.query.sspay ? this.integrationHost : false))
            })
            .then((resp) => {
              if (self.showRegistration) {
                self.authorizationLogin()
              }
              self.showRegistration = false
              self.errors.email = ''
              this.debugLog('setOrderUser in step:1', {'respRegistration': resp, 'resp_data': resp.data})
              if (this.sspayMode) {
                return self.setOrderUserSspay(resp)
              } else {
                return self.setOrderUser(resp)
              }
            }, (err) => {
              console.log('-->err', err)
              let errorObj = []
              if (err.data) {
                errorObj = err
              } else {
                errorObj.data = err
              }
              return Promise.reject(errorObj)
            })
            .then((resp) => {
              console.log('-->sended')
              if (resp.data.status === true) {
                self.doStep(step)
              } else {
                alert('Unhandled error on set_user STEP: 1. Details in console.')
                console.log('Unhandled error: ', 'response: ', resp.data, 'data: ', {
                  params: {
                    order_id: self.order.order_number,
                    profile_id: resp.data.profile_number !== undefined ? resp.data.profile_number : resp.data.profile.profile_number,
                    user_id: resp.data.user_number || null
                  }
                })
              }
            }, (err) => {
              this.debugLog('step1: error', {'error': err})
              for (let error in err.data) {
                if (err.data[error].field === 'password') {
                  this.errors.password = err.data[error].message
                } else {
                  this.errors[err.data[error].field] = err.data[error].message
                }
              }
            })
        } else if (this.disableCreateProfile) {
          setTimeout(() => (this.doStep(step)), 1000)
        } else {
          this.send_post('/profiles', this.getProfileCred(this.order.user_number), (this.$route.query.sspay ? this.integrationHost : false))
            .then((resp) => {
              this.debugLog('step:1 custom create profile', {'resp': resp, 'resp_data': resp.data})
              this.$store.dispatch('checkUser')
              if (this.sspayMode) {
                this.setOrderUserSspay(resp).then(this.doStep(step))
              } else {
                this.send_get(config.checkout.setOrderUser, {
                  params: {
                    order_id: self.order.order_number,
                    profile_id: resp.data.profile_number
                  }
                }).then(this.doStep(step))
              }
            }, (err) => {
              this.debugLog('Error step1 custom create profile', {'error': err})
            })
        }
      }

      if (step === 2) {
        window.globalEvents.$emit('enableShipping')
        if (!stepBack && this.step !== step && !skipCreation) {
          this.saveAddress()
            .then((resp) => {
              if (resp.data.status) {
                this.doStep(step)
                if (this.order.some_billship_addr) {
                  this.transferAddress()
                }
                this.$store.dispatch('checkUser')
              } else {
                for (let err in resp.data.errors) {
                  self.errorInAddress = resp.data.errors[err][0]
                }
                window.globalEvents.$emit('enableFields')
              }
            }, () => {
              self.errorInAddress = ''
              window.globalEvents.$emit('enableFields')
            })
        } else {
          // setTimeout(() => {
          this.doStep(step)
          // $('#section-2-collapse').slideUp()
          // }, 1000)
        }
      }

      if (step === 4) {
        this.showLoader = true
        if (stepBack) {
          window.globalEvents.$emit('enableShipping')
        }
        return this.send_get(config.checkout.setOrderUser, {
          params: {
            order_id: self.order.order_number,
            shipping_id: this.order.delivery_method_id
          }
        }, (this.$route.query.sspay ? this.integrationHost : false))
          .then((resp) => {
            if (resp.data.status) {
              if (this.$route.query.sspay) {
                this.sendSsv4Order(step)
              } else {
                this.doStep(step)
              }
            } else {
              window.globalEvents.$emit('enableShipping')
              this.showLoader = false
            }
            this.showLoader = false
          }, () => {
            window.globalEvents.$emit('enableShipping')
            this.showLoader = false
          })
      }
    },
    sendSsv4Order: function (step) {
      this.send_post(config.checkout.setOrderUserSsv4, {
        order: this.order
      }).then((resp) => {
        if (resp.data.status) {
          this.doStep(step)
        } else {
          window.globalEvents.$emit('enableShipping')
          this.showLoader = false
        }
      }, (err) => {
        alert('Error. Details in console.')
        console.log('%c Error:', 'background: red; color: #bada55', err.data.errors)
        window.globalEvents.$emit('enableShipping')
        this.showLoader = false
      })
    },
    doStep: function (step) {
      this.disableFields = step
      this.step = step
      this.toggleNextCollapse(step)
    },
    validRegex: function (object, field, validatorRegex, errorMessage) {
      if (!object[field] || object[field] === '' || !validatorRegex.test(object[field])) {
        this.errors[field] = errorMessage
      } else {
        this.errors[field] = null
      }
    },
    validEmpty: function (object, field, errorMessage) {
      if (!object[field] || object[field] === '') {
        this.errors[field] = errorMessage
      } else {
        this.errors[field] = null
      }
    },
    validatePassword: function () {
      if (this.showRegistration && (this.regdata.password === '' || this.regdata.password === undefined)) {
        this.errors.password = 'Password empty'
      } else if (this.showRegistration && this.regdata.password !== '' && this.regdata.password === undefined && this.regdata.password === this.regdata.password_rtp) {
        this.order.user = {}
        this.order.user.password = this.regdata
        this.order.user.email = this.order.profile.email
        this.errors.password = null
      } else {
        this.errors.password = null
      }
    },
    checkEmail: function () {
      var self = this
      return this.send_get('/checkout/checkout/check-email', {'params': {'email': this.order.profile.email}}, this.sspayMode ? this.integrationHost : false)
        .then((resp) => (self.checkEmailStatus = resp.data), (err) => (console.log(err)))
    },
    updateBasket: function () {
      return this.send_get('/checkout/checkout/update-cart', {'params': {'order_id': self.order.order_number}})
    },
    validate: function () {
      var mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      var phoneRegex = /^((?:\+?\d{1,4}\s?)?\(?\d{1,4}\)?\s?\d+\s?\d+)$/
      var credRegex = /^[a-zA-Zа-яА-Я0-9,.'-]{2,}.*$/i
      this.validRegex(this.order.profile, 'email', mailRegex, 'Please enter correct mail address')
      this.validRegex(this.order.profile, 'first_name', credRegex, 'Please enter correct First Name')
      this.validRegex(this.order.profile, 'last_name', credRegex, 'Please enter correct Last Name')
      // this.validEmpty(this.order.profile, 'first_name', 'Please enter First Name')
      // this.validEmpty(this.order.profile, 'last_name', 'Please enter Last Name')
      this.validRegex(this.order.profile, 'phone', phoneRegex, 'Please enter correct phone number')
      this.validEmpty(this.order, 'reg_country', 'Please choose your country')
      this.validatePassword()

      for (var key in this.errors) {
        if (this.errors[key] !== null && !(this.errors[key] instanceof Array)) {
          return false
        }
      }
      return true
    },
    validateButton: function () {
      for (var key in this.errors) {
        if (this.errors[key] !== null && !(this.errors[key] instanceof Array)) {
          console.log(this.errors[key])
          // return this.disabledNextButton = true
        }
      }
      this.disabledNextButton = false
    },
    saveComment: function () {
      this.send_post('/checkout/checkout/save-comment', {
        order_hash: this.order.hash,
        comment: this.order.info
      })
    },
    changeVisiblDelivery: function (status) {
      this.show_delivery = status
      this.order.some_billship_addr = status
    },
    loginAction: function () {
      this.showRegistration = false
      if (this.user.user_number && this.canLoadFromProfile && !this.$route.query.sspay) {
        // $('.modal-backdrop').css('display', 'none')
        this.showLoader = true
        if (this.regdata.password !== '' && this.regdata.password !== undefined && this.showRegistration !== false) {
          this.updateBasket()
        }
        if (this.basket.order && this.basket.order.items.length > 0) {
          this.fetchOrder(this.basket.order.hash, true)
        } else {
          this.fetchOrder(this.$route.params.order_id)
        }

        this.regdata.password = ''
        setTimeout(() => (this.showLoader = false), 2000)
        this.userLoggedIn = false
      } else if (this.user.user_number && this.canLoadFromProfile && this.lockers.ssv4login) {
        this.debugLog('loginAction', {'this.user': this.user})
        this.lockers.ssv4login = false
        this.showLoader = true
        this.canLoadFromProfile = false
        this.regdata.password = ''
        this.fetchOrder(this.$route.params.order_id)
        this.userLoggedIn = false
      }
    }
  },
  created: function () {
    this.debugMode = (this.$route.query.debug === undefined ? false : true)
    this.sspayMode = (this.$route.query.sspay === undefined ? false : true)
    this.showLoader = true
    this.fetchCountry()
    this.getCurrencies()
    // this.fetchOrder(this.$route.params.order_id)
  },
  watch: {
    deliveryMethods () {
      this.selectDefaultDelivery()
    },
    countryList () {
    },
    errors: {
      handler: function (changed) {
        this.validateButton()
      },
      deep: true
    },
    user: {
      handler: function (changed) {
        this.canLoadFromProfile = true
        this.loginAction()
      },
      deep: true
    },
    meta () {
      if (this.meta.formSuccess !== undefined) {
        // $('#checkoutLoginModal').modal('hide')
        $('.modal-backdrop').remove()
        $('body').removeClass('modal-open').css('paddingRight', '0')
        this.userLoggedIn = true
        this.loginAction()
      }
    }
  }
}
