import LensPackage from '@/components/scripts/Prescription/LensOptions/LensPackage/index.vue'
import LensBrand from '@/components/scripts/Prescription/LensOptions/LensBrand/index.vue'
import {mapState} from 'vuex'

import config from '@/../config'

export default {
  name: 'LensOptions',
  components: {LensPackage, LensBrand},
  data () {
    return {
      currentComponent: 'LensBrand',
      previousComponent: [],
      lensOptions: {},
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
    if (this.$parent.useSubmit === 'SS') {
      this.currentComponent = null
    }
    this.loadOptions()
  },
  methods: {
    swapComponent: function (component) {
      this.previousComponent.push(this.currentComponent)
      this.currentComponent = component
    },
    goBack: function () {
      if (this.previousComponent.length > 0) {
        this.currentComponent = this.previousComponent.pop()
        this.lensOptions = {}
      } else {
        this.$router.push({name: this.$parent.previousStep})
      }
    },
    loadOptions: function () {
      let self = this
      self.$http.get(this.apiHost + config.prefix + config.prescriptions.lensOption, {}, this.requestOptions).then(response => response.json())
        .then(json => {
          self.lensOptions = json.reduce((obj, res) => {
            obj[res.id] = res
            return obj
          }, {})
        })
    }
  },
  watch: {
    currentComponent () {
      if (this.currentComponent === null) {
        this.loadOptions()
      }
    }
  }
}
