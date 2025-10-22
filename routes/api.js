/*
 * Complete the API routing below
 */

'use strict';

module.exports = function (app) {

  // In-memory books store for testing without a DB
  // Structure: { id: { _id, title, comments: [] } }
  const books = {};
  let idCounter = 1;

  function generateId() {
    return (idCounter++).toString();
  }

  app.route('/api/books')
    .get(function (req, res){
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const arr = Object.values(books).map(b => ({
        _id: b._id,
        title: b.title,
        commentcount: b.comments.length
      }));
      res.json(arr);
    })
    
    .post(function (req, res){
      let title = req.body.title;
      // response will contain new book object including at least _id and title
      if(!title) {
        return res.status(200).type('text').send('missing title');
      }
      const _id = generateId();
      const book = { _id, title, comments: [] };
      books[_id] = book;
      res.json({ _id: book._id, title: book.title });
    })
    
    .delete(function(req, res){
      // if successful response will be 'complete delete successful'
      for(const k of Object.keys(books)) delete books[k];
      res.type('text').send('complete delete successful');
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      const book = books[bookid];
      if(!book) {
        return res.type('text').send('no book exists');
      }
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      const book = books[bookid];
      if(!book) {
        return res.type('text').send('no book exists');
      }
      if(!comment) {
        return res.status(200).type('text').send('missing comment');
      }
      book.comments.push(comment);
      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      const book = books[bookid];
      if(!book) {
        return res.type('text').send('no book exists');
      }
      delete books[bookid];
      res.type('text').send('delete successful');
    });
  
};
