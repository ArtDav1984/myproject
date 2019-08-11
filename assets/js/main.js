var database = '';
var dbName = '';
var newDbName = '';
var tableName = '';
var numberColumn;
var article = $(".article");

$("#create-db").click(function () {
    article.hide();
    $("#new-db").show();
    $("#db-name").val('');
});

$("section").on('click', '#db-submit',function (event) {
    event.preventDefault();
    var charName = $(".charset").val();
    var loadContent = $(".load-content");
    dbName = $("#db-name").val();

    if (dbName !== '') {
        loadContent.show();
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
                setTimeout(load, 300);
                function load() {
                    loadContent.hide();
                    article.hide();
                    $("#new-table").show();

                    var newDbLine = '<div class="vertical-line">' +
                        `<li class="database-list" aria-expanded="false" data-base="${response.data}">` +
                        '<image class="load-aside" src="assets/img/load.gif" />' +
                        '<i class="fas fa-plus-square db-name"></i><i class="fas fa-minus-square db-name"></i>' +
                        `<span class="horizontal-line">-</span><i class="fas fa-database"></i>` +
                        `<span class="db-name database">&nbsp;${response.data}</span>` +
                        '<div class="hide-line"> <ul class="tables-list"> </ul> </div> </li> </div>';
                    $(".databases").append(newDbLine);
                }
            }
        }).fail(error => {
            console.log(error);
        })
    } else {
        alert("required field");
    }
});

$("section").on('click', '.database', function () {
    var parent = $(this).parent("li");
    dbName = parent.attr("data-base");
    database = $(this);
    article.hide();
    $("#new-table").show();
    $("#update-db").show();
    $("#del-db").show();
});

$("section").on('click','#update-db-submit',function (event){
    event.preventDefault();
    newDbName = $("#dbName").val();
    $("#dbName").val('');

    if (newDbName !== '') {
        $("#update-db-modal").show();
        $("#update-db-modal > #modal-body > p").html(`CREATE DATABASE ${newDbName} / DROP DATABASE ${dbName}`);
        var button = $(".confirm-db");
        $(button).attr("id", "confirm-db-update");
    } else {
        alert("required field");
    }
});

