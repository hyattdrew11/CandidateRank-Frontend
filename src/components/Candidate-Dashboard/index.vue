<template>
	<div>
		<b-navbar id="main-nav" toggleable="lg" type="dark" variant="none" fixed="top">
        <b-navbar-brand>
        	<img height="35" class="" src="/cr-logo-white.png" />
        </b-navbar-brand>
      </b-navbar>

		    <div id="evaluator-schedule-container">
		      	<b-container fluid>
		      		<b-row>
		      			<b-col md="12" class="mt-2 pr-3">
		      				<h3 v-if="organization">Available Interview Dates</h3>
		      				<hr />
		      			</b-col>
		      			<b-col md="4" v-if="events" v-for="(x, index) in events" class="mb-2">
		      				<b-card  header="">
		      					{{ new Date(x.startDate).toLocaleDateString("en-US", options) }}
		      					<!-- <pre>{{ x }}</pre> -->
				 					<b-button @click="chooseDate(x.startDate)" size="sm" variant="success" class="float-right mr-2">Choose Date</b-button>
				 			</b-card>
				 		</b-col>
				 	</b-row>
				</b-container>
			</div>
	</div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export default {
  name: 'CandidateDashboard',
  components: {
     axios
  },
  data () {
    return {
		org: this.$route.params.org,
		organization: null,
		currentTerm: null,
		year: this.$route.params.year,
		email: this.$route.params.email,
		uuid: this.$route.params.uuid,
		events: null,
		options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    }
  },
  computed: {},
  mounted () {
    this.loadDashboard()
  },
  methods: {
  	chooseDate(x) {
  		alert('Your interview date has been accepted. please check your email inbox for details.')
  	},
  	loadDashboard() {
        console.log('LOAD DASHBOARD')
        const org = this.org
        // const token = this.$store.state.jwt.token.token 
        // const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }

        axios.get( API_URL+'/dashboard/admin/'+org )
          .then(({ data }) => { 
              this.organization = data.organization
              this.events = this.organization.terms[0].dates
          })
          .catch(function (e) {console.log(e) })
      }
  }
}
</script>

<style scoped lang="scss">
	.candidate-details, .candidate-scores {
		display: inline-block;
    	margin-left: 15px;
    	height: 65px;
    	vertical-align: middle;
    	width: 35%;
	}
	.event-details {
		position: absolute;
		right: 10px;
		top: 10px;
		display: inline-block;
	}
	.eval-actions {
		position: absolute;
    	right: 0px;
    	top: 8px;
    	display: inline-block;
	}
	.cropped1 {
    	width: 100px; /* width of container */
    	height: 100px; /* height of container */
    	object-fit: cover;
    	display: inline-block;
    // border: 5px solid black;
	}
	.candidate-img {
		display: inline-block;
	}
	.candidate-img img {}
	#evaluator-schedule-container {
		margin-top: 55px;
		padding: 15px;
		width: 100%;
		display: block;
	}
	#pdf-tools {
		position: fixed;
    	width: 47.75%;
    	z-index: 3000;
    	background-color: #EEE;
    	left: 25px;
    	top: 138px;
    	height: 35px;
    	padding: 5px 15px 5px 15px;
	}
	.active-survey-container {
		position: fixed;
    	width: 45%;
    	z-index: 3000;
	}
	#PreInterviewSurveys {
		height: 65vh;
		overflow-y: scroll;
	}
	#PreInterviewSurveys th {
		font-size: 10px;
	}
	#PreInterviewSurveys td {
		font-size: 12px;
		padding: 5px 15px 5px 15px;
		vertical-align: middle;
	}
	.profile-sm {
		display: inline-block;
		border-radius: 100%;
		height: 35px;
		width:  auto;
		margin-right: 10px;
	}
	#survey-container {
		display: block;
		background-color: #FFF;
		height: 100%;
		width: 99%;
		position: absolute;
		left: 0px;
		top: 55px;
		padding: 10px 25px 10px 25px;
	}
	#pdf-container { 
		min-height: 85vh;
		height: 100%;
		width: 100%;
		box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
		transition: all 0.3s cubic-bezier(.25,.8,.25,1);
		padding: 30px 15px 20px 15px;
		overflow-x: hidden;
	}
</style>
