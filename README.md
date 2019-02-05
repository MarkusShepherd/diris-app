# Diris App #

A mobile adaptation of the popular board game [Dixit](https://recommend.games/#/game/39856). Players submit photos either from their camera, from their gallery, or from a selection of publicly available images.

## Setup ##

First, install [Phonegap](http://phonegap.com/). Then:
```bash
git clone git@gitlab.com:mshepherd/diris-app.git
cd diris-app
phonegap prepare
phonegap serve
```
In the terminal you should see a URL. Navigate to that URL in the browser, or use it in the [Phonegap developer app](http://docs.phonegap.com/references/developer-app/).

## Server ##

The backend code is hosted in its own [repository](https://gitlab.com/mshepherd/diris-server).