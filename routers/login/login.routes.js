const fs = require('fs/promises');
const express = require('express');
const auth = require('../../middlewares/auth');

const users = [...require('../../data/users.json')];

const app = express();
app.use(express.static('public'));

// Template engines
app.set('views', './views');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('login', { sessionUser: false });
  console.log('login')
});
// app.get('/profile', auth, async (req, res) => {
//   const user = await req.session.user;
//   res.render('profile', { sessionUser: user });
// });

app.get('/login', async (req, res) => {
  const user = await req.session.user;
  if (user) {
    res.render('login', { 
      sessionUser: user,
      user: {name:'nombre'}
    });
  } else {
    res.render('login', { sessionUser: false });
  }
})

app.get('/logout', auth, async (req, res) => {
  try {
    await fs.writeFile('../../data/users.json', JSON.stringify(users));
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        res.clearCookie('my-session');
      }
      else {
        res.clearCookie('my-session');
        res.redirect('/');
      }
    })
  }
  catch(err) {
    console.log(err);
  }
});

app.get('/unauthorized', (req, res) => {
  res.status(401).sendFile(__dirname+'/public/unauthorized.html');
});

app.get('/notenoughfunds', auth, (req, res) => {
  res.status(400).sendFile(__dirname+'/public/notenough.html');
});

app.get('/error', (req, res) => {
  res.status(500).sendFile(__dirname+'/public/error.html');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (!user) return res.redirect('/error');
  req.session.user = user;
  res.redirect('/login');
});

module.exports = app;