var indexData = 0;

function loadArticle(loadWhat) {
	$.getJSON('/articles', function(data) {
		console.log('running outside of if',data)
		if (indexData < data.length) {
			console.log('running inside of if at index:', indexData)
			if (loadWhat === 'everything') {
				$('#articleDiv').html('<p>' + data[indexData].title + '</p>');
				$('#articleDiv').append('<p>' + data[indexData].link + '</p><br>');
				$('#articleDiv').data('articleid', data[indexData]._id);
				$('#commentDiv').html('');

				for (var i = 0; i < data[indexData].comments.length; i++) {
					var comment = data[indexData].comments[i];

					var singleCommentDiv = $('<div>', {
						id: comment._id,
						class: 'singleCommentDiv'
					});

					var deleteBtn = $('<button>', {
						text: 'Delete',
						id: comment._id,
						class: 'deleteBtn'
					});

					$(singleCommentDiv).append('<p>' + comment.comment + '</p><br>');
					$(singleCommentDiv).append(deleteBtn);
					$('#commentDiv').append(singleCommentDiv);
				};
			} else if (loadWhat	=== 'comments') {
				$('#commentDiv').html('');

				for (var i = 0; i < data[indexData].comments.length; i++) {
					var comment = data[indexData].comments[i];

					var singleCommentDiv = $('<div>', {
						id: comment._id,
						class: 'singleCommentDiv'
					});

					var deleteBtn = $('<button>', {
						text: 'Delete',
						id: comment._id,
						class: 'deleteBtn'
					});

					$(singleCommentDiv).append('<p>' + comment.comment + '</p><br>');
					$(singleCommentDiv).append(deleteBtn);
					$('#commentDiv').append(singleCommentDiv);
				};
			};
			
		} else if(data.length === 0) {
			console.log('running inside of  else if', data)
			$('#articleDiv').html('<p>No Articles Available Yet, Please Press the Update button below </p>');
		} else {
			$('#articleDiv').html('<p>End of Articles</p>');
			indexData = data.length - 1;
		};
	});
};

$.ajax({ //!!!!!!!! CRAIG can u tell me why this isnt loading everything on first load.
	//I always have to refresh the page twice or load the page and then click the update button.
	method: 'POST',
	url: '/scrape'
}).done(function(scrape) {
	console.log('this is the data',scrape);
	indexData = 0;
	loadArticle('everything');
});

$(document).on('click','.deleteBtn', function() {
		$.ajax({
		method: "POST",
		url: "/removeComment/" + this.id,
		data: {
			comment: $('#commentInput').val(),
			_forArticle: $('#articleDiv').data('articleid')
		}
	}).done(function(data) {

	});
	
	loadArticle('comments');
});

$('#nextArticle').on('click', function() {
	indexData++;
	loadArticle('everything');
});

$('#previousArticle').on('click', function() {
	if (indexData !== 0) {
		indexData--;
		loadArticle('everything');
	}
	
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
		loadArticle('comments');
		$('#commentInput').val('');
	});
});

$('#updateArticles').on('click', function() {
	$.ajax({
		method: 'POST',
		url: '/scrape'
	}).done(function(data) {
		console.log('this is the data',data);
		indexData = 0;
		loadArticle('everything');
	});
});