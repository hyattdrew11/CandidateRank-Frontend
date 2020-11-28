<template>
  <div v-if="candidate" class="pdf-shadow">
    <b-row no-gutters>
            <h5 style="width: 100%;" class="p-2 pl-4 pt-3">
              {{ candidate['Applicant Name'] }}
              <span class="float-right pointer">
                  Page {{ pageNum }}
                  <i class="fa fa-angle-double-left mr-1" @click="firstPage()"></i>
                  <i class="fa fa-angle-left mr-1" @click="prevPage()"></i>
                  <i class="fa fa-angle-right ml-1 mr-1" @click="nextPage()"></i>
                  <i class="fa fa-angle-double-right ml-1 mr-1" @click="lastPage()"></i>
                </span>
            </h5>
            <b-col sm="12">
               <canvas style="width: 98%; float: left;" id="the-canvas"></canvas>
            </b-col>
    </b-row>
  </div>
</template>

<script>
import pdfjsLib from 'pdfjs-dist'

export default {
  name: 'PDFRenderSchedule',
  props: ['candidate'],
   watch: {
    candidate: function(newVal, oldVal) {
     console.log("NEW CANDIDATE")
     let vm = this
      if(newVal && newVal != null) {
        console.log("NEW PDF CANDIDATE")
        this.pageNum = 1
        this.loading = true
        this.candidate = newVal
        this.getPdf()
        setTimeout(function(){  vm.getPdf() }, 500);
      }
      // else { 
      //   console.log("OLD PDF CANDIDATE")
      //   this.pageNum = 1
      //   this.loading = true
      //   this.candidate = oldVal
      //   setTimeout(function(){  vm.getPdf() }, 500);
      // }
    }
  },
  data() {
      return {
        loading: false,
        pdfDoc: null,
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
    mouunted() {
      // console.log("Mounted")
      if(this.candidate) { this.getPdf() }

    },
    computed: {
      canvas() { 
       return document.getElementById('the-canvas')
      }
    },
    methods: {
       getPdf () {
        console.log("GET PDF")
        console.log(this.candidate.application)
        let vm = this
        this.loading = true
        this.showApplication = true
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';

        var loadingTask = pdfjsLib.getDocument(this.candidate.application);
        loadingTask.promise.then(function(pdf) {
          console.log(pdf)
          vm.pdfDoc = pdf;
          vm.numPages = pdf.numPages;
          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            // console.log('Page loaded');
            var scale = 1;
            var viewport = page.getViewport({scale: scale});
            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
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
          console.log("ERROR LOADING PDF")
          console.error(reason);
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
          var canvas = document.getElementById('the-canvas');
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