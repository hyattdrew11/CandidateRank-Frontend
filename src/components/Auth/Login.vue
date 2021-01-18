<!-- components/Login.vue -->
<template>
  <div>
    <img height="135" class="login-logo" src="img/logo/cr-logo-white.png" />
    <div class="container-fluid">
      <b-row id="login" align-v="center" align-h="center"  no-gutters>
        <b-col sm="12" md="4" lg="4">
          <b-card>
            <h5>Candidate Rank Login</h5>
            <hr />
            <b-form-group label="Email address:">
              <b-form-input
                v-model="email"
                placeholder="Enter your email"
                trim
                type="email"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Password:">
            <b-form-input
              v-model="password"
              placeholder="Enter your password"
              trim
              type="password"
              @keyup.enter="authenticate()"
            ></b-form-input>
          </b-form-group>
            <hr />
            <p v-if="errorMsg" class="tx-12 red wt-600">{{ errorMsg }}</p>
                <router-link class="tx-14 wt-500 gray mr-2" :to="{ name: 'Home'}">
                <!-- <i class="fa fa-question-circle"></i> -->
                &bull; Home
                </router-link>
               <!--  <router-link class="tx-14 wt-500 gray mr-2" :to="{ name: 'Register'}">
                • Sign Up
                </router-link> -->
            <b-button size="sm" class="mr-1 float-right bg-green white" variant="outline-secondary" @click="authenticate">Login</b-button>
          </b-card>
           <router-link class="tx-12 white float-left mt-2 ml-1" :to="{ name: 'Terms'}">
            <!-- <i class="fa fa-info-circle"></i> -->
          Terms of service
          </router-link>
          <router-link class="tx-12 white float-right mt-2" :to="{ name: 'Reset'}">&bull; Reset password  </router-link>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Navigation from '../Navigation/Navigation.vue';
import { EventBus } from '@/utils'

export default {
  data () {
    return {
      email: '',
      password: '',
      errorMsg: null,
    }
  },
  components: {
    Navigation
  },
  methods: {
    authenticate () {
      this.$store.dispatch('login', { email: this.email, password: this.password })
    }
  },
  mounted () {
    EventBus.$on('failedAuthentication', (msg) => { this.errorMsg = msg })
  },
}
</script>

<style scoped lang="scss">
  .login-logo {
    position: fixed;
    top: 25px;
    left: 30px;
}
</style>
