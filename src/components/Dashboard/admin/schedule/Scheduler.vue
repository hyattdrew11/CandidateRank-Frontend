<template>
  <div v-if="candidates" class="p-3">
     <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" ></i>
     <b-container fluid>
      <b-row v-if="currentTerm" :class="{fade : loading }">
        <b-col sm="3">
            <label class="tx-12 wt-600 dark-gray">Select Interview Day</label>
            <b-form-select v-if="currentTerm" v-model="currentDay" @change="changeDay(currentDay)">
               <option 
                    v-for="(item, index) in orgDates" 
                    :key="index" 
                    :value="item"> {{ item.startDate }}
                  </option>
            </b-form-select>
          </b-col>
          <b-col sm="9">
            <b-button variant="danger" class="float-right mt-3 mr-1" size="sm" @click="finalizeSchedule(currentDay)">
              <i class="fa fa-lock"></i>
              Finalize Schedule
            </b-button>
            <b-button variant="secondary" class="float-right mt-3 mr-1" size="sm" @click="refreshSchedule()">
              <i class="fa fa-sync"></i>
            Refresh Schedule</b-button>
          </b-col>
          <b-col sm="12"><hr /></b-col>
        </b-row>
      </b-container>
      <div class="table-responsive tableFixHead">
        <table v-if="currentDay.rooms" class="table table-bordered">
          <thead>
            <tr>
              <th scope="col" style="width: 200px;" class="">Rooms</th>
              <th scope="col" v-for="(x, index) in  currentDay.rooms[0].events">{{ convertMilitary(x.time) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(x, currentRoomIndex) in currentDay.rooms">
              <th scope="row" class="time-block left-th" style="width: 150px;">
                {{ x.name }}
                <p v-for="(e, index) in x.evaluators" class="tx-12 mb-0">{{ e.email }}</p>
              </th>
             <td v-for="(t, tinx) in x.events">
                <div v-if="!t.candidate && !('break' in t)" class="time-block" style="background-color: #FFF;" @click="editInterview(t, currentRoomIndex, tinx)">
                  <p class="tx-10 text-center mt-3 pt-2 wt-600">Open</p>
                </div>
                 <div v-if="!t.candidate && ('break' in t)" class="time-block" style="background-color: #EEE;" @click="editInterview(t, currentRoomIndex, tinx)">
                  <p class="tx-10 text-center mt-3 pt-2 wt-600">Break</p>
                </div>
                <div @click="editInterview(t, currentRoomIndex,  tinx)" v-if="t.candidate" class="time-block filled"  :style="{backgroundColor: getCandidateColor(t.candidate) }">
                  <p class="tx-10 wt-500 text-center mt-3">
                    {{ t.candidate['Applicant Name'] }}<br />
                    <span v-if="t.zoom_link == 'Waiting' || t.zoom_link == 'Not Set'">Zoom Not Set</span>
                    <span v-else>Zoom Link Set</span>
                    <!-- <span v-if="user.role == 'Super Admin' && 'email' in t.zoomUser">{{ t.zoomUser.email }}</span> -->
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
     <b-container fluid>
          <div v-for="(x, index) in candidatesDay">
            <div class="candidate-pic-container mb-2" >
                <img v-if="x.photo != 'null'" :src="x.photo"  class="schedule-pic" />
                <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="schedule-pic" />
                <p>
                  <span class="inline tx-12">{{ x['Applicant Name'] }}</span>
                  <br />
                  <span class="inline tx-12">{{ x['email'] }}</span>
                </p>
            </div>
          </div>
        </b-container>


        <b-modal ref="eventModal" title="Edit Time Slot" hide-footer>
          <div>
            <label v-if="candidate" class="tx-14 wt-600">Candidate: {{ candidate['first name'] }} {{ candidate['last name'] }}</label>
            <br />
            <label class="tx-12 wt-600 dark-gray">Change Candidates:</label>
            <b-form-select v-model="candidate" @change="changeEventCandidate(candidate, CRI, EI)">
                <option v-for="(x, index) in allSortedCandidates" :key="index" :value="x">
                {{ x['Applicant Name'] }}
                <span v-if="!x['Applicant Name']">{{ x.email }}</span>
              </option>
             </b-form-select>
             <hr />
             <b-button variant="secondary" size="sm" class="mt-2 mr-1" @click="breakEvent(event, CRI, EI)">Add Break</b-button>
             <b-button variant="primary" size="sm"  class="mt-2 float-right mr-1" @click="saveEvent(event, CRI, EI)">Save</b-button>
             <b-button variant="danger" size="sm" class="mt-2 float-right mr-1" @click="deleteEvent(event, CRI, EI)">Delete</b-button>
          </div>
      </b-modal>
 </div>
</template>

<script>
import axios from 'axios'
const currentYear = (new Date()).getFullYear();
const API_URL = process.env.VUE_APP_API_URL
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
export default {
  name: 'FacultySchedule',
  props: ['user', 'organization', 'candidates', 'currentTerm'],
   watch: {
     candidates: function(newVal, oldVal) {
      if(newVal) {
        console.log(newVal)
         // let SC = newVal.sort(function(a, b) {
         //    if(a['Applicant Name'] < b['Applicant Name'] ) { return -1 }
         //    if(a['Applicant Name'] > b['Applicant Name']) { return 1  }
         //    return 0
         //  })
         // console.log(SC)
        this.candidates = newVal
        }
      },
      currentTerm: function(newVal, oldVal) {
        if(newVal) {
          console.log("NEW CURRENT TERM")
          // console.log(newVal)
          if(newVal != undefined) {
            this.year = newVal.year
            this.interviewDates = newVal.dates
            this.currentDay =  newVal.dates[this.CDI]
            // this.CDI = 0
          }
        }
        else {
          console.log("OLD VAL CURRENT TERM")
          console.log(oldVal)
        }
      }
  },
  data() {
      return {
        loading: false,
        currentDay: false,
        event: null,
        candidate: null,
        CDI: 0,
        CRI: null,
        EI: null,
        interviewDates: [],
        interviewTimes: []
      }
    },
    components: {
      axios
    },
    computed: {
       orgDates() {
          let x 
          let i
          let terms = this.organization.terms
          let dates = []
          if(terms) {
            for(x in terms) {
              if ('dates' in terms[x]) {
                for(i in terms[x].dates) {
                  terms[x].dates[i].currentTermIndex = x
                  dates.push(terms[x].dates[i])
                }
              }
            }
          }
          return dates
       },
      allSortedCandidates() { 
        let C = this.candidates.sort(function(a, b) {
            if(a['Applicant Name'] < b['Applicant Name']) { return -1 }
            if(a['Applicant Name'] > b['Applicant Name']) { return 1  }
            return 0
          })
        return C
      },
      candidatesDay() {
        let x 
        let car = []
        for(x in this.candidates) {
          if('interview-date' in this.candidates[x]) {
            if( this.candidates[x]['interview-date'] == this.currentDay.startDate) {
              car.push(this.candidates[x])
            }
          }
        }
        return car
      },
      sortedCandidates: {
        get() {
          let x 
          let cands = []
          // let cands =  this.candidates.filter( i => i.status == 'interview' && i['interview-date'] == this.currentDay.startDate)
          for(x in this.currentDay.rooms) {
            let events = this.currentDay.rooms[x].events
            for(x in events) {
              let event = events[x]
              if('candidate' in event) {
                cands.push(event.candidate)
              }
            }
          }
          let uniqueCands = cands.filter((v,i,a)=>a.findIndex(t=>(t.email === v.email))===i)


          for(x in uniqueCands) {
            uniqueCands[x].color = this.getRandomColor()
          }
          let C = uniqueCands.sort(function(a, b) {
            if(a['Applicant Name'] < b['Applicant Name']) { return -1 }
            if(a['Applicant Name'] > b['Applicant Name']) { return 1  }
            return 0
          })
         return C
        },
        set: function(newValue) {
          let x 
          let cands = []
          for(x in this.currentDay.rooms) {
            let events = this.currentDay.rooms[x].events
            for(x in events) {
              let event = events[x]
              if('candidate' in event) {
                cands.push(event.candidate)
              }
            }
          }
            let uniqueCands = cands.filter((v,i,a)=>a.findIndex(t=>(t.email === v.email))===i)
          for(x in uniqueCands) {
            uniqueCands[x].color = this.getRandomColor()
          }
          let C = uniqueCands.sort(function(a, b) {
            if(a['Applicant Name'] < b['Applicant Name']) { return -1 }
            if(a['Applicant Name'] > b['Applicant Name']) { return 1  }
            return 0
          })
          return C
        }
      }
    },
    mounted() {},
    methods: {
      updateInterviewSlot() {
        // SET EVENT IN ORG 
          // // AXIOS UPDATE THE ORGANIZATION VIA API
          let x 
          let vm = this
          let terms = this.organization.terms
          for(x in terms) { 
            if(terms[x].year == this.currentTerm.year) {
                console.log(this.currentTerm)
                this.organization.terms[x] = this.currentTerm
                    // AXIOS UPDATE THE ORGANIZATION VIA API
                axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
                .then(({data}) => { 
                  console.log(data)
                  this.$emit('refreshTerm', this.currentTerm)
                  this.loading = false
                })
                .catch(function (e) { 
                  console.log(e)
                  alert("Error updating time slot. Please try again") 
                  vm.loading = false
                })  

              }
            }
            // // AXIOS UPDATE THE ORGANIZATION VIA API
            // axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
            // .then(({data}) => { 
            //   this.$emit('refreshTerm', this.currentTerm)
            //   this.loading = false
            // })
            // .catch(function (e) { 
            //   alert("Error updating time solt. Please try again") 
            //   this.loading = false
            // })  
        },
       convertMilitary(t) {
          let tme = moment(t, 'HH:mm').format('hh:mm a')
          return tme
        },
        refreshSchedule()  { this.$emit('refreshTerm', this.currentTerm)   },
        finalizeSchedule(currentDay) { 
          let vm = this
          this.loading = true
           let input = {
              "date"  : currentDay.startDate,
              "currentTermIndex" : currentDay.currentTermIndex,
              "candidates": this.sortedCandidates 
            }
          let conf = confirm("Are you ready to generate Zoom links for this days meetings and lock the schedule?")
          // AXIOS POST TO RUN CREATE MEETING FOR THIS TERM DAY EVENTS
          if(conf) {
            let org = this.organization.name
             axios.post( API_URL+'/dashboard/finalize-schedule/'+org, input )
            .then(({ data }) => { 
              console.log(data)
              this.loading = false
              this.refreshSchedule()
            })
            .catch(function (e) { 
              alert("Error, please try again.")
              vm.loading = false
              // vm.refreshSchedule()
            })
          }
        },
        updateSchedule()   { alert("UPDATE SCHEDULE")    },
        changeEventCandidate(candidate, CRI, EI) {
          this.candidate = candidate

        },
        breakEvent(event, CRI, EI) {
          let conf = confirm("Are you sure you want to make this timeslot a break?")
          if(conf) {
            let newEvent = {
                    "time" : event.time,
                    "zoom_link": "Not Set",
                    "break" : true
            }
            // UPDATE ORG
            this.loading = true
            this.currentTerm.dates[this.CDI].rooms[CRI].events[EI] = newEvent
            this.updateInterviewSlot()
            this.$refs['eventModal'].hide()
          }
          else {}
        },
        deleteEvent(event, CRI, EI) {
          let conf = confirm("Are you sure you want to delete this timeslot?")
          if(conf) {
            let newEvent = {
                    "time" : event.time,
                    "zoom_link": "Not Set"
            }
            // UPDATE ORG
            this.loading = true
            this.currentTerm.dates[this.CDI].rooms[CRI].events[EI] = newEvent
            this.updateInterviewSlot()
            this.$refs['eventModal'].hide()
          }
          else {}
        },
        saveEvent(event, CRI, EI) {
          let conf = confirm("Are you sure you want to update this timeslot?")
          if(conf) {
            this.loading = true
            let candy =  {
              "uuid"            : this.candidate.uuid,
              "aamcid"          : this.candidate.aamcid,
              "email"           : this.candidate.email,
              "Applicant Name"  : this.candidate['Applicant Name'], 
              "interview-date"  : this.currentTerm.dates[this.CDI].startDate
            }
            event.candidate = candy
            event.zoom_link = "Waiting"
            this.currentTerm.dates[this.CDI].rooms[CRI].events[EI] = event
            this.updateInterviewSlot()
            this.$refs['eventModal'].hide()
          }
        },
        editInterview(event, currentRoomIndex, eventIndex) {
          this.CRE = currentRoomIndex
          this.EI = eventIndex
          this.CRI = currentRoomIndex
          this.candidate = event.candidate
          let currentEvent = this.currentDay.rooms[currentRoomIndex].events[eventIndex]
          if(event == currentEvent) {
            this.$refs['eventModal'].show()
            this.event = event
          }
          else { 
            alert("Whhops. Please refresh the schedule.")
          }
        },
       refreshTerm() {
          console.log("REFRESH TERM");
          this.$emit('refreshTerm', this.currentTerm)
      },
      getCandidateColor(candidate){
        if(candidate) {
          let filter = this.sortedCandidates.filter( i => i.email == candidate.email)
          if(filter[0] != undefined ) {
            return filter[0].color
          }
          else {
            return "#FFFFFF"
          }
        }
        else { return false }
      },
      getRandomColor() {
          var trans = '0.5'; // 50% transparency
          var color = 'rgba(';
          for (var i = 0; i < 3; i++) {
            color += Math.floor(Math.random() * 255) + ',';
          }
          color += trans + ')'; // add the transparency
          return color;
      },
      changeDay(day) {
        let x
        for(x in this.currentTerm.dates) {
          if(this.currentTerm.dates[x] == day) { this.CDI = x }
        }
        console.log(day)
        this.currentDay = day
        this.timeRange()
      },
      timeRange() {
        let S = this.currentDay.startDate +' '+this.currentDay.startTime
        let F = this.currentDay.startDate +' '+this.currentDay.endTime
        let R = S+'/'+F
        // console.log(S,F, this.currentDay.interviewLength)
        const range = moment.range(S, F);
        const minutes = Array.from(range.by('minutes', { excludeEnd: false, step: this.currentDay.interviewLength }));
        this.interviewTimes = minutes.map(m => m.format('HH:mm'))
      }
    }
};
</script>
<style scoped lang="scss">
//   .event {
//     position: relative;
//     display: block;
//     width: 100%;
//     height: 75px;
//     font-size: .75em;
//   }
  .table td {
    padding: 0;
    // vertical-align: top;
    // border-top: 1px solid #dee2e6;
    // height: 50px;
}
// .time-block {
//    width:  100%;
//    height: 65px;
//    padding: 5px
// }

.candidate-pic-container {
  display: inline-block;
  width: 15%;
  text-align: center;
  float: left;
}
.tableFixHead          { overflow: auto; height: 500px; }
.tableFixHead thead th { position: sticky; top: 0; }
.left-th { position: sticky; left: 0; }
/* Just common table stuff. Really. */
table  { border-collapse: collapse; width: 100%; }
th, td { padding: 8px 16px; }
th     { background:#eee; }
</style>