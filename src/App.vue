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
    <div v-for="(item, index) in outdata" :key="item['__EMPTY']" :id="'main' + index" style="width: 752px;height:452px;display: none"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'App',
  data() {
    return {
      fileList:[],            
		  file:"",
      outdata: null,
      text: '点击上传',
      average: null,
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
        this.text = "上传成功"
        this.average = outdata.shift()
        this.outdata = outdata
        this.$nextTick(() => {
          outdata.forEach((item,index) => {
            this.echartsInit(item, index)
          })                    
        })

        
      }
    },
    echartsInit(data, index){

        var myChart = echarts.init(document.getElementById(`main${index}`));
        let text = `${data['__EMPTY'] || data['姓名'] || ''}单元反馈表`
        
        // 指定图表的配置项和数据
        var option = {
            title: {
                text
            },
            animation: false,
            tooltip: {},
            legend: {
                data:['班内平均值','单课积分']
            },
            xAxis: {
                data: Object.keys(data).filter(item => item.indexOf('EMPTY') < 0)
            },
            yAxis: {},
            series: [{
                name: '单课积分',
                type: 'line',
                data: Object.values(data).filter(item => this.isNumber(item))
            },{
                name: '班内平均值',
                type: 'line',
                data: Object.values(this.average).filter(item => this.isNumber(item))
            }],
            toolbox: {
              feature: {
                saveAsImage: {
                  type: 'png',
                  name: text,
                  backgroundColor: 'rgba(128, 128, 128, 0)',
                  title: ''
                }
              }
            }
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        var picInfo = myChart.getDataURL();
        this.downloadFile(text, picInfo)
    },
    isNumber(val) {
    　　if (parseFloat(val).toString() == "NaN") {
    　　　　return false;
    　　} else {
    　　　　return true;
    　　}
    },
    downloadFile(title, url) { //下载base64图片
        // if (window.navigator.msSaveOrOpenBlob) {
        //   var bstr = atob(fileName.split(',')[1])
        //   var n = bstr.length
        //   var u8arr = new Uint8Array(n)
        //   while (n--) {
        //     u8arr[n] = bstr.charCodeAt(n)
        //   }
        //   var blob = new Blob([u8arr])
        //   window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
        // } else {
          // 这里就按照chrome等新版浏览器来处理
          const a = document.createElement('a')
          a.href = url
          a.setAttribute('download', title)
          a.click()
        // }
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
