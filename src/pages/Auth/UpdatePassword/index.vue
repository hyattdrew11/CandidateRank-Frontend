
<template>
  <div>
    <div class="container-fluid">
      <b-row id="login" align-v="center" align-h="center" no-gutters>
        <b-col sm="12" md="4" lg="4">
          <b-card>
            <h5>Candidate Rank Update Password</h5>
            <hr />
            <b-form-group label="Password:">
              <b-form-input
                v-model="password"
                placeholder="Enter your password"
                trim
                type="password"
                @keyup.enter="authenticate()"
              />
            </b-form-group>
            <hr />
            <p v-if="errorMsg" class="tx-12 red wt-600">{{ errorMsg }}</p>
            <router-link
              class="tx-14 wt-500 gray mr-2"
              :to="{ name: LINKS.HOME.TITLE }"
            >
              &bull; Home
            </router-link>
            <router-link
              class="tx-14 wt-500 gray mr-2"
              :to="{ name: LINKS.LOGIN.TITLE }"
            >
              • Login
            </router-link>
            <b-button
              size="sm"
              class="mr-1 float-right bg-green white"
              variant="outline-secondary"
              @click="validateForm()"
            >
              Reset
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL;
import axios from "axios";
import LINKS from "@/utils/constants/links";

export default {
  name: "UpdatePassword",
  created() {
    this.LINKS = LINKS;
  },
  data() {
    return {
      loading: true,
      email: this.$route.params.email,
      reset_link: this.$route.params.reset_link,
      password: null,
      errorMsg: null,
    };
  },
  components: {
    axios,
  },
  methods: {
    validateForm() {
      // CHECK ALL PASSWORDS MATCH
      let validated = false;
      function isValid(str) {
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
      }
      if (this.password.length < 8) {
        this.errorMsg =
          "Password must be longer than 7 letters and include a special character.";
        return;
      } else if (isValid(this.password)) {
        this.errorMsg = "Password is must contain a special character.";
        return;
      }
      this.reset();
    },
    reset() {
      let input = {
        password: this.password,
        email: this.email,
        reset_link: this.reset_link,
      };
      // console.log(input)
      let vm = this;
      axios
        .post(API_URL + "/auth/password_update/", input)
        .then(({ data }) => {
          alert("Password updated, please login.");
          window.location.href = "/login";
        })
        .catch(function (e) {
          alert("Error resetting password. Please contact your administrator.");
        });
    },
  },
};
</script>

<style scoped lang="scss">
.login-logo {
  position: fixed;
  top: 25px;
  left: 30px;
}
</style>
