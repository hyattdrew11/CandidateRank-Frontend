<template>
	<div class="container-fluid">  
    	<b-row>
    		<b-col sm="9">
          		<label class="tx-12 wt-600 dark-gray fw">Notifications</label>
         		<b-button 
            		class="mr-1 float-left"
            		variant="success"
            		size="sm"
            		v-b-modal.notification-wizard
            		>Create New Notification
          		</b-button>


          		<b-modal id="notification-wizard" title="New Notification">
          			<p class="my-4">Send Date</p>
          			<p class="my-4">Type: Candidate or Evaluators</p>
    				<p class="my-4">Include Zoom Meeting Link</p>
  				</b-modal>

          		<b-button 
            		class="mr-1 float-left"
            		variant="secondary"
            		size="sm"
            		v-b-modal.notification-schedule
            		>View Scheduled Notifications
          		</b-button>

          		<b-modal id="notification-schedule" title="Notification Schedule">
          			<p class="my-4">Send Date</p>
          			<p class="my-4">Type: Candidate or Evaluators</p>
    				<p class="my-4">Include Zoom Meeting Link</p>
  				</b-modal>

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
       		<b-col md="3">
          		<label class="tx-12 wt-600 dark-gray fw">Saved Notifications</label>
          		<b-list-group>
            		<b-list-group-item  v-for="(x, index) in notifications" class="pointer">
              			{{ x.name }}
            		</b-list-group-item>
          		</b-list-group>
      		</b-col>
      		<b-col md="9">
      			<b-row class="mb-2">
      				<b-col sm="4">
                		<label class="tx-12 wt-600 dark-gray fw">Notification Name:</label>
                  		<b-form-input type="text" placeholder="Enter name"></b-form-input>
              		</b-col>
      				<b-col sm="4">
                		<label class="tx-12 wt-600 dark-gray fw">Email Subject:</label>
                  		<b-form-input type="text" placeholder="Enter Subject..."></b-form-input>
              		</b-col>
              		<b-col sm="4">
                		<label class="tx-12 wt-600 dark-gray fw">Email BCC:</label>
                  		<b-form-input type="text" placeholder="Enter email address"></b-form-input>
              		</b-col>
              		<b-col sm="12"><hr/></b-col>
              	</b-row>
				<vue-editor v-model="content"></vue-editor>
				<b-button 
            		class="float-right no-border-radius"
            		variant="secondary"
            		size="sm"
            		>
            		Attach Files
          		</b-button>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  name: 'Notifications',
  data () {
    return {
    	 content: "<p>Create email body here.</p>",
    	 notifications: [
    	 	{ 
    	 		'name' 			: 'Notification 1',
    	 		'subject' 		: 'Subject',
    	 		'bcc' 			: 'BCC',
    	 		'body' 			: '<h2>This is notification 1</h2>',
    	 		'attachements'	: [],
    	 		'sendDate' 		: '2020-07-04',
    	 	},
    	 ]
    }
  },
   components: {
    VueEditor
  },
}
</script>

<style lang="scss" scoped></style>
