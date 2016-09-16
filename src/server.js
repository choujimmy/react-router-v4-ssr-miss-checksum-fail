import express from 'express';
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerRouter, createServerRenderContext } from 'react-router'
import App from './App.js';

const app = express();

const html = (content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
  <title>Document</title>
</head>
<body>
  <div id="root">${content}</div>
  <script src="/static/bundle.js"></script>
</body>
</html>`;

app.use('/static', express.static(`${__dirname}/static`));
app.use('/', (req, res) => {
  // first create a context for <ServerRouter>, it's where we keep the
  // results of rendering for the second pass if necessary
  const context = createServerRenderContext()

  // render the first time
  let markup = renderToString(
    <ServerRouter
      location={req.url}
      context={context}
    >
      <App/>
    </ServerRouter>
  )

  // get the result
  const result = context.getResult()

  // the result will tell you if it redirected, if so, we ignore
  // the markup and send a proper redirect.
  if (result.redirect) {
    res.writeHead(301, {
      Location: result.redirect.pathname
    })
    res.end()
  } else {

    // the result will tell you if there were any misses, if so
    // we can send a 404 and then do a second render pass with
    // the context to clue the <Miss> components into rendering
    // this time (on the client they know from componentDidMount)
    if (result.missed) {
      res.writeHead(404)
      markup = renderToString(
        <ServerRouter
          location={req.url}
          context={context}
        >
          <App/>
        </ServerRouter>
      )
    }
    res.write(html(markup))
    res.end()
  }
});

app.listen(3000);
