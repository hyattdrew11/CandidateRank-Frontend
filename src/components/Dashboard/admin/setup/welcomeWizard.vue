<template>
  <div class="container-fluid">
    <b-row no-gutters>
      <b-col sm="12">
       <div :class="{'d-none' : selected != null}" >
          <label class="tx-18 wt-600 dark-gray">Welcome to Canadidate Rank - Would you like to start a new application year or review prior years results?</label>
          <br />
            <b-button size="sm" variant="primary"  @click="newYear()" class="mr-1">Start New Year</b-button> 
            <b-button size="sm" variant="secondary"  @click="priorYear()" class="mr-1">Prior Year</b-button> 
        </div>
      </b-col>
      <div  :class="{'d-none' : selected != 'first'}" class="fw">
        <b-row>
          <b-col sm="2">
            <h5 class="pointer tx-18 wt-600 dark-gray" @click="restartWizard('new')">
              <i class="fa fa-caret-left"></i> Back
            </h5>
          </b-col>
          <b-col sm="8" class="text-center">
            <!-- <h5 class="tx-18 wt-600 dark-gray">Setup {{ year }}</h5> -->
          </b-col>

          <b-col sm="2" class="text-right">
            <b-button size="sm" variant="primary" @click="updateOrganization()">Save Progress</b-button> 
          </b-col>

          <b-col sm="12"><hr /></b-col>

           <b-col sm="6">
            <label class="tx-12 wt-600 dark-gray">Choose Year:</label>
            <b-form-select v-model="year" :options="years"></b-form-select>
          </b-col>
           <b-col sm="6">
              <label class="tx-12 wt-600 dark-gray">Department Name:</label>
              <b-input-group>
                 <b-form-input v-model="departmentName" placeholder=""></b-form-input>
                  <template v-slot:append>
                      <b-button variant="primary" @click="updateOrganization()">Update</b-button>
                    </template>
              </b-input-group>
          </b-col>
          <!--  <b-col sm="3">
              <label class="tx-12 wt-600 dark-gray">Deparment Logo:</label>
              <b-form-group>
                <input type="file" ref="file" style="display: none"  @change="previewFiles">
                <b-button  block variant="secondary" @click="$refs.file.click()">Upload</b-button>
              </b-form-group>
          </b-col>
           <b-col sm="3">
            <label class="tx-12 wt-600 dark-gray">Current Logo:</label><br />
            <img class="dpt-logo-preview" src="dpt-logo.png" />
          </b-col> -->
          <b-col sm="12"><hr /></b-col>
          <b-col sm="4" class="text-center">
             <p>Now, choose your interview date(s)</p>
               <b-calendar 
                id="interview-date-select" 
                v-model="date" 
                @context="onContext" 
                locale="en-US"
                 selected-variant="success" today-variant="info"
                ></b-calendar>
          </b-col>
          <b-col sm="4">
            <b-card style="min-height: 55vh;">
              <p>
                Interview Dates
                 <b-button size="sm" variant="primary" class="float-right" @click="updateOrganization()">Save Dates</b-button>
                 <hr />
              </p>
              <span class="underbar bg-gray"></span>
              <p v-for="(x, index) in interviewDates" class="date">
                {{ x.selectedFormatted }}

                 <i
                  @click="removeDate(x, index)"
                  v-b-tooltip.hover title="Remove Date" 
                  class="fa fa-minus-circle pointer red float-right mr-2">
                </i>

                 <i
                  @click="removeDate(x, index)"
                  v-b-tooltip.hover title="Remove Date" 
                  class="fa fa-lock pointer gray float-right mr-2">
                </i>

              </p>
            </b-card>
          </b-col>
          <b-col sm="4">
              <b-card style="min-height: 55vh;">
              <p>
                Evaluators
                <b-button size="sm" variant="primary" class="float-right" v-b-modal.modal-1>Add User</b-button>
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
                  @click="removeSavedDate(x, index)"
                  v-b-tooltip.hover title="Delete User" 
                  class="fa fa-minus-circle pointer red float-right mr-1">
                </i>
                 <i
                  @click="removeSavedDate(x, index)"
                  v-b-tooltip.hover title="Lock User" 
                  class="fa fa-lock pointer gray float-right mr-1">
                </i>
              </p>
            </b-card>
          </b-col>
        </b-row>
      </div>
      <div :class="{'d-none' : selected != 'second'}" class="fw">
        <b-row>
          <b-col sm="6">
            <h5 class="pointer" @click="restartWizard('prior')">
              <i class="fa fa-caret-left"></i> Back
            </h5>
          </b-col>
          <b-col sm="6">
            <h5 class="text-right">
              
            </h5>
          </b-col>
          <b-col sm="12"><hr /></b-col>
          <b-col sm="7">
               <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
               <b-form-input v-model="text" placeholder="Search Candidates"></b-form-input>
            </b-col>
          <b-col sm="5">
              <label class="tx-12 wt-600 dark-gray">Choose Year:</label>
              <b-form-select v-model="year" :options="priorYears" @change="getCandidates(year)"></b-form-select>
          </b-col>
          <b-col sm="12">
            <hr />
            <table id="PreInterviewRankings" class="table table-bordered table-hover">
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
                    <td class="pointer wt-600" @click="candidateDetails(x)">
                      <!-- <img class="profile-sm" :src="x.picture" /> -->
                       {{ x['First Name'] }} {{ x['Last Name'] }}
                    </td>
                    <td>{{ x.interview.status }}</td>
                    <td class="td-int">{{ x.survey_1.status }}</td>
                    <td class="td-int">{{ x.survey_2.status }}</td>
                    <td class="td-int">
                       <b-button size="sm" variant="primary" squared class="">View</b-button>
                    </td>
                </tr>
              </tbody>
            </table>
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
  props: ["organization","user","candidates","surveys","faculty"],
  watch: {
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
        year: currentYear,
        years: range(currentYear + 1 , currentYear - 50, -1),
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
          years.push(terms[x].year) }
        return years
      },
    },  
  	components: {},
    mounted() {},
  	methods: { 
      updateYear(year) {
        // AXIOS CALL GET ALL CANDIDATES FROM YEAR
      },
      newYear() {
        this.selected = 'first'
          let x
          let terms = this.organization.terms
          this.selected = 'first'
          // for(x in terms) {
          //   if(terms[x].year == this.year) {
          //     let c = confirm("You already have started setup for this year. Would you like to edit this year's setup?")
          //     if(c) {
          //       this.selected = 'second'
          //     }
          //     else {
          //        // window.location.reload()
          //        this.selected = null
          //     }
          //   }
          //   else {
          //     // axios call to create a new term in an organization
          //       // dates is an array in organization terms addDate(term)
          //     this.selected = 'first'
          //   }
          // }
      },
      priorYear() {
        this.selected = 'second'
        this.years = this.priorYears
      },
      updateOrganization() {
        let save = confirm("Save My Progress")
        // CONFIRM ADMIN WANTS TO SAVE A NEW TERM
        if(save) {
          // IF ADMIN WANTS A NEW TERM CREATE THE TERM JSON-OBJECT
            let term = {
              year: this.year,
              dates: this.interviewDates,
              faculty: this.faculty,
              department: this.departmentName
          }
          let x 
          // let terms = this.organization.terms
          // let newTerm = false
          // for(x in terms) {
          //   if(terms[x].year == term.year) {
          //     terms[x] = term
          //   }
          //   else {
          //     newTerm = true
          //     return newTerm
          //   }
          // }
          // if(newTerm) {
          //   // PUSH THE TERM TO THE ORGANIZATIONS TERMS ARRAY AND OUR VUE COMPONENTS / INTERFACE / LOCAL STORAGE
          //   this.organization.terms.push(term)
          // }
            this.organization.terms.push(term)
            // AXIOS UPDATE THE ORGANIZATION VIA API
          window.axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
            .then(({data}) => { 
              alert("Term setup saved successfully")
            })
            .catch(function (e) { alert(e) })
          }
      },
      previewFiles(event) {
      },
      uploadLogo() {},
      restartWizard(type) {
        if(type == 'prior') {
          this.selected = null
        }
        else {
          // CHECK IF ANY PROGRESS HAS BEEN MADE IN NEW TERM
          // YEAR || DEPARTMENT NAME || DEPARTMENT LOGO || SELECTED DATES || SAVED DATES
          let save = confirm("Save My Progress")
          if(save) {
            // AXIOS UPDATE ORGANIZATION 
            alert("Progress Saved")
            this.selected = null
          }
          else {
            this.selected = null
          }
        }
      },
      saveWizard() {
        this.$refs['em'].activate()
      },
      // saveDate(x , index) {
        // axios call to updateOrg(orgObject) 
        // this.savedDates.push(x)
        // this.newTerm.dates.push(x)
        // this.interviewDates.splice(index, 1)
         // let x
          // let dates = this.organization.terms
          // for(x in terms) {
          //   if terms[x]
          // }

          // window.axios.post('/api/survey/update', input)
          //   .then(({data}) => {
          //     this.surveys.push(data)
          //   })
          //   .catch(function (e) {
          //     alert(e)
          //     alert("Error saving survey.")
          //   })
      // },
      removeDate(x, index) {
        this.interviewDates.splice(index, 1)
      },
      removeSavedDate(x, index) {
        this.savedDates.splice(index, 1)
      },
      onContext(ctx) {
        if(ctx.selectedDate == null) {
          this.context = ctx
        }
        else {
          this.context = ctx
          this.interviewDates.push(ctx)
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