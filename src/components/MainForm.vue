<template>
    <div>
        {{mainForm}}
        <b-button variant="success" @click="backToMain">Вернуться</b-button>
    </div>
</template>

<script>

import { BButton } from 'bootstrap-vue'
export default {
    components:{
        BButton
    },
    data(){
        return {
            mainForm: 'Main Form'
        }
    },
    methods:{
        backToMain(){
            this.$router.push('/')
        }
    }
}
</script>