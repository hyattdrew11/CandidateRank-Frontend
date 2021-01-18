<template>
  <div>
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
    <div :class="{fade : loading }">
     <h5>Interview Survey : {{ survey.name }}</h5>
     <hr />
     <h6>Current Score: {{ score}} </h6>
      <div v-if="readySurvey" v-for="(x, index) in readySurvey.questions" :key="index"  class="list-group-item">
        <div v-if="x.type == 'Range'">
          <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.text }}</p>
          <b-form-radio-group
            v-model="x.state"
            :options="x.options"
            class="mb-3"
            value-field="item"
            text-field="name"
            @change="updateRadio($event, index)"
          ></b-form-radio-group>
        </div>
        <div v-if="x.type == 'Comment'">
          <p class="question-text mb-0 p-1 tx-12 wt-600">{{ x.question }}</p>
          <b-form-textarea v-model="x.text" placeholder="..." rows="3" max-rows="6"></b-form-textarea>
        </div>
      </div>
      <hr />
      <b-button variant="primary" size="sm" class="float-right"@click="submitSurvey()">Save</b-button> 
    </div>
  </div>
</template>

<script>


export default {
	name: 'piSurvey',
  props: ['candidate', 'survey', 'user'],
  watch: {
  },
	data() {
    	return {
        loading: false,
        values: [],
        score: 0,
        comments: []
      }
  	},
  	components: {},
    computed: {},
    computed: {
      readySurvey() {
        let x
        let survey = this.survey
        if(survey.questions) {
          for(x in survey.questions) {
            if(survey.questions[x].type === "Range") {
              let options = survey.questions[x].options
              survey.questions[x].state = null
            }
            if(x.type == "Comment") {}
          }
        }
        return survey
      }
    },
  	methods: {
      updateRadio(i, index) {
        this.survey.questions[index].state = i
        this.values[index] = i
        this.score = this.values.reduce((a, b) => a + b, 0)
      },
      validateSurvey() {
        let x
        let survey = this.survey
        let res = true
        if(survey.questions) {
          for(x in survey.questions) {
            if(survey.questions[x].type === "Comment") {
              // console.log("COMMENT")
              if(survey.questions[x].text.length > 0) {
                let comment = this.user.first_name +" "+ this.user.last_name +": "+ survey.questions[x].text
                this.comments.push(comment)
              }
            }
            if(survey.questions[x].type === "Range" && survey.questions[x].state === null) {
              res =  false
            }
            
          }
        }
        return res
      },
      candidateUpdate(){
        let candidate = this.candidate
        candidate.interview_score = (this.score + candidate.interview_score)
        candidate.rank = (this.score + candidate.rank)
        if(candidate.comments) {
          candidate.comments = candidate.comments.concat(this.comments)
          // console.log(candidate.comments, this.comments)
        }
        else {
           candidate.comments = this.comments
        }
        return candidate
      },
      submitSurvey() {
        this.loading = true
        // AXIOS CALL OT SAVE SURVEY
        let valid = this.validateSurvey()
        if(valid) {
          let candidate = this.candidateUpdate()
          this.$emit("updateCandidate", candidate)
          this.loading = false
          this.$emit("closeSurvey")
        }
        else {
          alert("Please fill in all values")
          this.loading = false
        }
      }
    }
};
</script>
<style scoped lang="scss"></style>