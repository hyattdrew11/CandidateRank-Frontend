<template>
	<div class="container-fluid">  
		<b-row>
      <b-col sm="6">
        <p v-if="surveyType == 'Pre-Interview'">
          <sup>*</sup>
          You will now create a new Pre-Interview survey or choose from prior years.
        </p>
          <p v-if="surveyType == 'Interview'">
          <sup>*</sup>
          You will now create a new Interview survey or choose from prior years.
        </p>
      </b-col>
      <b-col sm="6">
         <b-form-group label="" class="text-right">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col sm="12"><hr /></b-col>
      <b-col v-if="selected == 'new' " sm="12" class="">
         <span class="pointer mr-2" @click="addQuestion()">
            <i class="fa fa-plus-circle green"></i>
            Add Question
          </span>
         <!--  <span class="pointer mr-2" @click="addQuestion()">
            <i class="fa fa-plus-circle green"></i>
            Add Text Box
          </span> -->
          <b-button 
            class="mr-1 float-right bg-green white"
            variant="outline-secondary"
            size="sm"
            @click="saveSurvey()"
            >Save Survey
          </b-button>
          <hr />
    </b-col>
    <b-col v-if="selected == 'new' " sm="12">
        <div id="newSurvey">
          <b-row>
            <b-col sm="4">
              <b-form-group label="Survey Name:" >
                      <b-form-input
                        v-model="surveyName"
                        type="text"
                        placeholder="Enter Survey Name..."
                      ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group label="Survey Year:" >
                <b-form-select v-model="surveyTerm" :options="priorYears"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group label="Survey Type:" >
                <b-form-select v-model="surveyType" :options="surveyTypes"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
         <table id="evaluatorTable" class="table table-bordered">
         <tbody>
          <tr v-for="(x, index) in questions">
              <td>
                <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.text }}</p>
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
                 <b-button size="sm" variant="danger" class="float-right mr-1" @click="removeQuestion(x, index)">Delete</b-button>
              </td>
          </tr>
        </tbody>
      </table>
          <b-col sm="3">
         <!--  <b-form-input v-model="survey.name"           :placeholder="survey.name"></b-form-input>
          <b-form-input v-model="survey.type"           :placeholder="survey.type"></b-form-input>
          <b-form-input v-model="survey.date_created"   :placeholder="survey.date_created"></b-form-input>
          <b-form-input v-model="survey.date_modified"  :placeholder="survey.date_modified"></b-form-input>
          <b-form-input v-model="survey.term"           :placeholder="survey.term"></b-form-input> -->
        </b-col>
         <b-col sm="12"></b-col>
        </div>
      </b-col>
      <b-col v-if="selected == 'historical' " sm="8">
        <label v-if="survey.name != null">
           <!--  <b-button variant="primary"   size="sm" class="mr-1">Choose  {{ survey.name }}</b-button>
            <b-button variant="secondary" size="sm" class="mr-1">Duplicate  {{ survey.name }}</b-button> -->
        </label>
        <p v-if="survey.name == null" class="text-right">
          <!-- Choose exsisting survey <i class="fa fa-caret-right"></i>  -->
        </p>
        <b-card id="surveyPreview">
          <h5>
            {{ survey.name }}
            {{ survey.type }}
            {{ survey.term }}
            {{ survey.date_modified }}
          </h5>
          <hr />
           <div v-for="(x, index) in survey.questions">
                <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.text }}</p>
                <span v-for="(i, index) in x.options" class="mr-2">
                  <input type="radio" disabled>
                  <label class="ml-2 mr-2">{{ index }}</label>
                </span>
                <hr />
          </div>
        </b-card>
      </b-col>
      <b-col v-if="selected == 'historical' " sm="4">
        <label>Saved Surveys</label>
        <b-list-group>
          <b-list-group-item  v-for="(x, index) in surveys" class="pointer" @click="chooseHistorial(x)">
            {{ x.name }}  <span class="float-right">{{ x.term }}</span>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
	</div>
</template>

<script>

// USE JS DATE FUNCTION TO GET ARRAY OF YEARS
const currentYear = (new Date()).getFullYear();
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))

export default {
	name: 'surveyManagement',
  props: ["organization","user","candidates","surveys","faculty"],
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
	data() {
    	return {
        surveyName: ' ',
        surveyType: 'Pre-Interview',
        surveyTerm: '2020',
        surveyTerms: range(currentYear, currentYear - 50, -1),
        surveyTypes : ['Pre-Interview', 'Interview'],
        selected: 'new',
        options: [
          { text: 'Create New survey', value: 'new' },
          { text: 'Historical Surveys', value: 'historical' },
        ],
        questions: [],
        survey: {
          "Organization"  : this.user.Organization,
          "term"          : this.surveyTerm,  
          "type"          : this.surveyType,  
          "name"          : this.surveyName,
          "questions"     : this.questions
        },
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
    getSurveys() {},
    addQuestion() {
      let x = {
          text: '',
          preview: false,
          options: [0, 1, 2, 3, 4, 5],
          selected: null,
      }
      this.questions.push(x)
    },
    saveSurvey() {
      let input = {
          Organization  : this.user.Organization,
          term          : this.surveyTerm,  
          type          : this.surveyType,  
          name          : this.surveyName,
          questions     : this.questions
        }
      window.axios.post('/api/survey/add', input)
        .then(({data}) => {
          this.surveys.push(data)
        })
        .catch(function (e) {
          alert(e)
          // alert("Error saving survey.")
        })
    },
    chooseHistorial(x) {
      this.survey = x
    },
    removeQuestion(q, index) {
      // AXIOS API CALL TO DELETE THEN()
      this.questions.splice(index, 1)
    },
    moveQuestion(question, destination) {
      console.log(question, destination)
    }
  }
};
</script>
<style scoped lang="scss"></style>