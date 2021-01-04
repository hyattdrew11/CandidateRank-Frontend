<template>
	<div class="container-fluid" v-if="currentTerm != null">  
      <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" ></i>
    	<b-row no-gutters :class="{fade : loading }">
    		<b-col sm="6">
          		<label class="tx-12 wt-600 dark-gray fw">Notifications</label>
         		<b-button 
            		class="mr-1 float-left"
            		variant="success"
            		size="sm"
                @click="newNotification()"
            		>Create New Notification
          		</b-button>

  				</b-modal>

          	<!-- 	<b-button 
            		class="mr-1 float-left"
            		variant="secondary"
            		size="sm"
            		v-b-modal.notification-schedule
            		>View Scheduled Notifications
          		</b-button> -->

          		<b-modal id="notification-schedule" title="Notification Schedule">
          			<p class="my-4">Send Date</p>
          			<p class="my-4">Type: Candidate or Evaluators</p>
    				<p class="my-4">Include Zoom Meeting Link</p>
  				</b-modal>

            <b-modal  id="notification-test" title="Notification Test" hide-footer>
                <label class="tx-12 wt-600 dark-gray fw">Recipient email address:</label>
                <b-form-input type="email" v-model="recipient" placeholder="Enter email address"></b-form-input>
                <hr />
                <b-button size="sm" variant="primary" class="float-right" @click="sendTest()">Send Test</b-button>
            </b-modal>

              <b-modal size="lg" id="preview-test" title="Preview Notification" hide-footer>
                <label class="tx-12 wt-600 fw">From: info@candidaterank.io</label>
                <label class="tx-12 wt-600 fw">Email Subject: {{ notification.subject }}</label>
                <div v-html="content_header"></div>
                <div v-html="previewLink"></div>
                <div v-html="content"></div>
            </b-modal>

      		</b-col>
      		<b-col sm="6" class="text-right">
         		<label class="tx-12 wt-600 dark-gray fw">&nbsp;</label>
               <b-button 
                class="mr-1"
                variant="secondary"
                size="sm"
                :disabled="editNew == null && editHistorical == null"
                v-b-modal.preview-test
                >Preview
              </b-button>
              <b-button 
                class="mr-1"
                variant="success"
                size="sm"
                :disabled="editNew == null && editHistorical == null"
                v-b-modal.notification-test
                >Send Test
              </b-button>
                <b-button 
                :disabled="editNew == null && editHistorical == null"
                class="mr-1"
                variant="primary"
                size="sm"
                @click="saveNotification()"
                >Save Notification
              </b-button>
      		</b-col>
      		<b-col sm="12"><hr /></b-col>
       		<b-col md="3">
              <label class="tx-12 wt-600 dark-gray fw">Active Notification</label>
              <span v-if="currentTerm.notification">{{ currentTerm.notification.name }}</span>
              <span v-else>No active notification</span>
              <hr />
          		<label class="tx-12 wt-600 dark-gray fw">Saved Notifications</label>
          		<b-list-group>
            		<b-list-group-item  v-for="(x, index) in organization.notifications" class="">
              			{{ x.name }}
                    <i 
                      class="fa fa-times-circle float-right red pointer mt-1 ml-1"  
                      v-b-tooltip.hover title="Delete" @click="deleteNotification(x, index)">
                    </i>
                    <i 
                      v-b-tooltip.hover title="Edit Survey" 
                      class="fa fa-edit dark-gray float-right ml-1 pointer mt-1 ml-1"  
                      @click="chooseHistorial(x, index)">
                    </i>
            		</b-list-group-item>
          		</b-list-group>
      		</b-col>
      		<b-col md="9">
      			<b-row class="mb-2">
      				<b-col sm="3">
                		<label class="tx-12 wt-600 dark-gray fw">Notification Name:</label>
                  		<b-form-input :disabled="editNew == null && editHistorical == null" type="text" v-model="notification.name" placeholder="Enter name"></b-form-input>
              		</b-col>
      				<b-col sm="3">
                  <label class="tx-12 wt-600 dark-gray fw">Email Subject:</label>
                  <b-form-input :disabled="editNew == null && editHistorical == null" type="text" v-model="notification.subject" placeholder="Enter Subject..."></b-form-input>
              </b-col>
              <b-col sm="2">
                <label class="tx-12 wt-600 dark-gray fw">Attachments:</label>
                <b-button v-b-modal.attachment-modal variant="success" size="sm" :disabled="editNew == null && editHistorical == null" class="mt-1">Upload</b-button>
              </b-col>
              <b-col sm="2">
                <label class="tx-12 wt-600 dark-gray fw">Include Zoom:</label>
                <b-form-group label="" class="mt-2">
                  <b-form-checkbox v-model="zoom" name="some-radios" @change="buildContent()"></b-form-checkbox>
                </b-form-group>
              </b-col>
               <b-col sm="2">
                <label class="tx-12 wt-600 dark-gray fw">Activate:</label>
                <b-form-group label="" class="mt-2">
                  <b-form-checkbox v-model="activate_notification" name="some-radios" @change="activateNotification()"></b-form-checkbox>
                </b-form-group>
              </b-col>
              <b-col sm="12">
				        <vue-editor id="email-editor" :disabled="editNew == null && editHistorical == null" :class="{lock: editNew == null}" v-model="content"></vue-editor>
                <div id="email-attachments">
                  <span  v-for="(x, index) in notification.attachments" class="email-attachment">
                    {{ x.name }}
                     <i 
                      class="fa fa-times-circle float-right red pointer mt-1 ml-3"  
                      v-b-tooltip.hover title="Remove attachment" @click="removeAttachment(x, index)">
                    </i>
                  </span>
                </div>
              </b-col>
            </b-row>
			</b-col>
		</b-row>
    <b-modal id="attachment-modal" title="Email Attachments" hide-footer size="lg" centered>
                   <vue-dropzone 
                    v-if="editNew"
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
                        <p class="text-center tx-14 wt-500 mb-0">Drag and drop files you want to attach.</p>
                        <p class="tx-10 text-center mb-0">ZIP, CSV, and PDF only.</p>
                        <span class="btn btn-primary btn-sm mt-1">Select File</span>
                    </div>
                  </vue-dropzone>
                </b-modal>
	</div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import axios from 'axios'
