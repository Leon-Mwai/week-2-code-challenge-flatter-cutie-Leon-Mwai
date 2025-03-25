// Your code here
async function distribute() {
    let response = await fetch("http://localhost:3000/characters");
    let characters = await response.json();

    let characterBar = document.getElementById("character-bar");

    characters.forEach(function (character) {
        let button = document.createElement("button");
        button.textContent = character.name;
        button.addEventListener("click", function () {
            showCharacterDetails(character);
        });
        characterBar.appendChild(button);
    });

    console.log(characters);
}

let currentCharacter = null;

function showCharacterDetails(character) {
    currentCharacter = character;
    document.getElementById("name").textContent = character.name;
    document.getElementById("image").src = character.image;
    document.getElementById("vote-count").textContent = character.votes;
    document.getElementById("image").alt = character.name;
}

document.getElementById("votes-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    if (currentCharacter) {
        let votesInput = document.getElementById("votes");
        let newVotes = parseInt(votesInput.value, 10);

        if (!isNaN(newVotes)) {
            let updatedVotes = currentCharacter.votes + newVotes;

            let response = await fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    votes: updatedVotes
                })
            });

            if (response.ok) {
                currentCharacter.votes = updatedVotes;
                document.getElementById("vote-count").textContent = currentCharacter.votes;
                votesInput.value = "";
            }
        }
    }
});

document.getElementById("reset-btn").addEventListener("click", async function (event) {
    event.preventDefault();

    if (currentCharacter) {
        console.log("Resetting votes for:", currentCharacter); // Debugging log
        try {
            let response = await fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: 0 }),
            });

            if (response.ok) {
                let updatedCharacter = await response.json();
                currentCharacter.votes = updatedCharacter.votes;
                document.getElementById("vote-count").textContent = updatedCharacter.votes;
            } else {
                console.error("Failed to reset votes.");
            }
        } catch (error) {
            console.error("Error resetting votes:", error);
        }
    }
});

distribute();

document.getElementById("character-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let nameInput = document.getElementById("character-name");
    let imageInput = document.getElementById("image-url");

    let name = nameInput.value.trim();
    let image = imageInput.value.trim();

    if (name && image) {
        let newCharacter = {
            name: name,
            image: image,
            votes: 0
        };

        let response = await fetch("http://localhost:3000/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCharacter)
        });

        if (response.ok) {
            let character = await response.json();
            addCharacterToBar(character);
            showCharacterDetails(character);
            nameInput.value = "";
            imageInput.value = "";
        }
    }
});

function addCharacterToBar(character) {
    let button = document.createElement("button");
    button.textContent = character.name;
    button.addEventListener("click", function () {
        showCharacterDetails(character);
    });
    document.getElementById("character-bar").appendChild(button);
}
