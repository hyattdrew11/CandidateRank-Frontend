<template>
  <div class="container-fluid">
   <b-row>
      <b-col sm="9">
        <!--   <i class="fa fa-plus-circle pointer green mr-2"></i>
          Click to add a new evaluator -->
      </b-col>
      <b-col sm="4">
              <b-form-group label="Survey Year:" >
                <b-form-select v-model="term" :options="priorYears" @change="updateInterviewDates(term)"></b-form-select>
              </b-form-group>
            </b-col>
      <b-col sm="12"><hr /></b-col>
      <b-col sm="9">
        <table id="evaluatorTable" class="table table-bordered table-hover">
       <thead>
          <tr>
            <th v-for="(x, index) in fields" scope="col">
              {{ x }} 
                <i v-if=" x.order == null" class="fa fa-sort float-right gray"></i>
                <i v-if=" x.order == 'asc'" class="fa fa-caret-up float-right"></i>
                <i v-if=" x.order == 'desc'" class="fa fa-caret-down float-right"></i>
            </th>
          </tr>
        </thead>
         <tbody>
          <tr v-for="(x, index) in faculty">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{ x.email }}</td>
              <td></td>
              <td>
                <b-form-radio-group
                  v-model="x.preinterview"
                  :options="options"
                  name="radio-options"
                ></b-form-radio-group>
              </td>
          </tr>




        </tbody>
      </table>
      </b-col>
      <b-col sm="3">
        Interview Dates
        <br /> _
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
      </b-col>
       <b-col sm="12">
          <hr />
        </b-col>
    </b-row>
  </div>
</template>

<script>
const currentYear = (new Date()).getFullYear();
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

export default {
	name: 'evaluatorsManagement',
  props: ["organization","user","candidates","surveys","faculty"],
  watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    }
  },
	data() {
    	return {
        year: currentYear,
        fields:['Title', 'Last Name', 'First Name', 'Faculty • Resident', 'Phone', 'email', 'Availability', 'Pre-Interview'],
        options: [true , false],
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
          years.push(terms[x].year) }
        return years
      },
    },
  	methods: {
      updateInterviewDates(term) {
        this.interviewDates = []
        let x
        let terms = this.organization.terms
        for(x in terms) {
          if(terms[x].year == term) {
            this.interviewDates = terms[x].dates
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