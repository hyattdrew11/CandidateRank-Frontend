<template>
  <footer>
    <b-row>
      <b-col class="text-left">{{ CONTACT.SUPPORT_EMAIL }}</b-col>
      <b-col class="text-center">{{ CONTACT.ADDRESS }}</b-col>
      <b-col class="text-right">{{ CONTACT.SITE_URL }}</b-col>
    </b-row>
  </footer>
</template>

<script>
import * as CONTACT from "@/utils/constants/contact";

export default {
  name: "HomeFooter",
  created() {
    this.CONTACT = CONTACT;
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>