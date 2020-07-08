<template>
	<div class="container-fluid">  
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" ></i>

		<b-row :class="{fade : loading }">
      <b-col sm="9">
        <label class="tx-12 wt-600 dark-gray fw">Choose View:</label>
         <b-form-group label="" class="">
          <b-form-radio-group
            v-model="viewSelected"
            :options="viewOptions"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
      </b-col>

      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray fw">&nbsp;</label>
         <b-button 
            class="mr-1 float-right"
            variant="primary"
            size="sm"
            >Save & Contine
          </b-button>
      </b-col>
      <b-col sm="12"><hr /></b-col>
    </b-row>

    <b-row :class="{'d-none' :  viewSelected != 'Import Files'}">
       <b-col sm="12" md="5" lg="5">
        <b-card id="files-container">
          <label class="tx-12 wt-600 dark-gray fw">Files {{ this.currentTerm.year }}</label>
          <p v-if="this.year == null" class="tx-12 text-center">please select an interview year</p>
          <b-form-input v-if="year" size="sm" v-model="fsearch" placeholder="search my files" class="mb-2"></b-form-input>
          <div v-if="ZIPS.length > 0">
            Zips
            <i class="fa fa-caret-down gray pointer float-right" v-b-toggle.collapse-zips variant="primary"></i>
            <hr />
            <b-collapse id="collapse-zips" visible class="mt-2 file-collapse">
              <div v-for="(x, index) in ZIPS">
                <p class="mb-1">
                  <i class="fa fa-file-archive-o mr-1 gray" ></i>
                  <a :href="x.url" class="file">{{ x.name }}</a>
                  <i class="fa fa-times-circle float-right pointer red" @click="deleteFile(index, x, 'ZIPS')"   v-b-tooltip.hover title="Delete"></i>
                </p>
              </div>
            </b-collapse>
          </div>

          <div v-if="CSVS.length > 0">
            CSVs
            <i class="fa fa-caret-down pointer float-right" v-b-toggle.collapse-csvs variant="primary"></i>
            <hr />
            <b-collapse id="collapse-csvs" visible class="mt-2 file-collapse">
              <div v-for="(x, index) in CSVS">
                 <p class="mb-1">
                  <i class="fa fa-file-excel-o mr-1 gray"></i>
                  <a :href="x.url" class="file">{{ x.name }}</a>
                  <i class="fa fa-times-circle float-right pointer red" @click="deleteFile(index, x, 'CSVS')"  v-b-tooltip.hover title="Delete"></i>
                </p>
              </div>
            </b-collapse>

            <hr />
          </div>

          <div v-if="PDFS.length > 0">
            PDFs
            <i class="fa fa-caret-down pointer float-right" v-b-toggle.collapse-pdfs variant="primary"></i>
            <hr />
            <b-collapse id="collapse-pdfs" visible  class="mt-2 file-collapse">
              <div v-for="(x, index) in PDFS">
                 <p class="mb-1">
                  <i class="fa fa-file-pdf-o mr-1 gray" ></i>
                  <a :href="x.url" class="file">{{ x.name }}</a>
                  <i class="fa fa-times-circle float-right pointer red" @click="deleteFile(index, x , 'PDFS')"   v-b-tooltip.hover title="Delete"></i>
                </p>
              </div>
            </b-collapse>
          </div>
        </b-card>
      </b-col>

      <b-col sm="12" md="7" lg="7">
          <vue-dropzone 
            ref="myVueDropzone" 
            id="dropzone" 
            :include-styling="true"
            @vdropzone-file-added="vfileAdded"
            @vdropzone-files-added="vfilesAdded"
            @vdropzone-success="vsuccess"
            @vdropzone-upload-progress="vlogProgress"
            v-on:vdropzone-sending="sendingEvent"
            :options="dropzoneOptions"
            :useCustomSlot="true"
            :duplicateCheck="true"
          >
            <div class="dropzone-custom-content mt-2 text-center">
              <span class="fa-stack fa-2x">
                <i class="fa fa-circle fa-stack-2x light-gray"></i>
                <i class="fa fa-upload fa-stack-1x white"></i>
              </span>
                <p class="text-center tx-14 wt-500 mb-0">Drag and drop files you want to upload.</p>
                <p class="tx-10 text-center mb-0">ZIP, CSV, and PDF only.</p>
                <span class="btn btn-primary btn-sm mt-1">Select File</span>
            </div>
          </vue-dropzone>
      </b-col>
    </b-row>

    <b-row :class="{'d-none' :  viewSelected != 'Filter Candidates'}">
     <b-col sm="12" md="12" lg="12">
      <b-card>
        <b-button size="sm" class="add-btn mr-1" variant="secondary">All Candidates</b-button>
        <b-button size="sm" class="add-btn mr-1" variant="primary">Chosen Candidates</b-button>
        <span class="float-right tx-12 wt-500 gray ml-2 pointer" @click="refreshTerm()">
          <i class="fa fa-sync"></i>
        </span>
        <span class="float-right tx-12 wt-500 gray">{{ candidates.length }} Candidates</span>
        <hr />
        <ag-grid-vue
          id="grid"
          style="width: 100%; height: 500px;"
          class="ag-theme-material"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :animateRows="true"
          @onGridReady="onGridReady"
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
const currentYear = (new Date()).getFullYear();
const API_URL = process.env.VUE_APP_API_URL
const S3_BUCKET = process.env.VUE_APP_S3_BUCKET

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
const csv = require('csvtojson')


import { AgGridVue } from 'ag-grid-vue';
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import {fields} from './fields'
import photoRender from "./photoRender";

