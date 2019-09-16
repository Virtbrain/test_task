<template>
    <div class="d-flex justify-content-center align-items-center autorize">
        <b-form-group 
            id="mainFieldset"
            description="Введите авторизацонные данные."
            >
            <b-form-group
                id="fieldset-1"
                label="Логин"
                label-cols="4"
                label-cols-lg="3"
                label-for="input-login">
                <b-form-input id="input-login" v-model="name" trim></b-form-input>
            </b-form-group>

            <b-form-group
                id="fieldset-2"
                label="Пароль"
                label-cols="4"
                label-cols-lg="3"
                label-for="input-pwd">
                <b-form-input id="input-pwd" v-model="password" type="password" trim></b-form-input>
            </b-form-group>
            <b-button variant="success" @click="confirmUser">Подтвердить</b-button>
        </b-form-group>
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
import { BCard } from 'bootstrap-vue'
import { sha256 } from 'js-sha256';
import router from 'vue-router';
export default {
    components:{
        BFormGroup,
        BFormInput,
        BButton,
        BCard
    },
    computed:{
        sha(){
            return sha256(this.password);
        }
    },
    data(){
        return {
            name: '',
            password: ''
        }
    },
    methods:{
        confirmUser(){
            this.$router.push('/main')
        }
    }
}
</script>