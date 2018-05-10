import { mapState } from 'vuex'
import Vue from 'vue'
import VueRes from 'vue-resource'
import config from '@/../config'

Vue.use(VueRes)

export default {
  name: 'Print page',
  data () {
    return {
      msg: 'This is print page'
    }
  },
  props: [
    'order'
  ],
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      regData: (state) => state.regData,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
    })
  },
  components: {},
  methods: {
    decodeHtml: function (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    }
  },
  mounted: function () {
  },
  created: function () {
  }
}
