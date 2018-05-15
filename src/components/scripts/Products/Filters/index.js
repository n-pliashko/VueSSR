export default {
  name: 'Filters',
  data () {
    return {
      selected: {}
    }
  },
  methods: {
    clearOne: function (filterName, value) {
      let index = this.$parent.filters[filterName].findIndex(val => val == value)
      this.$parent.filters[filterName].splice(index, 1)
    },
    setFilterValues (obj) {
      console.log('setFilterValues', obj.name, this.$parent.filters[obj.name])
      if (this.$parent.filters[obj.name]) {
        let values = []
        this.$parent.filters[obj.name].map(filter => {
          let value = Object.values(obj.value).find(_obj => _obj.id == filter)
          if (value) {
            values.push(value)
          }
        })
        if (values && Object.values(values).length > 0) {
          if (!this.selected[obj.name]) {
            this.selected[obj.name] = []
          }
          this.selected[obj.name] = this.selected[obj.name].concat(values)
        }
      }
    }
  },
  watch: {
    '$parent.filters': {
      handler: function () {
        let self = this
        self.selected = {}
        if (this.$parent.filtersList) {
          Object.values(this.$parent.filtersList).map(obj => {
            if (Array.isArray(obj)) {
              obj.map(filter => {
                self.setFilterValues(filter)
              })
            } else {
              self.setFilterValues(obj)
            }
          })
        }
      },
      deep: true
    }
  }
}
