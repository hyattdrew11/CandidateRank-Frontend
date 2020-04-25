<!-- components/Login.vue -->
<template>
  <div>
    <Navigation />
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
            <router-link class="tx-12 gray mr-2" :to="{ name: 'Login'}">
                <!-- <i class="fa fa-question-circle"></i> -->
                • Help
                </router-link>
                <router-link class="tx-12 gray mr-2" :to="{ name: 'Register'}">
                <!-- <i class="fa fa-user"></i> -->
                • Register
                </router-link>
            <b-button size="sm" class="mr-1 float-right" variant="primary" @click="authenticate">Login</b-button>
          </b-card>
           <router-link class="tx-10 gray float-right mt-2" :to="{ name: 'Terms'}">
            <!-- <i class="fa fa-info-circle"></i> -->
          • Terms of service
          </router-link>
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
      .then(() => this.$router.push('/'))
    }
  },
  mounted () {
    EventBus.$on('authenticated', (msg) => { this.$router.push('/') })
    EventBus.$on('failedAuthentication', (msg) => { this.errorMsg = msg })
  },
  beforeDestroy () {
    EventBus.$off('failedAuthentication')
  }
}
</script>

<style lang="scss"></style>
