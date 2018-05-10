import {mapState} from 'vuex'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import ReviewGuidesModal from '@/components/scripts/Review/ReviewGuidesModal/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
import config from '@/../config'
import Vue from 'vue'
import VueRes from 'vue-resource'

Vue.use(VueRes)

export default {
  name: 'Review',
  components: {
    PageHeader,
    ReviewGuidesModal,
    NavigationLinks,
    PageFooter,
    ScrollToTop
  },
  computed: {...mapState({
    data: (state) => {
      return {
        step: 1,
        ...state.formData['login']
      }
    },
    meta: (state) => ({
      ...state.formMeta.orders || {}
    }),
    loading: (state) => state.loading,
    apiHost: (state) => state.apiHost,
    user: (state) => {
      const {profile, ...user} = state.user
      if (profile) { return user }
      return user
    },
    profile: (state) => {
      const {user: {profile: data}} = state
      const {addresses, ...profile} = data
      if (addresses) { return profile }
      return profile
    }
  })
  },
  data () {
    return {
      item: {},
      ss: null,
      formr: {
        riid: '',
        rrst: '0',
        rrq: '0',
        rrv: '0',
        rcp: '1',
        fit: '3',
        old: '0',
        style: '0',
        rti: '',
        rtt: '',
        image: ''
      },
      egn: ''
    }
  },
  methods: {
    loadItem: function (itemId) {
      let self = this
      this.$axios.get(this.apiHost + config.prefix + config.reviews.reviewItem, Object.assign({}, this.requestOptions, {params: {item_id: itemId}}))
        .then(data => {
          self.item = data.data.item
        }, (err) => console.log('err::', err))
    },
    commitMethod: function () {
      let self = this
      this.$axios.post(this.apiHost + config.prefix + config.reviews.reviewCreate, self.formr).then(function (response) {
        if (response.data == true) {
          self.$router.push(config.reviews.reviewAccount)
        }
      }, function (error) {
        console.log(error.statusText)
      })
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      this.createImage(files[0])
    },
    createImage (file) {
      // var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.formr.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (message, event) {
      this.formr.image = ''
    }
  },
  mounted () {
    let itemNumber = this.$route.params.item_id
    this.formr.riid = itemNumber
    this.loadItem(itemNumber)
    this.ss = 'ss' + itemNumber.slice(0, -2) + '.' + itemNumber.slice(-2)
  }
}
