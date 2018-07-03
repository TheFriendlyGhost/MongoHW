// Grab the articles as a json
$.getJSON("/articles", function(data) {
  buildCards(data)
});

function buildCards(data){
  $('#articles').empty()
  $('#notes').empty()

  console.log(data, data.length)
  for (var i = 0; i < data.length; i++) {
    var row = $('<div class="row">')
    var col = $('<div class="col-md-12 md-offset-1>')
    var card = $('<div class="card">')

    var head = $('<div class="card-header"><p>' + data[i].title + '</p></div')
    var body = $('<div class="card-body"><p>' + data[i].summary + '</p></div')

    var button = $('<a class="btn btn-primary save-btn" data-id ="' + data[i]._id + '">Save Article</a>')
    
    card.append(head.append(button)).append(body)
    row.append(col).append(card)

    $('#articles').prepend(row)
  }
}

function buildSavedCards(data){
  $('#articles').empty()
  $('#notes').empty()
  for (var i = 0; i < data.length; i++) {
    var row = $('<div class="row">')
    var col = $('<div class="col-md-12 md-offset-1>')
    var card = $('<div class="card">')

    var head = $('<div class="card-header"><p>' + data[i].title + '</p></div')
    var body = $('<div class="card-body"><p>' + data[i].summary + '</p></div')

    var button = $('<a class="btn btn-warning unsave-btn" data-id ="' + data[i]._id + '">Unsave Article</a>')
    var button2 = $('<a class="btn btn-primary note-btn" data-id ="' + data[i]._id + '">Article Notes</a>')
    
    card.append(head.append(button).append(button2)).append(body)
    row.append(col).append(card)

    $('#articles').prepend(row)
  }
}
function buildEmpty(){
  $('#articles').empty()
  $('#notes').empty()
  var row = $('<div class="row text-center">')
  var col = $('<div class="col-md-12 md-offset-1>')
  var card = $('<div class="card">')

  var head = $('<div class="card-header empty-row"><p>Uh Oh. Looks like we dont have any saved articles.</p></div')

  card.append(head)
  row.append(col).append(card)

  $('#articles').append(row)
}

$(document).on("click", ".home-link", function(event){
  event.preventDefault()

  $.getJSON("/articles", function(data) {
    buildCards(data)
  });
})

$(document).on("click", ".saved-link", function(event){
  event.preventDefault()

  $('#articles').empty()

  $.getJSON("/articles/saved", function(data){
    if(data.length === 0){
      buildEmpty()
    }else{
      buildSavedCards(data)
    }
  })
})

$(document).on("click", ".scrape-link", function(data){
  event.preventDefault()
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).then(function(data) {
      console.log(data.length)
      // alert(data.length + " new articles have been scraped")
      // $('#exampleModal').modal('show')
      $.getJSON("/articles", function(data) {
        buildCards(data)
      });
  });
})

$(document).on("click", ".save-btn", function(event){
  event.preventDefault()

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  })
})

$(document).on("click", ".unsave-btn", function(event){
  event.preventDefault()

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/unsave/" + thisId
  }).then(function(){
    $.getJSON("/articles/saved", function(data) {
        if(data.length === 0){
          buildEmpty()
        }else{
          buildSavedCards(data)
        }
    });
  })
})

// Whenever someone clicks a p tag
$(document).on("click", ".note-btn", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      // The title of the article
      var form = $("<form>")

      if (data[0].note) {
        data.forEach(function(element){
          console.log(element)
          const note = element.note.body
          const id = element.note._id
          var noteDiv = $('<div>'+note+'</div><button class="btn btn-danger delete" data-id ="'+element.note._id+'">Delete</button>')
          form.append(noteDiv)
        })
      }

      var group = $("<div class='form-group'>")
      group.append("<label>" + data[0].title + "</label>");
      // A textarea to add a new note body
      group.append("<input id='bodyinput' name='body'></input>");
      // A button to submit a new note, with the id of the article saved to it
      group.append("<button class='btn btn-success' data-id='" + data[0]._id + "' id='savenote'>Save Note</button>");
      group.append("<button class='btn btn-danger' id='close'>Close</button>");
      form.append(group)
      $('#notes').append(form)

      // If there's a note in the article
      
    });
});

$(document).on("click", "#savenote", function(event) {
  event.preventDefault()
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $("#bodyinput").val().trim()
    }
  }).then(function(data) {
      console.log(data);
      $("#notes").empty();
    });
});

$(document).on("click", ".delete", function(event) {
  event.preventDefault()
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/delete/" + thisId,
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();    
  });
});

$(document).on("click", "#close", function(event) {
  $("#notes").empty();
});
