const rdSync = require('readline-sync');
const robots = {text: require('../robots/text')};


function start(){
    const content = {}

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    robots.text(content);

    function askAndReturnSearchTerm(){
        return rdSync.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history of', 'How to make']
        const selectPrefixIndex = rdSync.keyInSelect(prefixes);
        return selectPrefixText = prefixes[selectPrefixIndex];

    }

    console.log(content);
}

start();