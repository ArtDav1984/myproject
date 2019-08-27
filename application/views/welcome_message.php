<?php $this->load->helper('url'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
    <link rel="stylesheet" href="<?php echo base_url() ?>assets/css/main.css" type="text/css" media="screen" />
</head>
<body>

<section>

    <div id="aside">
        <h1><a href="/"><img src="<?php echo base_url() ?>assets/img/logo_left.png"></a></h1>
        
        <div class="aside-icons">
            <a href="/"><img src="<?php echo base_url() ?>assets/img/b_home.png" alt=""></a>
            <a href="/"><img src="<?php echo base_url() ?>assets/img/s_loggoff.png" alt=""></a>
            <a href="/"><img src="<?php echo base_url() ?>assets/img/b_docs.png" alt=""></a>
            <a href="/"><img src="<?php echo base_url() ?>assets/img/b_sqlhelp.png" alt=""></a>
            <a href="/"><img src="<?php echo base_url() ?>assets/img/s_cog.png" alt=""></a>
            <a href="/"><img src="<?php echo base_url() ?>assets/img/s_reload.png" alt=""></a>
        </div>

        <ul class="databases">

            <div class="vertical-line">
                <li class="create-db"><span class="horizontal-line">--</span><img src="<?php echo base_url() ?>assets/img/b_newdb.png">
                    <span id="create-db">New</span>
                </li>
            </div>
			
			<?php if (!is_null($databases)) : ?>
				
				<?php foreach ($databases as $database => $item) : ?>

                    <div class="vertical-line">
                        <li class="database-list" aria-expanded="false" data-base="<?= $item['Database']; ?>">
                            <img class="load-aside" src="<?php echo base_url() ?>assets/img/load.gif" />
                            <img class="fa-plus-square db-name" aria-checked="true" src="<?php echo base_url() ?>assets/img/b_plus.png"><img class="fa-minus-square db-name" aria-checked="true" src="<?php echo base_url() ?>assets/img/b_minus.png"><span class="horizontal-line">-</span><img src="<?php echo base_url() ?>assets/img/s_db.png">
                            <span class="db-name database" aria-checked="false"><?= $item['Database']; ?></span>
                            <div class="hide-line">
                                <ul class="tables-list" data-base="<?= $item['Database']; ?>"> </ul>
                            </div>
                        </li>
                    </div>
				
				<?php endforeach; ?>
			
			<?php endif; ?>

        </ul>
    </div>

    <div id="content">
        
        <div id="content-header">
           <p>
               <img src="<?php echo base_url() ?>assets/img/s_host.png"> Server: 127.0.0.1 <span></span>
           </p>
        </div>
        
        
        <ul id="home-nav" class="article">
            <li id="open-databases" class="open-home"><img src="<?php echo base_url() ?>assets/img/s_db.png"> Databases</li>
            <li id="open-charsets" class="open-home"><img src="<?php echo base_url() ?>assets/img/s_asci.png"> Charsets</li>
        </ul>

        <div id="home" class="article databases-article">
            <div id="general-settings">
                <div class="general-settings-head">
                    <h3>General settings</h3>
                </div>
                <div class="general-settings-body">
                   <p>
                       <img src="<?php echo base_url() ?>assets/img/s_asci.png">
                       Server connection collation:
                       <select id="charsets" name="charsets" aria-expanded="false">
		
		                   <?php if (!is_null($chars)) : ?>
			
			                   <?php foreach ($chars as $char) : ?>
                                   <option value="<?= $char ?>" class="charset">
					                   <?= $char ?>
                                   </option>
			                   <?php endforeach; ?>
		
		                   <?php endif; ?>

                       </select>
                   </p>
                </div>
            </div>
            
            <div id="appearance-settings">
                <div class="appearance-settings-head">
                    <h3>Appearance settings</h3>
                </div>
                <div class="appearance-settings-body">
                    <p>
                        <img src="<?php echo base_url() ?>assets/img/s_lang.png">
                        Language:
                        <select>
                            <option value="English">English</option>
                            <option value="Dansk-Danish">Dansk-Danish</option>
                            <option value="Nederlands-Dutch">Nederlands-Dutch</option>
                            <option value="English(United-Kingdom)">English(United-Kingdom)</option>
                            <option value="Easti-Estonian">Easti-Estonian</option>
                            <option value="Suomi-Finnish">Suomi-Finnish</option>
                            <option value="Francais-French">Francais-French</option>
                            <option value="Galego-Galician">Galego-Galician</option>
                            <option value="Deutsch-German">Deutsch-German</option>
                            <option value="Magyar-Hungarian">Magyar-Hungarian</option>
                            <option value="Bahasa Indonesia-Indonesian Interlingua">Bahasa Indonesia-Indonesian Interlingua</option>
                            <option value="Italiano-Italian">Italiano-Italian</option>
                            <option value="Lietuviu-Lithuanian">Lietuviu-Lithuanian</option>
                            <option value="Norsk-Norwegian">Norsk-Norwegian</option>
                            <option value="Polski-Polish">Polski-Polish</option>
                            <option value="Srpski-Serbian(latin)">Srpski-Serbian(latin)</option>
                            <option value="Espanol-Spanish">Espanol-Spanish</option>
                            <option value="Svenska-Swedish">Svenska-Swedish</option>
                            <option value="Русский-Russian">Русский-Russian</option>
                            <option value="Հայերեն-Armenian">Հայերեն-Armenian</option>
                        </select>
                    </p>
                    <br>
                    <p>
                        <img src="<?php echo base_url() ?>assets/img/s_theme.png">
                        Theme:
                        <select>
                            <option value="pmahomme">pmahomme</option>
                            <option value="Original">Original</option>
                        </select>
                    </p>
                </div>
            </div>
        </div>
        
        
        <div id="new-db" class="article databases-article">
            <form method="post">
                <label for="db-name">
                    <img src="<?php echo base_url() ?>assets/img/b_newdb.png"> Create Database
                </label> <br /><br />
                <input type="text" name="name" id="db-name" placeholder="Database name" />
                <select id="charsets" name="charsets" aria-expanded="false">
					
					<?php if (!is_null($chars)) : ?>
						
						<?php foreach ($chars as $char) : ?>
                            <option value="<?= $char ?>" class="charset">
								<?= $char ?>
                            </option>
						<?php endforeach; ?>
					
					<?php endif; ?>

                </select>
                <button type="submit" id="db-submit">Create</button>
            </form>
        </div>
        
        <div id="databases-table" class="article databases-article">
            <table>
                <tr><th>Database</th></tr>
	            <?php if (!is_null($databases)) : ?>
		
		            <?php foreach ($databases as $database => $item) : ?>

                        <tr>
                            <td>
                                <li class="database-list content-list" aria-expanded="false" data-base="<?= $item['Database']; ?>">
                                    <span class="db-name database" aria-checked="false"><?= $item['Database']; ?></span>
                                </li>
                            </td>
                        </tr>
		
		            <?php endforeach; ?>
	
	            <?php endif; ?>
            </table>
        </div>
        
        <div id="collations" class="databases-article">
            <table>
                <tr><th>Collation</th></tr>
	            <?php if (!is_null($chars)) : ?>
		
		            <?php foreach ($chars as $char) : ?>
                        
                        <tr><td><?= $char; ?></td></tr>
                        
		            <?php endforeach; ?>
	
	            <?php endif; ?>
            </table>
        </div>
        
        <div id="db-nav" class="article">
            <ul>
                <li id="open-db-browse" class="open-db"><img src="<?php echo base_url() ?>assets/img/b_props.png"> <span class="database">Structure</span></li>
                <li id="open-db-operations" class="open-db"><img src="<?php echo base_url() ?>assets/img/b_tblops.png"> Operations</li>
            </ul>
        </div>
        
        <div id="db-browse" class="article">
        
        </div>

        <div id="new-table" class="article">
            <form method="post">
                <fieldset>
                    <legend><img src="<?php echo base_url() ?>assets/img/b_table_add.png"> Create table</legend>
                    <span>Name:</span> <input type="text" name="tableName" id="tableName"/>
                    <span id="columns-title">Number of columns:</span>
                    <input type="number" name="numberColumn" id="numberColumn" value="4"/>
                    <br /><br />
                    <button type="submit" id="table-submit">Go</button>
                </fieldset>
            </form>
        </div>

        <div id="update-db" class="article">
            <form method="post">
                <fieldset>
                    <legend><img src="<?php echo base_url() ?>assets/img/b_edit.png"> Rename database to</legend>
                    <input type="text" name="tableName" id="dbName"/>
                    <br /><br />
                    <button type="submit" id="update-db-submit">Go</button>
                </fieldset>
            </form>
        </div>

        <div id="del-db" class="article">
            <form method="post">
                <fieldset>
                    <legend><img src="<?php echo base_url() ?>assets/img/b_deltbl.png"> Remove database</legend>
                    <button id="delete-db-submit">Drop the database (DROP)</button>
                </fieldset>
            </form>
        </div>

        <div id="tables-content" class="article">

            <ul id="tables-nav">
                <li class="open-table-browse open-table"><img src="<?php echo base_url() ?>assets/img/b_browse.png"> Browse</li>
                <li class="open-table-structure open-table"><img src="<?php echo base_url() ?>assets/img/b_props.png"> Structure</li>
                <li class="open-table-insert open-table"><img src="<?php echo base_url() ?>assets/img/b_insrow.png"> Insert</li>
                <li class="open-table-operations open-table"><img src="<?php echo base_url() ?>assets/img/b_tblops.png"> Operations</li>
            </ul>

            <div id="table-browse" class="tables-content-article">

            </div>

            <div id="table-structure" class="tables-content-article">
                <table class="table-structure">
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Max-length</th>
                        <th>Default</th>
                        <th>Primary-key</th>
                    </tr>
                </table>
            </div>

            <div id="table-insert" class="tables-content-article">
            
            </div>

            <div id="table-operations" class="tables-content-article">
                <div id="update-table">
                    <form method="post">
                        <fieldset>
                            <legend> Rename table to</legend>
                            <input type="text" name="tableName" id="tblName"/>
                            <br /><br />
                            <button type="submit" id="update-tbl-submit">Go</button>
                        </fieldset>
                    </form>
                </div>

                <div id="copy-table">
                    <form method="post">
                        <fieldset>
                            <legend> Copy table to (database.table)</legend>
                            <select name="copyDb" id="copyDb">
	
	                            <?php if (!is_null($databases)) : ?>
		
		                            <?php foreach ($databases as $database => $item) : ?>

                                        <option value="<?= $item['Database'] ?>">
				                            <?= $item['Database'] ?>
                                        </option>
		
		                            <?php endforeach; ?>
	
	                            <?php endif; ?>
                            
                            </select>
                            <input type="text" name="tableName" id="copyTblName"/>
                            <br /><br />
                            <button type="submit" id="copy-tbl-submit">Go</button>
                        </fieldset>
                    </form>
                </div>

                <div id="move-table">
                    <form method="post">
                        <fieldset>
                            <legend> Move table to (database.table)</legend>
                            <select name="copyDb" id="moveDb">
					
					            <?php if (!is_null($databases)) : ?>
						
						            <?php foreach ($databases as $database => $item) : ?>

                                        <option value="<?= $item['Database'] ?>">
								            <?= $item['Database'] ?>
                                        </option>
						
						            <?php endforeach; ?>
					
					            <?php endif; ?>

                            </select>
                            <input type="text" name="tableName" id="moveTblName"/>
                            <br /><br />
                            <button type="submit" id="move-tbl-submit">Go</button>
                        </fieldset>
                    </form>
                </div>

                <div id="del-table">
                    <form method="post">
                        <fieldset>
                            <legend>Delete data or table</legend>
                            <button class="empty-tbl-submit">Empty the table (TRUNCATE)</button> <br>
                            <button class="delete-tbl-submit">Delete the table (DROP)</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>

        <div id="table" class="article">
            <form method="post">
                Table name: <input type="text" id="update-name">
                Add: <input type="number" id="update-number" value="1">
                <button type="submit" id="add-submit">Go</button>
                <div class="line"></div>
                <table class="table">
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Length/Values</th>
                        <th>Default</th>
                        <th>Index</th>
                    </tr>
                </table>
                <div id="bot-line">
                    <button type="submit" id="save-table">Save</button>
                </div>
            </form>
        </div>
    </div>
    </div>

    <div id="modal">
        <div id="modal-header">
            <h5>Confirm</h5>
            <button type="button" class="cancel-db-update cancel-modal close">&times;</button>
        </div>
        <div id="modal-body">
            <p>

            </p>
        </div>
        <div id="modal-footer">
            <form method="post" id="update-db-form">
                <button type="submit" class="confirm-db">OK</button>
                <button type="button"  class="cancel-modal">Cancel</button>
            </form>
        </div>
    </div>

    <div id="response-modal">
        <div id="m-body">
            <p>

            </p>
        </div>
    </div>
    
    <div class="load-content">Loading...</div>

</section>

<script src="<?php echo base_url() ?>assets/js/jquery.js"></script>
<script src="<?php echo base_url() ?>assets/js/main.js"></script>

</body>
</html>