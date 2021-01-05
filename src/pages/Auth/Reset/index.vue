<!-- components/Login.vue -->
<template>
  <div>
    <i
      id="loader"
      v-if="loading"
      class="fa fa-spinner fa-pulse fa-3x fa-fw text-info"
      aria-hidden="true"
    ></i>
    <div :class="{ fade: loading }">
      <Logo :height="135" :isLogin="true" />
      <div class="container-fluid">
        <b-row id="login" align-v="center" align-h="center" no-gutters>
          <b-col sm="12" md="4" lg="4">
            <b-card v-if="attempts < 3">
              <h5>Candidate Rank Password Reset</h5>
              <hr />
              <b-form-group label="Email address:">
                <b-form-input
                  v-model="email"
                  placeholder="Enter your email"
                  trim
                  type="email"
                />
              </b-form-group>
              <hr />
              <p v-if="errorMsg" class="tx-12 red wt-600">{{ errorMsg }}</p>
              <p class="fw" style="height: 100px">
                <vue-recaptcha
                  class="mt-2"
                  ref="recaptcha"
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired"
                  sitekey="6Ld4AdoZAAAAAGAPqrxgzO2DO2E5AWfx8-D9xar7"
                  :loadRecaptchaScript="true"
                />
              </p>
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
            </b-card>
            <h5 v-if="attempts >= 3" class="white text-center">
              You have failed to provide a valid email address and have been
              locked out.
            </h5>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL;
import axios from "axios";
import VueRecaptcha from "vue-recaptcha";
import Logo from "@/components/Logo";
import LINKS from "@/utils/constants/links";

export default {
  name: "Reset",
  created() {
    this.LINKS = LINKS;
  },
  data() {
    return {
      email: "",
      errorMsg: null,
      attempts: 0,
      loading: false,
    };
  },
  components: {
    axios,
    VueRecaptcha,
    Logo,
  },
  methods: {
    reset() {
      let input = {
        email: this.email,
      };
      let vm = this;
      this.loading = true;
      this.$refs.recaptcha.execute();
      // axios.post( API_URL+'/auth/password_reset/', input)
      // .then(({data}) => {
      //   // console.log(data)
      //   alert("Please check your email address for a password reset link.")
      // })
      // .catch(function (e) {
      //   vm.attempts++
      //   vm.errorMsg = "We do not recognize that email address please try again."
      // })
    },
    onCaptchaVerified: function (recaptchaToken) {
      this.loading = true;
      const self = this;
      self.status = "submitting";
      self.$refs.recaptcha.reset();
      let input = {
        email: this.email,
        recaptchaToken: recaptchaToken,
      };
      axios
        .post(API_URL + "/auth/password_reset/", input)
        .then(({ data }) => {
          this.loading = false;
          alert("Please check your email address for a password reset link.");
          window.location.reload();
        })
        .catch(function (e) {
          self.attempts++;
          self.errorMsg = "There was an error, please try again.";
          self.loading = false;
        });
    },
    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>
