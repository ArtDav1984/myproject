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
    loadContent.show();
    setTimeout(load, 300);
    function load() {
        loadContent.hide();
        article.hide();
        $("#new-db").show();
        $("#db-name").val('');
    }
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

                    var option = `<option value="${response.data}">${response.data}</option>`;
                    $("#copyDb").append(option);
                    $("#moveDb").append(option);
                    modalToggle(`<i class="fas fa-check"></i> Database '${response.data}' has been created`);
                }
            }
        }).fail(error => {
            console.log(error);
        })
    } else {
        alert("required field");
    }
});

$("#open-db-operations").click(function () {
    loadContent.show();
    setTimeout(load, 300);
    function load() {
        loadContent.hide();
        article.hide();
        $("#db-nav").show();
        $(".open-db").removeClass('active');
        $("#open-db-operations").addClass('active');
        $("#new-table").show();
        $("#update-db").show();
        $("#del-db").show();
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
                $(".open-db").attr("data-base", response.data);
                $("#content-header > p > span").html(response.data);

                var optionsCopy = $("#copyDb > option");
                var optionsMove = $("#moveDb > option");
                $.each(optionsCopy, function (k, v) {
                    if (dbName === $(v).val()) {
                        $(v).html(response.data);
                        $(v).val(response.data);
                    }
                });
                $.each(optionsMove, function (k, v) {
                    if (dbName === $(v).val()) {
                        $(v).html(response.data);
                        $(v).val(response.data);
                    }
                });

                article.hide();
                $("#new-table").show();
                modalToggle(`<i class="fas fa-check"></i> Database '${dbName}' has been renamed`);
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
                var optionsCopy = $("#copyDb > option");
                var optionsMove = $("#moveDb > option");
                $.each(optionsCopy, function (k, v) {
                    if (dbName === $(v).val()) {
                        $(v).remove();
                    }
                });
                $.each(optionsMove, function (k, v) {
                    if (dbName === $(v).val()) {
                        $(v).remove();
                    }
                });
                $(parent).remove();
                $("#content-header > p > span").html('');
                article.hide();
                $("#new-db").show();
                $("#db-name").val('');

                modalToggle('<i class="fas fa-check"></i> MySQl returned an empty result set (i.e. 0 rows).');
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
    var check = $(this).attr("aria-checked");
    var loadAside = parent.find('.load-aside');
    var dbName = parent.attr("data-base");

    ul.slideToggle();
    plus.toggle();
    minus.toggle();

    if (expended === 'false') {
        ul.find('li').remove();
        loadAside.show();
        $.ajax({
            url     : 'tables',
            type    : 'GET',
            async   : true,
            dataType: "JSON",
            headers    : {
                dbName: dbName,
            }
        }).done(response => {
            if (response.type === 'success') {
                setTimeout(load, 300);
                function load() {
                    loadAside.hide();
                    if (dbName !== 'information_schema' && dbName !== 'performance_schema') {
                        var newTbl = newTable();
                        ul.append(newTbl);
                    }
                    var browse = `<table data-base="${dbName}" class="db-browse"><tr><th>Table</th><th colspan="5">Action</th></tr>`;
                    response.data.forEach(function (table) {
                        var li   = document.createElement('LI');
						var icon = '<i class="far fa-list-alt"></i>';
                        setAttributes(li, {"class": "table-name new-name", "data-table": table, "data-base": dbName});
                        li.innerHTML = "‐‐‐" + icon + " " + `<span>${table}</span>`;
                        ul.append(li);

                        browse +=    `<tr class="table-row" data-table="${table}" data-base="${dbName}"><td>
                                      <p class="table-name new-name" data-base="${dbName}" 
                                      data-table="${table}">${table}</p></td>` +
                                     `<td><p class="table-name table-settings" data-base="${dbName}" 
                                             data-table="${table}"><i class="far fa-list-alt"></i> Browse</p></td>` +
                                     `<td><p class="open-table-structure table-settings" data-base="${dbName}" 
                                             data-table="${table}"><i class="fas fa-th-list"></i> Structure</p></td>`;
                        if (dbName !== 'information_schema' && dbName !== 'performance_schema') {
                           browse += `<td><p class="open-table-insert table-settings" data-base="${dbName}" 
                                             data-table="${table}"><i class="fas fa-file-upload"></i> Insert</p></td>` +
                                     `<td><p class="empty-tbl-submit table-settings" data-table="${table}">
                                          <i class="fas fa-folder-open"></i> Empty</p></td>` +
                                     `<td><p class="delete-tbl-submit table-settings" data-table="${table}">
                                          <i class="fas fa-minus-circle"></i> Drop</p></td>` +
                                     `</tr>`;
                        }
                    });
                    browse += `</table`;
                    $("#db-browse").append(browse);
                    $(".open-db").attr("data-base", dbName);
                    $("#open-db-browse").attr('data-base');
                    if (check === 'false') {
                        var dbBrowse = $(".db-browse");
                        $.each(dbBrowse, function (k, v) {
                            if (dbName === $(v).attr("data-base")) {
                                $(dbBrowse).hide();
                                $(v).show();
                            } else {
                                $(v).hide();
                            }
                        });
                    }
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

$("section").on('click', '.database', function () {
    var parent = $(this).parent("li");
    dbName = parent.attr("data-base");
    database = $(this);
    loadContent.show();
    setTimeout(load, 300);
    function load() {
        loadContent.hide();
        $(".table-settings").removeClass('active');
        var dbBrowse = $(".db-browse");
        $.each(dbBrowse, function (k, v) {
            if (dbName === $(v).attr("data-base")) {
                $(dbBrowse).hide();
                $(v).show();
            }
            else {
                $(v).hide();
            }
        });
        article.hide();
        var icon = '<i class="fas fa-database"></i>';
        $("#content-header > p > span").html(' ' + icon + ' ' + dbName);
        $("#db-nav").show();
        $("#db-browse").show();
        $(".open-db").removeClass('active');
        $("#open-db-browse").addClass('active');
        if (dbName === 'information_schema' || dbName === 'performance_schema') {
            $("#open-db-operations").hide();
        } else {
            $("#open-db-operations").show();
        }
    }
});



$("section").on('click', '.new-table', function () {
    var parent = $(this).parent('ul').parent('div').parent('li');
    dbName = parent.attr("data-base");
    loadContent.show();
    setTimeout(load, 300);
    function load() {
        loadContent.hide();
        article.hide();
        $("#new-table").show();
    }
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
        loadContent.show();
        setTimeout(load, 300);
        function load() {
            loadContent.hide();
            addTableFields(numberColumn);
        }
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

$(".open-table-operations").click(function(event) {
    event.preventDefault();
    dbName = $(this).attr("data-base");
    tableName = $(this).attr("data-table");
    loadContent.show();

    setTimeout(load, 300);
    function load() {
        loadContent.hide();
        $(".open-table").removeClass('active');
        $(".open-table-operations").addClass('active');
        $(".tables-content-article").hide();
        $(".empty-tbl-submit").attr("data-table", tableName);
        $(".delete-tbl-submit").attr("data-table", tableName);
        article.hide();
        $("#table-operations").show();
        $("#tables-content").show();
        $("#copyTblName").val(tableName);
        $("#moveTblName").val(tableName);
        $("#copyDb").val(dbName);
        $("#moveDb").val(dbName);
    }
});

$("#copy-tbl-submit").click(function (event) {
    event.preventDefault();
    newDbName = $("#copyDb > option:selected").val();
    newTblName = $("#copyTblName").val();
    loadContent.show();

    $.ajax({
        url: 'tables/copy',
        type: 'POST',
        async: true,
        dataType: 'JSON',
        data: {
            newDbName: newDbName,
            newTblName: newTblName,
            dbName: dbName,
            tableName: tableName
        }
    }).done(response => {
        if (response.type === 'success') {
            var dataBaseList = $(".database-list");
            var parent = '';
            $.each(dataBaseList, function (k, v) {
                if (newDbName === $(v).attr("data-base")) {
                    parent = $(v);
                }
            });
            var tablesList = parent.find(".tables-list");

            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                addTable(tablesList, newTblName, newDbName);
                modalToggle(`<i class="fas fa-check"></i> Table '${dbName}'.'${tableName}' has been copied to '${newDbName}'.'${newTblName}'.
                             Privileges have been adjusted`);
                dbName = newDbName;
                tableName = newTblName;
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$("#move-tbl-submit").click(function (event) {
    event.preventDefault();
    newDbName = $("#moveDb > option:selected").val();
    newTblName = $("#moveTblName").val();
    loadContent.show();

    $.ajax({
        url: 'tables/move',
        type: 'POST',
        async: true,
        dataType: 'JSON',
        data: {
            newDbName: newDbName,
            newTblName: newTblName,
            dbName: dbName,
            tableName: tableName
        }
    }).done(response => {
        if (response.type === 'success') {
            var dataBaseList = $(".database-list");
            var parent = '';
            $.each(dataBaseList, function (k, v) {
                if (newDbName === $(v).attr("data-base")) {
                    parent = $(v);
                }
            });
            var tablesList = parent.find(".tables-list");

            setTimeout(load, 300);
            function load() {
                loadContent.hide();

                addTable(tablesList, newTblName, newDbName);
                removeTable(tableName, dbName);

                modalToggle(`<i class="fas fa-check"></i> Table '${dbName}'.'${tableName}' has been moved to '${newDbName}'.'${newTblName}'.
                             Privileges have been adjusted`);

                dbName = newDbName;
                tableName = newTblName;
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$("#save-table").click(function (event) {
    event.preventDefault();
    var nameField = getFieldValues($(".name-field"));
    var typeField = getFieldValues($(".type-field option:selected"));
    var lengthField = getFieldValues($(".length-field"));
    var defaultField = getFieldValues($(".default-field option:selected"));
    var indexField = getFieldValues($(".index-field option:selected"));

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
            loadContent.show();
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
                var browse = `<table data-base="${dbName}" class="db-browse"><tr><th>Table</th><th colspan="5">Action</th></tr>` +
                             `<tr class="table-row" data-table="${tableName}" data-base="${dbName}"><td>
                                      <p class="table-name new-name" data-base="${dbName}" 
                                      data-table="${tableName}">${tableName}</p></td>` +
                             `<td><p class="table-name table-settings" data-base="${dbName}" 
                                             data-table="${tableName}"><i class="far fa-list-alt"></i> Browse</p></td>` +
                             `<td><p class="open-table-structure table-settings" data-base="${dbName}" 
                                             data-table="${tableName}"><i class="fas fa-th-list"></i> Structure</p></td>`;
                             if (dbName !== 'information_schema' && dbName !== 'performance_schema') {
                                 browse += `<td><p class="open-table-insert table-settings" data-base="${dbName}" 
                                             data-table="${tableName}"><i class="fas fa-file-upload"></i> Insert</p></td>` +
                                 `<td><p class="empty-tbl-submit table-settings" data-table="${tableName}">
                                          <i class="fas fa-folder-open"></i> Empty</p></td>` +
                                 `<td><p class="delete-tbl-submit table-settings" data-table="${tableName}">
                                          <i class="fas fa-minus-circle"></i> Drop</p></td></tr>`;
                             }

                $("#db-browse").append(browse);
                addTable(tablesList, tableName, dbName);
                tablesStructure(response.data, dbName, tableName);
                modalToggle(`<i class="fas fa-check"></i> Table '${tableName}' has been created`);
            };
        }
        else if (response.type === 'error') {
            alert(response.data);
        }
    }).fail(error => {
        console.log(error);
    })
});

$("section").on('click', '.open-table-structure', function (event) {
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
                    $.each(newName, function (k, v) {
                        if (tableName === $(v).attr("data-table")) {
                            $(v).find("span").html(newTblName);
                            $(v).attr("data-table", newTblName);
                        }
                    });
                    $("#tblName").val(newTblName);
                    $("#copyTblName").val(newTblName);
                    $("#moveTblName").val(newTblName);
                    $(".open-table").attr("data-base", dbName);
                    $(".open-table").attr("data-table", newTblName);
                    $(".table-settings").attr("data-table", newTblName);
                    $(".empty-tbl-submit").attr("data-table", newTblName);
                    $(".delete-tbl-submit").attr("data-table", newTblName);
                    modalToggle(`<i class="fas fa-check"></i> Table '${tableName}' has been renamed`);
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

$("section").on('click','.delete-tbl-submit',function (event){
    event.preventDefault();
    tableName = $(this).attr("data-table");
    openModal(`You are about to DESTROY a complete table! Do you really 
              want to execute "DROP TABLE ${tableName}"?`, "confirm-tbl-delete");
});

$("section").on('click','.empty-tbl-submit',function (event){
    event.preventDefault();
    tableName = $(this).attr("data-table");
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
                var tableRow = $(".table-row");
                $.each(tableRow, function (k, v) {
                   if (tableName === $(v).attr("data-table") && dbName === $(v).attr("data-base")) {
                       $(v).remove();
                   }
                });
                removeTable(tableName, dbName);
                article.hide();
                $("#new-table").show();
                $("#tableName").val('');
                modalToggle('<i class="fas fa-check"></i> MySQl returned an empty result set (i.e. 0 rows).');
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
                modalToggle('<i class="fas fa-check"></i> MySQl returned an empty result set (i.e. 0 rows).');
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
                if (dbName !== "information_schema" && dbName !== "performance_schema") {
                    tHead.append(thDel);
                }
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
                    if (dbName !== "information_schema" && dbName !== "performance_schema") {
                        tBody.append(trDel);
                    }
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
                $(".open-table-browse").addClass('active');
                $(".open-table-browse").addClass('table-name');
                article.hide();
                $(".tables-content-article").hide();
                if (dbName === 'information_schema' || dbName === 'performance_schema') {
                    $(".open-table-insert").hide();
                    $(".open-table-operations").hide();
                } else {
                    $(".open-table-insert").show();
                    $(".open-table-operations").show();
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
                modalToggle('<i class="fas fa-check"></i> 1 row affected');
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$("section").on('click', '.open-table-insert', function(event) {
    event.preventDefault();
    dbName = $(this).attr("data-base");
    tableName = $(this).attr("data-table");
    loadContent.show();

    $.ajax({
       url: 'fields/data',
       type: 'GET',
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
                $(".open-table").removeClass('active');
                $(".open-table-insert").addClass('active');
                $(".tables-content-article").hide();
                article.hide();
                $("#table-insert").show();
                $("#tables-content").show();
                $("#insert").remove();
                var insert = `<div id="insert"><form method="post"><table>` +
                             `<tr><th>Column</th><th>Type</th><th>Value</th></tr>`;
                response.data.forEach(function (val) {
                    insert += `<tr><td>${val.name}</td><td>${val.type}(${val.max_length})</td><td>`;
                              if (val.type == 'int') {
                                  insert+= `<input type="text" value="0" class="insert-data insert-input">`;
                              } else {
                                  insert += `<textarea class="insert-data insert-text">0</textarea>`;
                              }
                    insert +=  `</td></tr>`;
                });
                    insert += `</table><div id="insert-bot"><button type="submit" id="save-insert">Go</button></div></form></div>`;
                $("#table-insert").append(insert);
            }
        }
    }).fail(error => {
        console.log(error);
    });
})

$("section").on('click', '#save-insert', function (event){
    event.preventDefault();
    var insertData = getFieldValues($(".insert-data"));

    $.ajax({
        url: 'fields/insert',
        type: 'POST',
        async: true,
        dataType: 'JSON',
        data: {
            dbName: dbName,
            tableName: tableName,
            insertData: insertData
        }
    }).done(response => {
        if (response.type === 'success') {
            loadContent.show();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                $(".insert-data").val('');
                modalToggle('<i class="fas fa-check"></i> 1 row inserted.');
            }
        }
        else {
            alert(response.data);
        }
    }).fail(error => {
        console.log(error);
    })
});

function addTable(tblList, tbl, db) {
    if ($(tblList).find('*').length == 0) {
        var newTbl = newTable();
        $(tblList).append(newTbl);
    }
    var li   = document.createElement('LI');
    var icon = '<i class="far fa-list-alt"></i>';
    setAttributes(li, {"class": "table-name new-name", "data-table": tbl, "data-base": db});
    li.innerHTML = "‐‐‐" + icon + " " + `<span>${tbl}</span>`;
    tblList.append(li);
}

function removeTable(tbl, db) {
    var ul =$(".tables-list");
    var li = $(".new-name");
    $.each(ul, function (k, v) {
        if (db === $(v).attr('data-base')) {
            $.each(li, function (key, val) {
                if (tbl === $(val).attr("data-table")) {
                    $(v).find($(val)).remove();
                    if ($(v).find('*').length <= 2) {
                        $(v).find($(".new-table")).remove();
                    }
                }
            });
        }
    });
}

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

    $(".open-table").attr("data-base", db);
    $(".open-table").attr("data-table", table);
    $(".open-table").removeClass('active');
    $(".open-table-structure").addClass('active');
    $(".open-table-browse").addClass('table-name');
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
