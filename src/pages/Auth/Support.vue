<template>
	<div>
		<Navigation />
    <div id="tos">
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6">
          <b-card>
    		    <h1 class="mb-0 p-4 tx-18 wt-400">Support</h1>
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
import Navigation from "@/components/Navigation";
export default {
  name: 'Support',
  data () {
    return {

    }
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
