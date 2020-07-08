<template>
	<div class="container-fluid">  
		<b-row>
      <b-col sm="12">
          <p v-for="(x, index) in faculty">
            {{ x.email }}
            {{ x.status }}
          </p>
      </b-col>
    
      </b-col>
    </b-row>
	</div>
</template>

<script>

const API_URL = process.env.VUE_APP_API_URL

export default {
	name: 'userManagement',
  props: ["organization","user","candidates","surveys","faculty"],
  watch: {
    faculty: function(newVal, oldVal) { 
       if(newVal) { 
        this.faculty = newVal
       }
       else {
         this.faculty = oldVal
       }
    }
  },
	data() {
    	return { }
  },
  computed: {},
  methods: {}
};
</script>
<style scoped lang="scss"></style>