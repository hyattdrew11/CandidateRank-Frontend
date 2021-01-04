<template>
	<div class="container-fluid" v-if="currentTerm != null">  
		<b-row>
      <b-col sm="2">
         <!-- <label class="tx-12 wt-600 dark-gray fw">Choose Survey Setup:</label>
         <b-form-group label="" class="">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group> -->
          <label class="tx-12 wt-600 dark-gray fw">Survey Management</label>
         <b-button 
            class="mr-1 float-left"
            variant="success"
            size="sm"
            @click="newSurvey()"
            >Create New Survey
          </b-button>
        </b-col>
        <b-col sm="3">
           <!-- <label class="tx-12 wt-600 dark-gray fw">Select saved survey for interviews:</label>
            <b-form-select size="sm" v-model="survey"  @change="chooseHistorial(survey)">
              <option :value="null" disabled>Select Survey</option>
              <option 
                v-for="(item, index) in surveys" 
                :key="index" 
                v-bind:value="item"> {{ item.name }}
              </option>
            </b-form-select> -->
      </b-col>
      <b-col sm="7">
         <label class="tx-12 wt-600 dark-gray fw">&nbsp;</label>
         <b-button 
            class="mr-1 float-right"
            variant="primary"
            size="sm"
            @click="saveSurvey(true)"
            >Save & Contine
          </b-button>
      </b-col>
      <b-col sm="12"><hr /></b-col>

       <b-col md="3">
          <label class="tx-12 wt-600 dark-gray fw">Saved Surveys</label>
          <b-list-group>
            <b-list-group-item  v-for="(x, index) in surveys" class="">
              {{ x.name }}
              <i 
                class="fa fa-times-circle float-right red pointer mt-1 ml-1"  
                v-b-tooltip.hover title="Delete Survey" @click="deleteSurvey(x, index)">
              </i>
              <i 
                v-b-tooltip.hover title="Edit Survey" 
                class="fa fa-edit dark-gray float-right ml-1 pointer mt-1 ml-1"  
                @click="chooseHistorial(x, index)"></i>
            </b-list-group-item>
          </b-list-group>
      </b-col>

       <b-col sm="9">
        <b-card id="surveyPreview" v-if="survey != null">
          <div>
            <b-row>
              <b-col sm="12" class="">
              <h5>
              {{ surveyType }} : {{ surveyName }}
              <!-- <b-button size="sm" variant="primary" class="float-right mr-1 mt-1">Test</b-button> -->
              <!-- <b-button size="sm" variant="success" class="float-right mr-1 mt-1" @click="saveSurvey(false)">Save Survey</b-button> -->
              <!-- <b-button size="sm" variant="danger" class="float-right mr-1 mt-1" @click="deleteSurvey(survey, surveyIndex)">Delete</b-button> -->
              <!-- {{ survey.term }} -->
              <!-- {{ survey.date_modified }} -->
              </h5>
              ___
            </b-col>
            <b-col sm="4" class="">
                 <label class="tx-12 wt-600 dark-gray fw">Add comments & questions:</label>
                 <span class="mr-2 btn btn-sm btn-success" @click="addQuestion()">
                    Add Question
                  </span>
                  <span class="mr-2 btn btn-sm btn-success" @click="addComment()">
                    Add Comment
                  </span>
              </b-col>

              <b-col sm="4">
                <label class="tx-12 wt-600 dark-gray fw">Survey Type:</label>
                <b-form-select v-model="surveyType" :options="surveyTypes"></b-form-select>
              </b-col>

              <b-col sm="4">
                 <label class="tx-12 wt-600 dark-gray fw">Survey Name:</label>
                  <b-form-input
                    v-model="surveyName"
                    type="text"
                    placeholder="Enter Survey Name..."
                  ></b-form-input>
              </b-col>

            </b-row>

          </div>
          <hr />

              <draggable
                :list="questions"
                class="list-group"
                :move="checkMove"
                @start="dragging = true"
                @end="dragging = false"
              >
                <div v-for="(x, index) in questions" :key="index"  class="list-group-item">
                  <i class="fa fa-bars move"></i>
                    <div v-if="x.type == 'Range'">
                       <p class="question-text mb-0 p-1 tx-12 wt-600">Question: {{ x.text }}</p>
                      <b-form-group>
                        <b-form-input
                          v-model="x.text"
                          type="text"
                          placeholder="..."
                        ></b-form-input>
                      </b-form-group>
                      <span v-for="(i, index) in x.options" class="mr-2">
                        <input type="radio" disabled>
                        <label class="ml-2 mr-2">{{ i }}</label>
                      </span>
                       <b-button size="sm" variant="danger" class="float-right mr-1 mt-1" @click="removeQuestion(x, index)">Delete</b-button>
                    </div>
                    <div v-if="x.type == 'Comment'">
                      <p class="question-text mb-0 p-1 tx-12 wt-600">Question: {{ x.question }}</p>
                      <b-form-input
                          v-model="x.question"
                          type="text"
                          placeholder="..."
                          class="mb-2"
                        ></b-form-input>
                        <b-form-textarea
                          :disabled="true"
                          v-model="x.text"
                          placeholder="Evaluator comments will go here..."
                          rows="3"
                          max-rows="6"
                        ></b-form-textarea>
                        <b-button size="sm" variant="danger" class="float-right mr-1 mt-1" @click="removeQuestion(x, index)">Delete</b-button>
                    </div>
                </div>
              </draggable>
        </b-card>
      </b-col>
    </b-row>
	</div>
</template>

