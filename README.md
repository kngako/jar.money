# Money Jar (jar.money)
Drop a few coins in the money jar.

# Getting Started
First get all dependencies through...
```
npm install
```

Set up the database you will be using and provide the values in the config/default.json or config/development.json or config/production.json depending on where you are. If you are gonna be using sqlite as I'm using it, then create a "db" directory.

Of course the system needs a super admin so run the following to get yourself setup.

```
node create-super-admin.js
```

To run the site run this command.
```
npm start
```

If all is well you should now be able to access the site on: http://localhost:8787
