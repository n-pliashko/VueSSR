import { mapState } from 'vuex'
import config from '@/../config'

export default {
  name: 'CheckoutCartMobile',
  sspayMode: false,
  data () {
    return {
      email: '',
      cdnUrl: config.cdnUrl,
      cdnUrlPrefix: config.cdnUrlPrefix
    }
  },
  props: [
    'shippingCost',
    'subTotal',
    'order',
    'activeShippingId',
    'getPrice',
    'debugLog',
    'getAddPrice'
  ],
  computed: {
    ...mapState({
      user: (state) => ({
        ...state.user
      }),
      basket: (state) => ({...state.basket}),
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      integrationHost: (state) => state.integrationHost
    })
  },
  methods: {
    decodeHtml: function (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    calculateDiscount: function () {
      if (this.sspayMode) {
        return this.getAddPrice((this.order.promo_discount ? this.order.promo_discount : 0), (this.order.total_save_two_for_one ? this.order.total_save_two_for_one : 0), true)
      } else {
        return 0
      }
    }
  },
  created: function () {
    this.debugLog('CheckoutCart created', {
      'shippingCost': this.shippingCost,
      'subTotal': this.subTotal,
      'activeShippingId': this.activeShippingId
    })
    this.sspayMode = (this.$route.query.sspay === undefined ? false : true)
  }
}