<script>
import axios from 'axios'
import draggable from "vuedraggable";
// USE JS DATE FUNCTION TO GET ARRAY OF YEARS
const currentYear = (new Date()).getFullYear();
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))
const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'surveyManagement',
  props: ["organization","user","candidates","surveys","faculty", "currentTerm"],
  watch: {
    surveys: function(newVal, oldVal) { 
       if(newVal) { 
        this.surveys = newVal
       }
    },
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
        let x
        let terms = this.organization.terms
        if(terms.length > 0) {
          let yrs = []
          for(x in terms) { yrs.push(terms[x].year) }
          let max = yrs.reduce(function(a, b) {
            return Math.max(a, b);
          })
          this.newestTerm = max
        }
        else {
          this.newestTerm = (currentYear + 1)
        }
      }
    }
  },
  order: 0,
  components: {
    draggable,
    axios
  },
	data() {
    	return {
        enabled: true,
        dragging: false,
        surveyName: null,
        surveyType: null,
        surveyTerm: null,
        surveyIndex: null,
        surveyTerms: range(currentYear, currentYear - 50, -1),
        surveyTypes : ['Pre-Interview', 'Interview', 'Candidate Post Interview Satisfaction'],
        selected: null,
        options: [
          { text: 'Create New survey', value: 'new' },
          { text: 'Historical Surveys', value: 'historical' },
        ],
        questions: [],
        survey: null,
      }
  	},
  computed: {
    priorYears() {
        let x
        let terms = this.organization.terms
        let years = []
        for(x in terms) { 
          years.push(terms[x].year) }
        return years
      },
  },
  methods: {
    newSurvey() {
      this.selected = 'new'
      this.survey = {
        Organization: this.organization,
        date_created: null,
        date_modified: null,
        name: '',
        questions: [],
        term: this.currentTerm,
        type: null,
        uuid: null
      }
      this.surveyTerm = this.currentTerm
      this.surveyType = null  
      this.surveyName = ''
      this.questions  = []
    },
    checkMove: function(e) {
      // console.log("Future index: " + e.draggedContext.futureIndex);
    },
    addQuestion() {
      let x = {
          type: 'Range',
          text: '',
          preview: false,
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          selected: null,
      }
      this.questions.push(x)
    },
    addComment() {
      // console.log("ADD COMMENT")
       let x = {
          type: 'Comment',
          text: '',
          preview: false,
          question: ''
      }
      this.questions.push(x)
    },
    deleteSurvey(x, index) {
      // console.log("DELETE SURVEY")
      // console.log(x, index)
       axios.post(API_URL+'/survey/delete', x)
          .then(({data}) => {
            // console.log(data)
            this.surveys.splice(index, 1)
            this.survey       = null
            this.questions    = []
            this.surveyName   = null
            this.surveyType   = null
            this.surveyTerm   = null
            this.surveyIndex  = null
            this.selected     = null
          })
          .catch(function (e) {
            // alert(e)
            alert("Error deleting survey.")
          })
    },
    saveSurvey(nextTab) {
      
      if(this.surveyName.length == 0 || this.surveyName == null) {
        alert("Name the survey")
        return
      }
      if(this.surveyType == null) { 
        alert("Choose a survey type")
        return
      }
      else {
          if(this.selected === "new") {
            let input = {
              Organization  : this.user.Organization,
              type          : this.surveyType,  
              name          : this.surveyName,
              questions     : this.questions
            }
            this.addSurvey(input)
          }
          else if(this.selected === "historical") {
              this.survey.Organization = this.user.Organization
              this.survey.type        = this.surveyType  
              this.survey.name        = this.surveyName
              this.survey.questions   = this.questions
              this.updateSurvey(this.survey)
          }
      }
    },
    addSurvey(survey) {
      // console.log("ADD NEW SURVEY")
      // console.log(survey)
      axios.post(API_URL+'/survey/add', survey)
      .then(({data}) => {
        this.surveys.push(data)
        this.survey = data
        this.updateOrg(data)
        return true
      })
      .catch(function (e) {
        // console.log(e)
        alert("Error saving survey.")
        return false
      })
    },
    updateSurvey(survey) {
      // console.log("UPDATE SURVEY")
      // console.log(survey)
      let i = this.surveyIndex
       axios.post(API_URL+'/survey/update', survey)
      .then(({data}) => {
        // console.log(data)
        this.surveys[i] = survey
        this.updateOrg(this.survey)
        return true
      })
      .catch(function (e) {
        // console.log(e)
        alert("Error saving survey.")
        return false
      })
    },
    chooseHistorial(x, index) {
      // console.log("CHOOSE HISTORICAL")
      // console.log(x)
      this.selected = 'historical'
      this.survey = x
      this.surveyIndex = index
      this.surveyTerm = x.term
      this.surveyType = x.type  
      this.surveyName = x.name
      this.questions = x.questions
    },
    updateOrg(survey) {
      let x
      let terms = this.organization.terms
      for(x in terms) {
        if(terms[x].year == this.currentTerm.year) {
            this.organization.terms[x][this.survey.type] = this.survey
          }
      }
      this.$emit('updateOrg', this.organization)
    },
    removeQuestion(q, index) {
      // AXIOS API CALL TO DELETE THEN()
      this.survey.questions.splice(index, 1)
    },
    moveQuestion(question, destination) {
      // console.log(question, destination)
    }
  }
};
</script>
<style scoped lang="scss">
  .move {
    cursor: move;
  }
  #survey-list {
    min-height: 65vh;
  }
</style>