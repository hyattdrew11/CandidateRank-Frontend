<template>
	<div>
		<Navigation />
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
		<h1 class="mb-0 p-4 tx-18 wt-400">Zoom Authentication</h1>
	</div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

import Navigation from '../Navigation/Navigation.vue';
export default {
  name: 'ZoomRedirect',
  data () {
    return {
      zoom_code: this.$route.query.code,
      email: null,
      loading: true,

    }
  },
  components: {
  	Navigation,
    axios
  },
  mounted() {
    this.checkZoomCode(this.zoom_code)
  },
  methods: {
    checkZoomCode(code) {
      if(code == undefined) {
        // REDIRECT TO HOME
      }
      else {
        this.authenticateZoom()
      }
    },
    authenticateZoom() {
      let input = {
        code: this.zoom_code,
        email: this.email
      }
      axios.post( API_URL+'/auth/zoom_authentication/', input)
          .then(({ data }) => { 
            alert("Zoom authenication successful. You will be redirected to login to Candidate Rank.")
            this.$router.push('/dashboard')
          })
          .catch(function (e) { 
            console.log(e) 
            alert("Error connecting to Zoom, please tray again.")
            window.location.href =  "https://zoom.us/oauth/authorize?response_type=code&client_id=k6uY18lSSjqNNenR0lspOg&redirect_uri=https://candidaterank.io/zoomredirect"
          })
      /* AXIOS POST code TO SERVER TO GET ACCESS TOKEN FROM ZOOM
         SERVER WILL FIRST TRY OT AUTHENTICATE WITH ZOOM 
          IF SUCCESS THEN CHECK IF THIS USER IS IN OUR DB 
            IF USER IS IN DB LOG THEM IN 
            ELSE CREATE A NEW USER AND ORGANIZATION AND THEN LOG THEM IN 
          ELSE IS FAILURE
            ALERT AN ERROR AND TRY AUTH AGAIN
      */

    },
    login() {}

  },
}
</script>

<style lang="scss" scoped></style>
<!-- https://candidaterank.io/zoomredirect?code=YRV8MYmrk4_al1_xCoNQfOJJXPiSPzW2A -->