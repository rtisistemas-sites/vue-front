import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import pt from 'vuetify/es5/locale/pt'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt'
  },
  icons: {
    iconfont: 'md'
  },
  theme: {
    themes: {
      light: {
        primary: colors.teal.darken2
      },
      dark: {
        primary: colors.teal.lighten1
      }
    },
    dark: true
  }
})
