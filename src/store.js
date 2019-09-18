import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import { sha256 } from 'js-sha256'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth:{
      login: '',
      password: '',
      error: '',
      autorized:{value: false, reason: ''}
    }
  },
  getters:{
    getLogin(state){
      return state.auth.login
    },
    getPassword(state){
      return state.auth.password
    },
    getAuthstate(state){
      return state.auth.autorized
    }
  },
  mutations: {
    setLogin(state, val){
      state.auth.login = val
    },
    setPassword(state, val){
      state.auth.password = val
    },
    setError(state, val){
      state.auth.error = val
    },
    setAuthorized(state,val){
      state.auth.autorized.value = val.result
      state.auth.autorized.reason = val.reason
    }

  },
  actions: {
    fetchAuthData: async function(store){
      return new Promise(async function(resolve, reject){
        await fetch(`http://localhost:8080/auth`, 
        {method: `POST`, 
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
          login: store.getters.getLogin,
          password: sha256(store.getters.getPassword)})
      })
        .then((response) => {return response.json()})
        .then((authData) => {
            resolve(authData)
        }).catch((err) => {
            console.log(err)
        })
      }).then(fres => {
        if (fres.result){
          store.commit('setAuthorized', fres)
          router.push('/main');
        }
      })
      
    },
  },
  strict: process.env.NODE_ENV !== 'production'
});