import Vue from 'vue'
const API_URL = process.env.VUE_APP_API_URL
const S3_BUCKET = process.env.VUE_APP_S3_BUCKET
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'Notifications',
  props: ["organization","user","candidates","surveys","faculty", "currentTerm"],
  watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
      if(!this.organization.notifications) {
        this.organization.notifications = []
      }
    },
  },
  data () {
    return {
       loading: false,
       previewLink: null,
       activate_notification: true,
       zoom: true,
    	 content: "<p>Create email body here.</p>",
       recipient: "placeholder@gmail.com",
       editNew: null,
       editHistorical: null,
       historicalIndex: null,
       year: this.currentTerm.year,
       notification: {
          'name'          : '',
          'subject'       : '',
          'body'          : '',
          'attachements'  : [],
       },
        dropzoneOptions: {
          url: API_URL+'/dashboard/admin/upload/attachment',
          autoProcessQueue: true,
          autoQueue: true,
          parallelUploads: 10,
          uploadMultiple: false,
          createImageThumbnails: false,
          addRemoveLinks: true,
          timeout: 360000,
          maxFilesize: 10000,
          chunking: true,
          forceChunking: true,
          chunkSize: 2000000,
          uploadMultiple: false
        },
    }
  },
  components: {
    VueEditor,
    vueDropzone: vue2Dropzone,
  },
  computed: {
    currentTermIndex: function () {
      let x
      let terms = this.organization.terms
      for(x in terms) {
        if(terms[x].year == this.currentTerm.year) {
          return x
          }
          else {}
      }
    },
    notifications: function () {
      return this.organization.notifications;
    },
    content_header: function () {
      let org   = this.organization.name
      let year  = this.currentTerm.year
      let email = this.recipient
      // this.previewLink  = "https://candidaterank.io/candidate/"+org+"/"+year+"/"+email+""
      let html  = "&nbsp;"
      // if(this.zoom) {
      //   html += "<p>We will be conducting interviews remotely this season. Please click the link below to choose a day where you will be avilable to interview with our staff remotely.</p>"
      //   html += "<p><a href='https://candidaterank.io/applicant'>My Schedule</a></p>"
      // }

      return html
    },
    // content_full: function () { 
    //   let content = this.content_header + this.content
    //   return content
    // },
  },
  methods: { 
    activateNotification() {
      this.activate_notification = !this.activate_notification
    },
    buildContent() {
      this.zoom = !this.zoom
    },
    removeAttachment(x, index) {
      this.notification.attachments.splice(index, 1)
    },
    deleteNotification(x, index) {
      this.organization.notifications.splice(index, 1)
      this.updateOrganization()
    },
    saveNotification() {
      // console.log("SAVE NOTIFICATION")
      let name    = this.notification.name
      let subject = this.notification.subject
      let header  = this.content_header
      let body    = this.content
      if(name.length == 0 || subject.length == 0 || body.length == 0)  {
        alert("Please add an email name, subject, and body to save.")
      }
      else {
        this.notification.body   = body
        this.notification.header = header
        this.notification.zoom   = this.zoom
        if(this.editNew == true) {
          this.organization.notifications.push(this.notification)
        }
        else {
           this.organization.notifications[this.historicalIndex] = this.notification
        }
        if(this.activate_notification) { this.currentTerm.notification = this.notification }
        this.updateOrganization()
        this.content = "<p>Create email body here.</p>"
      }
    },
    updateOrganization() {
        this.organization.notifications = this.notifications
        if(this.activate_notification) {
          this.currentTerm.notification = this.notification
          let inx = this.currentTermIndex
          this.organization.terms[inx]['notification'] = this.currentTerm.notification
        }
        // console.log(this.organization)
        // AXIOS UPDATE THE ORGANIZATION VIA API
        axios.post(API_URL+'/organization/update/terms/'+this.organization.name, this.organization)
        .then(({data}) => { 
          this.$emit("update:organization", data)
        })
        .catch(function (e) { alert(e) })
    },
    chooseHistorial(x, index) {
      this.editNew = false
      this.editHistorical = true
      this.historicalIndex = index
      this.notification = x
      this.content = x.body
    },
    newNotification() {
      this.editNew = true
      this.content =  "<p>Add you email body content here...</p>"
      this.notification = {
        'name'          : '',
        'subject'       : '',
        'header'        : this.content_header,
        'body'          : this.content,
        'attachments'   : [],
      }
    },
    sendTest() {
      this.$bvModal.hide("notification-test")
      this.loading = true
      this.notification.address =  this.recipient
      this.notification.body    =  this.content
      this.notification.header  =  this.content_header
      // console.log(this.notification)
      // AXIOS UPDATE THE ORGANIZATION VIA API
      axios.post(API_URL+'/organization/notification/test', this.notification)
      .then(({data}) => { 
        // console.log(data)
        if(data === 'success') { 
          // alert("Test sucessfully sent.")
          this.loading = false
        }
        else {
          alert("There was a problem sending your test email. Please check the recipient address and try again.")
        }
      })
      .catch(function (e) { alert(e) })
    },
    vfileAdded(file) {
         this.$refs.myVueDropzone.processQueue(file)
    },
    vfilesAdded(file) {
        this.$refs.myVueDropzone.processQueue(file)
    },
    sendingEvent (file, xhr, formData) {
         formData.append('organization', this.organization.name);
         formData.append('year',this.currentTerm.year);
    },
    vsuccess(file, response) {
        let newFile = {
          name: file.name,
          path: S3_BUCKET+'/'+this.organization.name+'/'+this.currentTerm.year+'/attachments/'+file.name,
          url: 'null',
          year: this.currentTerm.year.toString(),
        }
        this.notification.attachments.push(newFile)
      },
      vlogProgress(file, progress, bytesSent) {
      },
  }
}
</script>

<style>
  .lock {
    cursor: not-allowed;
  }
  .lock  > .ql-editor {
    background-color: #e9ecef;
  }
 /* .dropzone-container {
    position: absolute;
    width: 96.5%;
    top: 150px;
    padding: 10px;
  }*/
  .ql-container {
    /*min-height: 250px!important;*/
  }
  #email-attachments {
    min-height: 50px;
    width: 100%;
    border: 1px solid #ccc; 
  }
  .email-attachment {
    display: inline-block;
    float: left;
    padding: 7px;
    min-height: 25px;
    background-color: #ccc;
    margin-top: 5px;
    margin-left: 5px;
    border-radius: 3px;
  }
</style>
