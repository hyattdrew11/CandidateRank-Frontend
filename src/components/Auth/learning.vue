<template>
	<div>
		<Navigation />
    <div id="learning">
      <b-row>
        <b-col md="12">
          <b-card>
    		    <h1 class="mb-0  wt-400">Candidate Rank Documentation</h1>
            <hr />
            <b-row>
              <b-col md="5">
                <p>
                  Candidate rank is a specialized application for medical staff to screen and interview incoming doctors. Candidate Rank allows you to import ERAS candidate data and coordiante vitrual interviews.  Users can also create surveys to coincide with virtual meetings to score candidates. 
                </p>
              </b-col>
              <b-col md="7">
                <span>ADD AN IMAGE HERE</span>
                <!-- <img  /> -->
              </b-col>
              <b-col md="5">
                 <h2 class="mb-0  wt-400">Register</h2>
              </b-col>
               <b-col md="7">
                <span>ADD AN IMAGE HERE</span>
                <!-- <img  /> -->
              </b-col>
                <b-col md="5">
                 <h2 class="mb-0  wt-400">Login</h2>
              </b-col>
               <b-col md="7">
                <span>ADD AN IMAGE HERE</span>
                <!-- <img  /> -->
              </b-col>
                <b-col md="5">
                 <h2 class="mb-0  wt-400">Create Interview Term</h2>
              </b-col>
               <b-col md="7">
                <span>ADD AN IMAGE HERE</span>
                <!-- <img  /> -->
              </b-col>
                <b-col md="5">
                 <h2 class="mb-0  wt-400">Create Virutal Room</h2>
              </b-col>
               <b-col md="7">
                <span>ADD AN IMAGE HERE</span>
                <!-- <img  /> -->
              </b-col>
                <b-col md="5">
                 <h2 class="mb-0  wt-400">Add Evaluator</h2>
              </b-col>
               <b-col md="7">
                <span>ADD AN IMAGE HERE</span>
                <!-- <img  /> -->
              </b-col>
            </b-row>


          </b-card>
        </b-col>
      </b-row>
    </div>
	</div>
</template>

<script>
import Navigation from '../Navigation/Navigation.vue';
export default {
  name: 'Learning',
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
  #learning {
    width: 100%;
    margin: 75px 5px 5px 5px;
  }
</style>
