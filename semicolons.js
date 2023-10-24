const noUserWin = document.getElementById('setUsername')
const userUI = document.getElementsByClassName('user')

let contract;
let signer;
let contractWithSigner;
let USERNAME;

main();

async function main() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, provider);
    contractWithSigner = contract.connect(signer);
   
    USERNAME = await contractWithSigner.getUsername()

    if (USERNAME) {
        for (const element of userUI) {
            element.textContent = USERNAME
        }
        let welcome = document.getElementById('welcome-back')
        welcome.style.display = "inherit"
        welcome.addEventListener('click', function () {
            const element = this
            element.style.animation = `fade-out 1s ease-in-out`
            element.style.opacity = '0'
            setTimeout(function () {
                element.style.display = 'none'
                displaySemicolonMarket()
            }, 1000)
        })
    } else {
        const walletAddress = await signer.getAddress();
        for (const element of userUI) {
            element.textContent = walletAddress
        }
        let welcome = document.getElementById('welcome')
        welcome.style.display = "inherit"
        welcome.addEventListener('click', function () {
            const element = this
            element.style.animation = `fade-out 1s ease-in-out`
            element.style.opacity = '0'
            setTimeout(function () {
                element.style.display = 'none'
                document.getElementById('createUsername').style.display = 'inherit'
            }, 1000)
        })
    }
}

function setUsername() {
    const username = document.getElementById('username').value
    console.log(username)
    if (username) {
        contractWithSigner.setUsername(username)
        hideByID('createUsername')
        displaySemicolonMarket()
    } else {
        window.alert("username can not be empty")
    }
}

function hideByID(id) {
    const element = document.getElementById(`${id}`)
    element.style.animation = `fade-out 1s ease-in-out`
    element.style.opacity = '0'
    setTimeout(function () {
        element.style.display = 'none'
        document.getElementById('createUsername').style.display = 'inherit'
    }, 1000) 
}

function purchase() {
    contractWithSigner.addSemicolon(USERNAME)
}

async function displaySemicolonMarket () {
    document.getElementById('semicolonMarket').style.display = 'block'
    const users = await contract.getAllUsernames()
    const usersData = []

    for (let u = 0; u < users.length; u++) {
        const username = users[0]
        console.log(username)
        const semis = await contract.getsemicolons(username)
        const user = {
            username: users[u],
            semicolons: semis || 0
        }
        usersData.push(user)
    }
    usersData.forEach(owner => {
        const collectorDiv = document.createElement('div');
        collectorDiv.className = 'collector';

        const ownerParagraph = document.createElement('p');
        ownerParagraph.className = 'owner';
        ownerParagraph.textContent = owner.username; 

        const houseDiv = document.createElement('div');
        houseDiv.className = 'house';
        let semicolons;
        if (owner.semicolons < 0) {
            semicolons = ""; // Return an empty string for negative values
        } else {
            semicolons = "; ".repeat(owner.semicolons)
        }
        houseDiv.textContent = semicolons

        collectorDiv.appendChild(houseDiv);
        collectorDiv.appendChild(ownerParagraph);

        const collectionsDiv = document.getElementById('collections');
        collectionsDiv.appendChild(collectorDiv);
    });
}
