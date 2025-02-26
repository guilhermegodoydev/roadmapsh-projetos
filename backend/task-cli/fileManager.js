const fs = require('fs');

function CheckAndCreateFileSync(filePath) {
    try {
        fs.accessSync(filePath);
    } catch {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
}

function ReadFileSync(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        return [];
    }
}

async function UpdateFile(data, filePath) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => 
    {
        if (err) 
            console.log('Error updating file' + err);
    });
}

module.exports = {
    CheckAndCreateFileSync,
    ReadFileSync,
    UpdateFile
}