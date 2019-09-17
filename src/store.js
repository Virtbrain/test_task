import Vue from 'vue'
import Vuex from 'vuex'
// import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autorize:{login:'',pwd:''},
    error:''
  },
  getters:{
    getAuthData(state){
      return state.autorize;
    },
    getError(state){
      return state.error;
    }
  },
  mutations: {
    writeAuth(state, {login, pwd}){
      state.autorize.login = login;
      state.autorize.pwd = pwd;
    },
    writeError(state, error){
      state.error = error;
    }

  },
  actions: {
    fetchAuthData: async function(store){
      return new Promise(async function(resolve, reject){
        let res = await  fetch(`http://localhost/auth`, 
        {method: `POST`, 
        headers:{'Content-Type': 'application/json'},
        body:{
          login:store.getters.getAuthData(state).login,
          password: store.getters.getAuthData(state).pwd}
      })
        .then((response) => {return response.json();})
        .then((authData) => {
            resolve(JSON.stringify(authData))
        }).catch((err) => {
            store.commit('')
        })
        store.commit('writeError',err)
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
