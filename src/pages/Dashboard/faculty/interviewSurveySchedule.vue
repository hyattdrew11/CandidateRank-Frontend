<template>
  <div class="pt-4">
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
    <div :class="{fade : loading }">
      <div v-if="!wooForms" v-html="wooForm"></div>
      <div v-if="wooForms">
        <b-tabs content-class="">
          <b-tab title="Application survey" active><div class="pt-4" v-html="wooForms[0]"></div></b-tab>
          <b-tab title="Interview Survey"><div class="pt-4" v-html="wooForms[1]"></div></b-tab>
        </b-tabs>
      </div>
                      
     <!-- <h6 class="mb-2">Current Score: {{ score}} </h6>
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
      <b-button variant="primary" size="sm" class="float-right"@click="submitSurvey()">Save</b-button>  -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
// Vue.forceUpdate();

export default {
	name: 'piSurvey',
  props: ['organization', 'candidate', 'survey', 'user'],
  watch: {
    candidate: function(newVal, oldVal) {
       // this.$forceUpdate();
      // this.wooForm =  this.wooform
      // this.wooForm()
      // this.wooForms()
      this.wooForm =   this.organization.wooform
      this.wooForms =  this.organization.wooForms
      // this.wooForm.wooform =  this.organization.wooform
      // this.wooForms.wooForms =  this.organization.wooForms
      this.backdoor++
      // let frame = document.getElementsByTagName("iframe");
      // frame = Array.prototype.slice.call( frame )

      // console.log(frame)
      // if(Array.isArray(frame)) {
      //   console.log("IS ARRAY")
      //   let x
      //   for(x in frame)
      //     console.log(frame[x])
      //     frame[x].src = frame[x].src
      // }
      // else {
      //   frame.src = frame.src
      // }
      // console.log(newVal, oldVal)
      if(newVal) {
        // Vue.forceUpdate();
        // this.$forceUpdate();
      }
    }
  },
	data() {
    	return {
        loading: false,
        values: [],
        score: 0,
        comments: [],
        backdoor: 0,
        wooForm: null,
        wooForms: null,
      }
  	},
  	components: {},
    computed: {
      // wooForm() {
      //   this.backdoor
      //   if('wooform' in this.organization) {
      //     console.log("WOO FORM")
      //     console.log(this.organization.wooform)
      //     return this.organization.wooform
      //   }
      //   else {
      //     alert("NO WOO FORM")
      //     return "<h1>No Form</h1>"
      //   }
      // },
      // wooForms() {
      //   this.backdoor
      //   if('wooForms' in this.organization) {
      //     console.log("WOO FORMS")
      //     console.log(this.organization.wooForms)
      //     return this.organization.wooForms
      //   }
      //   else {
      //     alert("NO WOO FORMS")
      //     return "<h1>No Form</h1>"
      //   }
      // },
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
        // this.score = this.values.reduce((a, b) => a + b, 0)
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
      // candidateUpdate(){
      //   let candidate = this.candidate
      //   candidate.interview_score = (this.score + candidate.interview_score)
      //   candidate.rank = (this.score + candidate.rank)
      //   if(candidate.comments) {
      //     candidate.comments = candidate.comments.concat(this.comments)
      //     // console.log(candidate.comments, this.comments)
      //   }
      //   else {
      //      candidate.comments = this.comments
      //   }
      //   return candidate
      // },
      candidateUpdate(){
        // ADD NEW SURVEY LOGIN HERE
        let candidate = this.candidate
        let survey = this.survey
        let x
        let arr = []
        if('interview-surveys' in candidate) {
          let surveys  = this.candidate['interview-surveys']
        }
        else {
          this.candidate['interview-surveys'] = []
          let surveys  = this.candidate['interview-surveys']
        }
        for(x in survey.questions) { 
           if(survey.questions[x].type === "Range") {
            let s = {
              text: survey.questions[x].text,
              value: survey.questions[x].state
            }
           }
        }
        // candidate.interview_score = (this.score + candidate.interview_score)
        // candidate.rank = (this.score + candidate.rank)
        if(candidate.comments) {
          candidate.comments = candidate.comments.concat(this.comments)
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
          console.log(candidate['interview-surveys'])
          // this.$emit("updateCandidate", candidate)
          this.loading = false
          // this.$emit("closeSurvey")
        }
        else {
          alert("Please fill in all values")
          this.loading = false
        }
      }
    }
};
</script>
<style scoped lang="scss">
  
</style>