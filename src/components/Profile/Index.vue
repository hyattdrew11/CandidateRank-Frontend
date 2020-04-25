<template>
  <div>
    <Navigation :user="user"></Navigation>
    <pre>{{ user }}</pre>
  </div>
</template>

<script>
import Navigation from '../Navigation/Navigation.vue';
export default {
	name: 'Profile',
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
<style scoped lang="scss"></style>