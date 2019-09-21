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
      autorized:{status: 'pending', reason: ''}
    },
    user: {},
    tasks: []

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
    },
    getUser(state){
      return state.user
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
      state.auth.autorized.status = val.status
      state.auth.autorized.reason = val.reason
    },
    setUser(state, val){
      state.user = val
    }

  },
  actions: {
    fetchAuthData: async function(store){
      return new Promise(async function(resolve, reject){
        await fetch(`http://localhost:8085/auth`, 
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
        if (fres.status == 'success'){
          store.commit('setUser', fres.user)
          router.push('/main');
        } else {
          store.commit('setAuthorized', fres)
        }
      })
      
    },
    fetchUserList: async function(store){

    },
    fetchTaskList: async function(store){

    },
    fetchNewTask: async function(store){

    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
