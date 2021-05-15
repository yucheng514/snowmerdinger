<template>
  <div id="app">
    <el-upload                
      class="upload-demo"                
      ref="upload"                
      action=""                
      :auto-upload="false"                
      :file-list="fileList"                
      :on-change="handleChange"                
      multiple                
      :show-file-list="false"   
      :disabled="!!outdata"             
    >              
      <el-button type="text" :disabled="!!outdata">{{text}}</el-button>                         
    </el-upload>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      fileList:[],            
		  file:"",
      outdata: null,
      text: '点击上传',
      demo: null
    }
  },
  methods: {
    handleChange(file,fileList){        
      this.fileList = [fileList[fileList.length - 1]];   
      this.file = file.raw;        
      let reader = new FileReader()             
      reader.readAsArrayBuffer(this.file)        
      reader.onload = () => {            
        let buffer = reader.result            
        let bytes = new Uint8Array(buffer)            
        let length = bytes.byteLength            
        let binary = ''            
        for (let i = 0; i < length; i++) {                
          binary += String.fromCharCode(bytes[i])            
        }            
        let XLSX = require('xlsx')            
        let wb = XLSX.read(binary, {                
          type: 'binary'            
        })            
        let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])            
        console.log(outdata)
        this.outdata = outdata
        this.text = "上传成功"

        // test
        this.$set(this,'demo',outdata[0])
      }
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
