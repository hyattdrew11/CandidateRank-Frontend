<template>
	<div>
		<b-navbar id="main-nav" toggleable="lg" type="dark" variant="none" fixed="top">
        <b-navbar-brand>
        	<img height="35" class="" src="img/logo/cr-logo-white.png" />
        </b-navbar-brand>
      </b-navbar>
      <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
		    <div v-if="currentTerm && !loading" id="evaluator-schedule-container">

		    	<b-breadcrumb id="faculty-breadcrumb">
      				<b-breadcrumb-item active>Available Interview Dates {{ currentTerm.department }}</b-breadcrumb-item>
  				</b-breadcrumb>
		      	<b-container fluid>
		      		<b-row>
		      			<b-col md="12" class="pr-3">
		      				<hr />
		      			</b-col>
		      			<b-col md="4" v-for="(x, index) in currentTerm.dates" class="mb-2">
		      				<b-card  header="">
		      					{{ x.startDate }}
				 				<b-button :disabled="datePicked" @click="chooseDate(x.startDate)" size="sm" variant="success" class="float-right mr-2">Choose Date</b-button>
				 			</b-card>
				 		</b-col>
				 	</b-row>
				</b-container>
			</div>
      <div v-if="interviewSet" class="successMsg">
        <h4 class="mb-3 pl-1 pr-1">{{ successMsg }}</h4>
        <b-list-group>
          <b-list-group-item v-for="(x, index) in  candidateSlots" class="d-flex justify-content-between align-items-center">
            <span v-for="(e, index) in x.evaluators" class="mb-0">
              <span class="wt-500">{{ candidate['interview-date'] }} {{ convertMilitary(x.time) }} CST •</span>
              Evaluator(s): {{ e.first_name }} {{ e.last_name }} - {{ e.email }}
            </span>
            <b-badge class="pointer p-2" variant="primary" @click="openInterview(x)">Start Zoom</b-badge>
          </b-list-group-item>
        </b-list-group>
      </div>
	</div>
</template>

<script>
import moment from 'moment'
const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'
export default {
  name: 'CandidateDashboard',
  components: {
     axios
  },
  data () {
    return {
      datePicked: false,
      moment: moment,
      interviewSet: false,
      candidate: null,
      loading: true,
      selectedDate: '',
  		org: this.$route.params.org,
  		organization: null,
  		currentTerm: null,
  		candidates: [],
  		year: parseInt(this.$route.params.year),
  		email: this.$route.params.email,
  		uuid: this.$route.params.uuid,
  		events: null,
  		options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  		success: false,
  		successMsg: "Your interview date has been accepted. Please check your email inbox for calendar invites or return to this page to review your schedule below. If you are rescheduling please choose a date above.",
      slots: []
    }
  },
  components: {
  },
  computed: {
    candidateSlots() {
      let slots = []
        let x 
        let dates = this.currentTerm.dates
        for(x in dates) {
          console.log(dates[x])
          let rooms = dates[x].rooms
          let r
          for(r in rooms) {
            let e 
            let events = rooms[r].events
            for(e in events) {
              if ('candidate' in events[e]) {
                if(events[e].candidate.uuid == this.uuid) {
                  slots.push(events[e])
                }
              }
            }
          }
        }
      return slots
    },
  },
  mounted () {
    this.loadDashboard()
  },
  methods: {
     convertMilitary(t) {
        let tme = moment(t, 'HH:mm').format('hh:mm a')
        return tme
      },
     openInterview(event) {
        let c = confirm("Join interview");
        if(c) {
          let win = window.open(event.zoom_link, '_blank');
        }
        else {}
      },
  	chooseDate(x) {
      let vm = this
  		this.loading 	= true
      this.datePicked = true
      this.selectedDate = x
  		let org 		  = this.organization.name
  		let dates 		= this.currentTerm.dates
  		let date  		= null
  		let i 
  		for(i in dates) {
  			if(dates[i].startDate == x) {
  				date = dates[i]
  			}
  		}
  		if(date == null) { 
  			alert("There was an error. Please refresh the page.")
  			return
  		}
  		let input = {
  			"date"  : x,
  			"year"  : this.year,
  			"uuid"  : this.uuid,
  			"currentTermIndex" : this.currentTermIndex,
  			"interviewLength" : date.interviewLength
  		}
      axios.post( API_URL+'/dashboard/candidate-date/'+org, input )
       .then(({ data }) => { 
            this.slots = data
            this.success = true
            this.interviewSet = true
            this.loading = false
            this.loadDashboard()
        })
        .catch(function (e) { 
          alert("This interview date is currently full. plaease contact " + vm.organization.admin + " for help scheduling an interview.")
          vm.loading = false
          console.log(e) 
        })
  	},
    checkCandidate() {
        axios.post( API_URL+'/candidate/get/'+this.org+'/'+this.uuid )
          .then(({ data }) => { 
            console.log(data)
            this.candidate = data
            if(data['interview-date']) { 
              this.interviewSet = true
              this.success = true
            }
          })
          .catch(function (e) {console.log(e) })
    },
  	loadDashboard() {
        // console.log('LOAD DASHBOARD')
        const org = this.org
        axios.get( API_URL+'/dashboard/admin/'+org )
          .then(({ data }) => { 
              this.organization = data.organization
              let terms = this.organization.terms
              let x 
              for(x in terms) {
              	if(terms[x].year === this.year) {
              		this.currentTerm = terms[x]
              		this.currentTermIndex = x
              		// console.log(terms[x])
              	}
              }
              this.checkCandidate()
              this.loading = false
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
	.successMsg {
		padding: 3rem;
    // margin-top: 5%;
    width: 100;
    // text-align: center;
	}
</style>
