
<template>
  <div>
    <Logo :height="115" :isLogin="true" />
    <div class="container-fluid">
      <b-row id="login" align-v="center" align-h="center" no-gutters>
        <b-col sm="12" md="4" lg="4" class="p-3 p-md-0">
          <b-card>
            <h5>Candidate Rank Login</h5>
            <hr />
            <b-form-group label="Email address:">
              <b-form-input
                trim
                type="email"
                placeholder="Enter your email"
                v-model="email"
              />
            </b-form-group>
            <b-form-group label="Password:">
              <b-form-input
                trim
                type="password"
                placeholder="Enter your password"
                v-model="password"
                @keyup.enter="authenticate()"
              />
            </b-form-group>
            <hr />
            <p v-if="errorMsg" class="tx-12 red wt-600">
              {{ errorMsg }}
            </p>
            <router-link
              class="tx-14 wt-500 gray mr-2"
              :to="{ name: LINKS.HOME.TITLE }"
            >
              &bull; Home
            </router-link>
            <b-button
              size="sm"
              class="mr-1 float-right bg-green white"
              variant="outline-secondary"
              @click="authenticate"
            >
              Login
            </b-button>
          </b-card>
          <router-link
            class="tx-12 white float-left mt-2 ml-1"
            :to="{ name: LINKS.TERMS_OF_SERVICE.TITLE }"
          >
            Terms of service
          </router-link>
          <router-link
            class="tx-12 white float-right mt-2"
            :to="{ name: LINKS.RESET.TITLE }"
          >
            &bull; Reset password
          </router-link>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo";
import { EventBus } from "@/utils";
import LINKS from "@/utils/constants/links";

export default {
  name: "Login",
  created() {
    this.LINKS = LINKS;
  },
  data() {
    return {
      email: "",
      password: "",
      errorMsg: null,
    };
  },
  components: {
    Logo,
  },
  methods: {
    authenticate() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
  },
  mounted() {
    EventBus.$on("failedAuthentication", (msg) => {
      this.errorMsg = msg;
    });
  },
};
</script>