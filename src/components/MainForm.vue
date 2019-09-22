<template>
    <div class="mt-3">
        <div class="d-flex flex-row justify-content-end">
            <h3>{{activeUserName}}</h3>
            <b-button class="a" variant="success" @click="backToMain">Выход</b-button>
            <hr>
        </div>

        <div class="newtask">
            <b-button variant="success" @click="startNewTask">Новая задача</b-button>
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
                <b-button variant="primary" v-if = "!isNotBoss" @click="people">По ответсвенным</b-button>
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
                <tr class="table table-bordered customize" v-for="(item, i) in allTasks" :key="item.id" 
                v-if="allTasks.length" @click="change(item.id)">
                    <td :class="clorize(item.date_end, item.status)">{{item.title}}</td>
                    <td>{{item.prior_name}}</td>
                    <td>{{item.date_end}}</td>
                    <td>{{item.performer_name}}</td>
                    <td>{{item.stat_name}}</td>
                </tr>
            </table>
        </div>
        <b-modal 
            v-model="modalShow"
            :title="mode.title"
            size="lg"
            ok-title="Готово"
            cancel-title="Отмена"
            @show="show"
            @ok="send">
            
            <b-form>
                <b-form-group
                    id="Title"
                    label="Название задачи:"
                    label-for="input-title"
                >
                    <b-form-input
                        id="input-title"
                        type="text"
                        :disabled = "rigths"
                        v-model="newtask.title"
                        required
                        placeholder="Введите название задачи"
                        ></b-form-input>
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
                        :disabled = "rigths"
                        rows="3"
                        max-rows="6"
                        >
                    </b-form-textarea>
                </b-form-group>

                <b-form-group id="Options">
                    <label for="priority">Приоритет:</label> 
                    <b-form-select id="priority" :disabled = "rigths" v-model="newtask.priority">
                        <option v-for="(item, i) in prioritys" :value="item.id">{{item.prior_name}}</option>
                    </b-form-select>
                     <label for="status">Статус:</label>
                    <b-form-select id="status" v-model="newtask.status">
                        <option v-for="(item, i) in statuses" :value="item.id">{{item.stat_name}}</option>
                    </b-form-select>
                </b-form-group>

                <b-form-group id="Options">
                    <label for="priority">Создатель:</label>
                    <b-form-select id="input-creator" disabled v-model="newtask.creator">
                        <option v-for="(item, i) in boss" :value="item.id">{{item.lastname + ' ' + item.firstname}}</option>
                    </b-form-select>
                     <label for="performer">Исполнитель:</label> 
                     <b-form-select id="performer" :disabled = "rigths" v-model="newtask.performer">
                        <option v-for="(item, i) in empls" :value="item.id">{{item.lastname + ' ' + item.firstname}}</option>
                    </b-form-select>
                </b-form-group>


                <b-form-group id="Dates">
                    <label for="input-dateSt">Дата начала:</label>{{newtask.dateSt}}
                    <b-form-input id="input-dateSt" :disabled = "rigths" type="date" v-model="newtask.dateSt"></b-form-input>

                     <label for="input-dateSt">Дата завершения:</label>
                    <b-form-input id="input-dateSt" :disabled = "rigths" type="date" v-model="newtask.dateEnd"></b-form-input>

                     <label for="input-dateSt">Дата обновления:</label>
                    <b-form-input id="input-dateSt" disabled type="date" v-model="newtask.dateUp"></b-form-input>
                </b-form-group>
            </b-form> 
        </b-modal>
    </div>
</template>
<style>
    .customize:hover{
        cursor: pointer;
    }
    .isDone{
        color: green;
    }
    .outOfDate{
        color: red;
    }
    .allOthers{
        color: gray;
    }
</style>

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
        this.$store.dispatch('fetchBoss');
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
            boss: 'getBoss',
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
        },
        rigths(){
            if (this.user.position == 0){
                if (this.mode.val == 'create'){
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        }
    },
    data(){
        return {
            selected: '',
            mode: {title: 'Новая задача', val: 'create'} ,
            modalShow: false,
            newtask:{
                id: '',
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
        startNewTask(){
            this.newtask.creator = this.activeUser;
            this.newtask.id = '';
            this.newtask.title = '';
            this.newtask.description = '';
            this.newtask.dateSt ='';
            this.newtask.dateEnd ='';
            this.newtask.priority =null;
            this.newtask.status = null;
            this.newtask.performer =null;
            this.mode.val = 'create';
            this.mode.title = 'Новая задача'
            this.modalShow = true;
        },
        send(){
            if (this.allDataFull){
                if (this.mode.val == 'create'){
                    this.$store.dispatch('fetchNewTask',this.newtask);
                    this.$store.dispatch('fetchTaskList',this.selected);
                }
                if (this.mode.val == 'change'){
                    this.$store.dispatch('fetchChangeTask',this.newtask);
                    this.$store.dispatch('fetchTaskList',this.selected);
                }
            } else {
                alert('Не все данные заполнены')
            }
        },
        show(){
            let now = new Date(Date.now());
            let day = now.getDate();
            let month = now.getMonth()+1;
            month < 10? month='0'+month: month
            let year = now.getFullYear();
            this.newtask.dateUp = year + '-' + month + '-' + day;
            console.log(this.mode.val)
        },
        change(id){
            let res = this.allTasks.find(item => item.id == id)
            console.log(res)
            this.newtask.id = res.id
            this.newtask.title = res.title;
            this.newtask.description = res.description;
            this.newtask.dateSt = res.date_st;
            this.newtask.dateEnd = res.date_end;
            this.newtask.priority = res.priority;
            this.newtask.status = res.status;
            this.newtask.creator = res.creator;
            this.newtask.performer = res.performer;
            this.mode.val = 'change';
            this.mode.title = 'Редактирование задачи'
            this.modalShow = true;
        },
        clorize(date, status){
            if (status == 3){
                return 'isDone'
            }
            
            let now = new Date(Date.now());
            let day = now.getDate();
            let month = now.getMonth()+1;
            month < 10? month='0'+month: month
            let year = now.getFullYear();
            let today = year + '-' + month + '-' + day;
            let taskDate = new Date(date)
            let nowDate = new Date(today)
            if (taskDate < nowDate){
                return 'outOfDate'
            } else {
                return 'allOthers'
            }
        },
        without(){
            this.selected = 'without';
            this.$store.dispatch('fetchTaskList',this.selected)
        },
        today(){
            this.selected = 'today';
            this.$store.dispatch('fetchTaskList',this.selected)
        },
        week(){
            this.selected = 'week';
            this.$store.dispatch('fetchTaskList',this.selected)
        },
        future(){
            this.selected = 'future';
            this.$store.dispatch('fetchTaskList',this.selected)
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