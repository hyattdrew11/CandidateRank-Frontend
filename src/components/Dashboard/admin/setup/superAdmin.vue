<template>
  <div class="container-fluid">
    <div v-if="organizations">
      <h2>
        All Organizations
        <b-button size="sm" class="float-right ml-1" disabled v-b-modal.register-modal variant="success">Create New Account</b-button>
        <b-button size="sm" class="float-right ml-1" v-b-modal.admin-user-modal variant="primary">Login as user</b-button>
      </h2>
      <register></register>
      <userLogin :users="users"></userLogin>
      <br />
       <input
          v-model="search" 
          type="text" 
          class="form-control" 
          placeholder="Search"
        >
        <hr />
        <div v-for="(x, index) in sortedOrganizations">
          <b-row>
            <b-col sm="12">
              <b-card class="mb-1">
                <h3 class="wt-500">{{ x.name.toUpperCase() }}</h3>
                <hr />
                <div  v-for="(t, index) in x.terms">

                  <h4 class="wt-500">Department Name: {{ t.department }} {{ t.year }}</h4>

                   <div v-for="(d, index) in t.dates" class="mb-3">

                    <h5 class="wt-500">Interview Date: {{ d.startDate }}</h5>
                    <hr />

                    <b-row v-if="d.rooms.length > 1">
                      <b-col sm="12" md="2" class="wt-500 tx-16">Room</b-col>
                      <b-col sm="12" md="3" class="wt-500 tx-16">Candidate</b-col>
                      <b-col sm="12" md="1" class="wt-500 tx-16">Time</b-col>
                      <b-col sm="12" md="2" class="wt-500 tx-16">Zoom User</b-col>
                    </b-row>

                    <b-row v-else>
                      <b-col sm="12" md="12" class="wt-500 tx-16">No rooms setup</b-col>
                    </b-row>

                    <hr />

                     <div v-for="(r, index) in d.rooms">
                       <div v-for="(e, index) in r.events">
                          <b-row v-if="'zoomUser' in e">
                            <b-col sm="12" md="2">{{ r.name }}</b-col>
                            <b-col sm="12" md="3">{{ e.candidate['Applicant Name'] }}</b-col>
                            <b-col sm="12" md="1">{{ e.time }}</b-col>
                            <b-col sm="12" md="3">{{ e.zoomUser.email }}</b-col>
                          </b-row>
                        </div>
                      </div>

                      <hr />
                   </div>
                </div>
              </b-card>
            </b-col>
          </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import register from '../superAdmin/register.vue';
import userLogin from '../superAdmin/users.vue';

// USE JS DATE FUNCTION TO GET ARRAY OF YEARS
const currentYear = (new Date()).getFullYear();
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'superAdmin',
  props: ["organization","user","candidates","surveys","faculty", "currentTerm", "showHome"],
  watch: {
    organization: function(newVal, oldVal) {
      if(newVal) {
        this.organization = newVal
      }
    },
  },
	data() {
    	return {
        loading:        false,
        organizations:  null,
        users:          null,
        search:         ''
      }
  	},
    computed: {
      sortedOrganizations() {
         return this.organizations
          ? this.organizations.filter(
                  item => item.name.toLowerCase().includes(this.search.toLowerCase())
            )
          : this.organizations

      },
    },  
  	components: {
      axios,
      register,
      userLogin
    },
    mounted() {
      this.getOrgs()
    },
  	methods: { 
       getOrgs() {
        console.log("SUPER ADMIN GET ALL USERS AND ORGANIZATIONS")
        this.loading = true
         axios.get( API_URL+'/organization/admin')
          .then(({ data }) => { 
              console.log(data)
              this.organizations  = data.orgs
              this.users          = data.users
              this.loading        = false
          })
      }
    }
};
</script>
<style scoped lang="scss">
</style>