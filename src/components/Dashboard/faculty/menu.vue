<template>
  <div id="faculty-menu">
    <!-- <span id="faculty-menu-header"></span> -->
    <ul id="faculty-menu-list">
      <li v-for="(x, index) in tabs" :class="{active : x == tab }" @click="changeTab(x)">{{ x }}</li>
    </ul>
  </div>
</template>

<script>

export default {
	name: 'FacultyMenu',
	data() {
    	return {
        tab:  'Pre-Interview Rankings',
        tabs: ['Ranking','Schedule','Pre-Interview','Interview Process']
      }
  	},
  	components: {},
  	methods: {
      changeTab(tab) {
        this.tab = tab
      },
    }
};
</script>
<style scoped lang="scss"></style>