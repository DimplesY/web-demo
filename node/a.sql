CREATE TABLE `org_sync` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `platform_id` bigint(20) DEFAULT NULL COMMENT '平台id(0表示安全管理平台, 1表示OA系统)',
  `sync_id` varchar(255) NOT NULL COMMENT '同步id',
  `sync_type` tinyint(1) DEFAULT NULL COMMENT '类型(0表示人员信息同步，1表示机构信息同步)',
  `dept_id` bigint(20) DEFAULT NULL COMMENT '所属部门id',
  `dept_oa_id` varchar(40) DEFAULT NULL COMMENT '所属部门OA系统id',
  `parent_dept_oa_id` varchar(40) DEFAULT NULL COMMENT '父级部门OA系统id',
  `dept_name` varchar(255) DEFAULT NULL COMMENT '部门名称',
  `person_id` bigint(20) DEFAULT NULL COMMENT '人员id',
  `person_oa_id` varchar(40) DEFAULT NULL COMMENT '人员OA系统id',
  `person_name` varchar(255) DEFAULT NULL COMMENT '人员名称',
  `ordered` int(11) DEFAULT NULL COMMENT '排序',
  `sync_status` tinyint(1) DEFAULT NULL COMMENT '是否已同步(0表示未同步，1表示已同步)',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `create_by` varchar(255) NOT NULL COMMENT '创建人',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `update_by` varchar(255) DEFAULT NULL COMMENT '修改人',
  `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除标志（0代表存在 1代表删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=298 DEFAULT CHARSET=utf8mb4 COMMENT='同步信息表';
