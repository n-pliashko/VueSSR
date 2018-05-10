import SelectUse from '@/components/scripts/Prescription/SelectUse/index.vue'
import Prescriptions from '@/components/scripts/Prescription/Prescriptions/index.vue'
import LensType from '@/components/scripts/Prescription/LensType/index.vue'
import LensOptions from '@/components/scripts/Prescription/LensOptions/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'Prescription',
  props: ['stage'],
  components: {SelectUse, Prescriptions, LensType, LensOptions, TrustpilotWidget},
  data () {
    return {
      steps: [
        {
          route: 'SelectUse',
          title: 'Your Vision',
          disabled: false,
          visible: true,
          question: '1. How will you use your glasses?',
          note: 'Distance (Single Vision) is the most common for everyday use or driving. Support available on 03303 801 190.'
        },
        {
          route: 'Prescriptions',
          title: 'Prescription',
          disabled: true,
          visible: true,
          question: '2.1 Add your prescription',
          note: 'Add your prescription to receive a recommendation for the best lens for your needs.'
        },
        {
          route: 'LensType',
          title: 'Lens Type',
          disabled: true,
          visible: true,
          question: '1. How will you use your glasses?',
          note: 'Distance (Single Vision) is the most common for everyday use or driving. Support available on 03303 801 190.'
        },
        {
          route: 'LensOptions',
          title: 'Lens Options',
          disabled: true,
          visible: true,
          question: '1. How will you use your glasses?',
          note: 'Distance (Single Vision) is the most common for everyday use or driving. Support available on 03303 801 190.'
        }
      ],
      firstStep: 'SelectUse',
      activeStep: 0,
      previousStep: '',
      nextStep: '',
      lastStep: 'LensOptions',
      showLenses: true,
      backText: 'Back to Product',
      useSubmit: null,
      activeItemIndex: 0
    }
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      basket: (state) => state.basket,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack,
      calculatePrice: (state) => state.calculatePrice
    })
  },
  methods: {
    getPreviousStep: function (index) {
      while (index > 0) {
        if (this.steps[index - 1].visible) {
          return this.steps[index - 1].route
        } else {
          index--
        }
      }
      return 'ProductList'
    },
    getNextStep: function (index) {
      while (++index < this.steps.length) {
        if (this.steps[index].visible) {
          return this.steps[index].route
        }
      }
      return this.lastStep
    },
    getChild (name) {
      return Object.values(this.$children).find(x => x.$options.name === name)
    },
    getStepIndex (route) {
      return Object.values(this.steps).findIndex(x => x.route === route)
    },
    updateSteps: function () {
      let self = this
      let route = self.$route.name
      let index = this.getStepIndex(route)
      this.activeStep = index
      let first = Object.values(self.steps).find(x => x.visible === true)
      let last = Object.values(self.steps).reverse().find(x => x.visible === true)
      self.firstStep = first.route
      self.lastStep = last.route
      self.previousStep = this.getPreviousStep(index)
      self.nextStep = this.getNextStep(index)

      self.backText = this.stage === this.firstStep ? 'Back to Product' : 'Back'

      self.steps.map((val, key) => {
        if (key <= index) {
          val.disabled = false
        } else {
          val.disabled = true
          val.visible = true
        }
      })
    },
    useSubmit: function (type) {
      console.log(type)
    },
    goBack: function () {
      let child = this.getChild(this.stage)
      if (child !== 'undefined' && typeof child.goBack === 'function') {
        child.goBack()
      } else {
        this.$router.push({name: this.previousStep})
      }
    },
    convertPrice: function (price) {
      try {
        return this.calculatePrice(price)
      } catch (e) {
        return parseFloat(this.exchange(price)).toFixed(2)
      }
    }
  },
  mounted () {
    this.updateSteps()
  },
  watch: {
    '$route' (to, from) {
      this.updateSteps()
    }
  }
}
