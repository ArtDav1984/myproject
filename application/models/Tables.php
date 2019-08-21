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
			for ($i = 0; $i < $number_column; $i ++)
			{
				if (empty($data_fields['nameField'][$i])) {
					$errors[] = 'Missing value in the form!';
				}
				
				if (!empty($errors)) {
					return $errors[0];
				}
				
				if ($data_fields['indexField'][$i] !== '---') {
					$unique = true;
				} else {
					$unique = false;
				}
				
				if ($data_fields['defaultField'][$i] !== 'None') {
					$default = $data_fields['defaultField'][$i];
				} else {
					$default = false;
				}
				
				$fieldsArr[$data_fields['nameField'][$i]]  = array(
					'type'       => $data_fields['typeField'][$i],
					'constraint' => $data_fields['lengthField'][$i],
					'default'    => $default,
					'unique'     => $unique,
				);
			}
			
			$this->db->query("USE $db_name");
			$this->dbforge->add_field($fieldsArr);
			$this->dbforge->add_key($data_fields['nameField'][0], TRUE);
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