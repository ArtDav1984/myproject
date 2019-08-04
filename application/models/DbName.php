<?php
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class DbName extends CI_Model
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->dbforge();
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
	}
	
	
	
