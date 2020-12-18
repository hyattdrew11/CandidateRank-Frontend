<template>
  <div class="container-fluid" v-if="currentTerm">  
    <b-row>
      <b-col sm="8" class="pt-1">
        <h5 class="tx-18 wt-600 dark-gray">Master Schedule {{ year }}</h5>
      </b-col>
       <b-col sm="4" class="text-right">
          <b-button size="sm" variant="primary" @click="updateOrganization()">Save & Continue</b-button> 
      </b-col>
      <b-col sm="12"><hr /></b-col>
       <b-col sm="2">
        <label class="tx-12 wt-600 dark-gray">Select Interview Day</label>
        <b-form-select v-model="currentDay"  @change="changeDay(currentDay)">
          <option :value="null" disabled>Select Date</option>
           <option 
                v-for="(item, index) in currentTerm.dates" 
                :key="index" 
                v-bind:value="item"> {{ item.startDate }}
              </option>
        </b-form-select>
      </b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Interview Start time:</label>
         <b-form-timepicker :disabled="!currentDay || 'finalized' in currentDay" value v-model="currentDay.startTime" locale="en" @input="changeStart(currentDay.startTime)"></b-form-timepicker>
      </b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Interview Stop time:</label>
        <b-form-timepicker :disabled="!currentDay.startTime  || 'finalized' in currentDay" v-model="currentDay.endTime"  @input="changeEnd(currentDay.endTime)" locale="en"></b-form-timepicker>
      </b-col>
      <b-col sm="2">
        <label class="tx-12 wt-600 dark-gray">Interview Length Minutes:</label>
        <b-form-select  :disabled="!currentDay.endTime  || 'finalized' in currentDay" v-model="currentDay.interviewLength" :options="interviewIntervals" @change="updateInterval(currentDay.interviewLength)"></b-form-select>
      </b-col>
      <b-col sm="2">
        <label class="tx-12 wt-600 dark-gray">Max Candidates:</label>
        <b-form-input v-model="currentDay.maxCandidates" @input="changeMaxCandidates(currentDay.maxCandidates)"  type="number"></b-form-input>
      </b-col>
      <b-col sm="12"><hr /></b-col>
      <!-- END COL-12 -->
      <b-col sm="12">
        <p v-if="'finalized' in currentDay" class="tx-12 wt-500 red upper">Schedule video conferences have been finalized and this date is locked. Conatct support@candidate-rank.com to update this schedule.</p>
        <b-card style="height: 100%;" :class="{'not-allowed' : 'finalized' in currentDay}">
          <p  class="tx-12 wt-600 dark-gray">Interview Rooms
            <b-button size="sm" variant="primary" class="float-right add-btn" @click="openRoom()">Add Room</b-button>
          </p>
          <hr />
           <b-modal id="modal-room" title="Add New User" @ok="addRoom(newRoom)" centered  button-size="sm">
              <b-input-group size="md" class="mb-2">
                <b-form-input size="sm" v-model="newRoom" placeholder="Room name and number" @keyup.enter="addRoom(newRoom)"></b-form-input>
              </b-input-group>
            </b-modal>
            <div class="">
              <div class="room" v-for="(x, index) in currentDay.rooms">
                <p class="tx-14 wt-600 blue"> 
                  <span class="fa-stack fa-lg pointer">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-building fa-stack-1x fa-inverse"></i>
                  </span>
                  Room: {{ x.name }}
                   <i class="fa fa-times-circle red pointer float-right  p-0 ml-1 mt-2 mr-2" @click="removeRoom(x, index)"></i>
                   <b-dropdown size="sm" variant="none" right  class="float-right p-0 m-0 ml-2" text="Add Evaluator" no-caret>
                      <template v-slot:button-content>
                        <i class="fa fa-user-plus dark-gray"></i>
                      </template>
                      <b-dropdown-item 
                        class="tx-14 wt-600 dark-gray"
                        @click="addEvaluator(index, Eindex, e)" 
                        v-for="(e, Eindex) in currentTerm.faculty">
                        {{ e.email }}</b-dropdown-item>
                  </b-dropdown>
                  </p>
                  <b-button variant="outline-secondary" size="sm" class="mr-2"  v-for="(i, Eindex) in x.evaluators" :key="i.email">
                      <i class="fa fa-user-circle mr-1"></i>
                          {{ i.email }}
                       <i class="fa fa-times-circle red pointer ml-2 mt-1 pl-2 float-right" @click="removeEvaluator(index, Eindex)"></i>
                  </b-button>
              </div>
              <!-- END ROOM -->
            </div>
            <!-- END ROOM CONTIANER -->
        </b-card>
      </b-col>
    
    </b-row>


     <b-modal id="modal-xl" size="xl" title="Preview Schedule">
       <!-- <DayPilotScheduler id="dp" :config="config" ref="scheduler" /> -->
    </b-modal>

  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import Vue from 'vue'
