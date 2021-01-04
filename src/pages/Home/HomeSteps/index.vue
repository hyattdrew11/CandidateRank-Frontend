<template>
  <b-container fluid class="pb-4">
    <b-row no-gutters>
      <b-col
        sm="12"
        md="4"
        lg="4"
        v-for="(step, index) in steps"
        v-bind:key="index"
      >
        <span class="step-num">{{ step.level }}</span>
        <div class="step">
          <h4 class="mt-0">{{ step.title }}</h4>
          <img
            alt="step-image"
            v-bind:src="step.image"
            class="img-fluid mb-2"
          />
          <p>{{ step.description }}</p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "HomeSteps",
  data() {
    return {
      steps: [
        {
          level: 1,
          image: "img/step/step-1.jpg",
          title: "AUTOMATED PAPERLESS SOLUTION",
          description: `CandidateRank is the only software vendor on the market 
          that takes your entire manual interview process and provides a solution 
          that is completely automated and moves you permanently away from having 
          to manage paper.`,
        },
        {
          level: 2,
          image: "img/step/step-2.jpg",
          title: "FULLY INTEGRATED",
          description: `Helping you to become more efficient. Our fully integrated 
          solution works with your current residency/fellowship application service 
          to seamlessly move data into a searchable and scalable format allowing 
          you to sort through thousands of potential applicants in a matter of minutes.`,
        },
        {
          level: 3,
          image: "img/step/step-3.jpg",
          title: "SAVES TIME & MONEY",
          description: `CandidateRank creates value by freeing up staff and faculty 
          time, and objectively helps manage the integrity of your data keeping 
          track of every note and comment made by your interviewing faculty.`,
        },
      ],
    };
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/home.scss";
</style>