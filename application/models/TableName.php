<?php
	
	class TableName extends CI_Model
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->dbforge();
		}
		
		public function getTablesName($db_name, $check = false)
		{
			$query = "SHOW TABLES FROM $db_name";
			$table_names = [];
			if ($this->db->query($query)) {
				$tables = $this->db->query($query)->result_array();
				foreach ($tables as $key => $val) {
					$table_names[] = $val["Tables_in_{$db_name}"];
				}
				if ($table_names === [] && $check === false) {
					return null;
				}
				return $table_names;
			}
		}
		
		public function getTablesColumn($table_name, $db_name)
		{
			$query = "SELECT `COLUMN_NAME`
                              FROM `INFORMATION_SCHEMA`.`COLUMNS`
                              WHERE `TABLE_SCHEMA`='$db_name'
                              AND `TABLE_NAME`='$table_name';";

			$column_names = [];
			if ($this->db->query($query)) {
				$columns = $this->db->query($query)->result_array();
				foreach ($columns as $key => $val) {
					$column_names[] = $val['COLUMN_NAME'];
				}
				if ($column_names === []) {
					return null;
				}
				return $column_names;
			}
		}
		
		public function createTable($db_name, $table_name, $number_column, $data_fields)
		{
			$fields = array();
			for ($i = 0; $i < $number_column; $i ++)
			{
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
				$fields[$data_fields['nameField'][$i]]  = array(
					'type'       => $data_fields['typeField'][$i],
					'constraint' => $data_fields['lengthField'][$i],
					'default'    => $default,
					'unique'     => $unique,
				);
			}
			
			$this->db->query("USE $db_name");
			$this->dbforge->add_field($fields);
			$this->dbforge->add_key($data_fields['nameField'][0], TRUE);
			$this->dbforge->create_table($table_name, TRUE);
			return $fields;
		}
	}
