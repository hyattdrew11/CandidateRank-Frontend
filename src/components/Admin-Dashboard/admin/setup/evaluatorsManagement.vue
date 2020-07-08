<template>
  <div class="container-fluid">
    <b-row>
      <!-- <b-col sm="9"></b-col> -->
      <!-- END COL-9 -->
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Pre-Interview Email Reminders:</label>
        <br />
        <input type="checkbox">
        <span class="tx-12 wt-400">Active</span>
      </b-col>
      <b-col sm="3">
          <label class="tx-12 wt-600 dark-gray">Interview Date Email Reminders:</label>
          <br />
          <input type="checkbox">
          <span class="tx-12 wt-400">Active</span>
      </b-col>
      <b-col sm="3">
          <label class="tx-12 wt-600 dark-gray">Other Email Reminders:</label>
          <br />
          <input type="checkbox">
          <span class="tx-12 wt-400">Active</span>
      </b-col>

      <!-- END COL-4 -->
      <b-col sm="3" class="text-right">
        <label></label>
        <b-button class="mt-4" size="sm" variant="primary" @click="updateOrganization()">Save & Continue</b-button> 
      </b-col>
      <!-- END COL-8 -->
      <b-col sm="12"><hr /></b-col>
      <!-- END COL-12 -->
      <b-col sm="12">
        <table id="evaluatorTable" class="table table-bordered table-hover">
          <thead>
              <tr>
                <th v-for="(x, index) in fields" scope="col">
                   <input  v-if="index == 6" type="checkbox" class="mr-1"> {{ x }} 
                </th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(x, index) in currentTerm.faculty" :key="x.email">
              <td>{{ x.name }}</td>
              <td>{{ x.phone }}</td>
              <td>{{ x.email }}</td>
              <td>
                <!-- RESIDENT FACULTY -->
                <b-form-group>
                  <b-form-radio-group
                    @change="updateEvaluatorType(index, x.role)"
                    v-model="x.role"
                    :options="EvaluatorTypes"
                    :value="x.role"
                  >
                  </b-form-radio-group>
                </b-form-group>
              </td>
              <td>
                <!-- PRE-INTERVIEW AVALIBILITY  -->
                <b-form-group>
                  <b-form-radio-group
                    @change="updatePreinterview(index, x.preinterview)"
                    v-model="x.preinterview"
                    :options="preinterviewoptions"
                    :value="x.preinterview"
                  >
                  </b-form-radio-group>
                </b-form-group>
              </td> 
              <td>
              <!-- AVAILABLE FOR ONSITE -->
              <b-form-group>
                  <b-form-radio-group
                    @change="updateOnsite(index, x.onsite)"
                    v-model="x.onsite"
                    :options="onsiteoptions"
                    :value="x.onsite"
                  >
                  </b-form-radio-group>
                </b-form-group>
              </td>
              <td>
                 <span v-if="x.dates" class="fw block">
                   <input type="checkbox">
                   Check All
                 </span>
                <span v-if="x.dates" class="fw block" v-for="i in interviewDates">
                   <input 
                    type="checkbox" 
                    :checked="x.dates.some(e => e === i)"
                    @click="toggleDate(index, i)">
                    {{ i }}
                 </span>
              </td>
              <!-- <td># Pre</td> -->
            </tr>
          </tbody>
        </table>
        <!-- END TABLE -->
      </b-col>
      <!-- END COL-12 -->
    </b-row>
    <!-- END ROW -->
  </div>
  <!-- END PARENT DIV -->
</template>

