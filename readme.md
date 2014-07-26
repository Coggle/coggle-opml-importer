## Coggle OPML Importer

### What is it?

Coggle OPML importer is a node.js demo application for the Coggle API that imports [OPML outline markup files](http://en.wikipedia.org/wiki/OPML) into [Coggle](http://coggle.it).

The user is authenticated to the Coggle API using OAuth. The [passport-coggle-oauth2](https://github.com/coggle/passport-coggle-oauth2) module is used to authorize users, and retrieve an access token that can be sent along with requests to prove that the application is allowed create Coggles for the logged-in user.

### Try It [Here](http://opmloggle.herokuapp.com)!

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
[http://coggle.it/developer](http://coggle.it/developer), where you can also
configure the authentication redirect URL, which should be the domain (and
optionally port) where you will host the application followed by
`/auth/coggle/callback`, which is the Coggle oauth authentication callback
route of the app. For example, to run the app locally you would set it to this:

```
localhost:5000/auth/coggle/callback
```

The Client ID and Client Secret both need to be provided as environment variables when you
run the app. If they are missing the app will refuse to start. If they are incorrect, requests made by the app will fail. For example, to start the app in development mode run:

```bash
COGGLE_CLIENT_ID=aaaaaaaaaaaaaaaaaaaaaaaa \
COGGLE_CLIENT_SECRET=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb \
npm devstart
```

### License
[The MIT License](http://opensource.org/licenses/MIT)


