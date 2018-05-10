import PageHeader from '@/components/scripts/PageHeader/index.vue'
import Breadcrumbs from '@/components/scripts/Breadcrumbs/index.vue'
import OffersModal from '@/components/scripts/Products/CheapGlasses/OffersModal/index.vue'
import Pagination from '@/components/scripts/Pagination/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import ShareButtons from '@/components/scripts/ShareButtons/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'

import { mapState } from 'vuex'
import config from '@/../config'
let Handlebars = require('handlebars/dist/handlebars.min.js')

export default {
  name: 'CheapGlasses',
  data () {
    return {
      cdnUrl: config.cdnUrl,
      cdnUrlPrefix: config.cdnUrlPrefix,
      previousRequest: null,
      layout: false,
      modalData: {},
      loading: true,
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true
      },
      items: {
        data: [],
        total: 0
      },
      scrollLoad: false,
      pagination: {
        currentPage: 1,
        skip: 0,
        limit: 60
      }
    }
  },
  components: {
    PageHeader,
    Breadcrumbs,
    OffersModal,
    Pagination,
    TrustpilotWidget,
    ShareButtons,
    PageFooter,
    ScrollToTop
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      breadcrumbs: (state) => state.breadcrumbs,
      backRoute: (state) => state.backRoute,
      routerObj: (state) => state.pageMenuDescription,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack,
      vat: (state) => state.vat
    })
  },
  head: {
    title: function () {
      let title = 'SelectSpecs'
      if (this.routerObj.page && this.routerObj.page.translations['en']) {
        title = this.routerObj.page.translations['en'].meta_title
      }
      if (this.routerObj.catalogue && this.routerObj.catalogue.translations['en']) {
        title = this.routerObj.catalogue.translations['en'].meta_title
      }
      title = title !== null && title.length > 0 ? this.convertMenuContext(title) : 'SelectSpecs'
      const textarea = document.createElement('div')
      textarea.innerHTML = title
      title = textarea.innerText
      return {
        inner: title
      }
    },
    link: function () {
      let link = window.location.protocol + '//' + window.location.host + window.location.pathname
      let links = [
        {
          rel: 'canonical',
          href: link
        },
        {
          rel: 'next',
          href: link + '?page=' + (parseInt(this.pagination.currentPage) + 1),
          id: 'next'
        }
      ]
      if (parseInt(this.pagination.currentPage) > 1) {
        links.push({
          rel: 'prev',
          href: link + '?page=' + (parseInt(this.pagination.currentPage) - 1),
          id: 'prev'
        })
      }
      return links
    }
  },
  mounted () {
    if (this.$route.query.page) {
      this.pagination.currentPage = this.$route.query.page
      this.pagination.skip += (this.pagination.currentPage - 1) * this.pagination.limit
    }
    this.loadItems()
  },
  created () {
    document.body.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    document.body.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    convertMenuContext (context) {
      let self = this
      Handlebars.registerHelper('exchange_price', function (value, rate = false) {
        let price = 0
        if (value) {
          price = self.exchange(value)
        }
        if (rate) {
          price = parseFloat(price).toFixed(parseInt(rate))
        }
        return price
      })
      let templateFn = Handlebars.compile(context)
      let output = templateFn(this)
      return output
    },
    loadItems (append = false) {
      let self = this
      if (!append) {
        this.loading = true
      }
      let data = {
        skip: self.pagination.skip,
        limit: self.pagination.limit
      }

      if (this.routerObj.catalogue && Object.values(this.routerObj.catalogue.filters).length > 0) {
        Object.assign(data, {filters: Object.values(this.routerObj.catalogue.filters)})
      }

      let requestOpt = {
        before (request) {
          if (self.previousRequest) {
            self.previousRequest.abort()
          }
          self.previousRequest = request
        }
      }
      return this.$axios.post(this.apiHost + config.prefix + config.products.cheapGlasses, data, Object.assign({}, requestOpt, this.requestOptions)).then(response => response.data)
        .then(json => {
          if (json.items) {
            if (append && self.items.data) {
              self.items.data = Object.assign({}, self.items.data, json.items)
            } else {
              self.items.data = json.items
            }
            self.items.total = json.total
          }
        })
        .then(() => { this.loading = false })
        .catch(res => {
          return res
        })
    },
    handleScroll (event) {
      let self = this
      let el = document.querySelector('.shop-item:last-child')
      if (el && !this.loading && !this.scrollLoad && document.body.scrollTop >= el.offsetTop - el.offsetHeight) {
        if (this.pagination.skip + this.pagination.limit < this.items.total) {
          this.pagination.skip += this.pagination.limit
          self.scrollLoad = true
          this.loadItems(true).then(() => { self.scrollLoad = false })
        }
      }
    },
    chooseLenses (id) {
      console.log('choose Lenses:::', id)
      let item = this.items.data[id]
      let option = Object.values(item.options)[0]
      let frameSize = option.frame_sizes[0]
      let data = {
        'item_number': item.item_number,
        'quantity': 1,
        'supplier_name': item.supplier_name,
        'ordered_item_type': 'ordinary',
        'option': {
          order: option.option_order,
          price_retailer: option.price_retailer,
          price_old: option.price_old,
          price: option.price,
          status: option.status,
          is_out_of_stock: option.is_out_of_stock,
          featured: option.featured,
          discontinued: option.discontinued,
          name: option.name,
          description: option.description,
          lang: option.lang,
          image_src: option.thumbnail_images.length > 0 ? option.thumbnail_images[0].src : null,
          image_type: option.thumbnail_images.length > 0 ? 'THUMBNAIL' : null,
          image_order: option.thumbnail_images.length > 0 ? option.thumbnail_images[0].image_order : null,
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
          special_name: option.option_specials.special_name,
          special_discount: option.option_specials.special_discount,
          special_discount_percent: option.option_specials.special_discount_percent,
          option_number: option.option_number
        }
      }
      this.$store.dispatch('addItemToBasket', data)
    },
    showFullsizeImage (id) {
      let item = this.items.data[id]
      this.modalData = item.options[item.def_option]
    },
    convertPrice: function (price) {
      try {
        return this.calculatePrice(price)
      } catch (e) {
        return parseFloat(this.calculatePrice(price)).toFixed(2)
      }
    }
  },
  watch: {
    'pagination.currentPage': {
      handler: function () {
        this.loadItems()
      },
      deep: true
    },
    'routerObj': {
      handler: function () {
        this.loadItems()
      },
      deep: true
    }
  }
}
