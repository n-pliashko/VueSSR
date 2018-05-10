import $ from 'jquery'

export default {
  name: 'NavAccordion',
  mounted () {
    $('.collapse').on('show.bs.collapse', function (e) {
      $(e.target).closest('tab').siblings().find('.collapse').collapse('hide')
    })
  }
}
