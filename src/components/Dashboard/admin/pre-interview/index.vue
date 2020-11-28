<template>
  <div v-if="candidates != null">
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
    <div id="admin-ranking-container" class="mt-3" :class="{fade : loading }">
      <b-row>
         <b-col sm="8">
          <h4 v-if="currentTerm != null">{{ currentTerm.department }} Pre-Interview {{ currentTerm.year }}</h4>
        </b-col>

        <b-col sm="4"></b-col>
        <b-col sm="12"> 
          <b-card>
            <b-row>
              <b-col sm="4">
                  <label class="tx-12 wt-600 dark-gray fw">Move to interview process</label>
                   <b-form-select v-model="selectedInterval"  size="sm" @change="moveCandidates" text="Move to interview process">
                        <b-form-select-option :value="5">Top 5</b-form-select-option>
                        <b-form-select-option :value="10">Top 10</b-form-select-option>
                        <b-form-select-option :value="20">Top 20</b-form-select-option>
                        <b-form-select-option :value="30">Top 30</b-form-select-option>
                        <b-form-select-option :value="40">Top 40</b-form-select-option>
                        <b-form-select-option :value="50">Top 50</b-form-select-option>
                        <b-form-select-option :value="60">Top 60</b-form-select-option>
                        <b-form-select-option :value="70">Top 70</b-form-select-option>
                        <b-form-select-option :value="80">Top 80</b-form-select-option>
                        <b-form-select-option :value="90">Top 90</b-form-select-option>
                        <b-form-select-option :value="100">Top 100</b-form-select-option>
                        <b-form-select-option value="All">All candidates</b-form-select-option>
                    </b-form-select>
              </b-col>

              <b-col sm="8">
                <span class="float-right tx-12 wt-500 gray ml-2 pointer" v-b-tooltip.hover title="Refresh candidates" @click="loadTerm(year)">
                  <i class="fa fa-sync"></i>
                </span>
                <span class="float-right tx-12 wt-500 gray">{{ sortedCandidates.length }} Pre-Interview Candidates</span>
              </b-col>
            </b-row>
            <hr />
            <ag-grid-vue
              id="grid"
              style="width: 100%; height: 500px;"
              class="ag-theme-material"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :defaultColDef="defaultColDef"
              :rowData="sortedCandidates"
              :animateRows="true"
              :context="context"
              :rowHeight="rowHeight"
              :suppressContextMenu="true"
              @cellValueChanged="updateCell"
              :frameworkComponents="frameworkComponents"
              :organization="organization"
              :masterDetail="true"
              :detailCellRendererParams="detailCellRendererParams"
              :modules="modules"
            >
            </ag-grid-vue>
          </b-card>
        </b-col>
      </b-row> 


       <div id="application-container" v-if="showApplication" :class="{'d-none': !showApplication}">
          <b-row no-gutters>
            <b-col sm="12" class="mt-2 pt-2">
              <h5><span style="color:#FFF;">•</span>
                <span class="float-right pointer">
                  Page {{ pageNum }}
                  <i class="fa fa-caret-left mr-1" @click="prevPage()"></i>
                  <i class="fa fa-caret-right ml-1 mr-4" @click="nextPage()"></i>
                  <i class="fa fa-times mr-1" @click="closeApplication()"></i>
                </span>
              </h5>
              <hr />
            </b-col>
             <b-col sm="4">
              <b-card>
                {{ candidate.email }}
              </b-card>
             </b-col>
            <b-col sm="8">
              <canvas style="width: 98%; float: right;" id="the-canvas" class="pdf-shadow"></canvas>
            </b-col>

          </b-row>
        </div>

         <div id="pi-survey-container" v-if="showSurvey" :class="{'d-none': !showSurvey}">
          <b-row no-gutters>
            <b-col sm="12" class="mt-2 pt-2">
              <span class="float-right pointer">
                  <i class="fa fa-times mr-1" @click="closeSurvey()"></i>
                </span>
              <piSurvey :user="user" :candidate="candidate" :survey="survey" @closeSurvey="closeSurvey" @updateCandidate="updateCandidatePIScore"></piSurvey>
            </b-col>
          </b-row>
        </div>

         <b-modal id="modal-status-pi" title="Update Candidate Status" hide-footer>
          <b-form-radio-group
              v-model="cstatus"
              :options="statusOptions"
              name="radio-options"
            ></b-form-radio-group>
                  <b-button variant="primary" class="float-right" @click="updateCandidate(candidate)">Save</b-button>
          </b-modal>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