const API_URL = process.env.VUE_APP_API_URL
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

import Moment from 'moment';
import { extendMoment } from 'moment-range';

export default {
  name: 'masterSchedule',
  props: ["organization","user","candidates","surveys","faculty", "currentTerm"],
  order: 2,
  components: {
    axios,
  },
  watch: {
     candidates: function(newVal, oldVal) {
      if(newVal) {
        this.candidates = newVal
      }
    },
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    },
    currentTerm: function(newVal, oldVal) {
      // console.log(newVal, oldVal)
      if(newVal != null) {
         console.log("MASTER SCHEDULE CURRENT TERM NEW VAL")
        // console.log("CURRENT TERM UPDATE")
        // console.log(newVal)
        this.year = newVal.year
        let x
        let terms = this.organization.terms
        let term
        for(x in terms) { 
          if(terms[x].year == this.year) {
            term = this.organization.terms[x]
            this.interviewDates = terms[x].dates
            // this.currentDay = this.currentTerm.dates[0]
            // console.log(this.currentDay)
            // this.startDate = new DayPilot.Date(this.currentDay.startDate)
            // this.loadResources();
            // this.loadEvents();
          }
        }
      }
      else {
        console.log("OLD VAL")
        this.currentTerm = null
      }
    }
  },
  data() {
      return { 
        currentDay: {
          endDate:    false,
          startDate:  false,
          startTime:  false,
          endTime:    false,
          rooms:      [],
          events:     [],
          interviewLength: false,
          maxCandidates: 0,
          numCandidates: 0
        },
        year: this.currentTerm.year,
        interviewDates: [],
        term: null,
        newRoom: '',
        value: '', 
        interviewDay: null,
        interviewStart: '09:00:00',
        interviewEnd: '17:00:00',
        interviewLength: 60,
        interviewIntervals: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        breakStart: '11:00:00',
        breakEnd: '11:45:00'
      }
  },
  computed: {
    scheduler: function () {
      return this.$refs.scheduler.control;
    },
    currentTermDays() {
      let x 
      let days = []
      let dates = this.currentTerm.dates
      for(x in dates) {
        days.push(dates[x].startDate)
      }
      return days
    },
    availableEvaluators() {
      let x
      let rooms = this.currentDay.rooms
      let active = []
      for(x in rooms) {
        Array.prototype.push.apply(active, rooms[x].evaluators)
      }
      // let evList = this.currentTerm.faculty.filter(f => ! active.includes(f))
      return active
    }
  },
   mounted: function() {
  },
  methods: {
    removeRoom(x, index) {
      this.currentDay.rooms.splice(index, 1)
    },
    changeMaxCandidates(num) {
      this.currentDay.maxCandidates = parseInt(num)
    },
    changeStart(interviewStart) {
      let d = this.currentDay.startTime
      let x
      if(this.currentDay.rooms) {
        for(x in this.currentDay.rooms) {
          let events = this.currentDay.rooms[x].events
          if(events) {
            for(x in events) {
              if('candidate' in events[x]) { 
                alert("You already have candidates scheduled, please remove them to change interview start time")
                this.currentDay.startTime = d
                this.$emit('goToSchedule')
                return
              }
            }
          }
          else {
            this.currentDay.startTime = interviewStart
            let tr = this.timeRange()
            this.currentDay.rooms[x].events = []
            let i
            for(i in tr) {
              if('candidate' in events[i]) { console.log("SKIP SET EVENT") }
              else {
                let input = {
                  "time" : tr[i],
                  "zoom_link": "Not Set"
                }
                this.currentDay.rooms[x].events.push(input)
              }
            }
          }
        }
      }
    },
    changeEnd(interviewEnd) {
      let x
     if(this.currentDay.rooms) {
        for(x in this.currentDay.rooms) {
          let events = this.currentDay.rooms[x].events
          if(events) {
            for(x in events) {
              if('candidate' in events[x]) { 
                alert("You already have candidates scheduled, please remove them to change interview end time")
                return
              }
            }
          }
          else {
            this.currentDay.endTime = interviewEnd
            let tr = this.timeRange()
            this.currentDay.rooms[x].events = []
            let i
            for(i in tr) {
              if('candidate' in events[i]) { console.log("SKIP SET EVENT") }
              else {
                let input = {
                  "time" : tr[i],
                  "zoom_link": "Not Set"
                }
                this.currentDay.rooms[x].events.push(input)
              }
            }
          }
        }
      }
    },
    updateInterval(interval) {
       this.currentDay.interviewLength = interval
       this.timeRange()
    },
    changeDay(currentDay) {
      this.currentDay = currentDay
      let checkMaxCandidates = 'maxCandidates' in this.currentDay
      let checkNumCandidates = 'numCandidates' in this.currentDay
      if(!checkMaxCandidates) { 
        // alert("NO MAX CANDIDATE") 
        this.currentDay.maxCandidates = 0
      }
      if(!checkNumCandidates) { 
        // alert("NO NUM CANDIDATES") 
        // this.currentDay.numCandidates = 0
      }
      this.timeRange
    },
    timeRange() {
        let S = this.currentDay.startDate +' '+this.currentDay.startTime
        let F = this.currentDay.startDate +' '+this.currentDay.endTime
        let R = S+'/'+F
        // console.log(S,F, this.currentDay.interviewLength)
        const range = moment.range(S, F);
        const minutes = Array.from(range.by('minutes', { excludeEnd: false, step: this.currentDay.interviewLength }));
        this.interviewTimes = minutes.map(m => m.format('HH:mm'))
        console.log(this.interviewTimes)
        return this.interviewTimes
      },
    updateOrganization() {
      if(!this.currentDay.interviewLength) {
        alert("Choose an interview length")
      }
      else if(this.currentDay.maxCandidates < 1) {
        alert("Choose the max number of candidates allowed for this day.")
      }
      else {
        let x 
        let terms = this.organization.terms
        for(x in terms) { 
          if(terms[x].year == this.currentTerm.year) {
              this.organization.terms[x] = this.currentTerm
            }
          }
          // console.log(this.currentTerm)
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
    addEvaluator(index, Eindex, e) {
      this.currentDay.rooms[index].evaluators.push(e)
    },
    removeEvaluator(i, Eindex) {
      this.currentDay.rooms[i].evaluators.splice(Eindex, 1)
    },
    openRoom() {
      if(!this.currentDay.startDate || !this.currentDay.startTime || !this.currentDay.endTime || !this.currentDay.interviewLength) {
        alert("Please choose all interview times before adding a room.")
      }
      else {
        this.$bvModal.show('modal-room')
      }
    },
    addRoom(newRoom) {
      let x
      let tr = this.timeRange()
      let room = {
          name: newRoom.trim(),
          evaluators: [],
          events :[]
      }
      for(x in tr) {
        let input = {
          "time" : tr[x],
          "zoom_link": "Not Set"
        }
        room.events.push(input)
      }
      this.currentDay.rooms.push(room)
      this.$bvModal.hide('modal-room')
    },
  }
};
</script>
<style scoped lang="scss">
  .not-allowed *  {  cursor:not-allowed;  }
</style>