<template>
  <div>
    <b-navbar id="main-nav" toggleable="lg" type="dark" variant="none" fixed="top">
        <b-navbar-brand>
          <router-link v-if="!user" :to="{ name: 'Home'}">
             <img height="35" class="" src="cr-logo-white.png" />
             <!-- <span class="brand-text">andidate Rank</span> -->
          </router-link>
          <router-link v-if="user" :to="{ name: 'Dashboard'}">
             <img height="35" class="" src="cr-logo-white.png" />
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
             <!--   <b-dropdown-item @click="zoomAuth()">
                <span class="black">Sync Zoom</span>
               </b-dropdown-item> -->
              <b-dropdown-item @click="logout">
                <span id="logout">Sign Out</span>
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- <i v-if="user"  v-b-tooltip.hover title="Open User Guide" id="open-guide" v-b-toggle.sidebar class="fa fa-question-circle"></i> -->
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export default {
  name: 'Navigation',
  data() {
      return {
        user: this.$store.state.user,
        zoomRedirect: "https://zoom.us/oauth/authorize?response_type=code&client_id=k6uY18lSSjqNNenR0lspOg&redirect_uri=https://candidaterank.io/zoomredirect"
      }
  },
  computed: {
    currentRouteName() {
        return this.$route.name;
    }
  },
  mounted() { 
    // if(this.currentRouteName == 'Dashboard') {
    //   this.checkZoom() 
    // }
    // else {}
  },
  methods: {
    // refreshZoomToken() {
    //   console.log("REFRESH ZOOM TOKEN")
    //   let input = {
    //     "email": this.user.email
    //   }
    //   axios.post( API_URL+'/auth/refresh_zoom/', input)
    //   .then(({ data }) => { 
    //     if(data.error === "auth-zoom") {
    //       // let c = confirm("You have not linked your zoom account. Would you like to do so now?")
    //       // if(c) { window.open(this.zoomRedirect)}
    //     }
    //   })
    //   .catch(function (e) { console.log(e)  })
    // },
    // checkZoom() {
    //   console.log("CHECK ZOOM")
    //   if(this.user && !this.user.refresh_token) {
    //     // let c = confirm("You have not linked your zoom account. Would you like to do so now?")
    //     // if(c) {
    //     //    window.open(this.zoomRedirect);
    //     // }
    //     // else {}
    //   }
    //   else {
    //     this.refreshZoomToken()
    //   }
    // },
    // zoomAuth() {
    //   window.open(this.zoomRedirect);

    // },
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
  background-color: #319c90;
  // border-bottom: 2px solid #FFF;
}
.navbar {
  margin-bottom: 0px!important;
}
.brand-text {
  margin-left: -2px;
  font-weight: 500;
}
#open-guide {
    color: #FFF;
    font-size: 18px;
    margin-top: 10px;
    margin-left: 20px;
}
</style>