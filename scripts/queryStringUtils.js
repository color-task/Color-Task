function saveQueryStringParams() {
	const searchParams = (new URL(document.location)).searchParams;
	const prolificPid = searchParams.get('prolificPid');
	const studyId = searchParams.get('studyId');
	const sessionId = searchParams.get('sessionId');

	localStorage.setItem('color-task-prolificPid', prolificPid);
	localStorage.setItem('color-task-studyId', studyId);
	localStorage.setItem('color-task-sessionId', sessionId);
}