// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            console.log(url.href);
            window.location.href = url.href;
        });
    })
}
// Button Status

// form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}

// pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
};

// end pagination

// check box
const checkBoxMulti = document.querySelectorAll("[checkbox-multi]");
if (checkBoxMulti.length > 0) {
    checkBoxMulti.forEach(checkBox => {
        const inputCheckAll = checkBox.querySelector("input[name='checkall']");
        const inputsId = checkBox.querySelectorAll("input[name='id']");

        inputCheckAll.addEventListener("click", () => {
            console.log(inputCheckAll.checked);
            if (inputCheckAll.checked) {
                inputsId.forEach(input => {
                    input.checked = true;
                })
            } else {
                inputsId.forEach(input => {
                    input.checked = false;
                })
            }
        })
        inputsId.forEach(input => {
            input.addEventListener("click", () => {
                const countChecked = checkBox.querySelectorAll("input[name='id']:checked").length;

                if (countChecked == inputsId.length) {
                    inputCheckAll.checked = true;
                } else {
                    inputCheckAll.checked = false;
                }
            });
        })
    })




}
// end check box

// form change Multi
const formChangeMulti = document.querySelectorAll("[form-change-multi]");
if (formChangeMulti.length > 0) {
    formChangeMulti.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const checkBoxMulti = document.querySelector("[checkbox-multi]");
            const inputsChecked = checkBoxMulti.querySelectorAll(
                "input[name='id']:checked"
            );

            const typeChange = e.target.elements.type.value;
            if (typeChange == "delete-all") {
                const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");
                if (!isConfirm) {
                    return;
                }
            }


            if (inputsChecked.length > 0) {
                let ids = [];
                const inputIds = form.querySelector("input[name='ids']");
                inputsChecked.forEach(input => {
                    const id = input.value;

                    if (typeChange == "change-position") {
                        const position = input
                            .closest("tr")
                            .querySelector("input[name='position']").value;

                        ids.push(`${id}-${position}`);
                    } else {
                        ids.push(id);
                    }



                })
                inputIds.value = ids.join(",");
                form.submit();
            } else {
                alert("vui long chon it nhat 1 ban ghi")
            };
        });
    });
}

// end form change Multi

// Show alert 
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden");
    },time);

    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden");
    })


}
// End Show alert 
// uploads image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput= document.querySelector("[upload-image-input]");
    const uploadImagePreview= document.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", (e) =>{
        console.log(e);
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
//End uploads image