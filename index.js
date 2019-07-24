// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db');

// save body as a string
server.use(express.json());

server.get('/', (req, res) => {
 res.send('Home page');
});

server.get('/api/users', (req, res) => {
 db
  .find()
  .then(users => {
   res.status(200).json(users);
  })
  .catch(err => {
   res
    .status(500)
    .json({ error: 'The users information could not be retrieved.' });
  });
});

server.get('/api/users/:id', (req, res) => {
 const { id } = req.params;
 db
  .findById(id)
  .then(user => {
   if (user) {
    res.status(200).json(user);
   } else {
    res
     .status(404) // 404 - (Not Found)
     .json({ message: 'The user with the specified ID does not exist.' });
   }
  })
  .catch(err => {
   res
    .status(500)
    .json({ error: 'The user information could not be retrieved.' });
  });
});

server.post('/api/users', (req, res) => {
 const { name, bio } = req.body; // const body = req.body
 const newObj = { name, bio };
 //db requires name only
 if (!name && !bio) {
  // if (!body) {
  res
   .status(400) // 400 - (Bad Request)
   .json({ errorMessage: 'Please provide name and bio for the user.' });
  return;
 }
 db
  .insert(newObj)
  .then(user => {
   res.status(202).json(user);
  })
  .catch(err => {
   res.status(500).json({
    error: 'There was an error while saving the user to the database',
   });
  });
});

server.delete('/api/users/:id', (req, res) => {
 const { id } = req.params;

 db
  .remove(id)
  .then(deleted => {
   if (deleted) {
    res.status(204).end();
   } else {
    res
     .status(404)
     .json({ message: 'The user with the specified ID does not exist.' });
   }
  })
  .catch(err => {
   res.status(500).json({ error: 'The user could not be removed' });
  });
});

server.put('/api/users/:id', (req, res) => {
 const { id } = req.params;
 const updatedBody = req.body;

 if (!updatedBody) {
  res
   .status(400)
   .json({ errorMessage: 'Please provide name and bio for the user.' });
  return;
 }
 db
  .update(id, updatedBody)
  .then(updated => {
   if (updated) {
    res.status(200).json(updated);
   } else {
    res
     .status(404)
     .json({ message: 'The user with the specified ID does not exist.' });
   }
  })
  .catch(err => {
   res
    .status(500)
    .json({ error: 'The user information could not be modified.' });
  });
});

server.listen(5000, () => {
 console.log('Server is listening on port 5000');
});
