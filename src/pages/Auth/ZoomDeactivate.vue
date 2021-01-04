<template>
	<div>
		<Navigation />
    <div id="tos">
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6">
          <b-card>
    		    <h1 class="mb-0 p-4 tx-18 wt-400">Candidate Rank Zoom Integration Deactivate</h1>
            <p>
              You have uninstalled Candidate Rank Zoom Integration <a href="https://zoom.us/oauth/authorize?response_type=code&client_id=k6uY18lSSjqNNenR0lspOg&redirect_uri=https://candidaterank.io/zoomredirect">click here to reinstall the application.</a>.
            </p>
            <p>
              <a target="_blank" href="mailto:info@candidate-rank.com">
              Questions or Support email info@candidate-rank.com
              </a>
            </p>
          </b-card>
        </b-col>
      </b-row>
    </div>
	</div>
</template>

<script>

const VUE_ZOOM_URL = process.env.VUE_ZOOM_URL

import Navigation from "@/components/Navigation";
export default {
  name: 'ZoomDeactivate',
  data () {
    return {
      VUE_ZOOM_URL: VUE_ZOOM_URL

    }
  },
  mounted() {
    // console.log(VUE_ZOOM_URL)
  },
  components: {
  	Navigation
  }
}
</script>

<style lang="scss" scoped>
  #tos {
    margin-top: 150px;
    width: 100%;
    text-align: center;
  }
</style>
