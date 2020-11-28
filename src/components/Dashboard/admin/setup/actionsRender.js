import Vue from "vue";

export default Vue.extend({
    template: `
    <div class="">
        <i 
            class="fa fa-file-pdf-o pointer gray tx-20 mr-2"  
            @click="viewApplication()" 
            v-if="params.node.data.application" 
            v-b-tooltip.hover 
            title="View Application" 
            aria-hidden="true">
        </i>

         <i 
            class="fa fa-upload pointer tx-20 mr-2 blue"  
            @click="uploadApp()" 
            v-if="!params.node.data.application" 
            v-b-tooltip.hover 
            title="Upload PDF" 
            aria-hidden="true">
        </i>

        <i 
            class="fa fa-user-circle pointer gray tx-20 mr-2"  
            @click="updateStatus()"" 
            v-b-tooltip.hover 
            title="Update Status" 
            aria-hidden="true">
        </i>

        <i 
            class="fa fa-times-circle red pointer tx-20 mr-2"  
            @click="deleteCandidate()"" 
            v-b-tooltip.hover 
            title="Delete Candidate" 
            aria-hidden="true">
        </i>

    </div>
    `,
    data: function () {
        return {
            imagePath: null,
        };
    },
    mounted() {
    },
    methods: {
        deleteCandidate() {
            alert("Delete Candidate")
        },
        viewApplication() {
            this.params.context.componentParent.viewApplication(this.params.node.data)
        },
        updateStatus() {
            this.params.context.componentParent.updateStatus(this.params.node.data)
        },
        uploadApp() {
            alert("Upload Candidate PDF")
            // this.params.context.componentParent.uploadApp()
        }
    }
});