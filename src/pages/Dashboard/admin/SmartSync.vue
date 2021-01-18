<template>
	<div id="SmartSync">
		<ul v-if="tasks">
			<li v-for="(x, index) in tasks" >
				{{ x.term }} | {{ x.action }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'SmartSync',
  	props: ['tasks'],
	data() {
    	return {
      }
  	},
  	methods: {}
  }
</script>
<style scoped lang="scss">
	#SmartSync {
		display: block;
    	min-height: 50px;
    	width: 300px;
    	position: fixed;
    	bottom: 10px;
    	right: 10px;
    	background-color: #EEE;
    	padding: 10px;
    	border: 1px solid #000;
    	z-index: 20000;
	}
</style>
