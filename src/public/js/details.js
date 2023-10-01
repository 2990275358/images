const back = document.querySelector(".back");
back.addEventListener("click", () => window.history.back());
// 更具顶部标题高度设置内容内边距
const content = document.querySelector(".content");
const h1 = document.querySelector("h1");
content.style.paddingTop = h1.offsetHeight + 10 + "px";
// 拿到遮罩层相关内容，准备操作
const shade = document.querySelector(".shade");
const img = document.querySelector("#img");
const cha = document.querySelector(".cha");
const shadeContent = document.querySelector(".shade-content");
const shuzi = document.querySelector(".shuzi");
// 禁止浏览器滚动
let winX = null;
let winY = null;
window.addEventListener("scroll", function () {
  if (winX !== null && winY !== null) {
    window.scrollTo(winX, winY);
  }
});
function disableWindowScroll() {
  winX = window.scrollX;
  winY = window.scrollY;
}
function enableWindowScroll() {
  winX = null;
  winY = null;
}
// 拿到所有图片dom，为接下来做准备
const imgs = document.querySelectorAll(".img");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const body = document.querySelector("body");
let curindex = 0; // 现在图片的索引，默认为0
// 设置左上角数字指示器
function setShuZi(num, index) {
  shuzi.innerHTML = `${index}/${num}`;
}
function setCurImg(s) {
  const src = s.dataset.src;
  // 设置遮罩打开时的图片
  disableWindowScroll();
  shade.style.display = "block";
  shade.style.width = document.body.offsetWidth + "px"; // 根据当前屏幕宽度设置遮罩宽度
  changeSrc(src);
  for (let i = 0; i < imgs.length; i++) {
    // 找到打开的图片在所有图片中的索引
    const element = imgs[i];
    if (element.dataset.src === src) {
      curindex = i;
      setShuZi(imgs.length, curindex + 1);
      return; // 找到索引后就退出循环，减少循环次数
    }
  }
}
function changeSrc(src) {
  console.log(src);
  img.src = img.dataset.load;
  let curImg = new Image();
  curImg.src = src;
  curImg.onload = () => {
    img.src = src;
  };
}
// 图片链接错误时渲染
img.addEventListener("error", (e) => {
  img.setAttribute("src", "/img/noExists.jpg");
});
// 关闭遮罩
const close = () => {
  shade.style.display = "none";
  window.scroll({
    top: imgs[curindex].offsetTop,
  });
  enableWindowScroll();
};
cha.addEventListener("click", close);
shadeContent.addEventListener("click", () => {
  if (document.body.offsetWidth > 850) return;
  close();
});
// 点击切换图片
prev.addEventListener("click", prevImg);
next.addEventListener("click", nextImg);
let tStartX = 0;
let eStartX = 0;
let startTime = 0;
let endTime = 0;
let isZoom = false;
// 移动端手指滑动切换图片
shadeContent.addEventListener("touchstart", (e) => {
  startTime = e.timeStamp;
  tStartX = e.changedTouches[0].screenX;
});
shadeContent.addEventListener("touchend", (e) => {
  eStartX = e.changedTouches[0].screenX;
  endTime = e.timeStamp;
  if (e.changedTouches.length > 1) return;
  if (endTime - startTime > 500) return;
  if (eStartX > tStartX) {
    if (eStartX - tStartX < 100) return;
    prevImg();
  } else {
    if (tStartX - eStartX < 100) return;
    nextImg();
  }
});
function prevImg() {
  if (curindex === 0) return creatToast("已经是第一张图片了");
  img.setAttribute("src", imgs[curindex - 1].dataset.src);
  curindex--;
  setShuZi(imgs.length, curindex + 1);
}
function nextImg() {
  if (curindex >= imgs.length - 1) return creatToast("已经是最后一张图片了");
  setShuZi(imgs.length, curindex + 1);
  changeSrc(imgs[curindex + 1].dataset.src);
  curindex++;
  setShuZi(imgs.length, curindex + 1);
}
// 监听键盘方向键，控制图片前进
document.addEventListener("keydown", (e) => {
  const { keyCode } = e;
  if (keyCode === 65 || keyCode === 37) prevImg();
  if (keyCode === 68 || keyCode === 39) nextImg();
  if (keyCode === 27) close();
});
const backTop = new BackTop();
backTop.init();

// 图片懒加载
lazyLoadImg();
