const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const watsonApiKey = require('../credentials/watson-nlu.json').apikey;
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: watsonApiKey,
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

const state = require('./state');

async function robot(){
    const content = state.load();
    await fetchContentFromWikipedia(content);
    sanatizeContent(content);
    await sentenceSplit(content);
    await fetchKeywordsOfAllSentences(content);
    state.save(content);

    async function fetchContentFromWikipedia(content){
        //Colect information from Wikipedia
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
        const wikipediaResponde = await wikipediaAlgorithm.pipe({
            "lang" : content.language,
            "articleName" : content.searchTerm
        });
        const wikipediaContent = wikipediaResponde.get();
        content.SourceContentOriginal = wikipediaContent.summary;
    }
    
    function sanatizeContent(){
    content.SourceContentSanitized = removeDatesInParenthesesAndBlankLines(content.SourceContentOriginal);
    }
    
    async function sentenceSplit(content){
        const sentenceSplitAlgorithm = algorithmiaAuthenticated.algo('StanfordNLP/SentenceSplit/0.1.0');
        const sentenceSplitResponde = await sentenceSplitAlgorithm.pipe(content.SourceContentSanitized);
        const sentenceSplitContent = sentenceSplitResponde.get();
        addSentencesInContent(sentenceSplitContent)
    }



    function removeDatesInParenthesesAndBlankLines(text) {
        var allLines = text.split('\n');
        allLines = allLines.join(' ');
        return allLines.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }

    function addSentencesInContent(text){
        content.sentences = [];
        text.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }


    async function fetchKeywordsOfAllSentences(){
        for(const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }


    async function fetchWatsonAndReturnKeywords(sentence){
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text:sentence,
                features:{
                    keywords:{}
                }
            }, (error, response) => {
                if (error) {
                    reject(error)
                    return
                }
                const keywords =  response.keywords.map(keyword => {
                    return keyword.text
                })
                resolve(keywords);
                
    
            })
        })
    }

    
}

module.exports = robot;