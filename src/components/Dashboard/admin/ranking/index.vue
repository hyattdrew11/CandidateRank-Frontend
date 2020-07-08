<template>
  <div id="admin-ranking-container" class="mt-3">
    <b-row>
       <b-col sm="8">
        <h4 v-if="currentTerm != null">{{ currentTerm.department }} Pre-Interview List {{ currentTerm.year }}</h4>
       <!--   <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
         <b-form-input v-model="search" placeholder="Search Candidates"></b-form-input> -->
      </b-col>

      <b-col sm="4">
        <p><label class="tx-12 wt-600 dark-gray">Ranking Actions:</label></p>
        <b-button size="sm" class="ml-1">Export list</b-button>
      </b-col>
      <b-col sm="12">
        <hr />
        <b-card>
          <ag-grid-vue
            id="grid"
            style="width: 100%; height: 500px;"
            class="ag-theme-material"
            :gridOptions="gridOptions"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :animateRows="true"
            :context="context"
            :frameworkComponents="frameworkComponents"
          >
          </ag-grid-vue>
        </b-card>
      </b-col>
    </b-row> 
  </div>
</template>

<script>




const API_URL = process.env.VUE_APP_API_URL
import { AgGridVue } from 'ag-grid-vue';
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import {fields} from './fields'
import photoRender from "./photoRender";
export default {
  name: 'index',
  props: ['active','organization', 'user', 'candidates', 'faculty', 'currentTerm'],
   watch: {
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
  },
  data() {
      return {
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
      photoRender
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
      sortedCustodians: {
        get () {
          /* 
          COMPUTED PROPERTY IS CONNECTED TO THE SEARCH TEXT BOX IN THE COMPONENT
          ALLOWS USERS TO SEARCH THEIR MATTERS AND ASSIGNMENTS
          */
          return this.candidates
            ? this.candidates.filter(item => item['First Name'].toLowerCase().includes(this.search.toLowerCase()))
            : this.candidates
        },
        set () {
          this.candidates.sort(function(a, b) {
              if(a['First Name'] < b['First Name']) { return -1 }
              if(a['Last Name'] > b['Last Name']) { return 1  }
              return 0
            })
        }
      }
    },
    beforeMount() {
        this.gridOptions = {
                  defaultColDef: { sortable: true},
        }
        this.columnDefs = fields
        this.context = { componentParent: this }
        this.frameworkComponents = { 
              "photoRender": photoRender
            };
    },
    mounted() {
        this.gridApi = this.gridOptions.api
        this.gridColumnApi = this.gridOptions.columnApi
        // this.gridApi.sizeColumnsToFit();
    },
    methods: {
      onGridReady(params) {
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function() {
            setTimeout(function() {
              params.api.sizeColumnsToFit()
            })
          })  
      },
        sort(index, order) {
          if(order == null) {
            this.fields[index].order = 'desc'
          }
          if(order == 'asc') {
            this.fields[index].order = 'desc'
          }
          if(order == 'desc') {
            this.fields[index].order = 'asc'
          }
          console.log(this.fields[index])
        },
        getCandidates(year) {
          let org = this.user.Organization
          window.axios.get(API_URL+'/candidate/all/'+org+'/'+year)
          .then(({ data }) => {
            let x 
            for(x in data) {
              this.candidates.push(data[x]['_source'])
            }
          })
          .catch(function (e) {
              alert('Error loading search candidates, please refresh.')
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