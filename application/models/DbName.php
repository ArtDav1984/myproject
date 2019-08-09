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
			$query = "SHOW DATABASES";
			$databases = [];
			if ($this->db->query($query)) {
				$databases = $this->db->query($query)->result_array();
				if ($databases === []) {
					return null;
				}
				return $databases;
			}
		}
		
		public function getCharacterSet()
		{
			$query = "SHOW CHARACTER SET";
			$charsArr = [];
			if ($this->db->query($query)) {
				$chars = $this->db->query($query)->result_array();
				foreach ($chars as $char => $row) {
					$charsArr[] = $row['Default collation'];
				}
				if ($charsArr === []) {
					return null;
				}
				return $charsArr;
			}
		}
		
		public function createDatabase($db_name, $char_name)
		{
			if ($this->dbforge->create_database($db_name, TRUE)) {
				return $db_name;
			}
			return null;
		}
		
		public function updateDatabase($new_db_name, $current_db_name)
		{
			$tables = $this->TableName->getTablesName($current_db_name, true);
			if ($this->dbforge->create_database($new_db_name, TRUE)) {
				foreach ($tables as $table) {
					$this->db->query("RENAME TABLE $current_db_name.$table TO $new_db_name.$table");
				}
				if ($this->dbforge->drop_database($current_db_name)) {
					return $new_db_name;
				}
			}
			return null;
		}
		
		public function deleteDatabase($db_name)
		{
			if ($this->dbforge->drop_database($db_name)) {
				return true;
			}
			return false;
		}
	}
	
	
	
