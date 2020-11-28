<template>
  <div v-if="candidates" id="admin-ranking-container" class="mt-3">
    <b-row>
       <b-col sm="8">
        <h4 v-if="currentTerm != null">{{ currentTerm.department }} Final Ranking {{ currentTerm.year }}</h4>
       <!--   <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
         <b-form-input v-model="search" placeholder="Search Candidates"></b-form-input> -->
      </b-col>

      <b-col sm="4">
        <!-- <p><label class="tx-12 wt-600 dark-gray">Ranking Actions:</label></p> -->
        <!-- <b-button size="sm" class="ml-1">Export list</b-button> -->
      </b-col>
      <b-col sm="12"> 
        <b-card>
          <b-row>
            <b-col sm="4">
             <!--  <label class="tx-12 wt-600 dark-gray">Change year:</label>
              <b-form-select v-model="year" :options="priorYears" @change="loadTerm(year)"></b-form-select> -->
            </b-col>

            <b-col sm="8">
              <span class="float-right tx-12 wt-500 gray ml-2 pointer" v-b-tooltip.hover title="Refresh candidates" @click="loadTerm(year)">
                <i class="fa fa-sync"></i>
              </span>
              <span class="float-right tx-12 wt-500 gray">{{ sortedCandidates.length }} Final Candidates</span>
            </b-col>
          </b-row>
          <hr />
          <ag-grid-vue
            id="grid"
            style="width: 100%; height: 500px;"
            class="ag-theme-material"
            :gridOptions="gridOptions"
            :columnDefs="columnDefs"
            :rowData="sortedCandidates"
            :animateRows="true"
            :context="context"
            @cellValueChanged="updateCell"
            :frameworkComponents="frameworkComponents"
          >
          </ag-grid-vue>
        </b-card>
      </b-col>
    </b-row> 


     <div id="application-container" v-if="showApplication" :class="{'d-none': !showApplication}">
        <b-row no-gutters>
          <b-col sm="12" class="mt-2 pt-2">
            <h5>{{ candidate['last name'] }}, {{ candidate['first name'] }}
              <span class="float-right">
                <i class="fa fa-times mr-1" @click="closeApplication()"></i>
              </span>
            </h5>
            <hr />
          </b-col>

          <b-col sm="12">
            <canvas style="width: 100%;" id="the-canvas"></canvas>
          </b-col>
        </b-row>
      </div>

       <b-modal id="modal-status-ip" title="Update Candidate Status" hide-footer>
        <b-form-radio-group
            v-model="cstatus"
            :options="statusOptions"
            name="radio-options"
          ></b-form-radio-group>
                <b-button variant="primary" class="float-right"@click="updateCandidate()">Save</b-button>
        </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
const S3_BUCKET = process.env.VUE_APP_S3_BUCKET
import pdfjsLib from 'pdfjs-dist'
import { AgGridVue } from 'ag-grid-vue';
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import {fields} from './fields'
import photoRender from "./photoRender";
import actionsRender from "./actionsRender";
import commentsRender from "./commentsRender";

export default {
  name: 'index',
  props: ['active','organization', 'user', 'candidates', 'faculty', 'currentTerm', 'sizeRankGrid'],
   watch: {
     sizeRankGrid: function(newVal, oldVal) { 
      if(newVal === true) {
        this.gridApi.sizeColumnsToFit()
        this.gridApi.resetRowHeights()
      }
    },
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    },
    candidates: function(newVal, oldVal) {
      if(newVal) {
        this.candidates = newVal
        this.rowData = newVal
      }
    },
    active: function(newVal, oldVal) {
      if(newVal) {
        if(newVal == true) {
          this.gridApi.sizeColumnsToFit()
        }
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
          }
        }
      }
    }
  },
  data() {
      return {
        cstatus: 'pre-interview',
        statusOptions: ['pre-interview', 'interview'],
        candidate: null,
        page: 1,
        numPages: 0,
        pdfdata: undefined,
        errors: [],
        scale: 'page-width',
        candidate: null,
        showApplication: false,
        search: '',
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
        rowData: this.candidates
      }
    },
    components: {
      AgGridVue,
      photoRender,
      actionsRender,
      commentsRender

    },
    computed: {
      priorYears() {
        let x
        let terms = this.organization.terms
        let years = []
        for(x in terms) { years.push(terms[x].year) }
        this.year = years[0]
        return years
      },
      sortedCandidates: {
        get() {
          return this.candidates.filter( i => i.status == 'interview')
        },
        set: function(newValue) {
         return newValue.filter( i => i.status == 'interview')
        }
      }
    },
    beforeMount() {
        this.gridOptions = { defaultColDef: { sortable: true}, }
        this.columnDefs = fields
        this.context = { componentParent: this }
        this.frameworkComponents = { 
              "photoRender"    : photoRender,
              "actionsRender"  : actionsRender,
              "commentsRender" : commentsRender
            };
    },
    mounted() {
        this.gridApi = this.gridOptions.api
        this.gridColumnApi = this.gridOptions.columnApi
    },
    methods: {
      updateStatus(data) {
          this.candidate = data
          this.$bvModal.show('modal-status-ip')
      },
      updateCandidate() {
        this.candidate.status = this.cstatus
        axios.post( API_URL+'/candidate/update',  this.candidate)
            .then(({data}) => { 
              this.$bvModal.hide('modal-status-ip')
              this.refreshTerm()
            })
            .catch(function (e) { })
      },
      updateCell(params) {
        params.data.rank = params.data.rank.toString()
        axios.post( API_URL+'/candidate/update',  params.data)
            .then(({data}) => { 
            })
            .catch(function (e) { })
      },
      loadTerm(year) {
        this.year = year
        let x
        let terms = this.organization.terms
        for(x in terms) {       
          if(terms[x].year == year) {
            let term = this.organization.terms[x]
            this.$emit('changeTerm', term)
            this.$emit('loadCandidates', term.year)
          }
        }
      },
      refreshTerm() {
          this.$emit('changeTerm', this.currentTerm)
      },
      closeApplication() {
        this.showApplication = false
      },
      onGridReady(params) {
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function() {
            setTimeout(function() {
              params.api.sizeColumnsToFit()
              params.api.resetRowHeights()
            })
          })  
      },
        viewApplication(data) {
        this.candidate = data
        this.getPdf(data)
      },
      getPdf () {
        this.loading = true
        this.showApplication = true
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
        var loadingTask = pdfjsLib.getDocument(this.candidate.application);
        loadingTask.promise.then(function(pdf) {
          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            var scale = 1.5;
            var viewport = page.getViewport({scale: scale});
            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
            });
          });
        }, function (e) {
          // PDF loading error
          console.error(e);
        });
        this.loading = false
      },
    }
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
  #PreInterviewRankings td:nth-child(2)  {
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
    width:  auto;
    margin-right: 10px;
  }
</style>