<template>
  <div id="faculty-dashboard" class="container-fluid">
    <b-row no-gutters>
      <div id="faculty-menu-container">
        <div id="faculty-menu">
          <ul id="faculty-menu-list">
            <li v-for="(x, index) in tabs" :class="{active : x == tab }" @click="changeTab(x)">{{ x }}</li>
          </ul>
        </div>
      </div>
        <PreInterviewRankings 
          @updateCandidates="updateCandidates" 
          :user="user" 
          :reviewers="reviewers"
          :candidates="candidates"
          :organization="organization"
          :currentTerm="currentTerm"
          :class="{'d-none' : tab != 'Ranking'}"
        />
        <InterviewSchedule    :user="user" :reviewers="reviewers" :candidates="candidates" :organization="organization" :class="{'d-none' : tab != 'Schedule'}"/>
        <PreInterviewSurveys  :user="user" :reviewers="reviewers" :candidates="candidates" :organization="organization"  :class="{'d-none' : tab != 'Pre-Interview'}"/>
        <FinalRankings        :user="user" :reviewers="reviewers" :candidates="candidates" :organization="organization" :class="{'d-none' : tab != 'Interview Process'}"/>


    </b-row>
  	
  </div>
</template>

<script>
const currentYear = (new Date()).getFullYear();
const API_URL = process.env.VUE_APP_API_URL

import PreInterviewSurveys from './PreInterviewSurveys.vue';
import PreInterviewRankings from './PreInterviewRankings.vue';
import InterviewSchedule from './InterviewSchedule.vue';
import FinalRankings from './FinalRankings.vue';

export default {
	name: 'FacultyDashboard',
  props: ['user'],
	data() {
    	return {
          tab:  'Ranking',
          tabs:  ['Ranking','Schedule','Pre-Interview','Interview Process'],
          reviewers: [],
          candidates: [],
          organization: {
            name: null,
            terms: []
          },
          currentTerm: null
      }
  	},
  	components: {
      PreInterviewSurveys,
      PreInterviewRankings,
      InterviewSchedule,
      FinalRankings
    },
    mounted() {
      this.loadDashboard()
    },
  	methods: {
      updateCandidates() {
        alert("UPDATE CANDIDATES")
      },
      changeTab(tab) {
        this.tab = tab
      },
      loadDashboard() {
        const org = this.user.Organization
        const token = this.$store.state.jwt.token.token 
        const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }

        window.axios.get(API_URL+'/dashboard/faculty/'+org, authHeader)
        .then(({ data }) => {
            this.organization = data.organization
            if(this.organization.terms.length > 0) {
              this.currentTerm = this.organization.terms[0]
              this.getCandidates()
            }
            else {
              alert("The administrator has not setup a term.")
            }
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
      getCandidates() {
          let org = this.user.Organization
          window.axios.get(API_URL+'/candidate/all/'+org+'/'+this.currentTerm.year)
          .then(({ data }) => {
            let x 
            for(x in data) {
              this.candidates.push(data[x]['_source'])
            }
          })
          .catch(function (e) {
              alert('Error loading search candidates, please refresh.')
          })
      },
    }
};
</script>
<style scoped lang="scss"></style>