const search = document.getElementById('search');
    const searchText = document.getElementById('searchText');
    const searchBtn = document.querySelector('.search-btn');
    const count = document.querySelector('#count')
    const countText = count.innerText;
    const datas = countText.split(',');
    const content = document.querySelector('.content');

    // 获取搜索到的全部数据
    let totalData = document.querySelector('#totalData').innerText;
    totalData = JSON.parse(totalData);
    if(totalData.length){
      curPageNum(1);
    }else{
      content.innerHTML = `<img style="width:300px;height:400px" src="/img/noExists.jpg" alt="" />`
    }
    
    function curPageNum(num){
      const total = totalData.length;
      const data = totalData.slice((num - 1) * 30,num * 30);
      let html = '';
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        html += `
          <div class="img-item">
            <img src=${element.cover} alt="" srcset="">
            <a href="${ datas[2] }details?id=${ element.id }&title=${ element.imgName }" >${ element.imgName }</a>
          </div>
        `;
      }
      console.log(data);
      content.innerHTML = html;
    }

    // 点击搜索
    searchBtn.addEventListener('click', () => window.location = `${ datas[2] }/search?text=${searchText.value}`);

    // 判断当前设备
    const sUserAgent = navigator.userAgent.toLowerCase();
    const isPc = sUserAgent.match(/windows/i) == 'windows';

    // 创建分页器
    const page = new Pagination({
      dom: '#page',
      chilClass:'child-ele',
      // link:`http://localhost:8000/?page=`,
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
      callbalck:curPageNum
    })
    page.init();

    // 创建返回顶部按钮
    const back = new BackTop();
    back.init()