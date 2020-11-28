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
        <b-button 
            class="mt-2 tx-10"
            :disabled="!params.context.componentParent.currentTerm['Interview']"
            variant="primary"
            size="sm"
            @click="openInterviewSurvey()">
            Interview Survey
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
        deleteCandidate() {
            alert("Delete Candidate")
        },
        viewApplication() {
            this.params.context.componentParent.viewApplication(this.params.node.data)
        },
        openPreinterviewSurvey() {

        },
        openInterviewSurvey() {
            let candidate   = this.params.node.data
            let survey      = this.params.context.componentParent.currentTerm['Interview']
            this.params.context.componentParent.startSurvey(candidate, survey)

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