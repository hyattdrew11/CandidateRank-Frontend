<template>
  <div>
    <Navigation />
    <div id="zoom-deactivate">
      <b-container>
        <b-row>
          <b-col sm="12" offset-md="2" md="8" offset-lg="3" lg="6">
            <b-card>
              <h1 class="mb-0 p-4 tx-18 wt-400">
                Candidate Rank Zoom Integration Deactivate
              </h1>
              <p>
                You have uninstalled Candidate Rank Zoom Integration
                <a v-bind:href="ZOOM_REDIRECT_URL">
                  click here to reinstall the application.
                </a>
              </p>
              <p>
                <a target="_blank" v-bind:href="`mailto:${SUPPORT_EMAIL}`">
                  Questions or Support email {{ SUPPORT_EMAIL }}
                </a>
              </p>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import { SUPPORT_EMAIL } from "@/utils/constants/contact";
import { ZOOM_REDIRECT_URL } from "@/utils/constants/common";

export default {
  name: "ZoomDeactivate",
  created() {
    this.SUPPORT_EMAIL = SUPPORT_EMAIL;
    this.ZOOM_REDIRECT_URL = ZOOM_REDIRECT_URL;
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
#zoom-deactivate {
  margin-top: 105px;
  width: 100%;
  text-align: center;
}
</style>
