<template>
    <div class="d-flex justify-content-center align-items-center autorize flex-column">
        <b-form-group 
            id="mainFieldset">
            <b-form-group
                id="fieldset-1"
                label="Логин"
                label-cols="4"
                label-cols-lg="3"
                label-for="input-login">
                <b-form-input id="input-login" @update="onLoginInput($event)" trim></b-form-input>
            </b-form-group>

            <b-form-group
                id="fieldset-2"
                label="Пароль"
                label-cols="4"
                label-cols-lg="3"
                label-for="input-pwd">
                <b-form-input id="input-pwd" type="password" @update="onPwdInput($event)" trim></b-form-input>
            </b-form-group>
            <div v-if="this.$store.state.auth.autorized.status == `error`" class="text-danger">
                Ошибка: {{this.$store.state.auth.autorized.reason}}
            </div>
        </b-form-group>
         <b-button variant="success" @click="logIn">Войти</b-button>
    </div>
</template>

<style>
.autorize{
  margin-top: 50px;
}
</style>

<script>
import BootstrapVue from 'bootstrap-vue'
import { BFormGroup } from 'bootstrap-vue'
import { BFormInput } from 'bootstrap-vue'
import { BButton } from 'bootstrap-vue'
import { BCard } from 'bootstrap-vue';

import {mapGetters, mapMutations, mapState} from 'vuex';
export default {
    components:{
        BFormGroup,
        BFormInput,
        BButton,
        BCard
    },
    computed: {
        ...mapGetters(['getAuthstate'])
        },
    data(){
        return {
        }
    },
    methods:{
        ...mapMutations(['setLogin','setPassword']),
        onLoginInput(e){
            this.setLogin(e)
        },
        onPwdInput(e){
            this.setPassword(e)
        },
        logIn(){
            //console.log(this.getAuthstate.reason)
            this.$store.dispatch('fetchAuthData')
        }
    }
}
</script>