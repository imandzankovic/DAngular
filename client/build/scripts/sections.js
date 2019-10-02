
document.getElementById("addTitle").addEventListener('click', addText);
document.getElementById("addGraph").addEventListener('click', addGraph);

function isEmpty(value) {
  return (value == null || value == undefined);
}

function setElementId(element) {

  element.id = NewGuid();
  return element.id;

}
function getElementById(id) {
  return document.getElementById(id);
}

function createElement(element) {
  return document.createElement(element);
}

function createInput() {

  var input = document.createElement("input");
  input.type = 'text'
  input.id = setElementId(input);
  input.style.fontFamily = 'Nunito';
  input.style.color = 'black';
  input.value = 'your title';
  //addClass(input,"form-control");

  return input;
}

function addClass(element, clas) {
  element.classList.add(clas);
}

function setColumnText(h2, input) {
  h2.innerHTML = input.value;
}

function addText() {

  //postSlide('string');

  //get container where content will be displayed
  var form = getElementById("container123");

  //create section - slide, for presentation 
  var section = createElement("section");
  addClass(section, "slide");

  //title to be displayed
  var h2 = createElement("h2");
  setElementId(h2);
  addClass(h2, "title");


  section.appendChild(h2);
  form.appendChild(section);

  //get tab2, where input will be created
  var tab2 = getElementById("tab2");

  //create input for tab2
  var input = createInput();

  input.style.cssText = `border:0px; /*important*/
  background-color: white; /*important*/
  position:absolute; /*important*/
  top:4px;
  left:9px;
  width:256px;
  height:28px;`

  setColumnText(h2, input);

  tab2.appendChild(input)
  $('a[href="#tabs-2"]').click();

  input.onkeyup = function () {
    setColumnText(h2, input);
  }

}

function renderChart(list) {

  console.log('uslo u chart')
  $.each(list, function (index, element) {
    console.log(element)
  });


  var chart = new CanvasJS.Chart("chartContainer",
    {
      title: {
        text: "Adding dataPoints Dynamically"
      },
      data: [
        {
          type: "column",
          dataPoints: list
        }
      ]
    });

  chart.render();

}

function makeSection() {

  var buttonDiv = createElement("div");
  addClass(buttonDiv, 'wrapper');
  buttonDiv.style.cssText = ` width:310px; /*follow your image's size*/
  height:40px;/*follow your image's size*/
  background-repeat:no-repeat; /*important*/
  padding:0px;
  top:50px;
  margin:0px;
  position:relative; /*important*/`;

  var bDiv = setElementId(buttonDiv);

  var deleteButton = document.createElement("button");
  deleteButton.innerHTML = 'x';
  deleteButton.id = setElementId(deleteButton);
  var input = createInput();

  input.style.cssText = `border:0px; /*important*/
  background-color:transparent; /*important*/
  position:absolute; /*important*/
  top:4px;
  left:9px;
  width:256px;
  height:28px;`


  deleteButton.style.cssText = `border:0px; /*important*/
  background-color:transparent; /*important*/
  position:absolute; /*important*/
  top:4px;
  left:265px;
  width:32px;
  height:28px;`;

  deleteButton.addEventListener('click', function () {
    console.log(input.id)
    removeInput(input.id, deleteButton.id)

    var list = removeFromList(input.id);

    renderChart(list);

  })

  buttonDiv.appendChild(input);
  buttonDiv.appendChild(deleteButton);
  getElementById('tab2').appendChild(buttonDiv);


  return input;
}
function renderByList(value) {


  var listOfShapes = new Array();

  if (window.listOfShapes != undefined) {
    listOfShapes = window.listOfShapes;
  }
  console.log(value)

  var i = { id: value.selector, y: 0, label: isEmpty(value) ? "Option 1" : value.val() };
  var index = listOfShapes.findIndex(fruit => fruit.id === i.id)

  if (index == -1) {
    listOfShapes.push(i);
  }

  else {
    listOfShapes[index] = i;
  }

  showList(listOfShapes);
  // $.each(listOfShapes, function (index, element) {
  //   console.log(element)
  // });
  window.listOfShapes = listOfShapes;
  return window.listOfShapes;
}

function removeFromList(id) {
  console.log(id)
  $.each(window.listOfShapes, function (index, element) {
    console.log(element)

    var index = window.listOfShapes.findIndex(x => x.id === '#' + id)
    console.log(index)
    if (index != -1)
      window.listOfShapes.splice(index, 1);

  });
  return window.listOfShapes;
}

function removeInput(id, deleteId) {

  var elem = getElementById(id)
  var deleteButton = getElementById(deleteId)

  elem.parentElement.removeChild(elem);
  deleteButton.parentElement.removeChild(deleteButton);

  return false;
}

function addGraph() {

  var butNew = document.createElement("button");
  $(butNew).addClass('.btn btn-primary btn-block');
  butNew.innerHTML = 'Add';

  butNew.style.cssText = `border:0px; /*important*/
  background-color:blue; /*important*/
  position:absolute; /*important*/
  top:40px;
  left:9px;
  width:256px;
  height:28px;`;


  var tab2 = document.getElementById("tab2");
  tab2.appendChild(butNew);

  butNew.addEventListener('click', function () {
    let input = makeSection();

    input.onkeyup = function () {
      update(input);
    }
  });

  $('a[href="#tabs-2"]').click();
}


function update(input) {

  var val = $("#" + input.id).get().map(function (i) {
    return $(i).val();
  });

  var list = renderByList($("#" + input.id).val(val));
  renderChart(list);

}

function show(data) {

  console.log('uslo u show')
  showList(data)
  $.each(data.elements, function (index, element) {
    console.log('bieber justin')
    console.log(element)
    var slides = document.getElementById("slidesWell");

    var section = document.createElement("section");
    section.classList.add("slide");
    section.style.cssText = `background-color:white`;

    if (element.type == 'h2') {
      var h2 = createElement("h2");
      h2.classList.add("title");
      h2.id = NewGuid();

      h2.style.cssText = 'font-size:15px';
      $('#' + h2.id).css({ top: element.x + 'px', left: element.y + 'px', position: 'absolute' });
      h2.innerHTML = element.value;

      var br = createElement("br");
      section.appendChild(h2);
      slides.appendChild(section);
      slides.appendChild(br);
    }

    if (element.type == 'chart') {
      var img = new Image();
      img.src = element.value;
      console.log(img)
      slides.appendChild(img)
    }
  });
}