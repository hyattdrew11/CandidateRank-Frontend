<template>
   <div id="faculty-tabs-container" class="mt-2">
    <div class="row">
            <b-col sm="7">
              <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
               <b-form-input v-model="text"></b-form-input>
            </b-col>
            <b-col sm="5">
              <label class="tx-12 wt-600 dark-gray">Interviewer:</label>
              <b-form-select v-model="selected" :options="doctors"></b-form-select>
            </b-col>
    </div>
    <div class="row">
            <b-col sm="12">
              <hr />
              <p class="tx-10 wt-600 text-right">Results: {{ candidates.length }}</p>
              <div  id="PreInterviewSurveys">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th v-for="(x, index) in fields" scope="col" @click="sort(index,  x.order)">
                      {{ x.name }} 
                        <i v-if=" x.order == null" class="fa fa-sort float-right gray"></i>
                        <i v-if=" x.order == 'asc'" class="fa fa-caret-up float-right"></i>
                        <i v-if=" x.order == 'desc'" class="fa fa-caret-down float-right"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(x, index) in candidates">
                      <td>{{ index }}</td>
                      <td>{{ x.rank }}</td>
                      <td class="pointer wt-600" @click="candidateDetails(x)">
                        <img class="profile-sm" :src="x.picture" />
                        {{ x['First Name'] }} {{ x['Last Name'] }}
                      </td>
                      <td>{{ x['Medical School of Graduation'] }}</td>
                      <td>{{ x['USMLE Step 1 Score'] }}</td>
                      <td>{{ x['USMLE Step 2 CK Score'] }}</td>

                   <!--    <td class="text-center">
                        <b-button @click="openSurvey(x.uuid)" size="sm" variant="primary" squared class="">Survey</b-button>
                      </td> -->

                      <td class="text-center">
                        <b-button @click="openSurvey(x)" size="sm" variant="primary" squared class="">Start</b-button>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
            </b-col>
          </div>
          <div id="survey-container" v-if="showSurvey" :class="{'d-none': !showSurvey}">
            <b-row no-gutters>
              <b-col sm="12" class="mt-2 pt-2">
                <h5>Survery - Evaluators list
                  <span class="float-right">
                    <i class="fa fa-times mr-1" @click="closeSurvey()"></i>
                  </span>
                </h5>
                <hr />
              </b-col>
              <b-col sm="2">
                <div class="candidate-evaluators-menu">
                  <p class="tx-12 wt-600 dark-gray">Documents
                    <i class="fa fa-plus-circle tx-12 wt-600 green float-right mt-1"></i>
                  </p>
                  <hr />
                  <i class="fa fa-file tx-12 wt-600 dark-gray"></i>
                </div>
              </b-col>
              <b-col sm="5">
                <div id="pdf-container">
                  <p class="tx-12 mb-0 text-right">
                    <strong>Ranking Year: {{ candidate['Rank-Term'] }}</strong>
                  </p>
                  <p class="tx-12 mb-0">
                    <strong>Name:</strong> {{ candidate['First Name'] }} {{ candidate['Last Name'] }}
                  </p>
                  <p class="tx-12 mb-0">
                     <strong>USMLE 1:</strong> {{ candidate['USMLE Step 1 Score'] }}
                  </p>
                  <p class="tx-12 mb-0">
                    <strong>USMLE 2:</strong> {{ candidate['USMLE Step 2 CK Score'] }}
                  </p>
                  <p class="tx-12 mb-0">
                    <strong>Graduating Medical School:</strong> {{ candidate['Medical School of Graduation'] }}
                  </p>
                  <p class="tx-12 mb-0">
                    <strong>Awards Medical School:</strong> 
                    {{ candidate['Awards & Recognitions - Medical School'] }}
                  </p>
                  <!-- <pre>{{ candidate }}</pre> -->
                </div>
              </b-col>
               <b-col sm="5">
                <div class="candidate-survey">
                  <b-row no-gutters>
                    <b-col sm="6">
                      <p class="">
                        <strong>Survey</strong>
                      </p>
                    </b-col>
                    <b-col sm="6">
                      <b-button size="sm" class="">Start</b-button>
                    </b-col>
                     <b-col sm="12">
                       <hr />
                     </b-col>
                  </b-row>
               </div>
              </b-col>
          </b-row>
          </div>
        </div>
</template>

<script>
import axios from 'axios'
window.axios = require('axios');


export default {
	name: 'PreInterviewSurveys',
  props: ['user', 'candidates', 'reviewers'],
	data() {
    	return {
        text: null,
        selected: 'Dr. Walter Jones',
        doctors: ['Dr. Will Nichols', 'Dr. Sam Peeples', 'Dr. Walter Jones'],
        candidate: null,
        showSurvey: false,
        fields : [
        {
           'name':'',
           'order': null,
         },
        {
           'name':'Rank',
           'order': null,
         },
         {
            'name' : 'Applicant', 
            'order': null,
          },
          {
            'name': 'Medical School',
            'order': null,
          },
          {
            'name':'USMLE 1',
            'order': null,
          },
          {
            'name':'USMLE 2', 
            'order': null,
          },
          // {
          //   'name':'Survey', 
          //   'order': null,
          // },
          {
            'name':'Application',
            'order': null,
          }
        ],
      }
  	},
  	components: {},
    mounted() {
    },
  	methods: {
      sort(index, order) {
        if(order == null) {
          this.fields[index].order = 'desc'
        }
        if(order == 'asc') {
          this.fields[index].order = 'desc'
        }
        if(order == 'desc') {
          this.fields[index].order = 'asc'
        }
        console.log(this.fields[index])
      },
      openSurvey(x) {
        this.candidate = x;
        this.showSurvey = true;
      },
      closeSurvey() {
        this.showSurvey = false
      },
      getCandidate(aamcid) { 
        window.axios.get('/api/candidate/'+aamcid)
          .then(({ data }) => {
              this.candidate = data
          })
          .catch(function (e) {
              alert('Error loading search candidates, please refresh.')
          })
      },
    }
};
</script>
<style scoped lang="scss">
//   #PreInterviewSurveys {
//     height: 65vh;
//     overflow-y: scroll;
//   }
//   #PreInterviewSurveys th {
//     font-size: 10px;
//   }
//    #PreInterviewSurveys td {
//     font-size: 12px;
//     padding: 5px 15px 5px 15px;
//     vertical-align: middle;
//   }
//   .profile-sm {
//     display: inline-block;
//     border-radius: 100%;
//     height: 35px;
//     width:  auto;
//     margin-right: 10px;
//   }
//   #survey-container {
//     display: block;
//     background-color: #FFF;
//     height: 100%;
//     width: 99%;
//     position: absolute;
//     left: 0px;
//     top: 57px;
//     padding: 10px 25px 10px 25px;
// }
// #pdf-container { 
//   height: 100%;
//   width: 100%;
//   box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
//   transition: all 0.3s cubic-bezier(.25,.8,.25,1);
//   padding: 30px 15px 20px 15px;
// }
</style>