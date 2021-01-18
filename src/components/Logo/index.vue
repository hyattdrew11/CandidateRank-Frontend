
<template>
  <router-link :to="{ name: user ? LINKS.DASHBOARD.TITLE : LINKS.HOME.TITLE }">
    <img
      alt="white-logo"
      :height="height"
      :class="isLogin ? 'login-logo' : ''"
      src="img/logo/cr-logo-white.png"
    />
  </router-link>
</template>

<script>
import LINKS from "@/utils/constants/links";

export default {
  name: "Logo",
  props: {
    height: {
      type: Number,
      default: 35,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.LINKS = LINKS;
  },
  data() {
    return {
      user: this.$store.state.user,
    };
  },
};
</script>

<style scoped lang="scss">
.login-logo {
  position: fixed;
  top: 25px;
  left: 30px;
}
</style>
