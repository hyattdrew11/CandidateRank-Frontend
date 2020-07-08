<template>
  <div>
    <Navigation />
    <div v-if="view == 'Admin' ">
      <Admin  :user="user" />
    </div>
     <div v-if="view == 'Faculty' ">
      <Faculty :user="user" />
    </div>
  </div>
</template>

<script>
import Navigation from '../Navigation/Navigation.vue';

import Admin from './admin/index.vue';
import Faculty from './faculty/index.vue';

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
      Faculty
  	},
  	methods: {}
};
</script>
<style scoped lang="scss"></style>