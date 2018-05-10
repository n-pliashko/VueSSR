import { createApp } from './main.js'

// client-specific bootstrapping logic...

const {app, store} = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// this assumes App.vue template root element has `id="app"`
app.$mount('#app')
