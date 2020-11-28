<template>
  <div v-if="candidate">
    <b-row no-gutters>
           <b-col sm="12" class="mt-2 pt-2">
               <h5>{{ candidate['Applicant Name'] }}
                <span class="float-right pointer">
                  Page {{ pageNum }}
                  <i class="fa fa-angle-double-left mr-1" @click="firstPage()"></i>
                  <i class="fa fa-angle-left mr-1" @click="prevPage()"></i>
                  <i class="fa fa-angle-right ml-1 mr-1" @click="nextPage()"></i>
                  <i class="fa fa-angle-double-right ml-1 mr-1" @click="lastPage()"></i>
                  <i class="fa fa-times mr-1" @click="closeApplication()"></i>
                </span>
              </h5>
              <!-- <hr /> -->
            </b-col>

            <b-col sm="4">
              <b-card>
                <p>
                  <img v-if="candidate.photo != 'null'" :src="candidate.photo"  class="application-pic" />
                  <img v-else src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"  class="application-pic float-left" />
                </p>
                <p class="mb-0 tx-14 wt-500">
                  <span class="wt-700">Rank:</span>
                  {{ candidate.rank }}
                </p>
                <p class="mb-0 tx-14 wt-500"><span class="wt-700">Email:</span> {{ candidate.email }} </p>
                <p class="mb-0 tx-14 wt-500"><span class="wt-700">Medical School:</span> {{ candidate['medical school'] }}</p>
                <p class="mb-0 tx-14 wt-500"><span class="wt-700">USMLE Step 1 Score:</span> {{ candidate['USMLE Step 1 Score'] }}</p>
                <p class="mb-0 tx-14 wt-500"><span class="wt-700">USMLE Step 2 CK Score:</span> {{ candidate['USMLE Step 2 CK Score'] }}</p>
                <!-- <pre>{{ candidate }}</pre> -->
              </b-card>
             </b-col>
            <b-col sm="8">
              <canvas style="width: 98%; float: right;" id="view-canvas" class="pdf-shadow"></canvas>
            </b-col>
    </b-row>
  </div>
</template>

<script>
import pdfjsLib from 'pdfjs-dist'

export default {
	name: 'PDFRender',
  props: ['candidate'],
   watch: {
    candidate: function(newVal, oldVal) {
      // console.log("PDF CANDIDATE")
      if(newVal) {
        this.loading = true
        this.candidate = newVal
        this.pageNum = 1
        this.getPdf()
      }
    }
  },
	data() {
    	return {
        loading: false,
        pdfDoc: null,
        canvas: document.getElementById('view-canvas'),
        pageNum: 1,
        pageRendering: false,
        pageNumPending: null,
        scale: 'page-width',
        page: 1,
        numPages: 0,
        pdfdata: undefined,
      }
  	},
  	components: {
      pdfjsLib
    },
    computed: {},
  	methods: {
       getPdf () {
        // alert(this.candidate)
        console.log(this.candidate)
        console.log(this.candidate.application)
        let vm = this
        this.loading = true
        this.showApplication = true
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
        var loadingTask = pdfjsLib.getDocument(this.candidate.application);
        loadingTask.promise.then(function(pdf) {
          vm.pdfDoc = pdf;
          vm.numPages = pdf.numPages;
          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            // console.log('Page loaded');
            var scale = 1;
            var viewport = page.getViewport({scale: scale});
            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('view-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
              // console.log('Page rendered');
            });
          });
        }, function (reason) {
          // PDF loading error
          // console.error(reason);
        });
        this.loading = false
      },
      firstPage() {
        this.pageNum = 1;
        this.queueRenderPage(this.pageNum);
      },
      lastPage() {
        this.pageNum = this.numPages;
        this.queueRenderPage(this.pageNum);
      },
      prevPage() {
        // console.log("PREV PAGE")
        if (this.pageNum <= 1) {
          return;
        }
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
      },
      nextPage() {
        // console.log("NEXT PAGE")
         if (this.pageNum >= this.pdfDoc.numPages) {
            return;
          }
          this.pageNum++;
          this.queueRenderPage(this.pageNum);
      },
      queueRenderPage(num) {
        if (this.pageRendering) {
          this.pageNumPending = num;
        } else {
          this.renderPage(num);
        }
      },
      renderPage(num) {
        let vm = this
        this.pageRendering = true;
          // Prepare canvas using PDF page dimensions
        this.pdfDoc.getPage(num).then(function(page) {
          var scale = 2;
          var viewport = page.getViewport({scale: scale});
          var canvas = document.getElementById('view-canvas');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);

          // Wait for rendering to finish
          renderTask.promise.then(function() {
            vm.pageRendering = false;
            if (vm.pageNumPending !== null) {
              // New page rendering is pending
              vm.renderPage(vm.pageNumPending);
              vm.pageNumPending = null;
            }
          })
        })
      },
      closeApplication(){
        this.$emit('closeApplication',)
      },
    }
};
</script>
<style scoped lang="scss">
  #pdf-tools {
    position: fixed;
    z-index: 20000;
    top: 150px;
    right: 65px;
  }
</style>