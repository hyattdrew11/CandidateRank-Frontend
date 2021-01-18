<template>
  <div id="admin-dashboard" class="container-fluid">
    <span v-if="currentTerm" id="currentTermLabel">
      {{ currentTerm.department }} {{ currentTerm.year }}
    </span>
     <span v-else="" id="currentTermLabel">
      You have not selected a term. 
    </span>
    <!-- <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i> -->
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
            :currentTerm="currentTerm"
            @loadCandidates="loadCandidates"
            @changeTerm="changeTerm"
            @goToSchedule="goToSchedule"

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
            @changeTerm="changeTerm"
            @loadCandidates="loadCandidates"
            :sizePIGrid="sizePIGrid"
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
            @changeTerm="changeTerm"
            @loadCandidates="loadCandidates"
            :sizeIntGrid="sizeIntGrid"
          />
          <Schedule
            :class="{'d-none' : tab != 'Schedule'}"
            :active="tab == 'Schedule'"
            :organization="organization"
            :user="user"
            :candidates="candidates"
            :surveys="surveys"
            :faculty="faculty" 
            :currentTerm="currentTerm"
             @refreshTerm="refreshTerm"
          />
          <Ranking
            :class="{'d-none' : tab != 'Ranking'}"
            :active="tab == 'Ranking'"
            :organization="organization"
            :user="user"
            :candidates="candidates"
            :surveys="surveys"
            :faculty="faculty" 
            @changeTerm="changeTerm"
            @loadCandidates="loadCandidates"
            :currentTerm="currentTerm"
            :sizeRankGrid="sizeRankGrid"
          />


        </div>
        <Guide :user="user" />
           
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

import Guide from './Guide/index.vue';

export default {
	name: 'AdminDashboard',
  props: ['user'],
	data() {
    	return {
        sizeRankGrid: false,
        sizeIntGrid: false,
        sizePIGrid: false,
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
      Guide,
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
    },
  	methods: {
        refreshTerm(term) {
          console.log("MAIN REFRESH TERM")
          console.log(term)
          const org = this.user.Organization
          const token = this.$store.state.jwt.token.token 
          const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }
          axios.get( API_URL+'/dashboard/admin/'+org, authHeader)
          .then(({ data }) => { 
              this.organization = data.organization
              this.surveys      = data.surveys
              this.faculty      = data.faculty 
              this.files        = data.files
              this.tasks        = data.tasks
              let x 
              this.getCandidates()
              for(x in this.organization.terms) {
                if(this.organization.terms[x].year == term.year) {
                  this.currentTerm = this.organization.terms[x]
                }
                else {}
              }
              this.loading      = false
          })
           .catch(function (e) {
            const auth = e.response.data.authenticated
            if(!auth) {
              alert("Please login.")
              window.sessionStorage.clear()
              window.location.replace("/");
            }
          })

        },
       changeTerm: function(term) {
        // console.log("CHANGE TERM")
        this.currentTerm = term
      },
      checkTasks() {
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
        const org = this.user.Organization
        const token = this.$store.state.jwt.token.token 
        const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }
        if(this.user.email == this.user.Organization) {
        }
        axios.get( API_URL+'/dashboard/admin/'+org, authHeader)
          .then(({ data }) => { 
              this.organization = data.organization
              this.surveys      = data.surveys
              this.faculty      = data.faculty 
              this.files        = data.files
              this.tasks        = data.tasks

              if(this.organization.terms.length > 0) {
                this.currentTerm = null
              }
              else {
              }
              this.loading      = false
          })
           .catch(function (e) {
            const auth = e.response.data.authenticated
            if(!auth) {
              alert("Please login.")
              window.sessionStorage.clear()
              window.location.replace("/");
            }
          })
      },
       getCandidates() {
          this.candidates = []
          let org = this.user.Organization
          axios.get(API_URL+'/candidate/all/'+org+'/'+this.currentTerm.year)
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
      loadCandidates: function(year) {
          // console.log("LOAD CANDIDATES: " + year)
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
      goToSchedule() {
        this.refreshTerm(this.currentTerm)
        console.log("GO TO SCHEDULE")
        this.tab = "Schedule"
      },
      changeTab(tab) {

        this.tab = tab
        if(this.tab === "Pre-Interview") {
          this.loadCandidates(this.currentTerm.year)
          this.sizePIGrid = null
          this.sizePIGrid = true
        }
        if(this.tab === "Interview Process") {
          this.loadCandidates(this.currentTerm.year)
          this.sizeIntGrid = null
          this.sizeIntGrid = true
        }
        if(this.tab === "Schedule") {
          this.loadCandidates(this.currentTerm.year)

        }
        if(this.tab === "Ranking") {
          this.loadCandidates(this.currentTerm.year)
          this.sizeRankGrid = null
          this.sizeRankGrid = true
        }
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
    background-color: #319c90;
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
  // #currentTermLabel {
  //   position: fixed;
  //   z-index: 30000;
  //   color: #FFF;
  //   top: 20px;
  //   left: 185px
  // }
</style>