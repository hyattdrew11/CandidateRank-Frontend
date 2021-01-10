<template>
  <div>
    <i
      id="loader"
      v-if="loading"
      class="fa fa-spinner fa-pulse fa-3x fa-fw text-info"
      aria-hidden="true"
    />
    <h1 class="mb-0 p-4 tx-18 wt-400">Zoom Authentication</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import * as zoomAPI from "@/api/zoom-api";
import LINKS from "@/utils/constants/links";

export default {
  name: "ZoomRedirect",
  data() {
    return {
      zoom_code: this.$route.query.code,
      email: this.$route.query.state,
      loading: true,
      message: "",
    };
  },
  components: {},
  mounted() {
    this.checkZoomCode(this.zoom_code);
  },
  methods: {
    checkZoomCode(code) {
      if (code === undefined) {
        alert(
          "There seems to be a problem with Zoom. Please go back to Candidate Rank and try again."
        );
        this.$router.push(LINKS.DASHBOARD.HREF);
      } else {
        this.authenticateZoom();
      }
    },
    async authenticateZoom() {
      const self = this;
      try {
        const params = {
          code: this.zoom_code,
          email: this.email,
        };

        await zoomAPI.zoomAuth(params);
        self.loading = false;
        self.$router.push(LINKS.LOGIN.HREF);
      } catch (error) {
        self.loading = true;
        self.message = error;
        alert(
          "There seems to be a problem with Zoom. Please go back to Candidate Rank and try again."
        );
        self.$router.push(LINKS.DASHBOARD.HREF);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>