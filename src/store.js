import Vue from 'vue'
import Vuex from 'vuex'
// import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autorize:{login:'',pwd:''}
  },
  getters:{
    getAuthData(state){
      return state.autorize;
    }
  },
  mutations: {
    writeAuth(state, {login, pwd}){
      state.autorize.login = login;
      state.autorize.pwd = pwd;
    }

  },
  actions: {
    fetchAuthData: async function(store){
      return new Promise(async function(resolve, reject){
        let res = await  fetch(`http://localhost/auth`, {method: `POST`})
        .then((response) => {return response.json();})
        .then((authData) => {
            resolve(JSON.stringify(authData))
        }).catch((err) => {
            console.err(err)
        })
        store.commit('writeAuth',{res})
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
