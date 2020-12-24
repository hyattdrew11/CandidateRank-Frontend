<template>
  <div>
    <Navigation></Navigation>
    <i
      id="loader"
      v-if="loading"
      class="fa fa-spinner fa-pulse fa-3x fa-fw text-info"
      aria-hidden="true"
    ></i>
    <div :class="{ fade: loading }">
      <b-container fluid>
        <b-row no-gutters>
          <b-col
            md="12"
            id="home-header"
            class="text-center pt-4"
            style="background-image: url('img/background/header.jpg')"
          >
            <img height="175" class="" src="img/logo/cr-logo-white.png" />
            <h1 id="tagline" class="white">CandidateRank</h1>
            <h3 class="white">
              FULLY AUTOMATED & INTEGRATED RESIDENT <br />
              FELLOW INTERVIEW PROCESS
            </h3>
            <b-button
              href="/applicant"
              variant="outline-secondary"
              class="mr-1 bg-green white"
            >
              Applicants
            </b-button>
            <b-button
              href="/login"
              variant="outline-secondary"
              class="mr-1 bg-green white"
            >
              Interviewers
            </b-button>
            <!--  <b-button href="#" variant="secondary">
              <router-link :to="{ name: 'Register'}">Register</router-link>
            </b-button> -->
          </b-col>
        </b-row>
      </b-container>
      <div class="steps-header"></div>
      <b-container fluid class="pb-4">
        <b-row no-gutters>
          <b-col sm="12" md="4" lg="4">
            <span class="step-num">1</span>
            <div class="step">
              <h4 class="mt-0">AUTOMATED PAPERLESS SOLUTION</h4>
              <img src="img/step/step-1.jpg" class="img-fluid mb-2" />
              <p>
                CandidateRank is the only software vendor on the market that
                takes your entire manual interview process and provides a
                solution that is completely automated and moves you permanently
                away from having to manage paper.
              </p>
            </div>
          </b-col>
          <b-col sm="12" md="4" lg="4">
            <span class="step-num">2</span>
            <div class="step">
              <h4 class="mt-0">FULLY INTEGRATED</h4>
              <img src="img/step/step-2.jpg" class="img-fluid mb-2" />
              <p>
                Helping you to become more efficient. Our fully integrated
                solution works with your current residency/fellowship
                application service to seamlessly move data into a searchable
                and scalable format allowing you to sort through thousands of
                potential applicants in a matter of minutes.
              </p>
            </div>
          </b-col>
          <b-col sm="12" md="4" lg="4">
            <span class="step-num">2</span>
            <div class="step">
              <h4 class="mt-0">SAVES TIME & MONEY</h4>
              <img src="img/step/step-3.jpg" class="img-fluid mb-2" />
              <p>
                CandidateRank creates value by freeing up staff and faculty
                time, and objectively helps manage the integrity of your data
                keeping track of every note and comment made by your
                interviewing faculty.
              </p>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <div id="learn-more" class="header-title">
        <h4 class="white text-center">
          MANAGING THER DATA THAT DRIVES YOUR DECISIONS
        </h4>
      </div>
      <b-container fluid class="">
        <b-row no-gutters>
          <img src="img/step/step-guide.png" class="step-guide" />
        </b-row>
      </b-container>
      <div class="steps-header"></div>
      <b-container id="testimonials" fluid class="mt-4">
        <b-row no-gutters class="p-3">
          <b-col class="p-3">
            <h5 class="tx-16">
              TULANE UNIVERSITY SCHOOL OF MEDICINE DEPARTMENT OF ORTHOPAEDICS
            </h5>
            <p class="tx-12">
              Prior to introducing the electronic applicant evaluation system
              with the use of I-pads into our interview process, the method to
              which we evaluated applicants was extremely time-consuming and at
              times unreliable. Our program stands by Candidate Rank and its
              teamʼs application because it produces valuable results in
              real-time throughout each of our interview days, allows for a
              modern evaluating experience for our faculty and applicants, and
              has significantly minimized the time consumed in determining our
              rank list.
            </p>
          </b-col>
          <b-col class="p-3">
            <h5 class="tx-16">
              TULANE UNIVERSITY SCHOOL OF MEDICINE DEPTARTMENT OF GENERAL
              SURGERY
            </h5>
            <p class="tx-12">
              CandidateRank and their team have completely changed the way we do
              our interviews and candidate ranking. The system has not only
              restructured our process by cutting out hours of manpower, paper
              and human error, it has allowed us to better focus on the personal
              touches that make our process unique and welcoming. It has freed
              us from manual errors, and has made our review process so much
              easier and immediate. It has made our interview season a
              streamlined paper-free system that allows us to accurately rank
              our candidates. We look forward to working with CandidateRank for
              years to come.
            </p>
          </b-col>
          <b-col class="p-3">
            <h5 class="tx-16">
              MISSISSIPPI SPORTS MEDICINE DEPARTMENT OF ORTHOPAEDICS
            </h5>
            <p class="tx-12">
              I believe we were the first user site for CandidateRank. It has
              been an amazing journey to watch how the team worked with us to
              demonstrate value. We are a small private company, so for us to
              spend this money was not an easy one initially. However with that
              said, we could never go back to our old manual process. Our
              interview sessions used to be longer, and we would have to gather
              information and then get back together a week or so later once we
              had a chance to input all the rankings. Now we get through with
              the interviews, meet 30 minutes later, and are done.
            </p>
          </b-col>
        </b-row>
      </b-container>
      <footer>
        <b-row>
          <b-col class="text-left">info@candidate-rank.com</b-col>
          <b-col class="text-center">128 Colony Place Madison, MS 39110</b-col>
          <b-col class="text-right">candidaterank.io</b-col>
        </b-row>
      </footer>
    </div>
  </div>
</template>

<script>
import Navigation from "../Navigation/Navigation.vue";

export default {
  name: "Home",
  data() {
    return {
      loading: true,
    };
  },
  components: {
    Navigation,
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {},
};
</script>
<style scoped lang="scss">
@import "../../assets/sass/home.scss";
</style>