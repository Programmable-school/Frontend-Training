import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Firebase
import { firebaseConfig } from '@/repository/firebaseConfig'
import firebase from 'firebase/app'
import 'firebase/firestore'

// Vuetify
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

// Firebase
firebase.initializeApp(firebaseConfig)
firebase.firestore.FieldValue.serverTimestamp()

// Vuetify
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base,
    theme: '#5982EE',
    background: '#ffffff',
    whiteCloud: '#F8F9FB',
    grayTheme: '#79838C',
    blueTheme: '#5982EE',
    sky: '#A2DCED',
    sea: '#698FF0',
    blackFlat: '#202223',
    twitter: '#00aced',
    facebook: '#305097',
    line: '#5ae628',
    gold: '#FFD700',
    goldenrod: '#DAA520',
    red: '#F26964',
    error: '#F26964',
    succcess: '#698FF0',
  },
  options: {
    themeVariations: ['original', 'secondary'],
  },
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
