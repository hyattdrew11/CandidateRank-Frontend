import Vue from "vue";

export default Vue.extend({
    template: `
    <div class="">
        <b-button 
            class="mt-2 tx-10"
            variant="success"
            size="sm"
            @click="viewApplication()" 
            v-if="params.node.data.application">
            Application
        </b-button>
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
        openSurvey() {
            let candidate   = this.params.node.data
            let survey      = this.params.context.componentParent.currentTerm['Pre-Interview']
            this.params.context.componentParent.startSurvey(candidate, survey)
        },
        deleteCandidate() {
            alert("Delete Candidate")
        },
        viewApplication() {
            this.params.context.componentParent.viewApplication(this.params.node.data)
        },
        updateStatus() {
            this.params.context.componentParent.updateStatus(this.params.node.data)
        },
         notifyCandidate() {
            this.params.context.componentParent.notifyCandidate(this.params.node.data)
        },
        uploadApp() {
            alert("Upload Candidate PDF")
            // this.params.context.componentParent.uploadApp()
        }
    }
});