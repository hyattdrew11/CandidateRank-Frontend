<template>
  <b-container id="faculty-dashboard" fluid class="">
    <b-breadcrumb id="faculty-breadcrumb">
      <b-breadcrumb-item :active="showTerms" @click="goHome()">
        <i class="fa fa-th ml-2 mr-1"></i> Home
      </b-breadcrumb-item>
      <b-breadcrumb-item v-if="showCandidates" :active="showCandidates"
        >{{ currentTerm.year }} Candidates {{ currentTerm.department }}
      </b-breadcrumb-item>
      <b-breadcrumb-item v-if="showSchedule" :active="showSchedule"
        >Interview Schedule {{ currentTerm.department }}
        {{ currentTerm.year }}</b-breadcrumb-item
      >
    </b-breadcrumb>
    <!--  <span id="showHome" class="pointer" @click="goHome()"  v-b-tooltip.hover title="Show All Terms" >
      <i class="fa fa-th" aria-hidden="true"></i>
    </span> -->
    <!--  <span v-if="currentTerm" id="currentTermLabel">
      {{ currentTerm.department }} {{ currentTerm.year }}
    </span> -->
    <i
      id="loader"
      v-if="loading"
      class="fa fa-spinner fa-pulse fa-3x fa-fw text-info"
      aria-hidden="true"
    ></i>
    <div :class="{ fade: loading }">
      <b-col sm="12" class="mt-3">
        <b-row>
          <p
            style="margin-top: 200px; text-align: center"
            v-if="organization.terms.length == 0"
          >
            No Interview Terms
          </p>
          <!-- TODO: should implmenet if 
          v-if="organization.terms && showTerms" -->
          <template v-if="organization.terms && showTerms">
            <b-col
              class="mt-2"
              sm="12"
              md="4"
              v-for="(x, index) in sortedTerms"
              v-bind:key="index"
            >
              <b-card
                class=""
                :header="x.year + ' - Department - ' + x.department"
                header-text-variant="white"
                header-bg-variant="secondary"
              >
                <p class="mb-0 tx-14 wt-500">Interview Year: {{ x.year }}</p>
                <p class="mb-0 tx-14 wt-500">
                  Pre-Interview Completion Date: {{ x.PIdate }}
                </p>
                <p class="mb-0 tx-14 wt-500">
                  {{ x.dates.length }} interview dates
                </p>
                <p class="mb-0 tx-14 wt-500">
                  {{ x.faculty.length }} evaluators
                </p>
                <hr />
                <b-button
                  size="sm"
                  class="action-btn float-right mr-2"
                  @click="viewSchedule(x)"
                  variant="outline-secondary"
                  >View Schedule</b-button
                >
                <b-button
                  size="sm"
                  class="action-btn float-right mr-2"
                  @click="viewCandidates(x)"
                  variant="outline-secondary"
                  >View Candidates</b-button
                >
              </b-card>
            </b-col>
          </template>
          <b-col :class="{ 'd-none': !showCandidates }" sm="12" md="12">
            <Grid
              :candidates="candidates"
              :organization="organization"
              :user="user"
              :currentTerm="currentTerm"
            />
          </b-col>
          <b-col :class="{ 'd-none': !showSchedule }" sm="12" md="12">
            <Schedule
              :candidates="candidates"
              :organization="organization"
              :user="user"
              :currentTerm="currentTerm"
            />
          </b-col>
        </b-row>
      </b-col>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";
import Grid from "./grid.vue";
import Schedule from "./schedule.vue";

const currentYear = new Date().getFullYear();
const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: "FacultyDashboard",
  props: ["user"],
  data() {
    return {
      loading: true,
      showTerms: true,
      showCandidates: false,
      showSchedule: false,
      organization: {
        name: null,
        terms: [],
      },
      currentTerm: null,
      candidates: [],
      tasks: [],
      surveys: null,
      faculty: null,
      items: [
        {
          text: "Admin",
          href: "#",
        },
        {
          text: "Manage",
          href: "#",
        },
        {
          text: "Library",
          active: true,
        },
      ],
    };
  },
  components: {
    axios,
    Grid,
    Schedule,
  },
  computed: {
    sortedTerms() {
      let st = this.organization.terms;
      st = st.sort(function (a, b) {
        return b.year - a.year;
      });
      return st;
    },
  },
  mounted() {
    this.loadDashboard();
  },
  methods: {
    goHome() {
      this.loading = true;
      this.showCandidates = false;
      this.showSchedule = false;
      this.showTerms = true;
      this.loading = false;
      this.getCandidates();
    },
    viewSchedule: function (term) {
      console.log("VIEW SCHEDULE");
      this.loading = true;
      // this.loadDashboard()
      this.currentTerm = term;
      this.getCandidates();
      this.showTerms = false;
      this.showCandidates = false;
      this.showSchedule = true;
    },
    viewCandidates: function (term) {
      this.loading = true;
      this.currentTerm = term;
      this.getCandidates();
      this.showTerms = false;
      this.showCandidates = true;
    },
    loadDashboard() {
      const org = this.user.Organization;
      const token = this.$store.state.jwt.token.token;
      const authHeader = { headers: { Authorization: "Bearer: " + token } };
      if (this.user.email == this.user.Organization) {
        // PUSH TO SETUP SCREEN
        // alert("NEW ACCOUNT UPDATE INFO")
      }
      axios
        .get(API_URL + "/dashboard/admin/" + org, authHeader)
        .then(({ data }) => {
          console.log(data);
          this.organization = data.organization;
          this.surveys = data.surveys;
          this.faculty = data.faculty;
          this.files = data.files;
          this.tasks = data.tasks;

          if (this.organization.terms.length > 0) {
            this.currentTerm = null;
          } else {
          }
          this.loading = false;
        })
        .catch(function (e) {
          const auth = e.response.data.authenticated;
          if (!auth) {
            alert("Please login.");
            window.sessionStorage.clear();
            window.location.replace("/");
          }
        });
    },
    getCandidates() {
      this.candidates = [];
      let org = this.user.Organization;
      let vm = this;
      axios
        .get(API_URL + "/candidate/all/" + org + "/" + this.currentTerm.year)
        .then(({ data }) => {
          // console.log(data)
          let x;
          for (x in data) {
            vm.candidates.push(data[x]["_source"]);
            vm.loading = false;
          }
        })
        .catch(function (e) {
          // console.log(e)
          vm.loading = false;
          alert("Error Loading Candidates");
        });
    },
  },
};
</script>
<style scoped lang="scss"></style>