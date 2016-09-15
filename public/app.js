$.getJSON('/articles', function(data) {

	var indexData = 0;
	function changeArticle() {
		if (indexData <= data.length) {
			$('#articleDiv').html('<p>' + data[indexData].title + '</p>');
			$('#articleDiv').append('<p>' + data[indexData].link + '</p><br>');
			$('#articleDiv').data('articleid', data[indexData]._id);
			$('#commentDiv').html('');
			for (var i = 0; i < data[indexData].comments.length; i++) {
				$('#commentDiv').append('<p>' + data[indexData].comments[i].comment + '</p><br>');
			};
			console.log(data[indexData]);
		} else {
			$('#articleDiv').html('<p>End of Articles</p>');
		};
	};
	changeArticle();

	$('#articleDiv').on('click', function() {
		indexData++;
		changeArticle();
	});

	$('#commentForm').submit(function(sub) {
		sub.preventDefault();

		$.ajax({
			method: "POST",
			url: "/addComment/",
			data: {
				comment: $('#commentInput').val(),
				_forArticle: $('#articleDiv').data('articleid')
			}
		}).done(function(data) {
			$('#commentDiv').append('<p>' + $('#commentInput').val() + '</p><br>');
			$('#commentInput').val('');
		});
	});
});