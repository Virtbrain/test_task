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
    empls:[],
    prioritys:[],
    statuses:[],
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
    },
    getPrior(state){
      return state.prioritys
    },
    getStatuses(state){
      return state.statuses
    },
    getEmpls(state){
      return state.empls
    },
    getActiveUserId(state){
      return state.user.id
    },
    getTasks(state){
      return state.tasks
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
    },
    setStatuses(state, val){
      state.statuses = val
    },
    setPrioritys(state, val){
      state.prioritys = val
    },
    setEmpls(state, val){
      state.empls = val
    },
    setTasks(state,val){
      state.tasks = val
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
      }).then((response) => {return response.json()})
        .then((authData) => {
            resolve(authData)
        }).catch((err) => {
            console.log(err)
        })
      }).then(fres => {
        if (fres.status == 'success'){
          store.commit('setUser', fres.user)
          store.commit('setAuthorized', fres)
          router.push('/main');
        } else {
          store.commit('setAuthorized', fres)
        }
      })
    },
    fetchStatuses: async function(store){
      return new Promise(async function(resolve, reject){
        await fetch('http://localhost:8085/stat',
        {method: 'POST'})
        .then((response)=>{
          return response.json()
        }).then((data)=>{
          resolve(data)
        }).catch((err)=>{
          console.log(err)
        })
      }).then((statuses)=>{
        store.commit('setStatuses', statuses)
      })
    },
    fetchPrioritys: async function(store){
      return new Promise(async function(resolve, reject){
        await fetch('http://localhost:8085/prior',
        {method: 'POST'})
        .then((response)=>{
          return response.json()
        }).then((data)=>{
          resolve(data)
        }).catch((err)=>{
          console.log(err)
        })
      }).then((prioritys)=>{
        store.commit('setPrioritys', prioritys)
      })
    },
    fetchEmpls: async function(store){
      return new Promise(async function(resolve, reject){
        await fetch('http://localhost:8085/empls',
        {method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
          id: store.getters.getUser.id
        })
      })
        .then((response)=>{
          return response.json()
        }).then((data)=>{
          resolve(data)
        }).catch((err)=>{
          console.log(err)
        })
      }).then((empls)=>{
        store.commit('setEmpls', empls)
      })
    },
    fetchTaskList: async function(store,payload){
      return new Promise(async function(resolve, reject){
        await fetch(`http://localhost:8085/tasks`, 
        {method: `POST`,
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
          id: store.getters.getActiveUserId,
          type:payload})
        })
        .then((response) => {return response.json()})
        .then((tasklist) => {
            resolve(tasklist)
        }).catch((err) => {
            console.log(err)
        })
      }).then(tasks => {
          store.commit('setTasks', tasks)
      })
    },
    fetchNewTask: async function(store,payload){
      return new Promise(async function(resolve, reject){
        await fetch('http://localhost:8085/newt',
        {method: `POST`, 
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
          payload
          })
        }).then((response) => {return response.json()})
          .then((status) => {
            resolve(status)
        }).catch((err) => {
            console.log(err)
        })
      }).then(status => {
        console.log(status.status)
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
