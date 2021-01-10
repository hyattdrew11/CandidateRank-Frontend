<template>
  <div>
    <Navigation />
    <div id="learning">
      <b-container>
        <b-row>
          <b-col sm="12" offset-md="2" md="8" offset-lg="3" lg="6">
            <b-card>
              <h1 class="mb-0 wt-400">Candidate Rank Learning</h1>
              <hr />
              <p>
                Candidate rank is a specialized application for medical staff to
                screen and interview incoming doctors. Candidate Rank allows you
                to import ERAS of SF Match candidate data and coordiante vitrual
                interviews. Users can also create surveys to coincide with
                virtual meetings to score candidates.
              </p>
              <a class="btn btn-success" v-bind:href="LOGIN_PAGE.HREF">
                Get started
              </a>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import LINKS from "@/utils/constants/links";

export default {
  name: "Learning",
  created() {
    this.LOGIN_PAGE = LINKS.LOGIN;
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
#learning {
  width: 100%;
  padding: 105px 5px 5px 5px;
}
</style>
