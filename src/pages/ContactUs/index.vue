<template>
  <div>
    <b-navbar
      id="main-nav"
      toggleable="lg"
      type="dark"
      variant="none"
      fixed="top"
    >
      <b-navbar-brand>
        <Logo />
      </b-navbar-brand>
    </b-navbar>
    <b-container fluid>
      <b-row align-v="center" class="pt-4 mt-4 no-gutters">
        <b-col md="2" class=""></b-col>
        <b-col md="4" class="">
          <img
            src="img/background/contact-us.png"
            class="mt-3 p-4"
            height="620"
          />
        </b-col>
        <b-col md="4" class="">
          <b-card>
            <h5>Contact</h5>
            <hr />
            <p>
              CandidateRank is currently in beta testing. We are ready to start
              suppporting new customers for the upcoming interview season.
              Please email us for more information at
              <a v-bind:href="`mailto:${SUPPORT_EMAIL}`">
                {{ SUPPORT_EMAIL }}
              </a>
              , with a short message on how to get started.
            </p>
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
import Logo from "@/components/Logo";
import { SUPPORT_EMAIL } from "@/utils/constants/contact";

export default {
  name: "ContactUs",
  created() {
    this.SUPPORT_EMAIL = SUPPORT_EMAIL;
  },
  data() {
    return {
      contact: {
        name: "",
        email: "",
        message: "",
      },
      isSending: false,
    };
  },
  components: {
    Logo,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/home.scss";
</style>
