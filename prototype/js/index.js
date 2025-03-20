document.addEventListener('DOMContentLoaded', () => {
    // controllers
    const audioController = new AudioController();
    const uiController = new UiController();
    const gameController = new GameController(audioController, uiController);
    
    // Initialize UI
    uiController.init();
    
    // Add button listeners for each color button
    for (let i = 0; i < colors.length; i++) {
        uiController.addButtonListener(i, (index) => {
            gameController.handleButtonClick(index);
        });
    }
    
    // Add UI control listeners
    uiController.addStartButtonListener(() => {
        uiController.showGame();
    });
    
    // click,start game, disable 
    uiController.addGoButtonListener(() => {
        gameController.startGame();
        uiController.disableGameControls();
    });
    
    //reset button, reset game, enable 
    uiController.addResetButtonListener(() => {
        gameController.resetGame();
        uiController.enableGameControls();
    });
    
    uiController.addContinueButtonListener(() => {
        gameController.continueGame();
    });
});