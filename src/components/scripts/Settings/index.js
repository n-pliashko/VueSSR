import jQuery from 'jquery'
import {mapState} from 'vuex'
import * as types from '@/store/types'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'

export default {
  name: 'Settings',
  components: {PageHeader, NavigationLinks, PageFooter},
  computed: {
    ...mapState({
      meta: (state) => ({
        ...state.formMeta.profile || {}
      }),
      loading: (state) => state.loading,
      apiHost: (state) => state.apiHost,
      user: (state) => {
        const {...user} = state.user

        return user
      },
      profile: (state) => {
        const {user: { profile: data }} = state
        const {...profile} = data || {}

        return profile
      },
      auth: (state) => state.authorization
    })
  },
  data () {
    return {
      password: '',
      newPassword: '',
      repeatNewPassword: '',
      subscribed: '0'
    }
  },
  methods: {
    onSubmit (e) {
      var form = document.getElementById('change-password-form')
      if (form.checkValidity() === false) {
        e.preventDefault()
        e.stopPropagation()
        this.$store.commit(types.FORM_ERROR, {msg: 'Ensure you correct any highlighted errors before continuing.', formName: 'profile'})
      }
      form.classList.add('was-validated')
      var labels = form.getElementsByClassName('col-form-label')
      for (var i = 0; i < labels.length; i++) {
        labels[i].classList.add('text-danger')
      }
      if (this.newPassword === this.repeatNewPassword) {
        this.$store.dispatch('onSubmitProfile', {
          newPassword: this.newPassword,
          password: this.password,
          profile: {
            ...this.profile,
            subscribed: this.subscribed
          }
        })
      } /* else {
        this.$store.commit(types.FORM_ERROR, {msg: 'Ensure you correct any highlighted errors before continuing.', formName: 'changePassword'})
      } */
    },
    init () {
      this.subscribed = this.profile.subscribed
    }
  },
  mounted () {
    if (this.user.email) {
      this.init()
    }
    if (jQuery('[data-toggle="tooltip"]') && jQuery('[data-toggle="tooltip"]').tooltip) {
      jQuery('[data-toggle="tooltip"]').tooltip()
    }
/*
    window.addEventListener('load', function () {
      var form = document.getElementById('change-password-form')
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
          form.classList.add('was-validated')
          var labels = form.getElementsByClassName('col-form-label')
          for (var i = 0; i < labels.length; i++) {
            labels[i].classList.add('text-danger')
          }
          this.$store.commit(types.FORM_ERROR, {msg: 'Ensure you correct any highlighted errors before continuing.', formName: 'changePassword'})
        } else if (this.newPassword === this.repeatNewPassword) {
          this.$store.dispatch('onSubmitProfile', {
            newPassword: this.newPassword,
            password: this.password,
            profile: {
              ...this.profile,
              subscribed: this.subscribed
            }
          })
        }
      }, false)
    }, false)
*/
  }
}
