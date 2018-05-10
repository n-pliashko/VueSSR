import TintType from '@/components/scripts/Prescription/LensType/TintType/index.vue'
import {mapState} from 'vuex'
import config from '@/../config'

export default {
  name: 'LensType',
  components: {TintType},
  data () {
    return {
      currentComponent: null,
      previousComponent: [],
      tintType: {},
      tintStrength: {},
      tintColour: {},
      chosenLensType: {
        type: null,
        colour: null,
        strength: null
      },
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true
      }
    }
  },
  computed: {
    nextStep: function () {
      return this.$parent.nextStep
    },
    disabledNext: function () {
      return this.chosenLensType.colour !== null && this.chosenLensType.strength !== null
    },
    ...mapState({
      basket: (state) => state.basket,
      apiHost: (state) => state.apiHost
    })
  },
  mounted () {
    let self = this
    this.$axios.get(this.apiHost + config.prefix + config.prescriptions.tints, {}, this.requestOptions).then(response => response.data)
      .then(json => {
        if (json.type) {
          self.tintType = json.type.reduce((obj, res) => {
            obj[res.id] = Object.assign(res, {show: false, disabled: false})
            return obj
          }, {})
        }

        if (json.strength) {
          self.tintStrength = json.strength
        }

        if (json.colour) {
          self.tintColour = json.colour
        }
      })
  },
  methods: {
    swapComponent: function (component) {
      this.currentComponent = component
    },
    goBack: function () {
      if (this.currentComponent !== null) {
        this.currentComponent = null
        this.chosenLensType = {
          type: null,
          colour: null,
          strength: null
        }
        let tintType = this.tintType
        Object.keys(this.tintType).map(key => {
          Object.assign(tintType[key], {show: false, disabled: false})
        })
      } else {
        this.$router.push({name: this.$parent.previousStep})
      }
    },
    onChooseTint: function (id) {
      let tintType = this.tintType
      this.chosenLensType.type = id
      Object.keys(tintType).map(key => {
        if (id === key) {
          tintType[key].show = !tintType[key].show
        } else {
          tintType[key].disabled = true
        }
      })
    },
    selectColour: function (id) {
      this.chosenLensType.colour = id
    },
    selectStrength: function (id) {
      this.chosenLensType.strength = id
    }
  }
}
