<?php
	
	class TableName extends CI_Model
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->dbforge();
		}
		
		public function getTablesName($db_name)
		{
			$tables = $this->db->query("SHOW TABLES FROM $db_name")->result_array();
			$table_names = [];
			foreach($tables as $key => $val) {
				$table_names[] = $val["Tables_in_{$db_name}"];
			}
		    return $table_names;
		}
		
		public function getTablesColumn($table_name, $db_name)
		{
			$columns = $this->db->query("SELECT `COLUMN_NAME`
                              FROM `INFORMATION_SCHEMA`.`COLUMNS`
                              WHERE `TABLE_SCHEMA`='$db_name'
                              AND `TABLE_NAME`='$table_name';")->result_array();
			$column_names = [];
			foreach($columns as $key => $val) {
				$column_names[] = $val['COLUMN_NAME'];
			}
			return $column_names;
		}
	}