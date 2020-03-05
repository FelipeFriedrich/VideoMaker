const rdSync = require('readline-sync');
const robots = {text: require('../robots/text')};

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

async function start(){
    const content = {}

    content.searchTerm = askAndReturnSearchTerm();
    content.language = askAndReturnLanguage();
    content.prefix = askAndReturnPrefix();

    await robots.text(content);

    function askAndReturnSearchTerm(){
        return rdSync.question('Type a Wikipedia search term: ')
    }

    function askAndReturnLanguage(){
        const language = ['pt', 'en']
        const selectLanguageIndex = rdSync.keyInSelect(language);
        console.log(language[selectLanguageIndex])
        return selectLanguageText = language[selectLanguageIndex];
    }

    function askAndReturnPrefix(){
        var prefixes =[]
        if(content.language == 'pt'){
            prefixes = ['Quem é', 'O que é', 'A historia de', 'Como fazer']
        }else{
            prefixes = ['Who is', 'What is', 'The history of', 'How to make']
        }
        const selectPrefixIndex = rdSync.keyInSelect(prefixes);
        return selectPrefixText = prefixes[selectPrefixIndex];

    }

    console.log(content);
}

start();