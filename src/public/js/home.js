const search = document.getElementById("search");
const searchText = document.getElementById("searchText");
const content = document.querySelector(".content");
const searchBtn = document.querySelector(".search-btn");
const imgItems = document.querySelectorAll(".img-item");
const count = document.querySelector("#count");
const countText = count.innerText;
const datas = countText.split(",");
searchBtn.addEventListener("click", click);
function click() {
  let url = searchText.value
    ? `/search?oldPage=${datas[1]}&text=${searchText.value}`
    : `?page=${datas[1]}`;
  window.location.href = url;
}

for (let i = 0; i < imgItems.length; i++) {
  const element = imgItems[i];
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(element.querySelector("a").href, "_self");
  });
}

const sUserAgent = navigator.userAgent.toLowerCase();
const isPc = sUserAgent.match(/windows/i) == "windows";
const page = new Pagination({
  dom: "#page",
  chilClass: "child-ele",
  link: `?page=`,
  total: datas[0],
  size: 30,
  curPage: datas[1],
  isShowPrevNextBtn: true,
  btnClass: {
    prev: "btn prev-btn",
    next: "btn next-btn",
  },
  isShowSearch: isPc,
  searchClass: "page-to-input",
  active: "active",
  // callbalck
});
page.init();
const back = new BackTop();
back.init();

lazyLoadImg();
