<template>
  <div class="container-fluid">
    <b-row no-gutters>
       <div :class="{'d-none' : selected != null}" class="fw">
         <b-row>
           <b-col sm="12" lg="12">
            <label class="tx-18 wt-600 dark-gray">Welcome to Canadidate Rank - Would you like to start a new application year or review prior years results?</label>
            <br />
              <b-button size="sm" variant="info"  @click="newYear()" class="mr-1">Start New Year</b-button> 
              <!-- <b-button size="sm" variant="secondary"  @click="priorYear()" class="mr-1">Prior Year</b-button>  -->
              <hr />
            </b-col>
             <b-col sm="12" md="4" class="pointer" v-for="(x, index) in organization.terms">
              <b-card
                :header="'Department - ' + x.department"
                header-text-variant="white"
                header-bg-variant="secondary"
              >
              <p>Interview Year: {{ x.year }}</p>
              <p>Pre-Interview Completion Date: {{ x.PIdate }}</p>
              <p>{{ x.dates.length }} interview dates</p>
              <p>{{ x.faculty.length }} evaluators</p>
              <b-button size="sm" class="action-btn" @click="priorYear(index)" variant="secondary">Edit</b-button>
              </b-card>
             </b-col>
          </b-row>
      </div>
      <div :class="{'d-none' : selected != 'first'}" class="fw">
        <b-row>
          <b-col sm="2">
            <h5 class="pointer tx-18 wt-600 dark-gray" @click="restartWizard('new')">
              <i class="fa fa-caret-left"></i> Exit
            </h5>
          </b-col>
          <b-col sm="8" class="text-center pt-1">
            <h5 class="tx-18 wt-600 dark-gray">New Interview Year Setup {{ year }}</h5>
          </b-col>

          <b-col sm="2" class="text-right">
            <b-button size="sm" variant="primary" @click="updateOrganization()">Save & Continue</b-button> 
          </b-col>

          <b-col sm="12"><hr /></b-col>

           <b-col sm="4">
            <label class="tx-12 wt-600 dark-gray">Choose New Interview Year:</label>
            <b-form-select v-model="year" :options="years" @change="checkYear(year)"></b-form-select>
          </b-col>
           <b-col sm="4">
              <label class="tx-12 wt-600 dark-gray">Department Name:</label>
              <b-input-group>
                 <b-form-input v-model="currentTerm.department" placeholder=""></b-form-input>
              </b-input-group>
          </b-col>

          <b-col sm="4">
            <label class="tx-12 wt-600 dark-gray">Pre-Interview Completion Date:</label>
            <b-form-datepicker v-model="PIdate" @input="changePIDate(PIdate, false)"></b-form-datepicker>
          </b-col>
          <b-col sm="12"><hr /></b-col>
          <b-col sm="4" class="text-center">
             <p>Now, choose your interview date(s)</p>
               <b-calendar 
                id="interview-date-select" 
                v-model="yearMin" 
                @selected="onContext" 
                locale="en-US"
                selected-variant="success" 
                today-variant="info"
                :min="yearMin" 
                :max="yearMax"
                ></b-calendar>
          </b-col>
          <b-col sm="4">
            <b-card style="min-height: 55vh;">
              <p>
                Interview Dates
                 <hr />
              </p>
              <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in interviewDates" class="date">
                {{ new Date(x).toUTCString() }}

                 <i
                  @click="removeDateNew(x, index)"
                  v-b-tooltip.hover title="Remove Date" 
                  class="fa fa-minus-circle pointer red float-right mr-2">
                </i>

              </p>
            </b-card>
          </b-col>
          <b-col sm="4">
              <b-card style="min-height: 55vh;">
              <p>
                Evaluators
                <b-button size="sm" variant="primary" class="float-right" v-b-modal.modal-1>New User</b-button>
                <b-modal id="modal-1" title="Add New User" no-footer>
                  <label>email</label>
                  <b-form-input v-model="newUser.email" placeholder="email"></b-form-input>
                   <label>Temporary password:</label>
                  <b-form-input v-model="newUser.password" placeholder="password"></b-form-input>
                </b-modal>
                <hr />
              </p>
               <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in faculty" class="date">
                  {{ x.email }}
                 <i
                  @click="removeUserNew(x, index)"
                  v-b-tooltip.hover title="Remove from term" 
                  class="fa fa-minus-circle pointer red float-right mr-1">
                </i>
              </p>
            </b-card>
          </b-col>
        </b-row>
      </div>
      <div :class="{'d-none' : selected != 'second'}" class="fw">
        <b-row>
          <b-col sm="2">
            <h5 class="pointer tx-18 wt-600 dark-gray" @click="restartWizard('prior')">
              <i class="fa fa-caret-left"></i> Exit
            </h5>
          </b-col>
          <b-col sm="8" class="text-center pt-1">
            <h5 class="tx-18 wt-600 dark-gray">Prior Year Setup {{ year }}</h5>
          </b-col>
          <b-col sm="2" class="text-right">
            <b-button size="sm" variant="primary" @click="updatePrior()">Save & Continue</b-button> 
          </b-col>
          <b-col sm="12"><hr /></b-col>

           <b-col sm="4">
            <label class="tx-12 wt-600 dark-gray">Choose Previous or Ongoing Interview Year:</label>
            <b-form-select v-model="year" :options="priorYears" @change="loadTerm(year)"></b-form-select>
          </b-col>
           <b-col sm="4">
              <label class="tx-12 wt-600 dark-gray">Department Name:</label>
              <b-input-group>
                 <b-form-input v-model="currentTerm.department" placeholder=""></b-form-input>
              </b-input-group>
          </b-col>
          <b-col sm="4">
            <label class="tx-12 wt-600 dark-gray">Pre-Interview Completion Date:</label>
            <b-form-datepicker v-model="currentTerm.PIdate" @input="changePIDate(PIdate, true)"></b-form-datepicker>
          </b-col>
          <b-col sm="12"><hr /></b-col>
          <b-col sm="4" class="text-center">
             <p>Now, choose your interview date(s)</p>
               <b-calendar 
                id="interview-date-select" 
                v-model="yearMin" 
                @selected="onContextPrior" 
                locale="en-US"
                selected-variant="success" 
                today-variant="info"
                :min="yearMin" 
                :max="yearMax"
                ></b-calendar>
          </b-col>
          <b-col sm="4">
            <b-card style="min-height: 55vh;">
              <p>
                Interview Dates
                 <hr />
              </p>
              <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in currentTerm.dates" class="date">
                  {{ new Date(x).toUTCString() }}

                 <i
                  @click="removeDate(x, index)"
                  v-b-tooltip.hover title="Remove Date" 
                  class="fa fa-minus-circle pointer red float-right mr-2">
                </i>


              </p>
            </b-card>
          </b-col>
          <b-col sm="4">
              <b-card style="min-height: 55vh;">
              <p>
                Evaluators
                <b-button size="sm" variant="primary" class="float-right" v-b-modal.modal-1>New User</b-button>
                <hr />
              </p>
               <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in currentTerm.faculty" class="date">
                  {{ x.email }}
                 <i
                  @click="removeUser(x, index)"
                  v-b-tooltip.hover title="Remove from term" 
                  class="fa fa-minus-circle pointer red float-right mr-1">
                </i>
              </p>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-row>  	
  </div>
