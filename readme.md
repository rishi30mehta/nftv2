# Guideline

This is a basic arbiscan scrapper with given contract address search.

Things you'll need:

* [Node.js](https://nodejs.org)


## Step to Follow

> navigate to application directory and install dependencies run using following command in cmd `npm install`

> to execute the code scrapper run following command in cmd in the root directly of the application `node scraper.js`


## API

A very basic api is written to get the token holders record
there are two only two end points 

/api/holders => return json object with  holders ids and token count each holder has

/api/holders/:id => return json object with the total token count for holder id

to access the api run `node server.js` 
server is running at 8000 port, you may access server at localhost:8000

localhost:8000/api/holders
this should return json object with complete list of holders and their token count

localhost:8000/api/holder/0x74be0af0bf7254328ddffc09425ff71d64a1a836
this should return 
{"message":"success","data":{"count":190}}



## TODO List

> Scaper is currenly navigating through all pages regardless we have data already download or not. best way it to check the change and update the new record
> scheduler is not implemented

