<?php
if(!defined('__KIMS__')) exit;

$d['widget']['dom'] = array(

	'bs4-list-new-card' => array(
		'최근 리스트',  //위젯명
		array(
			array('title','input','타이틀','최근 리스트'),
			array('subtitle','input','보조 타이틀',''),
			array('limit','select','총 항목수','1개=1,2개=2,3개=3,4개=4,5개=5,6개=6,7개=7,8개=8,9개=9,10개=10,11개=11,12개=12','4'),
			array('line','select','한줄 항목수','1개=1,2개=2,3개=3,4개=4,5개=5','2'),
			array('link','input','링크연결',RW('m=post&mod=list'))

		),
	),
);

?>
