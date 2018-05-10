import { mapState } from 'vuex'
import Vue from 'vue'
import VueRes from 'vue-resource'
import config from '@/../config'
import { iframeResizer } from 'iframe-resizer'

Vue.use(VueRes)

export default {
  name: 'PaymentFrame',
  data () {
    return {
      msg: 'Payments Frame',
      iframeUrl: '',
      canShowFrame: false,
      frameLoaded: false,
      activeMethod: null,
      paymentMethods: {
        WorldPay: '',
        PayPal: ''
      },
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true,
        withCredentials: true
      },
      iframeOptions: {
        log: false,
        checkOrigin: false,
        inPageLinks: true,
        autoResize: true,
        sizeHeight: true,
        resizeFrom: 'child'
      }
    }
  },
  props: [
    'order_hash',
    'sandbox',
    'payment_system_number',
    'allowGetPaymentUrl',
    'deliveryAddress'
  ],
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      integrationHost: (state) => state.integrationHost
    })
  },
  watch: {
    payment_system_number: function () {
      this.getLink()
    },
    sandbox: function () {
      this.getLink()
    },
    activeMethod: {
      handler: function (changed) {
        console.log(this.activeMethod)
      },
      deep: true
    },
    allowGetPaymentUrl () {
      setTimeout(this.getLink, 1000)
    }
  },
  methods: {
    getLink: function () {
      var self = this
      const recalcDelivery = Vue.resource(this.apiHost + config.prefix + config.checkout.getPaymentUrl + (this.$route.query.sspay ? '-sspay' : ''))
      recalcDelivery.get({
        'order_hash': this.order_hash,
        'ps': this.payment_system_number,
        'sb': this.sandbox
      }).then(function (resp) {
        if (resp.data.result) {
          self.iframeUrl = resp.data.url
          self.iframeHidden = resp.data
          self.paymentMethods.WorldPay = resp.data.url
          self.paymentMethods.PayPal = resp.data.url + '&payment_system=paypa'
          if (self.deliveryAddress.country_id == 223) {
            self.paymentMethods['Checque'] = resp.data.url_to_check
          }
          self.frameLoaded = true
        } else {
          console.log(resp.data.error)
          self.frameLoaded = true
        }
      }, (err) => (console.log(err)))
    },
    onChangeMethod: function (meth) {
      this.canShowFrame = false
      this.activeMethod = meth
      if (this.$route.query.sspay) {
        setTimeout(() => {
          Vue.http.post(this.integrationHost + config.integrationPrefix + '/checkout/checkout/change-payment-system/', {
            'order_hash': this.order_hash,
            'payment_system': meth
          }, this.requestOptions)
            .then((resp) => {
              this.canShowFrame = true
              // console.log(resp.data)
            }, (err) => {
              console.log('Error:', err)
            })
        }, 100)
      }
    }
  },
  created: function () {
    if (!this.$route.query.sspay) {
      this.canShowFrame = true
    }
    setTimeout(this.getLink, 1000)
  },
  mounted: function () {
    iframeResizer(this.iframeOptions, '.payment-iframe')
  }
}

