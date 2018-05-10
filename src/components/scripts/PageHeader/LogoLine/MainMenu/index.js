import SubMenuItem from '@/components/scripts/PageHeader/LogoLine/MainMenu/SubMenuItem/index.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import {mapState} from 'vuex'

let Handlebars = require('handlebars/dist/handlebars.min.js')

Vue.use(Vuetify)

export default {
  name: 'MainMenu',
  components: {SubMenuItem},
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      treeData: (state) => state.menus,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      calculatePrice: (state) => state.calculatePrice
    })
  },
  data () {
    return {
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true
      }
    }
  },
  methods: {
    convertMenuContext (context) {
      let self = this
      Handlebars.registerHelper('exchange_price', function (value, rate = false) {
        let price = 0
        if (value) {
          try {
            price = self.calculatePrice(value)
          } catch (e) {
            price = self.exchange(value)
          }
        }
        if (rate) {
          price = parseFloat(price).toFixed(parseInt(rate))
        }
        return price
      })
      let templateFn = Handlebars.compile(context)
      let output = templateFn(this)
      return output
    }
  },
  watch: {
    currency: {
      handler: function () {
        this.$forceUpdate()
      },
      deep: true
    }
  }
}
