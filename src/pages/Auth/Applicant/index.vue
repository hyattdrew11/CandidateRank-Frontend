<!-- components/Login.vue -->
<template>
  <div>
    <i
      id="loader"
      v-if="loading"
      class="fa fa-spinner fa-pulse fa-3x fa-fw text-info"
      aria-hidden="true"
    ></i>
    <div :class="{ fade: loading }">
      <Logo :height="135" :isLogin="true" />
      <div class="container-fluid">
        <b-row
          v-if="!showDashboard"
          id="login"
          align-v="center"
          align-h="center"
          no-gutters
        >
          <b-col sm="12" md="4" lg="4" v-if="!authenticated">
            <b-card>
              <h5>Candidate Rank Applicants</h5>
              <span class="tx-12 wt-500">
                Please enter your email address to access your schedule.
              </span>
              <hr />
              <b-form-group label="Email address:">
                <b-form-input
                  v-model="email"
                  placeholder="Enter your email"
                  trim
                  type="email"
                ></b-form-input>
              </b-form-group>
              <hr />
              <p v-if="errorMsg" class="tx-12 red wt-600">{{ errorMsg }}</p>
              <b-button
                size="sm"
                class="mr-1 float-right bg-green white"
                variant="outline-secondary"
                @click="authenticate"
                >Login</b-button
              >
            </b-card>
            <router-link
              class="tx-12 white float-left mt-2 ml-1"
              :to="{ name: LINKS.TERMS_OF_SERVICE.TITLE }"
            >
              Terms of service
            </router-link>
          </b-col>
          <b-col sm="12" md="4" lg="4" v-if="authenticated && !showDashboard">
            <b-card>
              <label class="tx-12 wt-600 dark-gray">Choose Organization:</label>
              <b-form-select
                v-model="organization"
                @change="changeOrg(organization)"
              >
                <option
                  v-for="(x, index) in filteredOrgs"
                  :key="index"
                  :value="x"
                >
                  {{ x["name"].toUpperCase() }}
                </option>
              </b-form-select>
            </b-card>
          </b-col>
        </b-row>
        <b-row
          v-if="showDashboard"
          id="applicant-dashboard"
          align-h="center"
          no-gutters
        >
          <b-col sm="12" md="12" lg="12">
            <b-card>
              <h5>
                <span
                  class="fa-stack fa-lg pointer themeGreen"
                  @click="goBack()"
                >
                  <i class="fa fa-circle fa-stack-2x"></i>
                  <i class="fa fa-arrow-left fa-stack-1x fa-inverse"></i>
                </span>
                Back
                <b-button
                  @click="chooseNewDate()"
                  size="sm"
                  class="pointer p-2 float-right"
                  variant="primary"
                >
                  Reschedule
                </b-button>
              </h5>
              <h5 class="text-center">
                {{ organization.name.toUpperCase() }} •
                {{ department.toUpperCase() }}
              </h5>
              <hr />

              <div
                v-if="'interview-date' in me || dateFinalized"
                class="idinme"
              >
                <h5>My Schedule</h5>
                <h6>
                  <strong
                    >My Interview Day:
                    <span>{{ me["interview-date"] }}</span>
                    <span v-if="!('interview-date' in me)">{{
                      candidateSlots[0].startDate
                    }}</span>
                  </strong>
                </h6>
                <h4>
                  <strong style="color: red"
                    >Your interview date has been selected. Check back 24 hours
                    prior to your interview date to view your interview
                    schedule. If you need to reschedule please contact
                    info@candidate-rank.com
                  </strong>
                </h4>
                <a
                  v-if="waitingRoom"
                  :href="waitingRoom"
                  target="_blank"
                  class="btn btn-sm btn-success mb-2"
                  >Waiting Room</a
                >
                <hr />
              </div>

              <div v-if="dateFinalized">
                <b-list-group>
                  <b-list-group-item
                    v-for="(x, index) in candidateSlots"
                    v-bind:key="index"
                  >
                    <p class="wt-500 mb-2 tx-18">
                      <i class="fa fa-clock"></i>
                      {{ x.startDate }} {{ convertMilitary(x.time) }} CST
                    </p>
                    <span class="wt-500">Evaluator(s):</span>
                    <span
                      v-for="(e, index) in x.evaluators"
                      class="mb-0"
                      v-bind:key="index"
                    >
                      {{ e.first_name }} {{ e.last_name }} - {{ e.email }}
                    </span>
                    <b-button
                      v-if="x.zoom_link == 'Waiting'"
                      size="sm"
                      class="pointer p-2 float-right"
                      variant="secondary"
                      disabled
                    >
                      Zoom Pending
                    </b-button>
                    <b-button
                      @click="openInterview(x)"
                      v-if="
                        x.zoom_link != 'Waiting' && x.zoom_link != 'Not Set'
                      "
                      size="sm"
                      class="pointer p-2 float-right"
                      variant="primary"
                    >
                      Start Zoom
                    </b-button>
                  </b-list-group-item>
                </b-list-group>
              </div>

              <div
                v-if="
                  (!('interview-date' in me) && !dateFinalized) || reschedule
                "
              >
                <b-row>
                  <b-col md="12" class="mb-2">
                    <hr />
                    <h5>Choose a date</h5>
                    <hr />
                  </b-col>
                  <b-col
                    md="4"
                    v-for="(x, index) in orgDates"
                    v-bind:key="index"
                    class="mb-2"
                  >
                    <b-card header="">
                      {{ x.startDate }}
                      <b-button
                        :disabled="
                          datePicked ||
                          'finalized' in x ||
                          x.numCandidates >= x.maxCandidates
                        "
                        @click="chooseDate(x)"
                        size="sm"
                        variant="success"
                        class="float-right mr-2"
                        >Choose Date</b-button
                      >
                      <p v-if="'finalized' in x" class="tx-10 wt-500 red upper">
                        Schedule finalized
                      </p>
                      <p
                        v-if="'numCandidates' in x && 'maxCandidates' in x"
                        class="tx-10 wt-500 red upper"
                      >
                        <span v-if="x.numCandidates >= x.maxCandidates">
                          Date Full
                        </span>
                      </p>
                    </b-card>
                  </b-col>
                  <b-col md="12" class="mb-2"><hr /></b-col>
                </b-row>
              </div>
            </b-card>
          </b-col>
        </b-row>
        <div
          v-if="candidate"
          class="tx-8"
          style="
            opacity: 0;
            width: 0px;
            height: 0px;
            display: inline-block;
            position: fixed;
            bottom: 0px;
            left: 0px;
          "
        >
          <span>{{ candidateSlots }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/utils";
const API_URL = process.env.VUE_APP_API_URL;
import axios from "axios";
import moment from "moment";
import Logo from "@/components/Logo";
import LINKS from "@/utils/constants/links";

export default {
  created() {
    this.LINKS = LINKS;
  },
  data() {
    return {
      department: "",
      dateFinalized: false,
      waitingRoom: false,
      email: "",
      accessCode: "",
      errorMsg: null,
      authenticated: false,
      loading: false,
      showDashboard: false,
      organizations: null,
      organization: null,
      candidate: null,
      reschedule: false,
      datePicked: false,
    };
  },
  components: {
    Logo,
    axios,
  },
  computed: {
    me() {
      let x;
      let candidates = this.candidates;
      for (x in candidates) {
        if (
          (candidates[x].email == this.email &&
            candidates[x].Organization == this.organization.name) ||
          (candidates[x]["E-Mail"] == this.email &&
            candidates[x].Organization == this.organization.name)
        ) {
          this.candidate = candidates[x];
        }
      }
      for (x in this.organization.terms) {
        if (this.candidate["Rank-Term"] == this.organization.terms[x].year) {
          this.department = this.organization.terms[x].department;
        }
      }
      return this.candidate;
    },
    filteredOrgs() {
      return this.organizations;
    },
    orgDates() {
      let x;
      let i;
      let terms = this.organization.terms;
      let dates = [];
      if (terms) {
        for (x in terms) {
          if (this.me["Rank-Term"] == terms[x].year) {
            if ("dates" in terms[x]) {
              for (i in terms[x].dates) {
                terms[x].dates[i].currentTermIndex = x;
                dates.push(terms[x].dates[i]);
              }
            }
          }
        }
      }
      return dates;
    },
    candidateSlots: {
      get() {
        // alert("GET CANDIDATE SLOTS")
        // ADD GET SET
        let slots = [];
        let x;
        let terms = this.organization.terms;
        for (x in terms) {
          let dates = terms[x].dates;
          for (x in dates) {
            let rooms = dates[x].rooms;
            let r;
            for (r in rooms) {
              let e;
              let events = rooms[r].events;
              let evals = rooms[r].evaluators;
              for (e in events) {
                if ("candidate" in events[e]) {
                  if (
                    events[e].candidate.email == this.email ||
                    events[e].candidate["E-Mail"] == this.email
                  ) {
                    console.log("CANDIDATE EMAIL FOUND");
                    // console.log(events[e])
                    //  console.log(events[e].startDate, dates[x].startDate)
                    // if(events[e].startDate == dates[x].startDate) {
                    //   console.log("DATES MATCHED")
                    //   if(dates[x].finalized == true) {
                    //     console.log("DATE FINALIZED")
                    //     console.log(dates[x].finalized)
                    //     this.dateFinalized = true
                    //   }
                    // }
                    // this.candidate = events[e].candidate.email
                    events[e].startDate = dates[x].startDate;
                    events[e].evaluators = evals;
                    if ("finalized" in dates[x]) {
                      // alert(dates[x])
                      this.dateFinalized = true;
                    }
                    if ("waitingRoom" in dates[x]) {
                      this.waitingRoom = dates[x].waitingRoom;
                    }
                    slots.push(events[e]);
                  }
                }
              }
            }
          }
        }
        let SLOTS = slots.sort(function (a, b) {
          if (a.time < b.time) {
            return -1;
          }
          if (a.time > b.time) {
            return 1;
          }
          return 0;
        });
        return SLOTS;
      },
      set: function (newValue) {
        // alert("ST CANDIDATE SLOTS")
        // ADD GET SET
        let slots = [];
        let x;
        let terms = newValue.terms;
        for (x in terms) {
          let dates = terms[x].dates;
          for (x in dates) {
            // if('finalized' in dates[x]) {
            //   if(dates[x].finalized = true) { this.dateFinalized = true }
            // }
            let rooms = dates[x].rooms;
            let r;
            for (r in rooms) {
              let e;
              let events = rooms[r].events;
              let evals = rooms[r].evaluators;
              for (e in events) {
                if ("candidate" in events[e]) {
                  if (
                    events[e].candidate.email == this.email ||
                    events[e].candidate["E-Mail"] == this.email
                  ) {
                    console.log("CANDIDATE EMAIL FOUND");
                    // console.log(events[e])
                    //  if(events[e].startDate == dates[x].startDate) {
                    //   if(dates[x].finalized = true) {
                    //     this.dateFinalized = true
                    //   }
                    // }
                    events[e].startDate = dates[x].startDate;
                    events[e].evaluators = evals;
                    if ("finalized" in dates[x]) {
                      this.dateFinalized = true;
                      // alert(dates[x])
                    }
                    slots.push(events[e]);
                  }
                }
              }
            }
          }
        }
        let SLOTS = slots.sort(function (a, b) {
          if (a.time < b.time) {
            return -1;
          }
          if (a.time > b.time) {
            return 1;
          }
          return 0;
        });
        return SLOTS;
      },
    },
  },
  methods: {
    checkMyDate() {
      let dateF = this.candidateSlots[0].startDate;
    },
    chooseNewDate() {
      this.reschedule = true;
      this.dateFinalized = false;
      this.datePicked = false;
    },
    chooseDate(date) {
      this.dateFinalized = false;
      let vm = this;
      this.loading = true;
      this.datePicked = true;
      let org = this.organization.name;
      let input = {
        date: date.startDate,
        uuid: this.me.uuid,
        currentTermIndex: date.currentTermIndex,
        interviewLength: date.interviewLength,
      };
      axios
        .post(API_URL + "/dashboard/candidate-date/" + org, input)
        .then(({ data }) => {
          console.log(data);
          this.datePicked = true;
          this.loading = false;
          this.organization = data;
          this.authenticate();
        })
        .catch(function (e) {
          alert(
            "This interview date is currently full. please contact " +
              vm.organization.admin +
              " for help scheduling an interview. Or choose another date."
          );
          vm.loading = false;
          vm.datePicked = false;
          console.log(e);
        });
    },
    openInterview(event) {
      let c = confirm("Join interview");
      if (c) {
        let win = window.open(event.zoom_link, "_blank");
      } else {
      }
    },
    goBack() {
      this.showDashboard = false;
    },
    convertMilitary(t) {
      let tme = moment(t, "HH:mm").format("hh:mm a");
      return tme.toUpperCase();
    },
    changeOrg(org) {
      this.showDashboard = true;
    },
    authenticate() {
      // this.loading = true
      let self = this;
      let input = {
        email: this.email,
      };
      axios
        .post(API_URL + "/auth/applicant/getorgs", input)
        .then(({ data }) => {
          this.authenticated = true;
          this.organizations = data.orgs;
          this.candidates = data.candidates;
          console.log(this.organizations.length);
          if (this.organizations.length == 1) {
            this.organization = this.organizations[0];
            this.showDashboard = true;
          }
          // alert("Please check your email address for a password reset link.")
          // window.location.reload()
        })
        .catch(function (e) {
          // self.loading = false
          self.errorMsg = "There was an error please try again.";
        });
      // alert("AUTHENTICATE")
      // this.$store.dispatch('login', { email: this.email, password: this.password })
    },
  },
  mounted() {
    // console.log(localStorage)
    // EventBus.$on('authenticated', (msg) => { this.$router.push('/dashboard') })
    // EventBus.$on('failedAuthentication', (msg) => { this.errorMsg = msg })
  },
  beforeDestroy() {
    // EventBus.$off('failedAuthentication')
  },
};
</script>

<style scoped lang="scss">
#applicant-dashboard {
  width: 100%;
  height: 100%;
  border: 7px solid #319c90;
  min-height: 125vh;
  height: 100%;
}
</style>
