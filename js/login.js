$('#login-button').click(function () {
    $(this).fadeOut(500);
    $(".top").toggleClass("top-active");
    $(".bottom").toggleClass("bottom-active");
    $(".center").toggleClass("center-active");
});

const inputs = document.querySelectorAll(".input");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});


$(window).on('load', function () {
    if ($(".center").hasClass("center-active")) {
        $(".input-div").addClass("focus");
    }
});
