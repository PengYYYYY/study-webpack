import "./style.css"
import imgUrl from "./img.png"

function createComponent(){
    var element = document.createElement('div');
    element.innerHTML = ['hello webpack'];
    return element;

    
}
function createImg(){
    var imgBox = document.createElement('img');
    imgBox.src = imgUrl;
    return imgBox;
}

document.body.append(createComponent(),createImg());