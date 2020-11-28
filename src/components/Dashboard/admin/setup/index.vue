<template>
  <div class="container-fluid">
    <span id="showHome" class="pointer" @click="showTerms()"  v-b-tooltip.hover title="Show All Terms" >
      <i class="fa fa-th" aria-hidden="true"></i>
    </span>
    <b-row no-gutters>
       <b-tabs id="setup-tabs" class="" v-model="tabIndex" card>
        <b-tab ref="wW" title="Welcome Wizard">
          <welcomeWizard  
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            :showHome="showHome"
            @nextStep="evaluatorsManagement"
            @changeTerm="changeTerm"
             >
           </welcomeWizard>
        </b-tab>

      <!--   <b-tab ref="em" title="Evaluator(s) Management" :disabled="currentTerm.year == null">
          <evaluatorsManagement 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty" 
            :currentTerm="currentTerm"
            :disabled="currentTerm == null"
            @changeTerm="changeTerm"
            @nextStep="masterSchedule"
            >
          </evaluatorsManagement>
        </b-tab> -->

        <b-tab ref="ms" title="Master Schedule" :disabled="currentTerm.year == null">
          <masterSchedule 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            @nextStep="surveyManagement"
            @goToSchedule="goToSchedule"
          ></masterSchedule>
        </b-tab>

         <b-tab ref="sm" title="Survey Management" :disabled="currentTerm.year == null">
          <surveyManagement 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            @nextStep="importDataOpen"
            @updateOrg="updateOrg"
            >
          </surveyManagement>
        </b-tab>


        <b-tab ref="impD" title="Import / Filter Data" :disabled="currentTerm.year == null">
          <importData 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            :files="files"
            @changeTerm="changeTerm"
            @nextStep="goToNotifications"
            >
          </importData>
        </b-tab>

         <b-tab ref="ms" title="Notifications" :disabled="currentTerm.year == null">
          <Notifications
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            :files="files"
            @changeTerm="changeTerm"
          />
        </b-tab>

          <b-tab v-if="user.role == 'Super Admin' " ref="superAdmin" title="Super Admin" :disabled="currentTerm.year == null">
            <SuperAdmin
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            :files="files"
            @changeTerm="changeTerm"
          />
        </b-tab>


      <!--   <a v-if="zoomActivate" id="zoom-sync"  :href="oauth_url" target="_blank" rel="noopener noreferrer"><img src="https://marketplacecontent.zoom.us/zoom_marketplace/img/add_to_zoom.png" height="32" alt="Add to ZOOM" /></a>

        <b-tooltip :show="!zoomActivate" target="zoom-sync" placement="top">
          <strong>Sync your Zoom account</strong>
        </b-tooltip>

        <b-modal id="zoom-modal" title="Zoom Authentication" hide-footer>
          <h5 class="tx-14">Please click the button below to sync your Zoom account with Candidate Rank. This allows our application to automate virtual Zoom meetings with your selected interview candidates.</h5>
          <hr />
          <a 
          :href="oauth_url" 
          target="_blank" 
          rel="noopener noreferrer">
          <img src="https://marketplacecontent.zoom.us/zoom_marketplace/img/add_to_zoom.png" height="32" alt="Add to ZOOM" /></a>
        </b-modal> -->


        
        <!-- <b-tab ref="wp" title="Welcome Packet"></b-tab> -->

       <!--  <b-tab ref="um" title="User Management" :disabled="currentTerm.year == null">
          <userManagement 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty">
          </userManagement>
        </b-tab> -->

       </b-tabs>
    </b-row>
  </div>
</template>

<script>
import welcomeWizard from './welcomeWizard.vue';
import evaluatorsManagement from './evaluatorsManagement.vue';
import masterSchedule from './masterSchedule.vue';
import importData from './importData.vue';
import surveyManagement from './surveyManagement.vue';
// import userManagement from './userManagement.vue';
import Notifications from './notifications.vue';
import SuperAdmin from './superAdmin.vue';

import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'adminSetup',
  props: ["organization", "user","candidates","surveys","faculty", "files"],
	data() {
    	return {
          zoomActivate: true, 
          tabIndex: 0,
          showHome: false,
          currentTerm: {
            dates: [],
            faculty: null,
            department: null,
            year: null,
            startTime: null,
            endTime: null
          },
          tab:  'Welcome Wizard',
          tabs: ['Welcome Wizard','Elavuators(s) Management','Import Data','Survey Management','User Management']
      }
  	},
  	components: {
      welcomeWizard,
      evaluatorsManagement,
      masterSchedule,
      importData,
      surveyManagement,
      // userManagement,
      SuperAdmin,
      Notifications,
      axios
    },
    mounted() {
      // this.checkZoom()
      // this.refreshZoomToken()
      // EventBus.$on('zoom-auth', user => {
      //   console.log(`EVENT BUS ${user}`)
      // });
      // let x 
      // let terms = this.organization.terms
      // if(terms.length > 0) { 
      //   this.currentTerm = terms[0]
      // }
    },
    computed: {
      oauth_url() {
        let link = "https://zoom.us/oauth/authorize?response_type=code&client_id=cJGbYyIHRLmXHKz6fZLz9w&redirect_uri=https://candidaterank.io/zoomredirect&state="+this.user.email
        return link
      }
    },
  	methods: {
      checkZoom() {
        // console.log("CHECK ZOOM")
        // console.log(this.user)
        if(this.user && !this.user.refresh_token) {
          // this.zoomActivate = false
          // this.$bvModal.show("zoom-modal")  
        }
        else {
          this.refreshZoomToken()
        }
      },
      refreshZoomToken() {
        // console.log("REFRESH ZOOM TOKEN")
      let input = {
        "email": this.user.email
      }
      axios.post( API_URL+'/auth/refresh_zoom/', input)
      .then(({ data }) => { 
        if(data.error === "auth-zoom") {
          this.zoomActivate = false
          this.$bvModal.show("zoom-modal") 
        }
      })
      .catch(function (e) { console.log(e)  })
      },
      showTerms() {
        this.showHome = !this.showHome
        this.tabIndex = 0
        // this.tab = "Welcome Wizard"
      },
      goToSchedule() {
        let vm = this
        this.showTerms()
        setTimeout(function(){  vm.$emit('goToSchedule') }, 150);

      },
      changeTerm: function(term) {
        this.currentTerm = term
        this.$emit('loadCandidates', term.year)
        this.$emit('changeTerm', term)
      },
      updateOrg: function(org) {
         // AXIOS UPDATE THE ORGANIZATION VIA API
        this.organization = org
        axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
          .then(({data}) => { 
            this.organization = data
            alert("Progress saved.")
          })
          .catch(function (e) { alert(e) })
      },
      importDataOpen: function(term) {
        this.currentTerm = term
        this.tabIndex = 3
      },
      goToNotifications: function(term) {
        this.currentTerm = term
        this.tabIndex = 4
      },
      evaluatorsManagement: function(term) {
        this.currentTerm = term
        this.tabIndex = 1
      },
      masterSchedule: function(term) {
        this.currentTerm = term
        this.tabIndex = 2
      },
      surveyManagement: function(term) {
        this.currentTerm = term
        this.tabIndex = 2
      },
    }
};
</script>
<style scoped lang="scss">
  // #showHome {
  //   position: fixed;
  //   z-index: 10000;
  //   top: 15px;
  //   color: #FFF;
  //   left: 153px;
  //   font-size: 23px;
  // }
  // #showHome:hover {
  //   font-size: 20px;
  // }
  #zoom-sync {
    position: fixed;
    top: 77px;
    right: 20px;
  }
</style>