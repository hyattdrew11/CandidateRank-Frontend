
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
import * as serviceAPI from "@/api";
import LINKS from "@/utils/constants/links";
import MESSAGES from "@/utils/constants/messages";
import { checkValidPassword } from "@/utils/helpers/validation";

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
  components: {},
  methods: {
    validateForm() {
      if (this.password.length < 8) {
        this.errorMsg = MESSAGES.PASSWORD_LENGTH_VALIDATION_ERROR;
        return;
      }

      if (!checkValidPassword(this.password)) {
        this.errorMsg = MESSAGES.PASSWORD_SPECIAL_CHARACTER_VALIDATION_ERROR;
        return;
      }

      this.reset();
    },
    reset() {
      const params = {
        password: this.password,
        email: this.email,
        reset_link: this.reset_link,
      };

      serviceAPI
        .updatePassword(params)
        .then(({ data }) => {
          alert(MESSAGES.UPDATE_PASSWORD_SUCCESS);
          window.location.href = LINKS.LOGIN.HREF;
        })
        .catch(function (e) {
          alert(MESSAGES.UPDATE_PASSWORD_ERROR);
        });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
