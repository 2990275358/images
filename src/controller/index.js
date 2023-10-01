const Service = require("../sevice");
const { APP_HOST, LOADING_IMG } = require("../app/config");
class Controller {
  async getImge(req, res) {
    let { page } = req.query;
    if (!page) page = 1;
    let result = await Service.getHomeImg(Number(page), "personimg");
    let total = await Service.getTotalImg("personimg");
    res.render("home", {
      imgs: result,
      host: APP_HOST + ":8000/",
      search: "",
      total,
      curPage: page,
      loadingImg: LOADING_IMG,
    });
  }
  async getImgeDetails(req, res) {
    const { id, title } = req.query;
    const result = await Service.getImgByInfoId(id, "personmoreimg");
    res.render("details", { title, imgs: result, loadingImg: LOADING_IMG });
  }
  async searchImge(req, res) {
    const { text, page, oldPage } = req.query;
    const result = await Service.search(text, "personimg");
    res.render("search", {
      imgs: JSON.stringify(result),
      host: APP_HOST + ":8000/",
      search: text,
      total: result.length,
      page,
      oldPage,
      loadingImg: LOADING_IMG,
    });
  }
}

module.exports = new Controller();