</template>

<script>
// USE JS DATE FUNCTION TO GET ARRAY OF YEARS
const currentYear = (new Date()).getFullYear();
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'welcomeWizard',
   props: ["organization","user","candidates","surveys","faculty", "currentTerm"],
  watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    },
    currentTerm: function(newVal, oldVal) {
      if(newVal) {
        this.year = newVal.year
        let x
        let terms = this.organization.terms
        let term
        for(x in terms) { 
          if(terms[x].year == this.year) {
            term = this.organization.terms[x]
            this.interviewDates = terms[x].dates
          }
        }
      }
    }
  },
	data() {
    	return {
        PIdate: null,
        text: null,
        newestTerm: null,
        departmentName: '...',
        newUser: {
          email: null,
          password: null,
        },
        selected: null,
        options: [
          { text: 'Start new year', value: 'first' },
          { text: 'Review Prior year results', value: 'second' },
        ],
        year: this.currentTerm.year,
        years: range(currentYear + 10 , currentYear - 10, -1),
        date: '',
        interviewDates: [],
        savedDates: [],
        context: null,
        fields : [
          {
             'name':'Rank',
             'order': null,
           },
           {
              'name' : 'Name', 
              'order': null,
            },
            {
              'name': 'Interview',
              'order': null,
            },
            {
              'name':'Pre-Interview Survey',
              'order': null,
            },
            {
              'name':'Interview Survey', 
              'order': null,
            },
            {
              'name':'Application',
              'order': null,
            }
          ],
      }
  	},
    computed: {
      yearMin: {
        get: function() {
          let min = this.year + '-01-01'
          return min
        },
        set: function(newValue) {
          let min = newValue + '-01-01'
          return min
        }
      },
      yearMax: {
        get: function() {
          let min = this.year + '-12-31'
          return min
        },
        set: function(newValue) {
          let min = newValue + '-12-31'
          return min
        }
      },
      newTerm() {
        let x = {
          "year"  : this.year,
          "dates" : this.interviewDates,
          "name"  : this.text 
        }
        return x
      },
      priorYears() {
        let x
        let terms = this.organization.terms
        let years = []
        for(x in terms) { 
          years.push(terms[x].year) 
        }
        return years
      },
    },  
  	components: {},
    mounted() {},
  	methods: { 
      changePIDate(date, priorYear) {
        console.log(date, priorYear)
        if(priorYear == true) {
          this.currentTerm.PIdate = date
          // console.log(this.currentTerm.PIdate, date)
        }
        else {}
      },
      loadTerm(year) {
        this.year = year
        let x
        let terms = this.organization.terms
        for(x in terms) {       
          if(terms[x].year == year) {
            let term = this.organization.terms[x]
            this.$emit('changeTerm', term)
          }
        }
      },
      newYear() {
        this.selected = 'first'
        let term  = {
            dates: [],
            department: '',
            faculty: this.faculty,
            year: null
        }
        this.$emit('changeTerm', term)
      },
      priorYear(index) {
          this.$emit('changeTerm', this.organization.terms[index])
          this.selected = 'second'
      },
      updatePrior() {
        let x 
        let terms = this.organization.terms
        if(this.currentTerm.department.length == 0 || this.currentTerm.department == '') { 
          alert("Please enter a department name.")
        }
        else if(this.currentTerm.dates.length == 0) {
          alert("Please add at least one interview date")
        }
        else if(this.currentTerm.faculty.length == 0 ) {
          alert("Please add at least one evaluator")
        }
        else {
          for(x in terms) { 
            if(terms[x].year == this.currentTerm.year) {
              this.organization.terms[x] = this.currentTerm
            }
          }
          // AXIOS UPDATE THE ORGANIZATION VIA API
          window.axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
          .then(({data}) => { 
            this.$emit("update:organization", data)
            let c = confirm("Term updated. Move to next step?")
            if(c) {
              this.$emit('nextStep', this.currentTerm)
            }
            else {}
          })
          .catch(function (e) { alert(e) })
        }
      },
      updateOrganization() {
        let x 
        let faculty = this.faculty
        for(x in faculty) {
          faculty[x].dates = []
        }
        let term = {
            year: this.year,
            dates: this.interviewDates,
            faculty: faculty,
            department: this.currentTerm.department,
            status: 'Inactive',
            PIdate: this.PIdate,
            rooms: [],
            interviewLength: 15,
            interviewStartTime: 0,
            interviewEndTime: 0,
            breaks: [],
        }
        if(this.currentTerm.department.length == 0 || this.currentTerm.department == '') { 
          alert("Please enter a department name.")
        }
        else if(this.interviewDates.length == 0) {
          alert("Please add at least one interview date")
        }
        else if(faculty.length == 0 ) {
          alert("Please add at least one evaluator")
        }
        else {
          this.organization.terms.push(term)
          // AXIOS UPDATE THE ORGANIZATION VIA API
          window.axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
            .then(({data}) => { 
              let c = confirm("Term saved successfully. Move to next step?")
              // this.$emit("update:organization", data)
              if(c) {
                this.$emit('nextStep', term)
              }
              else {}
            })
            .catch(function (e) { alert(e) })
        }
      },
      previewFiles(event) {},
      restartWizard(type) {
        this.selected = null
        let  term = {
            dates: [],
            faculty: null,
            department: null,
            year: null
        }
        this.$emit('changeTerm', term)
      },
      checkYear(year) {
        console.log("CHECK YEAR: "+year)
        let x
        let terms = this.organization.terms
        let check = false
        let term
        for(x in terms) {
          if(terms[x].year == year) { 
            term = terms[x]
            check = true 
          }
        }
        if(check) {
          let c = confirm("You already have started setup for this year. Would you like to edit this year's setup?")
          if(c) { 
            this.$emit('changeTerm', term)
            this.selected = 'second' 
          }
          else  { this.selected = null }
        }
        else {
          term  = {
            dates: [],
            department: '',
            faculty: this.faculty,
            year: year
          }
          this.interviewDates = []
          this.$emit('changeTerm', term)
        }
      },
      removeDate(x, index) {
         this.currentTerm.dates.splice(index, 1)
      },
      removeDateNew(x, index) {
         this.interviewDates.splice(index, 1)
      },
      removeUserNew(x, index) {
        this.faculty.splice(index, 1)
      },
      removeUser(x, index) {
        this.currentTerm.faculty.splice(index, 1)
      },
      removeSavedDate(x, index) {
        this.savedDates.splice(index, 1)
      },
      onContext(ymd, date) {
        let dates =  this.interviewDates
        if( dates.includes(ymd) ) {
          alert("Date Already Selected")
        }
        else {
          this.interviewDates.push(ymd)
        }
      },
      onContextPrior(ymd, date) {
        let dates =  this.currentTerm.dates
        if( dates.includes(ymd) ) {
          alert("Date Already Selected")
        }
        else {
           this.currentTerm.dates.push(ymd)
        }
      },
       getCandidates(year) {
          this.$Progress.start()
          let org = this.user.Organization
          window.axios.get(API_URL+'/candidate/all/'+org+'/'+year)
          .then(({ data }) => {
            let x 
            for(x in data) {
              this.candidates.push(data[x])
            }
            this.$Progress.finish()
          })
          .catch(function (e) {
              this.$Progress.fail()
              alert('Error loading search candidates, please refresh.')
          })
      },
    }
};
</script>
<style scoped lang="scss">
    #PreInterviewRankings th {
    font-size: 10px;
  }
   #PreInterviewRankings td {
    font-size: 12px;
    padding: 5px 15px 5px 15px;
    vertical-align: middle;
  }
  #PreInterviewRankings td:nth-child(2)  {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  // .td-int {
  //    max-width: 80px;
  // }
  #PreInterviewRankings td:last-child {
     width: 300px;
  }
  .profile-sm {
    display: inline-block;
    border-radius: 100%;
    height: 35px;
    width:  auto;
    margin-right: 10px;
  }
</style>