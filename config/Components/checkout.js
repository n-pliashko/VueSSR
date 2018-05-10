module.exports = {
  prod: {
    setOrder: '/checkout/checkout/set-order',
    fetchOrderUrl: '/checkout/checkout/fetch-order',
    getCountryListUrl: '/checkout/checkout/get-country-list',
    getShippingMethodUrl: '/delivery/delivery/get-shipping-method',
    getPaySystemForCountryUrl: '/checkout/checkout/get-payment-system-for-country',
    getCurrenciesUrl: '/checkout/checkout/get-currencies',
    zipCodeGetUrl: 'https://pcls1.craftyclicks.co.uk/json/rapidaddress?response=data_formatted',
    zipCodeGetUrlProxy: 'https://alpha.omnismain.com:3000/api/v.2/zip/code/',
    recalcShippingUrl: '/checkout/checkout/recalculate-shipping',
    getShippingMethodCheckoutUrl: '/checkout/checkout/get-shipping-method',
    getPaymentUrl: '/checkout/checkout/get-payment-url',
    setOrderUser: '/checkout/checkout/set-order-user',
    setOrderUserSsv4: '/checkout/checkout/set-order-user-ssv4',
    recalculateOrder: '/checkout/checkout/recalculate-order',
    saveAddress: '/checkout/checkout/save-address',
    deleteItemSsv4Url: '/checkout/checkout/delete-item'
  },
  dev: {
    setOrder: '/checkout/checkout/set-order',
    fetchOrderUrl: '/checkout/checkout/fetch-order',
    getCountryListUrl: '/checkout/checkout/get-country-list',
    getShippingMethodUrl: '/delivery/delivery/get-shipping-method',
    getPaySystemForCountryUrl: '/checkout/checkout/get-payment-system-for-country',
    getCurrenciesUrl: '/checkout/checkout/get-currencies',
    zipCodeGetUrl: 'https://pcls1.craftyclicks.co.uk/json/rapidaddress?response=data_formatted',
    zipCodeGetUrlProxy: 'https://alpha.omnismain.com:3000/api/v.2/zip/code/',
    recalcShippingUrl: '/checkout/checkout/recalculate-shipping',
    getShippingMethodCheckoutUrl: '/checkout/checkout/get-shipping-method',
    getPaymentUrl: '/checkout/checkout/get-payment-url',
    setOrderUser: '/checkout/checkout/set-order-user',
    recalculateOrder: '/checkout/checkout/recalculate-order',
    setOrderUserSsv4: '/checkout/checkout/set-order-user-ssv4',
    saveAddress: '/checkout/checkout/save-address',
    deleteItemSsv4Url: '/checkout/checkout/delete-item'
  }
}
