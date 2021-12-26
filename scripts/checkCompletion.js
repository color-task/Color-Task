function checkCompletion() {
    const alreadyComplete = localStorage.getItem('color-task-complete');
    
    if (alreadyComplete) {
        window.history.replaceState({}, '', 'already-complete.html');
        window.location.assign('already-complete.html');
    }
}
