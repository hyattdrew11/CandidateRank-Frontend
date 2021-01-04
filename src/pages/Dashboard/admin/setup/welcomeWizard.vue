<template>
  <div class="container-fluid">
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" ></i>
    <b-row no-gutters :class="{fade : loading }">
       <div :class="{'d-none' : selected != null}" class="fw">
         <b-row>
           <b-col sm="12" lg="12">
            <label class="tx-18 wt-600 dark-gray">Welcome to Canadidate Rank - Would you like to start a new application year or review prior years results?</label>
            <br />
              <b-button 
                size="sm" 
                variant="info"  
                @click="newYear()" 
                class="mr-1"
                >Start New Year</b-button> 
              <!-- <b-button size="sm" variant="secondary"  @click="priorYear()" class="mr-1">Prior Year</b-button>  -->
              <hr />
            </b-col>
             <b-col v-if="organization.terms" sm="12" md="4" class="mt-2" v-for="(x, index) in sortedTerms">
              <div>
                <b-card
                  :header="x.year + ' - Department - ' + x.department"
                  header-text-variant="white"
                  header-bg-variant="secondary"
                >
                <p class="mb-0 tx-14 wt-500">Interview Year: {{ x.year }}</p>
                <p class="mb-0 tx-14 wt-500">Pre-Interview Completion Date: {{ x.PIdate }}</p>
                <p class="mb-0 tx-14 wt-500">{{ x.dates.length }} interview dates</p>
                <p class="mb-0 tx-14 wt-500">{{ x.faculty.length }} evaluators</p>
                <hr />
                  <b-button size="sm" class="action-btn float-right" @click="priorYear(index)" variant="outline-secondary">Update</b-button>
                  <b-button size="sm" class="action-btn float-right mr-1" @click="deleteYear(index)" variant="outline-danger">Delete</b-button>
                </b-card>
              </div>
             </b-col>
          </b-row>
      </div>
      <!-- NEW TERM SELECTED -->
      <div :class="{'d-none' : selected != 'first'}" class="fw">
        <b-row v-if="selected">
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
                 <b-form-input :disabled="!year" v-model="currentTerm.department" placeholder=""></b-form-input>
              </b-input-group>
          </b-col>

          <b-col sm="4">
            <label class="tx-12 wt-600 dark-gray">Pre-Interview Completion Date:</label>
            <b-form-datepicker :disabled="!year" v-model="PIdate" :initial-date="year + '-01-01'" @input="changePIDate(PIdate, false)"></b-form-datepicker>
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

                ></b-calendar>
          </b-col>
          <b-col sm="4">
            <b-card style="min-height: 55vh;">
              <p>
                Interview Dates
                 <hr />
              </p>
              <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in sortDatesOld" class="date">
                {{ x.startDate }}

                 <i
                  @click="removeDateNew(x, index)"
                  v-b-tooltip.hover title="Remove Date" 
                  class="fa fa-times-circle pointer red float-right mr-2">
                </i>

              </p>
            </b-card>
          </b-col>
          <b-col sm="4">
              <b-card style="min-height: 55vh;">
              <p>
                Evaluators
                    <b-button   :disabled="!year" size="sm" variant="primary"  class="float-right" v-b-modal.modal-1>New User</b-button>
                    <b-dropdown :disabled="!year" size="sm" variant="secondary"  class="float-right tx-white mr-1" text="Add Existing" no-caret>
                      <template v-slot:button-content>
                        Add Existing
                        <!-- Add Evaluator -->
                      </template>
                      <b-dropdown-item 
                        @click="addEvaluatorNewTerm(x)" 
                        class="tx-14 wt-600 dark-gray"
                        v-for="(x, index) in faculty">
                        <i class="fa fa-user"></i>
                        {{ x.email }}
                      </b-dropdown-item>
                  </b-dropdown>
                <hr />
              </p>
               <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in currentTerm.faculty" class="date">
                  {{ x.email }}
                 <i
                  @click="removeUser(x, index)"
                  v-b-tooltip.hover title="Remove from term" 
                  class="fa fa-times-circle pointer red float-right mr-1">
                </i>
              </p>
            </b-card>
          </b-col>
        </b-row>
      </div>
      <!-- NEW TERM SELECTED -->

      <!-- ••••••••••••••••••• -->

      <!-- PRIOR TERM SELECTED -->
      <div :class="{'d-none' : selected != 'second'}" class="fw">
        <b-row v-if="selected">
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
            <label class="tx-12 wt-600 dark-gray">Interview Year:</label>
            <b-form-select disabled v-model="year" :options="priorYears" @change="loadTerm(year)"></b-form-select>
          </b-col>
           <b-col sm="4">
              <label class="tx-12 wt-600 dark-gray">Department Name:</label>
              <b-input-group>
                 <b-form-input v-model="currentTerm.department" placeholder=""></b-form-input>
              </b-input-group>
          </b-col>
          <b-col sm="4">
            <label class="tx-12 wt-600 dark-gray">Pre-Interview Completion Date:</label>
            <b-form-datepicker v-model="currentTerm.PIdate" :initial-date="year + '01-01'   " @input="changePIDate(PIdate, true)"></b-form-datepicker>
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

                ></b-calendar>
          </b-col>
          <b-col sm="4">
            <b-card style="min-height: 55vh;">
              <p>
                Interview Dates
                 <hr />
              </p>
              <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in sortDatesOld" class="date">
                  {{ x.startDate }}

                 <i
                  @click="removeDate(x, index)"
                  v-b-tooltip.hover title="Remove Date" 
                  class="fa fa-times-circle pointer red float-right mr-2">
                </i>

              </p>
            </b-card>
          </b-col>
          <b-col sm="4">
              <b-card style="min-height: 55vh;">
              <p>
                Evaluators
                <b-button size="sm" variant="primary" class="float-right" v-b-modal.modal-1>New User</b-button>
                <b-dropdown size="sm" variant="secondary"  class="float-right tx-white mr-1" text="Add Existing" no-caret>
                      <template v-slot:button-content>
                        Add Existing
                        <!-- Add Evaluator -->
                      </template>
                      <b-dropdown-item 
                        class="tx-14 wt-600 dark-gray"
                          @click="addEvaluatorPriorTerm(x)" 
                        v-for="(x, index) in faculty">
                        {{ x.email }}
                      </b-dropdown-item>
                  </b-dropdown>
                <hr />
              </p>
               <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in currentTerm.faculty" class="date">
                  {{ x.email }}
                 <i
                  @click="removeUser(x, index)"
                  v-b-tooltip.hover title="Remove from term" 
                  class="fa fa-times-circle pointer red float-right mr-1">
                </i>
              </p>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-row>  	


    <b-modal id="modal-1" title="Add New User" hide-footer>
        <label>Email</label>
        <b-form-input class="mb-2" v-model="newUser.email" placeholder="email"></b-form-input>
          <label>First name</label>
        <b-form-input class="mb-2" v-model="newUser.firstname" placeholder="first name"></b-form-input>
          <label>Last name</label>
        <b-form-input class="mb-2" v-model="newUser.lastname" placeholder="last name"></b-form-input>

        <b-form-group>
          <label>Phone #</label>
          <b-form-input class="mb-2" v-model="newUser.phone" placeholder="phone number"></b-form-input>
        </b-form-group>

        <b-form-group>
          <hr />
          <b-form-radio-group
            @change="updateEvaluatorType(newUser.role)"
            v-model="newUser.role"
            :options="EvaluatorTypes"
            :value="newUser.role"
            class="mb-2"
          >
          </b-form-radio-group>
      </b-form-group>
      <b-button variant="primary" class="float-right" @click="saveUser()">Save User</b-button>
      </b-modal>

  </div>
