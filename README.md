GENI Reverse Proxy
==================

Reverse proxy for use in [GENI](http://www.geni.net/), to allow multiple web applications to effectively share one public IP.

Use
---

This package is designed to be as easy to deploy as possible.  On any server with node installed, just run `npm install` and all the dependencies will be installed.

To start, simply run `node frontend.js`.  This will start up the entire application, as the frontend executes all other modules as children.

####Configuration

* #####Setup

 The reverse proxy can be easily configured in two ways.  Either copy or rename the `default_config.json` file to  `config.json` and set the variables there.  Or, if you prefer, flags can be passed to `frontend.js`, at which point they will override any settings that may have been made in `config.json`.  Flags are passed as expected, eg:

```
node frontend.js --ip=localhost --port=8080 --auth_key=0
```

* #####Options

 There are three configuration options that may be set.  They are:

  * `ip` - the IP to listen on.  Defaults to `localhost`.
  * `port` - the port to listen on.  Defaults to `8080`, although this is generally best set to `80` when you are not testing.
  * `auth_key` - the auth key.  This is used to verify that the person sending the modification request to the API is, in fact, authorized to do so.  This should be kept secret.  Defaults to `0`, but should certainly be changed.
  
####Making API Requests

Send GET or POST requests to the API.  The requests and structure are listed below.

All requests return a paramater `worked`, which can be used to check if the request succeeded.

 * `/api/list` - `GET` - Get a list of all slice/IP pairs currently being used.  Returns an object containing `items` (the slice/IP pairs) in addition to `worked`.
 * `/api/remove` - `POST` - Remove a slice/IP pair.  Requires `key` (the name of the slice being removed) and the correct `auth_key`.  Returns an object containing a `message` that describes what happened, the `key` that you attempted to remove, and `worked`.
 * `/api/add` - `POST` - Add a slice/IP pair.  Requires `key` (the name of the slice being added), `ip` (the IP of the local VM that should be routed to), and the correct `auth_key`.  Returns an object containing a `message` that describes what happened, the `key` and `ip` that you attempted to add, and ```worked`.