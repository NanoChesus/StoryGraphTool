class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(locationKey) {
        let locationData = this.engine.storyData.Locations[locationKey]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices && locationData.Choices.length > 0) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices

                if (choice.Target === "Awake1-1" && !this.engine.inventory.has("mask")){

                    continue;
                }
                if(choice.Target === "Death1-1"){
                    continue;
                }
                this.engine.addChoice(choice.Text, choice); 
                
            }
        } else {
            this.engine.addChoice("The end.")
        }

    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
    
        
            if (this.engine.storyData.specialLocation && this.engine.storyData.specialLocation[choice.Target]) {
                this.engine.gotoScene(specialLocation, choice.Target);
            } else {
                this.engine.gotoScene(Location, choice.Target);
            }
    
        } else {
            // Show end text
            this.engine.show("<p><em>The end.</em></p>");

            // Create Restart button
            const restartBtn = document.createElement("button");
            restartBtn.innerText = "Restart";
            restartBtn.onclick = () => this.engine.restartGame();
            this.engine.actionsContainer.appendChild(restartBtn);
        }
    }
    
}

class specialLocation extends Scene {
    create() {
        // Only show full puzzle description the first time
        if (this.firstAttempt) {
            this.firstAttempt = true;

            this.engine.show(`
                <p>You see a strange metal box in front of you with five holes on the top face.</p>
                <p>A long, thin pick tool rests beside it. Looks like some kind of puzzle.</p>
                <p>Which hole do you insert the pick into?</p>
            `);
        }

        // Show the 5 puzzle choices
        this.engine.addChoice("Left Top Hole", "left-top");
        this.engine.addChoice("Right Top Hole", "right-top");
        this.engine.addChoice("Middle Hole", "middle");
        this.engine.addChoice("Bottom Left Hole", "bottom-left");
        this.engine.addChoice("Bottom Right Hole", "bottom-right");
    }

    handleChoice(choice) {
        this.engine.show("&gt; " + choice);

        if (choice === "bottom-right") {
            this.engine.show("<p>You hear a click. The box opens and reveals a strange mask.</p>");
            this.engine.show("<p>It's shaped like an elk’s head. You flip it in your hands, examining its grooves and rough texture. It's getting late and you head home.</p>");

            this.engine.inventory.add("mask");

            const returnLocation = "The walk2-1"; 
            this.engine.gotoScene(Location, returnLocation);
        } else {
            this.engine.show("<p>Nothing happens. Maybe try a different hole.</p>");
            this.firstAttempt = false;
            this.create();
        }
    }
}





class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);

        // Create a restart button
        let restartBtn = document.createElement("button");
        restartBtn.innerText = "Restart";
        restartBtn.onclick = () => this.engine.restartGame();

        this.engine.actionsContainer.appendChild(restartBtn);
    }
}


Engine.load(Start, 'myStory.json');