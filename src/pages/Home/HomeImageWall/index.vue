<template>
  <b-container fluid>
    <b-row no-gutters>
      <b-col
        md="12"
        id="home-header"
        class="text-center pt-4"
        style="background-image: url('img/background/header.jpg')"
      >
        <Logo :height="175" />
        <h1 id="tagline" class="white">CandidateRank</h1>
        <h3 class="white">
          FULLY AUTOMATED & INTEGRATED RESIDENT <br />
          FELLOW INTERVIEW PROCESS
        </h3>
        <b-button
          v-bind:href="LINKS.APPLICANT.HREF"
          variant="outline-secondary"
          class="mr-1 bg-green white"
        >
          Applicants
        </b-button>
        <b-button
          v-bind:href="LINKS.LOGIN.HREF"
          variant="outline-secondary"
          class="mr-1 bg-green white"
        >
          Interviewers
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Logo from "@/components/Logo";
import LINKS from "@/utils/constants/links";

export default {
  name: "HomeImageWall",
  created() {
    this.LINKS = LINKS;
  },
  components: {
    Logo,
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>