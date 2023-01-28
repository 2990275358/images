const Service = require('../../sevice')
// const APP_HOST = 'http://localhost:8000/'
const APP_HOST = ' http://18bedc0b.r2.cpolar.top/'
class Controller{
  async getImge (req,res){
    let {page} = req.query
    if(!page) page = 1;
    const result = await Service.getHomeImg(Number(page),'personimg');
    const total = await Service.getTotalImg('personimg');
    res.render("home",{imgs:result,host:APP_HOST,search:'',total,curPage:page})
  }
  async getImgeDetails(req,res){
    const {id,title} = req.query;
    const result = await Service.getImgByInfoId(id,'personmoreimg');
    res.render("details",{title,imgs:result})
  }
  async searchImge(req,res){
    const {text} = req.query;
    const result = await Service.search(text,'personimg');
    // res.json({imgs:result,host:APP_HOST});
    res.render("search",{imgs:JSON.stringify(result),host:APP_HOST,search:text,total:result.length,curPage:1});
  }
}

module.exports = new Controller();