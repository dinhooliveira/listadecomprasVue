import Vue from 'vue'
import VueRouter from "vue-router";
Vue.use(VueRouter);


import Home from './Home.vue'
import ListaDetalhe from "./ListaDetalhe";
import Lista from "./Lista";


Vue.config.productionTip = false

const routes = [
  { path: '/', component: Home },
  { path: '/Lista', component: Lista },
  { path: '/detalhe/:id', component: ListaDetalhe },

];

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
});

new Vue({
  el: '#app',
  router: router,
  render: h => h('router-view')
})
