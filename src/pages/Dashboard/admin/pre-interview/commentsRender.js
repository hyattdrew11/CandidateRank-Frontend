import Vue from "vue";

export default Vue.extend({
    template: `
    <div>
    <div v-for="(x, index) in comments">
        <span class="comment tx-10">{{ x }}</span>
    </div>
    </div>
    `,
    data: function () {
        return {
        };
    },
    computed: {
        comments() { 
            return this.params.node.data.comments
        }
    },
    mounted() {
    },
    methods: {
    }
});