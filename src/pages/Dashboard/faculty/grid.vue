<template>
  <div id="admin-ranking-container" class="mt-3">
    <b-row>
      <b-col sm="8"></b-col>
      <b-col sm="4"></b-col>
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="4"></b-col>

            <b-col sm="8">
              <span
                class="float-right tx-12 wt-500 gray ml-2 pointer"
                v-b-tooltip.hover
                title="Refresh candidates"
                @click="refreshTerm()"
              >
                <i class="fa fa-sync"></i>
              </span>
              <span class="float-right tx-12 wt-500 gray"
                >{{ candidates.length }} Pre-Interview Candidates</span
              >
            </b-col>
          </b-row>
          <hr />
          <ag-grid-vue
            id="grid"
            style="width: 100%; height: 500px"
            class="ag-theme-material"
            :gridOptions="gridOptions"
            :columnDefs="columnDefs"
            :rowData="candidates"
            :animateRows="true"
            :context="context"
            @onGridReady="onGridReady"
            @cellValueChanged="updateCell"
            :frameworkComponents="frameworkComponents"
          >
          </ag-grid-vue>
        </b-card>
      </b-col>
    </b-row>

    <div id="application-container" :class="{ 'd-none': !showApplication }">
      <PDFRender
        :candidate="candidate"
        @closeApplication="closeApplication()"
      ></PDFRender>
    </div>

    <div
      id="pi-survey-container"
      v-if="showSurvey"
      :class="{ 'd-none': !showSurvey }"
    >
      <b-row no-gutters>
        <b-col sm="12" class="mt-2 pt-2">
          <span class="float-right pointer">
            <i class="fa fa-times mr-1" @click="closeSurvey()"></i>
          </span>
          <intSurvey
            :organization="organization"
            :user="user"
            :candidate="candidate"
            :survey="survey"
            @closeSurvey="closeSurvey"
            @updateCandidate="updateCandidatePIScore"
          ></intSurvey>
        </b-col>
      </b-row>
    </div>

    <b-modal id="modal-status-pi" title="Update Candidate Status" hide-footer>
      <b-form-radio-group
        v-model="cstatus"
        :options="statusOptions"
        name="radio-options"
      ></b-form-radio-group>
      <b-button variant="primary" class="float-right" @click="updateCandidate()"
        >Save</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
const API_URL = process.env.VUE_APP_API_URL;
const S3_BUCKET = process.env.VUE_APP_S3_BUCKET;

import { AgGridVue } from "ag-grid-vue";
// import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { fields } from "./fields";
import photoRender from "./photoRender";
import actionsRender from "./actionsRender";
import PDFRender from "./PDFRender";
import piSurvey from "./preinterviewSurvey";
import intSurvey from "./interviewSurvey";

export default {
  name: "index",
  props: ["organization", "user", "candidates", "currentTerm"],
  watch: {
    organization: function (newVal, oldVal) {
      if (newVal) {
        this.organization = newVal;
      }
    },
    candidates: function (newVal, oldVal) {
      if (newVal) {
        this.gridApi.showLoadingOverlay();
        this.candidates = newVal;
        this.rowData = newVal;
        this.gridApi.sizeColumnsToFit();
      }
    },
    active: function (newVal, oldVal) {
      if (newVal) {
        if (newVal == true) {
          this.gridApi.sizeColumnsToFit();
        }
      }
    },
    currentTerm: function (newVal, oldVal) {
      if (newVal) {
        this.year = newVal.year;
        let x;
        let terms = this.organization.terms;
        let term;
        for (x in terms) {
          if (terms[x].year == this.year) {
            term = this.organization.terms[x];
          }
        }
      }
    },
  },
  data() {
    return {
      survey: null,
      showSurvey: false,
      src: null,
      numPages: undefined,
      cstatus: "pre-interview",
      statusOptions: ["pre-interview", "interview"],
      candidate: null,
      page: 1,
      numPages: 0,
      pdfdata: undefined,
      errors: [],
      scale: "page-width",
      candidate: null,
      showApplication: false,
      search: "",
      text: null,
      year: null,
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      rowSelection: "single",
      context: null,
      frameworkComponents: null,
      paginationNumberFormatter: null,
      paginationPageSize: 100,
      columnDefs: fields,
      rowData: this.candidates,
    };
  },
  components: {
    AgGridVue,
    photoRender,
    actionsRender,
    PDFRender,
    intSurvey,
  },
  computed: {
    priorYears() {
      let x;
      let terms = this.organization.terms;
      let years = [];
      for (x in terms) {
        years.push(terms[x].year);
      }
      this.year = years[0];
      return years;
    },
    sortedCandidates: {
      get() {
        return this.candidates.filter((i) => i.status == "pre-interview");
      },
      set: function (newValue) {
        return newValue.filter((i) => i.status == "pre-interview");
      },
    },
  },
  beforeMount() {
    this.gridOptions = { defaultColDef: { sortable: true } };
    this.gridOptions.rowHeight = 75;
    this.columnDefs = fields;
    this.context = { componentParent: this };
    this.frameworkComponents = {
      photoRender: photoRender,
      actionsRender: actionsRender,
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    updateCandidatePIScore: function (candidate) {
      axios
        .post(API_URL + "/candidate/update", candidate)
        .then(({ data }) => {
          setTimeout(() => {
            this.loadTerm(this.year);
          }, 1000);
        })
        .catch(function (e) {
          alert("Error Updating Candidate");
        });
    },
    updateStatus(data) {
      this.candidate = data;
      this.$bvModal.show("modal-status-pi");
    },
    updateCandidate() {
      this.candidate.status = this.cstatus;
      axios
        .post(API_URL + "/candidate/update", this.candidate)
        .then(({ data }) => {
          // console.log(data)
          this.$bvModal.hide("modal-status-pi");
          this.refreshTerm();
        })
        .catch(function (e) {});
    },
    updateCell(params) {
      params.data.rank = params.data.rank.toString();
      console.log(params.data.rank);
      axios
        .post(API_URL + "/candidate/update", params.data)
        .then(({ data }) => {
          // console.log(data)
        })
        .catch(function (e) {});
    },
    loadTerm(year) {
      // console.log(year)
      this.year = year;
      let x;
      let terms = this.organization.terms;
      for (x in terms) {
        if (terms[x].year == year) {
          let term = this.organization.terms[x];
          this.$emit("changeTerm", term);
          this.$emit("loadCandidates", term.year);
        }
      }
    },
    refreshTerm() {
      this.$emit("changeTerm", this.currentTerm);
    },
    viewApplication(data) {
      // console.log("VIEW APPLICATION")
      this.candidate = data;
      this.showApplication = true;
    },
    closeApplication() {
      this.showApplication = false;
    },
    startSurvey(data, survey) {
      // console.log(data, survey)
      this.candidate = data;
      this.survey = null;
      this.survey = survey;
      this.showSurvey = true;
    },
    closeSurvey() {
      this.showSurvey = false;
    },
    onGridReady(params) {
      // console.log(params)
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#admin-ranking-container {
  width: 99%;
  padding: 15px;
}
#PreInterviewRankings th {
  font-size: 10px;
}
#PreInterviewRankings td {
  font-size: 12px;
  padding: 5px 15px 5px 15px;
  vertical-align: middle;
}
#PreInterviewRankings td:nth-child(2) {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#PreInterviewRankings td:last-child {
  width: 300px;
}
.profile-sm {
  display: inline-block;
  border-radius: 100%;
  height: 35px;
  width: auto;
  margin-right: 10px;
}
</style>