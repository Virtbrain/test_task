import Vue from 'vue'
import VueRouter from 'vue-router';
// import store from './store.js'

Vue.use(VueRouter);

import Autorization from './components/Autorization';
import MainFrom from './components/MainForm';

let routes = [
  {
    path: '/',
    redirect: '/authorization'
  },
  {
    name: 'authorization',
    path: '/authorization',
    component: Autorization
  },
  {
    name: 'main',
    path: '/main',
    component: MainFrom,
  }
];
let router =  new VueRouter({
  mode: 'history',
  routes
});

export default router;
