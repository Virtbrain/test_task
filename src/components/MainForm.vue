<template>
    <div class="mt-3">
        <div class="header">
            <h3>{{userName}}</h3>
            <hr>
        </div>

        <div class="newtask">
            <b-button variant="success">Новая задача</b-button>
            <hr>
        </div>
        <div>
            <h5 class="text-center">Группирование: {{grouped}}</h5>
            <div class="d-flex flex-row justify-content-around">
                <b-button variant="primary" @click="without">Без гурппировок</b-button>
                 <b-dropdown id="dropdown-1" text="По дате завершения" variant="primary">
                    <b-dropdown-item @click="today">На сегодня</b-dropdown-item>
                    <b-dropdown-item @click="week">На неделю</b-dropdown-item>
                    <b-dropdown-item @click="future">На будущее</b-dropdown-item>
                </b-dropdown>
                <!-- <b-button variant="primary" @click="dateOfEnd">По дате завершения</b-button> -->
                <b-button variant="primary" :disabled = "isNotBoss" @click="people">По ответсвенным</b-button>
            </div>
        </div>
        <div class="d-flex flex-column">
            <br>
            <table>
                <tr class="table table-bordered text-center">
                    <th>Заголовок</th>
                    <th>Приоритет</th>
                    <th>Дата окончания</th>
                    <th>Ответсвенный</th>
                    <th>Статус</th>
                </tr>
                <tr>

                </tr>
            </table>
        </div>
        <!-- {{mainForm}} -->
        <!-- <b-button variant="success" @click="backToMain">Вернуться</b-button> -->
    </div>
</template>

<script>

import { BButton } from 'bootstrap-vue'
import { BDropdown } from 'bootstrap-vue'
import { BDropdownItem } from 'bootstrap-vue'

import {mapGetters, mapMutations, mapState} from 'vuex';
export default {
    created(){
        this.selected = 'without';
    },
    components:{
        BButton,
        BDropdown,
        BDropdownItem
    },
    computed:{
        ...mapGetters({
            user: 'getUser',
            tasks: 'getTasks'
        }),
        grouped(){
            switch(this.selected){
                case 'without': return "Без группировки";
                case 'today': return "На сегодня";
                case 'week': return "На неделю";
                case 'future': return "На будущее";
                case 'people': return "По ответсвенным";
            }

        },
        isNotBoss(){
            return this.user.position == 0
        },
        userName(){
            let fullanme = this.user.firstname + ' ' + this.user.lastname
            let position = this.user.position == 1 ? 'Руководитель' : 'Разработчик'
            return  fullanme + ' - ' + position;
        },
    },
    data(){
        return {
            selected: ''
        }
    },
    methods:{
        without(){
            this.selected = 'without';
        },
        today(){
            this.selected = 'today';
        },
        week(){
            this.selected = 'week';
        },
        future(){
            this.selected = 'future';
        },
        people(){
            this.selected = 'people'
        }
        // backToMain(){
        //     this.$router.push('/')
        // }
    }
}
</script>