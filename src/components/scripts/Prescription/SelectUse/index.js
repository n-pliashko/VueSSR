import Multifocal from '@/components/scripts/Prescription/SelectUse/Multifocal/index.vue'
import Bifocal from '@/components/scripts/Prescription/SelectUse/Bifocal/index.vue'
import Varifocal from '@/components/scripts/Prescription/SelectUse/Varifocal/index.vue'
import BeforeContinue from '@/components/scripts/Prescription/SelectUse/BeforeContinue/index.vue'

import {mapState} from 'vuex'

export default {
  name: 'SelectUse',
  data () {
    return {
      currentComponent: null,
      previousComponent: []
    }
  },
  computed: {
    ...mapState({
      basket: (state) => state.basket
    })
  },
  components: {Multifocal, Bifocal, Varifocal, BeforeContinue},
  mounted () {
    if (this.basket.order && this.basket.order.totalItems > 1) {
      this.currentComponent = 'BeforeContinue'
    }
  },
  methods: {
    swapComponent: function (component, useSubmit = null) {
      this.previousComponent.push(this.currentComponent)
      this.currentComponent = component
      this.$parent.useSubmit = useSubmit
    },
    nextStepRoute: function (useSubmit) {
      this.$router.push({name: this.$parent.nextStep, params: {useSubmit: useSubmit}})
    },
    goBack: function () {
      if (this.previousComponent.length > 0) {
        this.currentComponent = this.previousComponent.pop()
      } else {
        this.$router.push({name: this.$parent.previousStep})
      }
    },
    onFashionWear: function (useSubmit) {
      let index = Object.values(this.$parent.steps).findIndex(x => x.route === 'Prescriptions')
      this.$parent.steps[index].visible = false
      this.$router.push({name: 'LensType', params: {useSubmit: useSubmit}})
    }
  },
  watch: {
    currentComponent () {
      this.$parent.backText = this.currentComponent === null || this.currentComponent === 'BeforeContinue' ? 'Back to Product' : 'Back'
    }
  }
}
