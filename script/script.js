$(window).on("load", function(){
	/*Глобальные переменные*/
	let linkRange, linkSelection;

	/*Функция рендера математических формул*/
	MathJax.Hub.Config({
		tex2jax:{
			inlineMath: [['$','$'], ['\\(','\\)']],
			skipTags: ["script","noscript","style","textarea","pre","code"]
		}
	});

	/*Заполняем выпадающие меню*/
	/*Заполняем выпадающее меню размера шрифта*/
	for(let size = 1; size < 100; size++){
		$("#font-size-select")
			.append("<option val = " + size +">" + size + "</option>");
	}
	$("#font-size-select").val(16);

	/*Цвет текста*/
	$("#text-color-select option").each(function(){
		$(this).css("background-color", $(this).val());
	});
	$("#text-color-select").css("background-color", $('#text-color-select option:selected').val());

	/*Цвет заднего фона*/
	$("#background-color-select option").each(function(){
		$(this).css("background-color", $(this).val());
	});
	$("#background-color-select").css("background-color", $('#background-color-select option:selected').val());

	/*Процедура нажатия на кнопку "Удалить"
	Выводит окно подтверждения операции. Если пользователь
	подтверждает удаление, то удаляет родительский элемент*/
	function createDeleteButtonEventListener()
	{
		$(".delete-button").each(function(){
			if(!checkEvent($(this), "click")){
				$(this).on("click", function(){
					if(confirm("Вы точно хотите удалить этот элемент?")){
						$("#last").removeAttr("id");
						$(this).parent().parent().prev().attr("id", "last");
						$(this).parent().parent().remove();
					}
				});
			}
		});
	}

	/*Процедура, добавляющая в документ кнопку "Вверх, если пользователь
	пролистал документ вниз"*/
	$(window).on("scroll", function(){
		if($(this).scrollTop() > $(this).height())
			$("#on-top").addClass("active-top-button");
		else
			$("#on-top").removeClass("active-top-button");
	});

	/*Процедура пролистывания страницы вверх при нажатии
	на кнопку "Вверх"*/
	$("#on-top").on("click", function(){
		$("html, body").animate({scrollTop: 0}, 1000);
	});

	/*Процедура, устанавливающая на выбранном элементе флаг last
	P.S. добавление новых элементов идет после элемента с флагом last*/
	function setContainer(){
		$(".main-container").each(function(){
			if(!checkEvent($(this), "focusin")){
				$(this).on("focusin", function(){
					$("#last").removeAttr("id");
					$(this).attr("id", "last");
				});
			}
		});
	}

	/*Процедура, поднимающая выбранный контейнер на одну позицию вверх*/
	function upContainer(){
		$(".up-button").each(function(){
			if(!checkEvent($(this), "click")){
				$(this).on("click", function(){
					let $container = $(this).parent().parent()
					if($container.index() != 1){
						$(".main-container").eq($container.index() - 1).before($container);
					}
				});
			}
		});
	}

	/*Процедура, опускающая выбранный контейнер на одну позицию вниз*/
	function downContainer(){
		$(".down-button").each(function(){
			if(!checkEvent($(this), "click")){
				$(this).on("click", function(){
					let $container = $(this).parent().parent();
					if($container.index() != $(".main-container").length - 1){
						$(".main-container").eq($container.index() + 1).after($container);
					}
				});
			}
		});
	}

	/*Прцедура, отслеживающая смену шрифта*/
	$("#font-family-select").on("change", function(){
		styleString();
	});

	/*Прцедура, отслеживающая смену шрифта*/
	$("#font-size-select").on("change", function(){
		styleString();
	});

	/*Прцедура, отслеживающая смену цвета шрифта*/
	$("#text-color-select").on("change", function(){
		$("#text-color-select").css("background-color", $('#text-color-select option:selected').val());
		styleString();
	});

	/*Прцедура, отслеживающая смену заднего фона текста*/
	$("#background-color-select").on("change", function(){
		$("#background-color-select").css("background-color", $('#background-color-select option:selected').val());
		styleString();
	});

	/*Процедура, отслеживающая смену выравнивания текста*/
	$("#justify, #center, #left, #right").on("click", function(){
		$(".align").removeClass("active");
		$(this).addClass("active");
		$("#last").css("text-align", $(this).attr("id"));
	});

	/*Процедура, отслеживающая смену параметров "Жирный", "Курсив", "Подчеркнутый"*/
	$("#bold, #cursive, #underline").on("click", function(){
		$(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active");
		styleString();
	});

	/*Процедура изменения ширины ячеек таблицы*/
	$("#cellWidth").on("change", function(){
		$("#selectedCell").width($(this).val() + "px");
	});

	/*Процедура, устанавливающая автоматическую ширину ячеек*/
	$("#autoCellWidth").on("click", function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#selectedTable").css("table-layout", "fixed");
		}
		else{
			$(this).addClass("active");
			$("#selectedTable").css("table-layout", "auto");
		}
	});

	/*Процедура, заменяющая стиль текста на выбранный пользователем*/
	function styleString() {
		//Если выбран текст
		if(!$(".jq-cell-selected").length){
  		let range = window.getSelection().getRangeAt(0);
  		let selectionContents = range.extractContents().textContent;
			if(selectionContents == "")
				selectionContents = " ";
  		let span = document.createElement("span");
			span.innerHTML = selectionContents;
			span.style.fontFamily = $('#font-family-select option:selected').html();
			span.style.fontSize = $('#font-size-select option:selected').html() + "px";
			span.style.color = $('#text-color-select option:selected').val();
			span.style.backgroundColor = $('#background-color-select option:selected').val();
			$("#bold").hasClass("active") ? span.style.fontWeight = "bold" : span.style.fontWeight = "normal";
			$("#cursive").hasClass("active") ? span.style.fontStyle = "italic" : span.style.fontStyle = "normal";
			$("#underline").hasClass("active") ? span.style.textDecoration = "underline" : span.style.fontStyle = "none";
  		range.insertNode(span);
		}
		//Если выбрана таблица
		else{
			$(".jq-cell-selected").css("font-family", $('#font-family-select option:selected').html());
			$(".jq-cell-selected").css("font-size", $('#font-size-select option:selected').html() + "px");
			$(".jq-cell-selected").css("color", $('#text-color-select option:selected').val());
			$(".jq-cell-selected").css("background-color", $('#background-color-select option:selected').val());
			$("#bold").hasClass("active") ? $(".jq-cell-selected").css("font-weight", "bold") : $(".jq-cell-selected").css("font-weight", "normal");
			$("#cursive").hasClass("active") ? $(".jq-cell-selected").css("font-style", "italic") : $(".jq-cell-selected").css("font-style", "normal");
			$("#underline").hasClass("active") ? $(".jq-cell-selected").css("text-decoration", "underline") : $(".jq-cell-selected").css("text-decoration", "none");
		}
	}

	/*Процедура, устанавливающая на панели инструментов параметры выделенного элемента*/
	$(document).on("mouseup", function(e){
		let $target = $(e.target);
		if($target.is("p, span, .jq-cell-selected")){
			$('#font-family-select').val($target.css("font-family"));
			$('#font-size-select').val($target.css("font-size").slice(0, -2));
			$target.css("font-style") == "italic" ? $("#cursive").addClass("active") : $("#cursive").removeClass("active");
			$target.css("font-weight") == "700" ? $("#bold").addClass("active") : $("#bold").removeClass("active");
			!$target.css("text-decoration").indexOf("underline") ? $("#underline").addClass("active") : $("#underline").removeClass("active");
			$('#text-color-select').val($target.css("color"));
			$('#text-color-select').css("background-color", $target.css("color"));
			$('#background-color-select').val($target.css("background-color"));
			$('#background-color-select').css("background-color", $target.css("background-color"));
		}
	});

	/*Процедура, привязывающая к контейнеру общие сигналы*/
	function containerEvents(){
		setContainer();
		upContainer();
		downContainer();
	}

	/*Процедура нажатия на кнопку "Текст"
	Добавляет в конце документа текстовое поле*/
	$("#create-text").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'text-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
				   "<p style = 'font-family: " + $('#font-family-select option:selected').html() + "; font-size: " + $('#font-size-select option:selected').html() + "px" + "' contenteditable>*Введите текст*</p>" +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//Добавляем прослушивание событий
		containerEvents();
		createDeleteButtonEventListener();
	});

	/*Процедура изменения ссылки (якоря) при переименовании заголовка*/
	function hrefChange(){
		$("h2, h3").each(function(){
			if(!checkEvent($(this), "keyup")){
				$(this).on("keyup", function(){
					$(this).attr("id", $(this).text());
				});
			}
		});
	}

	/*Процедура, заполняющее поле "Содержание"*/
	$("#showContent").on("click", function(){
		$(".anchor").remove();
		$("h2, h3").each(function(){
			$("#content-modal-body").append("<div><a class = 'anchor' href = '" + ("#" + $(this).text()) + "'>" + $(this).text() + "</a></div>");
		});
	});

	/*Процедура нажатия на кнопку "Заголовок"
	Добавляет в конце документа заголовок*/
	$("#create-header").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'text-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
				   "<h2 style = 'font-family: " + $('#font-family-select option:selected').html() + "; font-size: " + $('#font-size-select option:selected').html() + "px" + "' id = '*Введите заголовок*' contenteditable>*Введите заголовок*</h2>" +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//Добавляем прослушивание событий
		containerEvents();
		hrefChange();
		createDeleteButtonEventListener();
	});

	/*Процедура нажатия на кнопку "Подзаголовок"
	Добавляет в конце документа подзаголовок*/
	$("#create-subheader").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'text-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
				   "<h3 style = 'font-family: " + $('#font-family-select option:selected').html() + "; font-size: " + $('#font-size-select option:selected').html() + "px" + "' id = '*Введите подзаголовок*' contenteditable>*Введите подзаголовок*</h2>" +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//Добавляем прослушивание событий
		containerEvents();
		hrefChange();
		createDeleteButtonEventListener();
	});

	/*Процедура нажатия на кнопку "Список"
	Добавляет в конце документа список*/
	$("#create-list").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'text-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
				   "<ul style = 'font-family: " + $('#font-family-select option:selected').html() + "; font-size: " + $('#font-size-select option:selected').html() + "px" + "' contentEditable>" +
					 "<li>*Элемент списка*</li>" +
					 "</ul>" +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//Добавляем прослушивание событий
		containerEvents();
		createDeleteButtonEventListener();
	});

	/*Процедура, отображающая в окне редактирования введенную пользователем формулу*/
	$("#formula-input").on("keyup", function(){
		$("#formula-output").text($(this).val());
		MathJax.Hub.Typeset();
	});

	/*Процедура, вставляющая в документ блок с формулой*/
	$("#save-formula").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'text-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
				   $("#formula-output").clone().removeAttr("id").html() +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//MathJax.Hub.Typeset();
		//Добавляем прослушивание событий
		containerEvents();
		createDeleteButtonEventListener();
	});

	/*Процедура, открывающая модальное окно для создания ссылки*/
	$("#create-link").on("click", function(){
		linkRange = window.getSelection().getRangeAt(0);
		linkSelection = linkRange.extractContents().textContent;
		$("#link-text").val(linkSelection);
	});

	/*Процедура сохранения ссылки*/
	$("#save-link").on("click", function(){
		if($("#link-text").val().length){
			let a = document.createElement("a");
			a.innerHTML = $("#link-text").val();
			a.setAttribute("href", $("#link-input").val)
			a.setAttribute("contentEditable", "false");
			a.setAttribute("target", "_blank");
  		linkRange.insertNode(a);
		}
		else{
			let span = document.createElement("span");
			span.innerHTML = linkSelection;
			linkRange.insertNode(span);
		}
		$("#link-text").val("");
		$("#link-input").val("");
	});

	/*Процедура отмены изменений создания ссылки*/
	$("#close-link-modal").on("click", function(){
		let span = document.createElement("span");
		span.innerHTML = linkSelection;
		linkRange.insertNode(span);
		$("#link-text").val("");
		$("#link-input").val("");
	});

	/*Процедура нажатия на кнопку "Добавить картинку"
	Добавляет в конце документа текстовое поле с заголовком*/
	$("#create-image").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'img-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
					 "<img>" +
					 "<label for='exampleFormControlFile1'>Выберите изображение</label>" +
				   "<input class = 'form-control-file load-img' name = 'load-img' type='file' accept='image/*'>" +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//Добавляем прослушивание событий
		createImgEventListener();
		containerEvents();
		createDeleteButtonEventListener();
	});

	/*Процедура загрузки картинки на сайт*/
	function createImgEventListener(){
		$(".load-img").each(function(){
			if(!checkEvent($(this), "change")){
				$(this).on("change", function(){
					let $input = $(this);
					let reader = new FileReader();
					reader.onload = function(){
						let $img = $input.parent().children("img")[0];
						$img.src = reader.result;
						if(!$input.parent().children("p").length)
							$input.parent()
								.append("<p class = 'image-description' contentEditable>*Введите комментарий*</p>");
							$input.parent().children("label")[0].remove();
					}
					reader.readAsDataURL(event.target.files[0]);
				});
			}
		});
	}

	/*Процедура нажатия на кнопку "Таблица"
	Открывает модальное окно ввода строк и столбцов и создает по
	этим данным соответствующую таблицу*/
	$("#create-table").on("click", function(){
		//Считывание строк и полей
		let rows = prompt("Кол-во строк:", 3);
		let cols = prompt("Кол-во столбцов:", 3);
		//Проверяем введенные значения
		if(!isInteger(rows) || (!isInteger(cols)))
		{
			alert("Введите целое число");
			return;
		}
		//Создаем таблицу
		let table = "<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
					"<div class = 'table-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
					"<table class = 'table table-bordered' contenteditable>";
		for(i = 0; i < rows; i++){
			table += "<tr>";
			for(j = 0; j < cols; j++)
				table += "<td></td>";
			table += "</tr>";
		}
		table += "</table>" +
				 "</div>" +
				 "<div class = 'delete-button-container'>" +
				 "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				 "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				 "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				 "</div>" +
				 "</div>";
		//Добавляем таблицу на страничку
		$("#last").removeAttr("id")
			.after(table);
		//Добавляем прослушивание событий
		createTableEventListener();
		containerEvents();
		createDeleteButtonEventListener();
	});

	/*Процедура смены активной таблицы*/
	function selectTable($elem){
		$("#selectedTable").removeAttr("id");
		$("#selectedCell").removeAttr("id");
		$elem.parent().parent().parent().attr("id", "selectedTable");
		$elem.attr("id", "selectedCell");
		$("*").not("#selectedTable td").removeClass("jq-cell-selected");
		($("#selectedTable").css("table-layout") != "fixed") ? $("#autoCellWidth").addClass("active") : $("#autoCellWidth").removeClass("active");
		$("#cellWidth").val($("#selectedCell").width());
		$("#background-color-select").val($("#selectedCell").css("background-color"));
		$("#background-color-select").css("background-color", $("#selectedCell").css("background-color"));
	}

	/*Процедура, добавляющая пользовательское выпадающее
	меню в таблицы пользователя*/
	function createTableEventListener()
	{
		//Добавляем выделение ячеек таблицы
		$(".table").each(function(){
			$(this).cellSelection();
		});
		$("td").each(function(){
			if(!checkEvent($(this), "contextmenu")){
				//Определяем текущую таблицу активной
				$(this).on("contextmenu", function(ev){
					selectTable($(this));
					//Отображаем меню при нажатии ПКМ по таблице
					ev.preventDefault();
					$("#menu").offset({top: ev.clientY + $(window).scrollTop(), left: ev.clientX});
				});
			}
			if(!checkEvent($(this), "mouseup")){
				$(this).on("mouseup", function(ev){
					//Определяем текущую таблицу активной
					selectTable($(this));
				});
			}
		});
	}

	/*Процедура, скрывающая выпадающее меню при нажатии ЛКМ*/
	$(document).on("click", function(e){
		$("#menu").offset({top: -1000, left: -1000});
	});

	/*Процедура, сбрасывающая выделенные ячейки таблицы при клике ПКМ вне ее*/
	$(document).on("contextmenu", function(e){
		if($("#selectedTable").has(e.target).length === 0){
			$("#selectedTable").removeAttr("id");
			$("#selectedCell").removeAttr("id");
			$("#cellWidth").val("");
			$(".jq-cell-selected").removeClass();
      $("#menu").offset({top: -1000, left: -1000});
    }
	});

	/*Процедура, сбрасывающая выделенные ячейки таблицы при клике ЛКМ вне ее/контекстного меню/панели инструментов*/
	$(document).on("mouseup", function(e){
		if($("#selectedTable").has(e.target).length === 0 && $("#menu").has(e.target).length === 0
	  && (".navbar").has(e.target).length === 0){
			$("#selectedTable").removeAttr("id");
			$("#selectedCell").removeAttr("id");
			$("#cellWidth").val("");
			$(".jq-cell-selected").removeClass();
      $("#menu").offset({top: -1000, left: -1000});
    }
	});

	$(document).on("click", function(e){
		let $container = $(".table");
		if (container.has(e.target).length === 0){
        $(".jq-cell-selected").removeClass();
    }
	});

	/*Процедура копирования данных в буфер обмена*/
	$("#copy").on("click", function(){
		document.execCommand("copy");
	});

	/*Процедура копирования данных в буфер обмена*/
	$("#cut").on("click", function(){
		document.execCommand("cut");
	});

	/*Процедура вставки данных*/
	$("#paste").on("click", function(){
		document.execCommand("paste");
	});

	/*Процедура объединения ячеек*/
	$("#merge").on("click", function(){
		//Общая площадь
		let square = 0;
		$(".jq-cell-selected").each(function(){
			let col = $(this).attr("colspan");
			let row = $(this).attr("rowspan");
			if(!col)	col = 1;
			if(!row)	row = 1;
			square += (col*row);
		});
		//Столбцы
		let colspan = 0;
		let $row = $(".jq-cell-selected:first").parent().children(".jq-cell-selected");
		$row.each(function(){
			$(this).attr("colspan") ? colspan += $(this).attr("colspan") : colspan++;
		});
		//Строки
		let rowspan = square / colspan;
		//Объединяем ячейки
		$(".jq-cell-selected:not(:first)").remove();
		$(".jq-cell-selected").replaceWith("<td rowspan = " + rowspan + " colspan = " + colspan + "></td>");
		createTableEventListener();
	});

	/*Процедура разбиения ячеек*/
	$("#break").on("click", function(){
		let rowspan = $(".jq-cell-selected").attr("rowspan");
		let colspan = $(".jq-cell-selected").attr("colspan");
		let rowIndex = $(".jq-cell-selected").parent().index();
		for(let i = 0; i < rowspan; i++)
			for(let j = 0; j < colspan; j++)
				$("#selectedTable").children().find("tr:eq(" + (rowIndex + i) + ")").append("<td></td>");
		$(".jq-cell-selected").remove();
		createTableEventListener();
	});

	/*Процедура добавления строки в таблицу*/
	$("#add-row").on("click", function(){
		let newRow;
		for(let i = 0; i < $("#selectedCell").parent().children().length; i++)
			newRow += "<td></td>";
		$("#selectedCell").parent()
			.after("<tr>" + newRow + "</tr>");
			createTableEventListener();
	});

	/*Процедура добавления столбца в таблицу*/
	$("#add-col").on("click", function(){
		let selectedCol = $("#selectedCell").parent().children().index($(this)) - 1;
		$("#selectedTable").children().find("tr").each(function(){
			let $newCell = $(this).find("td:eq(" + selectedCol + ")").clone().empty();
			$(this).find("td:eq(" + selectedCol + ")").after($newCell);
		});
		createTableEventListener();
	});

	/*Процедура удаления строки из таблицы*/
	$("#remove-row").on("click", function(){
		$("#selectedCell").parent().remove();
	});

	/*Процедура удаления столбца из таблицы*/
	$("#remove-col").on("click", function(){
		let selectedCol = $("#selectedCell").parent().children().index($(this)) - 1;
		$("#selectedTable").children().find("tr").each(function(){
			$(this).find("td:eq(" + selectedCol + ")").remove();
		});
	});

	/*Процедура нажатия на кнопку "html"
	Добавляет в конце документа выбранный фрагмент html (для добавления word/excel)*/
	$("#create-excel-table").on("click", function(){
		$("#last").removeAttr("id")
			.after("<div class = 'main-container' id = 'last' style = 'text-align: " + $(".active").attr("id") + "'>" +
				   "<div class = 'excel-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
					 "<div class = 'excel-container'></div>" +
					 "<label for='exampleFormControlFile1'>Выберите файл</label>" +
				   "<input class = 'form-control-file load-xml' name = 'load-img' type='file' accept='text/html'>" +
				   "</div>" +
				   "<div class = 'delete-button-container'>" +
				   "<button type='button' class='btn btn-link up-button'><i class='fas fa-angle-up'></i></button>" +
				   "<button type='button' class='btn btn-link down-button'><i class='fas fa-angle-down'></i></button>" +
				   "<button type='button' class='btn btn-link delete-button'><i class='far fa-trash-alt'></i></button>" +
				   "</div>" +
				   "</div>");
		//Добавляем прослушивание событий
		createExcelEventListener();
		containerEvents();
		createDeleteButtonEventListener();
	});

	/*Процедура загрузки стороннего html на сайт*/
	function createExcelEventListener(){
		$(".load-xml").each(function(){
			if(!checkEvent($(this), "change")){
				$(this).on("change", function(){
					let $input = $(this);
					let reader = new FileReader();
					reader.onload = function(){
						let $xml = $input.parent().children(".excel-container")[0];
						$($xml)
							.append(reader.result);
						$input.parent().children("label")[0].remove();
					}
					reader.readAsText(event.target.files[0]);
				});
			}
		});
	}
});

/*Процедура, проверяющая, является ли переменная num числовой*/
function isInteger(num){
	return (num ^ 0) == num;
}

/*Функция, принимающая на вход элемент и определяющая
список всех привязанных к нему событий*/
function eventsList(element){
	let events = element.data('events');
	if (events !== undefined)
		return events;

	events = $.data(element, 'events');
	if (events !== undefined)
		return events;

	events = $._data(element, 'events');
	if (events !== undefined)
		return events;

	events = $._data(element[0], 'events');
	if (events !== undefined)
		return events;

	return false;
}

/*Функция, принимающая на вход элемент и событие
Провреяет, првязано ли к этому элементу данное событие*/
function checkEvent(element, eventname){
	let events,
	ret = false;

	events = eventsList(element);
	if (events){
		$.each(events, function(evName, e){
			if (evName == eventname)
				ret = true;
		});
	}
	return ret;
}
