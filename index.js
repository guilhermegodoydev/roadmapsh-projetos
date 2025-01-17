// Add, Update, Del, List, ListAll, listCompleted, ListToDo, ListInProgress

const fs = require('fs');

const filePath = './tasks.json';
const argv = process.argv.slice(2);

const commands = {
    async add(taskDescription) {
        try {

            let data = ReadFileSync(); 

            let nextId = 1;

            if (data.length > 0)
            {
                nextId = Math.max(...Object.values(data).map(task => task.id)) + 1;
            }
            
            data.push(
                {
                    "id": nextId,
                    "description": taskDescription.toString(),
                    "createdAt": new Date().toISOString(),
                    "updatedAt": new Date().toISOString()
                }
            );

            await UpdateFile(data);

            console.log(`Task added successfully (ID: ${nextId})`);
        } catch (error) {
            console.log('Error creating task' + error);
        }
    }

};

CheckAndCreateFileSync();

if (commands[argv[0]]) {
    commands[argv[0]](argv.slice(1));
    console.log("É um comando");
}
else {
    console.log("Comando inválido");
}

function CheckAndCreateFileSync() {
    try {
        fs.accessSync(filePath);
        console.log('Arquivo existe');
    } catch {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        console.log('Arquivo criado com sucesso');
    }
}

function ReadFileSync() {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        console.log('Não foi possível ler o arquivo' + error);
    }
}

async function UpdateFile(data) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => 
    {
        if (err) 
            console.log('Erro ao atualizar o arquivo');
        else 
            console.log('Arquivo atualizado');
    });
}