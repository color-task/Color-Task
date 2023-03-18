function saveQueryStringParams() {
	const searchParams = (new URL(document.location)).searchParams;
	const PROLIFIC_PID = searchParams.get('PROLIFIC_PID');
	const STUDY_ID = searchParams.get('STUDY_ID');
	const SESSION_ID = searchParams.get('SESSION_ID');

	localStorage.setItem('color-task-PROLIFIC_PID', PROLIFIC_PID);
	localStorage.setItem('color-task-STUDY_ID', STUDY_ID);
	localStorage.setItem('color-task-SESSION_ID', SESSION_ID);
}
