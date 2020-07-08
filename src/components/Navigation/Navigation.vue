<template>
  <div>
    <b-navbar id="main-nav" toggleable="lg" type="dark" variant="none" fixed="top">
        <b-navbar-brand>
          <router-link v-if="!user" :to="{ name: 'Home'}">
             <img height="35" class="" src="cr-logo-white.svg" />
             <!-- <span class="brand-text">andidate Rank</span> -->
          </router-link>
          <router-link v-if="user" :to="{ name: 'Dashboard'}">
             <img height="35" class="" src="cr-logo-white.svg" />
             <!-- <span class="brand-text">andidate Rank</span> -->
          </router-link>
       <!--    <img 
          height="30" 
          src="https://communications.tulane.edu/sites/g/files/rdw811/f/pictures/%C6%92%C6%92TUshield_1c_BLK.png" /> -->
          <!-- Candidate Rank  -->
          <!-- <span v-if="user">• {{ user.role }}</span> -->
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-button @click="goLogin()" v-if="!user" size="sm" variant="outline-light">login</b-button>
            <b-nav-item-dropdown v-if="user" right>
              <!-- Using 'button-content' slot -->
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
export default {
  name: 'Navigation',
  data() {
      return {
        user: this.$store.state.user
      }
  },
  mounted() { },
  methods: {
  	logout() {
  			window.sessionStorage.clear()
        window.location.replace("/");
  		},
      goLogin() {
        this.$router.push('login')
      },
  }
}
</script>


<style lang="scss">
#main-nav {
  background-color: #13a89e;
  border-bottom: 2px solid #FFF;
}
.navbar {
  margin-bottom: 0px!important;
}
.brand-text {
  margin-left: -2px;
  font-weight: 500;
}
</style>