// Permissions
const tablePermission = document.querySelector("[table-permissions]");
if(tablePermission){
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click",() =>{
        let permisions = [];

        const rows = tablePermission.querySelectorAll("[data-name]");
        
        rows.forEach(row =>{
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name == "id"){
                inputs.forEach(input =>{
                    const id = input.value;
                    permisions.push({
                        id:id,
                        permisions:[]
                    })
                })

            }else{
                inputs.forEach((input,index) =>{
                    const checked = input.checked;

                    // console.log(name);
                    // console.log(index);
                    // console.log(checked);
                    if(checked){
                        permisions[index].permisions.push(name);
                    }
                })
            };
        })

        if(permisions.length > 0){
            const formChangePermission = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermission.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permisions);
            formChangePermission.submit();
        }
    });
}
// END Permissions

// Permissions default
const dataRecords = document.querySelector("[data-records]");

if(dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
   
    records.forEach((record,index) =>{
        const permissions = record.permissions;
        permissions.forEach(permission =>{
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
           const input = row.querySelectorAll("input")[index];
           input.checked = true;
        })
    })

}

//END  Permissions default