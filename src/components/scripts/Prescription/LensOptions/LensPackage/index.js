import {mapState} from 'vuex'
import config from '@/../config'

export default {
  name: 'LensPackage',
  data () {
    return {
      lensPackage: {},
      coatingChecked: [],
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
      apiHost: (state) => state.apiHost
    })
  },
  mounted () {
    var self = this
    self.$http.get(this.apiHost + config.prefix + config.prescriptions.lensPackage, {}, self.requestOptions).then(response => response.json())
      .then(json => {
        self.lensPackage = json.reduce((obj, res) => {
          obj[res.id] = Object.assign(res, {show: false, disabled: false})
          return obj
        }, {})
      })
  },
  methods: {
    onChooseLens: function (id) {
      var lensPackage = this.lensPackage
      Object.keys(lensPackage).map(key => {
        if (id === key) {
          lensPackage[key].show = !lensPackage[key].show
        } else {
          lensPackage[key].disabled = true
        }
      })
    }
  }
}
