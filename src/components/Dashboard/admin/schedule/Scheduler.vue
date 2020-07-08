<template>
  <div id="admin-ranking-container" class="mt-2 pt-2 pl-2 pr-2">
    <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
    <hr />
      <div class="candidate-block-container">
            <div v-for="(x, index) in candidates">
                <div class="candidate-block">
                  <img v-if="x.photo != 'null'" :src="x.photo" class="schedule-pic" />
                  <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="schedule-pic" />
                  <p class="schedule-footer">{{ x['Last Name'] }}, {{ x['First Name'] }}</p>
                </div>
            </div>
      </div>
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
          this.startDate = new DayPilot.Date(newVal.dates[0])
          this.year = newVal.year
          // let x
          // let terms = this.organization.terms
          // let term
          // for(x in terms) { 
          //   if(terms[x].year == this.year) {
          //     term = this.organization.terms[x]
          //     this.interviewDates = terms[x].dates
          //   }
          // }
          this.loadResources();
          this.loadEvents();
        }
        else {
          console.log(oldVal)
          this.startDate = new DayPilot.Date(oldVal.dates[0])
        }
      }
  },
  data: function() {
    return {
      schedule: null,
       config: {
        cellWidthSpec: "Fixed",
        cellWidth: 100,
        timeHeaders: [{"groupBy":"Day"},{"groupBy":"Hour"}],
        scale: "Hour",
        days: 1,
        startDate: DayPilot.Date.today(),
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
    this.loadResources();
  },
  methods: {
    loadEvents() {
      // CONFIRMED CUSTODIANS
      const events = [
        // { id: 1, start: "2018-10-01T00:00:00", end: "2018-10-05T00:00:00", text: "Event 1", resource: "R1" },
        // { id: 2, start: DayPilot.Date.today().addDays(2), end: DayPilot.Date.today().addDays(5), text: "Event 1", resource: "R2"}
      ];
      // Vue.set(this.config, "events", events);
    },
    loadResources() {
      let x
      let rooms = this.currentTerm.rooms
      const resources = []
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
      console.log(resources)
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