const connections = require("./database");

class Service {
  /**
   * 将图片地址存入数据库
   * @param {*} url 图片地址
   * @param {*} title 图片类型
   * @param {*} website 来源网站
   */
  async addInfo(url, title, website, cover) {
    const statement = `INSERT INTO images(imgName,imgUrl,website,cover) VALUES(?,?,?,?)`;
    try {
      const [result] = await connections.query(statement, [
        title,
        url,
        website,
        cover,
      ]);
      return result.affectedRows === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addSeTuInfo(url, title, cover) {
    const statement = `INSERT INTO setuimgs(imgName,imgUrl,cover) VALUES(?,?,?)`;
    try {
      const [result] = await connections.query(statement, [title, url, cover]);
      return result.affectedRows === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getHomeImg(page, tableName) {
    const statement = ` SELECT id,imgName,cover FROM ${tableName} LIMIT ?,30;`;
    try {
      const [result] = await connections.query(statement, [(page - 1) * 30]);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async search(text, tableName) {
    text = text || "";
    const statement = `SELECT id,imgName,cover from ${tableName} WHERE imgName LIKE '${
      "%" + text + "%"
    }'`;
    try {
      const [result] = await connections.query(statement);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getImgByInfoId(id, tableName) {
    const statement = `SELECT imgUrl FROM ${tableName} WHERE infoId = ?`;
    try {
      const [result] = await connections.query(statement, [id]);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getTotalImg(tableName) {
    const statement = `SELECT COUNT(*) total FROM ${tableName}`;
    try {
      const [result] = await connections.query(statement);
      return result[0] && result[0].total;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addBook(obj) {
    const statement = `INSERT INTO books (author,name,pic,dowLink,synopsis) VALUES (?,?,?,?,?);`;
    try {
      const [result] = await connections.query(statement, [
        obj.author,
        obj.name,
        obj.pic,
        obj.dowLink,
        obj.synopsis,
      ]);
      return result.affectedRows === 1;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new Service();
