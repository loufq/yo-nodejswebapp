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

var pagerInfoUrl = '/admin/catalog/pagerinfo';
var pagerlistUrl = '/admin/catalog/pagerlist';
var detailUrl = '/admin/catalog/detail';
var updateUrl = '/admin/catalog/update';
var delUrl = '/admin/catalog/del';

var cols = ['名称', '图片', '类型', '状态', '备注'];

var pageIndex = 0;
var C_PageSize = 10;

var init = function(_, $) {
  $(function() {
    //MenuActive
    $(function() {
      $('#menuCatalog').addClass('active');
    });
    _.each(cols, function(ele, idx) {
      $('.cols').append('<th>' + ele + '</th>');
    });
    //初始化控件======================
    var initUpdateForm = function() {
      $("form#saveForm :input[name=_id]").val("");
      $("form#saveForm :input[type=text]").each(function() {
        var input = $(this).val("");
      });
      $("form#saveForm textarea").each(function() {
        var input = $(this).val("");
      });
    }
    //添加触发
    $(function() {
      $("#btnAdd").on('click', function() {
        $("#btnDel").hide();
        initUpdateForm();
      });
    });
    //列表数据显示
    $(function() {
      $("#btnSearch").click(function() {
        pager_init();
      });
      $("#sKeyword").on("click", function() {
        $(this).select();
      });
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
      trHtml += "<td><input type='checkbox'></td>";
      trHtml += '<td><button class="btn btn-xs btn-primary" onclick="javascript: beginEdit(\'' +
        value["_id"] + '\')">详细</button></td>';
      trHtml += "<td>" + ((pageIndex - 1) * C_PageSize + (++iIndex)) + "</td>";
      trHtml += "<td>" + value['name'] + "</td >";
      trHtml += "<td>" + value['imageurl'] + "</td >";
      var type = parseInt(value.type)||0;
      trHtml += "<td>" + value['type'] + "</td >";
      trHtml += "<td>" + (status == -1 ? "系统" : "用户") + "</td >";
      var status = parseInt(value['status']);
      trHtml += "<td>" + (status == -1 ? "未审核" : "已审核") + "</td >";
      trHtml += "<td>" + value['desc'] + "</td >";
      trHtml += "</tr>";
      return trHtml;
    };

    //存======================
    $(function() {
      $('#saveForm').ajaxForm({
        dataType: 'json',
        url: updateUrl,
        beforeSubmit: function(formData, jqForm, options) {
          var queryString = $.param(formData);
          //alert('About to submit: \n\n' + queryString);
          return true;
        },
        success: function(jsonData) {
          if (jsonData.code > 0) {
            alert(jsonData.msg);
          } else {
            loadListData(1);
            $("#myModal").modal("hide");
          }
        }
      });
    });
    //删======================
    $(function() {
      $("#btnDelYes").click(function() {
        $.ajax({
          type: 'POST',
          url: delUrl,
          dataType: 'json',
          data: {
            "_id": $("form#saveForm :input[name=_id]").val(),
          },
          cache: false,
          error: function() {
            alert('出错了！');
          },
          success: function(jsonD) {
            loadListData(1);
            $("#myModal").modal("hide");
            $("#myConfirmModal").modal("hide");
          }
        });
      })
    });

  });
}; //init

//查======================
var beginEdit = function(itemID) {
  $.getJSON(detailUrl, {
    _id: itemID,
  }).fail(function() {
    alert('出错了！');
  }).done(function(data) {
    if (data.code > 0) {
      alert(data.msg);
      return;
    }
    $("form#saveForm :input").each(function() {
      var name = $(this).attr("name");
      if (data.result[name] != null) {
        $(this).val(data.result[name]);
      }
    });
    $("#btnDelYes").show();
    $("#myModal").modal("show");
  });
}
