function checkConsent() {
    const consented = localStorage.getItem('color-task-consent');

    if (consented != 'true') window.location.assign('no-consent.html');
}