const S3_BUCKET = process.env.VUE_APP_S3_BUCKET
import pdfjsLib from 'pdfjs-dist'
// import { AgGridVue } from 'ag-grid-vue';
import { AgGridVue } from '@ag-grid-community/vue';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import {fields} from './fields'
import photoRender from "./photoRender";
import actionsRender from "./actionsRender";
import commentsRender from "./commentsRender";
import piSurvey from "./survey";

export default {
  name: 'index',
  props: ['active','organization', 'user', 'candidates', 'faculty', 'currentTerm', 'sizePIGrid'],
   watch: {
    sizePIGrid: function(newVal, oldVal) { 
      // console.log(newVal, oldVal)
      if(newVal === true) {
        // console.log("sizePIGrid")
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
        // this.loadTerm(this.year)
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
      else {}
    }
  },
  data() {
      return {
        loading: false,
        pdfDoc: null,
        canvas: document.getElementById('the-canvas'),
        pageNum: 1,
        pageRendering: false,
        pageNumPending: null,
        scale: 'page-width',
        page: 1,
        numPages: 0,
        pdfdata: undefined,
        survey: null,
        selectedInterval: null,
        cstatus: 'pre-interview',
        statusOptions: ['pre-interview', 'interview'],
        candidate: null,
        errors: [],
        candidate: null,
        showSurvey: false,
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
        defaultColDef: null,
        detailCellRendererParams: null,
        rowData: this.candidates,
        rowHeight: null,
        modules: [
          ClientSideRowModelModule,
          MasterDetailModule,
          MenuModule,
          ColumnsToolPanelModule,
        ],
      }
    },
    components: {
      AgGridVue,
      ClientSideRowModelModule,
      MasterDetailModule,
      MenuModule,
      ColumnsToolPanelModule,
      photoRender,
      actionsRender,
      commentsRender,
      pdfjsLib,
      piSurvey

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
          return this.candidates.filter( i => i.status == 'pre-interview')
        },
        set: function(newValue) {
         return newValue.filter( i => i.status == 'pre-interview')
        }
      }
    },
    beforeMount() {
        // this.gridOptions.suppressContextMenu = true
        this.gridOptions = { defaultColDef: { sortable: true}, }
        // this.gridOptions.rowHeight = 175;
        this.columnDefs = fields
        this.context = { componentParent: this }
        this.frameworkComponents = { 
              "photoRender": photoRender,
              "actionsRender": actionsRender,
              "commentsRender" : commentsRender
            };
        this.defaultColDef = { flex: 1 };
        this.detailCellRendererParams = (params) => {
          var res = {}
          let vm = this
          res.getDetailRowData = function (params) {
              params.successCallback([params.data]);
          };
          res.detailGridOptions = {
            columnDefs: [
              {
                "headerName" : "Pre-Interview Score",
                "autoHeight": true,
                "field": "preinterview_score",
                "sortable": true,
                "resizable": true,
                "menuTabs": ["filterMenuTab" ,"columnsMenuTab"],
                "filter": "agTextColumnFilter",
                "suppressColumnsToolPanel": false,
                "suppressFiltersToolPanel": false,
                "hide" : false,
                "editable": false
              },
            ],
            defaultColDef: { flex: 1 },
          }
          return res
        }
    },
    mounted() {
        this.gridApi = this.gridOptions.api
        this.gridColumnApi = this.gridOptions.columnApi
    },
    methods: {
      moveCandidates() {
        let interval = this.selectedInterval
        let c
        let candidates = this.sortedCandidates
        candidates.sort(function(a, b) {
              if(a['rank'] > b['rank']) { return -1 }
              if(a['rank'] < b['rank']) { return 1  }
              return 0
        })
        if(interval === "All") {
          c = confirm("Move all candidates to the interview process")
          if(c) { 
            let x
            for(x in candidates) {
              this.candidate = x
              this.candidate.status = "interview"
              axios.post( API_URL+'/candidate/update',  this.candidate)
                .then(({data}) => {  })
                .catch(function (e) { 
                    // console.log(e)
                    alert("Error Updating Candidate")
                  })
            }
          }
        }
        else {
          c = confirm("Move top " +interval+ " candidates to the interview process?")
          if(c) {
            for(var x = 0; x < interval; x++) {
              this.candidate = candidates[x]
              this.candidate.status = "interview"
               axios.post( API_URL+'/candidate/update',  this.candidate)
                .then(({data}) => {  })
                .catch(function (e) { 
                    // console.log(e)
                    alert("Error Updating Candidate")
                  })
            }
          }
        }
        this.refreshTerm()
      },
      updateStatus(data) {
          this.candidate = data
          this.$bvModal.show('modal-status-pi')
      },
      updateCandidatePIScore: function(candidate)  {
        axios.post( API_URL+'/candidate/update',  candidate)
            .then(({data}) => { 
              setTimeout(()=>{
                this.loadTerm(this.year)
              }, 1000)
            })
            .catch(function (e) { 
              alert("Error Updating Candidate")
            })
      },
      updateCandidate: function(candidate)  {
        candidate.status = this.cstatus
        this.$bvModal.hide('modal-status-pi')
        axios.post( API_URL+'/candidate/update',  candidate)
            .then(({data}) => { 
              this.refreshTerm()
              return data
            })
            .catch(function (e) { 
              console.log(e)
              alert("Error Updating Candidate")
            })
      },
      updateCell(params) {
        params.data.rank = params.data.rank.toString()
        axios.post( API_URL+'/candidate/update',  params.data)
            .then(({data}) => { 
              // console.log(data)
            })
            .catch(function (e) { })
      },
      loadTerm(year) {
        // console.log("LOAD TERM")
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
      viewApplication(data) {
        this.candidate = data
        this.getPdf()
      },
      closeSurvey() {
        this.showSurvey = false
      },
      closeApplication() {
        this.showApplication = false
        this.loading = false
      },
      onGridReady(params) {
      const updateData = (data) => {
        // console.log('UPDATE GRID ON READY')
        // console.log(data)
        this.rowData = data;
      }
      updateData(this.sortedCandidates)
      params.api.sizeColumnsToFit()
      params.api.resetRowHeights()
      window.addEventListener("resize", function() {
            setTimeout(function() {
              params.api.sizeColumnsToFit()
              params.api.resetRowHeights()
            })
          })  
      },
      startSurvey(data, survey) {
        this.candidate = data
        this.survey = null
        this.survey = survey
        this.showSurvey = true
      },
       getPdf () {
        let vm = this
        this.loading = true
        this.showApplication = true
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
        var loadingTask = pdfjsLib.getDocument(this.candidate.application+"#zoom=75");
        loadingTask.promise.then(function(pdf) {
          vm.pdfDoc = pdf;
          // console.log('PDF loaded');
          
          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            // console.log('Page loaded');
            
            var scale = 1;
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
              // console.log('Page rendered');
            });
          });
        }, function (reason) {
          // PDF loading error
          console.error(reason);
        });
        this.loading = false
      },
      prevPage() {
        // console.log("PREV PAGE")
        if (this.pageNum <= 1) {
          return;
        }
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
      },
      nextPage() {
        // console.log("NEXT PAGE")
         if (this.pageNum >= this.pdfDoc.numPages) {
            return;
          }
          this.pageNum++;
          this.queueRenderPage(this.pageNum);
      },
      queueRenderPage(num) {
        if (this.pageRendering) {
          this.pageNumPending = num;
        } else {
          this.renderPage(num);
        }
      },
      renderPage(num) {
        let vm = this
        this.pageRendering = true;
          // Prepare canvas using PDF page dimensions
        this.pdfDoc.getPage(num).then(function(page) {
          var scale = 2;
          var viewport = page.getViewport({scale: scale});
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

          // Wait for rendering to finish
          renderTask.promise.then(function() {
            vm.pageRendering = false;
            if (vm.pageNumPending !== null) {
              // New page rendering is pending
              vm.renderPage(vm.pageNumPending);
              vm.pageNumPending = null;
            }
          })
        })
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