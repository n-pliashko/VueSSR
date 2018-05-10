export default function (price, back = false) {
  const {vat} = this.basket
  let country = {}
  let index
  price = parseFloat(price)
  if (!this.countries.length || !vat) {
    return {
      price,
      vat: 0
    }
  }

  if (!this.user.profile && (!this.basket.order || !this.basket.order.deliveryAddress)) {
    index = this.countries.findIndex(item => {
      if (!item) {
        return false
      }
      const {country_code_2: code2, country_code_3: code3} = item
      const {countryCode} = this.geoInfo

      return (code2 && countryCode && code2.toLowerCase() === countryCode.toLowerCase()) ||
        (code3 && countryCode && code3.toLowerCase() === countryCode.toLowerCase())
    })
    country = ((index >= 0) && this.countries[index]) || false
  } else if (this.basket.order && this.basket.order.deliveryAddress) {
    country = this.countries[this.basket.order.deliveryAddress.country_id]
  } else {
    index = this.user.profile.addresses.findIndex(address => address.address_type === 'delivery')
    country = index >= 0 && this.countries[this.user.profile.addresses[index].country_id] || null
  }

  if (!country) {
    return {
      price,
      vat: 0.0
    }
  }

  return (country && country.is_eu) ? {
    price,
    vat: (price * (vat - 1) / vat)
  } : {
    price: back ? (price * vat) : (price / vat),
    vat: 0.0
  }
}
