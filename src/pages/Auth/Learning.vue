<template>
	<div>
		<Navigation />
    <div id="learning">
      <b-row>
        <b-col md="12">
          <b-card>
    		    <h1 class="mb-0  wt-400">Candidate Rank Learning</h1>
            <hr />
            <b-row>
              <b-col md="5">
                <p>
                  Candidate rank is a specialized application for medical staff to screen and interview incoming doctors. Candidate Rank allows you to import ERAS of SF Match candidate data and coordiante vitrual interviews.  Users can also create surveys to coincide with virtual meetings to score candidates. 
                </p>
                <a class="btn btn-success" href="/register">Get started</a>
              </b-col>
            </b-row>


          </b-card>
        </b-col>
      </b-row>
    </div>
	</div>
</template>

<script>
import Navigation from "@/components/Navigation";
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
