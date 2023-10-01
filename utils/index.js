// 延时器
const delayed = async (delay) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, delay);
  });
};

// 剩余功能：this-参数、返回值、取消功能

function throttle(fn, interval, options) {
  // 记录上一次的开始时间
  let lastTime = 0;
  let timer = null;
  const { leading, traling, callBack } = options;

  // 事件触发时，真正执行的函数
  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      // 获取当前事件触发时的时间
      const nowTime = new Date().getTime();
      // 判断第一次是否需要执行
      if (!lastTime && !leading) lastTime = nowTime;
      // 等待时间相差大于interval，只有经过设定时间nowTime - lastTime 才会大于 interval（设定间隔时间）
      // 使用当前触发的时间和之前的时间间隔以及上一次开始的时间，计算出还剩余多长时间去触发函数
      const remainTime = interval - (nowTime - lastTime);

      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        // 真正触发的函数
        const result = fn.apply(this, args);
        // 返回值
        if (callBack && typeof callBack === "function") callBack(result);
        resolve(result);
        // 保留上次触发时间
        lastTime = nowTime;
        // 判断最后一次是否需要执行，并且判断timer是否已经有值，防止产生多个定时器
      } else if (traling && !timer) {
        timer = setTimeout(() => {
          const result = fn.apply(this, args);
          // 返回值
          if (callBack && typeof callBack === "function") callBack(result);
          resolve(result);

          timer = null;
          // 根据第一次是否执行进行赋值
          lastTime = !leading ? 0 : new Date().getTime();
        }, remainTime);
      }
    });
  };

  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return _throttle;
}
const createUUID = () => {
  // Date.now()可以转为8位的36进制字符串，再补充4位的自增id即可
  const INITIAL_COUNTER = 46656; // parseInt('1000', 36); 36进制里的最小4位数对应的10进制数字，最大的4位数为parseInt('zzzz', 36)，即 1679615
  let counter = INITIAL_COUNTER;
  let lasttime = 0;
  return () => {
    const now = Date.now();
    if (now == lasttime) {
      counter++;
    } else {
      counter = INITIAL_COUNTER;
      lasttime = now;
    }

    return `${now.toString(36)}${counter.toString(36)}`;
  };
};

function findParentEl(el) {
  const classList = el.classList;
  let isOk = false;
  let eel = el;
  for (const className of classList) {
    if (className === "woo-pop-main") {
      isOk = true;
      break;
    }
  }
  if (!isOk) {
    eel = findParentEl(el.parentElement);
  }
  return eel;
}
function findChildren(el) {
  const classList = el.classList;
  let eel = el;
  let isOk = false;
  for (const className of classList) {
    if (className === "u-col-12") {
      isOk = true;
      break;
    }
  }
  if (!isOk) {
    const children = el.children.length > 1 ? el.children[1] : el.children[0];
    eel = findChildren(children);
  }
  return eel;
}

module.exports = {
  delayed,
  createUUID,
};
