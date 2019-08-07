<?php
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class DbName extends CI_Model
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->dbforge();
			$this->load->model('TableName');
		}
		
		public  function getDatabasesNames()
		{
			$databases = $this->db->query("SHOW DATABASES")->result_array();
			return $databases;
		}
		
		public function getCharacterSet()
		{
			$charsArr = array();
			$chars = $this->db->query("SHOW CHARACTER SET")->result_array();
			foreach ($chars as $char => $row) {
				$charsArr[] = $row['Default collation'];
			}
			return $charsArr;
		}
		
		public function createDatabase($db_name, $char_name)
		{
			if ($this->dbforge->create_database($db_name)) {
				return $db_name;
			}
			return false;
		}
		
		public function updateDatabase($new_db_name, $current_db_name)
		{
			$tables = $this->TableName->getTablesName($current_db_name);
			if ($this->dbforge->create_database($new_db_name)) {
				foreach ($tables as $table) {
					$this->db->query("RENAME TABLE $current_db_name.$table TO $new_db_name.$table");
				}
				if ($this->dbforge->drop_database($current_db_name)) {
					return $new_db_name;
				}
			}
			return false;
		}
		
		public function deleteDatabase($db_name)
		{
			if ($this->dbforge->drop_database($db_name)) {
				return true;
			}
			return false;
		}
	}
	
	
	
