# program-ids
Get IDs of broadcast records from a BBC radio page for use with [get_iplayer](https://github.com/get-iplayer/get_iplayer)

# Requirements

* node.js Node 8.9.0+ (async/await usage with [puppeteer](https://github.com/puppeteer/puppeteer))

# Installation

    git clone https://github.com/Vaviloff/program-ids.git && cd program-ids && npm i

# Usage

    const getIds = require('program-ids');
  
    (async() => {
        const ids = await getIds('https://www.bbc.co.uk/programmes/m000btvz/episodes/player');
        console.log(ids);
    })()
    
or

    getIds('https://www.bbc.co.uk/programmes/m000btvz/episodes/player').then((ids) => console.log(ids))
    
# Options

* url - an URL to search for IDs, *required*

# Results

* Array of IDs as strings.

[![CircleCI](https://circleci.com/gh/Vaviloff/program-ids.svg?style=shield)](https://circleci.com/gh/Vaviloff/program-ids)
