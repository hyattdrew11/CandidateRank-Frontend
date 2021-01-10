<template>
  <b-container id="testimonials" fluid class="mt-4 mb-4">
    <b-row no-gutters class="p-3">
      <b-col
        sm="4"
        class="p-3"
        v-for="(guide, index) in guides"
        v-bind:key="index"
      >
        <h5 class="tx-16">
          {{ guide.title }}
        </h5>
        <p class="tx-12">
          {{ guide.description }}
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "HomeGuides",
  data() {
    return {
      guides: [
        {
          title:
            "TULANE UNIVERSITY SCHOOL OF MEDICINE DEPARTMENT OF ORTHOPAEDICS",
          description: `Prior to introducing the electronic applicant evaluation 
          system with the use of I-pads into our interview process, the method to 
          which we evaluated applicants was extremely time-consuming and at times
          unreliable. Our program stands by Candidate Rank and its teamʼs application 
          because it produces valuable results in real-time throughout each of our 
          interview days, allows for a modern evaluating experience for our faculty 
          and applicants, and has significantly minimized the time consumed in 
          determining our rank list.`,
        },
        {
          title:
            "TULANE UNIVERSITY SCHOOL OF MEDICINE DEPTARTMENT OF GENERAL SURGERY",
          description: `CandidateRank and their team have completely changed the way we do our
          interviews and candidate ranking. The system has not only restructured
          our process by cutting out hours of manpower, paper and human error,
          it has allowed us to better focus on the personal touches that make
          our process unique and welcoming. It has freed us from manual errors,
          and has made our review process so much easier and immediate. It has
          made our interview season a streamlined paper-free system that allows
          us to accurately rank our candidates. We look forward to working with
          CandidateRank for years to come.`,
        },
        {
          title: "MISSISSIPPI SPORTS MEDICINE DEPARTMENT OF ORTHOPAEDICS",
          description: `I believe we were the first user site for CandidateRank. It has been
          an amazing journey to watch how the team worked with us to demonstrate
          value. We are a small private company, so for us to spend this money
          was not an easy one initially. However with that said, we could never
          go back to our old manual process. Our interview sessions used to be
          longer, and we would have to gather information and then get back
          together a week or so later once we had a chance to input all the
          rankings. Now we get through with the interviews, meet 30 minutes
          later, and are done.`,
        },
      ],
    };
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>