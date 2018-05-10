import { mapState } from 'vuex'
import config from '@/../config'

export default {
  name: 'CheckoutCart',
  sspayMode: false,
  data () {
    return {
      email: '',
      cdnUrl: config.cdnUrl,
      cdnUrlPrefix: config.cdnUrlPrefix,
      showPopup: false
    }
  },
  props: [
    'shippingCost',
    'subTotal',
    'order',
    'activeShippingId',
    'getPrice',
    'debugLog',
    'getAddPrice',
    'setMoreInfoData',
    'deleteItemSsv4Request'
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
    mouseOver: function (index) {
      this.showPopup = index
      setTimeout(() => (this.showPopup = false), 2000)
    },
    mouseOverOf: function () {
      console.log('BLUUUUUR')
    },
    decodeHtml: function (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    loadDataToPopup: function (data) {
      this.setMoreInfoData(data)
    },
    deleteItemSsv4: function (index, itemId) {
      this.deleteItemSsv4Request(index, itemId)
    },
    calculateDiscount: function () {
      if (this.sspayMode) {
        return this.getAddPrice((this.order.promo_discount ? this.order.promo_discount : 0), (this.order.two4one ? this.order.two4one : 0), true)
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
    this.sspayMode = this.$route.query.sspay === undefined ? false : true
  }
}
