<?php
if(!defined('__KIMS__')) exit;
$g['incdir'] = $g['incdir']?$g['incdir']:$g['path_layout'].$d['layout']['dir'].'/_includes/';
$g['wcache'] = $d['admin']['cache_flag']?'?nFlag='.$date[$d['admin']['cache_flag']]:'';
$g['cssset'] = array
(
	$g['dir_module'].'_main'=>$g['url_module'].'/_main',
	$g['dir_module_skin'].'_main'=>$g['url_module_skin'].'/_main',
	$g['dir_module_comm']=>$g['url_module_comm'],
	$g['dir_module_mode']=>$g['url_module_mode'],
	$g['dir_module_admin']=>$g['url_module_admin'],
);

$NT_DATA = explode('|',$my['noticeconf']);
$nt_web = $NT_DATA[0];
$nt_email = $NT_DATA[1];
$nt_fcm = $NT_DATA[2];
?>

<script>
var rooturl = '<?php echo $g['url_root']?>';
var rootssl = '<?php echo $g['ssl_root']?>';
var raccount= '<?php echo $r?>';
var moduleid= '<?php echo $m?>';
var memberid= '<?php echo $my['id']?>';
var is_admin= '<?php echo $my['admin']?>';
var num_mynoti = '<?php echo $my['num_notice']==0?'':$my['num_notice']?>';
var connect_naver= '<?php echo getConnectUrl('naver',$d['connect']['key_n'],$d['connect']['secret_n'],$g['url_root'].'/'.$r.'/oauth/naver',false)?>';
var connect_kakao= '<?php echo getConnectUrl('kakao',$d['connect']['key_k'],$d['connect']['secret_k'],$g['url_root'].'/'.$r.'/oauth/kakao',false)?>';
var connect_google= '<?php echo getConnectUrl('google',$d['connect']['key_g'],$d['connect']['secret_g'],$g['url_root'].'/'.$r.'/oauth/google',false)?>';
var connect_facebook= '<?php echo getConnectUrl('facebook',$d['connect']['key_f'],$d['connect']['secret_f'],$g['url_root'].'/'.$r.'/oauth/facebook',false)?>';
var connect_instagram= '<?php echo getConnectUrl('instagram',$d['connect']['key_i'],$d['connect']['secret_i'],$g['url_root'].'/'.$r.'/oauth/instagram',false)?>';
var nt_web = '<?php echo $nt_web ?>';
var nt_email = '<?php echo $nt_email ?>';
var nt_fcm = '<?php echo $nt_fcm ?>';
var broswer = '<?php echo $g['broswer'] ?>';
var deviceKind = '<?php echo $g['mobile'] ?>';
var deviceType = '<?php echo $g['deviceType'] ?>';
var kakao_jskey = '<?php echo $d['connect']['jskey_k'] ?>';
var post_skin_main =   '<?php echo $d['post']['skin_main']  ?>';
var post_skin_mobile = '<?php echo $d['post']['skin_mobile'] ?>';
var ios_Token = window.localStorage.getItem('setTokenTolocal');
var is_pwa = navigator.share === undefined?1:'';
</script>

<!-- is-loading : https://github.com/hekigan/is-loading-->
<?php getImport('is-loading','jquery.isloading.min','1.0.6','js')?>

<!-- js-cookie : https://github.com/js-cookie/js-cookie -->
<?php getImport('js-cookie','js.cookie.min','2.2.1','js')?>

<?php if (!$g['mobile'] && $_SESSION['pcmode'] == 'Y'): ?>
<!-- bootstrap-notify : https://github.com/mouse0270/bootstrap-notify  -->
<?php getImport('bootstrap-notify','bootstrap-notify.min','3.1.3','js')?>
<?php endif; ?>

<link href="<?php echo $g['s']?>/_core/css/sys.css<?php echo $g['wcache']?>" rel="stylesheet">
<script src="<?php echo $g['s']?>/_core/js/sys.js<?php echo $g['wcache']?>"></script>

<?php if ($g['broswer']!='MSIE 10' && $g['broswer']!='MSIE 11'): ?>
<script src="<?php echo $g['s']?>/_core/js/ckeditor5.js<?php echo $g['wcache']?>"></script>
<?php endif; ?>

<?php foreach ($g['cssset'] as $_key => $_val):?>
<?php if (is_file($_key.'.css')):?>
<link href="<?php echo $_val?>.css<?php echo $g['wcache']?>" rel="stylesheet">
<?php endif?>

<?php if (is_file($_key.'.js')):?>
<script src="<?php echo $_val?>.js<?php echo $g['wcache']?>"></script>
<?php endif?>
<?php endforeach?>

<!-- 헤더 스위치 -->
<?php foreach($g['switch_2'] as $_switch) include $_switch ?>
