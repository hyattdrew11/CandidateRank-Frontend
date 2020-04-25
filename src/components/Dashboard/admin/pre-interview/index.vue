<template>
	<div class="container-fluid">
          <b-row no-gutters>
             <b-col sm="7">
               <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
               <b-form-input v-model="text" placeholder="Search Candidates"></b-form-input>
            </b-col>
            <b-col sm="5"></b-col>
            <b-col sm="12">
              <hr />
             <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th v-for="(x, index) in fields" scope="col" @click="sort(index,  x.order)">
                      {{ x.name }} 
                        <i v-if=" x.order == null" class="fa fa-sort float-right gray"></i>
                        <i v-if=" x.order == 'asc'" class="fa fa-caret-up float-right"></i>
                        <i v-if=" x.order == 'desc'" class="fa fa-caret-down float-right"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(x, index) in candidates">
                      <td>{{ x.rank }}</td>
                      <td class="pointer wt-600" @click="candidateDetails(x)">
                        <img class="profile-sm" :src="x.picture" />
                        {{ x['First Name'] }} {{ x['Last Name'] }}
                      </td>
                      <td>{{ x['Medical School of Graduation'] }}</td>
                      <td>{{ x['USMLE Step 1 Score'] }}</td>
                      <td>{{ x['USMLE Step 2 CK Score'] }}</td>

                   <!--    <td class="text-center">
                        <b-button @click="openSurvey(x.uuid)" size="sm" variant="primary" squared class="">Survey</b-button>
                      </td> -->

                      <td class="text-center">
                        <!-- <b-button @click="openSurvey(x)" size="sm" variant="primary" squared class="">Start</b-button> -->
                      </td>
                  </tr>
                </tbody>
              </table>
            </b-col>
          </b-row>
	</div>
</template>

<script>
export default {

  name: 'PreInterview',
  props: ["user","candidates","surveys","faculty"],
  data () {
    return {
    	text: null,
    	fields : [
        {
           'name':'Rank',
           'order': null,
         },
         {
            'name' : 'Applicant', 
            'order': null,
          },
          {
            'name': 'Medical School',
            'order': null,
          },
          {
            'name':'USMLE 1',
            'order': null,
          },
          {
            'name':'USMLE 2', 
            'order': null,
          },
          // {
          //   'name':'Survey', 
          //   'order': null,
          // },
          {
            'name':'Application',
            'order': null,
          }
        ],

    }
  }
}
</script>

<style lang="css" scoped>
</style>