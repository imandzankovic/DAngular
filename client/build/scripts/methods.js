function NewGuid() {
    var sGuid = "";
    for (var i = 0; i < 32; i++) {
        sGuid += Math.floor(Math.random() * 0xF).toString(0xF);
    }

    return sGuid;
}


Array.prototype.contains = Array.prototype.contains || function (obj) {
    var i, l = this.length;
    for (i = 0; i < l; i++) {
        if (this[i].id == obj.id) return true;
    }
    return false;
};

function getPosition(id) {
    console.log(id)

    var element = document.getElementById(id)

    position = $(element).offset();
    var x = position.left;
    var y = position.top;
    return {
        x,
        y
    }

}

function getElements() {

    var arrayname = new Array();
    var list = $('#container123 :header');
    var canvas = $("#chartContainer .canvasjs-chart-canvas").get(0);
    if (canvas != undefined) {
        var dataURL = canvas.toDataURL();
        list.push(dataURL);
    }

    $.each(list, function (index, element) {
        console.log('Element je ' + element)
        let i = { id: "", type: "", value: "", x: "", y: "" };

        i.id = element.id;
        i.type = $("#" + i.id).prop('tagName') == 'H2' ? 'h2' : 'chart'
        i.value = document.getElementById(i.id) == null ? window.y : document.getElementById(i.id).innerHTML;

        if (i.type == 'h2') {
            i.x = getPosition(element.id).x;
            i.y = getPosition(element.id).y;
        }

        arrayname.push(i);

    })

    showList(arrayname)
    return arrayname;

}

function showList(arrayname) {
    $.each(arrayname, function (index, element) {
        console.log(element)
    })
}