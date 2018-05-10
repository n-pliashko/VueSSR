import $ from 'jquery'

export default {
  name: 'CheckoutItemDetails',
  data () {
    return {
      itemIndex: 0
    }
  },
  props: [
    'moreInfo'
  ],
  // computed: {
  // },
  mounted: function () {
    $('#detailsModal').on('show.bs.modal', function (event) {
      let button = $(event.relatedTarget)
      this.itemIndex = button.data('item-index')

      let modal = $(this)
      modal.find('.modal-title').text('Modal for item ' + this.itemIndex)
    })
  }
}
