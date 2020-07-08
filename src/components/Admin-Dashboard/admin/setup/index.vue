<template>
  <div class="container-fluid">
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
            @nextStep="evaluatorsManagement"
            @changeTerm="changeTerm"
             >
           </welcomeWizard>
        </b-tab>

        <b-tab ref="em" title="Evaluator(s) Management" :disabled="currentTerm.year == null">
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
        </b-tab>

        <b-tab ref="ms" title="Master Schedule" :disabled="currentTerm.year == null">
          <masterSchedule 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            :currentTerm="currentTerm"
            @nextStep="surveyManagement"
          ></masterSchedule>
        </b-tab>

         <b-tab ref="sm" title="Survey Management" :disabled="currentTerm.year == null">
          <surveyManagement 
            :organization="organization" 
            :user="user" 
            :candidates="candidates" 
            :surveys="surveys" 
            :faculty="faculty"
            @nextStep="importData"
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

        
        <!-- <b-tab ref="wp" title="Welcome Packet"></b-tab> -->

       <!--  <b-tab ref="um" title="User Management">
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
import userManagement from './userManagement.vue';
import Notifications from './notifications.vue';


const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'adminSetup',
  props: ["organization", "user","candidates","surveys","faculty", "files"],
	data() {
    	return {
          tabIndex: 0,
          currentTerm: {
            dates: [],
            faculty: null,
            department: null,
            year: null
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
      userManagement,
      Notifications
    },
    mounted() {
      // let x 
      // let terms = this.organization.terms
      // if(terms.length > 0) { 
      //   this.currentTerm = terms[0]
      // }
    },
  	methods: {
      changeTerm: function(term) {
        this.currentTerm = term
        this.$emit('loadCandidates', term.year)
        this.$emit('changeTerm', term)
      },
      updateOrg: function(org) {
         // AXIOS UPDATE THE ORGANIZATION VIA API
         this.organization = org
         console.log(org)
        window.axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
          .then(({data}) => { 
            // this.organization = data
            alert("Progress saved.")
          })
          .catch(function (e) { alert(e) })
      },
      importData: function(term) {
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
        this.tabIndex = 3
      },
      importData: function(term) {
        this.currentTerm = term
        this.tabIndex = 4
      },
    }
};
</script>
<style scoped lang="scss"></style>