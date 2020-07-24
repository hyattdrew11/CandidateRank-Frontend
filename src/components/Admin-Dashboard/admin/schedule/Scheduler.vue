<template>
  <div id="admin-ranking-container" class="mt-2 p-3 ">
    <b-container fluid>
      <b-row>
        <b-col sm="3">
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
          <b-col sm="6"></b-col>
          <b-col sm="3">
            <label class="tx-12 wt-600 dark-gray text">Invite Candidates:</label><br />
             <b-button 
            class="mr-1"
            variant="primary"
            size="sm"
            @click="inviteCandidates()"
            >Send Invitation
          </b-button>
          </b-col>
           <b-col sm="12"><hr /></b-col>
             <b-col sm="12" class="pl-4 pr-4"><DayPilotScheduler id="dp" :config="config" ref="scheduler" /></b-col>
        </b-row>
      </b-container>



        <hr />
        <b-container fluid>
            <div class="candidate-block-container">
                  <div v-for="(x, index) in candidates">
                      <div class="candidate-block">
                        <img v-if="x.photo != 'null'" :src="x.photo" class="schedule-pic" />
                        <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="schedule-pic" />
                        <p class="schedule-footer">{{ x['Last Name'] }}, {{ x['First Name'] }}</p>
                      </div>
                  </div>
            </div>
        </b-container>
      </div>
     
</template>

<script>
import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
import Vue from 'vue'

export default {
  name: 'Scheduler',
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
          console.log(newVal)
          this.year = newVal.year
          this.interviewDates = newVal.dates
          this.currentDay =  newVal.dates[0]
          console.log(this.currentDay)
          this.startDate = new DayPilot.Date(this.currentDay.startDate)
          Vue.set(this.config, "startDate", this.startDate)
          this.loadResources()
          this.loadEvents()
        }
        else {
          // this.startDate = new DayPilot.Date(oldVal.dates[0])
        }
      }
  },
  data: function() {
    return {
       currentDay: {
          endDate: '',
          startDate: '',
          rooms: [],
          events: []

      },
      interviewDates: [],
      year: null,
      schedule: null,
      config: {
        cellWidthSpec: "Fixed",
        cellWidth: 100,
        timeHeaders: [{"groupBy":"Day"},{"groupBy":"Hour"}],
        scale: "Hour",
        days: 1,
        startDate: null,
        showNonBusiness: false,
        businessWeekends: true,
        eventHeight: 60,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: function (args) {
          var dp = this;
          DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function(modal) {
            dp.clearSelection();
            if (!modal.result) { return; }
            dp.events.add(new DayPilot.Event({
              start: args.start,
              end: args.end,
              id: DayPilot.guid(),
              resource: args.resource,
              text: modal.result
            }));
          });
        },
        eventMoveHandling: "Update",
        onEventMoved: function (args) {
          console.log(args)
          this.message("Event moved: " + args.e.text());
        },
        eventResizeHandling: "Update",
        onEventResized: function (args) {
          this.message("Event resized: " + args.e.text());
        },
        eventDeleteHandling: "Update",
        onEventDeleted: function (args) {
          this.message("Event deleted: " + args.e.text());
        },
        eventClickHandling: "Disabled",
        eventHoverHandling: "Bubble",
        bubble: new DayPilot.Bubble({
          onLoad: function(args) {
            // if event object doesn't specify "bubbleHtml" property 
            // this onLoad handler will be called to provide the bubble HTML
            args.html = "Event details";
          }
        }),
        treeEnabled: true,
      },
    }
  },
  components: {
    DayPilotScheduler
  },
  computed: {
    // DayPilot.Scheduler object - https://api.daypilot.org/daypilot-scheduler-class/
    scheduler: function () {
      return this.$refs.scheduler.control;
    }
  },
  mounted: function() {
    DayPilot.onBeforeEventRender = function(args) {
      console.log(args)
      args.data.html = "Custom Event Text";
  }
    // this.loadResources();
  },
  methods: {
    inviteCandidates() {
      console.log(DayPilot)
      alert("INVITE CANDIDATES")
    },
    loadEvents() {
      console.log("LOAD EVENTS")
      // CONFIRMED CUSTODIANS
      let events = [
        { id: 1, start: this.currentDay.startDate, end: this.currentDay.startDate, text: "Event 1", resource: "R1" },
        // { id: 2, start: DayPilot.Date.today().addDays(2), end: DayPilot.Date.today().addDays(5), text: "Event 1", resource: "R2"}
      ];
      Vue.set(this.config, "events", events);
    },
    changeDay(currentDay) {
      this.currentDay = currentDay
      this.loadResources()
    },
     loadResources() {
      console.log("LOAD RESOURCES")
      let x
      let rooms = this.currentDay.rooms
      let resources = []
      for(x in rooms) {
        let js = {
          "id" : rooms[x].name,
          "name" : rooms[x].name,
          "expanded": true,
        }
        let i
        let children = []
        for(i in rooms[x].evaluators) {
          let evalu = rooms[x].evaluators[i]
          let ev = {
            "name": evalu.email,
            "id": evalu.email
          }  
          children.push(ev)
        }
        js.children = children
        resources.push(js)
      } 
      this.schedule = resources
      // this.config.resources = resources
      Vue.set(this.config, "resources", resources);
    }
  }
}
</script>

<style scoped lang="scss">
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