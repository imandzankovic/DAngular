var _pId = '';
var resPresentation = '';
function createPresentation() {

    
    axios.post('http://localhost:3000/api/presentation', {

        title: 'New Presentation',
        slides: []
    })
        .then((res) => {
            console.log(res.data)
            window._pId = res.data._id
            window.resPresentation = res.data;

        })
        .catch((error) => {
            console.error(error)
        })
       

}

function createSlide() {

    var arrayname = getElements();
    console.log('ovo su' + arrayname); 

    axios.post('http://localhost:3000/api/slides', {

        elements: arrayname
    })
        .then((res)  =>  {
            console.log(res.data)
            window._sId = res.data._id
            window.resSlide = res.data;

            show(resSlide)
        })
        .catch((error) => {
            console.error(error)
        })

}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function updatePresentation(_pId, id) {

    console.log(_pId)
    console.log(id)
    axios.get('http://localhost:3000/api/presentation/' + _pId).then((res) => {

        console.log(res.data.slides)

        res.data.slides.push(id);
        var unique = res.data.slides.filter( onlyUnique );
        console.log(unique);

        axios.put('http://localhost:3000/api/presentation/' + _pId, {
        slides:unique
    
    }).then((pRes) => {
            console.log(pRes.data)
            window._pId = pRes.data._id
            window.resPresentation = pRes.data;

        })
        .catch((error) => {
            console.error(error)
        })
       
    })
    .catch((error) => {
        console.error(error)
    })

}

function updateSlide(_sId) {

    var arrayname = getElements();
    console.log(arrayname); 

  
        console.log('resolved'); 
        axios.put('http://localhost:3000/api/slides/' + _sId, {

            elements: arrayname
        })
            .then((res) => {
                console.log(res.data)
                window._sId = res.data._id
                window.resSlide = res.data;
                                
                show(resSlide);
            })
            .catch((error) => {
                console.error(error)
            })
     
}


$("#newPresentation").click(function () {

    $("#tab-content").toggle();

    var res = createPresentation();

    console.log(res);

})

$("#preview").click(function () {
    console.log('preview')
    window.open('http://localhost:3000/api/presentation/' + window._pId);
});


var counter = 1;
$("#addSlide").click(function () {
    var clicked = true;
    console.log('conto je ' + counter);
    if (counter > 1) {
        $('#container123').html('');
        $('.tab-content :input').val('');
        $('a[href="#tabs-1"]').click();
    }
    counter++;
    window.counter = counter;
    window.clicked = clicked;
    console.log('kliknuo add')

    createSlide();
    setTimeout(() => {
        console.log('resolved'); 
        updatePresentation(window._pId, window.resSlide);
      }, 4000);
   
});

$("#savePresentation").click(function () {
    var clickedSave = true;
    window.clickedSave = clickedSave;
    console.log('kliknuo save')

    updateSlide(window._sId);
    setTimeout(() => {
        console.log('resolved'); 
        console.log('iiiii' + window._sId)
        updatePresentation(window._pId, window._sId);
      }, 4000);
   
});







