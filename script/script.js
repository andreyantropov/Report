window.onload = function () 
{
	/*Глобальные переменные*/
	let $selectedTable, $selectedCell;
	let buffer;
	
	/*Процедура нажатия на кнопку "Удалить"
	Выводит окно подтверждения операции. Если пользователь
	подтверждает удаление, то удаляет родительский элемент*/
	function createDeleteButtonEventListener()
	{
		$(".delete-button").each(function(){
			$(this).on("click", function(){
				if(confirm("Вы точно хотите удалить этот элемент?"))
					$(this).parent().parent().remove();
			});
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
		$("html, body").animate({scrollTop: 0}, 500);
	});
	
	/*Процедура нажатия на кнопку "Добавить текст"
	Добавляет в конце документа текстовое поле с заголовком*/
	$("#create-text").on("click", function(){				
		$("#clr")
			.before("<div class = 'main-container'>" +
					"<div class = 'text-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12' contenteditable>" +
					"<h2>*Введите заголовок*</h2>" +
					"<p>*Введите текст*</p>" +
					"</div>" +
					"<div class = 'delete-button-container'>" +
					"<button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>" +
					"</div>" +
				     "</div>");
		//Добавляем прослушивание событий
		createDeleteButtonEventListener();
	});
	
	/*Процедура нажатия на кнопку "Добавить картинку"
	Добавляет в конце документа текстовое поле с заголовком*/
	$("#create-image").on("click", function(){						  				
		$("#clr")
			.before("<div class = 'main-container'>" +
					"<div class = 'img-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
					"<input class = 'load-img' name = 'load-img' type='file' accept='image/*'>" +
					"<img>" +
					"</div>" +
					"<div class = 'delete-button-container'>" +
					"<button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>" +
					"</div>" +
					"</div>");
		//Добавляем прослушивание событий
		createImgEventListener();
		createDeleteButtonEventListener();
	});
	
	/*Процедура загрузки картинки на сайт*/
	function createImgEventListener(){
		$(".load-img").each(function(){
			$(this).on("change", function(){
				let $input = $(this);
				let reader = new FileReader();
				reader.onload = function(){
					let $img = $input.parent().children("img")[0];
					$img.src = reader.result;
					if(!$input.parent().children("p").length)
						$input.parent()
							.append("<p class = 'image-description' contentEditable>*Введите комментарий*</p>");
				}
				reader.readAsDataURL(event.target.files[0]);
			});
		});
	}
	
	/*Процедура нажатия на кнопку "Создать таблицу"
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
		let table = "<div class = 'main-container'>" +
					"<div class = 'table-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12' contenteditable>" +
					"<table class = 'table table-bordered'>" +
					"<thead class='thead-dark'>" +
					"<tr>";	
		for(i = 0; i < cols; i++)
			table += "<th scope='col'></th>";					 
		table += "</tr>" +
				 "</thead>" +
				 "<tbody>";				 
		for(i = 0; i < rows; i++){
			table += "<tr>";
			for(j = 0; j < cols; j++)
				table += "<td></td>";
			table += "</tr>";
		}				
		table += "</tbody>" +
				 "</table>" +
				 "</div>" +
				 "<div class = 'delete-button-container'>" + 
				 "<button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>" +
				 "</div>" +
				 "</div>";
		//Добавляем таблицу на страничку
		$("#clr")
			.before(table);			
		//Добавляем прослушивание событий
		createTableEventListener();
		createDeleteButtonEventListener();
	});
	
	/*Процедура, добавляющая пользовательское выпадающее
	меню в таблицы пользователя*/
	function createTableEventListener()
	{
		//Отображаем меню при нажатии ПКМ по таблице
		$("td, th").each(function(){
			$(this).on("contextmenu", function(ev){
				$selectedTable = $(this).parent().parent().parent();
				$selectedCell = $(this);
				
				ev.preventDefault();
				$("#menu").offset({top: ev.clientY + $(window).scrollTop(), left: ev.clientX});
			});
		});
	}
	
	/*Процедура, скрывающая выпадающее меню при нажатии ЛКМ*/
	$(document).on('click', function(){
		$("#menu").offset({top: -1000, left: -1000});
	});
	
	/*Процедура копирования данных в буфер обмена*/
	$("#copy").on("click", function(){
		buffer = $selectedCell.html();
	});
	
	/*Процедура вставки данных*/
	$("#paste").on("click", function(){
		$selectedCell
			.append(buffer);
	});
	
	/*Процедура добавления строки в таблицу*/
	$("#add-row").on("click", function(){
		let newRow;
		for(let i = 0; i < $selectedCell.parent().children().length; i++)
			newRow += "<td></td>";
		$selectedCell.parent()
			.after("<tr>" + newRow + "</tr>");
	});
	
	/*Процедура добавления столбца в таблицу*/
	$("#add-col").on("click", function(){
		let selectedCol = $selectedCell.parent().children().index($(this)) - 1;
		$selectedTable.find("tr").each(function(){
			let $newCell = $(this).find("td:eq(" + selectedCol + "), th:eq(" + selectedCol + ")").clone().empty();
			$(this).find("td:eq(" + selectedCol + "), th:eq(" + selectedCol + ")").after($newCell);
		});
	});
	
	/*Процедура удаления строки из таблицы*/
	$("#remove-row").on("click", function(){
		$selectedCell.parent().remove();
	});
	
	/*Процедура удаления столбца из таблицы*/
	$("#remove-col").on("click", function(){
		let selectedCol = $selectedCell.parent().children().index($(this)) - 1;
		$selectedTable.find("tr").each(function(){
			$(this).find("td:eq(" + selectedCol + "), th:eq(" + selectedCol + ")").remove();
		});
	});
	
	/*Процедура нажатия на кнопку "Добавить таблицу Excel"
	Добавляет в конце документа текстовое поле с заголовком*/
	$("#create-excel-table").on("click", function(){
		$("#clr")
			.before("<div class = 'main-container'>" +
					"<div class = 'excel-container col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12'>" +
					"<input class = 'load-xml' name = 'load-img' type='file' accept='text/html'>" +
					"<div class = 'excel-container'></div>" +
					"</div>" +
					"<div class = 'delete-button-container'>" +
					"<button name = 'delete-button' type='button' class='btn btn-link delete-button'>Удалить</button>" +
					"</div>" +
					"</div>");
		//Добавляем прослушивание событий
		createExcelEventListener();
		createDeleteButtonEventListener();
	});
	
	/*Процедура загрузки таблицы Excel на сайт*/
	function createExcelEventListener(){
		$(".load-xml").each(function(){
			$(this).on("change", function(){
				let $input = $(this);
				let reader = new FileReader();
				reader.onload = function(){
					let $xml = $input.parent().children(".excel-container")[0];
					$($xml)
						.append(reader.result);
				}
				reader.readAsText(event.target.files[0]);
			});
		});
	}
}

/*Процедура, проверяющая, является ли переменная num числовой*/
function isInteger(num) 
{
	return (num ^ 0) == num;
}


