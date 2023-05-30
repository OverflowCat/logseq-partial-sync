# logseq-partial-sync

## Demo

https://github.com/OverflowCat/logseq-partial-sync/assets/20166026/5d811f98-8170-4353-ad0f-719814acd00a

https://github.com/OverflowCat/logseq-partial-sync/assets/20166026/752a32fe-6987-44ff-b6ae-650a63730de6

## How to use

### Setup Vercel KV

Go to https://vercel.com/dashboard, add a new Storage.

![image](https://github.com/OverflowCat/logseq-partial-sync/assets/20166026/a8258392-e80d-4ac2-a913-04c166c27d79)

Click Create Database, select KV, then click Continue, select your preferred region.

![png (12)](https://github.com/OverflowCat/logseq-partial-sync/assets/20166026/16e57894-18f0-49cd-9520-01f415ba44d4)

Copy `Endpoint` and `Bearer`.

![image](https://github.com/OverflowCat/logseq-partial-sync/assets/20166026/b1decfcd-61b9-472d-8e7b-bd455caa269c)

### Setup custom.js

Copy [custom.js](./custom.js) in this project, and replace the first two lines with your own `Endpoint` and `Bearer`.

Manually put the `custom.js` to`GRAPH_PATH/logseq/custom.js` of all the copies of your graph. Then you can sync a page accross your devices. 
