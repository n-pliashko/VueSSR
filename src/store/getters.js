export default {
  wishlistCount: state => {
    // return state.wishlist.length
    let pageitems = state.wishlist.filter(function (obj) {
      return obj.params.type === 'pageitem'
    })
    return pageitems.length
  },
  isExistWishlist: state => (itemId) => {
    let index = (state.wishlist).findIndex((obj) => obj.id === itemId && obj.params.type === 'pageitem')
    if (index === -1) {
      return false
    }
    return true
  },
  isExistWishlistOpt: state => (optId) => {
    let index = (state.wishlist).findIndex((obj) => obj.params.params.option === optId && obj.params.type === 'pageitem')
    if (index === -1) {
      return false
    }
    return true
  }
}
