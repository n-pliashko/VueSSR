import { mapState } from 'vuex'

export default {
  name: 'Breadcrumbs',
  computed: {
    ...mapState({
      breadcrumbs: (state) => {
        return [
          ...state.breadcrumbs
        ]
      }
    })
  },
  methods: {
    rememberRoute (to) {
      let params = {}
      if (typeof to === 'object' && to.params) {
        params = to.params
      }
      this.$store.dispatch('setRouterBack', {path: this.$route.fullPath, params: params})
    }
  }
}
