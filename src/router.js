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
    // meta: {
    //   requiresAuth: true
    // }
  }
];
let router =  new VueRouter({
  mode: 'history',
  routes
});

// router.beforeEach((to, from, next)=>{
//   if(to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.state.getAuthstate()){
//       next('/authorization')
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

export default router;
