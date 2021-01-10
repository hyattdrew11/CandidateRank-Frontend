<template>
  <div>
    <Navigation />
    <div id="contact-us">
      <b-container>
        <b-row align-v="center" class="pt-4 mt-4 no-gutters">
          <b-col offset-md="1" md="5" class="">
            <img
              src="img/background/contact-us.png"
              class="mt-3 p-4 contact-us-image"
            />
          </b-col>
          <b-col md="5" class="">
            <b-card>
              <h5>Contact</h5>
              <hr />
              <p>
                CandidateRank is currently in beta testing. We are ready to
                start suppporting new customers for the upcoming interview
                season. Please email us for more information at
                <a v-bind:href="`mailto:${SUPPORT_EMAIL}`">
                  {{ SUPPORT_EMAIL }}
                </a>
                , with a short message on how to get started.
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

export default {
  name: "ContactUs",
  created() {
    this.SUPPORT_EMAIL = SUPPORT_EMAIL;
  },
  data() {
    return {
      contact: {
        name: "",
        email: "",
        message: "",
      },
      isSending: false,
    };
  },
  components: {
    Navigation,
  },
};
</script>

<style lang="scss" scoped>
#contact-us {
  width: 100%;
  padding: 5px;
}
.contact-us-image {
  width: 100%;
  max-height: 620px;
  object-fit: contain;
}
</style>
