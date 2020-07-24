<template>
	<div>
		<b-navbar id="main-nav" toggleable="lg" type="dark" variant="none" fixed="top">
        <b-navbar-brand>
        	<img height="35" class="" src="/cr-logo-white.png" />
        </b-navbar-brand>
      </b-navbar>

		    <div id="evaluator-schedule-container" :class="{'d-none': showSurvey}">
		      	<b-container fluid>
		      		<b-row>
		      			<b-col md="12" class="mt-2 pr-3">
		      				<h3 v-if="organization">Candidate Interview and Evaluation • {{ date.startDate }} </h3>
		      				<hr />
		      			</b-col>
		      			<b-col md="12" v-if="candidates" v-for="(x, index) in events" class="mb-2">
		      				<b-card  :header="'Interview: ' + x.room + ' • ' + x.time">
		      					<div class="candidate-img">
        							<img class="cropped1" :src="candidates[index]['photo']" />
    							</div>
    							<div class="candidate-details">
		      						<span>Name: {{ candidates[index]['first name'] }} {{ candidates[index]['last name'] }}</span>
		      						<br />
		      						<span>Email: <a href="">{{ candidates[index]['email'] }}</a></span>
		      						<br />
		      						<span>AAMCID: {{ candidates[index]['aamcid'] }}</span>
		      					</div>
		      					<div class="candidate-scores">
		      						<span>{{ candidates[index]['Medical School of Graduation'] }}</span>
		      						<br />
		      						<span>USMLE Step 1 Score: {{ candidates[index]['USMLE Step 1 Score'] }}</span>
		      						<br />
		      						<span>USMLE Step 2 CK Score: {{ candidates[index]['USMLE Step 2 CK Score'] }}</span>
		      					</div>
		      					<div class="eval-actions">
				 					<b-button @click="openSurvey(candidates[index])" size="sm" variant="success" class="float-right mr-2">Start Survey</b-button>
					 				<a 
			      						target="popup"
			      						class="btn btn-sm btn-primary float-right mr-1 white"
			      						onclick="window.open('https://zoom.us/j/93766285101?pwd=Tks0KzArVDZBbVc2VlZaWnlubFlzZz09','zoom','width=600,height=400')"
			      						>
			      						Join Zoom 
			      					</a>
			      				</div>
				 			</b-card>
				 		</b-col>
				 	</b-row>
				</b-container>
			</div>

		  <div id="survey-container" v-if="showSurvey" :class="{'d-none': !showSurvey}">
            <b-row no-gutters>
              <b-col sm="12" class="mt-2 pt-2">
                <h5>Candidate Evaluation - {{ org }}  {{ year }}
                  <span class="float-right">
                    <i class="fa fa-times mr-1" @click="closeSurvey()"></i>
                  </span>
                </h5>
                <hr />
              </b-col>

              <b-col sm="6">
              	<div id="pdf-tools">
					<a class="pointer gray mr-2" @click="scale -= scale > 0.2 ? 0.1 : 0"><i class="fa fa-search-minus"></i></a>
					<a class="pointer gray mr-2" @click="scale += scale < 2 ? 0.1 : 0"><i class="fa fa-search-plus"></i></a>

					<a class="pointer gray float-right" @click="page < numPages ? page++ : 1"><i class="fa fa-caret-right"></i></a>
					<span class="gray ml-2 mr-3 float-right">{{ page }} of {{ numPages }}</span>
					<a class="pointer gray float-right" @click="page > 1 ? page-- : 1"><i class="fa fa-caret-left"></i></a>


				</div>
				<div id="pdf-container">
                	<div id="pdfvuer">
					    <pdf 
					    	:src="pdfdata" 
					    	:annotation="true"
					    	v-for="i in numPages" 
					    	:key="i" 
					    	:id="i" 
					    	:page="i"
					      	style="width:100%;margin:20px auto;">
					      <template slot="loading"></template>
					    </pdf>
					  </div>
                </div>
              </b-col>
               <b-col sm="6">
                <div class="candidate-survey">
                  <b-row no-gutters>
                     <b-col sm="12">
                     	<div class="active-survey-container">
                     		<b-row no-gutters>
                    			<b-col sm="6"></b-col>
                    			<b-col sm="6">
                      				<b-button size="sm" class="float-right"variant="success" >Save & Continue</b-button>
                    			</b-col>
                    		</b-row>
							<hr />
							<div v-for="(x, index) in survey.questions" :key="index"  class="mb-2">
							    <div v-if="x.type == 'Range'">
							       <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.text }}</p>
							     <b-form-group>
							      </b-form-group>
							      <span v-for="(i, index) in x.options" class="mr-2">
							        <input type="radio">
							        <label class="ml-2 mr-2">{{ index }}</label>
							      </span>
							    </div>
								<div v-if="x.type == 'Comment'">
								<p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.question }}</p>
								<b-form-textarea :disabled="false" v-model="x.text" placeholder="Evaluator comments will go here..." rows="3" max-rows="6">
								</b-form-textarea>
								</div>
							</div>
						</div>
                     </b-col>
                  </b-row>
               </div>
              </b-col>
          </b-row>
          </div>
	</div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL
