var database = '';
var dbName = '';
var newDbName = '';
var tableName = '';
var newTblName = '';
var deleteField = '';
var id = '';
var numberColumn;
var article = $(".article");
var loadContent = $(".load-content");

$("#create-db").click(function () {
    article.hide();
    $("#new-db").show();
    $("#db-name").val('');
});

$("section").on('click', '#db-submit',function (event) {
    event.preventDefault();
    var charName = $(".charset").val();
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
                        `<div class="hide-line"> <ul class="tables-list" data-base="${response.data}"> </ul> </div> </li> </div>`;
                    $(".databases").append(newDbLine);
                    modalToggle(`Database '${response.data}' has been created`);
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
    if (dbName !== 'information_schema') {
        article.hide();
        $("#new-table").show();
        $("#update-db").show();
        $("#del-db").show();
    } else {
        dbName = '';
        $("#db-name").val('');
        $(article).hide();
        $("#new-db").show();
    }
});

$("section").on('click','#update-db-submit',function (event){
    event.preventDefault();
    newDbName = $("#dbName").val();

    if (newDbName !== '') {
        openModal(`CREATE DATABASE ${newDbName} / DROP DATABASE ${dbName}`, "confirm-db-update");
    } else {
        alert("required field");
    }
});

$("section").on('click', '#confirm-db-update', function (event) {
    event.preventDefault();
    loadContent.show();
    $("#dbName").val('');

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
            $("#modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                database.html(` ${response.data}`);
                var li = database.parent('li');
                li.removeAttr("data-base");
                li.attr("data-base", response.data);
                var newTable = $(li).find('div').find('ul').find('.new-table');
                var tableName = $(li).find('div').find('ul').find('.table-name');
                var tablesList = $(li).find('div').find('ul');
                $(newTable).attr("data-base", response.data);
                $(tableName).attr("data-base", response.data);
                $(tablesList).attr("data-base", response.data);
                $(tableName).attr("class", "table-name new-name");
                article.hide();
                $("#new-table").show();
                modalToggle(`Database '${dbName}' has been renamed`);
                dbName = response.data;
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$("section").on('click','#delete-db-submit',function (event){
    event.preventDefault();
    openModal(`You are about to DESTROY a complete database! Do you really want to execute "DROP DATABASE ${dbName}"?`,
              "confirm-db-delete");
});

$("section").on('click', '#confirm-db-delete', function (event) {
    event.preventDefault();
    loadContent.show();

    $.ajax({
        url: 'databases/delete',
        type: 'GET',
        async: true,
        dataType: "JSON",
        headers: {
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
            $("#modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                var parent = database.parent('li').parent('div');
                $(parent).remove();
                article.hide();
                $("#new-db").show();
                $("#db-name").val('');
                modalToggle('MySQl returned an empty result set (i.e. 0 rows).');
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$(".cancel-modal").click(function () {
    $("#modal").hide()
});

$("section").on('click', '.db-name', function () {
    var parent = $(this).parent('li');
    var plus = parent.find('.fa-plus-square');
    var minus = parent.find('.fa-minus-square');
    var ul = parent.find('.tables-list');
    var expended = parent.attr('aria-expanded');
    var loadAside = parent.find('.load-aside');
    var dbName = parent.attr("data-base");

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
                        setAttributes(li, {"class": "table-name new-name", "data-table": table, "data-base": dbName});
                        li.innerHTML = "‐‐‐" + icon + " " + `<span>${table}</span>`;
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

$("#open-table-operations").click(function(event) {
	event.preventDefault();
	dbName = $(this).attr("data-base");
	tableName = $(this).attr("data-table");

	$(".open-table").removeClass('active');
	$("#open-table-operations").addClass('active');
	$(".tables-content-article").hide();
	$("#table-operations").show();
})

$("#save-table").click(function (event) {
    event.preventDefault();
    var nameField = getFieldValues($(".name-field"));
    var typeField = getFieldValues($(".type-field option:selected"));
    var lengthField = getFieldValues($(".length-field"));
    var defaultField = getFieldValues($(".default-field option:selected"));
    var indexField = getFieldValues($(".index-field option:selected"));
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
                setAttributes(li, {"class": "table-name new-name", "data-table": tableName, "data-base": dbName});
                li.innerHTML = "‐‐‐" + icon + " " + `<span>${tableName}</span>`;
                tablesList.append(li);

                tablesStructure(response.data, dbName, tableName);
                modalToggle(`Table '${tableName}' has been created`);
            };
        }
    }).fail(error => {
        console.log(error);
    })
});

$("section").on('click', '#open-table-structure', function (event) {
    event.preventDefault();
    tableName = $(this).attr("data-table");
    dbName = $(this).attr("data-base");
    loadContent.show();

    $.ajax({
        url: 'tables/structure',
        type: 'post',
        async: true,
        dataType: 'JSON',
        headers: {
            dbName: dbName,
            tableName: tableName
        }
    }).done(response => {
        if (response.type === 'success') {
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                tablesStructure(response.data, dbName, tableName);
            };
        }
    }).fail(error => {
        console.log(error);
    })
})

$("section").on('click','#update-tbl-submit',function (event){
    event.preventDefault();
    newTblName = $("#tblName").val();

    if (newTblName !== '') {
        loadContent.show();
        $.ajax({
            url: 'tables/update',
            type: 'POST',
            async: true,
            dataType: 'JSON',
            data: {
                dbName: dbName,
                tableName: tableName,
                newTblName: newTblName
            }
        }).done(response => {
            if (response.type === 'success') {
                setTimeout(load, 300);
                function load() {
                    loadContent.hide();
                    var newName = $(".new-name");
                    var li = '';
                    $.each(newName, function (k, v) {
                        if (tableName === $(v).attr("data-table")) {
                            li = $(v);
                        }
                    });
                    li.find("span").html(newTblName);
                    li.attr("data-table", newTblName);
                    $("#tblName").val(newTblName);
					$(".open-table").attr("data-base", dbName);
					$(".open-table").attr("data-table", newTblName);
                    modalToggle(`Table '${tableName}' has been renamed`);
                    tableName = newTblName;
                }
            }
        }).fail(error => {
            console.log(error);
        })
    } else {
        alert("required field");
    }
});

$("section").on('click','#delete-tbl-submit',function (event){
    event.preventDefault();
    openModal(`You are about to DESTROY a complete table! Do you really 
              want to execute "DROP TABLE ${tableName}"?`, "confirm-tbl-delete");
});

$("section").on('click','#empty-tbl-submit',function (event){
    event.preventDefault();
    openModal(`You are about to TRUNCATE a complete table!
     Do you really want to execute TRUNCATE '${dbName}'.'${tableName}'?`, "confirm-tbl-empty");
});

$("section").on('click', '#confirm-tbl-delete', function (event) {
    event.preventDefault();
    loadContent.show();

    $.ajax({
        url: 'tables/delete',
        type: 'GET',
        async: true,
        dataType: "JSON",
        headers: {
            dbName: dbName,
            tableName: tableName
        }
    }).done(response => {
        if (response.type === 'success') {
            $("#modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                var ul =$(".tables-list");
                var li = $(".new-name");
                var table = '';
                var tablesList = '';
                $.each(li, function (k, v) {
                    if (tableName === $(v).attr("data-table")) {
                        table = $(v);
                    }
                });
                $.each(ul, function (k, v) {
                    if (dbName === $(v).attr('data-base')) {
                        tablesList = $(v);
                    }
                });
                table.remove();
                if ($(tablesList).find('*').length <= 2) {
                    var newTbl = $(".new-table");
                    $(tablesList).find($(newTbl)).remove();
                }
                article.hide();
                $("#new-table").show();
                $("#tableName").val('');
                modalToggle('MySQl returned an empty result set (i.e. 0 rows).');
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$("section").on('click', '#confirm-tbl-empty', function (event) {
    event.preventDefault();
    loadContent.show();

    $.ajax({
        url: 'tables/truncate',
        type: 'GET',
        async: true,
        dataType: "JSON",
        headers: {
            dbName: dbName,
            tableName: tableName
        }
    }).done(response => {
        if (response.type === 'success') {
            $("#modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                $(".table-fields").remove();
                modalToggle('MySQl returned an empty result set (i.e. 0 rows).');
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$("section").on('click', '.table-name', function () {
    tableName = $(this).attr("data-table");
    dbName = $(this).attr("data-base");
    loadContent.show();

    $.ajax({
        url     : 'fields',
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
                $(window).scrollTop(0);
                var table    = document.createElement('TABLE');
                var thDel       = document.createElement('TH');
                var tHead    = document.createElement('TR');
                thDel.innerHTML = '';
                tHead.append(thDel);
                table.append(tHead);
                response.column.forEach(function (col) {
                    var th       = document.createElement('TH');
                    th.innerHTML = col;
                    tHead.append(th)
                });

                $.each(response.field, function (key, val) {
                    var tBody = document.createElement('TR');
                    var trDel = document.createElement('TD');
                    setAttributes(tBody, {"class": "table-fields", "data-base": dbName, "data-table": tableName});
                    trDel.innerHTML = `<p class="del-field" data-base="${dbName}"` +
                        ` data-table="${tableName}" data-id="${val.id}">` +
                        '<i class="fas fa-minus-circle"></i> Delete</p>';
                    table.append(tBody);
                    tBody.append(trDel);
                    $.each(val, function (k, v) {
                        var td = document.createElement('TD');
                        td.innerHTML = v;
                        tBody.append(td);
                    })
                });

                $("#tblName").val(tableName);
                $("#table-browse").html(table);
                $(".open-table").attr("data-base", dbName);
                $(".open-table").attr("data-table", tableName);
                $(".open-table").removeClass('active');
                $("#open-table-browse").addClass('active');
                $("#open-table-browse").addClass('table-name');
                article.hide();
                $(".tables-content-article").hide();
                if (dbName === 'information_schema') {
                    $("#open-table-insert").hide();
                    $("#open-table-operations").hide();
                } else {
					$("#open-table-insert").show();
					$("#open-table-operations").show();
                }
				$("#table-browse").show();
                $("#tables-content").show();
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$("section").on('click', '.del-field', function (event){
    event.preventDefault();
    id = $(this).attr("data-id");
    dbName = $(this).attr("data-base");
    tableName = $(this).attr("data-table");
    deleteField = $(this);
    openModal(`Do you really want to execute "DELETE FROM '${tableName}' WHERE '${tableName}'.'id' = ${id}"?`, "confirm-del-field")
})

$("section").on('click', '#confirm-del-field', function (event) {
    event.preventDefault();
    loadContent.show();

    $.ajax({
        url: 'fields/delete/' + id,
        type: 'GET',
        async: true,
        dataType: "JSON",
        headers: {
            dbName: dbName,
            tableName: tableName
        }
    }).done(response => {
        if (response.type === 'success') {
            setTimeout(load, 300);
            function load() {
                $("#modal").hide();
                loadContent.hide();
                $(deleteField).parent('td').parent('tr').remove();
                modalToggle('1 row affected');
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$("#open-table-insert").click(function(event) {
	event.preventDefault();
	dbName = $(this).attr("data-base");
	tableName = $(this).attr("data-table");

	$(".open-table").removeClass('active');
	$("#open-table-insert").addClass('active');
	$(".tables-content-article").hide();
	$("#table-insert").show();
})

function tablesStructure(fields, db, table) {
    $(".field-data").remove();
    $.each(fields, function (key, val) {
        var tr = document.createElement('TR');
        setAttributes(tr, {"class": "field-data"});
        $('.table-structure').append(tr);
        $.each(val, function (k, v) {
            var td = document.createElement('TH');
            td.innerHTML = v;
            tr.append(td)
        })
    });

	$(".open-table").attr("data-base", dbName);
	$(".open-table").attr("data-table", tableName);
	$(".open-table").removeClass('active');
	$("#open-table-structure").addClass('active');
	$("#open-table-browse").addClass('table-name');
	article.hide();
	$(".tables-content-article").hide();
	$("#table-structure").show();
	$("#tables-content").show();
}

function modalToggle(data) {
    $("#response-modal").show();
    $("#m-body > p").html(data);
    setTimeout(closeModal, 2000);
    function closeModal() {
        $("#response-modal").hide();
    }
}

function openModal(data, id) {
    $("#modal").show();
    $("#modal > #modal-body > p").html(data);
    var button = $(".confirm-db");
    $(button).attr("id", id);
}

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
