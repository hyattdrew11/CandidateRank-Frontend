<template>
  <div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col" style="width: 150px;">{{ currentDay.startDate }}</th>
              <th scope="col" v-for="(x, index) in times">{{ x }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(x, index) in currentDay.rooms">
              <th scope="row" tyle="width: 150px;">
                {{ x.name }}
                <p v-for="(e, index) in x.evaluators" class="tx-12 mb-0">
                  <i class="fa fa-user-circle mr-1 ml-2"></i>{{ e.email }}</p>
              </th>
              <td v-for="(t, index) in times">
                <div 
                  v-if="currentDay.events.find(el => el.time === t && el.room === x )" 
                  :set="event = currentDay.events.find(el => el.time === t && el.room === x )"
                  >
                  <div class="event" :style="{'background-color' : event.color }">
                    <span class="tx-12 white">{{ event.candidate.email   }}</span>
                    <img v-if="event.candidate.photo != 'null'" :src="event.candidate.photo" height="75px; width:auto" />
                        <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="schedule-pic" />
                  </div>
                </div>
                <div v-else>
                  <span @click="demoAlert()" class="pointer">open</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
     <b-container fluid>
            <div class="candidate-block-container">
                  <div v-for="(x, index) in candidates">
                      <div class="candidate-block">
                        <img v-if="x.photo != 'null'" :src="x.photo" class="schedule-pic" />
                        <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="schedule-pic" />
                        <p class="schedule-footer">{{ x['last name'] }}, {{ x['first name'] }}</p>
                      </div>
                  </div>
            </div>
        </b-container>
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
  props: ['organization', 'candidates', 'currentTerm'],
   watch: {
     candidates: function(newVal, oldVal) {
      if(newVal) {
        this.candidates = newVal
        this.returnEvents()
        }
      },
      currentTerm: function(newVal, oldVal) {
        if(newVal) {
          // console.log(newVal)
          this.year = newVal.year
          this.interviewDates = newVal.dates
          this.currentDay =  newVal.dates[0]
          this.timeRange()
          // this.returnEvents()
        }
        else {
          // console.log(oldVal)
        }
      }
  },
	data() {
    	return {
        times: ["09:00","09:40","10:20","11:00","11:40","12:20","13:00","13:40","14:20","15:00","15:40","16:20","17:00"],
        currentDay: {
          endDate: '',
          startDate: '',
          rooms: [],
          events: []
        },
        interviewDates: [],
        interviewTimes: []
      }
  	},
  	components: {
      axios
    },
    computed: {
    },
    mounted() {
    },
  	methods: {
      demoAlert() {
        let c = confirm("Choose this time slot.")

      },
      returnEvents() {
        // let cands = this.candidates
        let range = (this.times.length - 1) * (this.currentDay.rooms.length + 1)
        let arr = []
        let x
        let random = Math.floor(Math.random() * 10);
        for(x in this.currentDay.rooms) {
          for (let i = 0; i < (this.times.length); i++) {
              let event = {
                  "time": this.times[i],
                  "day": this.currentDay.startDate,
                  "room": this.currentDay.rooms[x],
                  "candidate": this.candidates[i],
                  "color" : this.getRandomColor(),
                  "zoom_link" : "https://zoom.us"
              }
              arr.push(event)
          }
        }
        // console.log(arr[0])
        this.currentDay.events = arr
      },
      getRandomColor() {
        let i = (this.interviewTimes.interviewLength * this.currentDay.rooms.length)
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },
      changeDay(day) {
        this.currentDay = day
        this.timeRange()
        this.returnEvents()
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
//   .table td {
//     padding: 0rem;
//     vertical-align: top;
//     border-top: 1px solid #dee2e6;
//     height: 75px;
// }
</style>