<template>
  <div class="container-fluid">  
    <b-row>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Select Interview Day:</label>
        <b-form-select v-model="interviewLength" :options="currentTerm.dates"></b-form-select>
      </b-col>
       <b-col sm="9" class="text-right">
        <label></label>
        <b-button class="float-right mt-4 ml-1" size="sm" variant="primary" @click="updateOrganization()">Save & Continue</b-button> 
        <b-button v-b-modal.modal-xl class="float-right mt-4 ml-1" size="sm" variant="secondary">Preview Schedule</b-button>
      </b-col>
      <b-col sm="12"><hr /></b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Interview Start time:</label>
         <b-form-timepicker v-model="interviewStart" locale="en"></b-form-timepicker>
      </b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Interview Stop time:</label>
        <b-form-timepicker v-model="interviewEnd" locale="en"></b-form-timepicker>
      </b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Interview Length Minutes:</label>
        <b-form-select v-model="interviewLength" :options="interviewIntervals"></b-form-select>
      </b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Time Between Interviews:</label>
        <b-form-select v-model="interviewLength" :options="interviewIntervals"></b-form-select>
      </b-col>
      <!-- END COL-8 -->
      <b-col sm="12"><hr /></b-col>
      <!-- END COL-12 -->
      <b-col sm="6">
        <b-card style="min-height: 55vh;">
          <p  class="tx-12 wt-600 dark-gray">Interview Rooms
            <b-button size="sm" variant="primary" class="float-right add-btn" v-b-modal.modal-room>Add Room</b-button>
          </p>
          <hr />
           <b-modal id="modal-room" title="Add New User" @ok="addRoom(newRoom)" centered  button-size="sm">
              <b-input-group size="md" class="mb-2">
                <b-form-input size="sm" v-model="newRoom" placeholder="Room name and number" @keyup.enter="addRoom(newRoom)"></b-form-input>
              </b-input-group>
            </b-modal>
            <div class="rooms-container">
              <div class="room" v-for="(x, index) in currentTerm.rooms"  :key="x.name">
                <p class="tx-14 wt-600 blue"> 
                  <span class="fa-stack fa-lg pointer">
                    <i class="fa fa-circle fa-stack-2x"></i>
                    <i class="fa fa-building fa-stack-1x fa-inverse"></i>
                  </span>
                  Room: {{ x.name }}

                   <b-dropdown size="sm" variant="none"  class="float-right p-0 m-0" text="Add Evaluator" no-caret>
                      <template v-slot:button-content>
                        <i class="fa fa-user-plus dark-gray"></i>
                        <!-- Add Evaluator -->
                      </template>
                      <b-dropdown-item v-if="availableEvaluators.length == 0" class="tx-12 wt-600">
                        <i class="fa fa-exclamation-circle red mr-1"></i>
                        All evaluators are currently assigned to rooms.<br /> 
                      </b-dropdown-item>
                      <b-dropdown-item 
                        class="tx-14 wt-600 dark-gray"
                        @click="addEvaluator(index, Eindex, e)" 
                        v-for="(e, Eindex) in availableEvaluators">
                        {{ e.email }}</b-dropdown-item>
                  </b-dropdown>
                  </p>
                    <p class="tx-14 wt-600 dark-gray mb-0 pl-3 pr-2 mr-1" v-for="(i, Eindex) in x.evaluators" :key="i.email">
                      <i class="fa fa-user-circle mr-1"></i>
                          {{ i.email }}
                       <i class="fa fa-times-circle float-right red pointer" @click="removeEvaluator(index, Eindex)"></i>
                  </p>
              </div>
              <!-- END ROOM -->
            </div>
            <!-- END ROOM CONTIANER -->
        </b-card>
      </b-col>

       <b-col sm="6">
        <b-card style="min-height: 55vh;">
          <p  class="tx-12 wt-600 dark-gray">Breaks
              <b-button size="sm" variant="primary" class="float-right add-btn" v-b-modal.modal-break>Add Break</b-button>
          </p>
          <b-modal id="modal-break" title="Add New User"  centered  button-size="sm" @ok="addBreak(breakStart, breakEnd)">
              <label class="tx-12 wt-600 dark-gray">Start time:</label>
              <b-form-timepicker v-model="breakStart" locale="en"></b-form-timepicker>
              <label class="tx-12 wt-600 dark-gray">End time:</label>
              <b-form-timepicker v-model="breakEnd" locale="en"></b-form-timepicker>
          </b-modal>
          <hr />
          <p v-for="(x, index) in currentTerm.breaks"  class="tx-14 wt-600">
            <span class="fa-stack fa-lg pointer light-gray">
              <i class="fa fa-circle fa-stack-2x"></i>
              <i class="fa fa-clock-o fa-stack-1x fa-inverse"></i>
            </span>
           Start: {{ x.start }} End: {{ x.end }}
          </p>
        </b-card>
      </b-col>
    
    </b-row>


     <b-modal id="modal-xl" size="xl" title="Preview Schedule">
      <div class="table-responsive">
        <table class="table table-bordered">
            <tr>
              <th></th>
              <th v-for="(x, index) in schedule.slots" class="tx-10 wt-400">
                 <b-form-timepicker :disabled="true"  id="timepicker-sm" v-model="schedule.slots[index]" size="sm" local="en" class="mb-2"></b-form-timepicker>
              </th>
            </tr>
            <tr v-for="(x, index) in schedule.rooms">
              <td>
                <p class="mb-0"><label class="tx-12 wt-600 dark-gray">Room: {{ x.name }}</label></p>
                <!-- <p class="mb-0" ><label class="tx-12 wt-600 dark-gray">Evaluators:</label></p> -->
                <span v-for="(e, index) in x.evaluators" class="tx-10 wt-400">
                  {{ e.email }}
                </span>
              </td>
              <td v-for="(x, index) in schedule.slots" v-if="candidates != null">
                <span v-if="schedule.breaks.includes(x)">BREAK TIME</span>
                <!-- <span v-else class="tx-10 wt-400">{{ candidates[index]['E-mail'] }}</span> -->
              </td>
            </tr>
          </table>
        </div>
    </b-modal>

	</div>
