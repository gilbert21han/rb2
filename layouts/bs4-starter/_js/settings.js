function setWidgetConfig(id,name,path,wdgvar,area) {
  $('[data-role="widgetConfig"] [data-role="form"]').html('');
  $.post(rooturl+'/?r='+raccount+'&m=site&a=get_widgetConfig',{
    name : name,
    widget : path,
    wdgvar : wdgvar,
    area : area
   },function(response,status){
      if(status=='success'){
        var result = $.parseJSON(response);
        var page=result.page;
        var widget=result.widget;
        if (!page) {
          $.notify({message: '위젯설정을 확인해주세요.'},{type: 'danger'});
          resetPage()
          return false
        }
        $('[data-role="widgetConfig"]').attr('data-id',id);
        $('[data-role="widgetConfig"]').attr('data-name',name);
        $('[data-role="widgetConfig"]').attr('data-path',path);
        $('[data-role="widgetConfig"] [data-role="form"]').html(page);
        $('[data-role="widgetConfig"]').removeClass('d-none');
        $('[data-role="widgetConfig"] [data-toggle="tooltip"]').tooltip();
        setTimeout(function(){
          $('[data-role="widgetConfig"] [data-role="form"]').find('.form-control')[0].focus();
        }, 100);

        //게시판 선택시
        $('[data-role="widgetConfig"]').find('[name="bid"]').change(function(){
          var name = $(this).find('option:selected').attr('data-name');
          var link = $(this).find('option:selected').attr('data-link');
          var id = $(this).find('option:selected').val();
          if (id) {
            $('[data-role="widgetConfig"]').find('[name="title"]').val(name);
            $('[data-role="widgetConfig"]').find('[name="link"]').val(link);
          } else {
            $('[data-role="widgetConfig"]').find('[name="title"]').val('');
            $('[data-role="widgetConfig"]').find('[name="link"]').val('');
          }
        });

      } else {
        $.notify({message: '위젯설정을 확인해주세요.'},{type: 'danger'});
        return false
      }
    });
}

function resetPage() {
  $('[data-role="widgetConfig"]').addClass('d-none');
  $('[data-role="addWidget"]').removeClass('active');
  $('[name="widget_selector"]').prop('selectedIndex',0);
  $('[data-role="widgetPage"] [data-role="item"]').removeClass('active shadow-sm')
}

var layout_settings_tab = Cookies.get('layout-settings-tab')?Cookies.get('layout-settings-tab'):'01';

$('#layout-settings-tab [data-order="'+layout_settings_tab+'"]').tab('show')

$('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
  var order = $(e.target).attr('data-order');
  Cookies.set('layout-settings-tab', order)
})

$('[data-act="submit"]').click(function(e){
  var form = $(this).closest('form');
  $(this).attr('disabled',true)
  setTimeout(function(){ form.submit(); }, 300);
});

$('[data-act="reset"]').click(function(){
  var page = $(this).attr('data-page');
  $.post(rooturl+'/?r='+raccount+'&m=site&a=deletelayoutpage',{
    page : page
   },function(response,status){
      if(status=='success'){
        var result = $.parseJSON(response);
        var error=result.error;
        if (!error) location.reload();
      } else {
        alert('다시시도 해주세요.')
        return false
      }
    });
});

$('[data-role="widgetPage"]').on('click','[data-act="edit"]',function(e) {
  e.preventDefault();
  var item =  $(this).closest('[data-role="item"]')
  var id = item.attr('id');
  var name = item.attr('data-name');
  var path = item.attr('data-path');
  var wdgvar = item.find('[name="widget_members[]"]').val();
  var area;
  if (!wdgvar) wdgvar = 'blank';
  setWidgetConfig(id,name,path,wdgvar,area)
  $('[data-role="widgetPage"] [data-role="item"]').removeClass('active shadow-sm');
  $('[data-role="widgetConfig"]').attr('data-id',id);
  $('[data-role="addWidget"]').removeClass('active');
  item.addClass('active shadow-sm');
});

