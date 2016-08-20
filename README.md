novel-spider
============

grab novel from ck101.com

自動抓取卡提諾的小說內容,並存成n個html檔.


安裝
------
執行`npm install`

用法
------

先修改"config.txt"
* url: 要抓的網址,把頁數的位置換成[i]
* maxpage: 要抓到第幾頁, -1代表自動判斷
* startpage: 從第幾頁開始抓



然後存檔&執行:

`node app-noresn.js` : 一頁一頁抓, 每頁一個檔
`node app-resn.js` : 一次3頁一起抓, 每頁一個檔
`node app-all-to-one.js` : 一頁一頁抓, 全部存一個檔


