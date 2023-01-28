/**
 * 分页器（Pagination）优化版 减少了循环次数和dom渲染数
 * @params { String } dom 页码盒子的选择器
 * @params { String | Number } total 数据的总长度
 * @params { String | Number } size 一页需要展示的数据大小
 * @params { String | Number } curPage 当前的页码
 * @params { Boolea } isShowPrevNextBtn 是否显示前一页后一页按钮
 * @params { String | Number } howPage 需要显示多少个分页标签，最小值为3 默认3
 */
 class Pagination{
  constructor(obj){
    // 标签选择器
    this.dom = obj.dom;
    // 数据总长度
    this.total = Number(obj.total);
    // 每一页显示多少数据
    this.size = Number(obj.size) || 30;
    // 总共有多少页
    this.totalPage = Math.ceil(this.total / this.size);
    // 现在在那一页
    this.curPage = Number(obj.curPage) || 1;
    // 是否显示上一页下一页
    this.isShowPrevNextBtn = obj.isShowPrevNextBtn || false;
    // 上一页下一页按钮的类名
    this.btnClass = obj.btnClass || null
    // 子元素的类名
    this.chilClass = obj.chilClass || 'page-item';
    // 当前选中的类名
    this.activeClass = obj.activeClass || 'active'
    // 超链接点击的地址
    this.link = obj.link || '#';
    // 是否需要搜索跳转
    this.isShowSearch = obj.isShowSearch || false
    // 搜索跳转的类名
    this.searchClass = obj.searchClass || null;
    // 最多显示多少个分页标签
    this.howPage = this.handleHowPage(obj.howPage)
    // 需要执行的回调函数
    this.callbalck = obj.callbalck || null;
    console.log(this);
  }
  /**
   * 生成页码
   */
  init(){
    if(this.curPage > this.totalPage) return console.log('当前页码超过最大页码');
    // 总的数据小于一页数据没必要分页
    if(this.total < this.size) return;
    const page = document.querySelector(this.dom);
    page.innerHTML = '';
    // 添加上一页的按钮
    if(this.isShowPrevNextBtn) {
      const prevBtn = document.createElement('button');
      prevBtn.innerText = "上一页";
      prevBtn.setAttribute('class',this.btnClass?.prev || 'btn prev');
      prevBtn.addEventListener('click', () => {
        this.prevPage()
      })
      page.appendChild(prevBtn);
    }
    const a = document.createElement('a');
    a.classList.add(this.chilClass);
    a.innerHTML = `1`;
    a.setAttribute('href',this.link + 1);
    page.appendChild(a);
    for(let i = 1; i <= this.totalPage; i++){
      const a = document.createElement('a');
      a.classList.add(this.chilClass);
      a.innerHTML = `${i}`;
      a.setAttribute('href',this.link + i);
      if(this.curPage !== i && this.curPage - i > this.howPage.front || i - this.curPage > this.howPage.behind && i !== this.totalPage || i === 1) continue;
      page.appendChild(a);
    }
    const chils = document.querySelectorAll(`.${this.chilClass}`);
    // 添加前面的省略号
    if( this.curPage > 5) {
      const dot = document.createElement('a');
      dot.innerText = '···';
      dot.className = this.chilClass + ' dot';
      dot.addEventListener('click',() => {
        this.goToFront();
      })
      page.insertBefore(dot, chils[1])
    }
    // 添加后面的省略号
    if(this.totalPage - this.curPage > 4) {
      const dot = document.createElement('a');
      dot.innerText = '···';
      dot.className = this.chilClass + ' dot';
      dot.addEventListener('click',() => {
        this.goToBehind();
      })
      page.insertBefore(dot, chils[chils.length - 1])
    }
    // 添加下一页的按钮
    if(this.isShowPrevNextBtn) {
      const nextBtn = document.createElement('button');
      nextBtn.innerText = "下一页";
      nextBtn.setAttribute('class',this.btnClass?.next || 'btn next');
      nextBtn.addEventListener('click', () => {
        this.nextPage()
      })
      page.appendChild(nextBtn);
    }
    // 添加搜索
    if(this.isShowSearch){
      const search = document.createElement('input');
      search.setAttribute('class',this.searchClass || 'search');
      let timer;
      let text = '';
      search.addEventListener('input', (e) => {
        text += e.data;
        // 简单防抖
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
          this.gotoPage(text)
        }, 800)
      })
      page.appendChild(search);
    }
    // 为选中的元素添加类名
    document.querySelectorAll('.'+this.chilClass).forEach((el,i) => {
      if(el.innerText !== '···'){
        el.addEventListener('click',() => {
          this.gotoPage(el.innerText)
        })
      }
      if(Number(el.innerText) === this.curPage){
        el.classList.add(this.activeClass);
      }else{
        el.classList.remove(this.activeClass);
      }
    })
  }
  goToUrl(){
    window.location = this.link + this.curPage;
    this.init();
  }
  /**
   * 跳转页面
   * @param {*} num 
   * @returns 
   */
  gotoPage(num){
    const pageNum = Number(num);
    if(pageNum === this.curPage) return;
    this.curPage = pageNum;
    if(this.callbalck) this.callbalck(Number(this.curPage));
    this.goToUrl();
  }
  /**
   * 向后前进
   * @param {*} num 前进多少格 
   * @returns 
   */ 
  nextPage(num = 1){
    const pageNum = Number(num);
    if(this.curPage === this.totalPage) return;
    this.curPage += pageNum;
    if(this.callbalck) this.callbalck(Number(this.curPage));
    this.goToUrl();
  }
  /**
   * 向前前进
   * @param {*} num 前进多少格
   * @returns 
   */
  prevPage(num = 1){
    const pageNum = Number(num);
    if(this.curPage === 1) return
    this.curPage -= pageNum;
    if(this.callbalck) this.callbalck(Number(this.curPage));
    this.goToUrl();
  }
  /**
   * 跳转到第二条
   */
  goToFront(){
    this.curPage = 2;
    if(this.callbalck) this.callbalck(Number(this.curPage));
    this.goToUrl()
  }
  /**
   * 跳转到倒数第二条
   */
  goToBehind(){
    this.curPage = this.totalPage - 1;
    if(this.callbalck) this.callbalck(Number(this.curPage));
    this.goToUrl()
  }
  /**
   * 处理最多显示多少页的数据
   * @param {*} num 
   * @returns 
   */
  handleHowPage(num = 3){
    const result = {
      front:0,
      behind:0
    };
    if(!num || num <= 3 || num >= this.totalPage){
      result.front = 1; 
      result.behind = 1;
      return result;
    }
    const isEvenNumber = num % 2 === 0;
    const half = Math.floor(num / 2);
    if(isEvenNumber){
      result.front = half - 1; 
      result.behind = half;
    }else{
      result.front = half - 1; 
      result.behind = half + 1;
    }
    return result;
  }
}

// ES6模块化使用
// export default Pagination;

// node模块化使用
// module.exports = Pagination;



