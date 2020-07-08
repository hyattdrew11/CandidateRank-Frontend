<template>
  <div>
  	<div v-if="user.active">
  		<Navigation :user=user></Navigation>
  		<div id="demo-nav" class="container">
  			<b-row align-v="center" align-h="center">
  				<b-col  sm="12" md="4" lg="4">
  					<b-card class="text-center">
              <router-link :to="{ name: 'Admin'}">Admin</router-link>
  					</b-card>
  				</b-col>
  				<b-col  sm="12" md="4" lg="4">
  					<b-card class="text-center">
  						<a href="/faculty">Faculty</a>
  					</b-card>
  				</b-col>
  				<b-col  sm="12" md="4" lg="4">
  					<b-card class="text-center">
  						<a href="/student">Student</a>
  					</b-card>
  				</b-col>
  			</b-row>
  		</div>
  	</div>
  </div>
</template>

<script>
import Navigation from './Navigation/Navigation.vue';
export default {
	name: 'Home',
	data() {
    	return {
    		user: {
    			role: "Admin",
    			active: true,
    			firstName: "Jane",
    			lastName: "Doe",
    			email: "jane@tulane.com"
    		}
    	}
  	},
  	components: {
    	Navigation: Navigation,
  	},
  	methods: {}
};
</script>
<style scoped lang="scss">
	#demo-nav {
		display: block;
		padding: 15%;
	}
</style>