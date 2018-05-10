import { mapState } from 'vuex'
import Vue from 'vue'
import VueRes from 'vue-resource'
import config from '@/../config'
import $ from 'jquery'
import MatchHeight from 'jquery-match-height'

Vue.use(VueRes)
Vue.use(MatchHeight)

export default {
  name: 'delivery',
  data () {
    return {
      msg: 'This is modules catalog',
      // activeShippingId: null,
      // currencies: null,
      deliveryMethodNumber: null,
      disableFields: false
    }
  },
  props: [
    'deliveryMethods',
    'order',
    'currencies',
    'next_tick',
    'setShippingId',
    'onSubmitForm',
    'activeShippingId'
  ],
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange
    })
  },
  methods: {
    changeShippingMethod: function (index) {
      // this.activeShippingId = index
      if (!this.disableFields) {
        // this.next_tick(3)
        this.order.shipping_cost = this.deliveryMethods[index]['total']
        this.deliveryMethodNumber = this.deliveryMethods[index]['delivery_method_number']
        this.setShippingId(this.deliveryMethodNumber)
      }
    },
    commitMethod: function () {
      this.$store.dispatch('updateShipping', this.deliveryMethodNumber)
      this.disableFields = true
      if (this.deliveryMethodNumber) {
        this.next_tick(4)
        this.setShippingId(this.deliveryMethodNumber)
        // this.onSubmitForm()
      } else if (this.activeShippingId) {
        this.next_tick(4)
        this.setShippingId(this.activeShippingId)
      } else {
        console.log(this.deliveryMethodNumber, this.activeShippingId)
        this.enablePrevStep()
      }
    },
    enablePrevStep: function () {
      this.disableFields = false
    },
    decodeHtml: function (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    }
  },
  mounted: function () {
    $('.form-check').matchHeight()
  },
  created: function () {
    window.globalEvents.$on('enableFields', () => (this.enablePrevStep()))
    window.globalEvents.$on('deleteFields', () => (this.enablePrevStep()))
    window.globalEvents.$on('enableShipping', () => (this.enablePrevStep()))
  },
  watch: {
    activeShippingId () {
      this.deliveryMethodNumber = this.activeShippingId
    }
  }
}
