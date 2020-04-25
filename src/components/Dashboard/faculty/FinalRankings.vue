<template>
   <div id="faculty-tabs-container">
          <b-row>
            <b-col sm="4">
               <b-form-input v-model="text" placeholder="Search Candidates"></b-form-input>
            </b-col>
            <b-col sm="3">
              <b-form-select v-model="selected" :options="doctors"></b-form-select>
            </b-col>
            <b-col sm="5"></b-col>
            <b-col sm="12" class="mt-2">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th v-for="(x, index) in fields" scope="col">{{ x }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(x, index) in candidates">
                      <td></td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
        </div>
</template>

<script>

export default {
	name: 'FinalRankings',
	data() {
    	return {
        text: null,
        selected: 'Doogie Houser',
        doctors: ['Doogie Houser', 'Will Nichols', 'Sam Peeples', 'Walter Jones'],
        fields : ['Rank', 'Applicant', 'Medical School', 'USMLE 1','USMLE 2', 'Survey', 'Application'],
        candidates: [],
      }
  	},
  	components: {},
  	methods: {}
};
</script>
<style scoped lang="scss"></style>