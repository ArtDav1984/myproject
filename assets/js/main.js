

$(".databases").on('click', '.db-name', function () {
    var parent = $(this).parent('li');
    var plus = parent.find('.fa-plus-square');
    var minus = parent.find('.fa-minus-square');
    var ul = parent.find('.tables-list');
    var expended = parent.attr('aria-expanded');
    var databaseName = parent.data('base');

    ul.slideToggle();
    plus.toggle();
    minus.toggle();

    if (expended === 'false') {
        $.ajax({
            url     : 'tables',
            type    : 'GET',
            async   : true,
            dataType: "JSON",
            headers    : {
                dbName: databaseName
            }
        }).done(response => {
            if (response.type === 'success') {
                var newTable = document.createElement("LI");
                var newIcon  = '<i class="far fa-list-alt"></i>';
                newTable.innerHTML = "‐‐‐" + newIcon + " " + "New";
                setAttributes(newTable, {"class": "new-table"});
                ul.append(newTable);
                response.data.forEach(function (table) {
                    var li   = document.createElement('LI');
                    var icon = '<i class="far fa-list-alt"></i>';
                    setAttributes(li, {"class": "table-name", "data-table": table, "aria-expanded": "false"});
                    li.innerHTML = "‐‐‐" + icon + " " + table;
                    ul.append(li);
                });
            }
        }).fail(error => {
            console.log(error);
         })
    }

    parent.attr('aria-expanded', 'true');
});

$(".tables-list").on('click', '.table-name', function () {
    var expended = $(this).attr('aria-expanded');
    var tableName = $(this).data('table');
    var parent = $(this).parent('ul').parent('div').parent('li');
    var databaseName = parent.data('base');

    $.ajax({
        url     : 'tables/column',
        type    : 'GET',
        async   : true,
        dataType: "JSON",
        headers    : {
            table: tableName,
            databaseName: databaseName
        }
    }).done(response => {
        if (response.type === 'success') {
            var table       = document.createElement('TABLE');
            var tr          = document.createElement('TR');
            table.append(tr);
            $("#content").html(table);
            $(window).scrollTop(0);
            response.data.forEach(function (column) {
                var th       = document.createElement('TH');
                th.innerHTML = column;
                tr.append(th)
            });
        }
    }).fail(error => {
        console.log(error);
    })
});

$("#create-db").click(function () {
        $.ajax({
            url     : 'databases/chars',
            type    : 'GET',
            async   : true,
            headers : {
                getCharsList: true
            },
            dataType: "JSON",
        }).done(response => {
            if (response.type === 'success'){
            	    var newDb = '<div id="new-db">' +
					'<form method="post">' +
					'<label for="db-name">' +
					'<i class="fas fa-database"></i> Create Database </label> <br /><br />' +
					'<input type="text" name="name" id="db-name" placeholder="Database name" required/>' +
					'<select id="charsets" name="charsets" aria-expanded="false"></select>' +
					'<button type="submit" id="db-submit">Create</button> </form> </div>';
            	    $("#content").html(newDb);
                response.data.forEach(function (charset) {
                    var option = document.createElement('OPTION');
                    option.innerHTML = charset;
                    setAttributes(option, {"class": "charset", "value": charset});
                    $("#charsets").append(option);
                })
            }
        }).fail(error => {
            console.log(error)
        })
});

$("#content").on('click', '#db-submit',function (event) {
    event.preventDefault();
    var dbName = $("#db-name").val();
    var charName = $(".charset").val();

    if (dbName !== '') {
        $.ajax({
            url     : 'databases/create',
            type    : 'POST',
            async   : true,
            dataType: "JSON",
            data    : {
                name    : dbName,
                charsets: charName
            }
        }).done(response => {
            if (response.type === 'success') {
                createTable(response.data)
                var newDbLine = '<div class="vertical-line">' +
                    `<li class="database-list" aria-expanded="false" data-base="${response.data}">` +
                    '<i class="fas fa-plus-square db-name"></i><i class="fas fa-minus-square db-name"></i>' +
                    `<span class="horizontal-line">-</span><i class="fas fa-database"></i>` +
                     `<span class="db-name">&nbsp;${response.data}</span>` +
                    '<div class="hide-line"> <ul class="tables-list"> </ul> </div> </li> </div>';
                $(".databases").append(newDbLine);
            }
        }).fail(error => {
            console.log(error);
        })
    }
});

$("#content").on('click','#table-submit',function (event) {
    event.preventDefault();
    var tableName = $("#tableName").val();
    var numberColumn = $("#numberColumn").val();

    if (tableName !== '' && numberColumn !== '') {
        var table = '<div id="table">' +
			'<form method="post">' +
            `Table name: <input type="text" id="update-name" value="${tableName}">` + " " + " " +
            'Add: <input type="number" id="update-number" value="1">' + " " + " " +
            '<button type="submit" id="add-submit">Submit</button>' +
            '</form>' +
            '<div class="line"></div>' +
            '<form method="post">' +
            '<table class="table">' +
            '<tr> <th>Name</th> <th>Type</th> <th>Length</th> <th>Default</th> <th>Index</th> </tr>' +
            '</table>' +
            '</form></div>';
        $("#content").html(table);
    }
});

$(".tables-list").on('click', '.new-table', function () {
    var parent = $(this).parent('ul').parent('div').parent('li');
    var dbName = parent.data('base');
    createTable(dbName);
})

function createTable(dataBase) {
	var newTable = `<div id="new-table" data-base="${dataBase}">` +
		'<form method="post">' +
		'<fieldset>' +
		'<legend><i class="far fa-list-alt"></i> Create table</legend>' +
		'<span>Name:</span> <input type="text" name="tableName" id="tableName"/>' +
		'<span id="columns-title">Number of columns:</span> <input type="number" name="numberColumn" id="numberColumn" value="4"/>' +
		'<br /><br />' +
		'<button type="submit" id="table-submit">Create</button>' +
		'</fieldset>' +
		'</form>' +
		'</div>';
	$("#content").html(newTable);
}

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
