import {reverseRouteName} from '@/../config/helper'
export default {
  name: 'FilterBlockMobile',
  props: ['title', 'filterName', 'onlyOne', 'categories', 'isLink', 'linkTemplate', 'blockId'],
  computed: {
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
      this.$parent.$parent.filters[this.filterName] = []
    },
    reverseRoute: function (template, obj) {
      let name = reverseRouteName(obj.name)
      let path = template.replace(/:name/g, name).replace(/:id/g, obj.id).replace(/:count_items/g, obj.count_items)
      return '/' + this.path + path
    }
  }
}
