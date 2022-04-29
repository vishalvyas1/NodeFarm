/// SERVER
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
var card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
var productTemp = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
var overviewTemp = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const dataObj = JSON.parse(data);

const slug = dataObj.map(el => slugify(el.productName, {lower:true}));
console.log(slug);
const server = http.createServer((req, resp) => {
    const pathName = req.url;
    console.log(`Node app recieved the request ${req.method} : ${pathName}`);

    
    const {query, pathname} = url.parse(req.url, true);
    
    if (pathname === '/' || pathname === '/overview'){
        resp.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = dataObj.map(el => replaceTemplate(card, el)).join('');
        const output = overviewTemp.replace('{%PRODUCT_CARDS%}', cardsHtml);
        resp.end(output);
    }
    else if(pathname === '/product'){
        const product = dataObj[query.id]
        resp.writeHead(200, {
            'Content-type': 'text/html'
        })
        const output = replaceTemplate(productTemp, product);
        resp.end(output);

    }
    else if(pathname === '/api'){
        resp.writeHead(200, {
            'Content-type': 'application/json'
        })
        resp.end(data);
    }
    else{
        resp.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world-my-header' 
        });
        resp.end('<h1>Page not found.</h1>')
    }
    // resp.end('Hello World Vishals first Node Prog here.');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Node server started and listning at port 8000.')
})






// const textIn = fs.readFileSync('./txt/nodeTest.txt', 'utf-8');

// console.log(textIn);

// const textOut = `This is what we are gonna write ${textIn}`;

// fs.writeFileSync('./txt/nodeTest.txt', textOut)