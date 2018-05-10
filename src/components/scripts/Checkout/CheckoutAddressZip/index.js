import Vue from 'vue'
import VueRes from 'vue-resource'
import config from '@/../config'

Vue.use(VueRes)

export default {
  name: 'Address',
  data () {
    return {
      msg: 'M169EA',
      errors: {
        zip: null,
        line1: null,
        line2: null,
        town: null,
        state: null
      },
      regdata: {},
      disabledNextButton: false,
      showButton: true,
      postcode: {
        delivery_points: [{
          organisation_name: '',
          department_name: '',
          line_1: '',
          line_2: '',
          udprn: '',
          dps: ''
        }]
      },
      activePostCodeId: 'nan',
      lockForm: 0,
      defaultShowDeliveryForm: null,
      disableFields: false,
      showAdressessSelectBlock: false,
      showDeliveryForm: 1,
      zipResponce: null,
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true,
        withCredentials: true
      }
    }
  },
  props: [
    'type',
    'data',
    'show_same_checkbox',
    'changeVisiblDelivery',
    'next_tick',
    'regCountry',
    'show_delivery',
    'errorInAddress',
    'countryList',
    'order',
    'selectCountry',
    'searchCountryByCode2',
    'searchCountryById',
    'debugLog'
  ],
  methods: {
    saveAddress: function (index) { // Сохранение аддреса если UK
      this.showAdressessSelectBlock = false
      this.activePostCodeId = index
      this.data.line1 = this.postcode[index]['line_1'] + ' ' + this.postcode[index]['dps'] + ' ' + (this.postcode[index]['udpr'] || '')
      this.data.line2 = this.postcode[index]['line_2'] + ' ' + this.postcode[index]['organisation_name'] + ' ' + this.postcode[index]['department_name']
      this.data.town = this.zipResponce.town
      this.data.state = this.zipResponce.traditional_county
      this.validate()
      this.showDeliveryForm = 1
      this.lockForm = 1
      // this.validateButton()
    },
    commitAddress: function () {
      this.disableFields = true
      if (!this.validate()) {
        return false
      }
      this.data.address_type = this.type
      this.$store.dispatch('updateAddress', this.data)
      if (this.regdata.some_billship_addr) {
        this.next_tick(2)
      }
    },
    changeBillAddress: function () {
      if (this.type === 'delivery') {
        this.order.reg_country_id = this.data.country_id
        this.selectCountry()
      }
    },
    chkEmpty: function (param) {
      return (param === undefined || param === null || param === '')
    },
    changeFormVisibleUk: function () {
      // if ((this.data.country_id === 223 || this.data.country_id === '223') && (this.data.line1 === undefined || this.data.line1 === '') &&
      //   (this.data.line2 === undefined || this.data.line2 === '') && (this.data.town === undefined || this.data.town === '') &&
      //   (this.data.state === undefined || this.data.state === '')) {
      if ((this.data.country_id === 223 || this.data.country_id === '223') && this.chkEmpty(this.data.line1) && this.chkEmpty(this.data.line2) && this.chkEmpty(this.data.town) && this.chkEmpty(this.data.state)) {
        this.showDeliveryForm = 2
      } else {
        this.showDeliveryForm = 1
      }
      this.debugLog('changeFormVisibleUk',
        {
          'this.data.country_id === 223 && (this.data.line1 === undefined || this.data.line1 === "")': this.data.country_id === 223 && (this.data.line1 === undefined || this.data.line1 !== ''),
          '(this.data.line2 === undefined || this.data.line2 === "") && (this.data.town === undefined || this.data.town === "")': (this.data.line2 === undefined || this.data.line2 === '') && (this.data.town === undefined || this.data.town === ''),
          'this.showDeliveryForm': this.showDeliveryForm,
          'this.data.country_id': this.data.country_id,
          'this.data.line1': this.data.line1,
          'this.data.line2': this.data.line2,
          'this.data.town': this.data.town,
          'this.data.state': this.data.state
        })
    },
    findZipCode: function () {
      this.showAdressessSelectBlock = false
      this.lockForm = 0
      this.showDeliveryForm = 2
      // this.findZipCodeProxy()
      const postcode = Vue.resource(config.checkout.zipCodeGetUrl)
      var self = this
      postcode.get({
        'key': '19f53-c5f85-27aa4-01584',
        'postcode': this.data.zip
      }).then((resp) => {
        if (resp.data.delivery_points) {
          this.showAdressessSelectBlock = true
          this.postcode = resp.data.delivery_points
          this.zipResponce = resp.data

          this.errors.zip = null
        } else {
          this.errors.zip = resp.data.error_msg
        }
      }, (err) => (console.log(err)))
    },
    findZipCodeProxy: function () {
      const postcode = Vue.resource(config.checkout.zipCodeGetUrlProxy + this.data.zip)
      var self = this
      postcode.get({
        // 'postcode': this.data.zip
      }).then((resp) => {
        self.data.town = resp.data.town
        self.data.state = resp.data.traditionalCounty
        self.postcode = resp.data.data
      }, (err) => (console.log(err)))
    },
    commitEvent: function () {
      if (!this.validate()) {
        return false
      }
      window.globalEvents.$emit('commitParams')
      this.disableFields = true
    },
    changeVisiblToParrnet: function () {
      this.changeVisiblDelivery(this.regdata.some_billship_addr)
      this.showButton = this.regdata.some_billship_addr
      // this.disableFields = true
    },
    validRegex: function (object, field, validatorRegex, errorMessage) {
      if (!object[field] || object[field] === '' || !validatorRegex.test(object[field])) {
        this.errors[field] = errorMessage
      } else {
        this.errors[field] = null
      }
    },
    validEmpty: function (object, field, errorMessage) {
      if (!object[field] || object[field] === '') {
        this.errors[field] = errorMessage
      } else {
        this.errors[field] = null
      }
    },
    validateZip: function () {
      if (!this.data.zip || this.data.zip === '') {
        this.errors.zip = 'Please type your zip code'
      } else if (this.data.zip !== '' && (this.data.line1 === '' || this.data.line1 === null) && this.regCountry === 'GB') {
        this.errors.zip = 'Please press find button and choose address'
      } else {
        this.errors.zip = null
      }
    },
    validate: function () {
      var credRegex = /^[a-zA-Zа-яА-Я0-9,.'-]{1,}.*$/i
      this.validateZip()
      this.validRegex(this.data, 'line1', credRegex, 'Please enter your address')
      // this.validRegex(this.data, 'town', credRegex, 'Please enter your city')
      // this.validRegex(this.data, 'state', credRegex, 'Please enter your state')
      // this.validEmpty(this.data, 'line1', 'Please enter your address')
      this.validEmpty(this.data, 'town', 'Please enter your city')
      this.validEmpty(this.data, 'state', 'Please enter your state')
      for (var key in this.errors) {
        if (this.errors[key] !== null && !(this.errors[key] instanceof Array)) {
          return false
        }
      }
      return true
    },
    validateButton: function () {
      for (var key in this.errors) {
        if (this.errors[key] !== null && !(this.errors[key] instanceof Array)) {
          // return this.disabledNextButton = true
        }
      }
      this.disabledNextButton = false
    },
    showForm: function (form) {
      this.lockForm = 1
      this.showDeliveryForm = form
    },
    enablePrevStep: function () {
      this.disableFields = false
      this.showDeliveryForm = 1
    },
    deletePrevStep: function () {
      this.disableFields = false
      if (this.activePostCodeId !== 'nan' || !this.data.zip) {
        this.activePostCodeId = 'nan'
        this.lockForm = 0
        this.defaultShowDeliveryForm = null
        this.data.line1 = ''
        this.data.line2 = ''
        this.data.zip = ''
        this.data.town = ''
        this.data.state = ''
        this.regdata.some_billship_addr = true
        // this.showButton = true
      }
      this.regdata.some_billship_addr = true
      this.showButton = true
      // if ((this.data.zip && this.type === 'billing') || !this.show_delivery) {
      //   this.showButton = false
      // }
      // this.showDeliveryForm = 1
    },
    setBillShipAddressCheckBox: function (value) {
      this.some_billship_addr = value
      this.changeVisiblToParrnet()
    }
  },
  created: function () {
    this.regdata.some_billship_addr = true
    this.defaultShowDeliveryForm = this.showDeliveryForm
    window.globalEvents.$on('commitParams', () => (this.commitAddress()))
    window.globalEvents.$on('enableFields', () => (this.enablePrevStep()))
    window.globalEvents.$on('deleteFields', () => (this.deletePrevStep()))
    window.globalEvents.$on('setBillShipAddressCheckBox', (value) => (this.setBillShipAddressCheckBox(value)))
  },
  mounted: function () {
    this.changeFormVisibleUk()
  },
  watch: {
    data: {
      handler: function (changed) {
        this.changeFormVisibleUk()
      },
      deep: true
    },
    errors: {
      handler: function (changed) {
        this.validateButton()
      },
      deep: true
    }
  }
}
