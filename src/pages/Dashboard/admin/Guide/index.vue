<template>
  <div id="Guide" class="container-fluid">

        <b-sidebar  id="sidebar" width="50%" title="User Guide" bg-variant="dark" text-variant="light" right shadow>
        <div class="px-3 py-2">
          <h4 class="tx-16 pointer"  v-b-toggle.collapse-1>Setup  - Welcome Wizard 
            <i class="fa fa-caret-down float-right"></i>
            <hr />
            <b-collapse id="collapse-1" class="mt-2">
              <ul>
                <li class="">Choose Interview Year</li>
                <li class="">Add Department Name</li>
                <li class="">Set pre-interview completion date. (optional)</li>
                <li class="">Choose Interview Dates</li>
                <li class="">Add Evaluators</li>
              </ul>
            </b-collapse>
          </h4>
           <h4 class="tx-16 pointer"  v-b-toggle.collapse-2>Setup  - Master Schedule 
            <i class="fa fa-caret-down float-right"></i>
            <hr />
            <b-collapse id="collapse-2" class="mt-2">
              <ul>
                <li class="">Choose Interview Year</li>
                <li class="">Add Department Name</li>
                <li class="">Set pre-interview completion date. (optional)</li>
                <li class="">Choose Interview Dates</li>
                <li class="">Add Evaluators</li>
              </ul>
            </b-collapse>
          </h4>
          <p></p>
        </div>
      </b-sidebar>

  </div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Guide',
  props: ['user'],
	data() {
    	return {}
  	},
  	components: {
      axios
    },
    mounted() {},
  	methods: {
    }
};
</script>
<style scoped lang="scss"></style>