<template>
  <div class="container-fluid">
    <b-row no-gutters>
       <b-tabs id="setup-tabs" class="" card>
        <b-tab ref="wW" title="Welcome Wizard"><welcomeWizard  :organization="organization" :user="user" :candidates="candidates" :surveys="surveys" :faculty="faculty" /></b-tab>
        <b-tab ref="impD" title="Import Data"><importData :organization="organization" :user="user" :candidates="candidates" :surveys="surveys" :faculty="faculty" /></b-tab>
        <b-tab ref="em" title="Evaluator(s) Management"><evaluatorsManagement :organization="organization" :user="user" :candidates="candidates" :surveys="surveys" :faculty="faculty" />
        </b-tab>
        <b-tab ref="sm" title="Survey Management"><surveyManagement :organization="organization" :user="user" :candidates="candidates" :surveys="surveys" :faculty="faculty" /></b-tab>
       </b-tabs>
    </b-row>
  </div>
</template>

<script>
import welcomeWizard from './welcomeWizard.vue';
import evaluatorsManagement from './evaluatorsManagement.vue';
import importData from './importData.vue';
import surveyManagement from './surveyManagement.vue';
export default {
	name: 'adminSetup',
  props: ["organization", "user","candidates","surveys","faculty"],
	data() {
    	return {
          tab:  'Welcome Wizard',
          tabs: ['Welcome Wizard','Elavuators(s) Management','Import Data','Survey Management']
      }
  	},
  	components: {
      welcomeWizard,
      evaluatorsManagement,
      importData,
      surveyManagement
    },
    mounted() {

    },
  	methods: {}
};
</script>
<style scoped lang="scss"></style>