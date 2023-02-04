const URL = require("url");
const path = require("path");
const fs = require("fs");

const puppeteer = require('puppeteer');
const service = require('./sevice');

const {
  delayed
} = require('./utils');

const options = {
  headless:true,
  slowMo:150
};
const debugOptions = {
  headless:false,
  defaultViewport:{
    width:1000,
    height:800
  },
  slowMo:150
}
const BaseUrl = "https://sobooks.net/";
;(async ()=> {
  const browser = await puppeteer.launch(options)
  // 广告拦截
  async function requestIntercept(page){
    await page.setRequestInterception(true);
    page.on("request", interceptedRequest => {
      const urlobj = URL.parse(interceptedRequest.url());
      if(urlobj.hostname === "googleads.g.doubleclick.net"){
        interceptedRequest.abort();
      }else{
        interceptedRequest.continue();
      }
    })
  }
  // 获取总页数
  async function getTotalNum(){
    const page = await browser.newPage();
    requestIntercept(page)
    try{
      await page.goto(BaseUrl);  
      const totalCount = await page.$eval(".pagination ul li:last-child span", ele => {
        return ele.innerHTML.split(" ")[1]
      });
      page.close();
      return Number(totalCount);
    }catch(err){
      console.log(err,"获取总页数失败~");
      return 0;
    }
  }
  // 获取每一页的每本书的详情页URL
  async function getBookDetailUrl(url){
    const page = await browser.newPage();
    requestIntercept(page);
    try {
      await page.goto(url);
      const arr = await page.$$eval(".thumb-img.focus>a", ele => {
        const bookUrl = [];
        ele.forEach(el => {
          bookUrl.push(el.getAttribute("href"));
        })
        return bookUrl
      })
      page.close();
      return arr
    } catch (err) {
      console.log(err,"每一页的每本书的详情页URL失败~");
      return [];
    }
  }
  // 整合所有书本详情URL并调用跳转方法
  async function getHomePage(){
    const totalCount = await getTotalNum();
    // const totalCount = 1;
    // 拿到每本书的详情URL
    for(let i = 1; i <= totalCount; i++){
      const arr = await getBookDetailUrl(BaseUrl + `page/${i}`);
      // 跳转
      for(let j = 0; j < arr.length;j++){
        await delayed(1000)
        goToBookDetail(arr[j]);
      }
    }
  }

  // 进入书的详情页
  async function goToBookDetail(url){
    const page = await browser.newPage();
    // 为了验证通过需要设置cookie
    const cookie0 = {
        name: "result",
        value: "83",
        domain: "sobooks.net",
        path: "/",
        expires: Date.now() + 3600 * 1000
    };
    const cookie1 = {
        name: "mpcode",
        value: "958657",
        domain: "sobooks.net",
        path: "/",
        expires: new Date("2023-02-03T04:27:27.007Z").getTime()
    };
    await page.setCookie(cookie0,cookie1);
    // 拦截广告
    requestIntercept(page);
    try {
      await page.goto(url);
      // 图书封面
      const bookpic = await page.$eval(".bookpic img", ele => {
        return ele.getAttribute("src")
      });
      // 图书其他信息
      const bookInfo = await page.$$eval(".bookinfo ul li", ele => {
        const arr = [];
        ele.forEach(el => {
          let text = el.innerText
          arr.push(text.substring(text.indexOf("：")).replace("：",""));
        })
        return arr;
      })
      const synopsis = await page.$eval(".content p:nth-child(3)",ele => ele.innerText);
      // 等待被选择的元素加载出来
      await page.waitForSelector(".e-secret");
      // 判断是否有epub格式的下载连接
      const isNoDeup = await page.$eval(".e-secret",el => {
        const reg = /(提取密码：)/;
        const text = el.innerText;
        return reg.test(text);
      });
      // 获取下载链接
      let dowLink = null;
      if(!isNoDeup){
        dowLink = await page.$eval(".e-secret a:last-child", ele => ele.getAttribute("href").split("?url=")[1]);
      }else{
        dowLink = await page.$eval(".content p:nth-last-child(4) a:nth-child(3)", ele => ele.getAttribute("href").split("?url=")[1]);
      }
      await service.addBook({
        pic: bookpic,
        name:bookInfo[0],
        author:bookInfo[1],
        dowLink,
        synopsis
      });
      console.log(bookInfo[0]+"写入成功~");
      // page.close();
    } catch (err) {
      console.log(err,"将书本数据写入数据库失败~",url);
    }
  }
  // 开始程序
  getHomePage();
  // goToBookDetail("https://sobooks.net/books/1950.html");
})();