<template>
	<div id="admin-ranking-container" class="mt-3">
    <b-row>
       <b-col sm="6">
         <label class="tx-12 wt-600 dark-gray">Search Candidates:</label>
         <b-form-input v-model="text" placeholder="Search Candidates"></b-form-input>
      </b-col>
      <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Ranking Type:</label>
        <b-form-select v-model="rankingType" :options="rankingTypes"></b-form-select>
      </b-col>

       <b-col sm="3">
        <label class="tx-12 wt-600 dark-gray">Choose Year:</label>
        <b-form-select v-model="year" :options="priorYears" @change="getCandidates(year)"></b-form-select>
      </b-col>

      <b-col sm="5"></b-col>
      <b-col sm="12">
        <hr />
        <table id="PreInterviewRankings" class="table table-bordered table-hover">
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
                <td>{{ index }}</td>
                <td class="pointer wt-600" @click="candidateDetails(x)">
                  <!-- <img class="profile-sm" :src="x.picture" /> -->
                   {{ x['First Name'] }} {{ x['Last Name'] }}
                </td>
                <td>{{ x.interview.status }}</td>
                <td class="td-int">{{ x.survey_1.status }}</td>
                <td class="td-int">{{ x.survey_2.status }}</td>
                <td class="td-int">
                   <b-button size="sm" variant="primary" squared class="">View</b-button>
                </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row> 
  </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL


export default {

  name: 'index',
  props: ['organization', 'user', 'candidates', 'faculty'],
   watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    }
  },
  data() {
      return {
        text: null,
        year: null,
        rankingTypes: ['Pre-Interview', 'Interview', 'Dynamic List'],
        rankingType: '',
        fields: [
          {
            "name": "Rank",
            "order": null,
            },
          {
            "name": "Applicant",
            "order": null,
            },
          {
            "name": "Interview",
            "order": null,
            },
          {
            "name": "Pre-Interview Surevey",
            "order": null,
            },
          {
            "name": "Interview Survey",
            "order": null,
          },
          {
            "name": "Application",
            "order": null,
          }
        ],
      }
    },
    components: {},
    computed: {
      priorYears() {
        let x
        let terms = this.organization.terms
        let years = []
        for(x in terms) { years.push(terms[x].year) }
        this.year = years[0]
        return years
      }
    },
    mounted() {},
    methods: {
        sort(index, order) {
          if(order == null) {
            this.fields[index].order = 'desc'
          }
          if(order == 'asc') {
            this.fields[index].order = 'desc'
          }
          if(order == 'desc') {
            this.fields[index].order = 'asc'
          }
          console.log(this.fields[index])
        },
        getCandidates(year) {
          let org = this.user.Organization
          window.axios.get(API_URL+'/candidate/all/'+org+'/'+year)
          .then(({ data }) => {
            console.log(data[0])
            let x 
            for(x in data)
              this.candidates.push(data[x])
          })
          .catch(function (e) {
              alert('Error loading search candidates, please refresh.')
          })
      },
    }
};
</script>

<style lang="scss" scoped>
  #admin-ranking-container {
    width: 99%;
    padding: 15px;
  }
  #PreInterviewRankings th {
    font-size: 10px;
  }
   #PreInterviewRankings td {
    font-size: 12px;
    padding: 5px 15px 5px 15px;
    vertical-align: middle;
  }
  #PreInterviewRankings td:nth-child(2)  {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #PreInterviewRankings td:last-child {
     width: 300px;
  }
  .profile-sm {
    display: inline-block;
    border-radius: 100%;
    height: 35px;
    width:  auto;
    margin-right: 10px;
  }
</style>