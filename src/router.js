import Vue from 'vue'
import VueRouter from 'vue-router';

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
    component: MainFrom
  }
];

export default new VueRouter({
  mode: 'history',
  routes
})
