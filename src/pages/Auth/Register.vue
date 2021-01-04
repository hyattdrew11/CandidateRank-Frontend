<!-- components/Login.vue -->
<template>
  <div>
    <Navigation />
    <div class="container-fluid">
      <b-row id="register" align-v="center" align-h="center"  no-gutters>
        <b-col sm="12" md="5" lg="5">
          <b-card>
            <h5>Candidate Rank Account Registration</h5>
            <hr />
            <span class="tx-14 wt-600 gray">
              You must have an active Zoom account to register for Candidate Rank. You can create a Zoom account<a target="_blank" href="https://zoom.com"> here</a>
            </span>
            <br />
            <hr />
            <b-row>
                <b-col sm="12" md="6" lg="6">
                <b-form-group label="First name:">
                  <b-form-input
                    v-model="form.firstname"
                    placeholder="Enter your first name"
                    trim
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>
                <b-col sm="12" md="6" lg="6">
                <b-form-group label="Last name:">
                  <b-form-input
                    v-model="form.lastname"
                    placeholder="Enter your last name"
                    trim
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="6" lg="6">
                <b-form-group label="Email address:">
                  <b-form-input
                    v-model="form.email"
                    placeholder="Enter your email"
                    trim
                    type="email"
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="6" lg="6">
                <b-form-group label="Organization:">
                  <b-form-input
                    v-model="form.organization"
                    placeholder="Enter your email"
                    trim
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="6" lg="6">
                <b-form-group label="Password:">
                  <b-form-input
                    v-model="form.password"
                    placeholder="Enter your password"
                    trim
                    type="password"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="6" lg="6">
                <b-form-group label="Repeat Password:">
                  <b-form-input
                    v-model="form.password2"
                    placeholder="Enter your password"
                    trim
                    type="password"
                  ></b-form-input>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="12" lg="12">
                <hr />
                <p v-if="errorMsg" class="tx-12 red wt-600">{{ errorMsg }}</p>
                <router-link class="tx-12 gray mr-2" :to="{ name: 'Support'}">
                <i class="fa fa-question-circle"></i> Help
                </router-link>
                <router-link class="tx-12 gray mr-2" :to="{ name: 'Login'}">
                <i class="fa fa-user"></i> Login
                </router-link>
                <b-button 
                    size="sm"
                    class="mr-1 float-right"
                    variant="primary"
                    @click="validateForm(form)">Register
                </b-button>
              </b-col>
            </b-row>
          </b-card>
          <router-link class="tx-10  white float-right mt-2" :to="{ name: 'Terms'}">
            <i class="fa fa-info-circle"></i> Terms of service
          </router-link>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import { EventBus } from '@/utils'

export default {
  data () {
    return {
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
  components: {
    Navigation
  },
  methods: {
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
    register () {
      this.$store.dispatch('register', this.form)
    }
  },
  mounted () {
    EventBus.$on('registered', (msg) => { 
      alert(msg)
      this.$router.push('/login')
    })
    EventBus.$on('failedRegistering', (msg) => { this.errorMsg = msg })
  },
  beforeDestroy () {
    EventBus.$off('failedRegistering')
    EventBus.$off('failedAuthentication')
  }
}
</script>

<style lang="scss"></style>