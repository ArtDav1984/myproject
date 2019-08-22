<?php
	
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class Tables extends CI_Model
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->dbforge();
		}
		
		public function getTablesName($db_name, $check = false)
		{
			$table_names = [];
			$tables = $this->db->query("SHOW TABLES FROM $db_name")->result_array();
			foreach ($tables as $key => $val) {
				$table_names[] = $val["Tables_in_{$db_name}"];
			}
			if ($table_names === [] && $check === false) {
				return null;
			}
			return $table_names;
			
		}
		
		public function createTable($db_name, $table_name, $number_column, $data_fields)
		{
			$fieldsArr = array();
			$errors = array();
			$key = array();
			for ($i = 0; $i < $number_column; $i ++) {
				
				if (empty($data_fields['nameField'][$i])) {
					$errors[] = 'Missing value in the form!';
				}
				
				if ($data_fields['typeField'][$i] == 'INT' && empty($data_fields['lengthField'][$i])) {
					$length = 11;
				} else {
					$length = $data_fields['lengthField'][$i];
				}
				
				if ($data_fields['typeField'][$i] == 'VARCHAR' && empty($data_fields['lengthField'][$i])) {
					$errors[] = 'Please enter a valid length';
				} else {
					$length = $data_fields['lengthField'][$i];
				}
				
				if (!preg_match('/^[0-9]*$/', $data_fields['lengthField'][$i])) {
					$errors[] = 'Please enter a valid length';
				}
				
				if($data_fields['indexField'][$i] == 'UNIQUE') {
					$unique = TRUE;
				} else {
					$unique = FALSE;
				}
				
				if ($data_fields['indexField'][$i] == 'PRIMARY') {
					$key[] = $data_fields['nameField'][$i];
				} else {
					$key[] = FALSE;
				}
				
				if ($data_fields['defaultField'][$i] == 'CURRENT_TIMESTAMP' && $data_fields['typeField'] == 'DATE') {
					$default = 'CURRENT_TIMESTAMP';
					
				} else if ($data_fields['defaultField'][$i] == 'NULL') {
					$default = 'NULL';
				} else {
					$default = FALSE;
				}
				
				if (!empty($errors)) {
					return $errors[0];
				}
				
				$fieldsArr[$data_fields['nameField'][$i]]  = array(
					'type'       => $data_fields['typeField'][$i],
					'constraint' => $length,
					'default'    => $default,
					'unique'     => $unique,
				);
			}
			
			$this->db->query("USE $db_name");
			$this->dbforge->add_field($fieldsArr);
			$this->dbforge->add_key($key[0], TRUE);
			if ($this->dbforge->create_table($table_name, TRUE)){
				return true;
			}
			return false;
		}
		
		public function updateTable($db_name, $table_name, $newTable_name)
		{
			$this->db->query("USE $db_name");
			if ($this->dbforge->rename_table($table_name, $newTable_name)) {
				return true;
			}
			return false;
		}
		
		public function deleteTable($db_name, $table_name)
		{
			$this->db->query("USE $db_name");
			if ($this->dbforge->drop_table($table_name, TRUE)) {
				return true;
			}
			return false;
		}
		
		public function truncateTable($db_name, $table_name)
		{
			$this->db->query("USE $db_name");
			if ($this->db->truncate($table_name)){
				return true;
			}
			return false;
		}
		
		public function getTableStructure($db_name, $table_name)
		{
			$this->db->query("USE $db_name");
			$fields = $this->db->field_data($table_name);
			if ($fields === []) {
				return null;
			}
			return $fields;
		}
		
		public function copyTable($newTbl_name, $newDb_name, $table_name, $db_name)
		{
		    if ($this->db->query("CREATE TABLE $newDb_name.$newTbl_name LIKE $db_name.$table_name")) {
		        if ($this->db->query("INSERT INTO $newDb_name.$newTbl_name SELECT * FROM $db_name.$table_name;")) {
		        	return true;
		        }
		    }
			return false;
		}
		
		public function moveTable($newTbl_name, $newDb_name, $table_name, $db_name)
		{
			if ($this->db->query("ALTER TABLE $db_name.$table_name RENAME $newDb_name.$newTbl_name")) {
				return true;
			}
			return false;
		}
	}