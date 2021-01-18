<template>
  <div>
    <Navigation />
    <i
      id="loader"
      v-if="loading"
      class="fa fa-spinner fa-pulse fa-3x fa-fw text-info"
      aria-hidden="true"
    />
    <div :class="{ fade: loading }">
      <HomeImageWall />
      <div class="steps-header" />
      <HomeSteps />
      <div id="learn-more" class="header-title">
        <h4 class="white text-center">
          MANAGING THER DATA THAT DRIVES YOUR DECISIONS
        </h4>
      </div>
      <b-container fluid class="">
        <b-row no-gutters>
          <img
            alt="step-guide"
            src="img/step/step-guide.png"
            class="step-guide"
          />
        </b-row>
      </b-container>
      <div class="steps-header" />
      <HomeGuides />
      <HomeFooter />
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import HomeImageWall from "./HomeImageWall";
import HomeSteps from "./HomeSteps";
import HomeGuides from "./HomeGuides";
import HomeFooter from "./HomeFooter";

export default {
  name: "Home",
  data() {
    return {
      loading: true,
    };
  },
  components: {
    Navigation,
    HomeSteps,
    HomeGuides,
    HomeImageWall,
    HomeFooter,
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {},
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>