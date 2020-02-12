<?php

// 템플릿 파싱 및 데이타 치환
class skin {
	var $filename;

	public function __construct($filename) {
		$this->filename = $filename;
	}

	public function mk($filename) {
		$this->filename = $filename;
		return $this->make();
	}

	public function make() {
		global $g,$m,$theme;
		$file = sprintf('./modules/'.$m.'/themes/'.$theme.'/_html/%s.html', $this->filename);
		$fh_skin = fopen($file, 'r');
		$skin = @fread($fh_skin, filesize($file));
		fclose($fh_skin);
		//return $skin;
		return $this->parse($skin);
	}

	private function parse($skin) {
		global $TMPL, $LNG;

		$skin = preg_replace_callback('/{\$lng->(.+?)}/i', create_function('$matches', 'global $LNG; return $LNG[$matches[1]];'), $skin);
		$skin = preg_replace_callback('/{\$([a-zA-Z0-9_]+)}/', create_function('$matches', 'global $TMPL; return (isset($TMPL[$matches[1]])?$TMPL[$matches[1]]:"");'), $skin);

		return $skin;
	}
}

?>