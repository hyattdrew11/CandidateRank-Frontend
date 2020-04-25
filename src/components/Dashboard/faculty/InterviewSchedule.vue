<template>
   <div id="faculty-tabs-container">
        <b-row>
            <b-col sm="7">
               <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
               <b-form-input v-model="text" placeholder="Search Candidates"></b-form-input>
            </b-col>
            <b-col sm="5">
              <label class="tx-12 wt-600 dark-gray">Interview Date: {{ date }}</label>
              <input name=x size=10 maxlength=10 type="date" v-model="selectedDate" @change="logDate" class="form-control">
            </b-col>
              <b-col sm="12">
                <hr />
                <table id="InterviewSchedule" class="table table-bordered">
                  <thead>
                    <tr>
                      <th v-for="(x, index) in scheduleFields" scope="col">{{ x }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(x, index) in scheduleItems">
                      <td>{{ x.Ranker }}</th>
                      <td class="time-block" @click="pickTime(x, '9:20',  x['9:20'])">{{ x['9:20'] }}</td>
                    <td class="time-block" @click="pickTime(x, '9:35',  x['9:35'])">{{ x['9:35'] }}</td>
                    <td class="time-block" @click="pickTime(x, '9:50',  x['9:50'])">{{ x['9:50'] }}</td>
                    <td class="time-block" @click="pickTime(x, '10:05', x['10:05'])">{{ x['10:05'] }}</td>
                    <td class="time-block" @click="pickTime(x, '10:20', x['10:20'])">{{ x['10:20'] }}</td>
                    <td class="break">{{ x['10:35'] }}</td>
                    <td class="time-block" @click="pickTime(x, '10:50',  x['10:50'])">{{ x['10:50'] }}</td>
                    <td class="time-block" @click="pickTime(x, '11:05',  x['11:05'])">{{ x['11:05'] }}</td>
                    <td class="time-block" @click="pickTime(x, '11:20',  x['11:20'])">{{ x['11:20'] }}</td>
                    <td class="time-block" @click="pickTime(x, '11:35',  x['11:35'])">{{ x['11:35'] }}</td>
                    <td class="time-block" @click="pickTime(x, '11:50',  x['11:50'])">{{ x['11:50'] }}</td>
                    <td class="time-block" @click="pickTime(x, '12:05',  x['12:05'])">{{ x['12:05'] }}</td>
                    </tr>
                  </tbody>
                </table>
              </b-col>
            </b-row>
        </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
export default {
	name: 'InterviewSchedule',
	 data() {
      return {
        text: null, 
        date:  moment(new Date()).format("MM/DD/YYYY"),
        selectedDate: moment().format('YYYY-MM-DD'),
        user: this.$store.state.user,
        Ranker: null,
        timeSlot: null,
        scheduleFields: ['Ranker', "9:20", "9:35", "9:50", "10:05", "10:20", "10:35", "10:50", "11:05", "11:20", "11:35", "11:50", "12:05"],
        scheduleItems: [{
          "Ranker": "Dr. Killackey Room 8513",
          "9:20": "Open",
          "9:35": "Open",
          "9:50": "Open",
          "10:05": "Open",
          "10:20": "Open",
          "10:35": "Break",
          "10:50": "Open",
          "11:05": "Open",
          "11:20": "Open",
          "11:35": "Open",
          "11:50": "Open",
          "12:05": "Open",
           _cellVariants: { "10:35": 'secondary' }
        },
        {
          "Ranker": "Dr. Schroll Room 8549",
          "9:20": "Open",
          "9:35": "Open",
          "9:50": "Open",
          "10:05": "Open",
          "10:20": "Open",
          "10:35": "Break",
          "10:50": "Open",
          "11:05": "Open",
          "11:20": "Open",
          "11:35": "Open",
          "11:50": "Open",
          "12:05": "Open",
           _cellVariants: { "10:35": 'secondary' }
        },
        {
          "Ranker": "Dr. Ducoin Dr. Zehart Room 8549",
          "9:20": "Open",
          "9:35": "Open",
          "9:50": "Open",
          "10:05": "Open",
          "10:20": "Open",
          "10:35": "Break",
          "10:50": "Open",
          "11:05": "Open",
          "11:20": "Open",
          "11:35": "Open",
          "11:50": "Open",
          "12:05": "Open",
           _cellVariants: { "10:35": 'secondary' }
        },
        {
          "Ranker": "Dr. Levy Dr. Jones Room 8559",
          "9:20": "Open",
          "9:35": "Open",
          "9:50": "Open",
          "10:05": "Open",
          "10:20": "Open",
          "10:35": "Break",
          "10:50": "Open",
          "11:05": "Open",
          "11:20": "Open",
          "11:35": "Open",
          "11:50": "Open",
          "12:05": "Open",
           _cellVariants: { "10:35": 'secondary' }
        },
        {
          "Ranker": "Chief Residents McChesney Reily Room 8513",
          "9:20": "Open",
          "9:35": "Open",
          "9:50": "Open",
          "10:05": "Open",
          "10:20": "Open",
          "10:35": "Break",
          "10:50": "Open",
          "11:05": "Open",
          "11:20": "Open",
          "11:35": "Open",
          "11:50": "Open",
          "12:05": "Open",
           _cellVariants: { "10:35": 'secondary' }
        },
      ],
      candidate: null,
      showCandidate: false,
      candidateFields: ['Rank', "Applicant", "Medical School", "USMLE - Step 1", "USMLE - Step 2", "Survey Status", "Application"],
      candidateItems: [],
      }
    },
    components: {
    },
    mounted() {},
    methods: {
      logDate(e) {
        this.date = moment(this.selectedDate).format("MM/DD/YYYY")
        console.log(e)
      },
      pickTime(row, time, status) {
        console.log(row, time, status)
      },
      rowClicked(item, index, event) {
        console.log(item, index, event)
      },
      rowClickedCandidate(item, index, event) {
        this.candidate = item
        this.showCandidate = true
      },
      showCandidates() {
        this.showCandidate = false
      }
    }
};
</script>
<style scoped lang="scss">
// .nav-tabs {
//     border-bottom: none!important; 
// }
// .nav-tabs .nav-link {
//     background-color: #fff;
//     border-top: none;
//     border-left: none;
//     border-right: none;
//     border-radius: 0;
//     font-weight: 500;
//     color: #495057;
// }
// .nav-tabs .nav-link {
//     border: 1px solid transparent;
// }
// .nav-tabs .nav-item.show .nav-link, #filters .nav-tabs .nav-link.active {
//     background-color: #fff;
//     border: none;
//     border-bottom: 2px solid #0168fa;
//     border-radius: 0;
//     font-weight: 500;
// }
.time-block {
  cursor: pointer;
}
.time-block:hover {
  background-color: aliceblue;
}
.break {
  background-color: #d0d0d0;
}
</style>
<style scoped lang="scss">
  #InterviewSchedule th {
    font-size: 10px;
  }
  #InterviewSchedule td:first-child {
    font-size: 12px;
    font-weight: 500;
    max-width: 200px;
  }
</style>