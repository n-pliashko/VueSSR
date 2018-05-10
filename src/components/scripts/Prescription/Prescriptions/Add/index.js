import {mapState} from 'vuex'
import config from '@/../config'

export default {
  name: 'Add',
  data () {
    return {
      showPrism: false,
      dualPD: false,
      confirm: false,
      addInfo: false,
      options: {
        SPH: {
          OD: [],
          OS: []
        },
        CYL: {
          OD: [],
          OS: []
        },
        AXIS: {
          OD: [],
          OS: []
        },
        ADD: {
          OD: [],
          OS: []
        },
        PD: {
          dual: [],
          left: [],
          right: []
        },
        PRISM: {
          OD: {
            v: [],
            vDir: [],
            h: [],
            hDir: []
          },
          OS: {
            v: [],
            vDir: [],
            h: [],
            hDir: []
          }
        }
      },
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true
      }
    }
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost
    })
  },
  mounted () {
    let self = this
    this.$axios.get(this.apiHost + config.prefix + config.prescriptions.setting, {}, this.requestOptions).then(response => response.data)
      .then(json => {
        if (json.SPH) {
          self.options.SPH.OD = json.SPH.right
          self.options.SPH.OS = json.SPH.left
        }

        if (json.CYL) {
          self.options.CYL.OD = json.CYL.right
          self.options.CYL.OS = json.CYL.left
        }

        if (json.AXIS) {
          self.options.AXIS.OD = json.AXIS.right
          self.options.AXIS.OS = json.AXIS.left
        }

        if (json.ADD) {
          self.options.ADD.OD = json.ADD.right
          self.options.ADD.OS = json.ADD.left
        }

        if (json.PD) {
          self.options.PD.right = json.PD.right
          self.options.PD.left = json.PD.left
          self.options.PD.dual = json.PD.dual
        }

        if (json.PRISM) {
          Object.assign(self.options.PRISM.OD,
            {
              v: json.PRISM.right.v,
              vDir: json.PRISM.right.v_dir,
              h: json.PRISM.right.h,
              hDir: json.PRISM.right.h_dir
            })

          Object.assign(self.options.PRISM.OS,
            {
              v: json.PRISM.left.v,
              vDir: json.PRISM.left.v_dir,
              h: json.PRISM.left.h,
              hDir: json.PRISM.left.h_dir
            })
        }
      })
  },
  methods: {
    prescriptionSubmit: function (event) {
      event.preventDefault()
      this.$router.push({name: this.$parent.$parent.nextStep})
    }
  }
}
