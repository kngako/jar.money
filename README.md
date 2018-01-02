# Money Jar (jar.money)
Drop a few coins in the money jar.

# Getting Started
Make sure you are using the latest stable build for node and npm before you get to building. Then get all dependencies through...
```
npm install
```

Set up the database you will be using and provide the values in the config/default.json or config/development.json or config/production.json depending on which NODE_ENV you choose to work in. 

If you don't wanna set up a database then you can run this site on a sqlite db as it's already setup in config/default.json. Just set up the db/ directory in the project root directory like so

```
mkdir db
```

Of course the site needs a super admin so run the following to get your superadmin account setup.

```
node create-super-admin.js
```

To run the site run this command.
```
npm start
```

If all is well you should now be able to access the site on: http://localhost:8787
