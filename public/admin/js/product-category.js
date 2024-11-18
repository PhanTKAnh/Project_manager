// Change status 
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length>0){
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    buttonsChangeStatus.forEach(button =>{
        button.addEventListener("click", () =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`
       
            formChangeStatus.action = action; 
            formChangeStatus.submit();
        })
    })


};
// End Change status 
// Delete
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-delete")
    const path = formDeleteItem.getAttribute("data-path");
    console.log(path);
    buttonDelete.forEach(button =>{
        button.addEventListener("click",() =>{
            const id = button.getAttribute("data-id");
            
            const action = path + `/${id}?_method=DELETE`
            formDeleteItem.action = action;
            formDeleteItem.submit();
        })
    })
}

// end delete
