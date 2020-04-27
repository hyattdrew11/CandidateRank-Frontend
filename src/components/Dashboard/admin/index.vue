<template>
  <div id="admin-dashboard" class="container-fluid">
    <b-row no-gutters>
      <div id="admin-menu-container">
        <div id="admin-menu">
          <ul id="admin-menu-list">
            <li v-for="(x, index) in tabs" :class="{active : x == tab }" @click="changeTab(x)">{{ x }}</li>
          </ul>
        </div>
      </div>

      <div id="admin-tabs-container">
        <Setup            
          :class="{'d-none' : tab != 'Setup'}"
          :organization="organization" 
          :user="user" 
          :candidates="candidates" 
          :surveys="surveys" 
          :faculty="faculty" 
        />
        <Ranking
          :class="{'d-none' : tab != 'Ranking'}"
          :organization="organization"
          :user="user"
          :candidates="candidates"
          :surveys="surveys"
          :faculty="faculty" 
        />
        <Schedule
          :class="{'d-none' : tab != 'Schedule'}"
          :organization="organization"
          :user="user"
          :candidates="candidates"
          :surveys="surveys"
          :faculty="faculty" 
        />
        <PreInterview
          :class="{'d-none' : tab != 'Pre-Interview'}"
          :organization="organization"
          :user="user"
          :candidates="candidates"
          :surveys="surveys"
          :faculty="faculty" 
        />
        <InterviewProcess
          :class="{'d-none' : tab != 'Interview Process'}"
          :organization="organization"
          :user="user"
          :candidates="candidates"
          :surveys="surveys"
          :faculty="faculty" 
        />
      </div>
         
    </b-row>

  </div>
</template>

<script>
const currentYear = (new Date()).getFullYear();

const API_URL = process.env.VUE_APP_API_URL

import Setup from './setup/index.vue';
import Ranking from './ranking/index.vue';
import Schedule from './schedule/index.vue';
import PreInterview from './pre-interview/index.vue';
import InterviewProcess from './interview-process/index.vue';

export default {
	name: 'AdminDashboard',
  props: ['user'],
	data() {
    	return {
        tab:  'Setup',
        tabs: ['Setup', 'Ranking','Schedule','Pre-Interview','Interview Process'],
        organization: {
          name: null,
          terms: []
        },
        candidates: null,
        surveys: null,
        faculty: null,
      }
  	},
  	components: {
      Setup,
      Ranking,
      Schedule,
      PreInterview,
      InterviewProcess
    },
    mounted() {
      this.loadDashboard()
    },
  	methods: {
      loadDashboard() {
        this.$Progress.start()
        let org = this.user.Organization
        window.axios.get( API_URL+'/dashboard/admin/'+org+'/'+currentYear)
          .then(({ data }) => { 
              this.organization = data.organization
              this.candidates   = data.candidates
              this.surveys      = data.surveys
              this.faculty      = data.faculty 
          })
           this.$Progress.finish()
          .catch(function (e) {
             this.$Progress.fail()
              alert('Error loading dashboard')
          })
      },
      changeTab(tab) {
        this.tab = tab
      },
      saveWizard() {
        this.$refs['em'].activate()
      },
      saveDate(x , index) {
        this.savedDates.push(x)
        this.interviewDates.splice(index, 1)
      },
      removeDate(x, index) {
        this.interviewDates.splice(index, 1)
      },
      removeSavedDate(x, index) {
        this.savedDates.splice(index, 1)
      },
      onContext(ctx) {
        if(ctx.selectedDate == null) {
          this.context = ctx
        }
        else {
          this.context = ctx
          this.interviewDates.push(ctx)
        }
      }
    }
};
</script>
<style scoped lang="scss">
#admin-menu {
    display: block;
    width: 100%;
    height: 92vh;
    background-color: #EEE;
    margin-left: -15px;
    overflow: hidden;
}
#admin-menu-list {
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    padding-inline-start: 0px;
    text-align: center;
}
 #admin-menu-list  li {
    height: 18.4vh;
    padding: 50px;
    border-bottom: 1px solid #d2d2d2;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
  #admin-menu-list li:hover {
    background-color: #005837a6;
    color: #FFF;
    cursor: pointer;
}
#admin-menu-list li.active {
    background-color: #005837;
    color: #FFF;
    border: 1px solid #FFF;
}
   #admin-menu-container {
    width: 12%;
   }
   #admin-tabs-container {
    width: 88%;
    border: 1px solid #dee2e6;
   }
   .date {
    width: 80%;
    padding-bottom: 5px;
   }
   .underbar {
      display: block;
      width: 80%;
      height: 3px;
      margin-bottom: 15px;
   }
    #evaluatorTable th {
    font-size: 10px;
  }
</style>