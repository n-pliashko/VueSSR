import { mapState } from 'vuex'
import Vue from 'vue'
import VueRes from 'vue-resource'
// import Slick from 'vue-slick'
import PageHeader from '@/components/scripts/PageHeader/index.vue'
import PrintPage from '@/components/scripts/Checkout/PrintPage/index.vue'
import Step from '@/components/scripts/Step/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
import config from '@/../config'

Vue.use(VueRes)

export default {
  name: 'thank',
  data () {
    return {
      msg: 'Thank you page',
      confirmPassword: '',
      newPassword: '',
      disableButton: false,
      order: {},
      messageError: '',
      messageInfo: '',
      printPage: false
    }
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      regData: (state) => state.regData,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange
    })
  },
  components: {
  //  Slick,
    PageHeader,
    Step,
    TrustpilotWidget,
    PageFooter,
    ScrollToTop,
    PrintPage
  },
  methods: {
    fetchOrder: function (orderId) {
      console.log('OrderId: ', orderId)
      const orderData = Vue.resource(this.apiHost + config.prefix + config.checkout.fetchOrderUrl)
      orderData.get({
        'order_id': orderId
      }).then((resp) => (this.order = resp.data), (err) => (console.log(err)))
    },
    fetchCountry: function (orderId) {
      const countryData = Vue.resource((this.$route.query.sspay ? this.integrationHost : this.apiHost) + config.prefix + config.checkout.getCountryListUrl + (this.$route.query.sspay ? '/' : ''))
      countryData.get({}).then((resp) => (this.countryList = resp.data), (err) => (console.log(err)))
    },
    send_post: function (module, data) {
      return Vue.http.post(this.apiHost + config.prefix + module, data, this.requestOptions)
    },
    send_get: function (module, data) {
      return Vue.http.get(this.apiHost + config.prefix + module, data)
    },
    getProfileCred: function (userNumber) {
      userNumber = userNumber || false
      let $obj = {
        title: this.order.profile.title,
        first_name: this.order.profile.first_name,
        last_name: this.order.profile.last_name,
        subscribed: 1,
        phone: this.order.profile.phone,
        email: this.order.profile.email,
        currency_id: this.currency.number
      }
      if (userNumber) {
        $obj['user_number'] = userNumber
      }
      return $obj
    },
    getNewUserCred: function () {
      return {
        password: this.newPassword,
        email: this.order.profile.email,
        profile: this.getProfileCred()
      }
    },
    createUser: function () {
      if (this.newPassword === '' || this.confirmPassword === '') {
        this.messageError = 'Please enter password for save'
        return
      }
      if (this.newPassword !== this.confirmPassword) {
        this.messageError = 'Password mismatch'
        return
      }
      var self = this
      this.send_post('/users', this.getNewUserCred())
        .then((resp) => {
          self.disableButton = true
          self.messageInfo = 'Success registration'
          self.messageError = ''
          return self.send_get('/checkout/checkout/set-order-user', {
            params: {
              order_id: self.order.order_number,
              profile_id: resp.data.profile.profile_number,
              user_id: resp.data.user_number
            }
          })
        }, (err) => {
          self.messageError = err.data[0].message
        })
    },
    print: function () {
      let printContents = document.getElementById('printableArea').innerHTML
      let originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
    }
  },
  mounted: function () {
    this.$store.dispatch('clearBasket')
  },
  created: function () {
    this.fetchCountry()
    this.fetchOrder(this.$route.params.order_id)
  }
}
