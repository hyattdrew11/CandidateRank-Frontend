<template>
  <b-container fluid>
    <b-row no-gutters>
      <b-col
        md="12"
        id="home-header"
        class="text-center pt-4"
        style="background-image: url('img/background/header.jpg')"
      >
        <img height="175" class="" src="img/logo/cr-logo-white.png" />
        <h1 id="tagline" class="white">CandidateRank</h1>
        <h3 class="white">
          FULLY AUTOMATED & INTEGRATED RESIDENT <br />
          FELLOW INTERVIEW PROCESS
        </h3>
        <b-button
          href="/applicant"
          variant="outline-secondary"
          class="mr-1 bg-green white"
        >
          Applicants
        </b-button>
        <b-button
          href="/login"
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
export default {
  name: "HomeImageWall"
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>