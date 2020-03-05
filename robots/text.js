const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/credations.json').apiKey
async function robot(content){
    await fetchContentFromWikipedia(content);


    async function fetchContentFromWikipedia(content){
             
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
        //Colect information from Wikipedia
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponde.get();
        content.SourceContentOriginal = wikipediaContent.summary;
        content.SourceContentSanitized = removeDatesInParenthesesAndBlankLines(wikipediaContent.summary);
        //Summarizer Information // could use SBD(sentenceBoundaryDetection)
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
    

}

module.exports = robot;