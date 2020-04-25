<template>
  <div id="admin-dashboard" class="container-fluid">
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
      // this.getCandidates()
    },
  	methods: {
      updateCandidates() {
        alert("UPDATE CANDIDATES")
      },
      changeTab(tab) {
        this.tab = tab

      },
      loadDashboard() {
        this.$Progress.start()
        let org = this.user.Organization
        window.axios.get('/api/dashboard/faculty/'+org+'/'+currentYear)
          .then(({ data }) => {
            this.$Progress.finish()
            this.organization = data.organization
              // this.candidates   = data.candidates
              // this.surveys      = data.surveys
              // this.faculty      = data.faculty 
          })
          .catch(function (e) {
            this.$Progress.fail()
            alert('Error loading dashboard')
          })
      },
      //  getCandidates() {
      //     let org = this.user.Organization
      //     window.axios.get('/api/candidate/all/'+org+'/'+currentYear)
      //     .then(({ data }) => {
      //         this.candidates = data
      //     })
      //     .catch(function (e) {
      //         alert('Error loading search candidates, please refresh.')
      //     })
      // },
    }
};
</script>
<style scoped lang="scss"></style>