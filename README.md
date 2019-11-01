# Hello!

![Hello](http://www.reactiongifs.com/r/hello-bear.gif)

Hello and thank you for your interest in Healthline!

To make sure we are all on the same page, we'd love for you to implement a very basic site.

We'd like you to implement a single page that will return a listing of an RSS feed. Each list item should also display at least one piece of data from the destination page for each entry in the RSS feed, this could be metadata or other extractable text. If looking for inspiration, here are a couple feeds:

- Tech: https://www.wired.com/feed/rss
- Food: https://www.bonappetit.com/feed/rss
- Sports: https://www.espn.com/espn/rss/news
- History: https://www.historytoday.com/feed/rss.xml


We've provided a scaffolding similar to what we use on www.healthline.com to give you some visibility into what our code and process looks like, but don't feel too bound to this!

Other general goals:

- Assume this is a public facing site that SEO will matter for.
- Assume that the initial render performance of the page is crucial.
- Should have basic styling, but doesn't need to be too complicated.
- Support both mobile and desktop form factors.

## Node

This is currently configured to run with 10.9.0 version of node. You might look into using `nvm` [node version manager](https://github.com/nvm-sh/nvm/) so you can run multiple version of node simultanously.

## Getting started

### Fork
https://help.github.com/en/github/getting-started-with-github/fork-a-repo

### Install

```bash
# install packages
yarn

# then, to work on it
yarn dev
```

This will launch the server at `http://localhost:3000` running in dev mode. This will watch your file system for most changes and automatically rebuild when necessary.

From there, please create a branch and eventually a PR of your work, then we can chat!

### Directory Structure
Server side methods/components are located:
```bash
./server/
```


The main entry point(s) for the client side are found in:
```bash
./pages/
```

The rest of the client side components/methods/variables are located:
```bash
./lib/
```



## Testing / Utils

* **Lint:** `yarn lint`
* **Format:** `yarn format`
* **Jest:** `yarn jest` / `yarn jest:watch`
    - creates snapshots of compiled components and diff changes in output between commits/builds
* **Storybook:** `yarn storybook`
    - generates compartmentalized components using stubbed data. Useful if you want to develop components in isolation.
