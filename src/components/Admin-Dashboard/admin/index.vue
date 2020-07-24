<template>
  <div id="admin-dashboard" class="container-fluid">
    <span v-if="currentTerm" id="currentTermLabel">
      {{ currentTerm.department }} {{ currentTerm.year }}
    </span>
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
    <div :class="{fade : loading }">
      <!-- <span id="currentTerm-banner">Currently Working in {{ currentTerm.year }}</span> -->
      <b-row  no-gutters>
        <div id="admin-menu-container">
          <div id="admin-menu">
            <ul id="admin-menu-list">
              <li v-for="(x, index) in tabs" :class="{active : x == tab }" @click="changeTab(x)">{{ x }}</li>
            </ul>
          </div>
        </div>
        <!-- <SmartSync :tasks="tasks" /> -->
        <div id="admin-tabs-container">
          <Setup            
            :class="{'d-none' : tab != 'Setup'}"
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :files="files"
            @loadCandidates="loadCandidates"
            @changeTerm="changeTerm"

          />
          <PreInterview
            :class="{'d-none' : tab != 'Pre-Interview'}"
            :active="tab == 'Pre-Interview'"
            :organization="organization"
            :user="user"
            :candidates="candidates"
            :surveys="surveys"
            :faculty="faculty"
            :currentTerm="currentTerm"
          />
            <InterviewProcess
            :class="{'d-none' : tab != 'Interview Process'}"
            :active="tab == 'Interview Process'"
            :organization="organization"
            :user="user"
            :candidates="candidates"
            :surveys="surveys"
            :faculty="faculty" 
            :currentTerm="currentTerm"
          />
          <Schedule
            :class="{'d-none' : tab != 'Schedule'}"
            :organization="organization"
            :user="user"
            :candidates="candidates"
            :surveys="surveys"
            :faculty="faculty" 
            :currentTerm="currentTerm"
          />
          <Ranking
            :class="{'d-none' : tab != 'Ranking'}"
            :organization="organization"
            :user="user"
            :candidates="candidates"
            :surveys="surveys"
            :faculty="faculty" 
            @loadCandidates="loadCandidates"
            :currentTerm="currentTerm"
          />


        </div>
           
      </b-row>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

const currentYear = (new Date()).getFullYear();

const API_URL = process.env.VUE_APP_API_URL

import SmartSync from './SmartSync.vue';
import Setup from './setup/index.vue';
import Ranking from './ranking/index.vue';
import Schedule from './schedule/Scheduler.vue';
import PreInterview from './pre-interview/index.vue';
import InterviewProcess from './interview-process/index.vue';

export default {
	name: 'AdminDashboard',
  props: ['user'],
	data() {
    	return {
        loading: true,
        tab:  'Setup',
        tabs: ['Setup', 'Pre-Interview', 'Interview Process',  'Schedule', 'Ranking'],
        organization: {
          name: null,
          terms: []
        },
        currentTerm: null,
        candidates: [],
        tasks: [],
        surveys: null,
        faculty: null,
        files:[]
      }
  	},
  	components: {
      SmartSync,
      Setup,
      Ranking,
      Schedule,
      PreInterview,
      InterviewProcess,
      axios
    },
    mounted() {
      this.loadDashboard()
      // this.checkTasks()
      // setInterval(function () { this.checkTasks() }.bind(this), 30000);
    },
  	methods: {
       changeTerm: function(term) {
        this.currentTerm = term
      },
      checkTasks() {
        console.log("CHECK TASKS")
        const org = this.user.Organization
        const token = this.$store.state.jwt.token.token 
        const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }

        axios.get( API_URL+'/dashboard/admin/'+org+'/tasks', authHeader)
          .then(({ data }) => {   
            this.tasks = data.tasks
          })
           .catch(error => {
            const auth = error.response.data.authenticated
            if(!auth) {
              alert("Please login.")
              window.sessionStorage.clear()
              window.location.replace("/");
            }
        })
      },
      loadDashboard() {
        console.log('LOAD DASHBOARD')
        console.log(this.user)
        const org = this.user.Organization
        const token = this.$store.state.jwt.token.token 
        const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }
        if(this.user.email == this.user.Organization) {
          // PUSH TO SETUP SCREEN
          alert("NEW ACCOUNT UPDATE INFO")
        }
        axios.get( API_URL+'/dashboard/admin/'+org, authHeader)
          .then(({ data }) => { 
              console.log(data)
              this.organization = data.organization
              this.surveys      = data.surveys
              this.faculty      = data.faculty 
              this.files        = data.files
              this.tasks        = data.tasks

              if(this.organization.terms.length > 0) {
                this.currentTerm = this.organization.terms[0]
                this.getCandidates()
              }
              else {
                // alert("The administrator has not setup a term.")
              }
              this.loading      = false
          })
           .catch(function (e) {
            console.log(e)
            const auth = e.response.data.authenticated
            if(!auth) {
              alert("Please login.")
              window.sessionStorage.clear()
              window.location.replace("/");
            }
          })
      },
       getCandidates() {
          // console.log("GET CANDIDATES")
          let org = this.user.Organization
          axios.get(API_URL+'/candidate/all/'+org+'/'+this.currentTerm.year)
          .then(({ data }) => {
            // console.log(data)
            let x 
            for(x in data) {
              this.candidates.push(data[x]['_source'])
            }
          })
          .catch(function (e) {
            console.log(e)
          })
      },
      loadCandidates: function(year) {
          console.log("LOAD CANDIDATES: " + year)
          let org = this.user.Organization
          this.candidates = []
          axios.get(API_URL+'/candidate/all/'+org+'/'+year)
          .then(({ data }) => {
            let x 
            for(x in data) {
              this.candidates.push(data[x]['_source'])
            }
          })
          .catch(function (e) {
            console.log(e)
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
#admin-dashboard{
  margin-top: 60px;
}
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
    background-color: #13a89eab;
    color: #FFF;
    cursor: pointer;
}
#admin-menu-list li.active {
    background-color: #13a89e;
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
  #currentTerm-banner {
    position: fixed;
    top: 19px;
    z-index: 2000;
    color: #FFF;
    right: 42%;
  }
  #currentTermLabel {
    position: fixed;
    z-index: 30000;
    color: #FFF;
    top: 20px;
    left: 150px
  }
</style>