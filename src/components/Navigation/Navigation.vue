<template>
  <div>
    <b-navbar id="main-nav" toggleable="lg" type="dark" variant="none">
        <b-navbar-brand>
          <img height="45" class="" src="cr-logo.png" />
       <!--    <img 
          height="30" 
          src="https://communications.tulane.edu/sites/g/files/rdw811/f/pictures/%C6%92%C6%92TUshield_1c_BLK.png" /> -->
          <!-- Candidate Rank  -->
          <span v-if="user">• {{ user.role }}</span>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">

            <b-nav-item-dropdown v-if="user" right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{ user.email }}</em>
              </template>
              <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
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
        window.location.reload()
  		}
  }
}
</script>


<style lang="scss">
#main-nav {
  background-color: #005837;
}
</style>