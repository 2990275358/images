const search = document.getElementById('search');
    const searchText = document.getElementById('searchText');
    const content = document.querySelector('.content');
    const searchBtn = document.querySelector('.search-btn');
    const imgItems = document.querySelectorAll('.img-item');
    const count = document.querySelector('#count');
    const countText = count.innerText;
    const datas = countText.split(',');
    searchBtn.addEventListener('click', click);
    function click(){
      // window.open(`http://localhost:8000/search?text=${searchText.value}`);
      window.location = `${datas[2]}search?text=${searchText.value}`
    }
    
    for (let i = 0; i < imgItems.length; i++) {
      const element = imgItems[i];
      element.addEventListener('click',() => window.location = element.querySelector('a').href)
    }

    const sUserAgent = navigator.userAgent.toLowerCase();
    const isPc = sUserAgent.match(/windows/i) == 'windows';
    const page = new Pagination({
      dom: '#page',
      chilClass:'child-ele',
      link:`${datas[2]}?page=`,
      total:datas[0],
      size:30,
      curPage:datas[1],
      isShowPrevNextBtn:true,
      btnClass:{
        prev:'btn prev-btn',
        next:'btn next-btn',
      },
      isShowSearch:isPc,
      searchClass:'page-to-input',
      active:'active',
      // callbalck
    })
    page.init();
    const back = new BackTop();
    back.init()