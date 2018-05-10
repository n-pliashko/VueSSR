import { mapState } from 'vuex'
import $ from 'jquery'
import Vue from 'vue'
import MatchHeight from 'jquery-match-height'

Vue.use(MatchHeight)

export default {
  name: 'BasketConfirmModal',
  computed: {
    ...mapState({
      basket: (state) => {
        return {
          ...state.basket
        }
      }
    })
  },
  methods: {
    addToCart: function () {
      const {item, option, frameSizeIndex} = this.$parent.selected
      const cartItem = this.$parent.item
      let optionObj = this.$parent.options[option]
      let frameSize = this.$parent.options[option].frame_sizes[frameSizeIndex]
      let data = {
        'item_number': item,
        'designer_id': cartItem.designer.designer_number,
        'category_id': cartItem.main_category.category_number,
        'quantity': 1,
        'supplier_name': cartItem.supplier_name,
        'item_description': cartItem.translation.description,
        'weight': cartItem.specifications.weight,
        'ordered_item_type': 'ordinary',
        'option': {
          order: optionObj.option_order,
          price_retailer: optionObj.price_retailer,
          price_old: optionObj.price_old,
          price: optionObj.price,
          status: optionObj.status,
          is_out_of_stock: optionObj.is_out_of_stock,
          featured: optionObj.featured,
          discontinued: optionObj.discontinued,
          name: optionObj.name,
          description: optionObj.description,
          lang: optionObj.lang,
          image_src: optionObj.thumbnail_images.length > 0 ? optionObj.thumbnail_images[0].src : null,
          image_type: optionObj.thumbnail_images.length > 0 ? 'THUMBNAIL' : null,
          image_order: optionObj.thumbnail_images.length > 0 ? optionObj.thumbnail_images[0].image_order : null,
          eld: frameSize.eld,
          gtin: frameSize.gtin,
          arm: frameSize.arm,
          bridge: frameSize.bridge,
          lens: frameSize.lens,
          height: frameSize.height,
          disk: frameSize.disk,
          back: frameSize.back,
          stock: frameSize.stock,
          frame_status: frameSize.status,
          frame_number: frameSize.fame_number,
          special_name: optionObj.special_name,
          special_discount: optionObj.special_discount,
          special_discount_percent: optionObj.special_discount_percent,
          option_number: optionObj.option_number
        }
      }
      this.$store.dispatch('addItemToBasket', data)
    }
  },
  mounted: function () {
    $('.rxSunPopup').matchHeight()
  }
}
