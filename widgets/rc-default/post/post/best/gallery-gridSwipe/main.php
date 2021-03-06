<?php
$numPerSlide = 6; // 한 슬라이드에 출력할 카드 갯수
$query = 'site='.$s;
if ($my['uid']) $query .= ' and display>3';
else $query .= ' and display=5';

$_WHERE1= $query.' and date >= '.date("Ymd", strtotime($wdgvar['term'])).' and '.$wdgvar['sort'].'>0';

if ($wdgvar['sort']=='hit') $_WHERE2= 'data,sum(hit) as hit';
if ($wdgvar['sort']=='likes') $_WHERE2= 'data,sum(likes) as likes';
if ($wdgvar['sort']=='comment') $_WHERE2= 'data,sum(comment) as comment';

$orderby = 'desc';
$active_ranking = (int)$wdgvar['ranking']+1;

$_RCD	= getDbSelect($table['postday'],$_WHERE1.' group by data order by '.$wdgvar['sort'].' '.$orderby.' limit 0,'.$wdgvar['limit'],$_WHERE2);

while($R = db_fetch_array($_RCD)) $RCD[] = getDbData($table['postdata'],'uid='.$R['data'],'*');
?>

<section class="widget border-bottom<?php echo $wdgvar['margin_top']=='true'?'':' mt-0 border-top-0' ?> rb-photogrid">

  <?php if ($wdgvar['show_header']=='show'): ?>
  <header>
    <h3><?php echo $wdgvar['title'] ?></h3>
    <small class="ml-2 text-muted f13"><?php echo $wdgvar['subtitle']?></small>
  </header>
  <?php endif; ?>

  <main class="content-padded js-swipe-grid pb-4 <?php echo $wdgvar['show_header']=='show'?'mt-0 pt-0':' pt-3' ?>">

    <div class="swiper-container<?php echo $wdgvar['swipe']=='true'?'':' swiper-no-swiping' ?>">
      <div class="swiper-wrapper" style="padding-bottom: 10px;">

        <div class="swiper-slide">
          <div class="row gutter-half">
            <?php $i=0;foreach($RCD as $_R):$i++;?>
            <div class="col-xs-4 mb-3">
              <a class="img-rounded mask_light"
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
                data-uid="<?php echo $_R['uid'] ?>"
                data-title="<?php echo $_R['subject'] ?>">
                <span class="rank-icon <?php echo $wdgvar['ranking']!='false' && $i<$active_ranking?' active':'' ?>"><span><?php echo $i ?></span></span>
                <?php if ($wdgvar['author']=='true'): ?>
                <small class="nic-name"><?php echo getProfileInfo($_R['mbruid'],$_HS['nametype']) ?></small>
                <?php endif; ?>

                <?php if ($_R['format']==2): ?>
                <?php if ($wdgvar['duration']=='show'): ?>
                <time class="badge badge-default bg-black rounded-0 position-absolute" style="right:1px;bottom:1px"><?php echo getUpImageTime($_R) ?></time>
                <?php else: ?>
                <i class="fa fa-play-circle-o position-absolute" style="right:8px;bottom:5px;color: rgba(255, 255, 255, 0.8);"></i>
                <?php endif; ?>
                <?php endif; ?>

                <img src="<?php echo getPreviewResize(getUpImageSrc($_R),'350x430') ?>" class="img-fluid img-rounded" alt="">
              </a>
              <div class="mt-1 px-1">
                <div class="line-clamp-2 f15">
                  <?php echo getStrCut(stripslashes($_R['subject']),100,'..') ?>
                </div>
              </div>
            </div>
            <?php if( !($i%$numPerSlide) && ($wdgvar['limit'] > $i) ):?></div></div><div class="swiper-slide"><div class="row gutter-half"><?php endif?>
            <?php endforeach?>
          </div><!-- /.row -->
        </div><!-- /.swiper-slide -->

      </div><!-- /.swiper-wrapper -->
    </div><!-- /.swiper-container -->

    <div class="position-relative">
      <div class="swiper-pagination" style="bottom:-0.9375rem"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>

  </main>

</section>

<script>
  var swiper = new Swiper('.widget .js-swipe-grid .swiper-container', {
    spaceBetween: 30,
    pagination: {
      el: '.widget .js-swipe-grid .swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.widget .js-swipe-grid .swiper-button-next',
      prevEl: '.widget .js-swipe-grid .swiper-button-prev',
    },
  });
</script>
