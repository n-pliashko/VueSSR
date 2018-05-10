import PageHeader from '@/components/scripts/PageHeader/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  components: {
    PageHeader,
    PageFooter
  },
  data () {
    return {
      email: '',
      password: '',
      familiarEmail: false,
      unfamiliarEmail: false,
      attemptSubmit: false,
      attemptInputEmail: false,
      attemptInputPass: false
    }
  },
  computed: {
    ...mapState({
      data (state) {
        const {formData: {login: {familiarEmail = false, ...data} = {}}} = state

        this.email = data.email
        this.password = data.password
        this.familiarEmail = familiarEmail
        this.attemptInputEmail = this.attemptInputEmail || familiarEmail

        return {
          account: 0,
          ...data
        }
      },
      meta: (state) => ({
        ...state.formMeta['login']
      }),
      loading: (state) => state.loading,
      user: (state) => ({
        ...state.user
      }),
      auth: (state) => state.authorization
    }),
    missingPassword: function () {
      if (this.password === '' || this.password === undefined) {
        this.attemptInputPass = true
        return true
      }
      return false
    },
    missingEmail: function () { // true if empty
      if (this.email === undefined || this.email === '') {
        this.attemptInputEmail = true
        return true
      }
      return false
    },
    invalidEmail: function () { // true if no such chars
      if (this.email !== undefined && (this.email.indexOf('@') < 0 || this.email.indexOf('.') < 0)) {
        this.attemptInputEmail = true
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      onChange: 'onChangeForm'
    }),
    resetAttemptsEmail: function () {
      this.attemptInputEmail = false
    },
    resetAttemptsPassword: function () {
      this.attemptInputPass = false
    },
    checkValidity: function () {
      return (this.missingEmail || this.invalidEmail || this.familiarEmail) // || this.unfamiliarEmail --- false if everything's fine
    },
    checkPassword: function () {
      return !this.missingPassword   // true if everything's fine
    },
    validateForm: function (event) {
      this.attemptSubmit = true
      event.preventDefault()
      this.$store.dispatch('checkLogin', this.email)
        .then(() => {
          this.checkValidity()
          this.checkPassword()
          if (!(this.data.account && this.missingPassword) && !this.missingEmail && !this.invalidEmail && (this.data.account || !this.familiarEmail)) {
            this.$store.dispatch('onSubmitLogin', this.$router)
          }
        })
        .catch(err => console.log('Login form error: ', err))
    }
  },
  watch: {
    user (user) {
      if (user.user_number) {
        this.$router.push('/account/profile')
      }
    }
  }
}
