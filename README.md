# HELLO
### this is a nodejs-express-typescript projectwhich yu can use an a starting point by cloning or follow te steps i sued to set it up below

  ```mmkdir mkdir node-express-typescript ```<br/>
```cd node-express-typescript/```<br/>
```npm init --yes```<br/>

### then we install some packages

  ``` npm install express dotenv ```<br/>
 ``` npm i -D typescript @types/express @types/node ```<br/>
 ``` npm install -D concurrently nodemon```<br/>


then run 
```npx tsc --init ```<br/>
to configure typescript

don't forget to add the outdir option
```{
  "compilerOptions": {
    "outDir": "./dist"

    // rest options remain same
  }
}
```
<br/>

and the scripts
```
{
  "scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\""
  }
}
```
<br/>
