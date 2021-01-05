
<template>
  <img
    alt="white-logo"
    :height="height"
    :class="isLogin ? 'login-logo' : ''"
    src="img/logo/cr-logo-white.png"
  />
</template>

<script>
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
};
</script>

<style scoped lang="scss">
.login-logo {
  position: fixed;
  top: 25px;
  left: 30px;
}
</style>