$('[name="settingMain"] [data-act="submit"]').click(function(){
  $(this).attr('disabled', true);
  var top_widgets=$(document).find('[data-area="top"] input[name="widget_members[]"]').map(function(){return $(this).val()}).get();
  var left_widgets=$(document).find('[data-area="left"] input[name="widget_members[]"]').map(function(){return $(this).val()}).get();
  var right_widgets=$(document).find('[data-area="right"] input[name="widget_members[]"]').map(function(){return $(this).val()}).get();
  var new_widgets='';

  if(top_widgets){
    for(var i=0;i<top_widgets.length;i++) {
      new_widgets+=top_widgets[i];
    }
    $('input[name="main_widget_top"]').val(new_widgets);
  }

  var new_widgets='';
  if(left_widgets){
    for(var i=0;i<left_widgets.length;i++) {
      new_widgets+=left_widgets[i];
    }
    $('input[name="main_widget_left"]').val(new_widgets);
  }

  var new_widgets='';
  if(right_widgets){
    for(var i=0;i<right_widgets.length;i++) {
      new_widgets+=right_widgets[i];
    }
    $('input[name="main_widget_right"]').val(new_widgets);
  }
  setTimeout(function(){
    $('[name="settingMain"]').submit();
    resetPage(); // 상태초기화
   }, 500);
});

