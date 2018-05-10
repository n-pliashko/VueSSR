import { mapState } from 'vuex'

export default {
  name: 'Address',
  computed: {
    ...mapState({
      meta: (state) => ({
        ...state.formMeta
      }),
      loading: (state) => state.loading,
      apiHost: (state) => state.apiHost,
      auth: (state) => state.authorization
    })
  },
  props: {
    'countries': {
      required: true
    },
    'address': {
      required: true,
      type: Object
    },
    'title': {
      type: String
    },
    'onSubmitAction': {
      type: Function
    },
    'errors': {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    onSubmit ({e, address = {}}) {
      this.onSubmitAction(e)
    },
    change () {
      this.$parent.setAddress(this.address)
    }
  }
}
