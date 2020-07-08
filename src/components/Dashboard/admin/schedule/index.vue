<template>
	<div id="admin-ranking-container" class="mt-2 pt-2 pl-2 pr-2">
        <!-- <b-row>
           <b-col sm="8">
              <h4 v-if="currentTerm != null">{{ currentTerm.department }} Pre-Interview List {{ currentTerm.year }}</h4>
            </b-col>

            <b-col sm="4">
              <p><label class="tx-12 wt-600 dark-gray">Ranking Actions:</label></p>
              <b-button size="sm" class="ml-1">Start Interviews</b-button>
            </b-col>
              <b-col sm="12">
                <hr />
                

                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                      <tr>
                        <th></th>
                        <th v-for="(x, index) in schedule.slots" class="tx-10 wt-400">
                           <b-form-timepicker :disabled="true"  id="timepicker-sm" v-model="schedule.slots[index]" size="sm" local="en" class="mb-2"></b-form-timepicker>
                        </th>
                      </tr>
                      <tr v-for="(x, index) in schedule.rooms">
                        <td>
                          <p class="mb-0"><label class="tx-12 wt-600 dark-gray">Room: {{ x.name }}</label></p>
                          <span v-for="(e, index) in x.evaluators" class="tx-10 wt-400">
                            {{ e.email }}
                          </span>
                        </td>
                        <td v-for="(x, index) in schedule.slots">
                          <span v-if="schedule.breaks.includes(x)">BREAK TIME</span>
                          <span v-else class="tx-10 wt-400">{{ candidates[index]['E-mail'] }}</span>
                        </td>
                      </tr>
                    </table>
                  </div>

                   <div class="candidate-block-container">
                        <div v-for="(x, index) in candidates">
                            <div class="candidate-block">
                              <img v-if="x.photo != 'null'" :src="x.photo" class="schedule-pic" />
                              <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="schedule-pic" />
                              <p class="schedule-footer">{{ x['Last Name'] }}, {{ x['First Name'] }}</p>
                            </div>
                        </div>
                  </div>

              </b-col>
            </b-row> -->
        </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
export default {
	name: 'InterviewSchedule',
  props: ['organization', 'user', 'candidates', 'faculty', 'currentTerm'],
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
        candidate: null,
        showCandidate: false,
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
        // console.log(this.interviewStart, this.interviewEnd)
        // let schedule = {}
        // let start = parseInt(this.interviewStart.charAt(0) + this.interviewStart.charAt(1))
        // let end = parseInt(this.interviewEnd.charAt(0) + this.interviewEnd.charAt(1))
        // console.log(start, end)
        // let interval = (this.interviewLength / 60)
        // let slots = this.timeRange(start, end, interval)
        // let breaks = []
        // let x 
        // for(x in this.currentTerm.breaks) {
        //   let b = this.currentTerm.breaks[x]
        //   // console.log(b)
        //   let s = parseInt(b.start.charAt(0) + b.start.charAt(1))
        //   let e = parseInt(b.end.charAt(0) + b.end.charAt(1))
        //   // console.log(s, e)
        //   let arr = this.timeRange(s, e, interval)
        //   // console.log(arr)
        //   breaks.concat(arr)
        //   // breaks.push(b.start)
        //   // breaks.push(b.end)
        // }
        // // console.log(breaks)
        // schedule.rooms = this.currentTerm.rooms
        // schedule.breaks = breaks
        // schedule.interviewStart = this.interviewStart
        // schedule.interviewend = this.interviewEnd
        // schedule.interviewLength = this.interviewLength
        // schedule.slots = slots
        // return schedule
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
    mounted() {},
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
  #InterviewSchedule th {
    font-size: 10px;
  }
  #InterviewSchedule td:first-child {
    font-size: 12px;
    font-weight: 500;
    max-width: 200px;
  }
  .candidate-block-container {
    text-align: center;
    margin: 0 auto;
    display: block;
    height: 100%;
  }
  .candidate-block {
    display: inline-block;
    float: left;
    border: 1px solid #EEE;
    margin: 3px 7px 3px 7px;
    height: auto;
    width:  150px;
  }
  .schedule-pic {
    display: block;
    height: auto;
    width:  150px;
    height: 150px;
  }
  .schedule-footer {
    width: 100%;
    background-color: #EEE;
    font-size: 12px;
    text-align: center;
    height: 30px;
    margin-bottom: 0px;
  }
</style>