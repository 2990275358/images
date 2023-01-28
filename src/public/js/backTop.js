
class BackTop {
  constructor(obj = {}){
    this.selector = obj.selector || '';
    this.lastPosition = 0;
    console.log(this);
  }
  init(){
    const back = document.createElement('div');
    back.classList.add('back-top');
    back.innerText = '返回顶部';
    back.setAttribute('style',`position: fixed;
    bottom: 100px;
    right: 60px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #305A56;
    text-align: center;
    line-height: 60px;
    font-size: 12px;
    cursor: pointer;
    color: #91AD70;
    display:none`);
    back.addEventListener('click', () => {
      this.returnTop();
    })
    document.body.appendChild(back);
    document.addEventListener('scroll',() => {
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if(this.isRecordLast || scrollTop > 300) {
        back.style.display = 'block';
        return;
      };
      if(scrollTop > 300){
        back.style.display = 'block';
      }else{
        back.style.display = 'none';
      }
    })
  }
  returnTop(num = 100){
    let timer = null;
    timer = setInterval(() => {
      let top = document.body.scrollTop || document.documentElement.scrollTop
      if (top > num) {
        document.body.scrollTop = document.documentElement.scrollTop = top - num;
      }else{
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        clearInterval(timer);
      }
    },5)
  }
}