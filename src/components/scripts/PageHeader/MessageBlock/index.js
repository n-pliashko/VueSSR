import { mapState } from 'vuex'

export default {
  name: 'MessageBlock',
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      meta: (state) => ({
        ...state.formMeta.orders || {}
      })
    })
  }
}
