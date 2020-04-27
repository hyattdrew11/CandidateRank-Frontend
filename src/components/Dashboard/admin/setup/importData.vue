<template>
	<div class="container-fluid">  
		<b-row>
      <!-- <h5>Automate Uplaod</h5> -->
      <b-col sm="6">
         <label class="tx-12 wt-600 dark-gray">Choose Year:</label>
            <b-form-select v-model="year" :options="priorYears"></b-form-select>
      </b-col>
      <b-col sm="3"></b-col>
      <b-col sm="3" class="pt-2">
        <b-button variant="primary" size="sm" class="float-right mt-4 mr-1" @click="startImport()">Start Import</b-button>
        <b-button variant="danger" size="sm" class="float-right mt-4 mr-1" @click="resetImport()">Clear</b-button>
      </b-col>
      <b-col sm="12">
          <hr />
          <table id="" class="table table-bordered table-hover" :class="{'d-none': !showResults}">
           <thead>
              <tr>
                <th scope="col">Import Results</th>
              </tr>
            </thead>
             <tbody>
              <tr v-for="(x, index) in results">
                  <td> {{ x['Last Name'] }}, {{ x['First Name'] }} </td>
              </tr>
            </tbody>
          </table>
        <!-- <h5>Manual Upload</h5> -->
        <vue-dropzone 
          ref="myVueDropzone" 
          id="dropzone" 
          class="mb-4"
          :class="{'d-none': hideDropZone}" 
          @vdropzone-file-added="vfileAdded"
          @vdropzone-success="vsuccess"
          @vdropzone-upload-progress="vlogProgress"
          v-on:vdropzone-sending="sendingEvent"
          :options="dropzoneOptions"
          :useCustomSlot="true"
          :duplicateCheck="true"
        >
          <div class="dropzone-custom-content mt-2 text-center">
            <span class="fa-stack fa-4x">
              <i class="fa fa-circle fa-stack-2x light-gray"></i>
              <i class="fa fa-upload fa-stack-1x white"></i>
            </span>
            <p class="text-center tx-14 wt-500">Drag and drop a file you want to upload</p>
            <span class="btn btn-primary btn-sm">Select File</span>
          </div>
        </vue-dropzone>
      </b-col>
      <b-col sm="6">
        <label class="tx-18 wt-600 dark-gray">Candidate Fields</label>
        <hr />
        <ul class="candidate-fields">
           <li class="candidate-field" v-for="(x, index) in header">{{ x }}</li>
        </ul>
      </b-col>
       <b-col sm="6">
        <label class="tx-18 wt-600 dark-gray">Candidates {{ stagedCandidates.length }}</label>
         <hr />
         <p class="mb-0" v-for="(x, index) in stagedCandidates">
          <i class="fa fa-user-circle gray"></i> {{ x['Last Name'] }}, {{ x['First Name'] }} 
        </p>
      </b-col>
      </b-col>
    </b-col>
    </b-row>
	</div>
</template>

<script>
const currentYear = (new Date()).getFullYear();
const API_URL = process.env.VUE_APP_API_URL

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
const csv = require('csvtojson')



export default {
	name: 'importData',
  props: ["organization","user","candidates","surveys","faculty"],
  watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    }
  },
	data() {
    	return {
        fields:['Date', 'File Name', 'Upload Progress'],
        imports :[],
        file: null,
        fileAdded: null,
        year: null,
        header: null,
        stagedCandidates: [],
        hideDropZone: false,
        showResults: false,
        results: [],
        dropzoneOptions: {
          url: '/api/upload',
          autoProcessQueue: false,
          autoQueue: true,
          parallelUploads: 1,
          maxFiles: 1,
          uploadMultiple: false,
          createImageThumbnails: false,
          addRemoveLinks: false,
          timeout: 360000, //milliseconds
          // headers: {
          //       "X-CSRF-TOKEN": document.head.querySelector("[name=csrf-token]").content
          // },
          maxFilesize: 10000,
          chunking: true,
          forceChunking: true,
          chunkSize: 2000000,
          uploadMultiple: false
        },
      }
  	},
	components: {
    	vueDropzone: vue2Dropzone
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
    }
  },
  mounted() {},
  	methods: {
      resetImport() {
        this.stagedCandidates = []
        this.header = null
        this.$refs.myVueDropzone.removeAllFiles()
        this.hideDropZone = false
        this.showResults = false
      },
      startImport() {
        if(this.year ==  null) {
          alert('Select a year.')
        }
        else if(this.stagedCandidates.length == 0) { 
          alert('Please Upload A CSV')
        }
        else {
          let c = confirm('Start importing '+this.stagedCandidates.length+' candidates for the year '+this.year)
          if(c) {
            this.$Progress.start()
            let i 
            for(i in this.stagedCandidates) {
              // CHECK FOR EMPTY VALUES
              let x
              let co = this.stagedCandidates[i]
              for(x in co) { if( co[x] == "" || co[x] == null) { co[x] = "n/a" } }
                // ADD REQUIRED DYNAMO DB VALUES 
                this.stagedCandidates[i]['Organization']  = this.organization.name
                this.stagedCandidates[i]['Rank-Term']      = this.year
                this.stagedCandidates[i]['interview']      = { 'status' : 'incomplete' }
                this.stagedCandidates[i]['survey_1']       = { 'status' : 'incomplete' }
                this.stagedCandidates[i]['survey_2']      = { 'status' : 'incomplete' }
              }
            }
            // axios post to api 
            window.axios.post(API_URL+'/candidate/add/'+this.organization.name,  this.stagedCandidates)
            .then(({data}) => { 
              alert("Candidates Imported Successfully")
              this.results = data
              this.showResults = true
              this.$Progress.finish()
            })
            .catch(function (e) { 
              this.$Progress.fail()
              alert(e) 
            })
        } 
      },
      chooseFile() {
        document.getElementsByClassName("dropzone")[0].click();
      },
      processQueue() {
          this.$refs.myVueDropzone.processQueue()
      },
      vfileAdded(file) {
        let vm = this
        this.file = file
        this.fileAdded = true
        let fileCheck = file.name.endsWith('.csv')
        if (fileCheck) {
          this.hideDropZone = true
          let i = {
            "date" : '',
            "name" : file.name,
            "progress" : file.progress,
          }
          this.imports.push(i)
          const reader = new FileReader();
            reader.onload = function(event) {
              let string = event.target.result
              csv()
                .fromString(string)
                .on('header',(header)=>{
                  vm.header = header

                })
                .then((jsonObj)=>{
                  vm.stagedCandidates = jsonObj
                })
          }

          reader.readAsText(file);

        } else {
            this.validZip = null
            this.$refs.myVueDropzone.removeFile(file)
            alert("Not a valid upload file.")
        }
      },
      sendingEvent (file, xhr, formData) {},
      vsuccess(file, response) {},
      vlogProgress(file, progress, bytesSent) {},
    }
};
</script>
<style scoped lang="scss">
  .candidate-fields { padding-inline-start: 0px; }
  .candidate-field {
    list-style: none;
    display: block;
    // font-size: 12px;
    background-color: #f7f7f7;
    padding: 10px;
    margin: 5px; 
  }
</style>