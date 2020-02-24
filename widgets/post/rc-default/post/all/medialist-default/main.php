<?php
$_postque = 'site='.$s.' and display=5';
if ($my['uid'])  $_postque .= ' or display=4';
$_RCD=getDbArray($table['postindex'],$_postque,'*','gid','asc',$wdgvar['limit'],1);
while($_R = db_fetch_array($_RCD)) $RCD[] = getDbData($table['postdata'],'gid='.$_R['gid'],'*');
?>

<section class="widget bg-white<?php echo $wdgvar['margin_top']=='true'?'':' mt-0 border-top-0' ?>">

  <?php if ($wdgvar['show_header']=='show'): ?>
  <header>
    <h3><?php echo $wdgvar['title'] ?></h3>
    <a href="#page-post-allpost"
      data-toggle="page"
      data-start="#page-main"
      data-title="<?php echo $wdgvar['title'] ?>"
      data-url="<?php echo $wdgvar['link'] ?>">
      더보기
    </a>
  </header>
  <?php endif; ?>

  <ul class="table-view table-view-full<?php echo $wdgvar['margin_top']=='true'?'':' border-top-0' ?>">

    <?php foreach($RCD as $_R):?>
    <li class="table-view-cell">
      <a data-uid="<?php echo $_R['uid'] ?>"
        <?php if ($wdgvar['vtype']=='modal'): ?>
        data-toggle="modal"
        href="#modal-post-view"
        <?php else: ?>
        data-toggle="page"
        href="#page-post-view"
        data-start="#page-main"
        <?php endif; ?>
        data-url="/post/<?php echo $_R['cid'] ?>"
        data-featured="<?php echo getPreviewResize(getUpImageSrc($_R),'640x360') ?>"
        data-format="<?php echo $_R['format']==2?'video':'doc' ?>"
        data-provider="<?php echo getFeaturedimgMeta($_R,'provider'); ?>"
        data-videoid="<?php echo getFeaturedimgMeta($_R,'name'); ?>"
        data-title="<?php echo $_R['subject'] ?>">

        <?php if ($wdgvar['thumb']=='avatar'): ?>
        <div class="position-relative pull-<?php echo $wdgvar['media_align']=='left'?'left mr-2':'right ml-2' ?>">
          <img class="media-object img-circle"
            src="<?php echo getAvatarSrc($_R['mbruid'],'110') ?>" style="width:3.4375rem">
        </div>
        <?php else: ?>
        <?php if (getUpImageSrc($_R)): ?>
        <div class="position-relative pull-<?php echo $wdgvar['media_align']=='left'?'left mr-2':'right ml-2' ?>">
          <img class="media-object border"
            src="<?php echo getPreviewResize(getUpImageSrc($_R),'231x130') ?>" style="width:5.9375rem">
          <?php if ($_R['format']==2): ?>
          <?php if ($wdgvar['duration']=='show'): ?>
          <time class="badge badge-default bg-black rounded-0 position-absolute" style="right:1px;bottom:1px"><?php echo getUpImageTime($_R) ?></time>
          <?php else: ?>
          <i class="fa fa-play-circle-o fa-lg position-absolute" style="right:8px;bottom:8px;color: rgba(255, 255, 255, 0.9);"></i>
          <?php endif; ?>
          <?php endif; ?>
        </div>
        <?php endif; ?>
        <?php endif; ?>

        <div class="media-body">
          <span class="line-clamp-2">
            <?php echo getStrCut(stripslashes($_R['subject']),100,'..') ?>
          </span>
          <div class="d-flex justify-content-between mt-1">
            <time <?php echo $wdgvar['timeago']=='true'?'data-plugin="timeago"':'' ?> datetime="<?php echo getDateFormat($_R['d_regis'],'c')?>" class="badge badge-default badge-inverted">
              <?php echo getDateFormat($_R['d_regis'],'Y.m.d H:i')?>
            </time>
            <?php if($_R['comment']):?>
            <span class="badge badge-default badge-inverted">
              <i class="fa fa-comment-o mr-1" aria-hidden="true"></i>
              <?php echo $_R['comment']?><?php echo $_R['oneline']?'+'.$_R['oneline']:''?>
            </span>
            <?php endif?>
          </div>
        </div>
      </a>
    </li>
    <?php endforeach?>
    <?php if(!db_num_rows($_RCD)):?>
    <li class="table-view-cell text-muted">게시물이 없습니다.</li>
    <?php endif?>
  </ul>

</section>
