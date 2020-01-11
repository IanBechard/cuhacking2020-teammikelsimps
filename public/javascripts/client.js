document.getElementById("button").addEventListener("click", oc);

function oc() {
  $.get('http://localhost:3000/send', (data) => {
    for(i = 0; i < data.length; i++){
      $("#messages").append(`<h4> ${data[i].text} </h4>`));
    }
  })
}

function addMessages(message){
  $("#messages").append(`<h4> ${message.text} </h4>`)
}
