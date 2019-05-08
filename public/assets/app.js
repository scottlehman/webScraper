$.getJSON("/articles", function(data) {
  console.log(data);
    for (var i = 0; i < data.length; i++) {
      $("#articles").prepend(`<p data-id="${data[i]._id}"><strong>"${data[i].title}"</strong><br/><a href="${data[i].link}">${data[i].link}</a></p><br>`);
    }
});