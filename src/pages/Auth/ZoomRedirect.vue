<template>
	<div>
    <i id="loader" v-if="loading" class="fa fa-spinner fa-pulse fa-3x fa-fw text-info" aria-hidden="true"></i>
		<h1 class="mb-0 p-4 tx-18 wt-400">Zoom Authentication</h1>
    <p>{{ message }}</p>
	</div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export default {
  name: 'ZoomRedirect',
  data () {
    return {
      zoom_code: this.$route.query.code,
      email: this.$route.query.state,
      loading: true,
      message: "",

    }
  },
  components: {
    axios
  },
  mounted() {
    // console.log(localStorage.user)
    // let user = JSON.parse(localStorage.user)
    // this.email = user.email
    this.checkZoomCode(this.zoom_code)
  },
  methods: {
    checkZoomCode(code) {
      if(code == undefined) {
        // REDIRECT TO HOME
        alert("There seems to be a problem with Zoom. Please go back to Candidate Rank and try again.")
        this.$router.push('/dashboard')
      }
      else {
        this.authenticateZoom()
      }
    },
    authenticateZoom() {
      let input = {
        "code": this.zoom_code,
        "email": this.email
      }
      axios.post( API_URL+'/auth/zoom_authentication/', input)
          .then(({ data }) => { 
            this.loading = false
            this.$router.push('/login')
          })
          .catch(function (e) { 
            console.log(e) 
            this.loading = true
            this.message = e
            alert("There seems to be a problem with Zoom. Please go back to Candidate Rank and try again.")
            this.$router.push('/dashboard')
          })
    },
    login() {}

  },
}
</script>

<style lang="scss" scoped></style>
<!-- https://candidaterank.io/zoomredirect?code=YRV8MYmrk4_al1_xCoNQfOJJXPiSPzW2A -->