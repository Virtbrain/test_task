<template>
    <div class="mt-3">
        <div class="header">
            <h3>{{activeUserName}}</h3>
            <hr>
        </div>

        <div class="newtask">
            <b-button variant="success" @click="modalShow = !modalShow">Новая задача</b-button>
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
                <tr class="table table-bordered" v-for="(item, i) in allTasks" :key="i" v-if="allTasks.length">
                    <td>{{item.title}}</td>
                    <td>{{item.prior_name}}</td>
                    <td>{{item.date_end}}</td>
                    <td>{{item.performer_name}}</td>
                    <td>{{item.stat_name}}</td>
                </tr>
            </table>
        </div>
        <!-- Добавить превент на закрытие -->
        <b-modal 
            v-model="modalShow"
            title="Новая задача"
            size="lg"
            ok-title="Готово"
            cancel-title="Отмена"
            @show="show"
            @ok="send"
            @cancel="cancel">
            
            <b-form>
                <b-form-group
                    id="Title"
                    label="Название задачи:"
                    label-for="input-title"
                >
                    <b-form-input
                        id="input-title"
                        type="text"
                        v-model="newtask.title"
                        required
                        placeholder="Введите название задачи"
                        ></b-form-input>
                         <!-- v-model="form.email" -->
                </b-form-group>
            </b-form> 

            <b-form-group
                    id="Description"
                    label="Описание:"
                    label-for="textarea-description"
                >
                    <b-form-textarea
                        id="textarea-description"
                        v-model="newtask.description"
                        rows="3"
                        max-rows="6"
                        >
                    </b-form-textarea>
                    <!-- v-model="text" -->
                </b-form-group>

                <b-form-group id="Options">
                    <label for="priority">Приоритет:</label>
                    <b-form-select id="priority" v-model="newtask.priority">
                        <option v-for="(item, i) in prioritys" :value="item.id">{{item.prior_name}}</option>
                    </b-form-select>
                     <label for="status">Статус:</label>
                    <b-form-select id="status" v-model="newtask.status">
                        <option v-for="(item, i) in statuses" :value="item.id">{{item.stat_name}}</option>
                    </b-form-select>
                </b-form-group>

                <b-form-group id="Options">
                    <label for="priority">Создатель:</label>
                    <b-form-input id="input-creator" type="text" disabled :value="user.firstname + ' ' + user.lastname"></b-form-input>
                     <label for="performer">Исполнитель:</label>
                     <b-form-select id="performer" v-model="newtask.performer">
                        <option v-for="(item, i) in empls" :value="item.id">{{item.lastname + ' ' + item.firstname}}</option>
                    </b-form-select>
                </b-form-group>


                <b-form-group id="Dates">
                    <label for="input-dateSt">Дата начала:</label>{{newtask.dateSt}}
                    <b-form-input id="input-dateSt" type="date" v-model="newtask.dateSt"></b-form-input>

                     <label for="input-dateSt">Дата завершения:</label>{{newtask.dateEnd}}
                    <b-form-input id="input-dateSt" type="date" v-model="newtask.dateEnd"></b-form-input>

                     <label for="input-dateSt">Дата обновления:</label>{{newtask.dateUp}}
                    <b-form-input id="input-dateSt" disabled type="date" v-model="newtask.dateUp"></b-form-input>
                    <!-- v-model="text" -->
                </b-form-group>
            </b-form> 
            <!-- @submit="onSubmit" @reset="onReset" -->

        </b-modal>
        <!-- {{mainForm}} -->
        <b-button variant="success" @click="backToMain">Вернуться</b-button>
    </div>
</template>

<script>

import { BButton,
         BDropdown,
         BDropdownItem,
         BModal,
         BForm,
         BFormGroup,
         BFormInput,
         BFormTextarea,
         BFormSelect, } from 'bootstrap-vue'

import {mapGetters, mapMutations, mapState} from 'vuex';
export default {
    created(){
        this.selected = 'without';
        this.$store.dispatch('fetchStatuses');
        this.$store.dispatch('fetchPrioritys');
        this.$store.dispatch('fetchEmpls');
        this.$store.dispatch('fetchTaskList','without')
    },
    components:{
        BButton,
        BDropdown,
        BDropdownItem,
        BModal,
        BForm,
        BFormGroup,
        BFormInput,
        BFormTextarea,
        BFormSelect
    },
    computed:{
        ...mapGetters({
            user: 'getUser',
            prioritys: 'getPrior',
            statuses: 'getStatuses',
            empls: 'getEmpls',
            allTasks: 'getTasks',
            activeUser: 'getActiveUserId'
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
        activeUserName(){
            let fullanme = this.user.firstname + ' ' + this.user.lastname
            let position = this.user.position == 1 ? 'Руководитель' : 'Разработчик'
            return  fullanme + ' - ' + position;
        }
    },
    data(){
        return {
            selected: '',
            modalShow: false,
            formConfirm: false,
            newtask:{
                title:'',
                description:'',
                dateUp: '',
                dateSt: '',
                dateEnd: '',
                priority: null,
                status: null,
                creator: null,
                performer:null
            }
        }
    },
    methods:{
        send(){
            this.newtask.creator = this.activeUser;
            this.$store.dispatch('fetchNewTask',this.newtask);
            this.$store.dispatch('fetchTaskList');
        },
        cancel(){

        },
        show(){
            let now = new Date(Date.now());
            let day = now.getDate();
            let month = now.getMonth()+1;
            month < 10? month='0'+month: month
            let year = now.getFullYear();
            this.newtask.dateUp = year + '-' + month + '-' + day;
        },

        without(){
            this.selected = 'without';
            this.$store.dispatch('fetchTaskList','without')
        },
        today(){
            this.selected = 'today';
            this.$store.dispatch('fetchTaskList','today')
        },
        week(){
            this.selected = 'week';
            this.$store.dispatch('fetchTaskList','week')
        },
        future(){
            this.selected = 'future';
            this.$store.dispatch('fetchTaskList','future')
        },
        people(){
            this.selected = 'people'
            this.$store.dispatch('fetchTaskList','people')
        },
        backToMain(){
            this.$router.push('/')
        }
    }
}
</script>