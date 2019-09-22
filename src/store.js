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
    boss:[],
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
    },
    getBoss(state){
      return state.boss
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
      state.empls.push({id: state.user.id, fathername: state.user.fathername, firstname: state.user.firstname, lastname: state.user.lastname})
    },
    setTasks(state,val){
      //console.log(val)
      val.forEach(item=>{
        let day = item.date_st.slice(8,10)
        let dayint = Number(day)+1
        item.date_st = item.date_st.slice(0,8);
        item.date_st = item.date_st + dayint;

        day = item.date_up.slice(8,10)
        dayint = Number(day)+1
        item.date_up = item.date_up.slice(0,8);
        item.date_up = item.date_up + dayint;

        day = item.date_end.slice(8,10)
        dayint = Number(day)+1
        item.date_end = item.date_end.slice(0,8);
        item.date_end = item.date_end + dayint;
      })
      state.tasks = val
    },
    setBoss(state,val){
      state.boss = val
      state.boss.push({id: state.user.id, fathername: state.user.fathername, firstname: state.user.firstname, lastname: state.user.lastname})
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
    fetchBoss: async function(store){
      return new Promise(async function(resolve, reject){
        await fetch('http://localhost:8085/boss',
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
      }).then((boss)=>{
        store.commit('setBoss', boss)
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
    },
    fetchChangeTask: async function(store,payload){
      return new Promise(async function(resolve, reject){
        await fetch('http://localhost:8085/changet',
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