$("section").on('click', '#confirm-db-update', function (event) {
    event.preventDefault();
    var loadContent = $(".load-content");
    loadContent.show();

    $.ajax({
        url: 'databases/update',
        type: 'POST',
        async: true,
        dataType: "JSON",
        data: {
            newDbName: newDbName,
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
        	dbName = response.data;
            $("#update-db-modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                database.html(` ${response.data}`);
                var li = database.parent('li');
                li.removeAttr("data-base");
                li.attr("data-base", response.data);
                article.hide();
                $("#new-table").show();
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$("section").on('click','#delete-db-submit',function (event){
    event.preventDefault();

    $("#update-db-modal").show();
    $("#update-db-modal > #modal-body > p").html(`You are about to DESTROY a complete database! Do you really want to execute "DROP DATABASE ${dbName}"?`);
    var button = $(".confirm-db");
    $(button).attr("id", "confirm-db-delete");
});

$("#update-db-modal").on('click', '#confirm-db-delete', function (event) {
    event.preventDefault();
    var loadContent = $(".load-content");
    loadContent.show();

    $.ajax({
        url: 'databases/delete',
        type: 'POST',
        async: true,
        dataType: "JSON",
        data: {
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
            $("#update-db-modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                var parent = database.parent('li').parent('div');
                $(parent).remove();
                article.hide();
                $("#new-db").show();
                $("#db-name").val('');
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$(".cancel-db-update").click(function () {
    $("#update-db-modal").hide()
});

$("section").on('click', '.db-name', function () {
    var parent = $(this).parent('li');
    var plus = parent.find('.fa-plus-square');
    var minus = parent.find('.fa-minus-square');
    var ul = parent.find('.tables-list');
    var expended = parent.attr('aria-expanded');
	var loadAside = parent.find('.load-aside');
	    dbName = parent.attr("data-base");

    ul.slideToggle();
    plus.toggle();
    minus.toggle();

    if (expended === 'false') {
        loadAside.show();
        $.ajax({
            url     : 'tables',
            type    : 'GET',
            async   : true,
            dataType: "JSON",
            headers    : {
                dbName: dbName
            }
        }).done(response => {
            if (response.type === 'success') {
                setTimeout(load, 300);
                function load() {
                    loadAside.hide();
                    if (dbName !== 'information_schema') {
						var newTbl = newTable();
						ul.append(newTbl);
					}
                    response.data.forEach(function (table) {
                        var li   = document.createElement('LI');
                        var icon = '<i class="far fa-list-alt"></i>';
                        setAttributes(li, {"class": "table-name", "data-table": table, "aria-expanded": "false"});
                        li.innerHTML = "‐‐‐" + icon + " " + table;
                        ul.append(li);
                    });
                }
            } else {
            	setTimeout(unload, 300);
            	function unload() {
					loadAside.hide();
				}
			}
        }).fail(error => {
            console.log(error);
        })
    }

    parent.attr('aria-expanded', 'true');
});

$("section").on('click', '.table-name', function () {
    var expended = $(this).attr('aria-expanded');
    var tableName = $(this).attr("data-table");
    var parent = $(this).parent('ul').parent('div').parent('li');
    dbName = parent.attr("data-base");
    var loadContent = $(".load-content");
    loadContent.show();

    $.ajax({
        url     : 'tables/column',
        type    : 'GET',
        async   : true,
        dataType: "JSON",
        headers    : {
            table: tableName,
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                var table = document.createElement('TABLE');
                var tr    = document.createElement('TR');
                table.append(tr);
                $(window).scrollTop(0);
                response.data.forEach(function (column) {
                    var th       = document.createElement('TH');
                    th.innerHTML = column;
                    tr.append(th)
                });
                var tableColumn = $("#table-columns");
                article.hide();
                $(tableColumn).html(table);
                $(tableColumn).show();
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$("section").on('click', '.new-table', function () {
    var parent = $(this).parent('ul').parent('div').parent('li');
    dbName = parent.attr("data-base");
    article.hide();
    $("#new-table").show();
});

$("section").on('click','#table-submit',function (event) {
    event.preventDefault();
    tableName = $("#tableName").val();
    numberColumn = $("#numberColumn").val();
	$("#update-name").attr("value", tableName);
    $(".fields").remove();
	$("#tableName").val('');
	$("#numberColumn").val(4);

    if (tableName !== '' && numberColumn !== '') {
        addTableFields(numberColumn);
    } else {
        alert("required field");
    }
});

$("section").on('click','#add-submit',function (event) {
    event.preventDefault();
    tableName = $("#update-name").val();
    var addColumn = $("#update-number").val();
    numberColumn = parseInt(numberColumn) + parseInt(addColumn);

    if (tableName !== '' && addColumn !== '') {
        addTableFields(addColumn);
    } else {
        alert("required field");
    }
});

$("#save-table").click(function (event) {
    event.preventDefault();
    var nameField = getFieldValues($(".name-field"));
    var typeField = getFieldValues($(".type-field option:selected"));
    var lengthField = getFieldValues($(".length-field"));
    var defaultField = getFieldValues($(".default-field option:selected"));
    var indexField = getFieldValues($(".index-field option:selected"));
	var loadContent = $(".load-content");
	loadContent.show();

    $.ajax({
        url: 'tables/create',
        type: 'POST',
        async: true,
        dataType: 'JSON',
        data: {
            dbName: dbName,
            tableName: tableName,
            numberColumn: numberColumn,
            dataFields: {
                nameField: nameField,
                typeField: typeField,
                lengthField: lengthField,
                defaultField: defaultField,
                indexField: indexField
            }
        }
    }).done(response => {
        if (response.type === 'success') {
			var dataBaseList = $(".database-list");
			var parent = '';
			$.each(dataBaseList, function (k, v) {
				if (dbName === $(v).attr("data-base")) {
					parent = $(v);
				}
			});
			var tablesList = parent.find(".tables-list");
			var plus = parent.find(".fa-plus-square");
			var minus = parent.find(".fa-minus-square");
			var loadAside = parent.find(".load-aside");

			$(loadAside).show();
			setTimeout(asideLoad, 300);
			function asideLoad() {
				$(loadAside).hide();
				$(tablesList).slideDown();
				$(plus).hide();
				$(minus).show();
				parent.attr("aria-expanded", "true")
			}
			
        	setTimeout(load, 300);
            function load() {
			    loadContent.hide();
				if ($(tablesList).find('*').length == 0) {
			    	var newTbl = newTable();
					$(tablesList).append(newTbl);
				}
				var li   = document.createElement('LI');
				var icon = '<i class="far fa-list-alt"></i>';
				setAttributes(li, {"class": "table-name", "data-table": tableName, "aria-expanded": "false"});
				li.innerHTML = "‐‐‐" + icon + " " + tableName;
				tablesList.append(li);
				$(".fields").remove();
				$("#table").hide();
		    };
        }
    }).fail(error => {
        console.log(error);
    })
});

function newTable() {
	var newTable       = document.createElement("LI");
	var newIcon        = '<i class="far fa-list-alt"></i>';
	newTable.innerHTML = "‐‐‐" + newIcon + " " + "New";
	setAttributes(newTable, {"class": "new-table"});
	return newTable;
}

function getFieldValues(fieldName) {
    var array = [];
    fieldName.each(function() {
        array.push($(this).val());
    });

    return array;
}

function addTableFields(numberColumnLength) {
    article.hide();
    $("#table").show();
    var tableFields = createTableFields();
    for (var i = 1; i <= numberColumnLength; i ++) {
        $(".table").append(tableFields);
    }
}

function createTableFields() {

    var nameFieldObj = {
        "Numeric":       ["TINYINT", "SMALLINT", "MEDIUMINT", "INT", "BIGINT",
                          "DECIMAL", "FLOAT", "DOUBLE", "REAL", "BIT", "BOOLEAN", "SERIAL"],
        "Date and time": ["DATE", "DATETIME", "TIMESTAMP", "TIME", "YEAR"],
        "String":        ["CHAR", "VARCHAR", "TINYTEXT", "TEXT", "MEDIUMTEXT", "LONGTEXT", "BINARY",
                          "VARBINARY", "TINYBLOB", "MEDIUMBLOB", "BLOB", "LONGBLOB", "ENUM", "SET"],
    };

    var nameFieldArr    = ["INT", "VARCHAR", "TEXT", "DATE"];
    var defaultFieldArr = ["None", "NULL", "CURRENT_TIMESTAMP"];
    var indexFieldArr   = ["---", "PRIMARY", "UNIQUE", "INDEX", "FULLTEXT", "SPATIAL"];

    var tableFields = '';
    tableFields += '<tr class="fields">' +
                   '<td><input type="text" name="nameField" class="name-field" /></td>' +
                   '<td><select class="type-field">';

    nameFieldArr.forEach(function (val) {
        tableFields += `<option>${val}</optgroup>`;
    });

    $.each(nameFieldObj, function (k, v) {
        tableFields += `<optgroup label="${k}">`;
        v.forEach(function (val) {
            tableFields += `<option>${val}</option>`;
        });
        tableFields += '</optgroup>';
    });

    tableFields += '</select>' +
                   '</td>' +
                   '<td><input type="text" name="lengthField" class="length-field"></td>' +
                   '<td>' +
                   '<select class="default-field">';

    defaultFieldArr.forEach(function (val) {
        tableFields += `<option>${val}</option>`;
    });

    tableFields += '</select>' +
                   '</td>' +
                   '<td>' +
                   '<select class="index-field">';

    indexFieldArr.forEach(function (val) {
        tableFields += `<option>${val}</option>`;
    });

    tableFields += '</select>' +
                   '</td>' +
                   '</tr>';
    return tableFields;
}

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