export default {
	name: 'importData',
  props: ["organization","user","candidates","surveys","faculty","currentTerm", "files"],
  watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    },
    currentTerm: function(newVal, oldVal) {
      if(newVal) {
        this.year = newVal.year
      }
    },
    files: function(newVal, oldVal) {
      if(newVal) {
        this.files = newVal
      }
    },
    candidates: function(newVal, oldVal) {
      if(newVal) {
        this.candidates = newVal
        this.rowData = newVal
      }
    }
  },
	data() {
    	return {
        fsearch: '',
        csearch: '',
        showDropZone: false,
        loading: false,
        fields:['Date', 'File Name', 'Upload Progress'],
        imports :[],
        file: null,
        fileAdded: null,
        year: this.currentTerm.year,
        header: null,
        stagedCandidates: [],
        showResults: false,
        results: [],
        viewSelected: 'Filter Candidates',
        viewOptions: ['Filter Candidates', 'Import Files'],
        dropzoneOptions: {
          url: API_URL+'/dashboard/admin/upload',
          autoProcessQueue: true,
          autoQueue: true,
          parallelUploads: 10,
          uploadMultiple: false,
          createImageThumbnails: false,
          addRemoveLinks: true,
          timeout: 360000, //milliseconds
          maxFilesize: 10000,
          chunking: true,
          forceChunking: true,
          chunkSize: 2000000,
          uploadMultiple: false,
          acceptedFiles: 'application/pdf, text/csv, application/zip'
        },
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
    	vueDropzone: vue2Dropzone,
      AgGridVue: AgGridVue,
      photoRender
  	},
  computed: {
   priorYears() {
        let x
        let terms = this.organization.terms
        let years = []
        for(x in terms) { 
          years.push(terms[x].year) }
        return years
    },
    checkHeader() {
      return this.header
    },
    CSVS: {
      get() { 
        let files = this.sortedFiles.filter(i => i.name.includes('.csv'));
        return files
      },
      set: function(newValue) {
         let files = newValue.filter(i => i.name.includes('.csv'));
        return files
      }
    },
    PDFS: {
      get() {
        let files = this.sortedFiles.filter(i => i.name.includes('.pdf'));
        return files
      },
      set: function(newValue) {
        console.log(newValue)
        let files = newValue.filter(i => i.name.includes('.pdf'));
        return files
      }
    },
    ZIPS: {
      get() {
        let files = this.sortedFiles.filter(i => i.name.includes('.zip'));
        return files
      },
      set: function(newValue) {
        let files = newValue.filter(i => i.name.includes('.zip'));
        return files
      }
    },
    sortedCustodians: {
        get () {
          /* 
          COMPUTED PROPERTY IS CONNECTED TO THE SEARCH TEXT BOX IN THE COMPONENT
          ALLOWS USERS TO SEARCH THEIR MATTERS AND ASSIGNMENTS
          */
          if(this.candidates.length > 0) {
            return this.candidates
              ? this.candidates.filter(item => 
                item['Last Name'].toLowerCase().includes( this.csearch.toLowerCase() )
                ||
                item['First Name'].toLowerCase().includes(this.csearch.toLowerCase())
                )
              : this.candidates
            }
            else {
              let arr = []
              return arr
            }
        },
        set () {
          this.candidates.sort(function(a, b) {
              if(a['First Name'] < b['First Name']) { return -1 }
              if(a['Last Name'] > b['Last Name']) { return 1  }
              return 0
            })
        }
      },
    sortedFiles: {
      get () {
         let year = this.currentTerm.year
         if(this.files.length > 0) {
            return this.files
              ? this.files.filter(item => item.year.includes(year) && item.name.toLowerCase().includes(this.fsearch.toLowerCase()))
              : this.files
            }
            else {
              let arr = []
              return arr
            }
      },
      set() {
        let year = this.currentTerm.year
        if(year != undefined) {
          return this.files
              ? this.files.filter(item => item.year.includes(year) )
              : this.files
        }
        else {
          let f = []
          return f
        }
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
      this.gridApi.sizeColumnsToFit();
  },
  methods: {
      refreshTerm() {
         this.$emit('changeTerm', this.currentTerm)
      },
      deleteFile(index, file, farray) {
        let vm = this
        let fs = this.files.findIndex(i => i.path.includes(file.path));

        let c = confirm("Delete " + file.name + "?")
        if(c) {
          let input = {
            path: file.path
          }
          window.axios.post( API_URL+'/dashboard/admin/file/delete',  input)
            .then(({data}) => { 
              console.log(data)
              this.files.splice(fs, 1)
              this.loading = false
            })
            .catch(function (e) { 
              vm.loading = false
              alert(e) 
            })
         }
         else {
            this.loading = false
         }
      },
      vfileAdded(file) {
         this.$refs.myVueDropzone.processQueue(file)
      },
      vfilesAdded(file) {
         this.$refs.myVueDropzone.processQueue(file)
      },
      sendingEvent (file, xhr, formData) {
         formData.append('organization', this.organization.name);
         formData.append('year', this.year);
      },
      vsuccess(file, response) {
        let newFile = {
          name: file.name,
          path: S3_BUCKET+'/'+this.organization.name+'/'+this.year+'/'+file.name,
          url: 'null',
          year: this.year.toString(),
        }
        this.files.push(newFile)
      },
      vlogProgress(file, progress, bytesSent) {
      },
      onGridReady(params) {
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function() {
            setTimeout(function() {
              params.api.sizeColumnsToFit()
            })
          })  
      }
    }
};
</script>
<style scoped lang="scss">
#files-container, #importer-container {
  min-height: 63vh;
  height: 63vh;
  overflow-y: scroll;
}
</style>