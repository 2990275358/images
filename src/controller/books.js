const booksService = require("../sevice/books.service");
class BooksController {
  async getBooks(req, res) {
    let { page } = req.query;
    if (!page) page = 1;
    const data = await booksService.getBooks(page);
    const total = await booksService.getTotalBooks();
    res.render("booksHome", {
      data,
      total,
    });
  }
}

module.exports = new BooksController();
