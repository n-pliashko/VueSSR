import config from '@/../config'
import { mapState } from 'vuex'

export default {
  name: 'ProjectVersion',
  data () {
    return {
      version: {
        front: null,
        back: null
      }
    }
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost
    }),
    showVersion: function () {
      let reg = new RegExp('(omnismain.com)')
      let hostname = window.location.host
      return reg.test(hostname)
    },
    host: function () {
      return window.location.href
    }
  },
  mounted () {
    // let host = window.location.host
    if (this.showVersion) {
      this.getFrontVersion()
      this.getBackVersion()
    }
  },
  methods: {
    getFrontVersion () {
      const timestamp = Date.now()
      this.$axios.get(this.apiHost + '/version.json?' + timestamp)
        .then((data) => { this.version.front = data.data }, (err) => console.log('err::', err))
    },
    getBackVersion () {
      const timestamp = Date.now()
      this.$axios.get(this.apiHost + config.prefix + '?getversion&' + timestamp)
        .then((data) => { this.version.back = data.data }, (err) => console.log('err::', err))
    }
  }
}
