import {mapState} from 'vuex'
import config from '@/../config'

export default {
  name: 'LensBrand',
  data () {
    return {
      lensBrand: {},
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true
      }
    }
  },
  computed: {
    ...mapState({
      basket: (state) => state.basket,
      apiHost: (state) => state.apiHost
    })
  },
  mounted () {
    let self = this
    self.$http.get(this.apiHost + config.prefix + config.prescriptions.lensBrand, {}, self.requestOptions).then(response => response.json())
      .then(json => {
        self.lensBrand = json.reduce((obj, res) => {
          obj[res.id] = res
          return obj
        }, {})
      })
  },
  methods: {
    onChooseBrand: function (id) {
      this.$parent.swapComponent(null)
    }
  }
}
