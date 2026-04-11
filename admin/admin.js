function login(){
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if(u === USER && p === PASS){
    sessionStorage.setItem("auth","true");
    showDashboard();
  } else {
    document.getElementById("error").innerText = "ভুল ইউজার বা পাসওয়ার্ড!";
  }
}

function showDashboard(){
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  const container = document.getElementById("linksContainer");
  container.innerHTML = "";

  LINKS.forEach(group => {

    let box = document.createElement("div");
    box.className = "link-box";

    let title = document.createElement("h3");
    title.innerText = group.title;

    box.appendChild(title);

    group.items.forEach(item => {
      let a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.innerText = item.name;
      box.appendChild(a);
    });

    container.appendChild(box);
  });
}

function logout(){
  sessionStorage.removeItem("auth");
  location.reload();
}

window.onload = function(){
  if(sessionStorage.getItem("auth") === "true"){
    showDashboard();
  }
};
