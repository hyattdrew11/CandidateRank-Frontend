<template>
  <div>
    <Navigation />
    <div id="tos">
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6">
          <b-card>
            <h1 class="mb-0 p-4 tx-18 wt-400">
              Terms of service • Privacy Policy
            </h1>
            <p>
              Candidate Rank conforms to the highest privacy standards. The
              service we provide is facilitating interview schedule managment
              integrated with
              <a href="https://zoom.com">Zoom Video Conferencing</a>, and not
              the selling of our user's data. All user data is protected in
              transit and at rest, is the sole property of the user, and is
              available upon request to support.
            </p>
            <p>
              <a target="_blank" v-bind:href="`mailto:${SUPPORT_EMAIL}`">
                Questions or Support email {{ SUPPORT_EMAIL }}
              </a>
            </p>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import { SUPPORT_EMAIL } from "@/utils/constants/contact";

export default {
  name: "TermsOfService",
  created() {
    this.SUPPORT_EMAIL = SUPPORT_EMAIL;
  },
  data() {
    return {};
  },
  components: {
    Navigation,
  },
};
</script>

<style lang="scss" scoped>
#tos {
  margin-top: 150px;
  width: 100%;
  text-align: center;
}
</style>
