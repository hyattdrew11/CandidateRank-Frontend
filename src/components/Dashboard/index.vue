<template>
  <div>
    <Navigation />
    <div v-if="user.role == 'Admin' || user.role == 'Super Admin'">
      <Admin  :user="user" />
    </div>
     <div v-if="user.role == 'Faculty' || user.role == 'faculty' || user.role == 'resident'">
        <Faculty  :user="user" />
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