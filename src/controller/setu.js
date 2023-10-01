const Service = require("../sevice");
const { APP_HOST } = require("../app/config");
class Controller {
  async getImge(req, res) {
    let { page } = req.query;
    if (!page) page = 1;
    const result = await Service.getHomeImg(Number(page), "setuimg");
    const total = await Service.getTotalImg("setuimg");
    res.render("home", {
      imgs: result,
      host: APP_HOST + ":8000/setu/",
      search: "",
      total,
      curPage: page,
    });
  }
  async getImgeDetails(req, res) {
    const { id, title } = req.query;
    const result = await Service.getImgByInfoId(id, "setumoreimg");
    res.render("details", { title, imgs: result });
  }
  async searchImge(req, res) {
    const { text } = req.query;
    const result = await Service.search(text, "setuimg");
    // res.json({imgs:result,host:APP_HOST});
    res.render("search", {
      imgs: JSON.stringify(result),
      host: APP_HOST + ":8000/setu/",
      search: text,
      total: result.length,
      curPage: 1,
    });
  }
}

module.exports = new Controller();
