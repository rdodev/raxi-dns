raxi-dns (v0.0.1)
=========

Rackspace Cloud DNS Interactive Command Line

Introduction
============
This is an very early release (in case the 0.0.1 version number wasn't explicit enough), so **expect** things to break and/or not work as expected. In a sense, this is more of a proof-of-concept than an actual product.

Installation
=============
 * Clone this repo and cd into it.
 * Run `npm install`
 

Usage
======
 * Within the same directory above, run `node dns-cli`

Settings (optional)
========
 Every time you use this program, you'll need to provide your Rackspace username, API Key and default region. 
 If you are planning on using this utility several times, a settings file is provided, which can be used to store your rackspace API credentials. Inside this directory there is a file called `settings.js.example`. Rename to `settings.js` and fill in the fields as needed. After you fill your credentials, the program shouldn't ask for your rackspace credentials in subsequent runs.