$( document ).ready(function() {

  //순서변경
  $('[data-plugin="nestable"]').nestable({
    group: 1,
    maxDepth: 1
  });

  $('#modal-widget-selector').on('show.bs.modal', function (event) {
    var modal = $(this)
    var button = $(event.relatedTarget);
    var area = button.attr('data-area');
    resetPage();
    setTimeout(function(){ modal.find('[name="widget_selector"]').attr('data-area',area).trigger('focus'); }, 100);
  })

  $('#modal-widget-selector').find('[name="widget_selector"]').change(function(){
    var modal = $('#modal-widget-selector');
    var path =  $(this).val();
    var name = $(this).find('option:selected').text();
    var id = randomId();
    var area = $(this).attr('data-area');
    var wdgvar = '';
    var button = $('#modal-widget-selector').find('[data-act="submit"]');

    modal.find('[data-role="none"]').removeClass('d-none');
    modal.find('[data-role="thumb"]').attr('src','').addClass('d-none');
    modal.find('[data-role="readme"]').html('');

    button.attr('data-path',path);
    button.attr('data-name',name);
    button.attr('data-id',id);
    button.attr('data-area',area);

    $.post(rooturl+'/?r='+raccount+'&m=site&a=get_widgetGuide',{
      widget : path
     },function(response,status){
        if(status=='success'){
          var result = $.parseJSON(response);
          var readme=result.readme;
          var thumb=result.thumb;

          if (!thumb) {
            modal.find('[data-role="none"]').removeClass('d-none');
            modal.find('[data-role="thumb"]').addClass('d-none');
          } else {
            modal.find('[data-role="none"]').addClass('d-none');
            modal.find('[data-role="thumb"]').attr('src',thumb).removeClass('d-none');
            modal.find('[data-role="readme"]').html(readme);
          }

        } else {
          alert('위젯설정을 확인해주세요.')
          return false
        }
      });
  });

  $('#modal-widget-selector').find('[data-act="submit"]').click(function(){
    var button = $(this)
    var path =  button.attr('data-path');
    var name = button.attr('data-name');
    var id = button.attr('data-id');
    var area = button.attr('data-area');
    var wdgvar = '';
    var modal = $('#modal-widget-selector');

    if (!path) {
      modal.find('[name="widget_selector"]').focus();
      return false;
    }

    modal.modal('hide');

    $('[data-role="widgetConfig"] [data-role="form"]').html('');
    $('[data-role="widgetPage"] [data-role="item"]').removeClass('active shadow-sm')

    if (path) {
      setWidgetConfig(id,name,path,wdgvar,area)
      $('[data-role="widgetPage"][data-area="'+area+'"] [data-role="addWidget"]').addClass('active');
    } else {
      $('[data-role="widgetConfig"]').addClass('d-none');
    }

  });

  $('#modal-widget-selector').on('hidden.bs.modal', function (event) {
    var modal = $(this)
    var button = modal.find('[data-act="submit"]');
    var selector =  modal.find('[name="widget_selector"]');
    button.removeAttr('data-path').removeAttr('data-id').removeAttr('data-area').removeAttr('data-name');
    selector.removeAttr('data-area');
    modal.find('[name="widget_selector"]').prop('selectedIndex',0);
    modal.find('[data-role="readme"]').html('');
    modal.find('[data-role="thumb"]').attr('src','')

    $('[data-role="addWidget"]').removeClass('active');
  })

  $('[data-role="widgetConfig"]').on('click','[data-act="save"]',function() {
    var name = $('[data-role="widgetConfig"]').attr('data-name');
    var title = $('[data-role="widgetConfig"] [name="title"]').val();
    var path = $('[data-role="widgetConfig"]').attr('data-path');
    var id = $('[data-role="widgetConfig"]').attr('data-id');
    var mod = $(this).attr('data-mod');
    var area = $(this).attr('data-area');

    $(this).attr('disabled', true);

    if (!title) title = $('[data-role="widgetConfig"] [name="title"]').attr('placeholder');

    $(document).find('[data-role="widgetPage"] .card').removeClass('animated fadeInUp')

    var widget_var = id+'^'+title+'^'+path+'^';

    $('[data-role="widgetConfig"] [name]').each(function(index){
      var _name =  $(this).attr('name');

      if ( !$(this).val() && $(this).attr('placeholder')) {
        var _var =  $(this).attr('placeholder');
      } else {
        var _var =  $(this).val()?$(this).val():'';
      }

      widget_var += _name+'='+_var+',';
    });

    setTimeout(function(){

      resetPage();

      if (mod=='add') {
        var box = '<li class="card round-0 mb-3 text-muted text-center animated fadeInUp dd-item" data-name="'+name+'" data-path="'+path+'" data-role="item" id="'+id+'">'+
                  '<a href="" data-act="remove" title="삭제" class="badge badge-light border-0"><i class="fa fa-times" aria-hidden="true"></i></a>'+
                  '<span data-act="move" class="badge badge-light border-0 dd-handle"><i class="fa fa-arrows" aria-hidden="true"></i></span>'+
                  '<input type="hidden" name="widget_members[]" value="['+widget_var+']">'+
                  '<div class="card-body"><a href="#" class="text-reset" data-role="title" data-act="edit">'+title+'</a></div>'+
                  '</li>';

        $('[data-role="widgetPage"][data-area="'+area+'"] .dd-list').append(box);
        $('[data-role="widgetPage"] [data-toggle="tooltip"]').tooltip();

      } else {

        $(document).find('#'+id+' [name="widget_members[]"]').val('['+widget_var+']');
        $(document).find('#'+id+'').addClass('animated fadeInUp');
        $(document).find('#'+id+' [data-role="title"]').text(title);
        $('[data-role="widgetPage"] [data-role="item"]').removeClass('active shadow-sm')
      }

      $('[name="settingMain"] [data-act="submit"]').click();
    }, 600);

  });

  $('[data-role="widgetConfig"]').on('click','[data-act="code"]',function() {
    var name = $('[data-role="widgetConfig"]').attr('data-name');
    var title = $('[data-role="widgetConfig"] [name="title"]').val();
    var path = $('[data-role="widgetConfig"]').attr('data-path');

    if (!title) title = name;

    var widget_var = '';

    $('[data-role="widgetConfig"] [name]').each(function(index){
      var _name =  $(this).attr('name');
      var _var =  $(this).val()?$(this).val():'';
      widget_var += "'"+_name+"'=>'"+_var+"',";
    });

    var code = "<?php getWidget('"+path+"',array("+widget_var+")) ?>";

    $('[data-role="widgetPage"] [data-toggle="tooltip"]').tooltip();

    $('#widgetCode').val(code);

    var clipboard = new ClipboardJS('.js-clipboard');

    clipboard.on('success', function (e) {
      $(e.trigger)
        .attr('title', '클립보드 복사완료!')
        .tooltip('_fixTitle')
        .tooltip('show')
        .attr('title', '클립보드 복사')
        .tooltip('_fixTitle')

      e.clearSelection()
    })

    clipboard.on('error', function (e) {
      var modifierKey = /Mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
      var fallbackMsg = 'Press ' + modifierKey + 'C to copy'

      $(e.trigger)
        .attr('title', fallbackMsg)
        .tooltip('_fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('_fixTitle')
    })
  });

  $('[data-role="widgetConfig"]').on('click','[data-act="cancel"]',function(e) {
    e.preventDefault();
    resetPage();
  });

  $('[data-role="widgetPage"]').on('click','[data-act="remove"]',function(e){
    e.preventDefault();
    $(this).closest('.card').remove();
    resetPage();
  });

  $(document).on('click','[data-role="widgetConfig"] [data-act="make"]',function() {
    var button = $(this);
    var mod = button.attr('data-mod')
    if (mod=='bbs') modal = $('#modal-widget-makebbs');
    if (mod=='postlist') modal = $('#modal-widget-makelist');
    if (!mod) return false;
    modal.modal('show');
  })

  $('#modal-widget-makebbs').on('shown.bs.modal', function (event) {
    var modal = $(this)
    modal.find('[name="id"]').trigger('focus')
  })

  $('#modal-widget-makebbs').on('hidden.bs.modal', function (event) {
    var modal = $(this)
    modal.find('input').val('').removeClass('is-invalid');
    modal.find('[data-act="submit"]').attr('disabled',false);
    modal.find('.invalid-tooltip').text('')
  })

  $('#modal-widget-makebbs').find('input').keyup(function() {
    $(this).removeClass('is-invalid');
    $('#modal-widget-makebbs').find('.invalid-feedback').text('')
  });

  $('#modal-widget-makebbs').on('click','[data-act="submit"]',function() {
    var modal = $('#modal-widget-makebbs');
    var button = $(this);
    var id = modal.find('[name="id"]').val();
    var name = modal.find('[name="name"]').val();
    if (!id) {
      modal.find('[name="id"]').focus().addClass('is-invalid');
      modal.find('[name="id"]').nextAll('.invalid-feedback').text('게시판 아이디를 입력해주세요.')
      return false
    }

    //아이디 유용성 체크
    if (!chkIdValue(id)) {
      modal.find('[name="id"]').focus().addClass('is-invalid');
      modal.find('[name="id"]').nextAll('.invalid-feedback').text('영문 또는 숫자를 사용해주세요.')
      return false
    }

    if (!name) {
      modal.find('[name="name"]').focus().addClass('is-invalid');
      modal.find('[name="name"]').nextAll('.invalid-feedback').text('게시판 이름을 입력해주세요.')
      return false
    }

    button.attr('disabled',true);
    setTimeout(function(){

      $.post(rooturl+'/?r='+raccount+'&m=bbs&a=makebbs',{
        id : id,
        name : name,
        send_mod : 'ajax'
       },function(response,status){
          if(status=='success'){
            var result = $.parseJSON(response);
            var error=result.error;

            if (error=='id_exists') {
              modal.find('[name="id"]').focus().addClass('is-invalid');
              modal.find('[name="id"]').nextAll('.invalid-feedback').text('이미 같은 아이디의 게시판이 존재합니다.');
              button.attr('disabled',false);
              return false
            }

            modal.modal('hide');

            $('[data-role="widgetConfig"]').find('[name="bid"]').append('<option value="'+id+'" data-name="'+name+'" data-link="/b/'+id+'">ㆍ '+name+'('+id+')</option>');
            $('[data-role="widgetConfig"]').find('[name="bid"]').val(id).attr('selected','selected');
            $('[data-role="widgetConfig"]').find('[name="title"]').val(name);
            $('[data-role="widgetConfig"]').find('[name="link"]').val('/b/'+id);

          } else {
            button.attr('disabled',false);
            alert('다시 시도해 주세요.')
            return false
          }
        });

    }, 500);
  })

  $('#modal-widget-makelist').on('shown.bs.modal', function (event) {
    var modal = $(this)
    modal.find('[name="name"]').trigger('focus')
  })

  $('#modal-widget-makelist').on('hidden.bs.modal', function (event) {
    var modal = $(this)
    modal.find('input').val('').removeClass('is-invalid');
    modal.find('[data-act="submit"]').attr('disabled',false);
    modal.find('.invalid-tooltip').text('')
  })

  $('#modal-widget-makelist').find('input').keyup(function() {
    $(this).removeClass('is-invalid');
    $('#modal-widget-makelist').find('.invalid-feedback').text('')
  });

  $('#modal-widget-makelist').on('click','[data-act="submit"]',function() {
    var modal = $('#modal-widget-makelist');
    var button = $(this);
    var name = modal.find('[name="name"]').val();

    if (!name) {
      modal.find('[name="name"]').focus().addClass('is-invalid');
      modal.find('[name="name"]').nextAll('.invalid-feedback').text('리스트명을 입력해주세요.')
      return false
    }

    button.attr('disabled',true);
    setTimeout(function(){

      $.post(rooturl+'/?r='+raccount+'&m=post&a=regis_list',{
        display : 3,
        name : name,
        send_mod : 'ajax'
       },function(response,status){
          if(status=='success'){
            var result = $.parseJSON(response);
            var error=result.error;
            var id=result.id;

            if (error=='name_exists') {
              modal.find('[name="name"]').focus().addClass('is-invalid');
              modal.find('[name="name"]').nextAll('.invalid-feedback').text('이미 같은 이름의 리스트가 존재합니다.');
              button.attr('disabled',false);
              return false
            }

            modal.modal('hide');
            $('[data-role="widgetConfig"]').find('[name="listid"]').append('<option value="'+id+'">ㆍ '+name+'</option>');
            $('[data-role="widgetConfig"]').find('[name="listid"]').val(id).attr('selected','selected');

          } else {
            button.attr('disabled',false);
            alert('다시 시도해 주세요.')
            return false
          }
        });

    }, 500);
  })

});
