<template>
	<div class="container-fluid">  
		<b-row>
      <b-col sm="9">
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
         <label class="tx-12 wt-600 dark-gray fw">&nbsp;</label>
         <b-button 
            class="mr-1 float-right"
            variant="primary"
            size="sm"
            @click="saveSurvey()"
            >Save & Contine
          </b-button>
      </b-col>
      <b-col sm="12"><hr /></b-col>

       <b-col md="3">
          <label class="tx-12 wt-600 dark-gray fw">Saved Surveys</label>
          <b-list-group>
            <b-list-group-item  v-for="(x, index) in surveys" class="pointer" @click="chooseHistorial(x)">
              <i class="fa fa-file dark-gray"></i>
              {{ x.name }}
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
              <!-- <b-button size="sm" variant="success" class="float-right mr-1 mt-1">Activate</b-button> -->
              <!-- <b-button size="sm" variant="danger" class="float-right mr-1 mt-1">Delete</b-button> -->
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
                        <label class="ml-2 mr-2">{{ index }}</label>
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



      <!-- <b-col v-if="selected == 'new' " sm="12">
        <div id="newSurvey">
          <b-row>
            <b-col sm="12">
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
                        <label class="ml-2 mr-2">{{ index }}</label>
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
            </b-col>
          </b-row>
        </div>
      </b-col> -->
       <b-col v-if="selected == 'historical' " sm="4">
       <!--  <b-card id="survey-list">
          <label class="tx-12 wt-600 dark-gray fw">Saved Surveys</label>
          <b-list-group>
            <b-list-group-item  v-for="(x, index) in surveys" class="pointer" @click="chooseHistorial(x)">
              <i class="fa fa-file dark-gray"></i>
              {{ x.name }}
            </b-list-group-item>
          </b-list-group>
        </b-card> -->
      </b-col>
      <!-- <b-col v-if="selected == 'historical' " sm="8">
        <b-card id="surveyPreview" v-if="survey != null">
          <h5>
            {{ survey.type }} : {{ survey.name }}
            <b-button size="sm" variant="primary" class="float-right mr-1 mt-1">Test</b-button>
            <b-button size="sm" variant="success" class="float-right mr-1 mt-1">Activate</b-button>
            <b-button size="sm" variant="danger" class="float-right mr-1 mt-1">Delete</b-button>
            {{ survey.term }}
            {{ survey.date_modified }}
          </h5>
          <hr />
           <div v-for="(x, index) in survey.questions">
            <div v-if="x.type == 'Range'" class="mb-1">
              <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.text }}</p>
              <span v-for="(i, index) in x.options" class="mr-2">
                <input type="radio">
                <label class="ml-2 mr-2">{{ index }}</label>
              </span>
              <hr />
            </div>
            <div v-if="x.type == 'Comment'" class="mb-1">
              <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.question }}</p>
                <b-form-textarea
                  :disabled="false"
                  v-model="x.text"
                  placeholder="Evaluator comments will go here..."
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
                <hr />
            </div>
          </div>
        </b-card>
      </b-col> -->
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
    getSurveys() {},
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    addQuestion() {
      let x = {
          type: 'Range',
          text: '',
          preview: false,
          options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          selected: null,
      }
      this.questions.push(x)
    },
    addComment() {
       let x = {
          type: 'Comment',
          text: '',
          preview: false,
          question: ''
      }
      this.survey.questions.push(x)
    },
    saveSurvey() {
      
      if(this.surveyName.length == 0 || this.surveyName == null) {
        alert("Name the survey")
        return
      }
      if(this.surveyType == null) { 
        alert("Choose a survey type")
        return
      }
      else {
        let input = {
            Organization  : this.user.Organization,
            term          : this.surveyTerm,  
            type          : this.surveyType,  
            name          : this.surveyName,
            questions     : this.questions
          }
          console.log(input)
        axios.post(API_URL+'/survey/add', input)
          .then(({data}) => {
            console.log(data)
            this.surveys.push(data)
            this.survey = {
              "Organization"  : this.user.Organization,
              "term"          : this.surveyTerm,  
              "type"          : this.surveyType,  
              "name"          : '',
              "questions"     : []
            }
            let conf = confirm(this.surveyType + ': '  + this.surveyName + " sucessfully saved and activated. Move on to next step.")
            this.questions = []
            this.surveyName = null
            if(conf) {
              this.$emit('nextStep', this.currentTerm)
            }
          })
          .catch(function (e) {
            alert(e)
            // alert("Error saving survey.")
          })
      }
    },
    chooseHistorial(x) {
      console.log(x)
      this.survey = x
      this.surveyTerm = x.term
      this.surveyType = x.type  
      this.surveyName = x.name
      this.questions = x.questions
    },
    removeQuestion(q, index) {
      // AXIOS API CALL TO DELETE THEN()
      this.survey.questions.splice(index, 1)
    },
    moveQuestion(question, destination) {
      console.log(question, destination)
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