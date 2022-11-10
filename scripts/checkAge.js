function checkAge() {
  debugger
  const overEighteen = localStorage.getItem("is-over-eighteen");

  if (overEighteen !== "true") window.location.assign("ethics-permission.html");
}
