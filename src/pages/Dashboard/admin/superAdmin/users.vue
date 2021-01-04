<template>
  <div>
    <b-modal size="xl" id="admin-user-modal" title="Login As A User" hide-footer>
    <b-row>
      <b-col sm="12" md="12" lg="12">
        <b-card>
           <label class="tx-12 wt-600 dark-gray">Search Users:</label>
            <input v-model="search"  type="text"  class="form-control"  placeholder="Search">
             <hr />
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="tx-12 wt-600" scope="col">Organization</th>
                    <th class="tx-12 wt-600" scope="col">Email</th>
                    <th class="tx-12 wt-600" scope="col">First Name</th>
                    <th class="tx-12 wt-600" scope="col">Last Name</th>
                    <th class="tx-12 wt-600" scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr  v-for="(x, index) in sortedUsers" >
                    <th class="tx-12 wt-600" scope="row">{{ x.Organization.toUpperCase() }}</th>
                    <td class="tx-12 wt-600" >{{ x.email }}</td>
                    <td class="tx-12 wt-600" >{{ x.first_name }}</td>
                    <td class="tx-12 wt-600" >{{ x.last_name }}</td>
                    <td>
                      <b-button size="sm" variant="primary" class="float-right" @click="changeUser(x)">login</b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </b-card>
      </b-col>
  </b-row>
</b-modal>
</div>
</template>
<script>
import { EventBus } from '@/utils'

export default {
  name: 'register',
  props: ["users"],
  data () {
    return {
      newUser: null,
      search: '',
      form: {
        firstname:'',
        lastname: '',
        email: '',
        organization: null,
        cc: '',
        ccexp: '',
        cvv: '',
        password: null,
        password2: null,
      },
      selected: null,
      organizations: [],
      errorMsg: null
    }
  },
  computed: {
      sortedUsers() {
        let usx =  this.users.sort(
            function(a, b) {          
              if (a.Organization === b.Organization) {
                return b.email - a.email;
              }
              return a.email > b.email ? 1 : -1;
          })

        return usx
          ? usx.filter(
                  item => item.email.toLowerCase().includes(this.search.toLowerCase())
            )
          : this.usx
      }

  },  
  components: {},
  methods: {
    changeUser(user) {
      this.newUser = user
      this.$store.dispatch('loginAS', { email: this.newUser.email, password: this.newUser.password })
    },
    validateForm(form) {
      // CHECK ALL PASSWORDS MATCH
      let validated = false
      function isValid(str){
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
      }
      if(form.password !== form.password2) {
        this.errorMsg = 'Passwords do not match.'
        return
      }
      else if(form.password.length < 8) {
        this.errorMsg = 'Password must be longer than 7 letters and include a special character.'
        return
      }
      else if(form.firstname.length < 3 || form.firstname.length < 3 || form.organization.length < 3 ) {
        this.errorMsg = 'Please enter a first, last name, and organization.'
        return
      }
      else if( isValid(form.password) ) {
        this.errorMsg = 'Password is must contain a special character.'
        return
      }
      form.organization = form.organization.toLowerCase()
      form.email        = form.email.toLowerCase()
      this.register()
    },
  },
  mounted () {},
}
</script>

<style lang="scss"></style>