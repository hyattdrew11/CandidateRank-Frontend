<template>
  <div>
    <Navigation />
    <div id="tos">
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6">
          <b-card>
            <h1 class="mb-0 p-4 tx-18 wt-400">Support</h1>
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
  name: "Support",
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
