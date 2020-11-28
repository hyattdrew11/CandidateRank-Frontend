<template>
  <div class="p-3">
     <b-container fluid>
      <b-row v-if="currentTerm">
        <b-col sm="3">
            <label class="tx-12 wt-600 dark-gray">Select Interview Day</label>
            <b-form-select v-if="currentTerm" v-model="currentDay" @change="changeDay(currentDay)">
               <option 
                    v-for="(item, index) in currentTerm.dates" 
                    :key="index" 
                    :value="item"> {{ item.startDate }}
                  </option>
            </b-form-select>
          </b-col>
          <b-col sm="12">
            <hr />
              <a v-if="waitingRoom" 
              :href="waitingRoom" 
              target="_blank" 
              class="btn btn-sm btn-success mb-2">Waiting Room</a>
            <p v-if="myRooms.length == 0">No Interviews scheduled for {{ currentDay.startDate }}</p>
          </b-col>
        </b-row>
      </b-container>
      <div class="table-responsive">
        <table v-if="myRooms.length > 0" class="table table-bordered">
          <thead>
            <tr>
              <th scope="col" style="width: 200px;" class="">Rooms</th>
              <th scope="col" v-for="(x, index) in  myRooms[0].events">{{ convertMilitary(x.time) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(x, index) in myRooms">
              <th scope="row" tyle="width: 150px;">
                {{ x.name }}
                <p v-for="(e, index) in x.evaluators" class="tx-12 mb-0">{{ e.email }}</p>
              </th>
             <td v-for="(t, index) in x.events">

                <div v-if="!t.candidate && !('break' in t)" class="time-block" style="background-color: #FFF;" @click="editInterview(t, currentRoomIndex, tinx)">
                  <p class="tx-10 text-center mt-3 pt-2 wt-600">Open</p>
                </div>
                
                 <div v-if="!t.candidate && ('break' in t)" class="time-block" style="background-color: #EEE;" @click="editInterview(t, currentRoomIndex, tinx)">
                  <p class="tx-10 text-center mt-3 pt-2 wt-600">Break</p>
                </div>

                <div v-if="t.candidate" class="time-block"  :style="{backgroundColor: getCandidateColor(t.candidate) }">
                  <p class="text-center mt-2">
                    <img :src="getCandidatePic(t.candidate)"  class="block-pic" />
                    <b-button size="sm" variant="primary" class="tx-10 ml-1  block-btn mt-2" @click="openSurvey(t, t.candidate)">Survey Application</b-button>
                    <b-button size="sm" variant="success" class="tx-10 ml-1  block-btn  mt-2" @click="openInterview(t)">Start Zoom</b-button>
                     <p class="mb-1 fw block tx-12 wt-600 text-center">
                      {{ t.candidate['Applicant Name'] }}
                      <br />
                      {{ t.candidate['email'] }}
                    </p>
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        </div>
          <div v-for="(x, index) in myRooms"  class="can-card-container">
            <b-row class="">

              <!-- <h4>{{ x.name }}</h4>  -->

              <div v-for="(t, index) in x.events" :class="{'cand-card' : t.candidate}">
                <div v-if="t.candidate" class="m-1">
                  <!-- <b-col lg="3"> -->
                    <b-card class="m-1" :title="convertMilitary(t.time)" :sub-title=" t.candidate['Applicant Name']">
                      <p class="mt-0">
                        <span class="tx-14 dark-gray">{{ t.candidate['email'] }}</span>
                        <img :src="getCandidatePic(t.candidate)"  class="card-pic" />
                        <br />
                        <b-button size="sm" variant="primary" class="tx-10 ml-1 mt-2" @click="openSurvey(t, t.candidate)">Survey Application</b-button>

                        <b-button size="sm" variant="success" class="tx-10 ml-1 mt-2" @click="openInterview(t)">Start Zoom</b-button>
                        <!--  <p class="mb-1 fw block tx-12 wt-600 text-center">
                          {{ t.candidate['Applicant Name'] }}
                          {{ t.candidate['email'] }}
                        </p> -->
                      </p>
                    </b-card>
                  <!-- </b-col> -->
                </div>
              </div>

            </b-row>
          </div>
     <!--  <b-container fluid>
          <div v-for="(x, index) in sortedCandidates">
            <div class="candidate-pic-container">
                <img :src="getCandidatePic(x)"  class="schedule-pic" />
                <p><span class="inline tx-10">{{ x['Applicant Name'] }}</span></p>
            </div>
          </div>
        </b-container> -->
        <div :class="{'d-none' : !showInterview}" id="interview-screen">
          <span id="interview-tools" class="float-right pointer">
            <b-button class="mt-2  tx-10 mr-1" variant="secondary"size="sm" @click="closeInterview()">Close</b-button>
          </span>
          <b-container fluid>
            <b-row>
               <b-col sm="6">
                  <PDFRender :candidate="candidate"></PDFRender>
               </b-col>
               <b-col sm="6">
                 <intSurvey v-if="updateSurv" :organization="organization" :user="user" :candidate="candidate" :survey="survey"></intSurvey>
               </b-col>
            </b-row>
          </b-container>

          <!-- <div class="container-zoom"> -->
            <!-- <ZoomFrame :nickname="nickname" :meetingId="meetingId" :password="password"/> -->
          <!-- </div> -->

        </div>
 </div>
</template>

<script>
import axios from 'axios'
const currentYear = (new Date()).getFullYear();
const API_URL = process.env.VUE_APP_API_URL
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PDFRender from "./PDFRenderSchedule";
import intSurvey from "./interviewSurveySchedule";


const moment = extendMoment(Moment);
export default {
  name: 'FacultySchedule',
  props: ['user', 'organization', 'candidates', 'currentTerm'],
   watch: {
     candidates: function(newVal, oldVal) {
      if(newVal) {
        this.candidates = newVal
        }
      else {
        this.candidates = oldVal
      }
      },
      currentTerm: function(newVal, oldVal) {
        if(newVal) {
          console.log("CURRENT TERM")
          this.year = newVal.year
          this.interviewDates = newVal.dates
          this.currentDay =  newVal.dates[0]
          this.waitingRoom = this.currentDay.waitingRoom
          this.survey = this.currentTerm['Interview']
        }
        else {
          console.log("CURRENT TERM OLD")
          console.log(oldVal)
        }
      }
  },
  data() {
      return {
        waitingRoom: false,
        survey: null,
        currentDay: false,
        interviewDates: [],
        interviewTimes: [],
        showInterview: false,
        candidate: null,
        nickname: this.user.email,
        meetingId: '95878480873',
        password: '724567',
        updateSurv: false,
      }
    },
    components: {
      axios,
      PDFRender,
      intSurvey
    },
    computed: {
      myRooms() {
        let x 
        let e
        let rooms = this.currentDay.rooms
        let res = []
        for(x in rooms) {
          let evaluators = rooms[x].evaluators
          for(e in evaluators) {
            if(evaluators[e].email === this.user.email) {
              res.push(rooms[x])
            }
          }
        }
        return res
      },
      // sortedCandidates: {
      //   get() {
      //     let x 
      //     let z = []
      //     let cands = []
      //     // let cands =  this.candidates.filter( i => i.status == 'interview' && i['interview-date'] == this.currentDay.startDate)
      //     for(x in this.currentDay.rooms) {
      //       let events = this.currentDay.rooms[x].events
      //       for(x in events) {
      //         let event = events[x]
      //         if('candidate' in event) {
      //           if('email' in event.candidate) {
      //             console.log(event.candidate.email)
      //             // let cand = this.candidates.filter( i => i.email == event.candidate.email)
      //             // cands.push(cand[0])
      //           }
      //           else {
      //             console.log(event.candidate)
      //           }
      //         }
      //       }
      //     }
      //     let uniqueCands = cands.filter((v,i,a)=>a.findIndex(t=>(t.email === v.email))===i)


      //     for(x in uniqueCands) {
      //       uniqueCands[x].color = this.getRandomColor()
      //     }
      //     let C = uniqueCands.sort(function(a, b) {
      //       if(a['Applicant Name'] < b['Applicant Name']) { return -1 }
      //       if(a['Applicant Name'] > b['Applicant Name']) { return 1  }
      //       return 0
      //     })
      //    return C
      //   },
      //   set: function(newValue) {
      //     let x 
      //     let cands = []
      //     for(x in this.currentDay.rooms) {
      //       let events = this.currentDay.rooms[x].events
      //       for(x in events) {
      //         let event = events[x]
      //         if('candidate' in event) {
      //           if('email' in event.candidate) {
      //             console.log(event.candidate.email)
      //             // let cand = this.candidates.filter( i => i.email == event.candidate.email)
      //             // cands.push(cand[0])
      //           }
      //           else {
      //             console.log(event.candidate)
      //           }
      //         }
      //       }
      //     }
      //       let uniqueCands = cands.filter((v,i,a)=>a.findIndex(t=>(t.email === v.email))===i)
      //     for(x in uniqueCands) {
      //       uniqueCands[x].color = this.getRandomColor()
      //     }
      //     return uniqueCands
      //   }
      // }
    },
    mounted() {},
    methods: {
        convertMilitary(t) {
          let tme = moment(t, 'HH:mm').format('hh:mm a')
          return tme
        },
      openSurvey(event, candidate) {
          console.log("OPEN SURVEY")
          let vm = this
          this.candidate = null
          let cand =  this.candidates.filter( i => i.email == candidate.email )
          console.log(cand)
          this.updateSurv = true
          setTimeout(function(){  vm.candidate = cand[0] }, 500);

          // let filter = this.candidates.filter( i => i.email === event.candidate.email)
          // this.candidate = filter[0]
          this.showInterview = true
      },
      openInterview(event) {
        console.log(event)
        this.updateSurv = true
        let c = confirm("Start interview");
        if(c) {
          this.candidate = null
          console.log(event)
          let filter = this.candidates.filter( i => i.email === event.candidate.email)
          console.log(filter[0])
          this.candidate = filter[0]
          console.log(this.candidate)
          this.showInterview = true
          let win = window.open(event.zoom_link, '_blank');
          // win.focus();
          // let  z = document.getElementById("zmmtg-root");
                // z.className += "open";
        }
        else {}
      },
      closeInterview() {
        this.updateSurv = false
        this.showInterview = false
      },
      getCandidateColor(candidate){
        let filter = this.candidates.filter( i => i.email === candidate.email)
        // if(filter.length > 0) {
        //   return filter[0].color
        // }
        // else { 
          return this.getRandomColor()
        // }
      },
      getCandidatePic(candidate){
        let filter = this.candidates.filter( i => i.email === candidate.email)
        if(filter[0] != undefined) {
          if('photo' in filter[0]) {
            if(filter[0].photo != 'null') {
              return filter[0].photo
            }
            else {
              return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
            }
          }
          else {
            return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
          }
        }
        else {
           return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
        }

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
        console.log(day)
        this.currentDay = day
        this.waitingRoom = day.waitingRoom
        this.timeRange()
        // this.returnEvents()
      },
      timeRange() {
        let S = this.currentDay.startDate +' '+this.currentDay.startTime
        let F = this.currentDay.startDate +' '+this.currentDay.endTime
        let R = S+'/'+F
        console.log(S,F, this.currentDay.interviewLength)
        const range = moment.range(S, F);
        const minutes = Array.from(range.by('minutes', { excludeEnd: false, step: this.currentDay.interviewLength }));
        this.interviewTimes = minutes.map(m => m.format('HH:mm'))
      }
    }
};
</script>
<style scoped lang="scss">
.cand-card {
  width: 30%;
}
@media only screen and (max-width: 1000px) {
 .cand-card {
    width: 100%;
  }
}
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
.block-pic {
  height: 65px;
  width: 65px;
  border-radius:100%;
  float: left;
  display: inline-block;
}
.card-subtitle {
  margin-bottom: 0px!important;
}
.card-pic {
    height: 65px;
    width: 65px;
    border-radius: 100%;
    float: right;
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 20px;
}
.time-block {
  min-width: 200px;
  width:  100%;
  // height: 100px;
  padding: 5px;
  min-height: 150px;
}
.block-btn {
  min-width: 55%;
}
.schedule-pic {
    height: 75px;
    border-radius: 100%;
    width: 75px;
    margin: 0 auto;
    display: block;

}
.candidate-pic-container {
  display: inline-block;
  width: 15%;
  text-align: center;
  float: left;
}
#interview-screen {
    display: block;
    background-color: #FFF;
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0px;
    top: 60px;
    padding: 25px 25px 10px 25px;
    overflow: scroll;
}
 #interview-tools {
    position: fixed;
    z-index: 20000;
    top: 80px;
    right: 25px;
  }
</style>