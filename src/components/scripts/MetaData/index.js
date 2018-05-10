import { mapState } from 'vuex'
let Handlebars = require('handlebars/dist/handlebars.min.js')

export default {
  name: 'metaData',
  computed: {
    ...mapState({
      description: (state) => {
        return state.pageMenuDescription.description ? state.pageMenuDescription.description : ''
      },
      routerObj: (state) => state.pageMenuDescription,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack,
      calculatePrice: (state) => state.calculatePrice
    })
  },
  methods: {
    convertMenuContext (context) {
      let self = this
      Handlebars.registerHelper('exchange_price', function (value, rate = false) {
        let price = 0
        if (value) {
          try {
            price = self.calculatePrice(value)
          } catch (e) {
            price = self.exchange(value)
          }
        }
        if (rate) {
          price = parseFloat(price).toFixed(parseInt(rate))
        }
        return price
      })
      let templateFn = Handlebars.compile(context)
      let output = templateFn(this)
      const textarea = document.createElement('div')
      textarea.innerHTML = output
      output = textarea.innerText
      return output
    }
  },
  head: {
    title: function () {
      let title = ''
      if (this.routerObj.page && this.routerObj.page.translations['en']) {
        title = this.routerObj.page.translations['en'].meta_title
      }
      if (this.routerObj.catalogue && this.routerObj.catalogue.translations['en']) {
        title = this.routerObj.catalogue.translations['en'].meta_title
      }
      title = title !== null && title.length > 0 ? this.convertMenuContext(title) : ''
      return {
        inner: title
      }
    },
    meta: function () {
      let description = ''
      let keywords = ''
      let noindex = 0
      if (this.routerObj.page) {
        if (this.routerObj.page.translations['en']) {
          description = this.routerObj.page.translations['en'].meta_description
          keywords = this.routerObj.page.translations['en'].meta_keywords
        }
        noindex = this.routerObj.page.noindex
      }
      if (this.routerObj.catalogue && this.routerObj.catalogue.translations['en']) {
        description = this.routerObj.catalogue.translations['en'].meta_description
        keywords = this.routerObj.catalogue.translations['en'].meta_keywords
      }
      return [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, user-scalable=no'
        },
        {
          hid: 'description',
          name: 'description',
          content: description !== null && description.length > 0 ? this.convertMenuContext(description) : ''
        },
        keywords !== null && keywords.length > 0 ? {
          hid: 'keywords',
          name: 'keywords',
          content: keywords
        } : {},
        noindex ? {
          name: 'robots',
          content: 'noindex,follow'
        } : {}
      ]
    }
  },
  watch: {
    'routerObj': {
      handler: function () {
        this.$emit('updateHead')
      },
      deep: true
    }
  }
}
