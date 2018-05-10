import Add from '@/components/scripts/Prescription/Prescriptions/Add/index.vue'
import UsePrevious from '@/components/scripts/Prescription/Prescriptions/UsePrevious/index.vue'

export default {
  name: 'Prescriptions',
  components: {Add, UsePrevious},
  data () {
    return {
      currentComponent: null
    }
  },
  methods: {
    swapComponent: function (component) {
      this.currentComponent = component
    },
    goBack: function () {
      if (this.currentComponent !== null) {
        this.currentComponent = null
      } else {
        this.$router.push({name: this.$parent.previousStep})
      }
    }
  }
}