</template>

<script>
import moment from 'moment'
const API_URL = process.env.VUE_APP_API_URL
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
export default {
	name: 'masterSchedule',
  props: ["organization","user","candidates","surveys","faculty", "currentTerm"],
  order: 2,
  components: {},
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
      else {
        this.currentTerm = oldVal
      }
    }
  },
	data() {
    	return { 
        year: this.currentTerm.year,
        interviewDates: [],
        term: null,
        newRoom: '',
        value: '', 
        interviewStart: '09:00:00',
        interviewEnd: '17:00:00',
        interviewLength: 15,
        interviewIntervals: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        breakStart: '11:00:00',
        breakEnd: '11:45:00'
      }
  },
  computed: {
    schedule() {
      // console.log(this.currentTerm)
      let schedule = {}
      let start = parseInt(this.interviewStart.charAt(0) + this.interviewStart.charAt(1))
      let end = parseInt(this.interviewEnd.charAt(0) + this.interviewEnd.charAt(1))
      // console.log(start, end)
      let interval = (this.interviewLength / 60)
      let slots = this.timeRange(start, end, interval)
      let breaks = []
      let x 
      for(x in this.currentTerm.breaks) {
        let b = this.currentTerm.breaks[x]
        // console.log(b)
        let s = parseInt(b.start.charAt(0) + b.start.charAt(1))
        let e = parseInt(b.end.charAt(0) + b.end.charAt(1))
        // console.log(s, e)
        let arr = this.timeRange(s, e, interval)
        // console.log(arr)
        breaks.concat(arr)
        // breaks.push(b.start)
        // breaks.push(b.end)
      }
      // console.log(breaks)
      schedule.rooms = this.currentTerm.rooms
      schedule.breaks = breaks
      schedule.interviewStart = this.interviewStart
      schedule.interviewend = this.interviewEnd
      schedule.interviewLength = this.interviewLength
      schedule.slots = slots
      return schedule
    },
    availableEvaluators() {
      let x
      let rooms = this.currentTerm.rooms
      let active = []
      for(x in rooms) {
        Array.prototype.push.apply(active, rooms[x].evaluators)
      }
      console.log(active)
      let evList = this.currentTerm.faculty.filter(f => ! active.includes(f))
      console.log(evList, active)
      return evList
    }
  },
  methods: {
    timeRange(start, end, interval) {
      let slots = []
      let i = start
      while(end > i) {
        let x = i + (interval)
        i = x
        slots.push(x)
      }
      let t
      let tmpSlots = []
      for (t in slots) {
        let hours = Math.floor(slots[t]);
        let minutes = Math.round((slots[t] % 1)*100)/100;
        if(hours < 10 && minutes < interval) {
          t =  moment( '0' + hours + ':' + minutes * 60 + '0:00',"LT")
        }
        if(hours < 10 && minutes >= interval) {
          t =  moment( '0' + hours + ':' + minutes * 60 + ':00',"LT")
        }
        else if(hours >= 10 && minutes < interval) { 
          t =  moment(hours + ':' + minutes * 60 + '0:00',"LT")
        }
        else if(hours < 10 && minutes > interval) { 
          t =  moment('0' + hours + ':' + minutes * 60 + ':00',"LT")
        }
        else {
           t =  moment(hours + ':' + minutes * 60 +':00',"LT")
        }
         tmpSlots.push(t._i)
      }
      return tmpSlots

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
    },
    addEvaluator(index, Eindex, e) {
      this.currentTerm.rooms[index].evaluators.push(e)
    },
    removeEvaluator(index, Eindex) {
      this.currentTerm.rooms[index].evaluators.splice(Eindex, 1)
    },
    addBreak(breakStart, breakEnd) {
      console.log(breakStart, breakEnd)
      let ibreak = {
        start: breakStart,
        end: breakEnd,
      }
      // CHECK IF EXISTS
      this.currentTerm.breaks.push(ibreak)
      this.$bvModal.hide('modal-break')
    },
    addRoom(newRoom) {
      let room = {
        name: newRoom.trim(),
        evaluators: []
      }
      // CHECK IF EXISTS
      this.currentTerm.rooms.push(room)
      this.$bvModal.hide('modal-room')
    },
  }
};
</script>
<style scoped lang="scss"></style>