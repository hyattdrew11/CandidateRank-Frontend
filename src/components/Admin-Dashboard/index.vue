<template>
  <div>
    <Navigation />
    <div>
      <Admin  :user="user" />
    </div>
  </div>
</template>

<script>
import Navigation from '../Navigation/Navigation.vue';
import Admin from './admin/index.vue';

export default {
	name: 'Dashboard',
	data() {
    	return {
        user: this.$store.state.user,
    		view: this.$store.state.user.role,
    	}
  	},
    mounted() {
    },
  	components: {
    	Navigation,
      Admin,
  	},
  	methods: {}
};
</script>
<style scoped lang="scss"></style>