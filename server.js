const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
const bodyParser = require('body-parser');

// we import the BlogPosts model, which we'll
// interact with in our GET endpoint
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to BlogPosts
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
BlogPosts.create('Tesla Car','Tesla Car sales increase by 40%','Nebiyou ELias', '5/23/19');
BlogPosts.create('Election2020','The Race for the White House has begun','Eli Shiffer','3/21/18');
BlogPosts.create('Moon Landing','We are traveling to the moon pretty soon','papi paps','11/11/2018');

// when the root of this route is called with GET, return
// all current BlogPosts items by calling `BlogPosts.get()`
app.get('/BlogPosts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/BlogPosts', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['title', 'content','author','publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
  });

  app.delete('/BlogPosts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted Blog \`${req.params.id}\``);
    res.status(204).end();
  });
  
  app.put('/BlogPosts/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author','id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    if (req.params.id !== req.body.id) {
      const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating Blog \`${req.params.id}\``);
    BlogPosts.update({
      id: req.params.id,
      title: req.body.name,
      content: req.body.budget,
      author: req.body.content,
      
    });
    res.status(204).end();
  });
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
