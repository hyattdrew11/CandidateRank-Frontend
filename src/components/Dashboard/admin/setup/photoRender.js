import Vue from "vue";

export default Vue.extend({
    template: `
    <div class="candidate-img">
        <img height="50" width="50" :src="imagePath" />
    </div>
    `,
    data: function () {
        return {
            imagePath: null,
        };
    },
    mounted() {
        this.returnPath()
    },
    methods: {
        returnPath() {
            let path = this.params.node.data.photo
            if(path) {
                this.imagePath = path 
            }
            else {
                this.imagePath = "placeholder.png"
            }
        }
    }
});