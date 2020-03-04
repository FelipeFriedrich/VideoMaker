const algorithmia = require('algorithmia');
const {apyKey} = require('../credentials/credations');
function robot(content){
    fetchContentFromWikipedia(content);


    async function fetchContentFromWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(apyKey);
        const wikipediaAlgorithn = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
        const wikipediaResponde = await wikipediaAlgorithn.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponde.get();
        console.log(wikipediaContent);
    }

}

module.exports = robot;