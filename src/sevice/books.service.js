const connections = require("./database");

class BooksService {
  async getBooks(page) {
    const statement = ` SELECT id,author,name,pic,dowLink,synopsis FROM books LIMIT ?,30;`;
    try {
      const [result] = await connections.query(statement, [(page - 1) * 30]);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getTotalBooks() {
    const statement = `SELECT COUNT(*) total FROM books`;
    try {
      const [result] = await connections.query(statement);
      return result[0] && result[0].total;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new BooksService();
