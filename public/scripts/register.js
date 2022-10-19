// If team is selected as the role, display team name input
function displayTeamCheck(that) {
    if (that.value == "team") {
        document.getElementById("teamName").style.display = "block"
    } else {
        document.getElementById("teamName").style.display = "none"
    }
}