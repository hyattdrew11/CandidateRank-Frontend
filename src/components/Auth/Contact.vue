<template>
	<div>
    <b-navbar id="main-nav" toggleable="lg" type="dark" variant="none" fixed="top">
        <b-navbar-brand>
          <img height="35" class="" src="img/logo/cr-logo-white.png" />
        </b-navbar-brand>
      </b-navbar>
    <b-container fluid>
        <b-row align-v="center"   class="pt-4 mt-4 no-gutters">
          <b-col md="2" class=""></b-col>
          <b-col md="4" class="">
           <img src="img/background/contact-us.png" class="mt-3 p-4" height="620" />
         </b-col>
        <b-col md="4" class="">
          <b-card>
		      <!-- <h1 class="mb-0 p-4 tx-18 wt-400">Contact Us</h1> -->
            <h5>Contact</h5>
            <hr />
            <p>CandidateRank is currently in beta testing. We are ready to start suppporting new customers for the upcoming interview season. Please email us for more information at <a href="mailto:info@candidate-rank.com"> info@candidate-rank.com</a>, with a short message on how to get started.</p>
            <hr />
            <!-- <b-form-group label="Name:">
              <b-form-input 
                required 
                name="name" 
                v-model='contact.name' 
                placeholder="Name" 
                type="text" 
                class="mb-1"
                autocomplete="off">
              </b-form-input>
            </b-form-group>
            <b-form-group label="Email address:">
              <b-form-input 
                required 
                name="email" 
                v-model="contact.email" 
                placeholder="E-mail" 
                type="email"
                class="mb-1" 
                autocomplete="off">
              </b-form-input>
            </b-form-group>

            <b-form-group label="Message:">
              <b-form-textarea 
                name="message" 
                v-model="contact.message" 
                rows="4" 
                class="mb-3"
                placeholder="Message">
              </b-form-textarea>

              <b-button block class="bg-green white" variant="outline-secondary"">Send</b-button>
            </b-form-group> -->
          </b-card>
        </b-col>
      </b-row>
    </b-container>
	</div>
</template>

<script>
import Navigation from '../Navigation/Navigation.vue';
export default {
  name: 'TOS',
  data () {
    return {
      contact: {
        name: '',
        email: '',
        message: '',
      },
      isSending: false
    }
  },
  components: {
  	Navigation
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/sass/home.scss';
</style>
