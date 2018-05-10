export default {
  allCurrency: [],
  selected: undefined,
  exchangeFunc: function (price, print = true) {
    if (!this.selected) {
      return price
    }

    const currency = {...this.allCurrency[this.selected]}
    const precis = (currency.precision_digit || currency.precision_digit === 0) ? currency.precision_digit : 0
    const num = Math.pow(10, precis)
    price *= currency.rate
    const result = parseFloat(currency.to_greater ? Math.ceil(price * num) / num : Math.round(price * num) / num)

    return (precis >= 0 && print) ? result.toFixed(precis) : result
  },
  exchangeBackFunc: function (price) {
    if (!this.selected) {
      return price
    }

    const currency = {...this.allCurrency[this.selected]}

    return parseFloat(price / currency.rate)
  },
  exchangeBackFuncByCurrency: function (price, currency) {
    return parseFloat(price / currency.rate)
  },
  exchange: price => price,
  exchangeBack: price => price
}
