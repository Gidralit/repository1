const files = document.getElementById('load-file');
const button = document.getElementById('btn');
const fileInputLabel = document.getElementById('label-load-file');
const container = document.getElementsByClassName('switch-file');

let flag = false;

function addForm(object){
    let h1 = document.createElement('h1');
    console.log(object.name);
    switch(object.name){
        case 'addpost': h1.innerHTML = 'Добавить пост'; break;
        case 'website_color_scheme': h1.innerHTML = "Цветовая палитра"; break;
        case 'login': h1.innerHTML = 'Авторизация'; break;
        case 'register': h1.innerHTML = 'Регистрация'; break;
        case 'interview': h1.innerHTML = 'Интервью'; break;
        default: h1.innerHTML = 'Заголовок'; break
    }
    h1.id = 'h1';
    container[0].append(h1);
    let form = document.createElement('form');
    form.id = 'form';
    container[0].append(form);
}

function addInputs(object){
    const inputs = object.fields;
    const form = document.getElementById('form');

    inputs.forEach(element => {
        const label = element.label ? createLabel(element.label) : null;
        const inputObject = element.input;

        let input  = createInput(inputObject);

        if(inputObject.type === 'technology'){
            input = createSelect(inputObject.technologies);
        }

        if(inputObject.type === 'textarea'){
            input = createTextarea(inputObject);
        }

        if(label){
            label.append(input);
            form.append(label);
        }else{
            form.append(input);
        }
    });
}

function createTextarea(object){
    let textarea = document.createElement('textarea');
    for(let key in object){
        textarea[key] = textarea[key];
    }
    return textarea;
}

function createLabel(text){
    const label = document.createElement('label');
    label.innerHTML = text;
    return label;
}

function createInput(inputObject){
    const input = document.createElement('input');
    
    input.placeholder = inputObject.placeholder || inputObject.mask || '';
    for(let key in inputObject){
        if(inputObject[key] !== undefined && key !== 'placeholder' && key !== 'mask'){
            input[key] = inputObject[key];
        }
    }

    return input;
}

function createSelect(technologies){
    const select = document.createElement('select');
    select.multiple = true;

    for(let key in technologies){
        const option = document.createElement('option');
        option.value = key;
        option.innerHTML = technologies[key];
        select.append(option);
    }

    return select;
}

function createElement(tag, attributes = {}){
    const element = document.createElement(tag);
    for(let key in attributes){
        if(attributes[key] !== undefined){
            element[key] = attributes[key];
        }
    }

    return element;
}

function addReferences(object){
    if(!object.references) return;

    const form = document.getElementById('form');

    object.references.forEach((element, index) => {
        let divRef = createElement('div', {id: `divRef${index}`});
        form.append(divRef);

        if('input' in element){
            const input = createElement('input', element.input);
            divRef.append(input);
        }else if('text without ref' in element){
            const label = createElement('label', {innerHTML: element['text without ref']});
            const a = createElement('a', {innerHTML: element.text, href: `#${element.ref}`});
            if(index > 0){
                divRef = document.getElementById(`divRef${index - 1}`)
                divRef.append(label);
                divRef.append(a);
            }else{
                divRef = document.getElementById(`divRef${index}`);
                divRef.append(label);
                divRef.append(a);
            }

            divRef.style.display = 'flex';
            divRef.style.gap = '10px';
            divRef.style.alignItems = 'center';
        }else{
            const a = createElement('a', {innerHTML: element.text, href: element.ref});
            form.append(a);
            return
        }

        form.append(divRef);
    })
}

function addButtons(object){
    let form = document.getElementById('form');
    if(object.buttons){
        object.buttons.forEach(buttonData => {
            let button = document.createElement('button');
            button.innerHTML = buttonData.text;
            form.append(button);
        });
    }
}

function parseObject(object){
    console.log(object);
    addForm(object);
    addInputs(object);
    addReferences(object);
    addButtons(object);
}

function readFile(file){
    const reader = new FileReader();
    let objectFile;
    reader.onload = (event) => {
        const content = event.target.result;
        objectFile = JSON.parse(content);
        parseObject(objectFile);
    }
    reader.readAsText(file);
}

async function show() {
    let file = files.files[0];
    if(flag == true){
        let form = document.getElementById('form');
        form.remove();
        let h1 = document.getElementById('h1');
        h1.remove();
        readFile(file);
        button.style.display = 'block';
    }else{
        readFile(file);
        flag = true;
        button.style.display = 'block';
    }
}

let deleteForm = () => {
    let form = document.getElementById('form');
    form.remove();
    let h1 = document.getElementById('h1');
    h1.remove();
    flag = false;
    button.style.display = 'none';
    fileInputLabel.textContent = "Выберите файл";
    files.value = '';
}

button.addEventListener('click', deleteForm);
files.addEventListener('change', function() {
    if(this.files && this.files.length > 0){
        const fileName = this.files[0].name;
        fileInputLabel.textContent = fileName;
        show();
    }else{
        fileInputLabel.textContent = "Выберите файл";
    }
})