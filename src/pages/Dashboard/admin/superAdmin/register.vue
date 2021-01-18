<template>
  <div>
    <b-modal size="lg" id="register-modal" title="Register New Account" hide-footer>
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
      <b-button 
          size="sm"
          class="mr-1 float-right"
          variant="primary"
          @click="validateForm(form)">Register
      </b-button>
    </b-col>
  </b-row>
</b-modal>
</div>
</template>
<script>
import { EventBus } from '@/utils'

export default {
  name: 'register',
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