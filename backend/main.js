const API_URL = "http://localhost:3000/api/users";

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                showUserPanel();
                fetchUsers();
            } else {
                alert(data.message || "Échec de connexion.");
            }
        });
}

function logout() {
    localStorage.removeItem("token");
    document.getElementById("user-actions").style.display = "none";
}

function showUserPanel() {
    document.getElementById("user-actions").style.display = "block";
}

function createUser() {
    const username = document.getElementById("new-username").value.trim();
    const password = document.getElementById("new-password").value.trim();
    const role = document.getElementById("new-role").value;

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ username, password, role }),
    })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                fetchUsers();
                document.getElementById("new-username").value = "";
                document.getElementById("new-password").value = "";
            } else {
                alert(data.message || "Erreur lors de la création.");
            }
        });
}

function fetchUsers() {
    fetch(API_URL, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
        .then(res => res.json())
        .then(users => {
            const tbody = document.querySelector("#user-table tbody");
            tbody.innerHTML = "";

            users.forEach(user => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="deleteUser(${user.id})">Supprimer</button>
          </td>`;
                tbody.appendChild(tr);
            });
        });
}

function deleteUser(id) {
    if (!confirm("Confirmer la suppression ?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                fetchUsers();
            } else {
                alert("Erreur lors de la suppression.");
            }
        });
}
