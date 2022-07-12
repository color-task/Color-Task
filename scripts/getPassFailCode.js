/**
 * Returns appropriate code for user based on pass/fail
 * of attention check
 */
function getPassFailCode() {
	const passedCode = '16C9619C'; // set this to the Completion code provided by Prolific
	const failedCode = '76212773'; // set this to the Failed attention checks code provided by Prolific
	const passedCheck = localStorage.getItem('color-task-passed-check');
	return JSON.parse(passedCheck) ? passedCode : failedCode;
}