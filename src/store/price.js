export default function (price, back = false, print = false) {
  const {exchange, exchangeBack, selected = 1, allCurrency} = this.currency
  const current = {...allCurrency[selected]}
  let result

  if (back) {
    try {
      result = this.vat(exchangeBack(price), true).price
    } catch (e) {
      result = exchangeBack(price)
    }
  } else {
    try {
      result = exchange(this.vat(price).price)
    } catch (e) {
      result = exchange(price)
    }
  }

  if (print) {
    let el = global.document.createElement('textarea')
    el.innerHTML = current.symbol + ' ' + result
    result = el.innerText
  }

  return result
}
