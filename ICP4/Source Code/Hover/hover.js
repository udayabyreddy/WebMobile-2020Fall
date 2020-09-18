function upDate(previewPic) {
    //if(previewPic=)
    console.log(previewPic);
    $('#image').css('background-image', 'url(' + previewPic.src + ')');
    $('#image').html(previewPic.alt);
}
function unDo() {
    $('#image').css('background-image','none');
    $('#image').html("Hover over an image below to display here.");
}
