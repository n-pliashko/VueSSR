import { reverseRouteName } from '@/../config/helper'
import $ from 'jquery'

export default {
  name: 'filterPage',
  props: ['title', 'filterName', 'onlyOne', 'categories', 'isLink', 'linkTemplate', 'blockId'],
  computed: {
    selectedFilterBlock () {
      let filters = this.$parent.$parent.filters[this.filterName]
      return Object.values(this.categories).filter(obj => filters.indexOf(obj.id) !== -1)
    },
    path () {
      return this.$parent.$parent.main_category_link ? this.$parent.$parent.main_category_link : 'brands'
    }
  },
  mounted () {
    if (typeof this.$parent.$parent.filters[this.filterName] === 'object') {
      if (this.$parent.$parent.filters[this.filterName].length > 0 && !!this.onlyOne) {
        this.$parent.$parent.filters[this.filterName] = this.$parent.$parent.filters[this.filterName][0]
      }
    } else if (this.$parent.$parent.filters[this.filterName].length > 0 && !this.onlyOne) {
      this.$parent.$parent.filters[this.filterName] = [this.$parent.$parent.filters[this.filterName]]
    }
  },
  methods: {
    clearAll: function () {
      let self = this
      let clearedFilters = this.$parent.$parent.filters[this.filterName].filter(key => Object.values(self.categories).filter(obj => obj.id != key).length === 0)
      this.$parent.$parent.filters[this.filterName] = clearedFilters
    },
    reverseRoute: function (template, obj) {
      let name = reverseRouteName(obj.name)
      let path = template.replace(/:name/g, name).replace(/:id/g, obj.id).replace(/:count_items/g, obj.count_items)
      return '/' + this.path + path
    },
    scrollToTop: function () {
      $('#items').parent().get(0).scrollIntoView()
    }
  }
}
