import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { errorHandler } from '@/utils'
import '@/plugins/vuelidate.js'
import vuetify from '@/plugins/vuetify'
import '@/plugins/moment'

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
