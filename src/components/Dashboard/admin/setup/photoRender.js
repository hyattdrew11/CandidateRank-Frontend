import Vue from "vue";

export default Vue.extend({
    template: `
    <div class="candidate-img">
        <img v-if="imagePath == 'img/icon/placeholder.png'" @click="uploadPhoto()" height="75" width="75" :src="imagePath" />
        <img v-else height="75" width="75" :src="imagePath" />
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
        uploadPhoto() {
            alert("Upload Photo")
        },
        returnPath() {
            let path = this.params.node.data.photo
            if(path) {
                this.imagePath = path 
            }
            else {
                this.imagePath = "img/icon/placeholder.png"
            }
        }
    }
});