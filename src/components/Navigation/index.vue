<template>
  <div>
    <b-navbar
      id="main-nav"
      toggleable="lg"
      type="dark"
      variant="none"
      fixed="top"
    >
      <b-navbar-brand>
        <router-link
          v-if="!user"
          :to="{ name: user ? LINKS.DASHBOARD.TITLE : LINKS.HOME.TITLE }"
        >
          <img
            alt="white-logo"
            height="35"
            class=""
            src="img/logo/cr-logo-white.png"
          />
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-button
            v-if="!user"
            @click="goLogin()"
            size="sm"
            variant="outline-light"
          >
            Login
          </b-button>
          <b-nav-item-dropdown v-if="user" right>
            <template v-slot:button-content>
              <em>{{ user.email }}</em>
            </template>
            <b-dropdown-item @click="logout">
              <span id="logout">Sign Out</span>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import LINKS from "@/utils/constants/links";

export default {
  name: "Navigation",
  created() {
    this.LINKS = LINKS;
  },
  data() {
    return {
      user: this.$store.state.user,
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      window.location.replace("/");
    },
    goLogin() {
      this.$router.push("login");
    },
  },
};
</script>


<style lang="scss">
#main-nav {
  background-color: #319c90;
}
.navbar {
  margin-bottom: 0px !important;
}
</style>