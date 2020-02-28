let getData = () => {
    let request = new XMLHttpRequest();
    request.open("GET", "http://localhost:8081/note/");
    request.send();
    request.onload = () => {
        let data = JSON.parse(request.response);
        let list = document.getElementById("tasks");
        list.innerText = "";
        for (let task of data) {
            let listItem = document.createElement("li");
            let div = document.createElement("div");
            let para = document.createElement("p");
            para.innerText = task.text;

            let updateButton = document.createElement("button");
            updateButton.className = "btn btn-primary";
            updateButton.innerText = "Update";
            updateButton.addEventListener("click", () => {
                modalUpdate.setId(task.id);
                openModal(task);
            })

            let deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger";
            deleteButton.innerText = "Delete"
            deleteButton.addEventListener("click", () => {
                deleteData(task.id);
            })

            div.appendChild(para);
            div.appendChild(updateButton);
            div.appendChild(deleteButton);

            listItem.appendChild(div);
            list.appendChild(listItem);
        }
    }
}

let objFromForm = (event) => {
    let form = event.target;
    let obj = {};
    let inputs = form.getElementsByTagName("input");
    for (let input of inputs) {
        if (input.name) {
            obj[input.name] = input.value;
        }
    }
    return obj
}

let postData = (event) => {
    event.preventDefault();

    let obj = objFromForm(event);
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:8081/note/");
    request.setRequestHeader("Content-Type", "application/json")

    let body = JSON.stringify(obj);
    request.send(body);

    request.onload = () => {
        getData();
    }
}

let openModal = (task) => {
    console.log(task)
    $('#updateModal').modal({ show: true })

    let form = document.getElementById("updateForm");
    for (let input of form) {
        for (let key in task) {
            if (input.name === key) {
                input.value = task[key];
            }
        }
    }

}
let update = () => {
    let updateId = 0;
    return {
        setId: (id) => {
            updateId = id;
        },
        updateTask: (event) => {
            event.preventDefault();
            let obj = objFromForm(event);
            obj.id =  updateId;
            let request = new XMLHttpRequest();
            request.open("PUT", "http://localhost:8081/note/");
            request.setRequestHeader("Content-Type", "application/json")
            let body = JSON.stringify(obj);
            console.log(body)
            request.send(body);
            request.onload = () => {
                console.log("hm")
                $('#updateModal').modal({ show: false })
                getData();
            }
        }
    }

}
let modalUpdate = update();

let deleteData = (id) => {
    let request = new XMLHttpRequest();
    request.open("DELETE", "http://localhost:8081/note/" + id);
    request.send();
    request.onload = () => {
        getData();
    }

}



getData();