import pdfvuer from 'pdfvuer'
import axios from 'axios'

export default {
  name: 'EvaluatorDashboard',
   watch: {
    show: function (s) {
      if(s) {
        this.getPdf();
      }
    },
    page: function (p) {
      if( window.pageYOffset <= this.findPos(document.getElementById(p)) || ( document.getElementById(p+1) && window.pageYOffset >= this.findPos(document.getElementById(p+1)) )) {
        // window.scrollTo(0,this.findPos(document.getElementById(p)));
        document.getElementById(p).scrollIntoView();
      }
    }
  },
  components: {
     pdf: pdfvuer,
     axios
  },
  data () {
    return {
		org: this.$route.params.org,
		organization: null,
		candidates: [],
		currentTerm: null,
		year: this.$route.params.year,
		email: this.$route.params.email,
		uuid: this.$route.params.uuid,
		showSurvey: false,
		page: 1,
      	numPages: 0,
      	pdfdata: undefined,
      	errors: [],
      	scale: 'page-width',
		candidate: null,
		events: [
			{
			time: '9:00 am - 10:00 am',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '10:00 am - 11:00 am',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '11:00 am - 12:00 pm',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '12:00 pm - 1:00 pm',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '1:00 pm - 2:00 pm',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '2:00 pm - 3:00 pm',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '3:00 pm - 4:00 pm',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
			{
			time: '4:00 pm - 5:00 pm',
			room: 'Virtual Room 1',
			status: 'Ready'
			},
		],
	    survey: {
		  "date_created": "2020-07-13 20:48:37.253196",
		  "date_modified": "2020-07-13 20:48:37.253196",
		  "name": "Residents",
		  "Organization": "Candidate Rank",
		  "questions": [
		    {
		      "options": [
		        0,
		        1,
		        2,
		        3,
		        4,
		        5,
		        6,
		        7,
		        8,
		        9,
		        10
		      ],
		      "preview": false,
		      "selected": null,
		      "text": "Rate this candidate on a scale of 1 to 10.",
		      "type": "Range"
		    },
		    {
		      "preview": false,
		      "question": "Add any additional comments below.",
		      "text": "",
		      "type": "Comment"
		    }
		  ],
		  "term": null,
		  "type": "Interview",
		  "uuid": "9674aa55-f2f3-4681-b7b2-ef5d1ae5087f"
		}
    }
  },
  computed: {
    formattedZoom () {
        return Number.parseInt(this.scale * 100);
    },
    // date() {
    // 	return this.organization.terms[0].dates[0]
    // }
  },
  mounted () {
    // this.getPdf()
    this.loadDashboard()
  },
  methods: {
  	loadDashboard() {
        console.log('LOAD DASHBOARD')
        const org = this.org
        // const token = this.$store.state.jwt.token.token 
        // const authHeader = { headers: { "Authorization" : 'Bearer: ' + token } }

        axios.get( API_URL+'/dashboard/admin/'+org )
          .then(({ data }) => { 
              this.organization = data.organization
              this.date = this.organization.terms[0].dates[0]

              if(this.organization.terms.length > 0) {
                this.currentTerm = this.organization.terms[0]
                this.getCandidates()
              }
          })
          .catch(function (e) {console.log(e) })
      },
      getCandidates() {
          // console.log("GET CANDIDATES")
          let org = this.org
          axios.get(API_URL+'/candidate/all/'+org+'/'+this.currentTerm.year)
          .then(({ data }) => {
            console.log(data)
            let x 
            for(x in data) {
              this.candidates.push(data[x]['_source'])
            }
          })
          .catch(function (e) { console.log(e) })
      },
  	 openSurvey(x) {
  	 	this.candidate = x
  	 	this.getPdf(x)
        this.showSurvey = true;
      },
      closeSurvey() {
        this.showSurvey = false
      },
      startSurvey() {
      	alert("Start Survey")
      },
      getPdf (x) {
      	let self = this;
      	self.pdfdata = pdfvuer.createLoadingTask(x.application);
      	self.pdfdata.then(pdf => {
        	self.numPages = pdf.numPages;
        	window.onscroll = function() { 
          	changePage() 
          	stickyNav()  
        	}

        	// Get the offset position of the navbar
        	let sticky = document.getElementById('#buttons')[0].offsetTop

        	// Add the sticky class to the self.$refs.nav when you reach its scroll position. Remove "sticky" when you leave the scroll position
        	function stickyNav() {
          	if (window.pageYOffset >= sticky) {
            // document.getElementById('#buttons')[0].classList.remove("hidden")
          	} else {
            	// document.getElementById('#buttons')[0].classList.add("hidden")
          	}
        }

        function changePage () {
          var i = 1, count = Number(pdf.numPages);
          do {
            if(window.pageYOffset >= self.findPos(document.getElementById(i)) && 
                window.pageYOffset <= self.findPos(document.getElementById(i+1))) {
              self.page = i
            }
            i++
          } while ( i < count)
          if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
            self.page = i
          }
        }
      });
    },
    findPos(obj) {
      return obj.offsetTop;
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
