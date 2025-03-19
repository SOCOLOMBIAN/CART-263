document.addEventListener('DOMContentLoaded', () => {
    // Initialize controllers
    const audioController = new AudioController();
    const uiController = new UIController();
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
    
    uiController.addGoButtonListener(() => {
        gameController.startGame();
        uiController.disableGameControls();
    });
    
    uiController.addResetButtonListener(() => {
        gameController.resetGame();
        uiController.enableGameControls();
    });
    
    uiController.addContinueButtonListener(() => {
        gameController.continueGame();
    });
    
    uiController.addPlayAgainButtonListener(() => {
        uiController.hideGameOver();
        gameController.startGame();
    });
});