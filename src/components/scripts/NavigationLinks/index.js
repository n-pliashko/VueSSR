import { mapState, mapActions } from 'vuex'

const self = {
  name: 'NavigationLinks',
  data () {
    try {
      return {title: this.$route.matched['0'].props.default.title}
    } catch (e) {
      return {title: ''}
    }
  },
  defaultData: {
    account: 0
  },
  computed: {
    ...mapState({
      data: (state) => {
        return {
          ...self.defaultData,
          ...state.formData['login']
        }
      },
      meta: (state) => ({
        ...state.formMeta['login']
      }),
      loading: (state) => state.loading,
      user: (state) => ({
        ...state.user
      }),
      auth: state => state.authorization
    })
  },
  methods: {
    ...mapActions({
      onChange: 'onChangeForm',
      onSubmit: 'onSubmitLogin'
    }),
    onLogout (e) {
      e.preventDefault()
      this.$store.dispatch('onLogout', this.$router)
    }
  }
}

export default self
