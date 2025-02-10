import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import * as FileUploadWithPreview from 'https://unpkg.com/file-upload-with-preview/dist/index.js';
import Viewer from 'https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.esm.js';
// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image',{
    multiple:true,
    maxFileCount: 6
});
// end file-upload-with-preview

// CLIENT_SEND_MASSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray;
        console.log(images);
        if (content || images.length > 0) {
            socket.emit('CLIENT_SEND_MASSAGE', {
                content:content,
                images:images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel(); 
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    })
}
//END CLIENT_SEND_MASSAGE

// SERVER_RETURN_MASSAGE
socket.on("SERVER_RETURN_MASSAGE", (data) => {
    const myId = document.querySelector('[my-id]').getAttribute('my-id');
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    const div = document.createElement('div');
    let htmlFullName = '';
    let htmlContent= "";
    let htmlImages = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    if(data.content){
        htmlContent=`<div class="inner-content">${data.content}</div>`;
    }
    if(data.images.length > 0){
        htmlImages += `<div class="inner-images"> `;
        for (const image of data.images) {
            htmlImages += `<img src="${image}">`
        }
        htmlImages += `<img src="">`
        htmlImages += `</div>`
    }

    div.innerHTML = ` 
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
       
        
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = bodyChat.scrollHeight;
    // Preview Image
    const gallery = new Viewer(div);

})
// END SERVER_RETURN_MASSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// Scroll chat to bottom

// show icon chat
// show popup
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
// end show popup

// Show Typing
var timeOut;
const showTyping = () =>{
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(()=>{
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    },3000)
}
// End Show typing

// Ensert Icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content'")
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = (event.detail.unicode);
        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end,end);
        inputChat.focus();
        showTyping();
    });

    // Input keyup
    inputChat.addEventListener("keyup", () => {

       showTyping();
    })
    //  end input keyup
}
// end Ensert Icon to input
// end show icon chat

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if(elementListTyping){
    socket.on("SERVER_RETURN_TYPING",(data) =>{
        if(data.type == "show"){
            const existTyping = elementListTyping.querySelector(`[user_id = "${data.userId}"]`)
            const bodyChat = document.querySelector(".chat .inner-body");
            if(!existTyping){
                const boxTyping = document.createElement("div");
                console.log(boxTyping)
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user_id",data.userId)
    
                boxTyping.innerHTML= `
                        <div class="inner-name" >${data.fullName} </div>
                            <div class="inner-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                `;
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        }else{
            const boxTypingRemove = elementListTyping.querySelector(`[user_id = "${data.userId}"]`);
            if(boxTypingRemove){
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    })
}
// End SERVER_RETURN_TYPING


const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if(bodyChatPreviewImage) {
    const gallery = new Viewer(bodyChatPreviewImage);
}



// Preview fullImage
