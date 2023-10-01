// 在页面创建一个toast
function creatToast(text = "", delay = 800) {
  const toast = document.createElement("div");
  toast.innerText = text;
  toast.setAttribute("class", "toast");
  toast.setAttribute(
    "style",
    `
    padding: 5px 10px;
    color: white;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%,-350%);
    margin: 0 auto;
    z-index: 999;
  `
  );
  body.appendChild(toast);
  setTimeout(() => {
    body.removeChild(toast);
  }, delay);
}

function lazyLoadImg() {
  const imgs = document.querySelectorAll("img");
  for (const img of imgs) {
    const ob = new IntersectionObserver((e) => {
      if (e[0].intersectionRatio <= 0) return;
      img.src = img.dataset.src;
      ob.unobserve(img);
    });
    ob.observe(img);
  }
}
