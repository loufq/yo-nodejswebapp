require.config({　　　　
  paths: {　　　　　　
    "jquery": "/jquery/dist/jquery.min",
    "bootstrap": "/bootstrap/dist/js/bootstrap.min",
    "dynatable": "/dynatable/jquery.dynatable",
    "x-editable": "/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min",
    "jquery.simplePagination": "/jquery.simplePagination/jquery.simplePagination",
    "underscore": "/underscore/underscore",
    "jquery.lazyload": "/jquery.lazyload/jquery.lazyload.min",
    "scrollup": "/scrollup/js/jquery.scrollUp.min",
    "hotkeys": "/jquery.hotkeys/jquery.hotkeys",
    "momentjs": "/momentjs/moment",
    "jquery.form": "/jquery-form/jquery.form"
  },
  shim: {　　　　
    'bootstrap': {
      deps: ['jquery']　
    },
    'dynatable': {
      deps: ['jquery']　
    },
    'x-editable': {
      deps: ['jquery']　
    },
    'jquery.lazyload': {
      deps: ['jquery']　
    },
    'scrollup': {　　　　　　
      deps: ['jquery']　
    },
    'hotkeys': {　　　　　　
      deps: ['jquery']　
    },
    'jquery.form': {　　　　　　
      deps: ['jquery']　
    },
    'jquery.simplePagination': {　　　　　　
      deps: ['jquery']　
    },
  }
});

require(["underscore", "jquery", "bootstrap", "dynatable", "x-editable", "hotkeys", "jquery.form",
    'jquery.simplePagination','momentjs'
  ],
  function(_, $) {
    init(_, $);
  });

var pagerInfoUrl = '/admin/log/pagerinfo';
var pagerlistUrl = '/admin/log/pagerlist';
var cols = ['序号','类型', '用户ID','时间', '备注'];

var pageIndex = 0;
var C_PageSize = 10;

var init = function(_, $) {
  $(function() {
    //MenuActive
    $(function() {
      $('#menuLog').addClass('active');
    });

    _.each(cols, function(ele, idx) {
      $('.cols').append('<th>' + ele + '</th>');
    });

    //列表数据显示
    $(function() {
      pager_init();
    });

    function pager_init() {
      $("#pagerContainer").html('');
      $.ajax({
        type: 'GET',
        url: pagerInfoUrl,
        dataType: 'json',
        data: {
          "sKeyword": $("#sKeyword").val()
        },
        cache: false,
        error: function() {
          alert('出错了！');
        },
        success: function(data) {
          var count = data.result.count;
          var onePageItemCount = data.result.onePageItemCount;
          $('#pagerContainer').pagination({
            items: count,
            itemsOnPage: onePageItemCount,
            cssStyle: 'light-theme',
            onPageClick: function(pageNumber, event) {
              loadListData(pageNumber);
            },
            onInit: function() {
              loadListData(1);
            }
          });
        }
      });
    }

    function loadListData(pageNumber) {
      pageIndex = pageNumber;
      $.ajax({
        type: 'GET',
        url: pagerlistUrl,
        dataType: 'json',
        data: {
          "pageSize": C_PageSize,
          "pageIndex": pageNumber - 1,
          "sKeyword": $("#sKeyword").val()
        },
        cache: false,
        error: function() {
          alert('出错了！');
        },
        success: function(data) {
          var htmlContent = ""
          var iIndex = 1;
          $.each(data.result, function(index, value) {
            htmlContent += fillRowData(index, value);
          });
          $(".dataRows").html("").html(htmlContent);
        }
      });
    }
    //填充列表数据
    var fillRowData = function(iIndex, value) {
      var trHtml = '<tr>';
      trHtml += "<td>" + ((pageIndex - 1) * C_PageSize + (++iIndex)) + "</td>";
      trHtml += "<td>" + value['type'] + "</td >";
      trHtml += "<td>" + value['targetId'] + "</td >";
      trHtml += "<td>" + moment(value['create']).format('YYYY/MM/DD HH:mm:ss') + "</td >";
      trHtml += "<td>" + value['desc'] + "</td >";
      trHtml += "</tr>";
      return trHtml;
    };
  });
}; //init
