var indexData = 0;

function loadArticle(loadWhat) {
	$.getJSON('/articles', function(data) {
		console.log('running outside of if',data)
		if (indexData < data.length) {
			console.log('running inside of if at index:', indexData)
			if (loadWhat === 'everything') {
				$('#articleDiv').html('<h2>' + data[indexData].title + '</h2>');
				$('#articleDiv').append('<a href=' + data[indexData].link + '>' + data[indexData].link + '</a><br>\
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis nulla mauris. In hac habitasse platea dictumst.\
					 Vivamus eleifend mauris non arcu consectetur ultricies. Morbi vel odio in magna dapibus aliquet nec sed orci. \
					 Donec leo orci, euismod a consectetur rutrum, maximus eget nisi. Duis molestie eros ut quam fringilla,\
					 in eleifend metus imperdiet. Donec tempor ex sapien, consectetur sollicitudin neque fermentum lacinia.Suspendisse \
					 cursus orci dui, sit amet ultrices sem dignissim sit amet. Mauris eu justo mi. Pellentesque in erat id velit \
					 sollicitudin gravida in ut elit. Integer a velit mi. Aliquam pellentesque odio rhoncus ante dapibus, non porttitor\
					  lacus semper. Sed a auctor eros. Ut aliquet condimentum congue. Quisque eros neque, tincidunt vitae sem quis, tempor\
					   euismod elit. Nam lectus arcu, consectetur et posuere et, consequat sed leo. Fusce ut dapibus enim.Curabitur vehicula\
					    justo interdum, eleifend nunc id, finibus nulla. Sed maximus lobortis rutrum. Proin dictum, dui eget aliquet semper,\
					     neque felis aliquam libero, sed posuere augue nulla facilisis velit. Proin fermentum erat feugiat, tristique eros quis,\
					      ornare ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc pulvinar\
					       mi quis fermentum condimentum. Integer est est, volutpat ac finibus non, finibus in lectus. Mauris sit amet posuere \
					       magna.Nunc egestas lacus nunc. Nullam tristique lacus nec diam egestas, eget rutrum ex cursus. Proin placerat erat \
					       ut sem pharetra dignissim. Quisque feugiat mattis massa, ut pretium libero pulvinar ut. Nunc vestibulum laoreet leo \
					       in malesuada. Sed et tellus scelerisque, semper massa ac, consectetur lacus. Pellentesque semper sed lacus et facilisis.\
					        Ut a sagittis tellus. Vestibulum vestibulum odio efficitur condimentum placerat. Cras in lectus hendrerit risus suscipit \
					        imperdiet. Vivamus molestie nulla vehicula metus posuere, a bibendum purus varius. Phasellus volutpat ante vitae magna\
					         efficitur, sollicitudin faucibus enim euismod.Nam in ex varius, pellentesque erat quis, luctus lectus. Ut nec nibh \
					         elementum, vestibulum ipsum in, rutrum sem. Donec interdum arcu non erat hendrerit malesuada. Praesent ut ipsum nisi.\
					          Morbi scelerisque feugiat metus, sed pellentesque est. In eget enim varius, fermentum enim sed, efficitur est. Fusce\
					           ut eros justo. Aenean scelerisque maximus risus, et varius justo laoreet eget. Ut sagittis diam quis ante pellentesque, \
					            fringilla neque pretium.</p>');
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
						class: 'deleteBtn btn btn-danger'
					});

					$(singleCommentDiv).append('<p>' + comment.comment + '</p>');
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
						class: 'deleteBtn btn btn-danger'
					});

					$(singleCommentDiv).append('<p>' + comment.comment + '</p>');
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