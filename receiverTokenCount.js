const AppDAO = require('./dao')
const TokenRepository = require('./model');

const main = async _ => {
    console.log("Start");

    const dao = new AppDAO('./database.db');
    const tokenRepo = new TokenRepository(dao);

    // get all reciver token count 
    await tokenRepo.getRecieverTokenCountAll().then((rows) => {
        rows.forEach(row => {
                console.log(row)

            })
        })
    
    // get record for one specific reciever token id
    const receiverID = '0x74be0af0bf7254328ddffc09425ff71d64a1a836'
    await tokenRepo.getByReceiverId(receiverID).then((res) => {
            console.log(receiverID + " has " + res.count + " tokens")
        })

    // // Save data to json
    // fs.writeFileSync('jsonData.json', JSON.stringify(tableData));

    console.log("End");
};

main()