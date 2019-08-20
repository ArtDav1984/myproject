<?php
	
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class Fields extends CI_Model
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->dbforge();
		}
		
		public function getTableColumns($table_name, $db_name)
		{
			$this->db->query("USE $db_name");
			$columns = $this->db->list_fields($table_name);
			if ($columns === []) {
				return null;
			}
			return $columns;
		}
		
		public function getTableFields($db_name, $table_name){
			$this->db->query("USE $db_name");
			$fields = $this->db->select('*')->from($table_name)->get();
			if ($fields->result() === []) {
				return null;
			}
			return $fields->result();
		}
		
		public function deleteTableFields($table_name, $db_name, $id) {
			$this->db->query("USE $db_name");
			$this->db->where("id",$id);
			if ($this->db->delete($table_name)) {
				return true;
			}
			return false;
		}
		
		public function getTableStructure($table_name, $db_name)
		{
			$this->db->query("USE $db_name");
			$fields = $this->db->field_data($table_name);
			$fieldsArr = [];
			foreach ($fields as $field)
			{
				$fieldsArr[] = $field;
			}
			if ($fieldsArr === []) {
				return null;
			}
			return $fieldsArr;
		}
		
		public function insertData($db_name, $table_name, $insert_data)
		{
			$this->db->query("USE $db_name");
			$columns = $this->getTableColumns($table_name, $db_name);
			$data = [];
			for ($i = 0; $i < count($columns); $i ++) {
				$data[$columns[$i]] = $insert_data[$i];
			}
			if ($this->db->insert($table_name, $data)) {
				return true;
			}
			return false;
		}
	}