</template>

<script>
import axios from 'axios'
// USE JS DATE FUNCTION TO GET ARRAY OF YEARS
const currentYear = (new Date()).getFullYear();
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'welcomeWizard',
  props: ["organization","user","candidates","surveys","faculty", "currentTerm", "showHome"],
  watch: {
    showHome: function(newVal, oldVal) {
      // console.log(newVal, oldVal)
      if(newVal || oldVal) {
        this.selected = null
      }
    },
    organization: function(newVal, oldVal) {
      if(newVal) {
        // console.log("Welcome Wizard New organization")
        this.organization = newVal
      }
    },
    currentTerm: function(newVal, oldVal) {
      if(newVal) {
        // console.log("Welcome Wizard New currentTerm")
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
        loading: false,
        PIdate: null,
        text: null,
        newestTerm: null,
        departmentName: '...',
        newUser: {
          email: null,
          firstname: null,
          lastname: null,
          phone: null,
          role: 'Faculty'
        },
        EvaluatorTypes: ['resident', 'faculty'],
        selected: null,
        options: [
          { text: 'Start new year', value: 'first' },
          { text: 'Review Prior year results', value: 'second' },
        ],
        year: null,
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
       // sortDatesNew: {
       //  get: function() {
       //   let DT = this.currentTerm.dates.sort(function(a, b) {
       //      if(a.startDate < b.startDate) { return -1 }
       //      if(a.startDate > b.startDate) { return 1  }
       //      return 0
       //    })
       //   return DT
       // },
      //  set: function(newValue) {
      //   let DT = newValue.dates.sort(function(a, b) {
      //       if(a.startDate < b.startDate) { return -1 }
      //       if(a.startDate > b.startDate) { return 1  }
      //       return 0
      //     })
      //    return DT
      //   }
      // },
       sortDatesOld: {
        get: function() {
         let DT = this.interviewDates.sort(function(a, b) {
            if(a.startDate < b.startDate) { return -1 }
            if(a.startDate > b.startDate) { return 1  }
            return 0
          })
         return DT
       },
       set: function(newValue) {
        let DT = newValue.dates.sort(function(a, b) {
            if(a.startDate < b.startDate) { return -1 }
            if(a.startDate > b.startDate) { return 1  }
            return 0
          })
         return DT
        }
      },
      sortedTerms() {
        let st = this.organization.terms
            st = st.sort(function(a, b) {
              return b.year - a.year;
            })
        return st
      },
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
  	components: {
      axios
    },
    mounted() {},
  	methods: { 
      addEvaluatorNewTerm(x) {
        this.currentTerm.faculty.push(x)
      },
      addEvaluatorPriorTerm(x) {
         this.currentTerm.faculty.push(x)
      },
      saveUser() {
        let vm = this
        this.$bvModal.hide("modal-1")
        this.loading = true
        this.newUser.organization = this.organization.name
        let input = {
          "newUser" : this.newUser,
          "admin"   : this.user
        }
        // AXIOS UPDATE THE ORGANIZATION VIA API
        axios.post(API_URL+'/auth/user/add', input)
        .then(({data}) => { 
          if(data.user) {
            alert(data.user.email + " has been successfully added to your Zoom & Candidate Rank accounts. They will receive an email from both Zoom & Candidate Rank with account activation instructions.")
            if(this.selected != 'first') {
              this.currentTerm.faculty.push(data.user)
            }
            this.faculty.push(data.user)
          }
          if(data.error) {
            alert(data.error)
          }
          this.loading = false
        })
        .catch(function (e) { 
          // console.log(e) 
          alert("Error creating user please try again.")
          vm.loading = false
        })
      },
      updateEvaluatorType(type) {
        if(type == undefined) {
           this.newUser.role = this.EvaluatorTypes[0]
        }
        else {
          let Eindex = this.EvaluatorTypes.indexOf(type)
            if(Eindex == 0) {
               this.newUser.role = this.EvaluatorTypes[1]
            }
            else {
               this.newUser.role = this.EvaluatorTypes[0]
            }
        }
      },
      changePIDate(date, priorYear) {
        if(priorYear == true) {
          this.currentTerm.PIdate = date
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
            faculty: [],
            year: null
        }
        this.$emit('changeTerm', term)
      },
      priorYear(index) {
          this.$emit('changeTerm', this.organization.terms[index])
          this.selected = 'second'
      },
      deleteYear(index) {
        let conf = confirm("Deleting this term will remove all candidate and schedules.")
        if(conf) {
          this.loading = true
          let year     =  this.organization.terms[index].year
          this.organization.terms.splice(index, 1)
          axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
          .then(({data}) => { 
              axios.post(API_URL+'/organization/delete/term/'+year, this.organization)
              .then(({data}) => { 
                this.loading = false 
                // console.log(data)
              })
              .catch(function (e) { alert("Error deleting candidates") })

          })
          .catch(function (e) { alert(e) })
        }
        else {}
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
          axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
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
        else if(!this.year) {
          alert("Please choose an interview year.")
        }
        else {
          this.organization.terms.push(term)
          // AXIOS UPDATE THE ORGANIZATION VIA API
          axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
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
        // console.log("CHECK YEAR: "+year)
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
          else  { }
        }
        else {
          term  = {
            dates: [],
            department: '',
            faculty: [],
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
        // if(this.selected === "first") { }
        this.faculty.splice(index, 1)
        // this.currentTerm.faculty.splice(index, 1)
      },
      removeUser(x, index) {
        this.currentTerm.faculty.splice(index, 1)
      },
      removeSavedDate(x, index) {
        this.savedDates.splice(index, 1)
      },
      onContext(ymd, date) {
        let day = {}
        // console.log(ymd)
        let dates =  this.interviewDates
        if( dates.includes(ymd) ) {
          alert("Date Already Selected")
        }
        else {
          day.startDate = ymd
          day.endDate = ymd
          day.events = []
          day.rooms = []
          this.interviewDates.push(day)
        }
      },
      onContextPrior(ymd, date) {
        let day = {}
        // console.log(ymd)
        let dates =  this.currentTerm.dates
        if( dates.includes(ymd) ) {
          alert("Date Already Selected")
        }
        else {
          day.startDate = ymd
          day.endDate = ymd
          day.events = []
          day.rooms = []
          this.currentTerm.dates.push(day)
        }
      },
       getCandidates(year) {
          this.$Progress.start()
          let org = this.user.Organization
          axios.get(API_URL+'/candidate/all/'+org+'/'+year)
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