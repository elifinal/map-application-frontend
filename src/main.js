import Vue from 'vue';
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue';
import { ServerTable, ClientTable, Event } from 'vue-tables-2';
import VueGeolocation from 'vue-browser-geolocation';
import VueSweetalert2 from 'vue-sweetalert2';
import VueGoodTablePlugin from 'vue-good-table';
import vSelect from 'vue-select';
import App from './App.vue';
import router from './router';
import store from './store';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(ServerTable);
Vue.use(ClientTable);
Vue.use(Event);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(ModalPlugin);
Vue.use(VueGeolocation);
Vue.use(VueSweetalert2);
Vue.use(VueGoodTablePlugin);
Vue.component('v-select', vSelect);

Vue.config.productionTip = false;
/* eslint-disable */
delete L.Icon.Default.prototype._getIconUrl  
// eslint-disable-next-line
L.Icon.Default.mergeOptions({  
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
