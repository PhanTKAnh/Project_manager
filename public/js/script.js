// Show alert 
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })


}
// End Show alert 


// Detect browser or tab closing
window.addEventListener("beforeunload", function (e) {
    socket.emit("CLIENT_CLOSE_WEB", "test")
});
// End Detect browser or tab closing