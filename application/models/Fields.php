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
}
