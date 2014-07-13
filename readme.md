## Coggle OPML Importer

### What is it?

Coggle OPML importer is a node.js demo application for the Coggle API that imports [OPML outline markup files](http://en.wikipedia.org/wiki/OPML) into [Coggle](http://coggle.it).

The user is authenticated to the Coggle API using OAuth. The [passport-coggle-oauth2](https://github.com/coggle/passport-coggle-oauth2) module is used to authorize users, and retrieve an access token that can be sent along with requests to prove that the application is allowed create Coggles for the logged-in user.

### Get the Code! 
First install [node.js](http://nodejs.org/download/), then:
```bash
git clone git@github.com:Coggle/coggle-opml-importer.git
cd coggle-opml-importer
npm install
```

### Running Coggle OPML Importer
To use the Coggle API you need a Client ID, and a Client Secret – which Coggle uses to identify requests to the applications that made them.

A new Client ID and Client Secret can be created at
[http://coggle.it/developer](http://coggle.it/developer). The redirect URL
should be the domain (and optionally port) where you will host the application
(for example, `localhost` or `localhost:5000` for testing) followed by
`/auth/coggle/callback`, which is the Coggle oauth authentication callback
route of the app.

This ID and secret pair needs to be provided as environment variables when you
run the app. If they are missing the app will refuse to start.

```bash
COGGLE_CLIENT_ID=aaaaaaaaaaaaaaaaaaaaaaaa \
COGGLE_CLIENT_SECRET=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb \
node app.js
```


### License
[The MIT License](http://opensource.org/licenses/MIT)