<script>
import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
export default {
	name: 'evaluatorsManagement',
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
        year: this.currentTerm.year,
        fields:[
          'Name',
          'Phone',
          'Email',
          'Resident or faculty',
          'Available for pre interview',
          'Available for onsite interviews',
          'Interview Dates',
          // '# pre interviews assigned'
          ],
        options: [true , false],
        preinterviewoptions: [true , false],
        onsiteoptions: [true , false],
        EvaluatorTypes: ['Resident', 'Faculty'],
        interviewDates: [],
        term: null,
      }
  	},
    computed: {
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
    mounted() {},
  	methods: {
      updateEvaluatorType(index, type) {
        console.log(index, type)
        if(type == undefined) {
           this.currentTerm.faculty[index].role = this.EvaluatorTypes[0]
        }
        else {
          let evaluator = this.currentTerm.faculty[index]
          let Eindex = this.EvaluatorTypes.indexOf(type)
            if(Eindex == 0) {
              this.currentTerm.faculty[index].role = this.EvaluatorTypes[1]
            }
            else {
              this.currentTerm.faculty[index].role = this.EvaluatorTypes[0]
            }
        }
      },
      updateOnsite(index, onsite) {
        console.log("UPDATE ONSITE")
        console.log(index, onsite)
        if(onsite == undefined) {
           this.currentTerm.faculty[index].onsite = this.onsiteoptions[0]
        }
        else {
          let evaluator = this.currentTerm.faculty[index]
          let Eindex = this.onsiteoptions.indexOf(onsite)
            if(Eindex == 0) {
              this.currentTerm.faculty[index].onsite = this.onsiteoptions[1]
            }
            else {
              this.currentTerm.faculty[index].onsite = this.onsiteoptions[0]
            }
        }
      },
      updatePreinterview(index, preinterview) {
        console.log("UPDATE PREINTERVIEW")
       console.log(index, preinterview)
        if(preinterview == undefined) {
           this.currentTerm.faculty[index].preinterview = this.preinterviewoptions[0]
        }
        else {
          let evaluator = this.currentTerm.faculty[index]
          let Eindex = this.preinterviewoptions.indexOf(preinterview)
            if(Eindex == 0) {
              evaluator.preinterview = this.preinterviewoptions[1]
              this.currentTerm.faculty[index] = evaluator
            }
            else {
              evaluator.preinterview = this.preinterviewoptions[0]
              this.currentTerm.faculty[index] = evaluator
            }
        }
      },
      toggleDate(index, date) {
        let x 
        let dates = this.currentTerm.faculty[index].dates
        let match = false
        if(dates.length > 0) {
          for(x in dates) {
            if(dates[x] == date) {
              match = true
              dates.splice(x, 1)
            }
          }
          if(!match) {
           this.currentTerm.faculty[index].dates.push(date)
          }
        }
        else {
           this.currentTerm.faculty[index].dates.push(date)
        }
        console.log(this.currentTerm.faculty[index].dates)
      },
      toggleAvalibility(index, avalibility) {
        let x 
        let evaluator = this.faculty[index]
        if(avalibility == false) {
          evaluator.dates = []
          evaluator.avalibility = false
        }
        else {
          evaluator.dates = this.interviewDates
          evaluator.avalibility = true
        }
        this.faculty[index] = evaluator
      },
      updateOrganization() {

        let x 
        let terms = this.organization.terms
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
      },
      changeTerm(year) {
        let x
        let terms = this.organization.terms
        let term
        for(x in terms) { 
          if(terms[x].year == year) {
            console.log(this.currentTerm.faculty)
            term = this.organization.terms[x]
            this.interviewDates = terms[x].dates
            this.$emit('changeTerm', term)
          }
        }
      },
      changeTab(tab) {
        this.tab = tab
      },
      saveWizard() {
        this.$refs['em'].activate()
      },
      saveDate(x , index) {
        this.savedDates.push(x)
        this.interviewDates.splice(index, 1)
      },
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
      }
    }
};
</script>
<style scoped lang="scss">
    #evaluatorTable th {
    font-size: 10px;
  }
   #evaluatorTable td {
    font-size: 12px;
    padding: 5px 15px 5px 15px;
    vertical-align: middle;
  }
  #evaluatorTable td:nth-child(2)  {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #evaluatorTable td:last-child {
     width: 300px;
  }
</style>